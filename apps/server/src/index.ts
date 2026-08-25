import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { PrismaClient } from '@prisma/client';
import { createWorld, deserializeState, serializeState, Simulation } from '@novus/simulation-core';
import { uid, type AIMode, type SimulationState } from '@novus/shared';
import { AIRequestScheduler, InvalidAIConfigurationError, MockAIProvider, createAIProvider, resolveAIMode } from '@novus/ai';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';

process.env.DATABASE_URL ??= `file:${fileURLToPath(new URL('../prisma/novus.db',import.meta.url)).replaceAll('\\','/')}`;
const prisma=new PrismaClient();
const fastify=Fastify({logger:{level:process.env.NODE_ENV==='test'?'silent':'info'}});
await fastify.register(cors,{origin:true});await fastify.register(websocket);
const worldId='novus_primary';const seed=Number(process.env.NOVUS_SEED||78142);const population=Math.max(1,Math.min(25,Number(process.env.NOVUS_POPULATION||10)));
const requestedMode=resolveAIMode();let effectiveMode:AIMode=requestedMode;let provider;let scheduler:AIRequestScheduler|undefined;let configurationError:string|undefined;
try{provider=createAIProvider();if(requestedMode==='LIVING_MIND')scheduler=new AIRequestScheduler(provider)}catch(error){configurationError=error instanceof InvalidAIConfigurationError?error.message:String(error);fastify.log.error(configurationError);provider=new MockAIProvider();effectiveMode='MOCK'}

async function ensureSchema(){
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "World" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "seed" INTEGER NOT NULL, "width" INTEGER NOT NULL, "height" INTEGER NOT NULL, "state" TEXT NOT NULL, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Snapshot" ("id" TEXT NOT NULL PRIMARY KEY, "worldId" TEXT NOT NULL, "name" TEXT NOT NULL, "state" TEXT NOT NULL, "parentSnapshotId" TEXT, "tick" INTEGER NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Snapshot_worldId_createdAt_idx" ON "Snapshot"("worldId", "createdAt")`);
  await prisma.$executeRawUnsafe(`PRAGMA optimize`);
}
await ensureSchema();

async function loadState(){const saved=await prisma.world.findUnique({where:{id:worldId}});if(saved){try{return deserializeState(saved.state)}catch(error){fastify.log.error(error,'Uložený stav nelze přečíst; vytváří se nový svět')}}return createWorld(seed,population)}
const providerDetails=()=>({model:provider.model,endpoint:provider.endpoint,thinkingMode:provider.thinkingMode});
let simulation=new Simulation(await loadState(),seed,population,effectiveMode);simulation.setAIMode(effectiveMode,provider.name,!configurationError,providerDetails());if(configurationError)simulation.state.ai.lastError=configurationError;let lastSavedTick=simulation.state.tick;let lastBroadcast=0;let saving=false;const sockets=new Set<any>();

function scheduleLivingMind(){if(effectiveMode!=='LIVING_MIND'||!scheduler)return;for(const agent of simulation.state.agents){if(!simulation.decisionDue(agent)||scheduler.hasPending(agent.id))continue;const requestId=uid('ai_request',simulation.state.tick);const context=simulation.prepareLivingMindRequest(agent.id,requestId);if(!context)continue;agent.aiStatus='thinking';void scheduler.schedule({requestId,agentId:agent.id,requestedTick:context.requestTick,context,fallback:()=>simulation.fallbackDecision(agent.id)}).then(result=>{simulation.applyLivingMindDecision(result);broadcast()}).catch(error=>simulation.failLivingMindRequest(agent.id,requestId,error instanceof Error?error.message:String(error)))}}

async function persist(state=simulation.state){if(saving)return;saving=true;state.status='saving';try{await prisma.world.upsert({where:{id:worldId},create:{id:worldId,name:state.name,seed:state.seed,width:state.width,height:state.height,state:serializeState(state)},update:{name:state.name,seed:state.seed,width:state.width,height:state.height,state:serializeState(state)}});lastSavedTick=state.tick}finally{state.status=state.paused?'paused':'running';saving=false}}
function clientState(state:SimulationState){return state}
function broadcast(){const payload=JSON.stringify({type:'state',payload:clientState(simulation.state)});for(const socket of sockets){if(socket.readyState===1)socket.send(payload)}}

fastify.get('/health',async()=>({ok:true,tick:simulation.state.tick,mode:simulation.state.ai.mode,provider:simulation.state.ai.provider,model:simulation.state.ai.model,endpoint:simulation.state.ai.endpoint,thinkingMode:simulation.state.ai.thinkingMode,configured:simulation.state.ai.configured,pending:simulation.state.ai.pending,lastRequestLatencyMs:simulation.state.ai.lastRequestLatencyMs,savedTick:lastSavedTick}));
fastify.get('/api/state',async()=>clientState(simulation.state));
fastify.get('/api/snapshots',async()=>prisma.snapshot.findMany({where:{worldId},select:{id:true,name:true,tick:true,parentSnapshotId:true,createdAt:true},orderBy:{createdAt:'desc'}}));
fastify.post('/api/control',async(request,reply)=>{const parsed=z.object({paused:z.boolean().optional(),speed:z.union([z.literal(1),z.literal(2),z.literal(5),z.literal(10)]).optional()}).safeParse(request.body);if(!parsed.success)return reply.code(400).send({error:'Neplatné ovládání simulace'});simulation.settings(parsed.data);broadcast();return {ok:true,paused:simulation.state.paused,speed:simulation.state.speed}});
fastify.post('/api/snapshots',async(request,reply)=>{const parsed=z.object({name:z.string().min(1).max(80),parentSnapshotId:z.string().nullable().optional()}).safeParse(request.body);if(!parsed.success)return reply.code(400).send({error:'Je vyžadován krátký název snímku'});await persist();const snap=await prisma.snapshot.create({data:{id:`snapshot_${Date.now()}`,worldId,name:parsed.data.name,parentSnapshotId:parsed.data.parentSnapshotId||null,tick:simulation.state.tick,state:serializeState(simulation.state)}});return {id:snap.id,name:snap.name,tick:snap.tick}});
fastify.post('/api/reset',async(request,reply)=>{const parsed=z.object({seed:z.number().int().optional(),population:z.number().int().min(1).max(25).optional()}).safeParse(request.body||{});if(!parsed.success)return reply.code(400).send({error:'Neplatné nastavení světa'});simulation=new Simulation(undefined,parsed.data.seed||seed,parsed.data.population||population,effectiveMode);simulation.setAIMode(effectiveMode,provider.name,!configurationError,providerDetails());if(configurationError)simulation.state.ai.lastError=configurationError;await persist();broadcast();return {ok:true}});
fastify.get('/live',{websocket:true},socket=>{sockets.add(socket);socket.send(JSON.stringify({type:'state',payload:clientState(simulation.state)}));socket.on('close',()=>sockets.delete(socket));});

const timer=setInterval(()=>{if(!simulation.state.paused){for(let i=0;i<simulation.state.speed;i++)simulation.tick();scheduleLivingMind()}const now=Date.now();if(now-lastBroadcast>900){broadcast();lastBroadcast=now}if(simulation.state.tick-lastSavedTick>=40)void persist()},250);
const shutdown=async()=>{clearInterval(timer);await persist();await prisma.$disconnect();await fastify.close();process.exit(0)};process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
await fastify.listen({port:Number(process.env.PORT||3001),host:'0.0.0.0'});

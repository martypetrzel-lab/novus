import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { Decision, MindDecisionContext } from '@novus/shared';
import { AIRequestScheduler, OpenAICompatibleProvider, decisionSchema, isQwenCompatibleModel, resolveAIMode, resolveThinkingMode, type AIProvider, type AIProviderResult } from './index';

const decision:Decision={thought_summary:'Zvažuje svou zkušenost.',current_intention:'Pokračovat v pozorování.',action:{type:'WAIT'},speech:null};
const context={requestTick:10,identity:{name:'Nara',age:22,biography:'',temperament:'',identityDevelopments:[],recentFailures:[],recentSuccesses:[],knownConcepts:[]},currentSituation:{location:{x:1,y:1},time:'ráno',weather:'clear',activity:'Pozoruje',sensations:[]},perception:{tick:10,location:{x:1,y:1},approximateTime:'ráno',weather:'clear',terrain:['grass'],objects:[],people:[],structures:[],sounds:[],sensations:[],observations:[]},relevantMemories:[],relevantBeliefs:[],motivations:[],unresolvedQuestions:[],nearbyPeople:[],recentPersonalHistory:[],currentIntention:'Pozorovat',intentionSinceTick:0,recentActionPattern:''} satisfies MindDecisionContext;

class DelayedProvider implements AIProvider {
  readonly name='test';readonly model='test-model';readonly endpoint='';readonly thinkingMode='auto' as const;active=0;maxActive=0;
  constructor(private delay=10,private fail=false){}
  async generateDecision():Promise<AIProviderResult>{this.active++;this.maxActive=Math.max(this.maxActive,this.active);try{await new Promise(resolve=>setTimeout(resolve,this.delay));if(this.fail)throw new Error('invalid structured output');return {decision}}finally{this.active--}}
  async generateReflection(){return 'Reflexe'}async generateMemoryConsolidation(){return 'Vzpomínka'}
}

let endpoint='';let localServer:Server;let received:Array<{authorization?:string;model?:string;prompt:string}>=[];
beforeAll(async()=>{localServer=createServer((request,response)=>{let body='';request.on('data',chunk=>body+=chunk);request.on('end',()=>{const parsed=JSON.parse(body) as {model?:string;messages?:Array<{role:string;content:string}>};const prompt=parsed.messages?.find(message=>message.role==='user')?.content||'';received.push({authorization:request.headers.authorization,model:parsed.model,prompt});const content=prompt.includes('"reflection"')?JSON.stringify({reflection:'Stručná reflexe.'}):prompt.includes('"memory"')?JSON.stringify({memory:'Nejistá souvislost.'}):JSON.stringify(decision);response.writeHead(200,{'content-type':'application/json'});response.end(JSON.stringify({choices:[{message:{content}}],usage:{prompt_tokens:17,completion_tokens:9}}))})});await new Promise<void>(resolve=>localServer.listen(0,'127.0.0.1',resolve));const address=localServer.address();if(!address||typeof address==='string')throw new Error('Mock endpoint se nespustil');endpoint=`http://127.0.0.1:${address.port}/v1`});
afterAll(async()=>new Promise<void>((resolve,reject)=>localServer.close(error=>error?reject(error):resolve())));
beforeEach(()=>{received=[]});

const localProvider=(model='Qwen3-8B',thinkingMode:'off'|'auto'|'on'='auto')=>new OpenAICompatibleProvider({baseUrl:endpoint,apiKey:'local',model,timeoutMs:1000,maxRetries:0,thinkingMode});

describe('Living Mind AI infrastructure',()=>{
  it('switches explicitly between MOCK and LIVING_MIND',()=>{expect(resolveAIMode({})).toBe('MOCK');expect(resolveAIMode({AI_MODE:'LIVING_MIND'})).toBe('LIVING_MIND');expect(resolveAIMode({AI_MODE:'unknown'})).toBe('MOCK')});
  it('defaults thinking mode to auto and detects Qwen model names',()=>{expect(resolveThinkingMode()).toBe('auto');expect(resolveThinkingMode('invalid')).toBe('auto');expect(isQwenCompatibleModel('Qwen3-8B')).toBe(true);expect(isQwenCompatibleModel('bartowski/Qwen_Qwen3-8B')).toBe(true);expect(isQwenCompatibleModel('Mistral-7B')).toBe(false)});
  it('validates structured decisions',()=>{expect(decisionSchema.safeParse(decision).success).toBe(true);expect(decisionSchema.safeParse({action:{type:'EXECUTE_CODE'}}).success).toBe(false)});
  it('runs LIVING_MIND decisions against a local OpenAI-compatible endpoint with the local key',async()=>{const result=await localProvider().generateDecision(context);expect(result.decision).toEqual(decision);expect(result.usage).toMatchObject({inputTokens:17,outputTokens:9,model:'Qwen3-8B'});expect(received[0]).toMatchObject({authorization:'Bearer local',model:'Qwen3-8B'})});
  it('adds /no_think to ordinary Qwen decisions in auto mode',async()=>{await localProvider().generateDecision(context);expect(received[0].prompt.endsWith('/no_think')).toBe(true)});
  it('adds /think to Qwen reflections in auto mode',async()=>{await localProvider().generateReflection(context,'Pokus přinesl nečekaný výsledek.');expect(received[0].prompt.endsWith('/think')).toBe(true)});
  it('uses /think for Qwen memory consolidation in auto mode',async()=>{await localProvider().generateMemoryConsolidation(context);expect(received[0].prompt.endsWith('/think')).toBe(true)});
  it('respects explicit off and on thinking modes for Qwen',async()=>{await localProvider('Qwen3-8B','off').generateReflection(context,'Výsledek.');expect(received[0].prompt.endsWith('/no_think')).toBe(true);received=[];await localProvider('Qwen3-8B','on').generateDecision(context);expect(received[0].prompt.endsWith('/think')).toBe(true)});
  it('does not add Qwen thinking tags to other compatible models',async()=>{await localProvider('Mistral-7B').generateDecision(context);expect(received[0].prompt).not.toMatch(/\/(?:no_)?think/)});
  it('bounds request concurrency',async()=>{const provider=new DelayedProvider(15);const scheduler=new AIRequestScheduler(provider,{maxConcurrency:2,timeoutMs:500,maxQueue:10});await Promise.all(['a','b','c','d'].map(agentId=>scheduler.schedule({agentId,requestedTick:10,context,fallback:()=>decision})));expect(provider.maxActive).toBe(2);expect(scheduler.pendingCount).toBe(0)});
  it('allows only one pending decision per agent',async()=>{const scheduler=new AIRequestScheduler(new DelayedProvider(20),{maxConcurrency:1,timeoutMs:500,maxQueue:10});const first=scheduler.schedule({agentId:'a',requestedTick:10,context,fallback:()=>decision});await expect(scheduler.schedule({agentId:'a',requestedTick:10,context,fallback:()=>decision})).rejects.toThrow('already has a pending decision');await first});
  it('falls back after provider timeout without blocking the queue',async()=>{const scheduler=new AIRequestScheduler(new DelayedProvider(100),{maxConcurrency:1,timeoutMs:10,maxQueue:10});const result=await scheduler.schedule({agentId:'a',requestedTick:10,context,fallback:()=>decision});expect(result.fallback).toBe(true);expect(result.error).toContain('timeout')});
  it('falls back when structured provider output is invalid',async()=>{const scheduler=new AIRequestScheduler(new DelayedProvider(1,true),{maxConcurrency:1,timeoutMs:100,maxQueue:10});const result=await scheduler.schedule({agentId:'a',requestedTick:10,context,fallback:()=>decision});expect(result.fallback).toBe(true);expect(result.decision).toEqual(decision)});
});

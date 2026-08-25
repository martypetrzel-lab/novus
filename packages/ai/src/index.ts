import { z } from 'zod';
import { DEFAULT_LOCALE, simulationCs, uid, type AIMode, type Decision, type MindDecisionContext } from '@novus/shared';

export const AI_LANGUAGE=process.env.AI_LANGUAGE||DEFAULT_LOCALE;
export const NEUTRAL_AGENT_PROMPT=`Existuješ nepřetržitě v trvalém světě společně s dalšími autonomními obyvateli. Pozorovatel tě neovládá a nemáš přidělené poslání. Rozhoduj se pouze podle poskytnutého osobního kontextu; neznáš globální stav světa. Tvé zkušenosti, vzpomínky, otázky a přesvědčení patří jen tobě a mohou být mylné. Zachovej kontinuitu své osobnosti a záměru, ale postupně se měň podle prožitých událostí. Nevytvářej společenské role ani instituce. Vrať pouze stručné pozorovatelské shrnutí, nikoli skrytý řetězec úvah. Mluv a piš přirozenou češtinou (${AI_LANGUAGE}).`;

const actionSchema=z.object({type:z.enum(['WAIT','MOVE','SPEAK','INSPECT','PICK_UP','DROP','GATHER','PLACE','BUILD','USE','CRAFT_EXPERIMENT','GIVE','TAKE','WRITE','READ']),target:z.object({x:z.number(),y:z.number()}).optional(),objectId:z.string().optional(),description:z.string().max(500).optional(),targetAgentId:z.string().optional(),speech:z.string().max(500).optional()});
export const decisionSchema=z.object({thought_summary:z.string().min(1).max(700),current_intention:z.string().min(1).max(700),action:actionSchema,speech:z.string().max(500).nullable(),reason_for_change:z.string().max(500).optional(),question:z.string().max(500).optional(),expected_outcome:z.string().max(500).optional()});

export interface AIUsage { inputTokens:number; outputTokens:number; model:string; }
export interface AIProviderResult { decision:Decision; usage?:AIUsage; }
export interface AIProvider { readonly name:string; readonly model:string; generateDecision(context:MindDecisionContext,signal?:AbortSignal):Promise<AIProviderResult>; generateReflection(context:MindDecisionContext,result:string,signal?:AbortSignal):Promise<string>; generateMemoryConsolidation(context:MindDecisionContext,signal?:AbortSignal):Promise<string>; }

export class InvalidAIConfigurationError extends Error {}
export function resolveAIMode(env:NodeJS.ProcessEnv=process.env):AIMode{return env.AI_MODE?.toUpperCase()==='LIVING_MIND'?'LIVING_MIND':'MOCK'}
export function isLivingMindConfigured(env:NodeJS.ProcessEnv=process.env){return resolveAIMode(env)==='LIVING_MIND'&&Boolean(env.AI_BASE_URL&&env.AI_API_KEY&&env.AI_MODEL)}

export class MockAIProvider implements AIProvider {
  readonly name='mock';readonly model='deterministic-cognitive-core';
  async generateDecision():Promise<AIProviderResult>{return {decision:{thought_summary:simulationCs.ai.mockThought,current_intention:simulationCs.ai.mockIntention,action:{type:'WAIT'},speech:null}}}
  async generateReflection(_:MindDecisionContext,result:string){return simulationCs.ai.reflection(result)}
  async generateMemoryConsolidation(context:MindDecisionContext){return context.relevantMemories.slice(-3).map(memory=>memory.text).join(' ')}
}

interface OpenAIConfig { baseUrl:string;apiKey:string;model:string;timeoutMs:number;maxRetries:number }
export class OpenAICompatibleProvider implements AIProvider {
  readonly name='openai-compatible';readonly model:string;
  constructor(private config:OpenAIConfig={baseUrl:process.env.AI_BASE_URL||'',apiKey:process.env.AI_API_KEY||'',model:process.env.AI_MODEL||'',timeoutMs:Number(process.env.AI_TIMEOUT_MS||20000),maxRetries:2}){this.model=config.model;if(!config.baseUrl||!config.apiKey||!config.model)throw new InvalidAIConfigurationError('LIVING_MIND vyžaduje AI_BASE_URL, AI_API_KEY a AI_MODEL.')}
  private async request(prompt:string,signal?:AbortSignal){let last:unknown;for(let attempt=0;attempt<=this.config.maxRetries;attempt++){try{const response=await fetch(`${this.config.baseUrl.replace(/\/$/,'')}/chat/completions`,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${this.config.apiKey}`},body:JSON.stringify({model:this.config.model,response_format:{type:'json_object'},messages:[{role:'system',content:NEUTRAL_AGENT_PROMPT},{role:'user',content:prompt}]}),signal});if(!response.ok)throw new Error(`AI HTTP ${response.status}`);const json=await response.json() as {choices?:Array<{message?:{content?:string}}> ;usage?:{prompt_tokens?:number;completion_tokens?:number}};return {content:String(json.choices?.[0]?.message?.content||''),usage:{inputTokens:json.usage?.prompt_tokens||0,outputTokens:json.usage?.completion_tokens||0,model:this.model}}}catch(error){last=error;if(signal?.aborted)throw error;if(attempt<this.config.maxRetries)await new Promise(resolve=>setTimeout(resolve,250*2**attempt))}}throw last}
  async generateDecision(context:MindDecisionContext,signal?:AbortSignal){const response=await this.request(`Osobní kontext obyvatele:\n${JSON.stringify(context)}\nVrať JSON podle struktury {thought_summary,current_intention,action,speech,reason_for_change?,question?,expected_outcome?}. Zachovej současný záměr, pokud nemáš konkrétní důvod ke změně.`,signal);return {decision:decisionSchema.parse(JSON.parse(response.content)),usage:response.usage}}
  async generateReflection(context:MindDecisionContext,result:string,signal?:AbortSignal){const response=await this.request(`Vrať JSON {"reflection":"stručná česká reflexe"}. Výsledek: ${result}. Kontext: ${JSON.stringify({identity:context.identity,currentIntention:context.currentIntention,relevantMemories:context.relevantMemories})}`,signal);const parsed=z.object({reflection:z.string().max(700)}).parse(JSON.parse(response.content));return parsed.reflection}
  async generateMemoryConsolidation(context:MindDecisionContext,signal?:AbortSignal){const response=await this.request(`Vrať JSON {"memory":"stručné nejisté osobní zobecnění v češtině"}. Epizody: ${JSON.stringify(context.relevantMemories)}`,signal);return z.object({memory:z.string().max(700)}).parse(JSON.parse(response.content)).memory}
}

export interface ScheduledDecision { requestId:string;agentId:string;requestedTick:number;decision:Decision;provider:string;model:string;latencyMs:number;usage?:AIUsage;fallback:boolean;error?:string; }
export interface ScheduleInput { requestId?:string;agentId:string;requestedTick:number;context:MindDecisionContext;fallback:()=>Decision; }
interface QueueItem extends ScheduleInput { requestId:string;resolve:(result:ScheduledDecision)=>void }
export class AIRequestScheduler {
  private queue:QueueItem[]=[];private pending=new Set<string>();private active=0;
  constructor(readonly provider:AIProvider,readonly options={maxConcurrency:Math.max(1,Number(process.env.AI_MAX_CONCURRENCY||2)),timeoutMs:Math.max(100,Number(process.env.AI_TIMEOUT_MS||20000)),maxQueue:100}){}
  hasPending(agentId:string){return this.pending.has(agentId)} get pendingCount(){return this.pending.size} get activeCount(){return this.active}
  schedule(input:ScheduleInput):Promise<ScheduledDecision>{if(this.pending.has(input.agentId))return Promise.reject(new Error(`Agent ${input.agentId} already has a pending decision`));if(this.queue.length>=this.options.maxQueue)return Promise.reject(new Error('AI request queue is full'));const requestId=input.requestId||uid('ai',input.requestedTick);this.pending.add(input.agentId);return new Promise(resolve=>{this.queue.push({...input,requestId,resolve});this.drain()})}
  private drain(){while(this.active<this.options.maxConcurrency&&this.queue.length){const item=this.queue.shift()!;this.active++;void this.run(item).then(item.resolve).finally(()=>{this.active--;this.pending.delete(item.agentId);this.drain()})}}
  private async run(item:QueueItem):Promise<ScheduledDecision>{const started=Date.now();const controller=new AbortController();let timer:ReturnType<typeof setTimeout>|undefined;try{const timeout=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('AI request timeout'))},this.options.timeoutMs)});const result=await Promise.race([this.provider.generateDecision(item.context,controller.signal),timeout]);return {requestId:item.requestId,agentId:item.agentId,requestedTick:item.requestedTick,decision:result.decision,provider:this.provider.name,model:this.provider.model,latencyMs:Date.now()-started,usage:result.usage,fallback:false}}catch(error){return {requestId:item.requestId,agentId:item.agentId,requestedTick:item.requestedTick,decision:item.fallback(),provider:this.provider.name,model:this.provider.model,latencyMs:Date.now()-started,fallback:true,error:error instanceof Error?error.message:String(error)}}finally{if(timer)clearTimeout(timer)}}
}

export function createAIProvider(env:NodeJS.ProcessEnv=process.env):AIProvider{return resolveAIMode(env)==='LIVING_MIND'?new OpenAICompatibleProvider({baseUrl:env.AI_BASE_URL||'',apiKey:env.AI_API_KEY||'',model:env.AI_MODEL||'',timeoutMs:Number(env.AI_TIMEOUT_MS||20000),maxRetries:2}):new MockAIProvider()}

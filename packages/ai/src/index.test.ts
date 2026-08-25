import { describe, expect, it } from 'vitest';
import type { Decision, MindDecisionContext } from '@novus/shared';
import { AIRequestScheduler, decisionSchema, resolveAIMode, type AIProvider, type AIProviderResult } from './index';

const decision:Decision={thought_summary:'Zvažuje svou zkušenost.',current_intention:'Pokračovat v pozorování.',action:{type:'WAIT'},speech:null};
const context={requestTick:10,identity:{name:'Nara',age:22,biography:'',temperament:'',identityDevelopments:[],recentFailures:[],recentSuccesses:[],knownConcepts:[]},currentSituation:{location:{x:1,y:1},time:'ráno',weather:'clear',activity:'Pozoruje',sensations:[]},perception:{tick:10,location:{x:1,y:1},approximateTime:'ráno',weather:'clear',terrain:['grass'],objects:[],people:[],structures:[],sounds:[],sensations:[],observations:[]},relevantMemories:[],relevantBeliefs:[],motivations:[],unresolvedQuestions:[],nearbyPeople:[],recentPersonalHistory:[],currentIntention:'Pozorovat',intentionSinceTick:0,recentActionPattern:''} satisfies MindDecisionContext;

class DelayedProvider implements AIProvider {
  readonly name='test';readonly model='test-model';active=0;maxActive=0;
  constructor(private delay=10,private fail=false){}
  async generateDecision():Promise<AIProviderResult>{this.active++;this.maxActive=Math.max(this.maxActive,this.active);try{await new Promise(resolve=>setTimeout(resolve,this.delay));if(this.fail)throw new Error('invalid structured output');return {decision}}finally{this.active--}}
  async generateReflection(){return 'Reflexe'}async generateMemoryConsolidation(){return 'Vzpomínka'}
}

describe('Living Mind AI infrastructure',()=>{
  it('switches explicitly between MOCK and LIVING_MIND',()=>{expect(resolveAIMode({})).toBe('MOCK');expect(resolveAIMode({AI_MODE:'LIVING_MIND'})).toBe('LIVING_MIND');expect(resolveAIMode({AI_MODE:'unknown'})).toBe('MOCK')});
  it('validates structured decisions',()=>{expect(decisionSchema.safeParse(decision).success).toBe(true);expect(decisionSchema.safeParse({action:{type:'EXECUTE_CODE'}}).success).toBe(false)});
  it('bounds request concurrency',async()=>{const provider=new DelayedProvider(15);const scheduler=new AIRequestScheduler(provider,{maxConcurrency:2,timeoutMs:500,maxQueue:10});await Promise.all(['a','b','c','d'].map(agentId=>scheduler.schedule({agentId,requestedTick:10,context,fallback:()=>decision})));expect(provider.maxActive).toBe(2);expect(scheduler.pendingCount).toBe(0)});
  it('allows only one pending decision per agent',async()=>{const scheduler=new AIRequestScheduler(new DelayedProvider(20),{maxConcurrency:1,timeoutMs:500,maxQueue:10});const first=scheduler.schedule({agentId:'a',requestedTick:10,context,fallback:()=>decision});await expect(scheduler.schedule({agentId:'a',requestedTick:10,context,fallback:()=>decision})).rejects.toThrow('already has a pending decision');await first});
  it('falls back after provider timeout without blocking the queue',async()=>{const scheduler=new AIRequestScheduler(new DelayedProvider(100),{maxConcurrency:1,timeoutMs:10,maxQueue:10});const result=await scheduler.schedule({agentId:'a',requestedTick:10,context,fallback:()=>decision});expect(result.fallback).toBe(true);expect(result.error).toContain('timeout')});
  it('falls back when structured provider output is invalid',async()=>{const scheduler=new AIRequestScheduler(new DelayedProvider(1,true),{maxConcurrency:1,timeoutMs:100,maxQueue:10});const result=await scheduler.schedule({agentId:'a',requestedTick:10,context,fallback:()=>decision});expect(result.fallback).toBe(true);expect(result.decision).toEqual(decision)});
});

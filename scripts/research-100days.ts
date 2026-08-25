import { AIRequestScheduler, createAIProvider, resolveAIMode } from '@novus/ai';
import { uid } from '@novus/shared';
import { createWorld, Simulation } from '@novus/simulation-core';

const mode=resolveAIMode();
const days=Math.max(1,Number(process.env.NOVUS_RESEARCH_DAYS||(mode==='MOCK'?100:1)));
const population=Math.max(1,Math.min(25,Number(process.env.NOVUS_RESEARCH_POPULATION||10)));
const simulation=new Simulation(createWorld(Number(process.env.NOVUS_SEED||78142),population),78142,population,mode);
const starts=new Map(simulation.state.agents.map(agent=>[agent.id,{x:agent.x,y:agent.y,distance:0}]));
const pending=new Set<Promise<unknown>>();
let scheduler:AIRequestScheduler|undefined;
if(mode==='LIVING_MIND'){const provider=createAIProvider();scheduler=new AIRequestScheduler(provider);simulation.setAIMode(mode,provider.name,true,{model:provider.model,endpoint:provider.endpoint,thinkingMode:provider.thinkingMode})}

for(let tick=0;tick<days*240;tick++){
  const before=new Map(simulation.state.agents.map(agent=>[agent.id,{x:agent.x,y:agent.y}]));
  simulation.tick();
  for(const agent of simulation.state.agents){const previous=before.get(agent.id)!;starts.get(agent.id)!.distance+=Math.hypot(agent.x-previous.x,agent.y-previous.y)}
  if(scheduler)for(const agent of simulation.state.agents){if(!simulation.decisionDue(agent)||scheduler.hasPending(agent.id))continue;const requestId=uid('research_ai',simulation.state.tick);const context=simulation.prepareLivingMindRequest(agent.id,requestId);if(!context)continue;const job=scheduler.schedule({requestId,agentId:agent.id,requestedTick:context.requestTick,context,fallback:()=>simulation.fallbackDecision(agent.id)}).then(result=>simulation.applyLivingMindDecision(result)).finally(()=>pending.delete(job));pending.add(job)}
  if(scheduler&&tick%10===0)await new Promise(resolve=>setTimeout(resolve,0));
}
await Promise.allSettled([...pending]);

console.log(`NOVUS — výzkumný běh: ${days} dní, režim ${mode}`);
console.table(simulation.state.agents.map(agent=>({Agent:agent.name,Actions:agent.actionHistory.length,Distance:Math.round(starts.get(agent.id)!.distance),Conversations:agent.conversations.length,Experiments:simulation.state.experiments.filter(experiment=>experiment.agentId===agent.id).length,Memories:agent.memories.length,Beliefs:agent.beliefs.length,Questions:agent.questions.length,Reflections:agent.reflections.length,'Known concepts':agent.namedConcepts.length})));
console.log(JSON.stringify({tick:simulation.state.tick,mode:simulation.state.ai.mode,ai:simulation.state.ai.totals,research:simulation.state.ai.research,experiences:simulation.state.experiences.length},null,2));

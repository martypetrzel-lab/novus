import { simulationCs, type Agent, type Belief, type Decision, type Memory, type Perception, type SimulationState } from '@novus/shared';

const words=(text:string)=>new Set(text.toLowerCase().match(/[a-z]{3,}/g)||[]);
export class PerceptionProcessor {
  build(state:SimulationState,agent:Agent,radius=12):Perception{
    const near=(x:number,y:number)=>Math.hypot(agent.x-x,agent.y-y)<=radius;
    const tileAt=(x:number,y:number)=>state.tiles[y*state.width+x];
    const terrain:string[]=[]; for(let y=Math.max(0,agent.y-3);y<=Math.min(state.height-1,agent.y+3);y++) for(let x=Math.max(0,agent.x-3);x<=Math.min(state.width-1,agent.x+3);x++) terrain.push(tileAt(x,y)?.type);
    return {tick:state.tick,location:{x:agent.x,y:agent.y},approximateTime:state.hour<6?'before dawn':state.hour<12?'morning':state.hour<18?'afternoon':'night',weather:state.weather,
      terrain:[...new Set(terrain)],objects:state.objects.filter(o=>near(o.x,o.y)).slice(0,30),people:state.agents.filter(a=>a.id!==agent.id&&near(a.x,a.y)).map(a=>({id:a.id,name:a.name,x:a.x,y:a.y,activity:a.activity})),
      structures:state.structures.filter(s=>near(s.x,s.y)),sounds:state.events.slice(-12).filter(e=>e.agentIds.some(id=>id!==agent.id)).map(e=>e.text).slice(-4),sensations:agent.sensations,observations:agent.recentObservations.slice(-6)};
  }
}
export class MemoryRetriever {
  retrieve(agent:Agent,perception:Perception,limit=8):Memory[]{
    const context=words([agent.intention,...perception.objects.map(o=>o.description),...perception.people.map(p=>p.name)].join(' '));
    return [...agent.memories].map(m=>{const overlap=[...words(m.text)].filter(w=>context.has(w)).length;const recency=1/(1+Math.max(0,perception.tick-m.tick)/200);const participant=m.participants.some(id=>perception.people.some(p=>p.id===id))?2:0;const location=Math.hypot(m.location.x-agent.x,m.location.y-agent.y)<8?1:0;return {m,score:overlap+recency+m.importance*2+participant+location};}).sort((a,b)=>b.score-a.score).slice(0,limit).map(v=>v.m);
  }
}
export class BeliefSystem { relevant(agent:Agent,memories:Memory[],limit=6):Belief[]{const key=words(memories.map(m=>m.text).join(' '));return [...agent.beliefs].sort((a,b)=>[...words(b.statement)].filter(w=>key.has(w)).length-[...words(a.statement)].filter(w=>key.has(w)).length||b.updatedTick-a.updatedTick).slice(0,limit)} }
export class MotivationEngine {
  update(agent:Agent,perception:Perception){
    agent.motivations=agent.motivations.map(m=>({...m,strength:Math.max(.05,m.strength-.005)})).filter(m=>m.strength>.08);
    if(agent.hunger>.64&&!agent.motivations.some(m=>m.source==='sensation')) agent.motivations.push({id:`mot_hunger_${perception.tick}`,text:simulationCs.cognition.hungerMotivation,strength:.75,source:'sensation',createdTick:perception.tick});
    if(perception.people.length&&agent.conversations.length===0) agent.motivations.push({id:`mot_person_${perception.tick}`,text:simulationCs.cognition.learnFrom(perception.people[0].name),strength:.48,source:'social curiosity',createdTick:perception.tick});
    return agent.motivations.sort((a,b)=>b.strength-a.strength).slice(0,5);
  }
}
export class CuriosityEngine {
  generate(agent:Agent,perception:Perception,repetitive:boolean){
    if(repetitive&&agent.questions.length) return simulationCs.cognition.revisitQuestion(agent.questions[0]);
    const unfamiliar=perception.objects.find(o=>!agent.memories.some(m=>m.text.includes(o.kind)));
    if(unfamiliar) return simulationCs.cognition.inspectCuriosity(unfamiliar.description);
    if(agent.recentObservations.some(o=>o.includes('nečekaně')||o.includes('unexpected'))) return simulationCs.cognition.contradiction;
    return null;
  }
}
export class DecisionActor {
  propose(agent:Agent,perception:Perception,curiosity:string|null,random:()=>number):Decision{
    const nearby=perception.objects.sort((a,b)=>Math.hypot(agent.x-a.x,agent.y-a.y)-Math.hypot(agent.x-b.x,agent.y-b.y)); const person=perception.people[Math.floor(random()*Math.max(1,perception.people.length))];
    if(curiosity&&nearby[0]&&random()<.34) return {thought_summary:curiosity,current_intention:curiosity,action:{type:'INSPECT',target:{x:nearby[0].x,y:nearby[0].y},objectId:nearby[0].id},speech:null};
    if(person&&agent.inventory.length&&random()<.09) return {thought_summary:simulationCs.cognition.giftThought(person.name),current_intention:simulationCs.cognition.giftIntention(person.name),action:{type:'GIVE',targetAgentId:person.id},speech:null};
    if(person&&random()<.34) return {thought_summary:simulationCs.cognition.socialThought(person.name),current_intention:simulationCs.cognition.socialIntention(person.name),action:{type:'SPEAK',targetAgentId:person.id,speech:simulationCs.speech},speech:simulationCs.speech};
    if(agent.inventory.length>=2&&random()<.38) return {thought_summary:simulationCs.cognition.experimentThought,current_intention:simulationCs.cognition.experimentIntention,action:{type:'CRAFT_EXPERIMENT',description:simulationCs.cognition.combine(agent.inventory.slice(0,2).map(i=>i.kind).join(' a '))},speech:null};
    if(agent.inventory.some(i=>i.kind==='branch')&&random()<.3) return {thought_summary:simulationCs.cognition.buildThought,current_intention:simulationCs.cognition.buildIntention,action:{type:'BUILD',target:{x:agent.x+1,y:agent.y},description:simulationCs.unnamedCover},speech:null};
    if(agent.beliefs.length&&random()<.06) return {thought_summary:simulationCs.cognition.writeThought,current_intention:simulationCs.cognition.writeIntention,action:{type:'WRITE',description:agent.beliefs.at(-1)?.statement},speech:null};
    if(nearby[0]&&random()<.48) return {thought_summary:simulationCs.cognition.gatherThought(nearby[0].kind),current_intention:simulationCs.cognition.gatherIntention(nearby[0].kind),action:{type:'GATHER',target:{x:nearby[0].x,y:nearby[0].y},objectId:nearby[0].id},speech:null};
    const angle=random()*Math.PI*2,dist=5+Math.floor(random()*14);return {thought_summary:simulationCs.cognition.wanderThought,current_intention:simulationCs.cognition.wanderIntention,action:{type:'MOVE',target:{x:Math.round(agent.x+Math.cos(angle)*dist),y:Math.round(agent.y+Math.sin(angle)*dist)}},speech:null};
  }
}
export class DecisionCritic { review(agent:Agent,decision:Decision,memories:Memory[]){if(decision.action.type==='BUILD'&&memories.some(m=>m.text.includes('selhalo')||m.text.includes('collapsed'))) return simulationCs.cognition.criticCollapse;if(decision.action.type==='MOVE'&&agent.fatigue>.82)return simulationCs.cognition.criticFatigue;return null} }
export class ReflectionEngine { shouldReflect(agent:Agent,result:string,tick:number){return tick-agent.lastReflectionTick>90&&/(selhal|nečekan|naučil|zran|failed|unexpected|learned|injured)/i.test(result)} summarize(agent:Agent,result:string){return simulationCs.cognition.reflection(result)} }
export class IdentityManager { evolve(agent:Agent,reflection:string){if((reflection.includes('selhal')||reflection.includes('failed'))&&!agent.character.includes('opatr')) agent.character+=simulationCs.cognition.identityCaution;} }

export class CognitiveCore {
  perception=new PerceptionProcessor(); memory=new MemoryRetriever(); beliefs=new BeliefSystem(); motivation=new MotivationEngine(); curiosity=new CuriosityEngine(); actor=new DecisionActor(); critic=new DecisionCritic(); reflection=new ReflectionEngine(); identity=new IdentityManager();
  decide(state:SimulationState,agent:Agent,random:()=>number,repetitive=false){const p=this.perception.build(state,agent);const m=this.memory.retrieve(agent,p);const b=this.beliefs.relevant(agent,m);this.motivation.update(agent,p);const c=this.curiosity.generate(agent,p,repetitive);const d=this.actor.propose(agent,p,c,random);const review=this.critic.review(agent,d,m);if(review){d.thought_summary+=` Kritika: ${review}`;if(agent.fatigue>.82)d.action={type:'WAIT',description:simulationCs.cognition.waitAndReconsider};}return {perception:p,memories:m,beliefs:b,decision:d,critic:review};}
}

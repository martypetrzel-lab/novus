export type TileType = 'grass'|'dirt'|'fertile'|'sand'|'shallow_water'|'deep_water'|'rock';
export type Weather = 'clear'|'cloudy'|'rain';
export type EventCategory = 'Communication'|'Experimentation'|'Construction'|'Discovery'|'Social'|'Health'|'Movement'|'Other';
export type ActionType = 'WAIT'|'MOVE'|'SPEAK'|'INSPECT'|'PICK_UP'|'DROP'|'GATHER'|'PLACE'|'BUILD'|'USE'|'CRAFT_EXPERIMENT'|'GIVE'|'TAKE'|'WRITE'|'READ';
export type BeliefStatus = 'KNOWN'|'LIKELY'|'UNCERTAIN'|'HYPOTHESIS'|'DISPUTED'|'DISPROVED';

export interface Position { x:number; y:number }
export interface Tile extends Position { type:TileType; fertility:number; moisture:number; }
export interface WorldObject extends Position { id:string; kind:'tree'|'bush'|'berries'|'branch'|'stone'|'note'; amount:number; description:string; blocks?:boolean; }
export interface Structure { id:string; creatorId:string; x:number; y:number; primitives:string[]; description:string; progress:number; createdTick:number; }
export interface Memory { id:string; tick:number; day:number; type:'working'|'episodic'|'semantic'|'social'; text:string; importance:number; participants:string[]; location:Position; tags:string[]; }
export interface Belief { id:string; statement:string; status:BeliefStatus; evidence:string[]; confidence:number; updatedTick:number; }
export interface Skill { id:string; name:string; description:string; origin:string; supportingExperiences:string[]; steps:string[]; confidence:number; lastUsed:number; successes:number; attempts:number; }
export interface Motivation { id:string; text:string; strength:number; source:string; createdTick:number; }
export interface KnownPerson { agentId:string; name:string; impressions:string[]; rememberedInteractions:string[]; }
export interface Conversation { id:string; tick:number; withAgentId:string; speaker:string; text:string; }
export interface HistoryEntry { id:string; day:number; tick:number; text:string; category:EventCategory; }
export interface Reflection { id:string; tick:number; summary:string; trigger:string; }
export interface Appearance { skin:string; hair:string; clothing:string; accessory:string; body:'slight'|'average'|'broad'; }
export interface AgentAction { type:ActionType; target?:Position; objectId?:string; description?:string; targetAgentId?:string; speech?:string; }
export interface Agent {
  id:string; name:string; age:number; appearance:Appearance; character:string; biography:string; x:number; y:number;
  activity:string; intention:string; thoughtSummary:string; sensations:string[]; health:number; hunger:number; thirst:number; fatigue:number; temperature:number;
  inventory:{kind:string;amount:number;description:string}[]; memories:Memory[]; beliefs:Belief[]; skills:Skill[]; motivations:Motivation[]; questions:string[];
  knownPeople:KnownPerson[]; conversations:Conversation[]; history:HistoryEntry[]; reflections:Reflection[]; actionHistory:AgentAction[]; recentObservations:string[];
  namedConcepts:string[]; path:Position[]; action?:AgentAction; actionStartedTick:number; lastDecisionTick:number; lastReflectionTick:number; aiStatus:'idle'|'thinking'|'backoff';
}
export interface WorldEvent { id:string; tick:number; day:number; hour:number; category:EventCategory; text:string; agentIds:string[]; important?:boolean; }
export interface NamedConcept { id:string; name:string; creatorId:string; description:string; firstUsage:number; knownBy:string[]; }
export interface Experiment { id:string; agentId:string; tick:number; description:string; materials:string[]; outcome:'success'|'partial'|'failure'|'unexpected'; observation:string; }
export interface ResearchMarker { id:string; tick:number; day:number; label:string; description:string; }
export interface ExperienceRecord { id:string; agentId:string; tick:number; context:string; relevantMemories:string[]; beliefs:string[]; decision:string; action:AgentAction; worldResult:string; reflection?:string; laterOutcome?:string; }
export interface SimulationState {
  id:string; name:string; locale:string; seed:number; width:number; height:number; tiles:Tile[]; objects:WorldObject[]; structures:Structure[]; agents:Agent[];
  events:WorldEvent[]; concepts:NamedConcept[]; experiments:Experiment[]; researchMarkers:ResearchMarker[]; experiences:ExperienceRecord[];
  tick:number; year:number; day:number; hour:number; speed:1|2|5|10; paused:boolean; weather:Weather; weatherUntil:number; status:'running'|'paused'|'saving'; createdAt:string; updatedAt:string;
}
export interface Perception { tick:number; location:Position; approximateTime:string; weather:Weather; terrain:string[]; objects:WorldObject[]; people:{id:string;name:string;x:number;y:number;activity:string}[]; structures:Structure[]; sounds:string[]; sensations:string[]; observations:string[]; }
export interface Decision { thought_summary:string; current_intention:string; action:AgentAction; speech:string|null; }

export const distance = (a:Position,b:Position) => Math.hypot(a.x-b.x,a.y-b.y);
export const uid = (prefix:string,tick=Date.now()) => `${prefix}_${tick.toString(36)}_${Math.random().toString(36).slice(2,8)}`;
export * from './locales/cs.js';

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, BookOpen, Brain, Bug, ChevronRight, CloudRain, Compass, Crosshair, FlaskConical, Hammer, History, Lightbulb, Map, MessageCircle, Pause, Play, Search, Sparkles, Users, Wifi, WifiOff, ZoomIn, ZoomOut } from 'lucide-react';
import { translateLegacyText, type Agent, type AgentAction, type EventCategory, type SimulationState } from '@novus/shared';
import WorldCanvas from './components/WorldCanvas';
import { apiBase, control, useNovusStore } from './store';
import { actionLabels, aiStatusLabels, beliefLabels, categoryLabels, cs, formatHour, formatNumber, tileLabels, weatherLabels } from './locales/cs';

const FILTERS:(EventCategory|'All')[]=['All','Communication','Experimentation','Construction','Discovery','Social'];
const CATEGORY_ICON:Record<string,typeof Activity>={Communication:MessageCircle,Experimentation:FlaskConical,Construction:Hammer,Discovery:Lightbulb,Social:Users,Movement:Compass,Other:Activity};
const TABS=[['world',Map],['research',Search],['history',History],['concepts',Sparkles],['debug',Bug]] as const;
const localized=(value:string)=>translateLegacyText(value);

export default function Home(){
  const {state,selectedId,connected,eventFilter,tab,setState,select,setConnected,setFilter,setTab}=useNovusStore();
  const [panel,setPanel]=useState<'overview'|'history'>('overview');
  useEffect(()=>{let ws:WebSocket|undefined,retry:number|undefined,closed=false;const connect=async()=>{try{const response=await fetch(`${apiBase()}/api/state`);if(response.ok)setState(await response.json())}catch{}if(closed)return;ws=new WebSocket(`${apiBase().replace(/^http/,'ws')}/live`);ws.onopen=()=>setConnected(true);ws.onmessage=e=>{const msg=JSON.parse(e.data);if(msg.type==='state')setState(msg.payload)};ws.onclose=()=>{setConnected(false);if(!closed)retry=window.setTimeout(connect,1500)}};void connect();return()=>{closed=true;if(retry)clearTimeout(retry);ws?.close()}},[setConnected,setState]);
  const selected=state?.agents.find(agent=>agent.id===selectedId)||state?.agents[0];
  const events=useMemo(()=>state?.events.filter(event=>eventFilter==='All'||event.category===eventFilter).slice(-80).reverse()||[],[state?.events,eventFilter]);
  if(!state)return <Loading connected={connected}/>;
  return <main className="novus-shell">
    <TopBar state={state} connected={connected}/>
    <section className="workspace">
      <EventStream events={events} filter={eventFilter} onFilter={setFilter} state={state}/>
      <div className="world">
        <WorldCanvas state={state} selectedId={selectedId} onSelect={id=>{select(id);setPanel('overview')}}/>
        <div className="weather-note">{state.weather==='rain'?<CloudRain size={12}/>:<Compass size={12}/>} {weatherLabels[state.weather].toUpperCase()} · {state.structures.length} {cs.world.persistentArrangements} · {cs.world.observerMode}</div>
        <div className="map-key"><span><i className="k-water"/>{cs.world.water}</span><span><i className="k-forest"/>{cs.world.vegetation}</span><span><i className="k-agent"/>{cs.world.inhabitant}</span></div>
        <div className="zoom"><button aria-label={cs.world.zoomIn}><ZoomIn/></button><button aria-label={cs.world.zoomOut}><ZoomOut/></button><button aria-label={cs.world.center}><Crosshair/></button></div>
        {tab!=='world'&&<ResearchOverlay tab={tab} state={state} selected={selected}/>} 
      </div>
      {selected&&<Inspector agent={selected} state={state} panel={panel} setPanel={setPanel}/>} 
    </section>
    <nav className="bottom-tabs">{TABS.map(([id,Icon])=><button key={id} onClick={()=>setTab(id)} className={tab===id?'active':''}><Icon/>{cs.tabs[id]}{id==='research'&&state.researchMarkers.length>0?<span>{state.researchMarkers.length}</span>:null}{id==='concepts'&&state.concepts.length>0?<span>{state.concepts.length}</span>:null}</button>)}<p>{cs.footer.tick} {formatNumber(state.tick)} · {state.status==='saving'?cs.footer.saving:cs.footer.autosaved}</p></nav>
  </main>
}

function Loading({connected}:{connected:boolean}){return <main className="loading"><div className="brand-mark">N</div><h1>NOVUS</h1><p>{connected?cs.loading.connected:cs.loading.disconnected}</p><div className="loading-line"><i/></div></main>}

function TopBar({state,connected}:{state:SimulationState;connected:boolean}){return <header className="topbar">
  <div className="brand"><span className="brand-mark">N</span><div><b>NOVUS</b><small>{localized(state.name||cs.brand.worldFallback).toUpperCase()} · {cs.brand.seed} {state.seed}</small></div></div>
  <div className="clock"><small>{cs.clock.year} {state.year} · {cs.clock.day} {state.day}</small><b>{formatHour(state.hour)}</b><span>{state.weather==='rain'?'☂':state.weather==='cloudy'?'☁':'○'} {weatherLabels[state.weather]}</span></div>
  <div className="controls"><button onClick={()=>control({paused:!state.paused})} aria-label={state.paused?cs.controls.resume:cs.controls.pause}>{state.paused?<Play/>:<Pause/>}</button>{([1,2,5,10] as const).map(speed=><button key={speed} onClick={()=>control({speed})} className={state.speed===speed?'active':''}>{speed}×</button>)}<span className={`status ${connected?'online':''}`}>{connected?<Wifi/>:<WifiOff/>}{connected?(state.paused?cs.controls.paused:cs.controls.running):cs.controls.reconnecting}</span></div>
</header>}

function EventStream({events,filter,onFilter,state}:{events:SimulationState['events'];filter:string;onFilter:(filter:EventCategory|'All')=>void;state:SimulationState}){return <aside className="event-panel">
  <div className="panel-heading"><span>{cs.events.heading}</span><small>{formatNumber(state.events.length)} {cs.events.recorded}</small></div>
  <div className="filters">{FILTERS.map(item=><button key={item} onClick={()=>onFilter(item)} className={filter===item?'active':''}>{cs.filters[item]}</button>)}</div>
  <div className="events">{events.map(event=>{const Icon=CATEGORY_ICON[event.category]||Activity;return <article key={event.id} className={event.important?'important':''}><time>{cs.day(event.day)}<small>{formatHour(event.hour)}</small></time><div className={`event-dot ${event.category.toLowerCase()}`}><Icon/></div><p>{localized(event.text)}</p></article>})}</div>
  <div className="watching"><span>{state.agents.length}</span><div><b>{cs.events.inhabitantsObserved}</b><small>{cs.events.autonomous}</small></div></div>
</aside>}

function Inspector({agent,state,panel,setPanel}:{agent:Agent;state:SimulationState;panel:'overview'|'history';setPanel:(panel:'overview'|'history')=>void}){
  const tile=state.tiles[agent.y*state.width+agent.x];const location=tile?tileLabels[tile.type]:'';
  return <aside className="inspector"><div className="panel-heading"><span>{panel==='history'?cs.inspector.lifeHistory:cs.inspector.inhabitant}</span><button onClick={()=>setPanel(panel==='history'?'overview':'history')}>{panel==='history'?cs.inspector.back:cs.inspector.life} <ChevronRight/></button></div>{panel==='history'?<LifeHistory agent={agent}/>:<>
    <div className="identity"><div className="portrait" style={{background:`linear-gradient(${agent.appearance.skin},${agent.appearance.clothing.includes('red')?'#8e5848':'#6e7551'})`}}>{agent.name[0]}</div><div><small>{cs.inspector.age} {agent.age} · {location.toUpperCase()} · {agent.x}, {agent.y}</small><h1>{agent.name}</h1><p>{localized(agent.activity)}</p></div></div>
    <section className="intention"><small>{cs.inspector.currentIntention}</small><p>„{localized(agent.intention)}“</p></section>
    <Info title={cs.inspector.physicalImpressions}><div className="tags">{agent.sensations.map((sensation,index)=><span key={`${sensation}-${index}`}>{localized(sensation)}</span>)}</div></Info>
    <Info title={cs.inspector.importantMemories}><List rows={agent.memories.slice().sort((a,b)=>b.importance-a.importance||b.tick-a.tick).slice(0,4).map(memory=>[cs.day(memory.day),localized(memory.text)])}/></Info>
    <Info title={cs.inspector.beliefs}>{agent.beliefs.length?<List rows={agent.beliefs.slice(-4).reverse().map(belief=>[beliefLabels[belief.status],localized(belief.statement)])}/>:<Empty>{cs.inspector.noBeliefs}</Empty>}</Info>
    <Info title={cs.inspector.questions}><ul className="questions">{agent.questions.slice(0,3).map((question,index)=><li key={`${question}-${index}`}>{localized(question)}</li>)}</ul></Info>
    <Info title={cs.inspector.skills}>{agent.skills.length?<List rows={agent.skills.map(skill=>[cs.inspector.confidence(skill.confidence),localized(skill.name)])}/>:<Empty>{cs.inspector.noSkills}</Empty>}</Info>
    <Info title={cs.inspector.knownPeople}><div className="people-list">{agent.knownPeople.slice(0,6).map(person=><span key={person.agentId}><b>{person.name}</b>{person.impressions.slice(-2).map(localized).join(' · ')}</span>)}</div></Info>
    <button className="life-button" onClick={()=>setPanel('history')}><BookOpen/>{cs.inspector.viewLife(agent.name)} <ChevronRight/></button>
  </>}</aside>
}

function Info({title,children}:{title:string;children:React.ReactNode}){return <section><h2>{title}</h2>{children}</section>}
function Empty({children}:{children:React.ReactNode}){return <p className="empty">{children}</p>}
function List({rows}:{rows:[string,string][]}){return <ul className="memory-list">{rows.map(([meta,text],index)=><li key={`${meta}-${index}`}><time>{meta}</time>{text}</li>)}</ul>}
function LifeHistory({agent}:{agent:Agent}){return <div className="life-history"><div className="life-head"><div className="portrait">{agent.name[0]}</div><h1>{agent.name}</h1><p>{localized(agent.biography)}</p></div>{agent.history.slice().reverse().map(entry=><article key={entry.id}><time>{cs.day(entry.day)}</time><i/><div><small>{categoryLabels[entry.category]}</small><p>{localized(entry.text)}</p></div></article>)}</div>}

function displayAction(action?:AgentAction){if(!action)return null;return {[cs.debug.keys.actionType]:actionLabels[action.type],...(action.target?{[cs.debug.keys.actionTarget]:action.target}:{}),...(action.objectId?{[cs.debug.keys.actionObject]:action.objectId}:{}),...(action.description?{[cs.debug.keys.actionDescription]:localized(action.description)}:{}),...(action.targetAgentId?{[cs.debug.keys.actionPerson]:action.targetAgentId}:{}),...(action.speech?{[cs.debug.keys.actionSpeech]:localized(action.speech)}:{})}}
function ResearchOverlay({tab,state,selected}:{tab:keyof typeof cs.tabs;state:SimulationState;selected?:Agent}){
  const conversations=state.agents.reduce((count,agent)=>count+agent.conversations.length,0)/2;
  const visited=new Set(state.agents.map(agent=>`${Math.floor(agent.x/10)},${Math.floor(agent.y/10)}`)).size;
  const actionTypes=state.agents.map(agent=>new Set(agent.actionHistory.map(action=>action.type)).size);
  const diversity=Math.round(actionTypes.reduce((a,b)=>a+b,0)/Math.max(1,actionTypes.length)*12.5);
  const debug=selected?{[cs.debug.keys.tick]:state.tick,[cs.debug.keys.selected]:selected.name,[cs.debug.keys.perceptionRadius]:12,[cs.debug.keys.currentAction]:displayAction(selected.action),[cs.debug.keys.thoughtSummary]:localized(selected.thoughtSummary),[cs.debug.keys.aiStatus]:aiStatusLabels[selected.aiStatus],[cs.debug.keys.retrievedMemories]:selected.memories.slice(-4).map(memory=>localized(memory.text)),[cs.debug.keys.beliefs]:selected.beliefs.slice(-4).map(belief=>({[cs.debug.keys.beliefStatus]:beliefLabels[belief.status],[cs.debug.keys.beliefStatement]:localized(belief.statement),[cs.debug.keys.beliefEvidence]:belief.evidence.map(localized),[cs.debug.keys.beliefConfidence]:belief.confidence,[cs.debug.keys.beliefUpdated]:belief.updatedTick})),[cs.debug.keys.path]:selected.path.slice(0,8),[cs.debug.keys.experienceRecords]:state.experiences.length}:{};
  return <section className="research-overlay"><header><div><small>{cs.research.layer}</small><h1>{cs.tabs[tab]}</h1></div><p>{cs.research.note}</p></header>
    {tab==='research'&&<><div className="stat-grid"><Stat icon={Users} label={cs.research.population} value={state.agents.length}/><Stat icon={MessageCircle} label={cs.research.conversations} value={Math.floor(conversations)}/><Stat icon={FlaskConical} label={cs.research.experiments} value={state.experiments.length}/><Stat icon={Hammer} label={cs.research.structures} value={state.structures.length}/><Stat icon={Compass} label={cs.research.regions} value={visited}/><Stat icon={Brain} label={cs.research.personalBeliefs} value={state.agents.reduce((count,agent)=>count+agent.beliefs.length,0)}/></div><div className="research-columns"><div><h2>{cs.research.markers}</h2>{state.researchMarkers.length?state.researchMarkers.slice().reverse().map(marker=><article className="marker" key={marker.id}><time>{cs.day(marker.day)}</time><div><b>{localized(marker.label)}</b><p>{localized(marker.description)}</p></div></article>):<Empty>{cs.research.noMarkers}</Empty>}</div><div><h2>{cs.research.activeQuestions}</h2>{state.agents.flatMap(agent=>agent.questions.slice(0,1).map(question=><article className="question-row" key={`${agent.id}${question}`}><b>{agent.name}</b><p>{localized(question)}</p></article>))}</div></div></>}
    {tab==='history'&&<div className="timeline">{state.events.filter(event=>event.important).slice().reverse().map(event=><article key={event.id}><time>{cs.day(event.day)} · {formatHour(event.hour)}</time><h2>{localized(event.text)}</h2><small>{categoryLabels[event.category]}</small></article>)}</div>}
    {tab==='concepts'&&<div className="concept-grid">{state.concepts.length?state.concepts.map(concept=><article key={concept.id}><Sparkles/><small>{cs.research.firstUsed} {cs.day(Math.floor(concept.firstUsage/240)+1)}</small><h2>{localized(concept.name)}</h2><p>{localized(concept.description)}</p><span>{cs.research.knownBy(concept.knownBy.length)}</span></article>):<Empty>{cs.research.noConcepts}</Empty>}</div>}
    {tab==='debug'&&<div className="debug-grid"><div><h2>{cs.debug.individuality}</h2><div className="diversity"><strong>{Math.min(100,diversity)} %</strong><span>{cs.debug.variation}</span></div><p>{diversity<35?cs.debug.converging:cs.debug.distinct}</p></div><pre>{JSON.stringify(debug,null,2)}</pre></div>}
  </section>
}

function Stat({icon:Icon,label,value}:{icon:typeof Users;label:string;value:number}){return <article><Icon/><div><strong>{formatNumber(value)}</strong><span>{label}</span></div></article>}

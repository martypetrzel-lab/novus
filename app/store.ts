'use client';
import { create } from 'zustand';import type { EventCategory, SimulationState } from '@novus/shared';
type Tab='world'|'research'|'history'|'concepts'|'debug';
interface NovusStore {state:SimulationState|null;selectedId:string|null;connected:boolean;eventFilter:EventCategory|'All';tab:Tab;setState:(state:SimulationState)=>void;select:(id:string|null)=>void;setConnected:(v:boolean)=>void;setFilter:(v:EventCategory|'All')=>void;setTab:(v:Tab)=>void;}
export const useNovusStore=create<NovusStore>(set=>({state:null,selectedId:null,connected:false,eventFilter:'All',tab:'world',setState:state=>set(current=>({state,selectedId:current.selectedId||state.agents[0]?.id||null})),select:selectedId=>set({selectedId}),setConnected:connected=>set({connected}),setFilter:eventFilter=>set({eventFilter}),setTab:tab=>set({tab})}));
export function apiBase(){if(typeof window==='undefined')return 'http://localhost:3001';return process.env.NEXT_PUBLIC_API_URL||`${window.location.protocol}//${window.location.hostname}:3001`}
export async function control(body:{paused?:boolean;speed?:1|2|5|10}){await fetch(`${apiBase()}/api/control`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)})}

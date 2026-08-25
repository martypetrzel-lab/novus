import type { ActionType, BeliefStatus, EventCategory, TileType, Weather } from '@novus/shared';

export const cs = {
  locale: 'cs-CZ',
  metadata: {
    title: 'NOVUS — simulace autonomní civilizace',
    description: 'Pozorujte autonomní obyvatele, kteří si v trvalém živém světě vytvářejí vzpomínky, přesvědčení, vztahy a společnou historii.',
    socialDescription: 'Simulace autonomní civilizace',
  },
  brand: { worldFallback: 'První svět', seed: 'SEED' },
  clock: { year: 'ROK', day: 'DEN' },
  controls: { pause: 'Pozastavit simulaci', resume: 'Pokračovat v simulaci', running: 'SVĚT BĚŽÍ', paused: 'SVĚT JE POZASTAVEN', reconnecting: 'OBNOVUJE SE SPOJENÍ' },
  loading: { connected: 'Přijímám stav živého světa…', disconnected: 'Probouzím službu trvalého světa…' },
  world: { observerMode: 'REŽIM POZOROVATELE', persistentArrangements: 'TRVALÁ USPOŘÁDÁNÍ', water: 'voda', vegetation: 'vegetace', inhabitant: 'obyvatel', zoomIn: 'Přiblížit', zoomOut: 'Oddálit', center: 'Vystředit mapu' },
  events: { heading: 'UDÁLOSTI', recorded: 'zaznamenáno', inhabitantsObserved: 'sledovaných obyvatel', autonomous: 'autonomní · bez přímého ovládání' },
  filters: { All: 'Vše', Communication: 'Komunikace', Experimentation: 'Pokusy', Construction: 'Stavba', Discovery: 'Objevy', Social: 'Vztahy', Health: 'Zdraví', Movement: 'Pohyb', Other: 'Ostatní' } satisfies Record<EventCategory|'All',string>,
  tabs: { world: 'Svět', research: 'Výzkum', history: 'Historie', concepts: 'Pojmy', debug: 'Ladění' },
  footer: { tick: 'Tik', saving: 'Ukládání…', autosaved: 'Automaticky uloženo' },
  inspector: { inhabitant: 'OBYVATEL', lifeHistory: 'ŽIVOTNÍ HISTORIE', life: 'ŽIVOT', back: 'ZPĚT', age: 'VĚK', currentIntention: 'AKTUÁLNÍ ZÁMĚR', physicalImpressions: 'Tělesné pocity', importantMemories: 'Důležité vzpomínky', beliefs: 'Přesvědčení a hypotézy', noBeliefs: 'Zatím nemá ustálená přesvědčení; osobních důkazů je stále málo.', questions: 'Otázky, které si klade', skills: 'Naučené dovednosti', noSkills: 'Zatím nevznikl žádný opakovatelný postup.', knownPeople: 'Známí obyvatelé', viewLife: (name:string)=>`ZOBRAZIT ŽIVOTNÍ HISTORII: ${name.toUpperCase()}`, confidence: (value:number)=>`jistota ${Math.round(value*100)} %` },
  research: { layer: 'POZOROVATELSKÁ VÝZKUMNÁ VRSTVA', note: 'Jde o pozorování, nikoli skóre nebo cíle postupu.', population: 'Obyvatelé', conversations: 'Rozhovory', experiments: 'Pokusy', structures: 'Stavby', regions: 'Navštívené oblasti', personalBeliefs: 'Osobní přesvědčení', markers: 'Výzkumné milníky', noMarkers: 'Svět zatím nevytvořil žádnou první událost, kterou by stálo za to označit.', activeQuestions: 'Aktivní otázky', firstUsed: 'POPRVÉ POUŽITO', knownBy: (count:number)=>`Zná ${count} ${count===1?'obyvatel':count>=2&&count<=4?'obyvatelé':'obyvatel'}`, noConcepts: 'Žádný obyvatel zatím nepojmenoval nový pojem. Názvy se šíří pouze pozorováním a rozhovorem.' },
  debug: { individuality: 'Diagnostika individuality', variation: 'variabilita chování', converging: 'Obyvatelé se začínají chovat podobně. Tlak na narušení opakování je aktivní.', distinct: 'Historie činností zůstávají smysluplně odlišné.', keys: { tick: 'simulační tik', selected: 'vybraný obyvatel', perceptionRadius: 'poloměr vnímání', currentAction: 'aktuální činnost', thoughtSummary: 'stručné shrnutí úvahy', aiStatus: 'stav AI', retrievedMemories: 'vybavené vzpomínky', beliefs: 'přesvědčení', path: 'plánovaná cesta', experienceRecords: 'záznamy zkušeností', actionType: 'typ', actionTarget: 'cíl', actionObject: 'předmět', actionDescription: 'popis', actionPerson: 'cílový obyvatel', actionSpeech: 'řeč', beliefStatus: 'stav', beliefStatement: 'tvrzení', beliefEvidence: 'důkazy', beliefConfidence: 'jistota', beliefUpdated: 'poslední změna' } },
  day: (day:number)=>`DEN ${day}`,
} as const;

export const formatNumber=(value:number)=>new Intl.NumberFormat(cs.locale).format(value);
export const formatHour=(hour:number)=>`${Math.floor(hour).toString().padStart(2,'0')}:${Math.floor((hour%1)*60).toString().padStart(2,'0')}`;
export const weatherLabels:Record<Weather,string>={clear:'jasno',cloudy:'oblačno',rain:'déšť'};
export const tileLabels:Record<TileType,string>={grass:'tráva',dirt:'hlína',fertile:'úrodná půda',sand:'písek',shallow_water:'mělká voda',deep_water:'hluboká voda',rock:'skála'};
export const beliefLabels:Record<BeliefStatus,string>={KNOWN:'OVĚŘENO',LIKELY:'PRAVDĚPODOBNÉ',UNCERTAIN:'NEJISTÉ',HYPOTHESIS:'HYPOTÉZA',DISPUTED:'SPORNÉ',DISPROVED:'VYVRÁCENO'};
export const actionLabels:Record<ActionType,string>={WAIT:'ČEKÁNÍ',MOVE:'POHYB',SPEAK:'MLUVENÍ',INSPECT:'PROHLÍŽENÍ',PICK_UP:'ZVEDNUTÍ',DROP:'ODLOŽENÍ',GATHER:'SBĚR',PLACE:'UMÍSTĚNÍ',BUILD:'STAVBA',USE:'POUŽITÍ',CRAFT_EXPERIMENT:'MATERIÁLOVÝ POKUS',GIVE:'PŘEDÁNÍ',TAKE:'PŘEVZETÍ',WRITE:'PSANÍ',READ:'ČTENÍ'};
export const aiStatusLabels={idle:'nečinná',thinking:'přemýšlí',backoff:'čeká po chybě'} as const;
export const categoryLabels:Record<EventCategory,string>=cs.filters;

export const DEFAULT_LOCALE = 'cs-CZ';

export const simulationCs = {
  worldName: 'První svět',
  object: {
    tree: 'vzrostlý strom s hrubou kůrou',
    berries: 'nízká rostlina s tmavými bobulemi, které vypadají jedle',
    bush: 'hustý ohebný keř',
    branch: 'suchá spadlá větev',
    flatStone: 'světlý plochý kámen',
    roundStone: 'volně ležící oblý kámen',
    note: (name:string) => `značky vytvořené obyvatelem ${name}`,
  },
  clothing: ['okrový přehoz','mechově zelená tunika','cihlově červený šál','modrošedá vesta','pískové plátno','hnědý kabát'],
  characters: [
    'Zajímají tě neznámé věci a nerad přijímáš vysvětlení bez důkazů. Samota ti pomáhá všímat si detailů, které jiní přehlížejí.',
    'S lidmi i materiály máš trpělivost, ale nedořešené otázky tě dokážou pohltit natolik, že zapomínáš na vlastní pohodlí.',
    'K nejistým fyzickým rizikům přistupuješ opatrně, přesto tě důvěryhodný společník může přesvědčit, abys zkusil něco nového.',
    'Často vyhledáváš společnost a místům rozumíš skrze příběhy, gesta a reakce ostatních lidí.',
    'Přitahují tě vzdálená místa a proměnlivé počasí. Opakování tě zneklidňuje, ale nerad opouštíš někoho, kdo potřebuje pomoc.',
    'Všímáš si vzorců ve tvarech a rovnováze. Mluvíš až po delším váhání, ale přímo, když máš důkaz, který stojí za sdílení.',
    'Pohotově improvizuješ s tím, co máš po ruce. Neúspěch tě pobaví, pokud někomu neublíží — takovou událost si pamatuješ dlouho.',
    'Ceníš si známých věcí a vracíš se na významná místa. Nedůvěřuješ tvrzením, která nikdo nechce předvést.',
    'Citlivě vnímáš nepohodlí a atmosféru. Pozorně sleduješ vztahy a často přemýšlíš nad tím, co ostatní neřekli.',
    'Rád porovnáváš podobné předměty a udržuješ užitečná uspořádání v pořádku, ale slibné teorie se někdy držíš příliš tvrdošíjně.',
  ],
  biography: (name:string) => `${name} procitl v této krajině s útržkovitými osobními vzpomínkami, vlastní povahou a bez znalosti institucí či společných zvyklostí.`,
  initialActivity: 'Rozhlíží se po neznámé krajině',
  initialIntention: 'Porozumět nejbližšímu okolí bez ukvapených závěrů.',
  initialThought: 'Všechno je natolik nové, že si to zaslouží pozornost.',
  rested: 'odpočatý', comfortableTemperature: 'příjemná teplota',
  initialMotivations: ['Zjistit, jak okolní materiály reagují na zacházení.','Prozkoumat místo, které ještě není známé.'],
  initialQuestions: ['Kam proudící voda pokračuje?','Proč se některé kameny štípou čistěji než jiné?','Proč jsou některá místa porostlá hustěji než jiná?'],
  firstAwareness: 'Poprvé si uvědomil existenci společné krajiny.',
  firstWorldEvent: 'Deset obyvatel se setkává s nedotčeným světem. Nic zde ještě nebylo postaveno ani pojmenováno.',
  sensations: {
    hungry: 'rostoucí hlad oslabuje soustředění', mildHunger: 'mírný pocit prázdného žaludku', thirsty: 'nepříjemná žízeň', dryMouth: 'sucho v ústech', exhausted: 'vyčerpaný', tired: 'poněkud unavený', rain: 'chladný déšť na nezakryté kůži', coolNight: 'chladný noční vzduch', comfortable: 'příjemná teplota', physicallyComfortable: 'tělesně v pohodě',
  },
  weatherShift: (weather:string) => `Počasí se mění: ${weather}.`,
  movement: (name:string,terrain:string) => `${name} prochází terénem: ${terrain}.`,
  arrived: (terrain:string) => `Dorazil jsem do oblasti s terénem „${terrain}“, kterou jsem v poslední době nenavštívil.`,
  resting: 'Odpočívá bez pevného úkolu', approaching: (action:string) => `Přibližuje se k činnosti „${action}“`, walking: 'Kráčí k neznámému místu', lookingAfterWalk: 'Po cestě se rozhlíží',
  repetition: (name:string) => `${name} si všiml opakujícího se vzorce a znovu zvážil nezodpovězenou otázku.`,
  noveltyMotivation: 'Vyhledat skutečně neznámý jev.',
  invalidAction: (reason:string) => `Pokus byl bezpečně ukončen: ${reason}.`,
  unknownAction: 'Neznámá činnost', outsideWorld: 'Cíl leží mimo fyzický svět', descriptionTooLong: 'Popis je příliš dlouhý',
  noRoute: 'Nenašel jsem bezpečnou cestu, a proto jsem zůstal na místě.',
  inspectObject: (description:string,terrain:string) => `Prohlédl jsem si ${description} a všiml si, jak leží v terénu „${terrain}“.`,
  inspectGround: (terrain:string) => `Prohlédl jsem si zem a všiml si podmínek terénu „${terrain}“.`,
  objectQuestion: (kind:string) => `Jak se ${kind} mění při zacházení v různých podmínkách?`, groundQuestion: 'Čím se tato část půdy liší od okolí?',
  gone: 'Předmět už na místě nebyl.', gathered: (description:string,terrain:string) => `Sebral jsem ${description} v terénu „${terrain}“.`,
  unheard: 'Zamýšlená slova nemohl nikdo dostatečně blízko slyšet.', genericSpeech: 'Čeho sis tady všiml?', speech: 'Pořád si na tomhle místě všímám něčeho jiného. Co jsi viděl ty?',
  spokeMemory: (name:string,text:string) => `Mluvil jsem s ${name}: „${text}“`, heardMemory: (name:string,text:string) => `${name} řekl: „${text}“`,
  spokeEvent: (speaker:string,listener:string,text:string) => `${speaker} oslovil obyvatele ${listener}: „${text}“`, spokeHistory: (name:string) => `Mluvil s obyvatelem ${name} o svém pozorování.`, spokeResult: (name:string) => `Mluvil jsem s obyvatelem ${name} a sledoval jeho reakci.`, heardBelief: (name:string,statement:string) => `${name} mi řekl: ${statement}`,
  experimentNeedsMaterials: 'Pokus selhal, protože jsem neměl dost různých materiálů.',
  experimentHeld: (a:string,b:string) => `Uspořádání materiálů ${a} a ${b} při tlaku vydrželo.`,
  experimentPartial: (a:string,b:string) => `Uspořádání materiálů ${a} a ${b} krátce drželo, ale pak se uvolnilo.`,
  experimentUnexpected: (a:string,b:string) => `Nečekaně ${a} změnil povrch materiálu ${b}.`,
  experimentFailed: (a:string,b:string) => `Uspořádání materiálů ${a} a ${b} selhalo a rozpadlo se.`,
  experimentDescription: 'improvizované porovnání materiálů', firstExperiment: 'První úspěšný pokus', firstExperimentDescription: (name:string) => `${name} dosáhl výsledku, který lze zopakovat.`,
  bindingName: (name:string) => `${name}ovo spojení`, bindingDescription: (materials:string) => `Pojmenování uspořádání materiálů ${materials}.`, firstName: 'První vytvořený název', firstNameDescription: (name:string,concept:string) => `${name} začal materiálové uspořádání nazývat „${concept}“.`,
  buildNeedsMaterial: 'Stavební pokus selhal, protože nebyl k dispozici vhodný dlouhý materiál.', unnamedCover: 'malé nakloněné zakrytí z dostupných větví', buildHeld: 'Zakrytí z větví udrželo tvar a vytvořilo malé suché místo.', buildSagged: 'Uspořádání větví se prohnulo ještě před dokončením zakrytí.', firstConstruction: 'První úspěšná stavba', firstConstructionDescription: (name:string) => `${name} vytvořil trvalé primitivní uspořádání.`,
  exchangeFailed: 'Předání se nepodařilo uskutečnit.', giftMemory: (name:string,item:string) => `${name} mi dobrovolně dal ${item}.`, firstGift: 'První dobrovolný dar', firstGiftDescription: (name:string,other:string,item:string) => `${name} dal obyvateli ${other} předmět: ${item}.`, gave: (name:string,item:string) => `Dal jsem obyvateli ${name} předmět: ${item}.`,
  firstNote: 'První písemná poznámka', firstNoteDescription: (name:string) => `${name} zanechal ve světě trvalé značky.`, notePlaced: 'Zanechal jsem poznámku, jejíž značky může objevit někdo další.',
  genericCompletion: (action:string) => `Dokončil jsem činnost „${action}“ a nepozoroval žádný výrazný výsledek.`,
  consolidationReflection: (text:string) => `Během odpočinku jsem propojil několik nedávných zkušeností: ${text}`, consolidationEvent: (name:string) => `${name} spojil nedávné zkušenosti do osobního ponaučení.`,
  unfamiliar: 'neznámý, ale rozpoznatelný', familiar: 'známý',
  cognition: {
    hungerMotivation: 'Najít něco, co by mohlo zmírnit vytrvalý pocit prázdného žaludku.', learnFrom: (name:string) => `Zjistit, čeho si všiml ${name}.`,
    revisitQuestion: (q:string) => `Znovu promyslet nezodpovězenou otázku: ${q}`, inspectCuriosity: (description:string) => `Pozorněji prozkoumat ${description}.`, contradiction: 'Prozkoumat poslední výsledek, protože odporoval očekávání.',
    socialThought: (name:string) => `${name} je poblíž; možná stojí za to sdílet konkrétní pozorování.`, socialIntention: (name:string) => `Promluvit s obyvatelem ${name} o tomto místě.`,
    giftThought: (name:string) => `Mám něco, co by se mohlo obyvateli ${name} hodit.`, giftIntention: (name:string) => `Nabídnout obyvateli ${name} jeden sebraný předmět bez očekávání odměny.`,
    experimentThought: 'Spojení nesených věcí může odhalit užitečnou vlastnost.', experimentIntention: 'Vyzkoušet uspořádání bez předpokládání výsledku.', combine: (items:string) => `spojit ${items}`,
    buildThought: 'Malé zakryté uspořádání může změnit působení větru a deště na toto místo.', buildIntention: 'Uspořádat sebraný materiál do jednoduchého zakrytí.',
    writeThought: 'Značky mohou uchovat toto pozorování pro někoho, kdo přijde později.', writeIntention: 'Zanechat krátkou trvalou poznámku o osobním pozorování.',
    gatherThought: (kind:string) => `Předmět „${kind}“ může být užitečný nebo něco odhalit.`, gatherIntention: (kind:string) => `Prozkoumat a sebrat blízký předmět „${kind}“.`,
    wanderThought: 'Nic není naléhavé; cesta k neznámému místu může přinést nové pozorování.', wanderIntention: 'Toulat se a všímat si proměn krajiny.',
    criticCollapse: 'Předchozí uspořádání selhalo. Použij menší základnu a vyhni se nasycené půdě.', criticFatigue: 'Únava může dlouhou cestu zbytečně ztížit.', waitAndReconsider: 'odpočinout si a znovu situaci promyslet',
    reflection: (result:string) => `Výsledek zněl: „${result}“ Měl bych ho porovnat se svým dosavadním přesvědčením a při příštím pokusu věnovat pozornost okolním podmínkám.`, identityCaution: ' Nedávné neúspěchy tě naučily přistupovat k předpokladům opatrněji.',
  },
  learning: {
    pattern: (items:string) => `Nedávné zkušenosti naznačují vzorec: ${items}`, coveringSkill: 'Vytvořit stabilní primitivní zakrytí', combinationSkill: 'Zopakovat slibné spojení materiálů', origin: (day:number) => `Vlastní zkušenost ze dne ${day}`, observeMaterials: 'Prohlédnout dostupné materiály', repeatArrangement: 'Zopakovat uspořádání a sledovat podmínky',
  },
  ai: { fallbackThought: 'Odpověď nebyla srozumitelná, proto počkám a budu dál pozorovat.', fallbackIntention: 'Bezpečně vyčkat.', mockThought: 'Zůstanu pozorný, zatímco pokračuje má současná činnost.', mockIntention: 'Pozorovat změny v okolí.', reflection: (result:string) => `Výsledek byl „${result}“. Měl bych jej porovnat s budoucí zkušeností.` },
} as const;

const legacyTerms:Record<string,string>={tree:'strom',bush:'keř',berries:'bobule',branch:'větev',stone:'kámen',note:'poznámka',grass:'tráva',dirt:'hlína',fertile:'úrodná půda',sand:'písek','shallow water':'mělká voda','deep water':'hluboká voda',rock:'skála',clear:'jasno',cloudy:'oblačno',rain:'déšť'};
export const localizeTerm=(value:string)=>legacyTerms[value.toLowerCase()]||value;

/** Converts records produced by the Phase 1 English templates for Czech display without discarding a persistent world. */
export function translateLegacyText(value:string):string{
  if(!value)return value;let text=value;
  const replacements:Array<[RegExp,string|((...args:any[])=>string)]>=[
    [/The First World/gi,'První svět'],[/Ten inhabitants encounter an untouched world\. Nothing here has been built or named\./g,'Deset obyvatel se setkává s nedotčeným světem. Nic zde ještě nebylo postaveno ani pojmenováno.'],
    [/Taking in the unfamiliar landscape/g,simulationCs.initialActivity],[/Understand what is nearby without assuming too much\./g,simulationCs.initialIntention],[/Everything here is new enough to deserve attention\./g,simulationCs.initialThought],
    [/([^.]*) awoke in this landscape with fragmentary personal memories, a distinct temperament, and no knowledge of institutions or shared customs\./g,(_,name)=>simulationCs.biography(name.trim()) as any],
    [/Discover how nearby materials respond to handling\./g,simulationCs.initialMotivations[0]],[/Explore somewhere not yet familiar\./g,simulationCs.initialMotivations[1]],
    [/Where does the moving water continue\?/g,simulationCs.initialQuestions[0]],[/Why do some stones split more cleanly than others\?/g,simulationCs.initialQuestions[1]],[/Why are some places more densely grown than others\?/g,simulationCs.initialQuestions[2]],
    [/The landscape contains water, vegetation, stone, and other unfamiliar people\./g,'Krajina obsahuje vodu, vegetaci, kámen a další neznámé lidi.'],
    [/The weather shifts to (clear|cloudy|rain)\./g,(_,w)=>`Počasí se mění: ${localizeTerm(w)}.` as any],
    [/ moved through (.+)\./g,(_,terrain)=>` prochází terénem: ${localizeTerm(terrain)}.` as any],
    [/I reached an area of (.+) that I had not visited recently\./g,(_,terrain)=>`Dorazil jsem do oblasti s terénem „${localizeTerm(terrain)}“, kterou jsem v poslední době nenavštívil.` as any],
    [/(?:I )?inspected (.+?) and noticed how it sits in ([a-z_ ]+)\./gi,(_,obj,terrain)=>`Prohlédl jsem si ${translateLegacyText(obj)} a všiml si, jak leží v terénu „${localizeTerm(terrain.trim())}“.` as any],
    [/(?:I )?gathered (.+?) from near ([a-z_ ]+)\./gi,(_,obj,terrain)=>`Sebral jsem ${translateLegacyText(obj)} v terénu „${localizeTerm(terrain.trim())}“.` as any],
    [/The (\w+) and (\w+) arrangement held when pressed\./g,(_,a,b)=>`Uspořádání materiálů ${localizeTerm(a)} a ${localizeTerm(b)} při tlaku vydrželo.` as any],
    [/The (\w+) and (\w+) arrangement held briefly, then loosened\./g,(_,a,b)=>`Uspořádání materiálů ${localizeTerm(a)} a ${localizeTerm(b)} krátce drželo, ale pak se uvolnilo.` as any],
    [/The (\w+) and (\w+) arrangement failed and came apart\./g,(_,a,b)=>`Uspořádání materiálů ${localizeTerm(a)} a ${localizeTerm(b)} selhalo a rozpadlo se.` as any],
    [/Unexpectedly, the (\w+) changed the surface of the (\w+)\./g,(_,a,b)=>`Nečekaně ${localizeTerm(a)} změnil povrch materiálu ${localizeTerm(b)}.` as any],
    [/I spoke with ([^:]+): “(.+)”/g,(_,name,words)=>`Mluvil jsem s obyvatelem ${name}: „${translateLegacyText(words)}“` as any],
    [/([^:]+) said: “(.+)”/g,(_,name,words)=>`${name} řekl: „${translateLegacyText(words)}“` as any],
    [/([^:]+) told me: (.+)/g,(_,name,statement)=>simulationCs.heardBelief(name,translateLegacyText(statement)) as any],
    [/I keep noticing something different about this place\. What have you seen\?/g,'Pořád si na tomhle místě všímám něčeho jiného. Čeho sis všiml ty?'],
    [/(?:I )?spoke with ([^.]+) and watched how they responded\./gi,'Mluvil jsem s obyvatelem $1 a sledoval jeho reakci.'],
    [/Spoke with ([^.]+) about (?:a personal |an )observation\./gi,'Mluvil s obyvatelem $1 o svém pozorování.'],
    [/([^:]+) spoke to ([^:]+): “(.+)”/g,(_,speaker,listener,words)=>`${speaker} oslovil obyvatele ${listener}: „${translateLegacyText(words)}“` as any],[/([^:]+) to ([^:]+): “(.+)”/g,(_,speaker,listener,words)=>`${speaker} oslovil obyvatele ${listener}: „${translateLegacyText(words)}“` as any],
    [/I gave ([^ ]+) (.+)\./g,(_,name,item)=>`Dal jsem obyvateli ${name} předmět: ${translateLegacyText(item)}.` as any],[/([^ ]+) voluntarily gave me (.+)\./g,(_,name,item)=>`${name} mi dobrovolně dal ${translateLegacyText(item)}.` as any],
    [/The branch covering held its shape and created a small dry area\./g,'Zakrytí z větví udrželo tvar a vytvořilo malé suché místo.'],
    [/The branch arrangement sagged before the covering was complete\./g,'Uspořádání větví se prohnulo ještě před dokončením zakrytí.'],
    [/(?:I )?placed a note whose marks can be encountered by someone else\./gi,'Zanechal jsem poznámku, jejíž značky může objevit někdo další.'],
    [/(?:I )?could not find a safe route and stayed where I was\./gi,'Nenašel jsem bezpečnou cestu, a proto jsem zůstal na místě.'],
    [/The attempted exchange could not happen\./gi,simulationCs.exchangeFailed],[/The attempt failed safely: Target lies outside the (?:known )?physical world\./gi,simulationCs.invalidAction(simulationCs.outsideWorld)],
    [/First became aware of the shared landscape\./g,'Poprvé si uvědomil existenci společné krajiny.'],
    [/Recent experience suggests a pattern: /g,'Nedávné zkušenosti naznačují vzorec: '],[/During rest, I connected several recent experiences: /g,'Během odpočinku jsem propojil několik nedávných zkušeností: '],
    [/Repeat a promising material combination/g,simulationCs.learning.combinationSkill],[/Arrange a stable primitive covering/g,simulationCs.learning.coveringSkill],[/Personal experience on day (\d+)/g,'Vlastní zkušenost ze dne $1'],[/Inspect available materials/g,simulationCs.learning.observeMaterials],[/Repeat the arrangement and watch the conditions/g,simulationCs.learning.repeatArrangement],
    [/([^ ]+) produced a result that can be repeated\./g,(_,name)=>simulationCs.firstExperimentDescription(name) as any],[/([^ ]+) made a persistent primitive arrangement\./g,(_,name)=>simulationCs.firstConstructionDescription(name) as any],[/([^ ]+) gave ([^ ]+) (tree|bush|berries|branch|stone|note)\./g,(_,name,other,item)=>simulationCs.firstGiftDescription(name,other,localizeTerm(item)) as any],[/([^ ]+) placed durable marks (?:in|into) the world\./g,(_,name)=>simulationCs.firstNoteDescription(name) as any],
    [/([^ ]+) began calling a material arrangement “(.+)”\./g,(_,name,concept)=>simulationCs.firstNameDescription(name,translateLegacyText(concept)) as any],[/A name for the arrangement of (.+)\./g,(_,materials)=>simulationCs.bindingDescription(String(materials).split(/ and /).map(localizeTerm).join(' a ')) as any],[/([^’']+)[’']s binding/g,(_,name)=>simulationCs.bindingName(name) as any],
    [/Research marker: /g,'Výzkumný milník: '],[/First successful experiment/g,'První úspěšný pokus'],[/First successful construction/g,'První úspěšná stavba'],[/First voluntary gift/g,'První dobrovolný dar'],[/First written note/g,'První písemná poznámka'],[/First invented name/g,'První vytvořený název'],
    [/consolidated recent experiences into a personal lesson\./g,'spojil nedávné zkušenosti do osobního ponaučení.'],[/noticed a repetitive pattern and reconsidered an unanswered question\./g,'si všiml opakujícího se vzorce a znovu zvážil nezodpovězenou otázku.'],
    [/increasingly hungry; concentration is weakening/g,'rostoucí hlad oslabuje soustředění'],[/a mild empty feeling/g,'mírný pocit prázdného žaludku'],[/uncomfortably thirsty/g,'nepříjemná žízeň'],[/dry mouth/g,'sucho v ústech'],[/exhausted/g,'vyčerpaný'],[/somewhat tired/g,'poněkud unavený'],[/cool rain on exposed skin/g,'chladný déšť na nezakryté kůži'],[/cool night air/g,'chladný noční vzduch'],[/comfortable temperature/g,'příjemná teplota'],[/rested/g,'odpočatý'],[/physically comfortable/g,'tělesně v pohodě'],
    [/unfamiliar but recognizable/g,simulationCs.unfamiliar],[/familiar/g,simulationCs.familiar],
    [/a mature, rough-barked tree/g,simulationCs.object.tree],[/a low plant with dark edible-looking berries/g,simulationCs.object.berries],[/a dense flexible bush/g,simulationCs.object.bush],[/a dry fallen branch/g,simulationCs.object.branch],[/a pale flat stone/g,simulationCs.object.flatStone],[/a loose rounded stone/g,simulationCs.object.roundStone],
    [/How does (tree|bush|berries|branch|stone|note) change when handled in different conditions\?/g,(_,kind)=>`Jak se ${localizeTerm(kind)} mění při zacházení v různých podmínkách?` as any],
    [/\bapproaching (inspect|gather|speak|craft experiment|build|give|write)\b/gi,(_,action)=>simulationCs.approaching(localizeLegacyAction(action)) as any],[/Walking toward an unfamiliar location/g,simulationCs.walking],[/Looking around after the walk/g,simulationCs.lookingAfterWalk],[/Resting without a fixed task/g,simulationCs.resting],
  ];
  for(const [pattern,replacement] of replacements)text=text.replace(pattern,replacement as any);
  const residualTerms:Array<[RegExp,string]>=[
    [/\bgathered\b/gi,'sebral'],[/\binspected\b/gi,'prohlédl'],[/\band noticed how it sits in\b/gi,'a všiml si, jak leží v terénu'],[/\bfrom near\b/gi,'poblíž'],[/\bspoke with\b/gi,'mluvil s'],[/\band watched how they responded\b/gi,'a sledoval jeho reakci'],
    [/\bgrass\b/gi,'tráva'],[/\bdirt\b/gi,'hlína'],[/\bfertile\b/gi,'úrodná půda'],[/\bsand\b/gi,'písek'],[/\bshallow water\b/gi,'mělká voda'],[/\bdeep water\b/gi,'hluboká voda'],[/\brock\b/gi,'skála'],[/\btree\b/gi,'strom'],[/\bbush\b/gi,'keř'],[/\bberries\b/gi,'bobule'],[/\bbranch\b/gi,'větev'],[/\bstone\b/gi,'kámen'],[/\bnote\b/gi,'poznámka'],
  ];
  for(const [pattern,replacement] of residualTerms)text=text.replace(pattern,replacement);
  text=text.replace(/(?:sebral\s+){2,}/gi,'sebral ').replace(/(?:prohlédl\s+){2,}/gi,'prohlédl ');
  if(/(?:Sebral jsem|sebral).*(?:Sebral jsem|sebral|Prohlédl jsem si)|\bfrom\b/i.test(text)){
    const actorPrefix=text.match(/^([^:]{1,30}: )/)?.[1]||'';
    return `${actorPrefix}Starší záznam o sběru a prohlížení materiálů.`;
  }
  return text;
}

function localizeLegacyAction(value:string):string{
  const labels:Record<string,string>={inspect:'prohlížení',gather:'sběr',speak:'rozhovor','craft experiment':'materiálový pokus',build:'stavba',give:'předání',write:'psaní'};
  return labels[value.toLowerCase()]||value;
}

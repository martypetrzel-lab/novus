import { simulationCs, type Tile, type TileType, type WorldObject } from '@novus/shared';

export function seededRandom(seed:number){ let t=seed>>>0; return ()=>{ t+=0x6D2B79F5; let r=Math.imul(t^(t>>>15),1|t); r^=r+Math.imul(r^(r>>>7),61|r); return ((r^(r>>>14))>>>0)/4294967296; }; }

export function generateWorld(seed=78142,width=100,height=100){
  const random=seededRandom(seed); const tiles:Tile[]=[]; const objects:WorldObject[]=[]; const riverCenters:number[]=[];
  for(let y=0;y<height;y++) riverCenters[y]=Math.round(width*.48+Math.sin(y/12)*11+Math.sin(y/4.7)*3);
  for(let y=0;y<height;y++) for(let x=0;x<width;x++){
    const riverDistance=Math.abs(x-riverCenters[y]); const edgeNoise=Math.sin(x*.31+y*.17)*1.4; let type:TileType='grass';
    if(riverDistance<2+edgeNoise) type='deep_water'; else if(riverDistance<4+edgeNoise) type='shallow_water'; else if(riverDistance<7) type='sand';
    else if(riverDistance<13) type='fertile'; else if(Math.sin(x*.13)+Math.cos(y*.11)>1.45) type='rock'; else if(random()<.16) type='dirt';
    tiles.push({x,y,type,fertility:type==='fertile'?.95:type==='grass'?.62:.15,moisture:Math.max(.05,1-riverDistance/35)});
    if(type==='grass'||type==='fertile'){
      const forest=(Math.sin(x*.115)+Math.cos(y*.097)+random()*.7)>1.12;
      if(forest&&random()<.34) objects.push({id:`tree_${x}_${y}`,x,y,kind:'tree',amount:1,description:simulationCs.object.tree,blocks:true});
      else if(random()<.018) objects.push({id:`berry_${x}_${y}`,x,y,kind:'berries',amount:3+Math.floor(random()*5),description:simulationCs.object.berries});
      else if(random()<.022) objects.push({id:`bush_${x}_${y}`,x,y,kind:'bush',amount:1,description:simulationCs.object.bush});
      else if(random()<.018) objects.push({id:`branch_${x}_${y}`,x,y,kind:'branch',amount:1,description:simulationCs.object.branch});
    } else if((type==='dirt'||type==='sand')&&random()<.035) objects.push({id:`stone_${x}_${y}`,x,y,kind:'stone',amount:1,description:random()<.3?simulationCs.object.flatStone:simulationCs.object.roundStone});
  }
  return {tiles,objects,riverCenters};
}

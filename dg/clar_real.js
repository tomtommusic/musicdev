/* clarinette vue de face, façon schéma réaliste : corps, clés et leviers ; rouge = enfoncé */
function dgClarSvg(keys,size){
  const on=new Set(keys),NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 100 334');svg.setAttribute('class','dgsvg clar real'+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);svg.append(e);return e;};
  const st=(id,base)=>base+(on.has(id)?' on':'');
  /* corps : bec, barillet, corps du haut, corps du bas, pavillon */
  mk('path',{d:'M45,2 h10 l3,24 h-16 Z',class:'cbody'});
  mk('rect',{x:40,y:26,width:20,height:20,rx:2,class:'cbody'});
  mk('rect',{x:41,y:46,width:18,height:132,class:'cbody'});
  mk('rect',{x:41,y:180,width:18,height:110,class:'cbody'});
  mk('path',{d:'M41,290 h18 C60,306 70,320 80,330 H20 C30,320 40,306 41,290 Z',class:'cbody'});
  for(const y of[26,46,178,180,290])mk('line',{x1:39,y1:y,x2:61,y2:y,class:'cring'});
  /* pouce et clé de registre (au dos, dessinés à gauche) */
  mk('line',{x1:22,y1:66,x2:22,y2:73,class:'carm'});
  mk('circle',{cx:22,cy:62,r:4,class:st('Reg','cpad')});
  mk('path',{d:'M22,72 C27,78 27,86 22,90 C17,86 17,78 22,72 Z',class:st('Reg','clev')});
  mk('circle',{cx:22,cy:100,r:6.5,class:st('T','chole')});
  /* clé de la (tampon + palette) et clé de sol♯ (tampon + levier à droite) */
  mk('line',{x1:50,y1:60,x2:50,y2:68,class:'carm'});
  mk('circle',{cx:50,cy:56,r:4,class:st('A','cpad')});
  mk('path',{d:'M50,67 C55,73 55,81 50,86 C45,81 45,73 50,67 Z',class:st('A','clev')});
  mk('path',{d:'M46,65 H66 V72',class:'carm'});
  mk('circle',{cx:44,cy:65,r:3.8,class:st('Gs','cpad')});
  mk('rect',{x:63,y:70,width:6,height:22,rx:3,class:st('Gs','clev')});
  /* main gauche */
  mk('circle',{cx:50,cy:100,r:6.5,class:st('L1','chole')});
  mk('path',{d:'M38,103 q-4,6 0,12',class:st('EbBb','csliver')});
  mk('circle',{cx:50,cy:114,r:3.4,class:st('EbBb','cpad')});
  mk('circle',{cx:50,cy:128,r:7.5,class:st('L2','chole')});
  mk('circle',{cx:50,cy:147,r:5.5,class:st('L3','chole')});
  /* clés latérales (côté droit) */
  [['S1',108],['S2',120],['S3',132],['S4',144]].forEach(([id,y])=>{mk('line',{x1:59,y1:y+4,x2:63,y2:y+4,class:'carm'});mk('rect',{x:63,y,width:5,height:9,rx:2.5,class:st(id,'clev')});});
  /* auriculaire gauche (bas du corps du haut, à gauche) */
  [['CsGs',150],['lFs',158],['lE',166],['lF',174]].forEach(([id,y],i)=>{mk('line',{x1:41,y1:y+3,x2:37,y2:y+3,class:'carm'});mk('rect',{x:24+(i%2?1:0),y,width:13,height:7,rx:3.5,class:st(id,'clev')});});
  /* main droite */
  mk('circle',{cx:50,cy:200,r:6.8,class:st('R1','chole')});
  mk('circle',{cx:50,cy:221,r:6.8,class:st('R2','chole')});
  mk('circle',{cx:50,cy:243,r:6.8,class:st('R3','chole')});
  /* auriculaire droit (bas du corps du bas, à gauche) */
  [['rAb',256,0],['rFs',264,1],['rE',272,0],['rF',280,1]].forEach(([id,y,o])=>{mk('line',{x1:41,y1:y+3,x2:37,y2:y+3,class:'carm'});mk('rect',{x:23+o*2,y,width:14,height:7,rx:3.5,class:st(id,'clev')});});
  return svg;
}

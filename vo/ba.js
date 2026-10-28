/* ========== MODULE : Accompagnateur ==========
   Une grille d'accords (lead sheet) jouée par un petit groupe : batterie, basse et piano, dans le style choisi.
   Le tempo, la tonalité et l'intensité se changent pendant que ça joue ; la grille tourne en boucle. */
/* Chaque style a un ou plusieurs chiffres indicateurs (v) ; le premier est celui par défaut.
   m : temps par mesure ; sub : pas par temps (4 = doubles croches ; 3 = triolets : swing, shuffle, mesures composées en 12/8 ou 6/8) ;
   dr : batterie {élément:[pas]} (ou [[mesure 1],[mesure 2]] pour un motif sur deux mesures), vélocités facultatives dans dv ;
   bs : basse [[pas, degré, durée en pas]] (R fondamentale, 3, 5, 6, b7, 8, A approche chromatique vers l'accord suivant, W basse qui marche) ;
   cp : piano en accords [[pas, durée, vélocité]] ; ar : piano en arpège [[pas, degré]] ; shell : 3ce et 7e seulement (jazz) ; pw : quinte à vide (rock) */
const BA_STYLES={
  pop:{n:'Pop',v:{'4/4':{m:4,sub:4,dr:{kick:[0,8,10],snare:[4,12],hh:[0,2,4,6,8,10,12,14]},bs:[[0,'R',3],[6,'R',2],[8,'R',3],[14,'5',2]],cp:[[0,4,.5],[6,2,.4],[8,4,.45],[14,2,.4]]},
    '3/4':{m:3,sub:4,dr:{kick:[0,6],snare:[8],hh:[0,2,4,6,8,10]},bs:[[0,'R',4],[6,'5',2],[8,'R',4]],cp:[[0,4,.48],[4,4,.4],[8,4,.42]]},
    '6/8':{m:2,sub:3,dr:{kick:[0,5],snare:[3],hh:[0,1,2,3,4,5]},dv:{hh:.35},bs:[[0,'R',3],[3,'5',2],[5,'R',1]],cp:[[0,3,.45],[3,3,.42]]},
    '12/8':{m:4,sub:3,dr:{kick:[0,5,6],snare:[3,9],hh:[0,1,2,3,4,5,6,7,8,9,10,11]},dv:{hh:.33},bs:[[0,'R',5],[5,'R',1],[6,'5',5],[11,'A',1]],cp:[[0,3,.45],[3,3,.4],[6,3,.42],[9,3,.4]]},
    '5/4':{m:5,sub:4,dr:{kick:[0,6,12],snare:[8,16],hh:[0,2,4,6,8,10,12,14,16,18]},bs:[[0,'R',6],[6,'R',2],[12,'5',6],[18,'A',2]],cp:[[0,6,.48],[8,4,.4],[12,6,.45],[16,4,.4]]}}},
  rock:{n:'Rock',v:{'4/4':{m:4,sub:4,dr:{kick:[0,8,10],snare:[4,12],hh:[0,2,4,6,8,10,12,14]},bs:[[0,'R',2],[2,'R',2],[4,'R',2],[6,'R',2],[8,'R',2],[10,'R',2],[12,'R',2],[14,'R',2]],cp:[[0,6,.55],[8,6,.5]],pw:true},
    '3/4':{m:3,sub:4,dr:{kick:[0,6],snare:[8],hh:[0,2,4,6,8,10]},bs:[[0,'R',2],[2,'R',2],[4,'R',2],[6,'R',2],[8,'R',2],[10,'5',2]],cp:[[0,8,.55],[8,4,.5]],pw:true},
    '6/8':{m:2,sub:3,dr:{kick:[0,5],snare:[3],hh:[0,1,2,3,4,5]},dv:{hh:.4},bs:[[0,'R',1],[1,'R',1],[2,'R',1],[3,'R',1],[4,'R',1],[5,'5',1]],cp:[[0,3,.55],[3,3,.5]],pw:true},
    '12/8':{m:4,sub:3,dr:{kick:[0,6,8],snare:[3,9],hh:[0,1,2,3,4,5,6,7,8,9,10,11]},dv:{hh:.38},bs:[[0,'R',3],[3,'R',3],[6,'R',3],[9,'5',3]],cp:[[0,6,.55],[6,6,.5]],pw:true},
    '5/4':{m:5,sub:4,dr:{kick:[0,10,12],snare:[8,16],hh:[0,2,4,6,8,10,12,14,16,18]},bs:[[0,'R',2],[2,'R',2],[4,'R',2],[6,'R',2],[8,'R',2],[10,'R',2],[12,'R',2],[14,'R',2],[16,'R',2],[18,'5',2]],cp:[[0,8,.55],[12,8,.5]],pw:true},
    '7/8':{m:7,sub:2,dr:{kick:[0,8],snare:[4,10],hh:[0,2,4,6,8,10,12]},bs:[[0,'R',2],[2,'R',2],[4,'R',2],[6,'R',2],[8,'R',2],[10,'R',2],[12,'5',2]],cp:[[0,4,.55],[4,4,.5],[8,6,.5]],pw:true}}},
  ballad:{n:'Ballade',v:{
    '4/4':{m:4,sub:4,dr:{kick:[0,10],xs:[4,12],hh:[0,2,4,6,8,10,12,14]},dv:{hh:.3},bs:[[0,'R',8],[8,'5',6],[14,'A',2]],ar:[[0,'R'],[2,'5'],[4,'8'],[6,'3'],[8,'8'],[10,'5'],[12,'3'],[14,'5']]},
    '12/8':{m:4,sub:3,dr:{kick:[0,8],snare:[3,9],hh:[0,1,2,3,4,5,6,7,8,9,10,11]},dv:{hh:.3},bs:[[0,'R',6],[6,'5',5],[11,'A',1]],ar:[[0,'R'],[1,'5'],[2,'8'],[3,'3'],[4,'8'],[5,'5'],[6,'R'],[7,'5'],[8,'8'],[9,'3'],[10,'8'],[11,'5']]}}},
  funk:{n:'Funk',v:{'4/4':{m:4,sub:4,dr:{kick:[0,3,10],snare:[4,12],ghost:[7,9,15],hh:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},bs:[[0,'R',2],[3,'8',1],[6,'R',1],[8,'R',2],[10,'5',1],[11,'8',1],[14,'A',2]],cp:[[2,1,.45],[6,1,.4],[11,1,.45],[14,1,.4]]}}},
  swing:{n:'Swing (jazz)',v:{
    '4/4':{m:4,sub:3,dr:{ride:[0,3,5,6,9,11],hhp:[3,9],kick:[0,3,6,9]},dv:{kick:.22,ride:{0:.42,3:.55,5:.3,6:.42,9:.55,11:.3}},bs:[[0,'W',3],[3,'W',3],[6,'W',3],[9,'W',3]],cp:[[0,2,.4],[5,2,.42]],shell:true},
    '3/4':{m:3,sub:3,dr:{ride:[0,3,5,6],hhp:[3,6],kick:[0]},dv:{kick:.22,ride:{0:.5,3:.42,5:.3,6:.42}},bs:[[0,'W',3],[3,'W',3],[6,'W',3]],cp:[[3,2,.38],[6,2,.36]],shell:true}}},
  shuffle:{n:'Blues shuffle',v:{
    '4/4':{m:4,sub:3,dr:{hh:[0,2,3,5,6,8,9,11],kick:[0,6],snare:[3,9]},dv:{hh:{0:.5,2:.3,3:.5,5:.3,6:.5,8:.3,9:.5,11:.3}},bs:[[0,'R',2],[2,'R',1],[3,'3',2],[5,'3',1],[6,'5',2],[8,'5',1],[9,'6',2],[11,'6',1]],cp:[[2,1,.38],[5,1,.4],[8,1,.38],[11,1,.4]]},
    '12/8':{m:4,sub:3,dr:{hh:[0,2,3,5,6,8,9,11],kick:[0,6],snare:[3,9]},dv:{hh:{0:.5,2:.3,3:.5,5:.3,6:.5,8:.3,9:.5,11:.3}},bs:[[0,'R',2],[2,'R',1],[3,'3',2],[5,'3',1],[6,'5',2],[8,'5',1],[9,'6',2],[11,'6',1]],cp:[[2,1,.38],[5,1,.4],[8,1,.38],[11,1,.4]]}}},
  bossa:{n:'Bossa-nova',v:{'4/4':{m:4,sub:4,dr:{kick:[0,6,8,14],xs:[[0,6,12],[4,10]],hh:[0,2,4,6,8,10,12,14]},dv:{kick:.6,hh:.3},bs:[[0,'R',6],[6,'5',2],[8,'5',6],[14,'R',2]],cp:[[0,2,.36],[6,2,.34],[10,2,.34],[12,3,.34]]}}},
  reggae:{n:'Reggae (one drop)',v:{'4/4':{m:4,sub:4,dr:{kick:[8],xs:[8],hh:[0,2,4,6,8,10,12,14]},dv:{hh:.35},bs:[[0,'R',3],[4,'5',2],[8,'R',3],[11,'3',2],[14,'5',2]],cp:[[4,1,.45],[12,1,.45]]}}},
  country:{n:'Country',v:{
    '4/4':{m:4,sub:4,dr:{kick:[0,8],snare:[4,12],hh:[0,2,4,6,8,10,12,14]},bs:[[0,'R',4],[8,'5',4]],cp:[[4,2,.45],[12,2,.45]]},
    '2/4':{m:2,sub:4,dr:{kick:[0],snare:[4],hh:[0,2,4,6]},bs:[[0,'R',4]],cp:[[4,2,.45]],alt:true},
    '3/4':{m:3,sub:4,dr:{kick:[0],snare:[4,8],hh:[0,2,4,6,8,10]},dv:{snare:.4,hh:.35},bs:[[0,'R',4]],cp:[[4,3,.42],[8,3,.42]],alt:true}}},
  waltz:{n:'Valse',v:{'3/4':{m:3,sub:4,dr:{kick:[0],hh:[4,8],snare:[4,8]},dv:{snare:.3,hh:.4},bs:[[0,'R',4]],cp:[[4,3,.4],[8,3,.4]],alt:true}}},
  afro:{n:'Afro-cubain',v:{
    '12/8':{m:4,sub:3,dr:{bell:[0,2,4,5,7,9,11],kick:[0,6],xs:[3,9],hhp:[3,9]},dv:{bell:.45,kick:.7},bs:[[0,'R',3],[5,'5',1],[6,'R',3],[11,'5',1]],cp:[[2,1,.36],[5,1,.38],[8,1,.36],[11,1,.38]]},
    '6/8':{m:2,sub:3,dr:{bell:[0,2,3,5],kick:[0],xs:[3],hhp:[3]},dv:{bell:.45,kick:.7},bs:[[0,'R',3],[3,'5',3]],cp:[[2,1,.36],[5,1,.38]]}}}};
const BA_PRESETS=[
  ['Pop : I – V – vi – IV','C | G | Am | F','pop'],
  ['Doo-wop : I – vi – IV – V','C | Am | F | G','ballad'],
  ['Blues en 12 mesures','A7 | D7 | A7 | A7 | D7 | D7 | A7 | A7 | E7 | D7 | A7 | E7','shuffle'],
  ['Jazz : ii – V – I','Dm7 | G7 | Cmaj7 | Cmaj7','swing'],
  ['Jazz : anatole (I – vi – ii – V)','Cmaj7 Am7 | Dm7 G7 | Cmaj7 Am7 | Dm7 G7','swing'],
  ['Mineur : i – VI – III – VII','Am | F | C | G','rock'],
  ['Funk sur un accord','E7 | E7 | E7 | E7','funk'],
  ['Bossa : ii – V – I','Dm7 | G7 | Cmaj7 | Cmaj7','bossa'],
  ['Valse : I – IV – V – I','C | F | G7 | C','waltz'],
  ['Valse jazz : ii – V – I','Dm7 | G7 | Cmaj7 | Cmaj7','swing','3/4'],
  ['Ballade en 12/8 : I – vi – IV – V','C | Am | F | G','ballad','12/8'],
  ['Reggae : I – IV','G | C | G | C','reggae'],
  ['Country : I – IV – V','G | G | C | C | D | D | G | G','country'],
  ['Cadence andalouse','Am | G | F | E7','afro']];
const BA_S=tlLoad('atelier-ba',{grid:'C | G | Am | F',style:'pop',tempo:96,tr:0,dr:true,bs:true,pn:true,int:2,loop:true,ci:true,meter:''});if(!BA_S.vol)BA_S.vol={dr:.8,bs:.8,pn:.8};
const BA_AB={swing:1,bossa:1};   /* contrebasse (sinon basse électrique aux doigts) */
const BA_BASE={dr:1.25,bs:.2,pn:1.1};   /* équilibre de départ : la basse de synthèse est naturellement forte, le piano plus doux */
const BA_MIX={swing:{dr:2.4},ballad:{dr:1.3},bossa:{dr:1.3}};   /* certains grooves sont joués plus légèrement : on les remonte */
const baGain=k=>BA_BASE[k]*((BA_MIX[BA_S.style]||{})[k]||1)*BA_S.vol[k]*1.25;
const BA={sess:null};
/* chiffre indicateur : seulement ceux que le style connaît */
function baMeters(){return Object.keys((BA_STYLES[BA_S.style]||BA_STYLES.pop).v);}
function baEff(){const st=BA_STYLES[BA_S.style]||BA_STYLES.pop,ms=Object.keys(st.v);if(!ms.includes(BA_S.meter))BA_S.meter=ms[0];return Object.assign({n:st.n},st.v[BA_S.meter]);}
const BA_LET={C:0,D:2,E:4,F:5,G:7,A:9,B:11},BA_FR=[['Do',0],['Ré',2],['Re',2],['Mi',4],['Fa',5],['Sol',7],['La',9],['Si',11]];
const BA_Q=[['maj9',[0,4,7,11,14]],['maj7',[0,4,7,11]],['M7',[0,4,7,11]],['Δ7',[0,4,7,11]],['Δ',[0,4,7,11]],['m7b5',[0,3,6,10]],['m7♭5',[0,3,6,10]],['ø7',[0,3,6,10]],['ø',[0,3,6,10]],
  ['dim7',[0,3,6,9]],['°7',[0,3,6,9]],['dim',[0,3,6]],['°',[0,3,6]],['7sus4',[0,5,7,10]],['sus4',[0,5,7]],['sus2',[0,2,7]],['sus',[0,5,7]],['add9',[0,4,7,14]],
  ['m9',[0,3,7,10,14]],['m7',[0,3,7,10]],['-7',[0,3,7,10]],['min7',[0,3,7,10]],['m6',[0,3,7,9]],['min',[0,3,7]],['m',[0,3,7]],['-',[0,3,7]],
  ['aug',[0,4,8]],['+',[0,4,8]],['13',[0,4,7,10,14,21]],['9',[0,4,7,10,14]],['7',[0,4,7,10]],['6',[0,4,7,9]],['5',[0,7]],['',[0,4,7]]];
const BA_NAMES_SH=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
/* lit un accord : « C », « F♯m7 », « B♭maj7 », « G7/B », « Rém », « Sol7 » */
function baParse(tok){
  let s=tok.trim();if(!s||s==='%'||s==='/')return null;let root=null,i=0;
  for(const[fr,pc]of BA_FR)if(s.startsWith(fr)){root=pc;i=fr.length;break;}
  if(root==null){const L=s[0].toUpperCase();if(!(L in BA_LET))return{bad:tok};root=BA_LET[L];i=1;}
  if(s[i]==='#'||s[i]==='♯'){root++;i++;}else if(s[i]==='b'||s[i]==='♭'){root--;i++;}
  let rest=s.slice(i),bass=null;const sl=rest.indexOf('/');
  if(sl>=0){const b=baParse(rest.slice(sl+1));rest=rest.slice(0,sl);if(b&&!b.bad)bass=b.root;}
  const q=BA_Q.find(([k])=>rest===k)||BA_Q.find(([k])=>k&&rest.startsWith(k));if(!q)return{bad:tok};
  return{root:((root%12)+12)%12,iv:q[1],q:q[0],bass,tok};
}
/* grille : mesures séparées par « | », 1 à 4 accords par mesure (espaces) ; « % » répète la mesure précédente */
function baGrid(txt){
  const bars=[],bad=[];let prev=null;
  for(const raw of txt.replace(/\n/g,'|').split('|')){const b=raw.trim();if(!b)continue;
    if(b==='%'&&prev){bars.push(prev);continue;}
    const ch=b.split(/\s+/).map(baParse).filter(x=>x);ch.filter(x=>x.bad).forEach(x=>bad.push(x.bad));
    const ok=ch.filter(x=>!x.bad);if(ok.length){bars.push(ok);prev=ok;}}
  return{bars,bad};
}
const baName=c=>BA_NAMES_SH[(c.root+BA_S.tr+120)%12]+(c.q==='m'||c.q==='-'||c.q==='min'?'m':c.q==='M7'||c.q==='Δ'||c.q==='Δ7'?'maj7':c.q)+(c.bass!=null?'/'+BA_NAMES_SH[(c.bass+BA_S.tr+120)%12]:'');
/* voicing du piano : chaque note de l'accord placée près de do4, sans la doubler */
function baVoice(c,prev){
  const pcs=c.iv.slice(0,4).map(x=>(c.root+BA_S.tr+x)%12);const out=[];
  for(const pc of pcs){let best=null;for(let m=52;m<=72;m++)if((m-pc)%12===0&&(best==null||Math.abs(m-62)<Math.abs(best-62)))best=m;out.push(best);}
  return[...new Set(out)].sort((a,b)=>a-b);
}
const baTh=c=>c.iv.includes(3)?3:c.iv.includes(4)?4:c.iv.includes(5)?5:c.iv.includes(2)?2:7;   /* « tierce » : la 4te d'un sus4, la 2de d'un sus2, la quinte d'un power chord */
const baF5=c=>c.iv.includes(6)?6:c.iv.includes(8)?8:7;
function baBassNote(c,deg,next){
  /* note écrite (A.bass sonne une octave plus bas) : fondamentale entendue entre la1 et sol♯2, le vrai registre de la basse */
  const reg=pc=>pc<9?pc+48:pc+36;
  const r=((c.root+BA_S.tr)%12+12)%12;let base=reg(r);
  if(c.bass!=null&&deg==='R'){const b=((c.bass+BA_S.tr)%12+12)%12;base=reg(b);}
  const third=baTh(c),fifth=baF5(c);
  switch(deg){case'5':return base+fifth;case'8':return base+12;case'b7':return base+(c.iv.includes(11)?11:10);case'3':return base+third;case'6':return base+((c.iv.includes(10)&&c.iv.length>3&&c.iv[3]===10)||(c.iv.includes(3)&&!c.iv.includes(9))?10:9);   /* sur un accord mineur : 7e mineure (la 6te majeure sonne faux en mineur naturel) */
    case'A':{if(!next)return base+fifth;const n=((next.root+BA_S.tr)%12+12)%12,nb=reg(n);
      /* note de passage vers l'accord suivant : on préfère une note de la gamme de l'accord en cours (ex. G7 → C : si, pas do♯) */
      const sc=baScale(c).map(x=>(r+x)%12),ok=[nb-1,nb+1,nb+2,nb-2].filter(m=>sc.includes(((m%12)+12)%12));
      return ok.length?ok[0]:nb-1;}
    default:return base;}
}
/* ---- basse qui marche (walking bass) ----
   Une noire par temps. Temps 1 : fondamentale (ou, si l'accord se répète, une autre note de l'accord pour relancer la ligne).
   Dernier temps avant le changement : note d'approche (demi-ton au-dessus ou au-dessous de la fondamentale suivante,
   parfois sa quinte : approche « dominante »). Entre les deux : la ligne avance vers la cible, notes de l'accord sur les temps forts,
   notes de la gamme de l'accord (mode) sur les temps faibles, sans répéter la même note. Hauteurs entendues : la1 à ré3. */
const BA_LO=33,BA_HI=45,BA_TOP=50;
function baScale(c){const q=c.q,iv=c.iv;
  if(/m7b5|m7♭5|ø/.test(q))return[0,1,3,5,6,8,10];
  if(/dim|°/.test(q))return[0,2,3,5,6,8,9,11];
  if(/aug|\+/.test(q))return[0,2,4,6,8,10];
  if(/sus/.test(q))return iv.includes(10)?[0,2,5,7,10]:[0,2,5,7];
  if(!iv.includes(3)&&!iv.includes(4))return[0,2,7];   /* power chord */
  const minor=iv.includes(3),dom=iv.includes(10)&&!minor,maj7=iv.includes(11);
  /* notes « sûres » quelle que soit la tonalité : pas de 6te sur un accord mineur (dorien ou éolien ?),
     pas de 4te sur un accord majeur (ionien ou lydien ?) */
  if(minor)return iv.includes(9)?[0,2,3,5,7,9]:[0,3,5,7,10];   /* ni 2de (phrygien ?) ni 6te */
  return dom?[0,2,4,5,7,9,10]:maj7?[0,2,4,7,9,11]:[0,2,4,7,9];}
const baPc=c=>((c.root+BA_S.tr)%12+12)%12;
function baNear(pc,ref,lo=BA_LO,hi=BA_TOP){let best=null;for(let m=lo;m<=hi;m++)if((m-pc+1200)%12===0&&(best==null||Math.abs(m-ref)<Math.abs(best-ref)))best=m;return best;}
function baWalk(ch,nx,beats,prev,sameAsPrev){
  const r=baPc(ch),ref=prev==null?40:prev,R=Math.random;
  const tones=ch.iv.map(x=>(r+x)%12),scale=baScale(ch).map(x=>(r+x)%12);
  /* départ */
  let first=baNear(r,ref,BA_LO,BA_HI);
  if(sameAsPrev&&prev!=null){const cand=[...new Set(tones)].filter(pc=>pc!==r).map(pc=>baNear(pc,prev)).filter(m=>m!==prev);if(cand.length)first=cand.sort((a,b)=>Math.abs(a-prev)-Math.abs(b-prev))[0];}
  const line=[first];if(beats===1)return line;
  /* cible : fondamentale suivante ; si c'est le même accord, on vise l'octave ou la quinte pour faire avancer la ligne */
  const nr=nx?baPc(nx):r;let target=baNear(nr,first);
  if(nx&&nr===r){target=first+12<=BA_TOP?first+12:first-12>=BA_LO?first-12:first+7;}
  /* note d'approche du dernier temps */
  const approach=last=>{const opts=[target-1,target+1];if(R()<.2)opts.push(target+7>BA_TOP?target-5:target+7);
    let ok=opts.filter(m=>m>=BA_LO-2&&m<=BA_TOP&&m!==last);
    /* approche : demi-ton dans la gamme de l'accord en cours si possible (pas de do♯ sur G7 avant C) */
    let inSc=ok.filter(m=>scale.includes(m%12));
    if(!inSc.length)inSc=[target+2,target-2,target-5,target+7,target+3,target-3,target+4,target-4].filter(m=>m>=BA_LO-2&&m<=BA_TOP&&m!==last&&scale.includes(m%12));   /* sinon : un ton au-dessus/au-dessous, ou la quinte */
    if(!inSc.length){for(let m=BA_LO-2;m<=BA_TOP;m++)if(m!==last&&scale.includes(m%12))inSc.push(m);inSc.sort((x,y)=>Math.abs(x-target)-Math.abs(y-target));inSc=inSc.slice(0,1);}
    if(inSc.length)ok=inSc;ok.sort((a,b)=>Math.abs(a-last)-Math.abs(b-last)+(R()-.5)*1.5);return ok[0]??target-1;};
  for(let k=1;k<beats-1;k++){
    const prevN=line[k-1],goal=first+(target-first)*k/(beats-1),strong=k%2===0;
    const pool=[];for(let m=BA_LO-2;m<=BA_TOP;m++){const pc=m%12;if(m===prevN)continue;if(strong?tones.includes(pc):scale.includes(pc))pool.push(m);}
    if(!pool.length)for(let m=BA_LO;m<=BA_TOP;m++)if(scale.includes(m%12)&&m!==prevN)pool.push(m);
    pool.sort((a,b)=>(Math.abs(a-goal)+Math.abs(a-prevN)*.35+R()*.8)-(Math.abs(b-goal)+Math.abs(b-prevN)*.35+R()*.8));
    line.push(pool[0]);}
  line.push(approach(line[line.length-1]));
  return line;
}
function baStop(){const s=BA.sess;if(!s)return;BA.sess=null;clearInterval(s.timer);s.timers.forEach(clearTimeout);
  try{s.g.gain.setTargetAtTime(0,A.ctx.currentTime,.05);setTimeout(()=>s.g.disconnect(),400);}catch(e){}
  MOD.ba.now(-1);MOD.ba.ui&&MOD.ba.ui();}
function baPlay(){
  baStop();const{bars}=baGrid(BA_S.grid);if(!bars.length){feedback('Écris au moins un accord dans la grille.','bad');return;}
  const c=A.init();if(typeof qzUnmute==='function')qzUnmute();if(typeof stop==='function')stop();
  const g=c.createGain();g.gain.value=1.3;g.connect(A.out);
  const bus=k=>{const x=c.createGain();x.gain.value=baGain(k);x.connect(g);return x;};
  const s={g,gD:bus('dr'),gB:bus('bs'),gP:bus('pn'),timers:[],timer:0,bar:BA_S.ci?-1:0,step:0,next:c.currentTime+.12,pass:0,prevV:null,ending:false};BA.sess=s;
  const lag=typeof audioLag==='function'?audioLag():0;
  const tick=()=>{if(BA.sess!==s)return;if(S.mod!=='ba'){baStop();return;}const now=c.currentTime;
    while(s.next<now+.2){
      const st=baEff(),spb=st.m*st.sub,sd=60/BA_S.tempo/st.sub,t=s.next,I=BA_S.int;
      if(s.bar<0){ /* décompte : un clic par temps */
        if(s.step%st.sub===0){A.click(t,s.step===0,g);const b=s.step/st.sub;s.timers.push(setTimeout(()=>{if(BA.sess===s)MOD.ba.count(b+1);},Math.max(0,(t+lag-now)*1000)));}
      }else{
        const bars2=baGrid(BA_S.grid).bars;if(!bars2.length){baStop();return;}
        const bi=s.bar%bars2.length,bar=bars2[bi],n=bar.length,per=Math.max(1,Math.round(spb/n)),ci=Math.min(n-1,Math.floor(s.step/per)),ch=bar[ci];
        const nextCh=ci+1<n?bar[ci+1]:bars2[(bi+1)%bars2.length][0],chStart=s.step%per===0;
        if(s.step===0){const b=bi;s.timers.push(setTimeout(()=>{if(BA.sess===s)MOD.ba.now(b);},Math.max(0,(t+lag-now)*1000)));}
        const fill=BA_S.dr&&I>=2&&(bi===bars2.length-1||s.bar%4===3)&&s.step>=spb-st.sub;   /* petit roulement sur le dernier temps */
        const vel=[0,.55,.8,1][I];
        /* batterie */
        if(BA_S.dr){const D=st.dr;
          if(s.step===0&&(s.bar===0||(s.bar%4===0&&I>=2))&&!s.ending)drHit('crash',t,s.gD,.6*vel);
          if(fill){const k=s.step-(spb-st.sub);drHit(k<st.sub/2?'snare':(k%2?'mtom':'ftom'),t,s.gD,.75*vel);}
          else for(const[id,pos]of Object.entries(D)){
            const P=Array.isArray(pos[0])?pos[s.bar%pos.length]:pos;if(!P.includes(s.step))continue;
            const dvv=(st.dv||{})[id];let v=dvv==null?(id==='ghost'?.22:id==='kick'?.9:id==='snare'?.85:id==='hh'?(s.step%st.sub===0?.55:.38):id==='ride'?.5:.7):(typeof dvv==='number'?dvv:(dvv[s.step]??.4));
            let hid=id==='ghost'?'snare':id==='bell'?'ride':id;if(I===3&&id==='hh'&&s.step%(st.sub*2)===st.sub)hid='hho';if(I===1&&id==='hh')v*=.7;
            if(I===1&&id==='kick'&&s.step%st.sub!==0)continue;
            drHit(hid,t,s.gD,v*vel);}}
        /* basse */
        if(BA_S.bs)for(const[pos,deg,len]of st.bs){if(pos!==s.step)continue;
          let m;if(deg==='W'){ /* basse qui marche : ligne calculée au début de chaque accord */
            if(chStart||!s.wl){const same=s.wch&&s.wch.root===ch.root&&s.wch.q===ch.q;s.wl=baWalk(ch,nextCh,Math.max(1,Math.round(per/st.sub)),s.wprev,same);s.wch=ch;}
            const k=Math.floor((s.step%per)/st.sub);m=(s.wl[Math.min(k,s.wl.length-1)])+12;s.wprev=m-12;}
          else m=baBassNote(ch,st.alt&&deg==='R'&&s.bar%2===1?'5':deg,nextCh);
          A.bass(m,t,len*sd*.92,.75*vel+.1,s.gB,BA_AB[BA_S.style]?'ab':'eb');}
        /* piano */
        if(BA_S.pn){
          if(st.ar){for(const[pos,deg]of st.ar){if(pos!==s.step)continue;            const R0=48+((ch.root+BA_S.tr)%12+12)%12,f5=baF5(ch),th=baTh(ch);
            const m=deg==='R'?R0:deg==='5'?R0+f5:deg==='8'?R0+12:R0+12+th;
            A.piano(Math.min(84,m),t,sd*4,.32*vel+.08,s.gP);}}
          else for(const[pos,len,v]of st.cp){if(pos!==s.step)continue;
            let notes=baVoice(ch);if(st.shell){const r=((ch.root+BA_S.tr)%12+12)%12;const th=baTh(ch),sv=ch.iv.includes(11)?11:ch.iv.includes(10)?10:ch.iv.includes(9)?9:7;notes=[48+((r+th)%12),48+((r+sv)%12)].map(x=>x<55?x+12:x).sort((a,b)=>a-b);}
            if(st.pw){const r=((ch.root+BA_S.tr)%12+12)%12;const b=48+r>=55?36+r:48+r;notes=[b,b+baF5(ch),b+12];}
            notes.forEach(m=>A.piano(m,t,len*sd*.9,v*vel+.05,s.gP));}
        }
      }
      s.next+=sd;s.step++;
      const st2=baEff();
      if(s.step>=(s.bar<0?st2.m*st2.sub:st2.m*st2.sub)){s.step=0;s.bar++;
        const L=baGrid(BA_S.grid).bars.length;
        if(s.bar>0&&s.bar%L===0&&!BA_S.loop){ /* fin : accord final tenu */
          const bars2=baGrid(BA_S.grid).bars,last=bars2[0][0],t2=s.next;
          if(BA_S.pn)baVoice(last).forEach(m=>A.piano(m,t2,2.5,.5,s.gP));if(BA_S.bs)A.bass(baBassNote(last,'R'),t2,2.5,.8,s.gB,BA_AB[BA_S.style]?'ab':'eb');if(BA_S.dr){drHit('crash',t2,s.gD,.7);drHit('kick',t2,s.gD,.9);}
          s.timers.push(setTimeout(()=>{if(BA.sess===s)baStop();},Math.max(0,(t2+2.6-now)*1000)));s.next=1e12;break;}}
    }};
  tick();s.timer=setInterval(tick,25);MOD.ba.ui&&MOD.ba.ui();
}
MOD.ba.mount=function(){const M=this;M.root=el('div',{class:'tl baw'});$('#answer').replaceChildren(M.root);};
MOD.ba.fresh=function(){
  const M=this,save=()=>tlSave('atelier-ba',BA_S);
  const styleSel=sel('ba_style',Object.entries(BA_STYLES).map(([k,v])=>[k,T(v.n)]),BA_S.style,v=>{BA_S.style=v;baEff();save();fillMeters();M.paint();const se=BA.sess;if(se){se.gD.gain.value=baGain('dr');se.gB.gain.value=baGain('bs');se.gP.gain.value=baGain('pn');}});
  const preSel=sel('ba_pre',[['',T('Choisir une grille…')],...BA_PRESETS.map((p,i)=>[i,T(p[0])])],'',v=>{if(v==='')return;const p=BA_PRESETS[+v];BA_S.grid=p[1];BA_S.style=p[2];BA_S.meter=p[3]||'';baEff();styleSel.value=p[2];area.value=p[1];save();fillMeters();M.paint();});
  const area=el('textarea',{id:'ba_grid',class:'qzin bagrid',rows:'3',spellcheck:'false',autocapitalize:'off',autocomplete:'off','aria-label':'Grille d\'accords'});area.value=BA_S.grid;
  area.addEventListener('input',()=>{BA_S.grid=area.value;save();M.paint();});
  /* constructeur d'accords : fondamentale + type (+ basse), puis ajout dans la grille */
  const B={root:0,q:'',bass:''};
  const ROOTS=[['C','do'],['C♯','do♯'],['D','ré'],['E♭','mi♭'],['E','mi'],['F','fa'],['F♯','fa♯'],['G','sol'],['A♭','la♭'],['A','la'],['B♭','si♭'],['B','si']];
  const QS=[['','Majeur'],['m','Mineur'],['7','7'],['maj7','maj7'],['m7','m7'],['6','6'],['m6','m6'],['9','9'],['add9','add9'],['sus2','sus2'],['sus4','sus4'],['7sus4','7sus4'],['dim','dim (°)'],['dim7','°7'],['m7b5','m7♭5 (ø)'],['aug','aug (+)']];
  const sym=()=>ROOTS[B.root][0]+B.q+(B.bass!==''?'/'+ROOTS[+B.bass][0]:'');
  const prev=el('b',{class:'baprev','aria-live':'polite'});
  const rootBtns=ROOTS.map(([l,fr],i)=>el('button',{type:'button',class:'bakey','aria-pressed':'false',title:fr,onclick:()=>{B.root=i;paintB();}},l));
  const qBtns=QS.map(([q,l])=>el('button',{type:'button',class:'bakey baq','aria-pressed':'false',onclick:()=>{B.q=q;paintB();}},T(l)));
  const bassSel=sel('ba_bass',[['',T('Aucune')],...ROOTS.map((r,i)=>[i,r[0]])],'',v=>{B.bass=v;paintB();});
  const paintB=()=>{rootBtns.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===B.root)));qBtns.forEach((b,i)=>b.setAttribute('aria-pressed',String(QS[i][0]===B.q)));prev.textContent=sym();};
  const setGrid=g=>{BA_S.grid=g;area.value=g;save();M.paint();};
  const addChord=()=>{const g=BA_S.grid.replace(/\s+$/,'');setGrid(g?g+' '+sym():sym());};
  const addBar=()=>{const g=BA_S.grid.replace(/\s+$/,'');if(!g||/\|$/.test(g))return;setGrid(g+' |');};
  const addRepeat=()=>{let g=BA_S.grid.replace(/\s+$/,'');if(!g)return;if(!/\|$/.test(g))g+=' |';setGrid(g+' %');};
  const undo=()=>{let g=BA_S.grid.replace(/\s+$/,'');g=g.replace(/\s*(\||[^\s|]+)$/,'');setGrid(g);};
  const hear=()=>{const c=baParse(sym());if(!c||c.bad)return;const ac=A.init();if(typeof qzUnmute==='function')qzUnmute();const t0=ac.currentTime+.03;
    baVoice(c).forEach(m=>A.piano(m,t0,1.4,.42));A.bass(baBassNote(c,'R'),t0,1.4,.7);};
  const meterSel=el('select',{id:'ba_meter'});meterSel.addEventListener('change',()=>{BA_S.meter=meterSel.value;save();M.paint();});
  /* seulement les chiffres indicateurs qui conviennent au style */
  const fillMeters=()=>{baEff();const ms=baMeters();meterSel.replaceChildren(...ms.map(m=>{const o=el('option',{value:m},m);if(m===BA_S.meter)o.selected=true;return o;}));meterSel.disabled=ms.length<2;};
  const builder=el('div',{class:'babuild'},
    el('div',{class:'bbrow'},el('span',{class:'fl'},'Fondamentale'),el('div',{class:'bakeys'},rootBtns)),
    el('div',{class:'bbrow'},el('span',{class:'fl'},'Type d\'accord'),el('div',{class:'bakeys'},qBtns)),
    el('div',{class:'bbrow bbline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Basse (optionnel)'),bassSel),
      el('div',{class:'bbadd'},prev,btn('▶',hear,'quiet sq'),btn('+ Ajouter l\'accord',addChord,'primary'))),
    el('div',{class:'bbrow bbtools'},btn('| Barre de mesure',addBar,'quiet'),btn('% Répéter la mesure',addRepeat,'quiet'),btn('⌫ Retirer le dernier',undo,'quiet'),btn('Effacer la grille',()=>setGrid(''),'quiet')));
  const tl=el('b',{class:'batv'}),tr=el('input',{type:'range',min:40,max:240,step:1,'aria-label':'Tempo'});
  const setT=v=>{BA_S.tempo=Math.max(40,Math.min(240,Math.round(v)));tl.textContent=`${BA_S.meter==='12/8'||BA_S.meter==='6/8'?'♩.':BA_S.meter==='7/8'?'♪':'♩'} = ${BA_S.tempo}`;tr.value=BA_S.tempo;save();};
  tr.addEventListener('input',()=>setT(+tr.value));
  const taps=[];const tap=()=>{const n=performance.now();if(taps.length&&n-taps[taps.length-1]>2000)taps.length=0;taps.push(n);if(taps.length>6)taps.shift();if(taps.length>=2)setT(60000/((taps[taps.length-1]-taps[0])/(taps.length-1)));};
  const trLab=el('b',{class:'batr'});const setTr=d=>{BA_S.tr=((BA_S.tr+d+17)%12)-5;save();M.paint();};
  const fader=(k,lab)=>{const r=el('input',{type:'range',min:0,max:100,step:1,value:Math.round(BA_S.vol[k]*100),'aria-label':lab}),v=el('span',{class:'bavv'});
    const upd=()=>{BA_S.vol[k]=+r.value/100;BA_S[k]=BA_S.vol[k]>0;v.textContent=r.value==='0'?T('coupé'):r.value+' %';const se=BA.sess,gn=se&&{dr:se.gD,bs:se.gB,pn:se.gP}[k];if(gn)gn.gain.setTargetAtTime(baGain(k),A.ctx.currentTime,.03);save();};
    r.addEventListener('input',upd);v.textContent=Math.round(BA_S.vol[k]*100)+' %';if(!BA_S[k]){r.value=0;v.textContent=T('coupé');}
    return el('label',{class:'bafader'},el('span',{class:'fl'},lab),r,v);};
  const tog=(k,lab)=>{const i=el('input',{type:'checkbox'});i.checked=!!BA_S[k];i.addEventListener('change',()=>{BA_S[k]=i.checked;save();});return el('label',{class:'chk'},i,lab);};
  const intSel=sel('ba_int',[[1,T('Doux')],[2,T('Normal')],[3,T('Intense')]],BA_S.int,v=>{BA_S.int=+v;save();});
  M.play=btn('▶ Jouer',()=>BA.sess?baStop():baPlay(),'primary');
  M.cnt=el('span',{class:'bacount','aria-live':'polite'});
  M.cells=el('div',{class:'bacells'});M.err=el('p',{class:'hint baerr',hidden:true});
  M.ui=()=>{M.play.textContent=BA.sess?T('■ Arrêter'):T('▶ Jouer');M.play.classList.toggle('on',!!BA.sess);};
  /* la grille toute prête reste affichée tant que la grille et le style n'ont pas été modifiés */
  const syncPre=()=>{const i=BA_PRESETS.findIndex(p=>p[1].trim()===String(BA_S.grid).trim()&&p[2]===BA_S.style);preSel.value=i<0?'':String(i);};
  M.paint=()=>{syncPre();const{bars,bad}=baGrid(BA_S.grid),st=baEff();
    M.cells.style.setProperty('--per',st.m===3?3:4);
    M.cells.replaceChildren(...bars.map((b,i)=>el('div',{class:'bacell','data-i':i},el('small',{},String(i+1)),el('span',{},b.map(baName).join('  ')))));
    M.err.hidden=!bad.length;M.err.textContent=bad.length?T('Accords non reconnus : {0}').replace('{0}',bad.join(', ')):'';
    setT(BA_S.tempo);
    trLab.textContent=BA_S.tr?(BA_S.tr>0?'+':'')+BA_S.tr+' ½':'0';};
  M.root.replaceChildren(
    el('div',{class:'bahead'},el('h2',{},'Accompagnateur',typeof betaTag==='function'?betaTag():null),el('p',{class:'hint'},'Écris une grille d\'accords, choisis un style : batterie, basse et piano t\'accompagnent en boucle.')),
    el('div',{class:'bapanel'},
      el('div',{class:'babar'},M.play,M.cnt,el('button',{type:'button',class:'btn quiet sq','aria-label':'Plus lent',onclick:()=>setT(BA_S.tempo-4)},'−'),tl,el('button',{type:'button',class:'btn quiet sq','aria-label':'Plus rapide',onclick:()=>setT(BA_S.tempo+4)},'+'),btn('Tap',tap,'quiet')),
      tr,M.cells,M.err),
    el('section',{class:'mtsec'},el('h3',{},'Grille d\'accords'),
      el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Grilles toutes prêtes'),preSel),el('label',{class:'qzfield'},el('span',{class:'fl'},'Chiffre indicateur'),meterSel)),
      builder,
      area,
      el('p',{class:'hint'},'Sépare les mesures par « | » et les accords d\'une même mesure par une espace. Exemples : C, Am, F♯m7, B♭maj7, G7/B, Dsus4, Edim, ou en français : Do, Rém, Sol7. « % » répète la mesure précédente.')),
    el('section',{class:'mtsec'},el('h3',{},'Le groupe'),
      el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Style'),styleSel),el('label',{class:'qzfield'},el('span',{class:'fl'},'Intensité'),intSel),
        el('div',{class:'qzfield'},el('span',{class:'fl'},'Transposer'),el('div',{class:'row2'},el('button',{type:'button',class:'btn quiet sq','aria-label':'Un demi-ton plus bas',onclick:()=>setTr(-1)},'♭'),trLab,el('button',{type:'button',class:'btn quiet sq','aria-label':'Un demi-ton plus haut',onclick:()=>setTr(1)},'♯')))),
      el('div',{class:'bafaders'},fader('dr','Batterie'),fader('bs','Basse'),fader('pn','Piano')),
      el('div',{class:'mtline bachk'},tog('loop','En boucle'),tog('ci','Décompte d\'une mesure')),
      el('p',{class:'hint'},'Tout se change pendant que ça joue : tempo, style, grille, transposition et instruments. Baisse un instrument à zéro pour jouer sa partie toi-même.')));
  fillMeters();setT(BA_S.tempo);M.paint();M.ui();paintB();
  S.keyHandler=e=>{if(e.code==='Space'&&document.activeElement!==area){e.preventDefault();BA.sess?baStop():baPlay();return true;}};
};
MOD.ba.now=function(i){const M=this;if(!M.cells)return;M.cnt.textContent='';M.cells.querySelectorAll('.bacell').forEach(c=>c.classList.toggle('is-now',+c.dataset.i===i));};
MOD.ba.count=function(b){if(this.cnt)this.cnt.textContent=String(b);};

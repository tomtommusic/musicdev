
/* ========== MODULE : lecture à vue pour batterie ========== */
/* éléments : note ABC (clé de percussion), tête en x, touche du clavier d'ordinateur */
const DRK={
  crash:{a:'Crash',t:'Cymbale crash',s:'Crash',n:'a',x:1,code:'KeyL',k:'L'},
  hh:{a:'Charl.',t:'Charleston',s:'Charleston',n:'g',x:1,code:'KeyJ',k:'J'},
  ride:{a:'Ride',t:'Cymbale ride',s:'Ride',n:'f',x:1,code:'KeyK',k:'K'},
  htom:{a:'Tom 1',t:'Tom aigu',s:'Tom 1',n:'e',code:'KeyU',k:'U'},
  mtom:{a:'Tom 2',t:'Tom médium',s:'Tom 2',n:'d',code:'KeyI',k:'I'},
  snare:{a:'C.C.',t:'Caisse claire',s:'Caisse claire',n:'c',code:'KeyF',k:'F'},
  ftom:{a:'Tom B.',t:'Tom basse',s:'Tom basse',n:'A',code:'KeyO',k:'O'},
  kick:{a:'G.C.',t:'Grosse caisse',s:'Grosse caisse',n:'F',code:'Space',k:'Espace'},
  hho:{a:'Charl.',t:'Charleston ouvert',s:'Charleston',n:'g',x:1,deco:'!open!'},
  sna:{a:'C.C.',t:'Caisse claire accentuée',s:'Caisse claire',n:'c',deco:'!>!'},
  xs:{a:'C.C.',t:'Cross-stick',s:'Cross-stick',n:'c',x:1},
  hhp:{a:'Ch.pied',t:'Charleston au pied',s:'Charl. pied',n:'D',x:1,code:'KeyV',k:'V'}};
const DR_IDS=['kick','snare','hh','crash','htom','mtom','ftom','ride','hhp'];
const DR_ORDER=['crash','htom','mtom','ride','hh','snare','ftom','hhp','kick']; /* disposition des pads, comme une batterie vue de face */
const DR_LV=[
  ['Niveau 1 : grosse caisse et caisse claire',{els:['kick','snare'],meters:['4/4'],measures:2,tempo:70,figs:['noire','soupir','blanche'],dbl:false}],
  ['Niveau 2 : + croches',{els:['kick','snare'],meters:['4/4'],measures:2,tempo:72,figs:['noire','croches','soupir','blanche'],dbl:false}],
  ['Niveau 3 : + charleston (rythme rock)',{els:['kick','snare','hh'],meters:['4/4'],measures:2,tempo:72,figs:['noire','croches'],dbl:false}],
  ['Niveau 4 : + crash et toms (roulements)',{els:['kick','snare','hh','crash','htom','mtom','ftom'],meters:['4/4'],measures:4,tempo:76,figs:['noire','croches'],dbl:false}],
  ['Niveau 5 : tout le kit, doubles croches',{els:DR_IDS.slice(),meters:['3/4','4/4'],measures:4,tempo:80,figs:['noire','croches'],dbl:true}]];
const drPreset=()=>({els:['kick','snare','hh','ride'],meters:['4/4'],measures:4,tempo:72,figs:['noire','croches'],dbl:false});
function drSanitize(c,o){
  const a=Array.isArray(c.els)?c.els.filter(x=>DR_IDS.includes(x)):null;if(a&&a.length)o.els=a;
  o.meters=(o.meters||[]).filter(m=>!METERS[m].comp);if(!o.meters.length)o.meters=['4/4'];o.dbl=!!c.dbl;return o;}
/* rythmes inspirés des méthodes de batterie : caisse claire sur les temps 2 et 4 (backbeat), charleston en croches,
   grosse caisse sur 1 et 3 avec des variantes connues (« et » de 1, « et » de 3, four on the floor…),
   le même groove répété d'une mesure à l'autre, roulement à la fin de la phrase, crash + grosse caisse sur le 1 qui suit.
   Positions en croches : 0 = 1, 1 = 1&, 2 = 2, 3 = 2&, 4 = 3, 5 = 3&, 6 = 4, 7 = 4&. t = difficulté. */
const DR_GROOVES={
  4:{sn:[2,6],k:[{k:[0,4],t:1,w:6},{k:[0,4,5],t:2,w:2},{k:[0,1,4],t:2,w:2},{k:[0,2,4,6],t:2,w:1},{k:[0,4,7],t:3,w:1},{k:[0,1,4,5],t:3,w:1},{k:[0,3,4],t:3,w:1},{k:[0,5],t:3,w:1}]},
  3:{sn:[4],k:[{k:[0],t:1,w:4},{k:[0,1],t:2,w:2},{k:[0,3],t:2,w:1},{k:[0,2],t:3,w:1}]},
  2:{sn:[2],k:[{k:[0],t:1,w:4},{k:[0,1],t:2,w:2},{k:[0,3],t:3,w:1}]}};
/* bibliothèque de grooves (méthodes de batterie, styles courants). Positions en doubles croches dans la mesure :
   0 = 1, 1 = 1e, 2 = 1&, 3 = 1a, 4 = 2, 6 = 2&, 8 = 3, 10 = 3&, 12 = 4, 14 = 4&.
   tk : subdivisions possibles de la main qui garde le temps (q noires, e croches, s doubles croches) ;
   k : variantes de grosse caisse [positions, difficulté] ; sn : caisse claire ; bars : caisse claire sur 2 mesures ;
   open : charleston ouvert ; hhp : charleston au pied ; hh : demande le charleston ; xs : cross-stick ; t : difficulté (1 à 3) */
const DR_STYLES=[
  {n:'Rock',m:4,t:1,w:3,tk:['q','e','e','s','mix','mix'],sn:[4,12],k:[[[0,8],1],[[0,8,10],2],[[0,2,8],2],[[0,10],2],[[0,2,8,10],2],[[0,8,12],2],[[0,2,10],2],[[0,6,8],3],[[0,8,14],3],[[0,3,8],3]]},
  {n:'Pop',m:4,t:2,w:2,tk:['e','s','mix','mix'],ride:1,sn:[4,12],k:[[[0,10],2],[[0,6,10],2],[[0,8],1],[[0,6,8],2],[[0,2,10],2],[[0,10,14],3],[[0,8,11],3]]},
  {n:'Rock and roll',m:4,t:1,w:1.5,tk:['e'],sn:[4,12],sx:[[14],[14],[6]],k:[[[0,8],1],[[0,6,8],2],[[0,8,10],2]]},
  {n:'Hard rock',m:4,t:2,w:1.5,tk:['q','e'],ride:1,sn:[4,12],k:[[[0,2,8,10],2],[[0,2,8],2],[[0,6,8,10],2],[[0,4,8],2]]},
  {n:'Ballade',m:4,t:1,w:1.5,tk:['q','e','e'],ride:1,sn:[4,12],sx:[],k:[[[0],1],[[0,10],2],[[0,6],2],[[0,8],1]]},
  {n:'Pop syncopé',m:4,t:2,w:1.5,tk:['e','mix'],sn:[4,12],k:[[[0,6],2],[[0,6,10],2],[[0,6,8,14],2],[[0,6,14],2]]},
  {n:'Ska',m:4,t:2,w:1,cells:['o','o','o','o'],sn:[4,12],sx:[],k:[[[0,8],1],[[0,4,8,12],2]]},
  {n:'Dance-punk',m:4,t:2,w:1,hh:1,cells:['o','o','o','o'],open:[2,6,10,14],sn:[4,12],k:[[[0,4,8,12],2]]},
  {n:'Reggae rockers',m:4,t:2,w:1,tk:['e'],xs:1,sn:[4,12],sx:[],k:[[[0,4,8,12],2]]},
  {n:'Cha-cha',m:4,t:2,w:1,tk:['q'],xs:1,sn:[4,12,14],sx:[],k:[[[0,8],1]]},
  {n:'Four on the floor',m:4,t:2,w:2,tk:['e'],sn:[4,12],k:[[[0,4,8,12],2]]},
  {n:'Disco',m:4,t:2,w:1.5,hh:1,tk:['e'],open:[2,6,10,14],sn:[4,12],k:[[[0,4,8,12],2]]},
  {n:'Half-time',m:4,t:2,w:1.5,tk:['e','q','mix'],sn:[8],sx:[[14],[6]],k:[[[0],2],[[0,6],2],[[0,14],2],[[0,10],2],[[0,2,10],2],[[0,3,14],3]]},
  {n:'Motown',m:4,t:2,w:1,tk:['e'],ride:1,sn:[0,4,8,12],k:[[[0,8],2],[[0,8,10],2]]},
  {n:'Punk',m:4,t:2,w:1,tk:['q'],sn:[2,6,10,14],k:[[[0,4,8,12],2]]},
  {n:'Rock ouvert',m:4,t:3,w:1,hh:1,tk:['e'],open:[14],sn:[4,12],k:[[[0,8],1],[[0,8,10],2]]},
  {n:'Pop en doubles croches',m:4,t:3,w:1.5,tk:['s'],sn:[4,12],k:[[[0,8],1],[[0,8,10],2],[[0,10],2],[[0,3,8],3]]},
  {n:'Funk',m:4,t:3,w:2,tk:['e','s','mix','mix'],sn:[4,12],k:[[[0,3,10],3],[[0,2,7,10],3],[[0,6,9],3],[[0,8,11],3],[[0,3,6,10],3]]},
  {n:'Funk syncopé',m:4,t:3,w:1,tk:['e'],sn:[4,12,15],k:[[[0,3,10],3],[[0,6,10],3]]},
  {n:'Funk à deux mains',m:4,t:3,w:1,tk:['s'],alt16:1,sn:[4,12],k:[[[0,6,10],3],[[0,3,8,11],3]]},
  {n:'Hip-hop',m:4,t:3,w:1,tk:['e','s','mix'],sn:[4,12],k:[[[0,7,10],3],[[0,3,8,14],3],[[0,10,11],3]]},
  {n:'Reggae one drop',m:4,t:3,w:1,tk:['e'],xs:1,sn:[8],k:[[[8],3]]},
  {n:'Bossa-nova',m:4,t:3,w:1,tk:['e'],xs:1,bars:[[0,6,12],[4,10]],k:[[[0,3,4,8,11,12],3]],hhp:[4,12]},
  {n:'Train beat',m:4,t:3,w:.8,noTk:1,acc:[4,12],sn:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],k:[[[0,8],3]],hhp:[4,12]},
  {n:'Valse',m:3,t:1,w:3,tk:['q','e'],sn:[4,8],k:[[[0],1]]},
  {n:'Valse pop',m:3,t:2,w:1.5,tk:['e','q'],ride:1,sn:[4,8],sx:[],k:[[[0,6],2],[[0,10],2]]},
  {n:'Rock en 3/4',m:3,t:1,w:3,tk:['e','q','mix'],sn:[8],k:[[[0],1],[[0,6],2],[[0,2],2],[[0,4],2]]},
  {n:'Ballade en 3/4',m:3,t:2,w:1.5,tk:['e','s','mix'],ride:1,sn:[8],k:[[[0,10],2],[[0,3],3]]},
  {n:'Marche',m:2,t:1,w:2,tk:['q','e','mix'],sn:[4],k:[[[0],1],[[0,6],2]]},
  {n:'Galop',m:2,t:2,w:1,tk:['e'],sn:[2,6],sx:[],k:[[[0,4],1],[[0,2,4],2]]},
  {n:'Polka',m:2,t:1,w:2,tk:['q'],sn:[2,6],k:[[[0,4],1]]},
  {n:'Rock en 2/4',m:2,t:2,w:1.5,tk:['e','s','mix'],sn:[4],k:[[[0,2],2],[[0,6],2]]}];
/* combinaisons rythmiques de la main qui garde le temps, une cellule par temps (positions en doubles croches dans le temps) :
   q noire, e 2 croches, s 4 doubles, ed croche + 2 doubles, de 2 doubles + croche, g croche pointée + double, o contretemps seul */
const DR_CELL={q:[0],e:[0,2],s:[0,1,2,3],ed:[0,2,3],de:[0,1,2],g:[0,3],o:[2]};
const DR_TKMIX={
  4:[[['e','e','e','ed'],2],[['e','e','e','de'],2],[['e','de','e','de'],2],[['e','e','e','s'],2],[['q','e','q','e'],2],[['o','o','o','o'],2],[['e','q','e','q'],2],[['q','q','e','e'],2],[['e','e','e','q'],2],[['e','e','q','e'],2],[['e','e','ed','e'],2],
     [['ed','ed','ed','ed'],3],[['de','de','de','de'],3],[['e','s','e','s'],3],[['s','e','s','e'],3],[['de','ed','de','ed'],3],[['g','g','g','g'],3],[['e','ed','e','s'],3]],
  3:[[['e','e','ed'],2],[['q','e','e'],2],[['e','q','e'],2],[['e','e','q'],2],[['e','e','de'],2],[['o','o','o'],2],[['ed','ed','ed'],3],[['e','s','e'],3]],
  2:[[['e','ed'],2],[['e','de'],2],[['o','o'],2],[['e','q'],2],[['q','e'],2],[['ed','ed'],3],[['s','e'],3]]};
/* roulements : S = caisse claire, H = tom aigu, M = tom médium, F = tom basse ; chaque tambour reçoit 2 ou 4 coups (main droite, main gauche) */
const DR_FILLS=[
  {b:1,sub:2,d:'SS',t:1},{b:1,sub:2,d:'SF',t:1},{b:1,sub:2,d:'HF',t:1},{b:1,sub:2,d:'SH',t:1},{b:1,sub:2,d:'HM',t:1},{b:1,sub:2,d:'MF',t:1},{b:1,sub:2,d:'FF',t:1},
  {b:2,sub:2,d:'SSHF',t:2},{b:2,sub:2,d:'SHMF',t:2},{b:2,sub:2,d:'HHFF',t:2},{b:2,sub:2,d:'SSSS',t:2},{b:2,sub:2,d:'SSMF',t:2},{b:2,sub:2,d:'HMFF',t:2},{b:2,sub:2,d:'SFSF',t:2},{b:2,sub:2,d:'SSHH',t:2},
  {b:1,sub:1,d:'SSSS',t:3},{b:1,sub:1,d:'SSFF',t:3},{b:1,sub:1,d:'HHFF',t:3},
  {b:2,sub:1,d:'SSSSHHFF',t:3},{b:2,sub:1,d:'SSHHMMFF',t:3},{b:2,sub:1,d:'HHHHFFFF',t:3},
  {b:4,sub:1,d:'SSSSHHHHMMMMFFFF',t:4}];
const DR_RECENT=[];
function genDrums(cfg){
  const E=new Set(cfg.els&&cfg.els.length?cfg.els:['kick','snare']),meter=METERS[pick(cfg.meters.filter(m=>!METERS[m].comp))||'4/4'],B=meter.beats,nM=cfg.measures,bu=meter.bu;
  const has=x=>E.has(x),toms=['htom','mtom','ftom'].filter(has),events=[];let fi=0;
  const R=Math.random,G=DR_GROOVES[B]||DR_GROOVES[4];
  const tk=has('hh')&&has('ride')?(R()<.35?'ride':'hh'):has('hh')?'hh':has('ride')?'ride':null;
  if(!tk){
    /* une seule ligne (grosse caisse et caisse claire) : caisse claire sur les temps faibles (2 et 4), grosse caisse sur 1 et 3
       et sur la plupart des contretemps, comme dans les exercices de coordination pied-main */
    const ev=genRhythm(meter,cfg.figs&&cfg.figs.length?cfg.figs:['noire'],nM),sn=new Set(G.sn.map(x=>x*2));
    for(const e of ev){
      if(e.rest){events.push(Object.assign({},e,{hits:[]}));continue;}
      const on=e.pos%bu===0;let h=on?(sn.has(e.pos)?'snare':'kick'):(R()<.8?'kick':'snare');
      if(!has(h))h=has('snare')?'snare':has('kick')?'kick':pick([...E]);
      const hits=[h];if(has('crash')&&e.m===0&&e.pos===0)hits.push('crash');
      events.push(Object.assign({},e,{hits:[...new Set(hits)]}));}
    return{kind:'drum',meter,events,tempo:cfg.tempo,measures:nM,line:true};
  }
  /* ---- groove tiré de la bibliothèque de styles (DR_STYLES) ---- */
  const tmax=cfg.dbl?3:2,canHH=has('hh'),canRide=has('ride');
  const okStyle=st=>st.m===B&&st.t<=tmax&&(!st.hh||canHH)&&(!st.xs||has('snare'));
  const pool=DR_STYLES.filter(okStyle);if(!pool.length)pool.push(DR_STYLES[0]);
  const pickStyle=ex=>{const c=pool.filter(x=>x!==ex);const L=c.length?c:pool;const rc=DR_RECENT.slice(-Math.min(5,L.length-1));
    const s2=wpick(L,L.map(x=>(x.w||1)*(rc.includes(x.n)?.08:1)));DR_RECENT.push(s2.n);if(DR_RECENT.length>8)DR_RECENT.shift();return s2;};
  const pickTk=st=>{const mixes=(DR_TKMIX[B]||[]).filter(x=>x[1]<=tmax&&(cfg.dbl||x[0].every(c=>c==='q'||c==='e'||c==='o')));const o=(st.tk||['e']).filter(x=>(x!=='s'||cfg.dbl)&&(x!=='mix'||mixes.length));const sub=st.cells?'e':pick(o.length?o:['e']);const cells=st.cells||(sub==='mix'?pick(mixes)[0]:null);
    const inst=st.hh||!canRide?(canHH?'hh':'ride'):!canHH?'ride':(st.ride&&R()<.45?'ride':R()<.25?'ride':'hh');return{sub,inst,cells};};
  const pickK=(st,ex)=>{const c=st.k.filter(x=>(x[1]||1)<=tmax&&x!==ex&&(cfg.dbl||x[0].every(p=>p%2===0)));return c.length?pick(c):st.k[0];};
  let st=pickStyle(null),tkc=pickTk(st),main=pickK(st,null),crashNext=has('crash')&&R()<.8;
  const fillAt=m=>toms.length>0&&nM>=2&&((m%4===3)||(nM<4&&m===nM-1&&R()<.75));
  const pickFill=()=>{const maxB=B===4?(cfg.dbl?4:2):1;let c=DR_FILLS.filter(f=>f.b<=maxB&&f.t<=tmax+1&&(cfg.dbl||f.sub===2)&&(f.b<4||R()<.15));if(!c.length)c=[DR_FILLS[0]];return pick(c);};
  const drumOf=ch=>{const want={S:['snare'],H:['htom','mtom','ftom'],M:['mtom','htom','ftom'],F:['ftom','mtom','htom']}[ch];return want.find(has)||(has('snare')?'snare':toms[0]);};
  const styles=new Set([st.n]);
  for(let m=0;m<nM;m++){
    if(m>0&&m%4===0){ /* nouvelle phrase (couplet → refrain) : autre style, ou même style avec la ride / une autre subdivision */
      const r2=R();if(r2<.35){st=pickStyle(st);main=pickK(st,null);tkc=pickTk(st);styles.add(st.n);}
      else if(r2<.75){const t2=pickTk(st);if(canHH&&canRide&&!st.hh)t2.inst=tkc.inst==='hh'?'ride':'hh';tkc=t2;}}
    const fill=fillAt(m)?pickFill():null,fb=fill?fill.b:0;
    const kp=(!fill&&(m%4===1||m%4===3)&&R()<.3)?pickK(st,main):main;   /* variante occasionnelle de grosse caisse */
    /* variantes de fin de mesure : un coup de caisse claire en plus (souvent sur le « et » du 4), ou le charleston ouvert sur le dernier contretemps */
    const sxo=(st.sx||(st.sn&&!st.bars&&B===4?[[14],[14],[6],[10]]:[])).filter(a=>cfg.dbl||a.every(p=>p%2===0)),xtra=(!fill&&sxo.length&&R()<.22)?pick(sxo):[];
    const opn=(!fill&&!st.open&&!st.hh&&B===4&&tkc.inst==='hh'&&tkc.sub==='e'&&!tkc.cells&&R()<.15)?[14]:[];
    const bar=m%2,P=new Map(),add=(pos,h)=>{if(!has(h==='hho'?'hh':h==='xs'||h==='sna'?'snare':h))return;if(!P.has(pos))P.set(pos,new Set());P.get(pos).add(h);};
    const fillFrom=fill?(B-fb)*bu:1e9;
    /* main qui garde le temps */
    if(!st.noTk){const step={q:4,e:2,s:1}[tkc.sub]||1;
      const tkPos=tkc.cells?tkc.cells.flatMap((c,b)=>DR_CELL[c].map(o=>b*bu+o)):null;
      for(let x=0;x<B*bu&&x<fillFrom;x+=step){if(tkPos&&!tkPos.includes(x))continue;
        if(x===0&&crashNext)continue;
        if(st.alt16&&tkc.sub==='s'&&(st.sn||[]).includes(x))continue;   /* doubles croches à deux mains : la main droite va à la caisse claire */
        add(x,tkc.inst==='hh'&&((st.open||[]).includes(x)||opn.includes(x))?'hho':tkc.inst);}}
    if(crashNext){add(0,'crash');crashNext=false;}
    const snB=st.bars?st.bars[bar]:st.sn||[];
    for(const x of snB)if(x<fillFrom)add(x,st.xs?'xs':(st.acc||[]).includes(x)?'sna':'snare');
    for(const x of xtra)if(x<fillFrom&&!kp[0].includes(x))add(x,'snare');
    for(const x of kp[0])if(x<fillFrom)add(x,'kick');
    const hp=st.hhp||(tkc.inst==='ride'&&!st.noTk?(B===4?[4,12]:B===3?[4,8]:[4]):[]);for(const x of hp)if(x<fillFrom)add(x,'hhp');
    const keys=[...P.keys()].sort((a,b)=>a-b);
    keys.forEach((x,k)=>{const b=Math.floor(x/bu),nx=k+1<keys.length&&Math.floor(keys[k+1]/bu)===b?keys[k+1]:(b+1)*bu;
      events.push({m,pos:x,dur:nx-x,rest:false,hits:[...P.get(x)],fi:fi+b});});
    if(fill)for(let b=B-fb;b<B;b++){const n=bu/fill.sub,off=(b-(B-fb))*n;
      for(let k=0;k<n;k++)events.push({m,pos:b*bu+k*fill.sub,dur:fill.sub,rest:false,hits:[drumOf(fill.d[off+k]||'S')],fi:fi+b,fill:true});}
    fi+=B;
    if(fill&&has('crash'))crashNext=true;
  }
  events.sort((a,b)=>a.m-b.m||a.pos-b.pos);
  return{kind:'drum',meter,events,tempo:cfg.tempo,measures:nM,style:[...styles].join(' → ')};
}
/* notation à deux voix, comme les partitions de batterie : cymbales (et roulements) hampes en haut,
   grosse caisse, caisse claire et charleston au pied hampes en bas. map : [voix, mesure, rang de la note, événement] */
const DR_UP=new Set(['hh','hho','ride','crash','htom','mtom','ftom']);
function abcDrums(ex,o={}){
  const {meter}=ex,per=o.perLine||4,nM=ex.measures,bu=meter.bu,map=[];
  const nt=hs=>{const dc=hs.map(h=>DRK[h].deco||'').join(''),ns=hs.slice().sort((a,b)=>DR_IDS.indexOf(a)-DR_IDS.indexOf(b)).map(h=>(DRK[h].x?'!style=x!':'')+DRK[h].n);return dc+(ns.length>1?'['+ns.join('')+']':ns[0]);};
  const D=d=>d===1?'':String(d);
  const voiceOf=(e,h)=>ex.line?1:(DR_UP.has(h)||(h==='snare'&&e.fill))?0:1;
  const meas=[[],[]];
  for(let m=0;m<nM;m++){
    const evs=ex.events.map((e,i)=>[e,i]).filter(([e])=>e.m===m);
    for(const v of[0,1]){
      let toks=[],k=0;
      if(ex.line){
        if(v===0){meas[0].push('x'+D(bu*meter.beats));continue;}
        /* ligne unique : les figures du générateur rythmique, groupées par temps */
        let cur=null,buf='';const parts=[];
        for(const[e,i]of evs){const t=e.hits.length?nt(e.hits)+D(e.dur):'z'+D(e.dur);map.push([1,m,k++,i]);
          if(e.fi!==cur){if(buf)parts.push(buf);buf=t;cur=e.fi;}else buf+=t;}
        if(buf)parts.push(buf);meas[1].push(parts.join(' '));continue;}
      for(let b=0;b<meter.beats;b++){
        const inB=evs.filter(([e])=>Math.floor(e.pos/bu)===b),other=1-v;
        const slots=inB.map(([e,i])=>({pos:e.pos-b*bu,dur:e.dur,i,hs:e.hits.filter(h=>voiceOf(e,h)===v)}));
        const otherHas=inB.some(([e])=>e.hits.some(h=>voiceOf(e,h)===other));
        if(!slots.some(x=>x.hs.length)){toks.push((v===1&&!inB.some(([e])=>e.fill)?'z':'x')+D(bu));k++;continue;}   /* abcjs numérote aussi les silences invisibles */
        /* une note dure jusqu'à la suivante (dans le temps) ; les vides du début du temps sont des silences */
        let buf='',p=0;
        for(let s2=0;s2<slots.length;s2++){const x=slots[s2];if(!x.hs.length)continue;
          if(x.pos>p){buf+='z'+D(x.pos-p);k++;}
          let end=bu;for(let t=s2+1;t<slots.length;t++)if(slots[t].hs.length){end=slots[t].pos;break;}
          buf+=nt(x.hs)+D(end-x.pos);map.push([v,m,k++,x.i]);p=end;}
        toks.push(buf);}
      /* en 4/4, les croches des cymbales sont groupées par 4 (demi-mesure), comme dans les partitions de batterie */
      if(v===0&&meter.beats===4&&toks.length===4){const fb=b=>evs.some(([e])=>e.fill&&Math.floor(e.pos/bu)===b),sx=b=>evs.some(([e])=>e.dur<2&&Math.floor(e.pos/bu)===b),g=(a,b)=>!fb(a)&&!fb(b)&&!sx(a)&&!sx(b)&&!/^x/.test(toks[a])&&!/^x/.test(toks[b])&&!/z/.test(toks[a]+toks[b]);
        meas[v].push([g(0,1)?toks[0]+toks[1]:toks[0]+' '+toks[1],g(2,3)?toks[2]+toks[3]:toks[2]+' '+toks[3]].join(' '));}
      else meas[v].push(toks.join(' '));
    }
  }
  let out=`X:1\nM:${meter.label}\nL:1/16\n%%score (1 2)\nK:C clef=perc\nV:1 stem=up clef=perc\nV:2 stem=down clef=perc\n`;
  for(let m0=0;m0<nM;m0+=per){const r=[];for(let m=m0;m<Math.min(nM,m0+per);m++)r.push(m);
    for(const v of[0,1])out+=`[V:${v+1}] `+r.map(m=>meas[v][m]+(m===nM-1?' |]':' |')).join(' ')+'\n';}
  return{abc:out,map};
}
/* sons de batterie (synthèse) à un moment donné
   grosse caisse : coup de batte + corps qui descend en hauteur ; caisse claire : deux modes de la peau + timbre (bruit filtré) ;
   cymbales : six oscillateurs carrés à rapports inharmoniques (méthode classique des boîtes à rythmes) filtrés vers l'aigu ;
   le tout passe dans une petite réverbération de pièce */
const DR_RAT=[2,3,4.16,5.43,6.79,8.21];
function drHit(id,t,out,v=1){try{const c=A.init();out=out||A.out||c.destination;
  if(drHit.c!==c){drHit.c=c;const n=c.sampleRate*2,b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;drHit.nb=b;
    const L=Math.ceil(c.sampleRate*.6),ir=c.createBuffer(2,L,c.sampleRate),pre=Math.ceil(c.sampleRate*.006);
    for(let ch=0;ch<2;ch++){const y=ir.getChannelData(ch);for(let i=pre;i<L;i++)y[i]=(Math.random()*2-1)*Math.pow(1-i/L,4);}drHit.ir=ir;drHit.rv=new WeakMap();}
  let rv=drHit.rv.get(out);if(!rv){rv=c.createConvolver();rv.buffer=drHit.ir;const rg=c.createGain();rg.gain.value=.22;rv.connect(rg);rg.connect(out);drHit.rv.set(out,rv);}
  const bus=c.createGain();bus.gain.value=.8;bus.connect(out);const send=r=>{const g=c.createGain();g.gain.value=r;bus.connect(g);g.connect(rv);};
  const env=(g,a,dec,att=.002)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a*v,t+att);g.gain.setTargetAtTime(0,t+att,dec/3);return t+att+dec*2.2;};
  const osc=(type,f0,f1,sw,a,dec)=>{const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+sw);const e=env(g,a,dec);o.connect(g);g.connect(bus);o.start(t);o.stop(e);};
  const nz=(type,f,q,a,dec,att)=>{const s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=drHit.nb;fl.type=type;fl.frequency.value=f;fl.Q.value=q;const e=env(g,a,dec,att);s.connect(fl);fl.connect(g);g.connect(bus);s.start(t,Math.random()*1.2);s.stop(e);};
  const metal=(base,a,dec,bp,hp,att)=>{const g=c.createGain(),f1=c.createBiquadFilter(),f2=c.createBiquadFilter();f1.type='bandpass';f1.frequency.value=bp;f1.Q.value=.6;f2.type='highpass';f2.frequency.value=hp;
    const e=env(g,a,dec,att);for(const r of DR_RAT){const o=c.createOscillator();o.type='square';o.frequency.value=base*r*(1+(Math.random()-.5)*.004);o.connect(f1);o.start(t);o.stop(e);}f1.connect(f2);f2.connect(g);g.connect(bus);};
  const tom=f=>{osc('sine',f*1.35,f,.09,.6,.42*110/f+.12);osc('triangle',f*2.1,f*1.9,.06,.12,.12);nz('lowpass',f*6,.7,.18,.03);send(.28);};
  switch(id){
    case'kick':osc('sine',160,46,.07,.8,.34);osc('sine',62,52,.12,.28,.22);nz('bandpass',3200,1.2,.32,.009);osc('triangle',900,300,.012,.18,.012);send(.06);break;
    case'snare':case'sna':{const k=id==='sna'?1.3:1,d=id==='sna'?1.15:1;
      osc('triangle',205,182,.03,.85*k,.08);osc('sine',335,325,.02,.38*k,.06);
      nz('bandpass',3000,.6,.8*k,.17*d);nz('highpass',6500,.7,.2*k,.08*d);nz('lowpass',1200,.8,.32*k,.03);send(.3);break;}
    case'ftom':tom(92);break;case'mtom':tom(135);break;case'htom':tom(185);break;
    /* charleston : surtout du souffle filtré (le grésillement des deux cymbales), un soupçon de métal, très court */
    case'hh':nz('highpass',7000,.7,.26,.045,.001);nz('bandpass',10500,1.4,.18,.03,.001);metal(40,.05,.03,11000,8000);send(.1);break;
    case'hho':nz('highpass',6500,.7,.24,.34,.003);nz('bandpass',9000,1,.15,.28,.003);metal(40,.05,.3,10000,7000,.004);send(.18);break;
    case'hhp':nz('highpass',6000,.7,.15,.04,.001);nz('bandpass',1500,1.5,.1,.025,.001);send(.08);break;
    case'xs':osc('triangle',1750,1350,.02,.45,.028);osc('sine',520,480,.03,.25,.05);nz('bandpass',2600,3,.28,.022);send(.25);break;
    case'ride':metal(58,.16,1.1,8200,4800,.002);osc('sine',2350,2350,0,.05,.6);nz('bandpass',6200,2,.2,.035);send(.3);break;
    case'crash':{/* crash : souffle de bruit qui « s'ouvre » puis s'assombrit en s'éteignant, avec un léger scintillement métallique */
      const lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=.3;lp.frequency.setValueAtTime(15000,t);lp.frequency.exponentialRampToValueAtTime(5500,t+1.6);lp.connect(bus);
      const lay=(type,f,q,a,dec,att)=>{const s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=drHit.nb;s.loop=true;fl.type=type;fl.frequency.value=f;fl.Q.value=q;const e=env(g,a,dec,att);s.connect(fl);fl.connect(g);g.connect(lp);s.start(t,Math.random()*1.5);s.stop(e);};
      lay('highpass',2200,.5,.28,.025,.001);lay('highpass',4200,.5,.34,1.9,.012);lay('bandpass',7800,.7,.22,1.3,.01);lay('bandpass',1700,.9,.1,.35,.006);
      const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=3000;hp.connect(lp);
      for(const f of[3170,4285,5390,6655,8125,9770,11320]){const o=c.createOscillator(),g=c.createGain();o.frequency.value=f*(1+(Math.random()-.5)*.01);const e=env(g,.018,1.5,.015);o.connect(g);g.connect(hp);o.start(t);o.stop(e);}
      send(.35);break;}
  }
}catch(e){}}
MOD.lb.mount=function(){
  const M=this;
  $('#toolbar').replaceChildren(btn('Nouvelle lecture',newEx,'primary'),(M.sb=btn('● Commencer',()=>M.start(),'primary')),
    btn('▶ Écouter le modèle',()=>M.model()),el('span',{class:'sep'}),stopBtn());
  M.dots=el('div',{class:'beatdots'});M.kit=el('div',{class:'drkit'});M.leg=el('div',{class:'drleg'});
  /* on joue sur sa vraie batterie : l'app donne le décompte, le métronome et suit la partition ; l'élève s'évalue ensuite */
  $('#answer').replaceChildren(el('div',{class:'ahead'},el('h2',{},'Joue la partition',typeof betaTag==='function'?betaTag():null),(M.ch=el('p',{class:'hint'}))),
    el('details',{class:'drlegw',open:''},el('summary',{},'Légende de la portée'),M.leg),M.metroBox(),M.dots,
    el('div',{class:'selfeval'},btn('Réussi',()=>M.self(true)),btn('À retravailler',()=>M.self(false))));
  S.keyHandler=null;
  S.midiHandler=null;
};
/* petit métronome pour répéter le groove à son rythme ; son tempo est celui de la partition */
MOD.lb.metroBox=function(){
  const M=this,c=()=>S.cfg.lb;
  const lab=el('b',{class:'lbmtv'}),sl=el('input',{type:'range',min:40,max:200,step:1,'aria-label':'Tempo'}),go=btn('▶ Métronome',()=>M.mts?M.mtStop():M.mtStart(),'');
  const set=v=>{v=Math.max(40,Math.min(200,Math.round(v)));c().tempo=v;if(S.ex){S.ex.tempo=v;metaLine(S.ex);}cfgChanged('lb');M.mtUpd();};
  sl.addEventListener('input',()=>set(+sl.value));
  M.mtUpd=()=>{const v=c().tempo;lab.textContent=`♩ = ${v}`;sl.value=v;go.textContent=M.mts?T('■ Arrêter le métronome'):T('▶ Métronome');go.classList.toggle('on',!!M.mts);};
  M.mtUpd();
  return el('div',{class:'lbmt'},go,el('button',{type:'button',class:'btn quiet sq','aria-label':'Plus lent',onclick:()=>set(c().tempo-2)},'−'),lab,
    el('button',{type:'button',class:'btn quiet sq','aria-label':'Plus rapide',onclick:()=>set(c().tempo+2)},'+'),sl);
};
MOD.lb.mtStart=function(){
  const M=this,c=A.init();if(typeof qzUnmute==='function')qzUnmute();stop();
  const g=c.createGain();g.connect(A.out);const st={g,next:c.currentTime+.1,beat:0,timer:0};M.mts=st;
  const tick=()=>{if(M.mts!==st)return;if(S.mod!=='lb'){M.mtStop();return;}
    const us=60/S.cfg.lb.tempo,B=S.ex?S.ex.meter.beats:4;
    while(st.next<c.currentTime+.12){const b=st.beat%B,t=st.next;A.click(t,b===0,g);
      setTimeout(()=>{if(M.mts===st)M.beat(b);},Math.max(0,(t+(typeof audioLag==='function'?audioLag():0)-c.currentTime)*1000));st.next+=us;st.beat++;}};
  tick();st.timer=setInterval(tick,25);M.mtUpd();
};
MOD.lb.mtStop=function(){const M=this,st=M.mts;if(!st)return;M.mts=null;clearInterval(st.timer);
  try{st.g.gain.setTargetAtTime(0,A.ctx.currentTime,.01);setTimeout(()=>st.g.disconnect(),200);}catch(e){}M.beat(-1);M.mtUpd&&M.mtUpd();};
MOD.lb.buildKit=function(){
  const M=this,els=S.cfg.lb.els;M.on=new Set(els);M.pads={};
  if(M.kit)M.kit.replaceChildren(...DR_ORDER.filter(id=>M.on.has(id)).map(id=>{
    const p=el('button',{type:'button',class:'drpad dr-'+id,'aria-label':T(DRK[id].t)+' ('+DRK[id].k+')'},el('b',{},DRK[id].s),el('kbd',{},DRK[id].k));
    p.addEventListener('pointerdown',e=>{e.preventDefault();M.hit(id);});M.pads[id]=p;return p;}));
  /* légende : chaque élément à sa place sur la portée */
  const ids=DR_IDS.filter(x=>M.on.has(x)).sort((a,b)=>DR_IDS.indexOf(a)-DR_IDS.indexOf(b));
  const abc=`X:1\nL:1/4\nK:C clef=perc\nV:1 stem=up\n`+ids.map(h=>(DRK[h].x?'!style=x!':'')+DRK[h].n).join(' ')+' |]\nw: '+ids.map(h=>T(DRK[h].a).replace(/ /g,'~')).join(' ')+'\n';
  if(HAS_ABC()){const av=(M.leg.clientWidth||$('#answer').clientWidth||320)-10;ABCJS.renderAbc(M.leg,abc,{add_classes:true,staffwidth:Math.max(160,Math.min(ids.length*72,av)),paddingtop:0,paddingbottom:0,foregroundColor:'currentColor'});}
};
MOD.lb.fresh=function(){Object.assign(S.st,{ins:[],live:false,res:null,counted:false});this.ch.textContent=`Joue sur ta batterie : clique « Commencer », écoute le décompte (${countText(S.ex.meter)}), puis joue la partition avec le métronome. La note en cours est surlignée. Évalue-toi ensuite.`;this.buildKit();this.redraw();this.beat(-1);};
MOD.lb.clear=function(){S.st.res=null;this.redraw();feedback('');};
MOD.lb.redraw=function(){const M=this,ex=S.ex;if(!ex)return;const sc=$('#score');sc.classList.remove('single');
  const r=abcDrums(ex,{perLine:perLine()});draw(sc,r.abc);M.els=ex.events.map(()=>[]);
  for(const[v,m,k,i]of r.map){const e=sc.querySelector(`.abcjs-v${v}.abcjs-mm${m}.abcjs-n${k}`);if(e)M.els[i].push(e);}
  if(S.st.res)S.st.res.forEach(([i,c])=>(M.els[i]||[]).forEach(e=>e.classList.add(c)));};
MOD.lb.now=function(i){(this.els||[]).forEach(a=>a.forEach(e=>e.classList.remove('is-now')));if(i>=0&&this.els[i])this.els[i].forEach(e=>e.classList.add('is-now'));};
MOD.lb.beat=function(b){const n=S.ex.meter.beats;this.dots.replaceChildren(...Array.from({length:n},(_,k)=>el('i',{class:k===b?'on':''})));};
MOD.lb.flash=function(id){const p=this.pads&&this.pads[id];if(!p)return;p.classList.add('hit');setTimeout(()=>p.classList.remove('hit'),110);};
MOD.lb.model=function(){
  const M=this;M.mtStop();M.clear();A.init();if(typeof qzUnmute==='function')qzUnmute();
  const plan=planOf(S.ex,{countIn:true});const s=run(plan,{sound:'none',onStep:it=>{M.now(it.i);const e=S.ex.events[it.i];if(e)e.hits.forEach(h=>M.flash(h));},onEnd:()=>M.now(-1)});
  for(const it of plan.items){const e=S.ex.events[it.i];if(e)for(const h of e.hits)drHit(h,it.t,s.g,.9);}
};
MOD.lb.start=async function(){
  A.init();if(A.ctx.state!=='running'){try{await A.ctx.resume();}catch(e){}}
  if(typeof qzUnmute==='function')qzUnmute();
  const M=this,c=S.cfg.lb;M.mtStop();M.clear();S.st.ins=[];
  const plan=planOf(S.ex,{countIn:true,metro:c.metro!==false});
  run(plan,{sound:'none',onBeat:k=>M.beat(k.b),onStep:it=>M.now(it.i),onEnd:()=>{M.now(-1);M.beat(-1);feedback(T('Comment ça s\'est passé ? Évalue-toi ci-dessous, ou écoute le modèle pour comparer.'));}});
};
MOD.lb.self=function(ok){if(!S.st.counted){tally(ok);S.st.counted=true;}feedback(ok?'Noté. Passe à une nouvelle lecture quand tu es prêt.':'Noté. Écoute le modèle, baisse le tempo au besoin, puis recommence.',ok?'ok':'');};
MOD.lb.hit=function(id){
  const M=this;A.init();M.flash(id);
  drHit(id,A.ctx.currentTime+.003,(S.st.live&&P.sess)?P.sess.g:null,.9);
  if(S.st.live)S.st.ins.push({t:heardTime(),h:id});
};
MOD.lb.evaluate=function(plan){
  /* chaque coup attendu (élément + moment) est associé au coup joué le plus proche sur le même élément */
  const M=this,ins=S.st.ins.slice(),used=new Set(),res=[];
  let minI=1e9;for(let k=1;k<plan.items.length;k++)minI=Math.min(minI,plan.items[k].t-plan.items[k-1].t);
  const tol=Math.max(.06,Math.min(.15,.45*minI));
  let ok=0,late=0,miss=0,N=0,wrongEl=0;
  for(const it of plan.items){const e=S.ex.events[it.i];if(!e||!e.hits.length)continue;let st='is-ok';
    for(const h of e.hits){N++;let best=-1,bd=1e9;ins.forEach((x,j)=>{if(used.has(j)||x.h!==h)return;const d=Math.abs(x.t-it.t);if(d<bd){bd=d;best=j;}});
      if(best<0||bd>2*tol){miss++;st='is-bad';
        if(ins.some((x,j)=>!used.has(j)&&Math.abs(x.t-it.t)<=tol))wrongEl++;continue;}
      used.add(best);if(bd<=tol)ok++;else{late++;if(st==='is-ok')st='is-late';}}
    res.push([it.i,st]);}
  const firstT=plan.items.length?plan.items[0].t:0,extra=ins.filter((x,j)=>!used.has(j)&&x.t>firstT-tol).length,all=ok===N&&extra===0;
  S.st.res=res;M.redraw();tally(all);
  const z=n=>n>1?'s':'',w=wrongEl,ms=miss-wrongEl,ex2=Math.max(0,extra-wrongEl);
  const parts=[`${ok} coup${z(ok)} juste${z(ok)} et à temps sur ${N}`];
  if(late)parts.push(`· ${late} coup${z(late)} décalé${z(late)}`);
  if(w)parts.push(`· ${w} coup${z(w)} sur le mauvais élément`);
  if(ms)parts.push(`· ${ms} coup${z(ms)} manqué${z(ms)}`);
  if(ex2)parts.push(`· ${ex2} coup${z(ex2)} de trop`);
  feedback(parts.map(x=>T(x)).join(' ')+'.',all?'ok':'bad');
};

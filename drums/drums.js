
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
  hhp:{a:'Ch.pied',t:'Charleston au pied',s:'Charl. pied',n:'D',x:1,code:'KeyV',k:'V'}};
const DR_IDS=['kick','snare','hh','crash','htom','mtom','ftom','ride','hhp'];
const DR_ORDER=['crash','htom','mtom','ride','hh','snare','ftom','hhp','kick']; /* disposition des pads, comme une batterie vue de face */
const DR_LV=[
  ['Niveau 1 : grosse caisse et caisse claire',{els:['kick','snare'],meters:['4/4'],measures:2,tempo:70,figs:['noire','soupir','blanche'],dbl:false}],
  ['Niveau 2 : + croches',{els:['kick','snare'],meters:['4/4'],measures:2,tempo:72,figs:['noire','croches','soupir','blanche'],dbl:false}],
  ['Niveau 3 : + charleston (rythme rock)',{els:['kick','snare','hh'],meters:['4/4'],measures:2,tempo:72,figs:['noire','croches'],dbl:false}],
  ['Niveau 4 : + crash et toms (roulements)',{els:['kick','snare','hh','crash','htom','mtom','ftom'],meters:['4/4'],measures:4,tempo:76,figs:['noire','croches'],dbl:false}],
  ['Niveau 5 : tout le kit, doubles croches',{els:DR_IDS.slice(),meters:['3/4','4/4'],measures:4,tempo:80,figs:['noire','croches'],dbl:true}]];
const drPreset=()=>structuredClone(DR_LV[0][1]);
function drSanitize(c,o){
  const a=Array.isArray(c.els)?c.els.filter(x=>DR_IDS.includes(x)):null;if(a&&a.length)o.els=a;
  o.meters=(o.meters||[]).filter(m=>!METERS[m].comp);if(!o.meters.length)o.meters=['4/4'];o.dbl=!!c.dbl;return o;}
function genDrums(cfg){
  const E=new Set(cfg.els&&cfg.els.length?cfg.els:['kick','snare']),meter=METERS[pick(cfg.meters.filter(m=>!METERS[m].comp))||'4/4'],B=meter.beats,nM=cfg.measures;
  const has=x=>E.has(x),toms=['htom','mtom','ftom'].filter(has),events=[];let fi=0;
  const back=b=>B===4?(b===1||b===3):B===3?(b>0):B===2?b===1:false;
  const R=Math.random;
  const tk=has('hh')&&has('ride')?(R()<.35?'ride':'hh'):has('hh')?'hh':has('ride')?'ride':null;
  if(!tk){
    /* une seule ligne rythmique : grosse caisse sur les temps forts, caisse claire sur les contretemps */
    const ev=genRhythm(meter,cfg.figs&&cfg.figs.length?cfg.figs:['noire'],nM);
    let prevB=-1;
    for(const e of ev){
      if(e.rest){events.push(Object.assign({},e,{hits:[]}));continue;}
      const b=Math.floor(e.pos/meter.bu),on=e.pos%meter.bu===0;let h;
      if(on)h=back(b)?(R()<.85?'snare':'kick'):(R()<.85?'kick':'snare');else h=R()<.5?'kick':'snare';
      if(!has(h))h=has('snare')?'snare':has('kick')?'kick':pick([...E]);
      if(toms.length&&R()<.15&&!(e.m===0&&e.pos===0))h=pick(toms);
      const hits=[h];if(has('crash')&&e.m===0&&e.pos===0&&h==='kick')hits.push('crash');
      events.push(Object.assign({},e,{hits}));prevB=b;}
    if(!events.some(e=>e.hits.includes('snare'))&&has('snare')){const x=events.find(e=>e.hits.length&&!(e.m===0&&e.pos===0));if(x)x.hits=['snare'];}
    return{kind:'drum',meter,events,tempo:cfg.tempo,measures:nM,line:true};
  }
  /* groove : timekeeping en croches, grosse caisse et caisse claire, roulement de toms en fin de phrase */
  const fillAt=m=>(toms.length||has('snare'))&&nM>=2&&(toms.length?R()<.85:R()<.4)&&(m===nM-1||(nM>=8&&m===3));
  let crashNext=has('crash')&&R()<.75;
  for(let m=0;m<nM;m++){
    const fill=fillAt(m),fb=fill?(B>=4&&R()<.5?2:1):0;   /* nombre de temps de roulement */
    for(let b=0;b<B;b++){
      const inFill=fill&&b>=B-fb;
      if(inFill){
        const sub=cfg.dbl&&R()<.7?1:2,n=meter.bu/sub,pool=['snare',...toms].filter(has),fbIdx=b-(B-fb);
        for(let k=0;k<n;k++){
          const step=(fbIdx*n+k)/(fb*n);const d=pool[Math.min(pool.length-1,Math.floor(step*pool.length))];
          events.push({m,pos:b*meter.bu+k*sub,dur:sub,rest:false,hits:[d],fi,fill:true});}
        fi++;continue;}
      for(let s=0;s<2;s++){
        const hits=[];const on=s===0;
        if(on&&b===0&&crashNext){hits.push('crash');crashNext=false;}else hits.push(tk);
        if(on&&(b===0||(B===4&&b===2)))hits.push('kick');
        else if(!back(b)||!on){if(has('kick')&&R()<(on?.3:.2)&&!(B===3&&on))hits.push('kick');}
        if(on&&back(b)&&has('snare'))hits.push('snare');
        else if(!on&&has('snare')&&R()<.06)hits.push('snare');
        if(tk==='ride'&&has('hhp')&&on&&back(b))hits.push('hhp');
        events.push({m,pos:b*meter.bu+s*2,dur:2,rest:false,hits:[...new Set(hits.filter(has))],fi});}
      fi++;}
    if(fill&&has('crash'))crashNext=true;
  }
  return{kind:'drum',meter,events,tempo:cfg.tempo,measures:nM};
}
/* notation à deux voix, comme les partitions de batterie : cymbales (et roulements) hampes en haut,
   grosse caisse, caisse claire et charleston au pied hampes en bas. map : [voix, mesure, rang de la note, événement] */
const DR_UP=new Set(['hh','ride','crash','htom','mtom','ftom']);
function abcDrums(ex,o={}){
  const {meter}=ex,per=o.perLine||4,nM=ex.measures,bu=meter.bu,map=[];
  const nt=hs=>{const ns=hs.slice().sort((a,b)=>DR_IDS.indexOf(a)-DR_IDS.indexOf(b)).map(h=>(DRK[h].x?'!style=x!':'')+DRK[h].n);return ns.length>1?'['+ns.join('')+']':ns[0];};
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
        if(!slots.some(x=>x.hs.length)){toks.push((v===1&&!inB.some(([e])=>e.fill)?'z':'x')+D(bu));if(v===1&&!inB.some(([e])=>e.fill))k++;continue;}
        /* une note dure jusqu'à la suivante (dans le temps) ; les vides du début du temps sont des silences */
        let buf='',p=0;
        for(let s2=0;s2<slots.length;s2++){const x=slots[s2];if(!x.hs.length)continue;
          if(x.pos>p){buf+='z'+D(x.pos-p);k++;}
          let end=bu;for(let t=s2+1;t<slots.length;t++)if(slots[t].hs.length){end=slots[t].pos;break;}
          buf+=nt(x.hs)+D(end-x.pos);map.push([v,m,k++,x.i]);p=end;}
        toks.push(buf);}
      /* en 4/4, les croches des cymbales sont groupées par 4 (demi-mesure), comme dans les partitions de batterie */
      if(v===0&&meter.beats===4&&toks.length===4){const fb=b=>evs.some(([e])=>e.fill&&Math.floor(e.pos/bu)===b),g=(a,b)=>!fb(a)&&!fb(b)&&!/^x/.test(toks[a])&&!/^x/.test(toks[b]);
        meas[v].push([g(0,1)?toks[0]+toks[1]:toks[0]+' '+toks[1],g(2,3)?toks[2]+toks[3]:toks[2]+' '+toks[3]].join(' '));}
      else meas[v].push(toks.join(' '));
    }
  }
  let out=`X:1\nM:${meter.label}\nL:1/16\n%%score (1 2)\nK:C clef=perc\nV:1 stem=up clef=perc\nV:2 stem=down clef=perc\n`;
  for(let m0=0;m0<nM;m0+=per){const r=[];for(let m=m0;m<Math.min(nM,m0+per);m++)r.push(m);
    for(const v of[0,1])out+=`[V:${v+1}] `+r.map(m=>meas[v][m]+(m===nM-1?' |]':' |')).join(' ')+'\n';}
  return{abc:out,map};
}
/* sons de batterie (synthèse) à un moment donné */
function drHit(id,t,out,v=1){try{const c=A.init();out=out||A.out||c.destination;
  const env=(g,a,d)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(a*v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+d);};
  const noise=d=>{const b=c.createBuffer(1,Math.ceil(c.sampleRate*d),c.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;return s;};
  const tone=(f0,f1,d,a)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d*.8);env(g,a,d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.05);};
  const hiss=(type,f,q,d,a)=>{const s=noise(d+.05),fl=c.createBiquadFilter(),g=c.createGain();fl.type=type;fl.frequency.value=f;fl.Q.value=q;env(g,a,d);s.connect(fl);fl.connect(g);g.connect(out);s.start(t);s.stop(t+d+.05);};
  if(id==='kick')tone(140,42,.35,.9);
  else if(id==='snare'){tone(190,150,.12,.35);hiss('highpass',1800,.7,.18,.45);}
  else if(id==='ftom')tone(110,80,.45,.7);else if(id==='mtom')tone(165,120,.38,.65);else if(id==='htom')tone(220,165,.32,.6);
  else if(id==='hh')hiss('highpass',7500,.8,.06,.3);else if(id==='hhp')hiss('highpass',6000,.8,.09,.22);
  else if(id==='ride'){hiss('bandpass',5200,1.2,.9,.2);tone(3100,3000,.7,.04);}
  else if(id==='crash')hiss('highpass',4200,.6,1.6,.36);
}catch(e){}}
MOD.lb.mount=function(){
  const M=this;
  $('#toolbar').replaceChildren(btn('Nouvelle lecture',newEx,'primary'),(M.sb=btn('● Commencer',()=>M.start(),'primary')),
    btn('▶ Écouter le modèle',()=>M.model()),el('span',{class:'sep'}),stopBtn());
  M.dots=el('div',{class:'beatdots'});M.kit=el('div',{class:'drkit'});M.leg=el('div',{class:'drleg'});
  $('#answer').replaceChildren(el('div',{class:'ahead'},el('h2',{},'Joue la partition',typeof betaTag==='function'?betaTag():null),(M.ch=el('p',{class:'hint'}))),
    el('details',{class:'drlegw',open:''},el('summary',{},'Légende de la portée'),M.leg),M.kit,M.dots);
  S.keyHandler=e=>{const id=Object.keys(DRK).find(k=>DRK[k].code===e.code);if(id&&M.on.has(id)){M.hit(id);return true;}return false;};
  S.midiHandler=null;
};
MOD.lb.buildKit=function(){
  const M=this,els=S.cfg.lb.els;M.on=new Set(els);M.pads={};
  M.kit.replaceChildren(...DR_ORDER.filter(id=>M.on.has(id)).map(id=>{
    const p=el('button',{type:'button',class:'drpad dr-'+id,'aria-label':T(DRK[id].t)+' ('+DRK[id].k+')'},el('b',{},DRK[id].s),el('kbd',{},DRK[id].k));
    p.addEventListener('pointerdown',e=>{e.preventDefault();M.hit(id);});M.pads[id]=p;return p;}));
  /* légende : chaque élément à sa place sur la portée */
  const ids=DR_IDS.filter(x=>M.on.has(x)).sort((a,b)=>DR_IDS.indexOf(a)-DR_IDS.indexOf(b));
  const abc=`X:1\nL:1/4\nK:C clef=perc\nV:1 stem=up\n`+ids.map(h=>(DRK[h].x?'!style=x!':'')+DRK[h].n).join(' ')+' |]\nw: '+ids.map(h=>T(DRK[h].a).replace(/ /g,'~')).join(' ')+'\n';
  if(HAS_ABC())ABCJS.renderAbc(M.leg,abc,{add_classes:true,staffwidth:Math.max(200,ids.length*62),paddingtop:0,paddingbottom:0,responsive:'resize',foregroundColor:'currentColor'});
};
MOD.lb.fresh=function(){Object.assign(S.st,{ins:[],live:false,res:null});this.ch.textContent=`Le métronome joue d'abord ${countText(S.ex.meter)}. Joue ensuite la partition avec les pads ou les touches du clavier indiquées (plusieurs touches en même temps pour les coups simultanés).`;this.buildKit();this.redraw();this.beat(-1);};
MOD.lb.clear=function(){S.st.res=null;this.redraw();feedback('');};
MOD.lb.redraw=function(){const M=this,ex=S.ex;if(!ex)return;const sc=$('#score');sc.classList.remove('single');
  const r=abcDrums(ex,{perLine:perLine()});draw(sc,r.abc);M.els=ex.events.map(()=>[]);
  for(const[v,m,k,i]of r.map){const e=sc.querySelector(`.abcjs-v${v}.abcjs-mm${m}.abcjs-n${k}`);if(e)M.els[i].push(e);}
  if(S.st.res)S.st.res.forEach(([i,c])=>(M.els[i]||[]).forEach(e=>e.classList.add(c)));};
MOD.lb.now=function(i){(this.els||[]).forEach(a=>a.forEach(e=>e.classList.remove('is-now')));if(i>=0&&this.els[i])this.els[i].forEach(e=>e.classList.add('is-now'));};
MOD.lb.beat=function(b){const n=S.ex.meter.beats;this.dots.replaceChildren(...Array.from({length:n},(_,k)=>el('i',{class:k===b?'on':''})));};
MOD.lb.flash=function(id){const p=this.pads&&this.pads[id];if(!p)return;p.classList.add('hit');setTimeout(()=>p.classList.remove('hit'),110);};
MOD.lb.model=function(){
  const M=this;M.clear();A.init();if(typeof qzUnmute==='function')qzUnmute();
  const plan=planOf(S.ex,{countIn:true});const s=run(plan,{sound:'none',onStep:it=>{M.now(it.i);const e=S.ex.events[it.i];if(e)e.hits.forEach(h=>M.flash(h));},onEnd:()=>M.now(-1)});
  for(const it of plan.items){const e=S.ex.events[it.i];if(e)for(const h of e.hits)drHit(h,it.t,s.g,.9);}
};
MOD.lb.start=async function(){
  A.init();if(A.ctx.state!=='running'){try{await A.ctx.resume();}catch(e){}}
  if(typeof qzUnmute==='function')qzUnmute();
  const M=this,c=S.cfg.lb;M.clear();S.st.ins=[];
  const plan=planOf(S.ex,{countIn:true,metro:c.metro!==false});S.st.live=true;M.kit.classList.add('live');
  run(plan,{sound:'none',onBeat:k=>M.beat(k.b),onEnd:stopped=>{S.st.live=false;M.kit.classList.remove('live');M.beat(-1);if(!stopped)M.evaluate(plan);}});
};
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

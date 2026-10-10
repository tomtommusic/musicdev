/* ========== MODULE : Outils (métronome et accordeur) ========== */
const tlLoad=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v&&typeof v==='object'?Object.assign({},d,v):d;}catch(e){return d;}};
const tlSave=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
function toolsStop(){metroStop();tunerStop();}

MOD.mt.mount=function(){$('#toolbar').replaceChildren();this.root=el('div',{class:'tl'});$('#answer').replaceChildren(this.root);};
MOD.mt.fresh=function(){this.root.replaceChildren(metroView());};
MOD.ac.mount=function(){$('#toolbar').replaceChildren();this.root=el('div',{class:'tl'});$('#answer').replaceChildren(this.root);};
MOD.ac.fresh=function(){this.root.replaceChildren(tunerView());};

/* ---------------- MÉTRONOME ---------------- */
const MT_DEF={bpm:96,beats:4,vol:{acc:.9,beat:.7,e8:0,e3:0,e16:0},shuffle:false,sound:'bip',master:.9,
  ramp:{on:false,step:4,every:4,to:140},mute:{on:false,play:2,silent:2}};
const MT=tlLoad('atelier-metro',MT_DEF);MT.vol=Object.assign({},MT_DEF.vol,MT.vol);MT.ramp=Object.assign({},MT_DEF.ramp,MT.ramp);MT.mute=Object.assign({},MT_DEF.mute,MT.mute);
const MS={on:false,timer:0,next:0,beat:0,bar:0,startBpm:0,taps:[],ui:null,master:null,queue:[]};
const mtSave=()=>tlSave('atelier-metro',MT);
const TEMPO_WORDS=[[40,'Grave'],[60,'Largo'],[66,'Larghetto'],[76,'Adagio'],[108,'Andante'],[120,'Moderato'],[156,'Allegro'],[176,'Vivace'],[200,'Presto'],[999,'Prestissimo']];
const tempoWord=b=>TEMPO_WORDS.find(([m])=>b<m)[1];
/* sons du métronome : trois hauteurs (temps fort, temps, subdivisions) */
function mtTick(t,kind,g){
  const c=A.ctx,dest=MS.master;if(g<=0||!dest)return;
  const f={acc:[1760,2093],beat:[1320,1568],sub:[990,1175]}[kind];
  if(MT.sound==='bois'){
    const out=c.createGain();out.gain.setValueAtTime(.0001,t);out.gain.exponentialRampToValueAtTime(.8*g,t+.002);out.gain.exponentialRampToValueAtTime(.0001,t+.09);out.connect(dest);
    const base={acc:1280,beat:900,sub:640}[kind];
    for(const[m,a]of[[1,1],[2.03,.3]]){const o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.setValueAtTime(base*m*1.07,t);o.frequency.exponentialRampToValueAtTime(base*m,t+.015);og.gain.value=a;o.connect(og);og.connect(out);o.start(t);o.stop(t+.1);}
    return;
  }
  if(MT.sound==='clic'){
    const o=c.createOscillator(),hp=c.createBiquadFilter(),out=c.createGain();o.type='square';o.frequency.value=f[0]*.9;hp.type='highpass';hp.frequency.value=700;
    out.gain.setValueAtTime(.0001,t);out.gain.exponentialRampToValueAtTime(.35*g,t+.001);out.gain.exponentialRampToValueAtTime(.0001,t+.025);o.connect(hp);hp.connect(out);out.connect(dest);o.start(t);o.stop(t+.04);return;
  }
  const o=c.createOscillator(),out=c.createGain();o.type='sine';o.frequency.value=f[0];
  out.gain.setValueAtTime(.0001,t);out.gain.exponentialRampToValueAtTime(.7*g,t+.001);out.gain.exponentialRampToValueAtTime(.0001,t+(kind==='sub'?.035:.06));
  o.connect(out);out.connect(dest);o.start(t);o.stop(t+.08);
}
/* positions dans un temps (fraction) -> [son, volume] ; on garde le plus fort quand deux couches tombent ensemble */
function mtSlots(first){
  const v=MT.vol,m=new Map();const put=(p,k,g)=>{if(g<=0)return;const o=m.get(p);if(!o||g>o[1])m.set(p,[k,g]);};
  if(first&&MT.beats>1&&v.acc>0)put(0,'acc',v.acc);else put(0,'beat',v.beat);
  put(.5,'sub',v.e8);
  if(MT.shuffle)put(2/3,'sub',v.e3);else{put(1/3,'sub',v.e3);put(2/3,'sub',v.e3);}
  [.25,.5,.75].forEach(p=>put(p,'sub',v.e16));
  return[...m.entries()].sort((a,b)=>a[0]-b[0]);
}
function mtSchedule(){
  const c=A.ctx;
  while(MS.next<c.currentTime+.12){
    const spb=60/MT.bpm,t=MS.next,first=MS.beat===0;
    const silent=MT.mute.on&&(MS.bar%(MT.mute.play+MT.mute.silent))>=MT.mute.play;
    if(!silent)for(const[p,[k,g]]of mtSlots(first))mtTick(t+p*spb,k,g);
    MS.queue.push({t,beat:MS.beat,bar:MS.bar,silent});
    MS.beat++;MS.next+=spb;
    if(MS.beat>=Math.max(1,MT.beats)){MS.beat=0;MS.bar++;
      if(MT.ramp.on&&MS.bar%MT.ramp.every===0){const dir=MT.ramp.to>=MS.startBpm?1:-1;const nb=MT.bpm+dir*MT.ramp.step;MT.bpm=dir>0?Math.min(MT.ramp.to,nb):Math.max(MT.ramp.to,nb);mtShowBpm();}}
  }
}
function mtFrame(){
  if(!MS.on)return;const c=A.ctx;
  while(MS.queue.length&&MS.queue[0].t<=c.currentTime){const q=MS.queue.shift();mtLight(q);}
  requestAnimationFrame(mtFrame);
}
function metroStart(){
  if(MS.on)return;const c=A.init();
  MS.master=c.createGain();MS.master.gain.value=MT.master;MS.master.connect(c.destination);
  MS.on=true;MS.beat=0;MS.bar=0;MS.queue=[];MS.startBpm=MT.bpm;MS.next=c.currentTime+.08;
  mtSchedule();MS.timer=setInterval(mtSchedule,25);requestAnimationFrame(mtFrame);mtUi();
}
function metroStop(){
  if(!MS.on)return;MS.on=false;clearInterval(MS.timer);MS.timer=0;MS.queue=[];
  try{const g=MS.master;g.gain.setTargetAtTime(0,A.ctx.currentTime,.01);setTimeout(()=>g.disconnect(),200);}catch(e){}MS.master=null;
  if(MT.ramp.on&&MS.startBpm)MT.bpm=MS.startBpm;mtShowBpm();mtUi();mtLight(null);
}
const mtToggle=()=>MS.on?metroStop():metroStart();
function mtSetBpm(b){MT.bpm=Math.max(30,Math.min(260,Math.round(b)));if(MS.on)MS.startBpm=MT.bpm;mtShowBpm();mtSave();}
function mtShowBpm(){const u=MS.ui;if(!u)return;u.bpm.textContent=MT.bpm;u.word.textContent=tempoWord(MT.bpm);u.slider.value=MT.bpm;}
function mtUi(){const u=MS.ui;if(!u)return;u.go.textContent=MS.on?'■ Arrêter':'▶ Démarrer';u.go.classList.toggle('on',MS.on);u.panel.classList.toggle('running',MS.on);}
function mtLight(q){const u=MS.ui;if(!u)return;u.leds.querySelectorAll('i').forEach((x,k)=>{x.classList.toggle('on',!!q&&k===q.beat&&!q.silent);x.classList.toggle('mute',!!q&&q.silent);});
  u.barc.textContent=q?`Mesure ${q.bar+1}${q.silent?' · silence':''}`:'';}
function mtTap(){
  const now=performance.now(),T=MS.taps;if(T.length&&now-T[T.length-1]>2000)T.length=0;T.push(now);if(T.length>6)T.shift();
  if(T.length>=2){const d=(T[T.length-1]-T[0])/(T.length-1);mtSetBpm(60000/d);}
}
const MT_PRESETS=[
  ['Noires','♩',{e8:0,e3:0,e16:0},false],
  ['Croches','♫',{e8:.6,e3:0,e16:0},false],
  ['Triolets','3',{e8:0,e3:.6,e16:0},false],
  ['Doubles','♬',{e8:.5,e3:0,e16:.45},false],
  ['Shuffle','♪♪',{e8:0,e3:.6,e16:0},true],
];
function metroView(){
  const u={};MS.ui=u;
  u.bpm=el('b',{class:'mtbpm'},String(MT.bpm));u.word=el('span',{class:'mtword'},tempoWord(MT.bpm));
  u.slider=el('input',{type:'range',min:30,max:260,step:1,value:MT.bpm,class:'mtslider','aria-label':'Tempo'});
  u.slider.addEventListener('input',()=>mtSetBpm(+u.slider.value));
  const step=d=>el('button',{type:'button',class:'mtstep',onclick:()=>mtSetBpm(MT.bpm+d),'aria-label':(d>0?'+':'')+d},(d>0?'+':'−')+Math.abs(d));
  u.leds=el('div',{class:'mtleds'});u.barc=el('span',{class:'mtbar'});
  const leds=()=>{u.leds.replaceChildren(...Array.from({length:Math.max(1,MT.beats)},(_,k)=>el('i',{class:k===0&&MT.beats>1?'acc':''})));};leds();
  u.go=el('button',{type:'button',class:'mtgo',onclick:mtToggle},'▶ Démarrer');
  const tap=el('button',{type:'button',class:'mttap',onclick:mtTap},'Tap');
  const beatsSel=sel('mt_beats',[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6'],[7,'7'],[8,'8'],[9,'9']],MT.beats,v=>{MT.beats=+v;leds();mtSave();});
  const soundSel=sel('mt_sound',[['bip','Bip électronique'],['bois','Bloc de bois'],['clic','Clic sec']],MT.sound,v=>{MT.sound=v;mtSave();});
  /* table de mixage */
  const faders={};
  const fader=(k,lab,glyph)=>{const r=el('input',{type:'range',min:0,max:100,step:1,value:Math.round(MT.vol[k]*100),class:'mtfader','aria-label':lab,orient:'vertical'});
    const val=el('span',{class:'mtfv'},String(Math.round(MT.vol[k]*100)));
    r.addEventListener('input',()=>{MT.vol[k]=+r.value/100;val.textContent=r.value;markPreset();mtSave();});faders[k]={r,val};
    return el('label',{class:'mtch'},el('span',{class:'mtg'},glyph),el('div',{class:'mtfwrap'},r),val,el('small',{},lab));};
  const presetBtns=MT_PRESETS.map(([lab,g,v,sh])=>el('button',{type:'button',class:'mtpre',onclick:()=>{Object.assign(MT.vol,v);MT.shuffle=sh;Object.entries(faders).forEach(([k,f])=>{f.r.value=Math.round(MT.vol[k]*100);f.val.textContent=f.r.value;});shuf.checked=sh;markPreset();mtSave();}},el('b',{},g),el('small',{},lab)));
  const shuf=el('input',{type:'checkbox',id:'mt_shuf'});shuf.checked=MT.shuffle;shuf.addEventListener('change',()=>{MT.shuffle=shuf.checked;markPreset();mtSave();});
  function markPreset(){MT_PRESETS.forEach(([,,v,sh],i)=>presetBtns[i].setAttribute('aria-pressed',String(Object.keys(v).every(k=>Math.abs(MT.vol[k]-v[k])<.01||(v[k]>0&&MT.vol[k]>0))&&MT.shuffle===sh)));}
  const mixer=el('div',{class:'mtmix'},fader('acc','Temps fort','1'),fader('beat','Temps','♩'),fader('e8','Croches','♫'),fader('e3','Triolets','3'),fader('e16','Doubles','♬'));
  markPreset();
  /* entraînement */
  const num=(id,v,min,max,on)=>{const i=el('input',{type:'number',id,min,max,value:v,class:'mtnum',inputmode:'numeric'});i.addEventListener('change',()=>{const x=Math.max(min,Math.min(max,Math.round(+i.value||min)));i.value=x;on(x);mtSave();});return i;};
  const rOn=el('input',{type:'checkbox',id:'mt_ramp'});rOn.checked=MT.ramp.on;rOn.addEventListener('change',()=>{MT.ramp.on=rOn.checked;mtSave();});
  const mOn=el('input',{type:'checkbox',id:'mt_mute'});mOn.checked=MT.mute.on;mOn.addEventListener('change',()=>{MT.mute.on=mOn.checked;mtSave();});
  const vol=el('input',{type:'range',min:0,max:100,value:Math.round(MT.master*100),class:'mtvol','aria-label':'Volume'});vol.addEventListener('input',()=>{MT.master=+vol.value/100;if(MS.master)MS.master.gain.value=MT.master;mtSave();});
  u.panel=el('div',{class:'mtpanel'},
    el('div',{class:'mtscreen'},
      el('div',{class:'mtread'},u.bpm,el('div',{class:'mtunit'},el('span',{},'BPM'),u.word)),
      u.leds,u.barc),
    el('div',{class:'mtrow mtadj'},step(-10),step(-1),u.slider,step(1),step(10)),
    el('div',{class:'mtrow mtmain'},u.go,tap));
  const sec2=(t,...k)=>el('section',{class:'mtsec'},el('h3',{},t),...k);
  const out=el('div',{class:'mtwrap'},u.panel,
    sec2('Pulsation',el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Temps par mesure'),beatsSel),el('label',{class:'qzfield'},el('span',{class:'fl'},'Son'),soundSel),el('label',{class:'qzfield'},el('span',{class:'fl'},'Volume'),vol))),
    sec2('Subdivisions',el('p',{class:'hint'},'Choisis un modèle, ou monte chaque couche séparément : on peut les mélanger (par exemple temps + croches + doubles).'),
      el('div',{class:'mtpres'},presetBtns),mixer,el('label',{class:'chk'},shuf,'Triolets en shuffle (on n\'entend que la 3e note du triolet)')),
    sec2('Entraînement',
      el('div',{class:'mtopt'},el('label',{class:'chk'},rOn,el('b',{},'Accélération progressive')),
        el('p',{class:'mtsent'},'Ajouter ',num('mt_rs',MT.ramp.step,1,20,x=>MT.ramp.step=x),' BPM toutes les ',num('mt_re',MT.ramp.every,1,32,x=>MT.ramp.every=x),' mesures, jusqu\'à ',num('mt_rt',MT.ramp.to,30,260,x=>MT.ramp.to=x),' BPM.'),
        el('p',{class:'hint'},'Au départ, le tempo revient à sa valeur de début.')),
      el('div',{class:'mtopt'},el('label',{class:'chk'},mOn,el('b',{},'Mesures muettes')),
        el('p',{class:'mtsent'},'Jouer ',num('mt_mp',MT.mute.play,1,16,x=>MT.mute.play=x),' mesures, puis ',num('mt_ms',MT.mute.silent,1,16,x=>MT.mute.silent=x),' mesures en silence.'),
        el('p',{class:'hint'},'Pour vérifier si tu gardes le tempo seul : tu dois retomber pile avec le métronome à son retour.'))),
    el('p',{class:'hint mtkeys'},'Clavier : barre d\'espace = démarrer / arrêter · flèches ↑ ↓ = ±1 BPM (avec Maj : ±10) · T = tap.'));
  S.keyHandler=e=>{if(e.code==='Space'){mtToggle();return true;}if(e.code==='ArrowUp'||e.code==='ArrowRight'){mtSetBpm(MT.bpm+(e.shiftKey?10:1));return true;}if(e.code==='ArrowDown'||e.code==='ArrowLeft'){mtSetBpm(MT.bpm-(e.shiftKey?10:1));return true;}if(e.key==='t'||e.key==='T'){mtTap();return true;}return false;};
  mtUi();mtShowBpm();
  return out;
}

/* ---------------- ACCORDEUR ---------------- */
/* accords : notes MIDI de la corde la plus grave à la plus aiguë (sauf indication) ; « b » = noms avec bémols */
const TUNINGS={
  chroma:{t:'Chromatique (vents, voix, toutes les notes)'},
  guitare:{t:'Guitare',sets:[
    ['std','Standard (mi la ré sol si mi)',[40,45,50,55,59,64]],
    ['half','½ ton plus bas',[39,44,49,54,58,63],'b'],
    ['full','1 ton plus bas',[38,43,48,53,57,62]],
    ['dropd','Drop D',[38,45,50,55,59,64]],
    ['dropcs','Drop D ½ ton plus bas (Drop C♯)',[37,44,49,54,58,63]],
    ['dropc','Drop C',[36,43,48,53,57,62]],
    ['openg','Open G',[38,43,50,55,59,62]],
    ['opend','Open D',[38,45,50,54,57,62]],
    ['dadgad','DADGAD',[38,45,50,55,57,62]]]},
  basse4:{t:'Basse 4 cordes',sets:[
    ['std','Standard (mi la ré sol)',[28,33,38,43]],
    ['half','½ ton plus bas',[27,32,37,42],'b'],
    ['full','1 ton plus bas',[26,31,36,41]],
    ['dropd','Drop D',[26,33,38,43]]]},
  basse5:{t:'Basse 5 cordes',sets:[
    ['std','Standard (si mi la ré sol)',[23,28,33,38,43]],
    ['half','½ ton plus bas',[22,27,32,37,42],'b']]},
  ukulele:{t:'Ukulélé',order:'play',sets:[
    ['std','Standard (sol do mi la, sol aigu)',[67,60,64,69]],
    ['lowg','Sol grave (Low G)',[55,60,64,69]],
    ['re','Accord en ré (la ré fa♯ si)',[69,62,66,71]],
    ['bari','Baryton (ré sol si mi)',[50,55,59,64]]]},
  banjo:{t:'Banjo 5 cordes',order:'play',sets:[
    ['openg','Open G (sol ré sol si ré)',[67,50,55,59,62]],
    ['dblc','Double C (sol do sol do ré)',[67,48,55,60,62]],
    ['dropc','Drop C / accord en do (sol do sol si ré)',[67,48,55,59,62]],
    ['gmod','Sol modal (sol ré sol do ré)',[67,50,55,60,62]],
    ['opend','Open D (fa♯ ré fa♯ la ré)',[66,50,54,57,62]]]},
  violon:{t:'Violon',sets:[['std','Standard (sol ré la mi)',[55,62,69,76]]]},
  alto:{t:'Alto',sets:[['std','Standard (do sol ré la)',[48,55,62,69]]]},
  cello:{t:'Violoncelle',sets:[['std','Standard (do sol ré la)',[36,43,50,57]]]},
};
const FR_SH=['do','do♯','ré','ré♯','mi','fa','fa♯','sol','sol♯','la','la♯','si'],FR_FL=['do','ré♭','ré','mi♭','mi','fa','sol♭','sol','la♭','la','si♭','si'];
const TN_LEDS=[-50,-35,-25,-17,-11,-7,-4,0,4,7,11,17,25,35,50];
const tnName=(m,fl)=>(fl?FR_FL:FR_SH)[((m%12)+12)%12];
const TN_DEF={inst:'chroma',set:{},a4:440,tol:2,learner:false};
const TN=tlLoad('atelier-tuner',TN_DEF);TN.set=Object.assign({},TN.set);
const TS={done:new Set(),adv:false,on:false,stream:null,src:null,an:null,buf:null,timer:0,hist:[],lock:null,ui:null,needle:0,lastOk:0,okSince:0,ref:null};
const tnSave=()=>tlSave('atelier-tuner',TN);
const midiHz=m=>TN.a4*Math.pow(2,(m-69)/12);
function tnStrings(){const I=TUNINGS[TN.inst];if(!I.sets)return null;const k=TN.set[TN.inst]||I.sets[0][0];const s=I.sets.find(x=>x[0]===k)||I.sets[0];return{set:s,notes:s[2],flat:s[3]==='b',order:I.order};}
/* détection de hauteur précise : YIN sur la fonction de différence, interpolation parabolique sur la courbe brute */
function tnPitch(x,sr,fmin,fmax){
  const N=x.length,tmax=Math.min(Math.floor(sr/fmin),Math.floor(N/2)),tmin=Math.max(2,Math.floor(sr/fmax)),W=N-tmax;
  let rms=0;for(let i=0;i<N;i++)rms+=x[i]*x[i];rms=Math.sqrt(rms/N);if(rms<.006)return{rms};
  const d=new Float32Array(tmax+2),cm=new Float32Array(tmax+2);
  for(let t=1;t<=tmax+1;t++){let s=0;for(let i=0;i<W;i++){const v=x[i]-x[i+t];s+=v*v;}d[t]=s;}
  let run=0;cm[0]=1;for(let t=1;t<=tmax+1;t++){run+=d[t];cm[t]=run>0?d[t]*t/run:1;}
  let best=-1;for(let t=tmin;t<=tmax;t++){if(cm[t]<.12){while(t+1<=tmax&&cm[t+1]<cm[t])t++;best=t;break;}}
  if(best<0){let bv=1;for(let t=tmin;t<=tmax;t++)if(cm[t]<bv){bv=cm[t];best=t;}if(bv>.2)return{rms};}
  const a=d[best-1],b=d[best],c=d[best+1],den=a-2*b+c,off=den>0?.5*(a-c)/den:0;let T=best+Math.max(-1,Math.min(1,off));
  /* affinage : on mesure plusieurs périodes d'un coup (n×T), l'erreur d'interpolation est divisée par n */
  const n=Math.min(8,Math.floor((N*.5-3)/T));
  if(n>=2){const L0=Math.round(n*T),Wn=N-L0-3,dd=[];for(let L=L0-2;L<=L0+2;L++){let s2=0;for(let i=0;i<Wn;i++){const v=x[i]-x[i+L];s2+=v*v;}dd.push(s2);}
    let k=1;for(let j=1;j<4;j++)if(dd[j]<dd[k])k=j;const p=dd[k-1],q=dd[k],r2=dd[k+1],dn=p-2*q+r2;const o=dn>0?.5*(p-r2)/dn:0;
    const Tn=(L0-2+k+Math.max(-1,Math.min(1,o)))/n;if(Math.abs(Tn-T)<.5)T=Tn;}
  return{f:sr/T,clarity:1-cm[best],rms};
}
/* sous-échantillonnage (moyenne de paires) pour les notes graves : 4 à 16 fois moins de calcul */
function tnDetect(x,sr,fmin,fmax){
  let y=x,r=sr;while(r/2>=fmax*10&&y.length>=2048){const z=new Float32Array(y.length>>1);for(let i=0;i<z.length;i++)z[i]=.5*(y[2*i]+y[2*i+1]);y=z;r/=2;}
  return tnPitch(y,r,fmin,fmax);
}
async function tunerStart(){
  if(TS.on)return true;
  try{
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('no');
    const c=A.init();
    const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    TS.stream=stream;TS.src=c.createMediaStreamSource(stream);TS.an=c.createAnalyser();TS.an.fftSize=4096;TS.buf=new Float32Array(TS.an.fftSize);TS.src.connect(TS.an);
    TS.on=true;TS.hist=[];TS.timer=setInterval(tunerTick,60);tnUi();feedback('');return true;
  }catch(e){
    tunerStop();const n=e&&e.name;
    feedback(n==='NotAllowedError'||n==='SecurityError'?'Le micro a été refusé. Autorise-le dans les réglages de l\'appareil ou du navigateur, puis réessaie.':n==='NotFoundError'?'Aucun micro détecté.':'Le micro n\'est pas disponible ici.','bad');return false;
  }
}
function tunerStop(){clearInterval(TS.timer);TS.timer=0;if(TS.stream)TS.stream.getTracks().forEach(t=>t.stop());try{TS.src&&TS.src.disconnect();}catch(e){}Object.assign(TS,{on:false,stream:null,src:null,an:null,hist:[]});tnRefStop();tnUi();}
function tnRange(){const s=tnStrings();if(!s)return[27,4200];const lo=Math.min(...s.notes),hi=Math.max(...s.notes);return[midiHz(lo)*.7,midiHz(hi)*1.45];}
function tunerTick(){
  if(!TS.on||!TS.an)return;TS.an.getFloatTimeDomainData(TS.buf);
  const[fmin,fmax]=tnRange();const sr=A.ctx.sampleRate;
  /* fenêtre adaptée : plus courte pour les notes aiguës (plus réactif), longue pour la basse */
  const need=Math.min(TS.buf.length,Math.max(2048,Math.pow(2,Math.ceil(Math.log2(sr/fmin*2.2)))));
  const r=tnDetect(TS.buf.subarray(TS.buf.length-need),sr,fmin,fmax);
  if(!r.f||r.clarity<.88){TS.hist=[];tnShow(null,r.rms);return;}
  TS.hist.push(r.f);if(TS.hist.length>5)TS.hist.shift();
  const srt=TS.hist.slice().sort((a,b)=>a-b),f=srt[srt.length>>1];
  /* une estimation trop loin de la médiane (saut d'octave, attaque) est ignorée */
  if(Math.abs(1200*Math.log2(r.f/f))>40&&TS.hist.length>2){TS.hist.pop();}
  tnShow(f,r.rms);
}
function tnTarget(f){
  const m=69+12*Math.log2(f/TN.a4);const s=tnStrings();
  if(!s){const n=Math.round(m);return{midi:n,cents:100*(m-n),k:-1};}
  let k=TS.lock;if(k==null||k>=s.notes.length){let bd=1e9;s.notes.forEach((n,i)=>{const d=Math.abs(m-n);if(d<bd){bd=d;k=i;}});}
  return{midi:s.notes[k],cents:100*(m-s.notes[k]),k};
}
function tnShow(f,rms){
  const u=TS.ui;if(!u)return;
  u.level.style.width=Math.min(100,Math.round((rms||0)*900))+'%';
  const ledsOff=()=>u.leds.querySelectorAll('i').forEach(x=>x.className='');
  if(!f){u.box.classList.add('idle');u.box.classList.remove('ok','low','high');u.note.textContent='–';u.oct.textContent='';u.cents.textContent=TS.on?'Joue une note':'';u.hz.textContent='';TS.okSince=0;ledsOff();u.arrow.classList.add('off');tnStringsMark(-1,false);tnGuide(null);return;}
  const tg=tnTarget(f),s=tnStrings(),c=tg.cents;
  u.box.classList.remove('idle');
  const shown=s?tg.midi:tg.midi-transp();u.note.textContent=tnName(shown,s&&s.flat);u.oct.textContent=String(Math.floor(shown/12)-1);
  u.wr.textContent=!s&&transp()?'note écrite':'';
  const ok=Math.abs(c)<=TN.tol;const now=performance.now();
  if(ok){if(!TS.okSince)TS.okSince=now;}else TS.okSince=0;
  const stable=ok&&now-TS.okSince>350;
  u.box.classList.toggle('ok',stable);u.box.classList.toggle('low',!ok&&c<0);u.box.classList.toggle('high',!ok&&c>0);
  const cr=Math.round(c);
  u.cents.textContent=Math.abs(c)>=100?(c<0?`Beaucoup trop bas (${cr} ¢)`:`Beaucoup trop haut (+${cr} ¢)`):stable?'Juste':`${cr>0?'+':''}${cr} ¢ · ${c<0?'trop bas':'trop haut'}`;
  u.hz.textContent=`${f.toFixed(2).replace('.',',')} Hz · cible ${midiHz(tg.midi).toFixed(2).replace('.',',')} Hz`;
  /* petite flèche continue sous les voyants (même échelle qu'eux) */
  const cc=Math.max(-50,Math.min(50,c));let j=0;while(j<TN_LEDS.length-2&&TN_LEDS[j+1]<cc)j++;
  const idx=j+(cc-TN_LEDS[j])/(TN_LEDS[j+1]-TN_LEDS[j]);TS.needle=u.arrow.classList.contains('off')?idx:TS.needle+(idx-TS.needle)*.5;
  u.arrow.classList.remove('off');u.arrow.style.left=`${(TS.needle+.5)/TN_LEDS.length*100}%`;
  /* rangée de voyants : plus serrés près du centre ; le voyant central s'allume en vert seulement si c'est juste */
  ledsOff();const L=u.leds.querySelectorAll('i');
  if(Math.abs(c)<=TN.tol)L[TN_LEDS.indexOf(0)].className=stable?'ok':'near';
  else{let k=0,bd=1e9;TN_LEDS.forEach((v,i)=>{if(v===0)return;if(Math.sign(v)!==Math.sign(c))return;const d=Math.abs(v-Math.max(-50,Math.min(50,c)));if(d<bd){bd=d;k=i;}});L[k].className=Math.abs(c)>25?'far':'off2';}
  tnStringsMark(tg.k,stable,ok?'':c>0?'high':'low');tnGuide(tg,stable);
  if(TN.learner&&stable&&s&&now-TS.okSince>1300&&!TS.adv){TS.adv=true;setTimeout(()=>{TS.adv=false;const n=s.notes.length;for(let j=1;j<=n;j++){const kk=((TS.lock||0)+j)%n;if(!TS.done.has(kk)){TS.lock=kk;TS.hist=[];TS.okSince=0;tnStringsMark(-1,false);tnGuide(null);return;}}},600);}
}
function tnStringsMark(k,ok,state){const u=TS.ui;if(!u||!u.head)return;
  u.head.querySelectorAll('[data-k]').forEach(g=>{const i=+g.dataset.k;g.classList.toggle('cur',i===k);g.classList.toggle('high',i===k&&state==='high');g.classList.toggle('low',i===k&&state==='low');g.classList.toggle('lock',i===TS.lock);if(i===k&&ok){g.classList.add('done');TS.done.add(i);}});}
/* tête d'instrument dessinée : chevilles cliquables (viser une corde), corde active en couleur, ✓ quand elle est juste */
function tnHead(s){
  const NS='http://www.w3.org/2000/svg',mk=(t,a,...k)=>{const e=document.createElementNS(NS,t);for(const[x,v]of Object.entries(a))e.setAttribute(x,v);k.forEach(c=>e.append(c));return e;};
  const notes=s.notes,n=notes.length,banjo=TN.inst==='banjo',hs=banjo?[1,2,3,4]:notes.map((_,i)=>i),m=hs.length,Lc=Math.ceil(m/2);
  /* vue de face : les cordes extérieures (mi grave, mi aigu) vont aux chevilles près du sillet, les cordes du centre (ré, sol) aux chevilles du haut */
  const left=hs.slice(0,Lc).reverse(),right=hs.slice(Lc),rows=Math.max(left.length,right.length);
  const W=320,top=18,nut=rows===2?178:228,H=nut+86,svg=mk('svg',{viewBox:`0 0 ${W} ${H}`,class:'tnheadsvg',role:'img','aria-label':'Tête de l\'instrument : touche une cheville pour viser cette corde'});
  const sp=Math.min(17,96/Math.max(1,n-1)),nx=i=>W/2-(n-1)/2*sp+i*sp,nutL=nx(0)-12,nutR=nx(n-1)+12;
  const rowY=r=>top+30+r*((nut-top-50)/Math.max(1,rows-1||1));
  svg.append(mk('path',{d:`M${nutL-4} ${nut} L${W/2-78} ${top+8} Q${W/2} ${top-10} ${W/2+78} ${top+8} L${nutR+4} ${nut} Z`,class:'tnhs'}));
  svg.append(mk('rect',{x:nutL,y:nut,width:nutR-nutL,height:H-nut,class:'tnneck'}));
  svg.append(mk('rect',{x:nutL-2,y:nut-3,width:nutR-nutL+4,height:6,rx:2,class:'tnnut'}));
  const peg=(i,px,py,post)=>{const num=n-i,name=tnName(notes[i],s.flat);
    const g=mk('g',{'data-k':i,class:'tnpeg',tabindex:'0',role:'button','aria-label':`Corde ${num}, ${name}`});
    const below=post[1]>nut;g.append(mk('line',{x1:post[0],y1:post[1],x2:nx(i),y2:below?post[1]:nut,class:'tnstrg'}),mk('line',{x1:nx(i),y1:below?post[1]:nut,x2:nx(i),y2:H,class:'tnstrg'}),
      mk('line',{x1:px,y1:py,x2:post[0],y2:post[1],class:'tnshaft'}),mk('circle',{cx:post[0],cy:post[1],r:4,class:'tnpost'}),
      mk('circle',{cx:px,cy:py,r:21,class:'tnknob'}),
      mk('text',{x:px,y:py+2,class:'tnpegn'},document.createTextNode(name)),mk('text',{x:px,y:py+15,class:'tnpegs'},document.createTextNode(String(num))),
      mk('text',{x:px+15,y:py-12,class:'tnchk'},document.createTextNode('✓')));
    g.addEventListener('click',()=>{TS.lock=TS.lock===i&&!TN.learner?null:i;TS.hist=[];tnStringsMark(-1,false);if(TS.ui&&TS.ui.auto)TS.ui.auto.classList.toggle('on',TS.lock==null);tnGuide(null);});
    return g;};
  const off=()=>40;
  left.forEach((i,r)=>svg.append(peg(i,40,rowY(r),[W/2-off(r),rowY(r)])));
  right.forEach((i,r)=>svg.append(peg(i,W-40,rowY(r),[W/2+off(r),rowY(r)])));
  if(banjo){const y=nut+58;svg.append(peg(0,40,y,[nx(0),y]));}
  return el('div',{class:'tnhead'},svg);
}
/* mode apprenti : on vise une corde à la fois, on dit clairement s'il faut tendre ou détendre, et on avertit avant que la corde casse */
function tnGuide(tg,stable){
  const u=TS.ui;if(!u||!u.guide)return;const s=tnStrings();
  if(!TN.learner||!s){u.guide.hidden=true;return;}u.guide.hidden=false;
  const k=TS.lock==null?0:TS.lock,tgt=s.notes[k],num=s.notes.length-k,name=tnName(tgt,s.flat);
  const semi=tg?Math.round(tg.cents/100):null,ladder=[];
  for(let d=-3;d<=3;d++){const cls=['tnrung',d===0?'tgt':'',semi===d?(d===0?'here ok':'here '+(d>0?'hi':'lo')):''].join(' ');ladder.push(el('span',{class:cls},tnName(tgt+d,s.flat),d===0?el('small',{},'cible'):semi===d?el('small',{},'toi'):null));}
  if(semi!=null&&semi>3)ladder.push(el('span',{class:'tnrung here hi'},'▲',el('small',{},'+'+semi)));
  if(semi!=null&&semi<-3)ladder.unshift(el('span',{class:'tnrung here lo'},'▼',el('small',{},String(semi))));
  let msg,cls='';
  if(!tg){msg=TS.on?`Joue la corde ${num} (${name}) toute seule et laisse-la sonner.`:'Active le micro pour commencer.';}
  else{const c=tg.cents,cur=tnName(tgt+semi,s.flat);
    if(Math.abs(c)<=TN.tol){msg=stable?'✓ Juste ! On passe à la corde suivante…':'Tiens la note…';cls='ok';}
    else if(c>150){msg=`⚠ Arrête de tendre ! Ta corde sonne ${cur}, ${semi} demi-ton${semi>1?'s':''} plus haut que ${name}. Détends-la (le son doit descendre), sinon elle risque de casser.`;cls='danger';
      if(navigator.vibrate&&performance.now()-(TS.vib||0)>2500){TS.vib=performance.now();try{navigator.vibrate(220);}catch(e){}}}
    else if(c>50)msg=`Trop haut : tu joues ${cur}, qui est après ${name}. Détends un peu la corde (le son doit descendre).`,cls='hi';
    else if(c>0)msg='Presque ! Un tout petit peu trop haut : détends très légèrement.',cls='hi';
    else if(c<-150)msg=`Trop bas : tu joues ${cur}, ${-semi} demi-tons sous ${name}. Tends la corde petit à petit en la faisant sonner.`,cls='lo';
    else if(c<-50)msg=`Trop bas : tu joues ${cur}, qui est avant ${name}. Tends un peu la corde (le son doit monter).`,cls='lo';
    else msg='Presque ! Un tout petit peu trop bas : tends très légèrement.',cls='lo';}
  const allDone=s.notes.every((_,i)=>TS.done.has(i));
  u.guide.className='tnguide '+cls;
  u.guide.replaceChildren(el('div',{class:'tngh'},el('b',{},`Corde ${num} : ${name}`),el('span',{},allDone?'🎉 Toutes les cordes sont justes':`${TS.done.size} / ${s.notes.length} cordes justes`)),
    el('div',{class:'tnladder'},ladder),el('p',{class:'tnmsg'},msg),
    el('div',{class:'tngbtn'},btn('‹ Corde précédente',()=>tnGo(-1),'quiet'),btn('▶ Entendre la note',()=>tnRef(tgt),'quiet'),btn('Corde suivante ›',()=>tnGo(1),'quiet')));
}
function tnGo(d){const s=tnStrings();if(!s)return;const n=s.notes.length;TS.lock=((TS.lock==null?0:TS.lock)+d+n)%n;TS.hist=[];TS.okSince=0;tnStringsMark(-1,false);tnGuide(null);}
function tnRefStop(){if(TS.ref){try{TS.ref.g.gain.setTargetAtTime(0,A.ctx.currentTime,.03);const r=TS.ref;setTimeout(()=>{try{r.o.stop();}catch(e){}},200);}catch(e){}TS.ref=null;}}
function tnRef(m){
  tnRefStop();const c=A.init(),o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),g2=c.createGain();
  o.type='sine';o.frequency.value=midiHz(m);o2.type='sine';o2.frequency.value=midiHz(m)*2;g2.gain.value=.25;
  g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.35,c.currentTime+.04);g.gain.setTargetAtTime(.0001,c.currentTime+2.4,.25);
  o.connect(g);o2.connect(g2);g2.connect(g);g.connect(c.destination);o.start();o2.start();o.stop(c.currentTime+3.6);o2.stop(c.currentTime+3.6);TS.ref={o,g};
}
function tnUi(){const u=TS.ui;if(!u)return;u.mic.textContent=TS.on?'■ Couper le micro':'🎤 Activer le micro';u.mic.classList.toggle('primary',!TS.on);if(!TS.on)tnShow(null,0);}
function tunerView(){
  const u={};TS.ui=u;
  const instSel=sel('tn_inst',Object.entries(TUNINGS).map(([k,v])=>[k,v.t]),TN.inst,v=>{TN.inst=v;TS.lock=null;TS.hist=[];tnSave();refresh();});
  const setBox=el('div',{});
  const tolSel=sel('tn_tol',[[1,'± 1 cent (très strict)'],[2,'± 2 cents (strict)'],[3,'± 3 cents']],TN.tol,v=>{TN.tol=+v;tnSave();});
  const a4=el('input',{type:'number',id:'tn_a4',min:415,max:466,step:1,value:TN.a4,class:'mtnum',inputmode:'numeric'});
  a4.addEventListener('change',()=>{TN.a4=Math.max(415,Math.min(466,Math.round(+a4.value||440)));a4.value=TN.a4;tnSave();refresh();});
  u.mic=el('button',{type:'button',class:'btn primary tnmic',onclick:()=>TS.on?tunerStop():tunerStart()},'🎤 Activer le micro');
  u.note=el('b',{class:'tnnote'},'–');u.wr=el('span',{class:'tnwr'});u.oct=el('sub',{class:'tnoct'});u.cents=el('p',{class:'tncents'});u.hz=el('p',{class:'tnhz'});
  u.level=el('i');
  u.leds=el('div',{class:'tnleds','aria-hidden':'true'},TN_LEDS.map(v=>el('i',{'data-v':v})));
  u.arrow=el('i',{class:'tnarrow off'});
  const scale=el('div',{class:'tnledwrap'},u.leds,el('div',{class:'tnarrowtrack'},u.arrow),el('div',{class:'tnledlab'},el('span',{},'−50'),el('span',{},'0'),el('span',{},'+50')));
  u.box=el('div',{class:'tnbox idle'},el('div',{class:'tnflat'},'♭'),el('div',{class:'tnmid'},el('div',{class:'tnname'},u.note,u.oct),u.wr,u.cents),el('div',{class:'tnsharp'},'♯'));
  u.strings=el('div',{class:'tnstrings'});u.guide=el('div',{class:'tnguide',hidden:true});
  const lrn=el('input',{type:'checkbox',id:'tn_learn'});lrn.checked=!!TN.learner;
  lrn.addEventListener('change',()=>{TN.learner=lrn.checked;tnSave();refresh();});
  u.learn=el('label',{class:'tnlearn',title:'Pour les débutants : une corde à la fois, avec des consignes claires'},lrn,el('span',{},'Mode apprenti'));
  function refresh(){
    const s=tnStrings();setBox.replaceChildren();TS.lock=null;
    if(s){const I=TUNINGS[TN.inst];
      setBox.append(el('label',{class:'qzfield'},el('span',{class:'fl'},'Accord'),sel('tn_set',I.sets.map(x=>[x[0],x[1]]),s.set[0],v=>{TN.set[TN.inst]=v;tnSave();refresh();})));
      TS.done=new Set();if(TN.learner)TS.lock=0;
      u.head=tnHead(s);u.auto=el('button',{type:'button',class:'tnauto'+(TS.lock==null?' on':''),onclick:()=>{TS.lock=null;u.auto.classList.add('on');tnStringsMark(-1,false);}},'Auto : corde la plus proche');
      u.strings.replaceChildren(u.head,TN.learner?u.guide:u.auto);u.learn.hidden=false;
      u.strings.hidden=false;u.refs.replaceChildren(el('span',{class:'fl'},'Entendre une corde'),...s.notes.map((m,i)=>el('button',{type:'button',class:'btn quiet sq',onclick:()=>tnRef(m)},tnName(m,s.flat))));
    }else{u.strings.hidden=true;u.strings.replaceChildren();u.head=null;u.learn.hidden=true;
      setBox.append(el('label',{class:'qzfield'},el('span',{class:'fl'},'Instrument transpositeur'),sel('tn_tr',TRANSP_OPTS,S.transp,v=>{S.transp=v;try{localStorage.setItem('atelier-transp',v)}catch(e){}TS.hist=[];})));u.refs.replaceChildren(el('span',{class:'fl'},'Note de référence'),btn(`▶ La ${TN.a4} Hz`,()=>tnRef(69),'quiet'));}
  }
  u.refs=el('div',{class:'tnrefs'});
  const out=el('div',{class:'tnwrap'},
    el('div',{class:'tnpanel'},
      el('div',{class:'tntop'},u.mic,el('span',{class:'tnlevel','aria-hidden':'true'},u.level),u.learn),
      u.box,scale,u.hz,u.strings),
    el('section',{class:'mtsec'},el('h3',{},'Instrument et accord'),
      el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Instrument'),instSel),setBox),
      u.refs),
    el('section',{class:'mtsec'},el('h3',{},'Précision'),
      el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Zone « juste »'),tolSel),
        el('label',{class:'qzfield'},el('span',{class:'fl'},'Diapason : la ='),el('span',{class:'tna4'},a4,' Hz'))),
      el('p',{class:'hint'},'« Juste » s\'allume seulement si la note reste dans la zone choisie pendant un court instant. Avec un instrument choisi, l\'accordeur vise la corde la plus proche (Auto) ou la cheville que tu touches. Le mode apprenti guide une corde à la fois et avertit quand une corde est beaucoup trop tendue. Les écarts sont toujours mesurés par rapport à la note exacte de la corde : aucune tolérance cachée.')));
  refresh();tnShow(null,0);tnUi();tnGuide(null);
  return out;
}

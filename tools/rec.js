
/* ---------------- ENREGISTREUR ---------------- */
/* un seul enregistrement à la fois : gardé dans l'appareil jusqu'au partage, puis supprimé */
MOD.en.mount=function(){$('#toolbar').replaceChildren();this.root=el('div',{class:'tl'});$('#answer').replaceChildren(this.root);};
MOD.en.fresh=function(){this.root.replaceChildren(recView());recRestore();};
const RC_DEF={count:true,click:false,max:10,level:true};
const RC=tlLoad('atelier-rec',RC_DEF);
const rcSave=()=>tlSave('atelier-rec',RC);
const RS={on:false,arming:false,stream:null,rec:null,chunks:[],t0:0,timer:0,an:null,src:null,buf:null,raf:0,wake:null,last:null,url:'',ui:null,cdTimer:0,cdNodes:[]};
const REC_TYPES=[['audio/mp4;codecs=mp4a.40.2','m4a'],['audio/mp4','m4a'],['audio/aac','aac'],['audio/webm;codecs=opus','webm'],['audio/webm','webm'],['audio/ogg;codecs=opus','ogg']];
const recType=()=>{if(typeof MediaRecorder==='undefined')return null;for(const[t,e]of REC_TYPES){try{if(MediaRecorder.isTypeSupported(t))return[t,e];}catch(x){}}return['',''];};
const recExt=t=>/mp4|aac|m4a/.test(t)?'m4a':/ogg/.test(t)?'ogg':/webm/.test(t)?'webm':'m4a';
const recClock=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
const recSize=b=>{const kb=b/1024,en=I18N.lang==='en';if(kb<1024)return Math.max(1,Math.round(kb))+(I18N.lang==='fr'?' ko':' KB');const mb=(kb/1024).toFixed(1);return(en?mb:mb.replace('.',','))+(I18N.lang==='fr'?' Mo':' MB');};
const recDefaultName=d=>{const p=n=>String(n).padStart(2,'0');return`MusicDEV ${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}h${p(d.getMinutes())}`;};
const recClean=s=>String(s||'').replace(/[\\/:*?"<>|\u0000-\u001f]+/g,' ').replace(/\s+/g,' ').trim().replace(/^\.+/,'').slice(0,80);
/* stockage temporaire (IndexedDB) : survit à une fermeture accidentelle de l'app */
function recDb(){return new Promise((ok,ko)=>{try{const r=indexedDB.open('musicdev-rec',1);r.onupgradeneeded=()=>r.result.createObjectStore('rec');r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error);}catch(e){ko(e);}});}
async function recDbDo(mode,fn){try{const db=await recDb();return await new Promise((ok,ko)=>{const tx=db.transaction('rec',mode),st=tx.objectStore('rec');const r=fn(st);tx.oncomplete=()=>{ok(r&&r.result);db.close();};tx.onerror=()=>{ko(tx.error);db.close();};});}catch(e){return null;}}
const recStore=v=>recDbDo('readwrite',st=>st.put(v,'last'));
const recLoad=()=>recDbDo('readonly',st=>st.get('last'));
const recWipe=()=>recDbDo('readwrite',st=>st.delete('last'));

async function recStart(){
  if(RS.on||RS.arming)return;
  if(typeof MediaRecorder==='undefined'||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){feedback('L\'enregistrement n\'est pas possible dans ce navigateur.','bad');return;}
  if(RS.last&&!RS.confirmNew){recConfirmNew();return;}
  RS.confirmNew=false;
  if(MS.on)metroStop();
  const c=A.init();
  let stream;
  if(typeof qzSessionForMic==='function')qzSessionForMic(true);
  try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});}
  catch(e0){try{stream=await navigator.mediaDevices.getUserMedia({audio:true});}catch(e){stream=null;var err=e;}}
  if(!stream){const e=err;if(typeof qzSessionForMic==='function')qzSessionForMic(false);const n=e&&e.name;feedback(n==='NotAllowedError'||n==='SecurityError'?'Le micro a été refusé. Autorise-le dans les réglages de l\'appareil ou du navigateur, puis réessaie.':n==='NotFoundError'?'Aucun micro détecté.':'Le micro n\'est pas disponible ici.'+(n?' ('+n+')':''),'bad');return;}
  feedback('');
  await recDelete(true);
  RS.stream=stream;RS.src=c.createMediaStreamSource(stream);RS.an=c.createAnalyser();RS.an.fftSize=2048;RS.buf=new Float32Array(RS.an.fftSize);RS.src.connect(RS.an);
  RS.arming=true;recUi();recMeter();
  try{if(navigator.wakeLock)RS.wake=await navigator.wakeLock.request('screen');}catch(e){RS.wake=null;}
  /* décompte d'une mesure au tempo du métronome */
  if(RC.count){
    const beats=Math.max(2,MT.beats),sp=60/MT.bpm,t0=c.currentTime+.12,g=c.createGain();g.gain.value=Math.max(.3,MT.master);g.connect(c.destination);
    for(let k=0;k<beats;k++){const t=t0+k*sp,o=c.createOscillator(),e=c.createGain();o.frequency.value=k===0?1760:1320;e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(.7,t+.001);e.gain.exponentialRampToValueAtTime(.0001,t+.06);o.connect(e);e.connect(g);o.start(t);o.stop(t+.08);RS.cdNodes.push(o);}
    let k=0;const show=()=>{if(!RS.arming)return;RS.ui.state.textContent=String(beats-k);k++;if(k<beats)RS.cdTimer=setTimeout(show,sp*1000);};
    RS.cdTimer=setTimeout(show,120);
    await new Promise(ok=>{RS.cdTimer2=setTimeout(ok,Math.max(0,(t0+beats*sp-c.currentTime)*1000));});
    RS.cdNodes=[];
    if(!RS.arming)return; /* annulé pendant le décompte */
  }
  RS.arming=false;
  const[tp]=recType()||[''];
  try{RS.rec=new MediaRecorder(stream,tp?{mimeType:tp,audioBitsPerSecond:128000}:{audioBitsPerSecond:128000});}
  catch(e){try{RS.rec=new MediaRecorder(stream);}catch(e2){feedback('L\'enregistrement n\'est pas possible dans ce navigateur.','bad');recRelease();recUi();return;}}
  RS.chunks=[];RS.rec.ondataavailable=e=>{if(e.data&&e.data.size)RS.chunks.push(e.data);};
  RS.rec.onstop=recFinish;
  RS.rec.start(1000);RS.on=true;RS.t0=performance.now();if(typeof lyGo==='function')lyGo(true);
  if(RC.click)metroStart();
  RS.timer=setInterval(()=>{const s=(performance.now()-RS.t0)/1000;if(RS.ui){RS.ui.clock.textContent=recClock(s);if(RS.ui.lfclock)RS.ui.lfclock.textContent=recClock(s);}if(s>=RC.max*60)recStop();},250);
  recUi();
}
function recStop(){
  if(RS.arming){RS.arming=false;clearTimeout(RS.cdTimer);clearTimeout(RS.cdTimer2);RS.cdNodes.forEach(o=>{try{o.stop();}catch(e){}});RS.cdNodes=[];recRelease();recUi();return;}
  if(!RS.on)return;RS.on=false;clearInterval(RS.timer);RS.timer=0;if(typeof lyGo==='function')lyGo(false);
  if(RC.click)metroStop();
  RS.dur=(performance.now()-RS.t0)/1000;
  try{RS.rec.state!=='inactive'&&RS.rec.stop();}catch(e){recFinish();}
  recRelease();recUi();
}
function recRelease(){
  if(RS.stream&&typeof qzSessionForMic==='function')qzSessionForMic(false);
  cancelAnimationFrame(RS.raf);RS.raf=0;
  if(RS.stream)RS.stream.getTracks().forEach(t=>t.stop());try{RS.src&&RS.src.disconnect();}catch(e){}
  Object.assign(RS,{stream:null,src:null,an:null});
  try{RS.wake&&RS.wake.release();}catch(e){}RS.wake=null;
  if(RS.ui)RS.ui.meter.style.setProperty('--lv','0');
}
/* égaliseur de volume lent : gain inverse de l'enveloppe (fenêtre ~0,4 s), limité, puis normalisation ; sortie WAV 16 bits */
async function recLevel(blob){
  const c=A.init(),buf=await new Promise((ok,ko)=>{blob.arrayBuffer().then(ab=>{const p=c.decodeAudioData(ab,ok,ko);if(p&&p.then)p.then(ok,ko);}).catch(ko);});
  const sr=buf.sampleRate,n=buf.length,ch=buf.numberOfChannels;if(!n||n>sr*60*12)return null;
  const x=new Float32Array(n);for(let k=0;k<ch;k++){const d=buf.getChannelData(k);for(let i=0;i<n;i++)x[i]+=d[i]/ch;}
  const F=Math.round(sr*.05),nf=Math.ceil(n/F),rms=new Float32Array(nf);
  for(let f=0;f<nf;f++){let s=0,m=0;for(let i=f*F;i<Math.min(n,(f+1)*F);i++){s+=x[i]*x[i];m++;}rms[f]=Math.sqrt(s/Math.max(1,m));}
  const W=12,env=new Float32Array(nf); /* fenêtre ±0,6 s : on suit les grandes variations, pas chaque syllabe */for(let f=0;f<nf;f++){let s=0,m=0;for(let j=Math.max(0,f-W);j<=Math.min(nf-1,f+W);j++){s+=rms[j];m++;}env[f]=s/m;}
  const act=Array.from(env).filter(v=>v>.004).sort((a,b)=>a-b);if(act.length<4)return null;
  const target=act[Math.floor(act.length*.6)],gate=Math.max(.003,target*.12);
  /* correction par phrase : un seul gain pour toute une phrase (pas de vague à l'intérieur), correction partielle
     (racine carrée) pour garder les nuances ; les changements de gain se font dans les silences */
  const on=new Uint8Array(nf);for(let f=0;f<nf;f++)on[f]=rms[f]>gate?1:0;
  const runs=[];for(let f=0;f<nf;){if(!on[f]){f++;continue;}let e=f;while(e<nf){if(on[e]){e++;continue;}let g=e;while(g<nf&&!on[g])g++;if(g-e<5&&g<nf)e=g;else break;}runs.push([f,e]);f=e;}
  const pts=[];/* [trame, gain] */
  for(const[a0,b0]of runs){const L=b0-a0,nb=Math.max(1,Math.round(L/60)),bl=L/nb;
    for(let k=0;k<nb;k++){const s0=Math.round(a0+k*bl),e0=Math.round(a0+(k+1)*bl);let e2=0,m=0;for(let f=s0;f<e0;f++){e2+=rms[f]*rms[f];m++;}
      const g=Math.max(.5,Math.min(2,Math.sqrt(target/Math.max(1e-6,Math.sqrt(e2/Math.max(1,m))))));pts.push([s0,g],[e0-1,g]);}}
  const gain=new Float32Array(nf);
  if(!pts.length)gain.fill(1);else{let j=0;for(let f=0;f<nf;f++){while(j<pts.length-1&&pts[j+1][0]<=f)j++;const[fa,ga]=pts[j],nx=pts[Math.min(pts.length-1,j+1)];
    if(f<=fa||nx[0]===fa)gain[f]=f<pts[0][0]?pts[0][1]:ga;else{const t=Math.min(1,(f-fa)/(nx[0]-fa));gain[f]=ga+(nx[1]-ga)*t;}}}
  let pk=0;for(let i=0;i<n;i++){const fi=i/F-.5,a=Math.max(0,Math.min(nf-1,Math.floor(fi))),b=Math.min(nf-1,a+1),t=Math.max(0,Math.min(1,fi-a));x[i]*=gain[a]*(1-t)+gain[b]*t;const v=Math.abs(x[i]);if(v>pk)pk=v;}
  const norm=pk>0?.89/pk:1,ab=new ArrayBuffer(44+n*2),v=new DataView(ab),w=(o,str)=>{for(let i=0;i<str.length;i++)v.setUint8(o+i,str.charCodeAt(i));};
  w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++){const s2=Math.max(-1,Math.min(1,x[i]*norm));v.setInt16(44+i*2,s2<0?s2*32768:s2*32767,true);}
  return new Blob([ab],{type:'audio/wav'});
}
async function recFinish(){
  const type=(RS.rec&&RS.rec.mimeType)||(RS.chunks[0]&&RS.chunks[0].type)||'audio/mp4';
  const blob=new Blob(RS.chunks,{type:type.split(';')[0]});RS.chunks=[];RS.rec=null;
  if(!blob.size){feedback('Rien n\'a été enregistré. Vérifie le micro et réessaie.','bad');recUi();return;}
  let out=blob,otype=blob.type,oext=recExt(type);
  /* volume stabilisé : certains téléphones font « pomper » le niveau (fort, moins fort…) ; on le lisse et on normalise */
  if(RC.level!==false){if(RS.ui)RS.ui.state.textContent='Traitement…';try{const w=await recLevel(blob);if(w){out=w;otype='audio/wav';oext='wav';}}catch(e){}}
  const d=new Date();RS.last={blob:out,type:otype,ext:oext,dur:RS.dur||0,date:d.getTime(),name:recDefaultName(d),shared:false};
  await recStore(RS.last);recShow();
}
async function recRestore(){
  if(RS.on||RS.arming){recUi();return;}
  if(!RS.last){const v=await recLoad();if(v&&v.blob)RS.last=v;}
  recShow();
}
async function recDelete(silent){
  if(RS.url){URL.revokeObjectURL(RS.url);RS.url='';}
  RS.last=null;await recWipe();if(!silent)recShow();
}
function recFileName(){const u=RS.ui,n=recClean(u&&u.name?u.name.value:'')||recDefaultName(new Date(RS.last.date));return n+'.'+RS.last.ext;}
function recFile(){return new File([RS.last.blob],recFileName(),{type:RS.last.type||'audio/mp4'});}
async function recShare(){
  const f=recFile();
  if(!(navigator.canShare&&navigator.canShare({files:[f]}))){recDownload();return;}
  try{await navigator.share({files:[f],title:f.name});RS.last.shared=true;recStore(RS.last);recAfter();}
  catch(e){if(e&&e.name!=='AbortError')recDownload();}
}
function recDownload(){
  const f=recFile(),u=URL.createObjectURL(f),a=el('a',{href:u,download:f.name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);
  RS.last.shared=true;recStore(RS.last);recAfter();
}
/* après le partage : on propose de supprimer (le partage n'est pas toujours confirmé par l'appareil) */
function recAfter(){
  const u=RS.ui;if(!u)return;
  u.after.replaceChildren(el('div',{class:'qzconfirm'},
    el('p',{},el('b',{},'C\'est envoyé ?'),' Supprime l\'enregistrement pour garder l\'app légère.'),
    el('div',{class:'qzbtns'},btn('Supprimer l\'enregistrement',()=>recDelete(),'primary'),btn('Garder pour l\'instant',()=>u.after.replaceChildren(),'quiet'))));
}
function recConfirmNew(){
  const u=RS.ui;if(!u)return;
  u.after.replaceChildren(el('div',{class:'qzconfirm'},
    el('p',{},el('b',{},'Un seul enregistrement à la fois.'),' Le dernier sera supprimé : partage-le d\'abord si tu veux le garder.'),
    el('div',{class:'qzbtns'},btn('Supprimer et enregistrer',()=>{u.after.replaceChildren();RS.confirmNew=true;recStart();},'primary'),btn('Annuler',()=>u.after.replaceChildren(),'quiet'))));
  u.after.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function recMeter(){
  const u=RS.ui;if(!RS.an||!u)return;
  RS.an.getFloatTimeDomainData(RS.buf);let pk=0;for(const v of RS.buf){const a=Math.abs(v);if(a>pk)pk=a;}
  const db=20*Math.log10(pk||1e-6),lv=Math.max(0,Math.min(1,(db+50)/50));
  u.meter.style.setProperty('--lv',lv.toFixed(3));u.meter.classList.toggle('clip',pk>.98);
  RS.raf=requestAnimationFrame(recMeter);
}
function recUi(){
  const u=RS.ui;if(!u)return;
  u.go.textContent=RS.on||RS.arming?'■ Arrêter':'● Enregistrer';u.go.classList.toggle('on',RS.on||RS.arming);
  u.panel.classList.toggle('live',RS.on);
  if(RS.on)u.state.textContent='Enregistrement…';
  else if(RS.arming){if(!RC.count)u.state.textContent='Préparation…';}
  else u.state.textContent=RS.last?'Enregistrement prêt':'Prêt';
  if(!RS.on&&!RS.arming){u.clock.textContent=recClock(RS.last?RS.last.dur:0);if(u.lfclock)u.lfclock.textContent=u.clock.textContent;}
  if(typeof lyPaint==='function')lyPaint();
  [u.count,u.click,u.max,u.slider,u.tap,u.prev,u.beats,...(u.steps||[])].forEach(x=>{if(x)x.disabled=RS.on||RS.arming;});
  if(u.prev)u.prev.textContent=MS.on&&!RS.on?'■ Arrêter':'▶ Écouter le tempo';
}
function recShow(){
  const u=RS.ui;if(!u)return;recUi();u.after.replaceChildren();
  if(!RS.last){u.take.replaceChildren(el('p',{class:'hint'},'Ton enregistrement apparaîtra ici : tu pourras l\'écouter, le nommer, puis le partager.'));return;}
  if(RS.url)URL.revokeObjectURL(RS.url);RS.url=URL.createObjectURL(RS.last.blob);
  const au=el('audio',{controls:true,preload:'metadata',src:RS.url,class:'rcaudio'});
  u.name=el('input',{type:'text',class:'qzin',id:'rc_name',maxlength:'80',autocomplete:'off',spellcheck:'false'});u.name.value=RS.last.name;
  u.name.addEventListener('input',()=>{RS.last.name=u.name.value;clearTimeout(u.nt);u.nt=setTimeout(()=>recStore(RS.last),400);});
  u.name.addEventListener('blur',()=>{const c=recClean(u.name.value);if(!c)u.name.value=recDefaultName(new Date(RS.last.date));else if(c!==u.name.value)u.name.value=c;RS.last.name=u.name.value;recStore(RS.last);});
  const canShare=(()=>{try{return!!(navigator.canShare&&navigator.canShare({files:[recFile()]}));}catch(e){return false;}})();
  u.take.replaceChildren(
    el('div',{class:'rcmeta'},el('span',{},recClock(RS.last.dur)),el('span',{},recSize(RS.last.blob.size)),el('span',{},'.'+RS.last.ext)),
    au,
    typeof mstView==='function'?mstView(au):null,
    el('label',{class:'qzfield rcname'},el('span',{class:'fl'},'Nom du fichier'),el('span',{class:'rcnamebox'},u.name,el('span',{class:'rcext','data-notr':''},'.'+RS.last.ext))),
    el('div',{class:'qzbtns'},
      canShare?btn('Partager…',recShare,'primary'):null,
      btn(canShare?'Télécharger':'Télécharger le fichier',recDownload,canShare?'':'primary'),
      btn('Supprimer',()=>recDelete(),'quiet')),
    el('p',{class:'hint'},canShare?'« Partager » ouvre le menu de ton appareil : courriel, messages, AirDrop, Fichiers…':'Le fichier est enregistré dans tes téléchargements : joins-le ensuite à un courriel.'));
}
function recView(){
  const u={};RS.ui=u;
  u.clock=el('b',{class:'rcclock'},'0:00');u.state=el('span',{class:'rcstate'},'Prêt');
  u.meter=el('div',{class:'rcmeter','aria-hidden':'true'},el('i'));
  u.go=el('button',{type:'button',class:'rcgo',onclick:()=>RS.on||RS.arming?recStop():recStart()},'● Enregistrer');
  const MET_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l4 18H5z"/><path d="M6.6 15h10.8"/><path d="M12 15l5.5-9.5"/><circle cx="17.5" cy="5.5" r="1.3" fill="currentColor"/></svg>';
  const toggle=(key,cls,content,lab)=>{const b=el('button',{type:'button',class:'rctog '+cls,'aria-pressed':String(!!RC[key]),'aria-label':lab,title:lab});
    if(content.startsWith('<'))b.innerHTML=content;else b.textContent=content;
    b.addEventListener('click',()=>{RC[key]=!RC[key];b.setAttribute('aria-pressed',String(RC[key]));rcSave();});return b;};
  u.count=toggle('count','rccount','1 2 3 4','Décompte avant d\'enregistrer');u.count.dataset.notr='';
  u.click=toggle('click','rcclick',MET_SVG,'Métronome pendant l\'enregistrement');
  u.panel=el('div',{class:'mtpanel rcpanel'},
    el('div',{class:'mtscreen'},el('div',{class:'rcread'},el('span',{class:'rcdot','aria-hidden':'true'}),u.clock,u.state),u.meter),
    el('div',{class:'mtrow mtmain rcmain'},u.count,u.go,u.click));
  u.max=sel('rc_max',[[5,'5 min'],[10,'10 min'],[15,'15 min'],[20,'20 min']],RC.max,v=>{RC.max=+v;rcSave();});
  u.take=el('div',{class:'rctake'});u.after=el('div',{class:'rcafter'});
  const bpm=el("span",{class:"rcbpm"},`(♩ = ${MT.bpm})`);
  /* tempo et temps par mesure, réglables ici (partagés avec le métronome) */
  const tVal=el('b',{class:'rctv'},String(MT.bpm)),tWord=el('span',{class:'rctw'},tempoWord(MT.bpm));
  const showT=()=>{tVal.textContent=MT.bpm;tWord.textContent=tempoWord(MT.bpm);bpm.textContent=`(♩ = ${MT.bpm})`;u.slider.value=MT.bpm;};
  u.showT=showT;
  const step=d=>el('button',{type:'button',class:'btn rcstep','aria-label':(d>0?'+':'−')+Math.abs(d)+' BPM',onclick:()=>{mtSetBpm(MT.bpm+d);showT();}},(d>0?'+':'−')+Math.abs(d));
  u.slider=el('input',{type:'range',min:30,max:260,step:1,value:MT.bpm,class:'rcslider','aria-label':'Tempo'});
  u.slider.addEventListener('input',()=>{mtSetBpm(+u.slider.value);showT();});
  u.tap=el('button',{type:'button',class:'btn rctap',onclick:()=>{mtTap();showT();}},'Tap');
  u.prev=el('button',{type:'button',class:'btn rcprev',onclick:()=>{if(MS.on)metroStop();else metroStart();u.prev.textContent=MS.on?'■ Arrêter':'▶ Écouter le tempo';}},MS.on?'■ Arrêter':'▶ Écouter le tempo');
  u.beats=sel('rc_beats',[[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6'],[7,'7'],[8,'8'],[9,'9']],Math.max(2,MT.beats),v=>{MT.beats=+v;mtSave();});
  u.steps=[];const st=d=>{const b=step(d);u.steps.push(b);return b;};
  const tempoBox=el('div',{class:'rctempo'},
    el('div',{class:'rctrow'},st(-5),st(-1),el('div',{class:'rctread'},tVal,el('span',{class:'rctu'},'BPM'),tWord),st(1),st(5)),
    u.slider,
    el('div',{class:'rctrow2'},u.tap,u.prev,el('label',{class:'qzfield rcbeats'},el('span',{class:'fl'},'Temps par mesure'),u.beats)));
  const out=el('div',{class:'mtwrap'},u.panel,typeof lyView==='function'?lyView(u):null,
    el('section',{class:'mtsec'},el('h3',{},'Ton enregistrement'),u.take,u.after),
    el('section',{class:'mtsec'},el('h3',{},'Avant d\'enregistrer'),
      tempoBox,
      el('p',{class:'hint'},el('b',{},'1 2 3 4'),' : décompte d\'une mesure avant de commencer ',bpm,'. ',el('b',{},'Métronome'),' : clic pendant l\'enregistrement (avec des écouteurs, il ne s\'entend pas dans l\'enregistrement). Touche pour activer ou désactiver.'),
      el('p',{class:'hint'},'Ce tempo est aussi celui du ',el('a',{href:'#mt',onclick:e=>{e.preventDefault();openModule('mt');}},'métronome'),'.'),
      el('label',{class:'qzfield'},el('span',{class:'fl'},'Durée maximale'),u.max),
      el('p',{class:'hint'},'Garde l\'écran allumé pendant l\'enregistrement : s\'il se verrouille, l\'appareil coupe le micro. Un seul enregistrement est gardé à la fois, le temps de le partager.')));
  S.keyHandler=e=>{if(e.code==='Space'&&!(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))){RS.on||RS.arming?recStop():recStart();return true;}};
  return out;
}

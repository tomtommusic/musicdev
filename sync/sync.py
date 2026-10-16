#!/usr/bin/env python3
"""Synchronisation son / image / micro : compensation de la latence de sortie (et d'entrée du micro) + calibration par frappes."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
HELP=r'''/* ---------- latence audio : temps entre le moment où l'app joue un son et celui où on l'entend ----------
   valeur calibrée par l'élève (frappes sur des clics) ou, sinon, celle annoncée par l'appareil */
function audioLag(){try{const v=localStorage.getItem('atelier-lat');if(v!=null&&v!=='')return Math.max(0,Math.min(.6,+v/1000));}catch(e){}const c=A.ctx;return c?(c.outputLatency||c.baseLatency||0):0;}
const latCalibrated=()=>{try{const v=localStorage.getItem('atelier-lat');return v!=null&&v!=='';}catch(e){return false;}};
/* micro : le son joué en même temps qu'un clic entendu arrive à l'analyse après la sortie + l'entrée audio */
const micComp=()=>audioLag()+(MIC.inLat||.012);
function syncField(){
  const info=el('span',{class:'hint'});
  const upd=()=>{info.textContent=latCalibrated()?T('Calibré : {0} ms').replace('{0}',Math.round(audioLag()*1000)):T('Automatique : {0} ms (valeur annoncée par l\'appareil)').replace('{0}',Math.round(audioLag()*1000));};upd();
  const go=btn('Calibrer',()=>syncCalib(go,upd)),rs=btn('Automatique',()=>{try{localStorage.removeItem('atelier-lat')}catch(e){}upd();feedback('');},'quiet');
  return field(['Synchronisation son et image',typeof betaTag==='function'?betaTag():null].filter(Boolean),el('div',{class:'field'},el('div',{class:'row2'},go,rs),info,
    el('span',{class:'hint'},'Avec des écouteurs Bluetooth ou un haut-parleur sans fil, le son arrive en retard : l\'affichage et la correction se décalent. Clique « Calibrer », écoute 4 clics, puis frappe la barre d\'espace (ou ce bouton) sur chacun des 8 clics suivants. Réglage gardé sur cet appareil.')),true);
}
function syncCalib(go,done){
  stop();micStop();const c=A.init();if(typeof qzUnmute==='function')qzUnmute();
  const n=12,us=60/90,taps=[],old=S.keyHandler,lab=go.textContent;
  const tap=()=>{taps.push(c.currentTime);go.classList.add('on');setTimeout(()=>go.classList.remove('on'),90);};
  S.keyHandler=e=>{if(e.code==='Space'||e.code==='Enter'){tap();return true;}return false;};
  const pd=e=>{e.preventDefault();tap();};go.addEventListener('pointerdown',pd);go.textContent=T('Frappe ici');
  feedback(T('Écoute 4 clics, puis frappe sur les 8 suivants…'));
  const plan={items:[],clicks:Array.from({length:n},(_,k)=>({u:k,strong:k%4===0,b:k%4})),us,endU:n};
  const s=run(plan,{sound:'none',onEnd:stopped=>{S.keyHandler=old;go.removeEventListener('pointerdown',pd);go.textContent=lab;if(stopped)return;
    const d=[];for(let k=4;k<n;k++){const ct=s.t0+k*us;let best=null;for(const t of taps)if(Math.abs(t-ct)<.4&&(best==null||Math.abs(t-ct)<Math.abs(best-ct)))best=t;if(best!=null)d.push(best-ct);}
    if(d.length<5){feedback(T('Pas assez de frappes captées. Recommence en frappant sur chaque clic.'),'bad');return;}
    d.sort((a,b)=>a-b);const ms=Math.max(0,Math.min(500,Math.round(d[d.length>>1]*1000)));
    try{localStorage.setItem('atelier-lat',String(ms))}catch(e){}done();feedback(T('Décalage mesuré : {0} ms. L\'affichage et la correction en tiennent compte.').replace('{0}',ms),'ok');}});
}
'''
rep("function feedback(msg,kind){",HELP+"function feedback(msg,kind){")
# entendu maintenant : valeur calibrée si elle existe
rep("function heardTime(){const c=A.ctx;try{","function heardTime(){const c=A.ctx;if(latCalibrated())return c.currentTime-audioLag();try{")
# images (note en cours, temps du métronome, décompte) affichées quand le son est entendu
rep("const at=(t,fn)=>s.timers.push(setTimeout(fn,Math.max(0,(t-c.currentTime)*1000)));","const VL=audioLag(),at=(t,fn)=>s.timers.push(setTimeout(fn,Math.max(0,(t+VL-c.currentTime)*1000)));")
rep("while(MS.queue.length&&MS.queue[0].t<=c.currentTime){","while(MS.queue.length&&MS.queue[0].t<=c.currentTime-audioLag()){")
# micro : latence d'entrée et compensation des moments captés
rep("MIC.src=c.createMediaStreamSource(stream);","MIC.inLat=(()=>{try{const st=stream.getAudioTracks()[0].getSettings();return st&&st.latency>0&&st.latency<.3?st.latency:.012;}catch(e){return .012;}})();MIC.src=c.createMediaStreamSource(stream);")
rep("MIC.lastOn=now;MIC.onEvent&&MIC.onEvent({t:now-.015});","MIC.lastOn=now;MIC.onEvent&&MIC.onEvent({t:now-.015-micComp()});")
rep("if(MIC.samples)MIC.samples.push({t:c.currentTime-.03,mf});","if(MIC.samples)MIC.samples.push({t:c.currentTime-.03-micComp(),mf});")
rep("MIC.onEvent&&MIC.onEvent({midi:m,cents,t:MIC.candT});","MIC.onEvent&&MIC.onEvent({midi:m,cents,t:MIC.candT-micComp()});")
# réglage dans les modules de lecture
rep("  if(id==='lm'||id==='so')opts.push(pitchField());","  if(id==='lm'||id==='so')opts.push(pitchField());\n  if(id==='lm'||id==='lr'||id==='so')opts.push(syncField());")
rep("fs.push(sec('Options : lecture batterie'),field('Métronome'","fs.push(sec('Options : lecture batterie'),syncField(),field('Métronome'")
open(p,'w',encoding='utf-8').write(s);print('sync ok')

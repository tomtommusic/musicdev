#!/usr/bin/env python3
"""1.29 : accordeur (micro auto, chromatique sans verrouillage, très strict par défaut), bouton Écouter dans l'enregistreur,
barre compacte (Intervalles, Progressions), solfège toujours au micro, latence fournie par l'app iOS."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:90],s.count(a));s=s.replace(a,b)
# ---------- accordeur ----------
rep("const TN_DEF={inst:'chroma',set:{},a4:440,tol:2,learner:false};","const TN_DEF={inst:'chroma',set:{},a4:440,tol:1,learner:false,v2:1};")
rep("const TN=tlLoad('atelier-tuner',TN_DEF);","const TN=tlLoad('atelier-tuner',TN_DEF);if(!TN.v2){TN.v2=1;TN.tol=1;}")
rep("[[1,'± 1 cent (très strict)'],[2,'± 2 cents (strict)'],[3,'± 3 cents']]","[[1,'± 1 cent (très strict)'],[2,'± 2 cents (strict)'],[3,'± 3 cents'],[5,'± 5 cents (souple)']]")
# mode apprenti un peu moins strict : au moins ± 3 cents
rep("const ok=Math.abs(c)<=TN.tol;","const ok=Math.abs(c)<=(TN.learner&&s?Math.max(3,TN.tol):TN.tol);")
# chromatique : la nouvelle note remplace tout de suite l'ancienne (deux lectures concordantes) ; maintien plus court
rep("    if(TS.lastF&&performance.now()-TS.lastT<1600){tnShow(TS.lastF,r.rms);return;}",
    "    if(TS.lastF&&performance.now()-TS.lastT<(TN.learner&&tnStrings()?1600:600)){tnShow(TS.lastF,r.rms);return;}")
rep("""  const srt=TS.hist.slice().sort((a,b)=>a-b),f=srt[srt.length>>1];
  /* une estimation trop loin de la médiane (saut d'octave, attaque) est ignorée */
  if(Math.abs(1200*Math.log2(r.f/f))>40&&TS.hist.length>2){TS.hist.pop();}
  TS.lastF=f;""","""  const srt=TS.hist.slice().sort((a,b)=>a-b);let f=srt[srt.length>>1];
  /* une estimation trop loin de la médiane (saut d'octave, attaque) est ignorée ;
     en mode chromatique, deux lectures de suite sur une autre note = nouvelle note (pas de verrouillage) */
  if(Math.abs(1200*Math.log2(r.f/f))>40&&TS.hist.length>2){TS.hist.pop();
    if(!(TN.learner&&tnStrings())){if(TS.jump&&Math.abs(1200*Math.log2(r.f/TS.jump))<40){TS.hist=[TS.jump,r.f];f=r.f;TS.jump=null;}else TS.jump=r.f;}}
  else TS.jump=null;
  TS.lastF=f;""")
# micro activé automatiquement en ouvrant l'accordeur (on peut le couper)
rep("MOD.ac.fresh=function(){this.root.replaceChildren(tunerView());};",
    "MOD.ac.fresh=function(){this.root.replaceChildren(tunerView());TS.userOff=false;setTimeout(()=>{if(S.mod==='ac'&&!TS.on&&!TS.userOff)tunerStart();},60);};")
rep("u.mic=el('button',{type:'button',class:'btn primary tnmic',onclick:()=>TS.on?tunerStop():tunerStart()}",
    "u.mic=el('button',{type:'button',class:'btn primary tnmic',onclick:()=>{if(TS.on){TS.userOff=true;tunerStop();}else{TS.userOff=false;tunerStart();}}}")
rep("MOD.ac.mount=function(){","""
/* son bloqué tant qu'on n'a pas touché l'écran (navigateurs) : on le relance au premier contact */
['pointerdown','keydown','touchend'].forEach(ev=>document.addEventListener(ev,()=>{try{if(A.ctx&&A.ctx.state!=='running')A.ctx.resume();}catch(e){}},{passive:true}));
MOD.ac.mount=function(){""")
# ---------- enregistreur : bouton Écouter à côté de Reprendre ----------
rep("    u.retry=el('button',{type:'button',class:'btn rcretry',title:'Efface la prise et recommence tout de suite',onclick:()=>recRetry()},'↺ Reprendre'));",
    "    el('div',{class:'rcact'},u.play=el('button',{type:'button',class:'btn rcretry rcplay',hidden:true,onclick:()=>recPlayToggle()},'▶ Écouter'),u.retry=el('button',{type:'button',class:'btn rcretry',title:'Efface la prise et recommence tout de suite',onclick:()=>recRetry()},'↺ Reprendre')));")
rep("u.retry.hidden=!(RS.on||RS.arming||RS.last);","u.retry.hidden=!(RS.on||RS.arming||RS.last);if(u.play){u.play.hidden=!RS.last||RS.on||RS.arming;recPlayLab();}")
rep("  const au=el('audio',{controls:true,preload:'metadata',src:RS.url,class:'rcaudio'});",
    "  const au=el('audio',{controls:true,preload:'metadata',src:RS.url,class:'rcaudio'});RS.au=au;['play','pause','ended'].forEach(e=>au.addEventListener(e,recPlayLab));recPlayLab();")
rep("function recShow(){","""function recPlayLab(){const u=RS.ui,a=RS.au;if(!u||!u.play)return;const on=!!a&&!a.paused&&!a.ended;u.play.textContent=on?T('⏸ Pause'):T('▶ Écouter');u.play.classList.toggle('on',on);}
function recPlayToggle(){const a=RS.au;if(!a)return;if(a.paused||a.ended){if(a.ended)a.currentTime=0;const pr=a.play();if(pr&&pr.catch)pr.catch(()=>{});}else a.pause();}
function recShow(){""")
# ---------- styles ----------
css="""
.rcpanel .rcact{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:12px}
.rcpanel .rcact .rcretry{display:inline-flex;justify-content:center;margin:0;min-width:0;flex:1 1 0;max-width:190px}
.rcpanel .rcact .rcretry[hidden]{display:none}
.rcpanel .rcact .rcplay.on{background:rgb(255 255 255/.2)}
button,.btn,a,[role=button]{touch-action:manipulation}
@media (max-width:600px){
main[data-mod="iv"] #toolbar,main[data-mod="pc"] #toolbar{padding:10px}
main[data-mod="iv"] #toolbar .tgrow,main[data-mod="pc"] #toolbar .tgrow{flex-direction:row;flex-wrap:wrap;gap:6px}
main[data-mod="iv"] #toolbar .tg,main[data-mod="pc"] #toolbar .tg{display:contents}
main[data-mod="iv"] #toolbar .btn,main[data-mod="pc"] #toolbar .btn{flex:1 1 0!important;min-width:0!important;min-height:36px!important;height:auto!important;padding:4px 8px!important;font-size:13.5px!important;line-height:1.1!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}
main[data-mod="iv"] #toolbar .tg.main .btn,main[data-mod="pc"] #toolbar .tg.main .btn{order:0;flex:3 1 0!important;min-height:40px!important;font-size:15px!important}
main[data-mod="iv"] #toolbar .tg.tools .btn,main[data-mod="pc"] #toolbar .tg.tools .btn{order:1;flex:2 1 0!important;min-height:40px!important}
main[data-mod="iv"] #toolbar .tg.listen > *,main[data-mod="pc"] #toolbar .tg.listen > *{order:2}
main[data-mod="iv"] #toolbar .tg.listen,main[data-mod="pc"] #toolbar .tg.listen{order:2}
main[data-mod="iv"] #toolbar .tgrow::after,main[data-mod="pc"] #toolbar .tgrow::after{content:'';order:1;flex-basis:100%;height:0}
main[data-mod="iv"] #toolbar [data-stop],main[data-mod="pc"] #toolbar [data-stop]{flex:0 0 36px!important;width:36px!important;height:36px!important;min-width:36px!important;padding:0!important;font-size:0!important}
main[data-mod="iv"] #toolbar [data-stop] .ic,main[data-mod="pc"] #toolbar [data-stop] .ic{font-size:14px}
main[data-mod="iv"] #answer .ahead .hint,main[data-mod="pc"] #answer .ahead .hint{display:none}
}
"""
i=s.rindex("</style>");s=s[:i]+css+s[i:]
# ---------- solfège : le micro est toujours utilisé ----------
rep("    (()=>{const b=btn('● Chanter',()=>M.sing());b.setAttribute('data-nomic','');return b;})(),\n","")
rep("...micControls({mode:'pitch',onEvent:ev=>{if(S.st.ons)S.st.ons.push(ev);}","...micControls({mode:'pitch',always:true,onEvent:ev=>{if(S.st.ons)S.st.ons.push(ev);}")
# ---------- latence : valeur mesurée par l'app iOS (haut-parleur, écouteurs Bluetooth…) ----------
rep("const c=A.ctx;return c?(c.outputLatency||c.baseLatency||0):0;}",
    "const n=window.NATIVE_LAT;if(typeof n==='number'&&n>=0&&n<.6)return n;const c=A.ctx;return c?Math.min(.25,c.outputLatency||c.baseLatency||0):0;}")
open(p,'w',encoding='utf-8').write(s)
# ---------- 1.29.1 : micro repris au retour dans l'app, accordeur plus sensible ----------
s=open(p,encoding='utf-8').read()
rep("TS.gate=Math.max(.0005,Math.min(.0025,(TS.floor||.001)*2.2));","TS.gate=Math.max(.00025,Math.min(.0015,(TS.floor||.0008)*1.8));")
rep("TS.on=true;TS.hist=[];TS.timer=setInterval(tunerTick,80);",
    "TS.on=true;TS.hist=[];TS.timer=setInterval(tunerTick,80);{const tr=stream.getAudioTracks()[0];if(tr)tr.addEventListener('ended',()=>{if(TS.stream!==stream)return;tunerStop();if(!document.hidden&&S.mod==='ac'&&!TS.userOff)setTimeout(()=>{if(!TS.on)tunerStart();},400);});}")
rep("function tunerTick(){\n  if(!TS.on||!TS.an)return;","function tunerTick(){\n  if(!TS.on||!TS.an)return;if(A.ctx&&A.ctx.state!=='running'){try{A.ctx.resume();}catch(e){}}")
rep("MOD.ac.mount=function(){","""/* quand on quitte l'app (ou l'onglet) puis qu'on revient, iOS coupe le micro : on le relance */
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){if(TS.on){TS.resume=true;tunerStop();}if(typeof MIC!=='undefined'&&MIC.on){try{micStop();}catch(e){}}return;}
  try{if(A.ctx&&A.ctx.state!=='running')A.ctx.resume();}catch(e){}
  if(S.mod==='ac'&&!TS.userOff&&(TS.resume||!TS.on)){TS.resume=false;setTimeout(()=>{if(!TS.on&&!document.hidden)tunerStart();},350);}
});
window.addEventListener('pageshow',()=>{if(S.mod==='ac'&&!TS.userOff&&!TS.on)setTimeout(()=>{if(!TS.on)tunerStart();},350);});
MOD.ac.mount=function(){""")
open(p,'w',encoding='utf-8').write(s)
# ---------- 1.29.2 : plus de bouton « Couper le micro » (le micro reste actif dans l'accordeur) ;
#            le bouton n'apparaît que si le micro n'a pas pu démarrer, pour réessayer ----------
s=open(p,encoding='utf-8').read()
rep("function tnUi(){const u=TS.ui;if(!u)return;u.mic.textContent=TS.on?'■ Couper le micro':'🎤 Activer le micro';u.mic.classList.toggle('primary',!TS.on);if(!TS.on)tnShow(null,0);}",
    "function tnUi(){const u=TS.ui;if(!u)return;u.mic.textContent='🎤 Activer le micro';u.mic.hidden=TS.on||!TS.fail;if(!TS.on)tnShow(null,0);}")
rep("    tunerStop();const n=e&&e.name;","    TS.fail=true;tunerStop();const n=e&&e.name;")
rep("TS.on=true;TS.hist=[];TS.timer=setInterval(tunerTick,80);{","TS.on=true;TS.fail=false;TS.hist=[];TS.timer=setInterval(tunerTick,80);{")
open(p,'w',encoding='utf-8').write(s)
# ---------- 1.29.3 : relance robuste du micro de l'accordeur (iOS) ----------
# Au retour dans l'app, iOS peut laisser le contexte audio figé ou le micro muet : on surveille le signal
# (horloge audio arrêtée ou silence numérique parfait) et on reconstruit contexte + micro.
s=open(p,encoding='utf-8').read()
rep("function tunerTick(){\n  if(!TS.on||!TS.an)return;if(A.ctx&&A.ctx.state!=='running'){try{A.ctx.resume();}catch(e){}}",
"""function tnRevive(hard){
  if(S.mod!=='ac'||TS.userOff||document.hidden||TS.reviving)return;TS.reviving=true;
  tunerStop();
  if(hard||!A.ctx||A.ctx.state!=='running'){try{A.ctx&&A.ctx.close();}catch(e){}A.ctx=null;}
  setTimeout(async()=>{const ok=await tunerStart();TS.reviving=false;TS.wd={t:0,ct:-1,z:0};
    if(!ok&&!TS.retried){TS.retried=true;setTimeout(()=>tnRevive(true),1500);}else TS.retried=false;},450);
}
function tunerTick(){
  if(!TS.on||!TS.an)return;if(A.ctx&&A.ctx.state!=='running'){try{A.ctx.resume();}catch(e){}}
  {const w=TS.wd||(TS.wd={t:0,ct:-1,z:0}),now=performance.now(),ct=A.ctx?A.ctx.currentTime:0;
   const noGesture=navigator.userActivation&&!navigator.userActivation.hasBeenActive;
   if(ct!==w.ct){w.ct=ct;w.t=now;}else if(now-w.t>1200&&!noGesture&&now-(TS.lastRev||0)>4000){TS.wd=null;TS.lastRev=now;tnRevive(true);return;}}""")
rep("  const r=tnDetect(TS.buf.subarray(TS.buf.length-need),sr,fmin,fmax);\n  /* bruit ambiant",
    "  const r=tnDetect(TS.buf.subarray(TS.buf.length-need),sr,fmin,fmax);\n  if(TS.wd){if(!(r.rms>1e-7))TS.wd.z++;else TS.wd.z=0;if(TS.wd.z>25&&performance.now()-(TS.lastRev||0)>4000){TS.wd=null;TS.lastRev=performance.now();tnRevive(true);return;}}\n  /* bruit ambiant")
rep("  if(S.mod==='ac'&&!TS.userOff&&(TS.resume||!TS.on)){TS.resume=false;setTimeout(()=>{if(!TS.on&&!document.hidden)tunerStart();},350);}",
    "  if(S.mod==='ac'&&!TS.userOff&&(TS.resume||!TS.on)){TS.resume=false;tnRevive(true);}")
rep("window.addEventListener('pageshow',()=>{if(S.mod==='ac'&&!TS.userOff&&!TS.on)setTimeout(()=>{if(!TS.on)tunerStart();},350);});",
    "window.addEventListener('pageshow',()=>{if(S.mod==='ac'&&!TS.userOff&&!TS.on)tnRevive(false);});\nwindow.addEventListener('nativeresume',()=>{if(S.mod==='ac'&&!TS.userOff)tnRevive(true);});\nwindow.addEventListener('nativepause',()=>{if(TS.on){TS.resume=true;tunerStop();}});")
open(p,'w',encoding='utf-8').write(s)
# ---------- 1.30.2 : accueil, la bulle « Les modules » pointe vers le bouton du menu (téléphone) ----------
s=open(p,encoding='utf-8').read()
rep("  if(mobile)mp.after(hoTip('up','Les modules','Touche ici pour choisir ce que tu veux travailler.'));",
    "  if(mobile)mp.after(hoTip('up menu','Les modules','Touche le menu ☰ pour choisir ce que tu veux travailler.'));")
css2="""
.hotip.up.menu{align-self:flex-end!important;margin-left:auto!important;margin-right:4px;text-align:left}
.hotip.up.menu::before{left:auto!important;right:18px!important}
main[data-mod="ho"] .modpick .mp-ic{animation:hopulse 1.6s ease-out infinite;border-radius:12px}
@keyframes hopulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 55%,transparent)}70%{box-shadow:0 0 0 12px color-mix(in srgb,var(--accent) 0%,transparent)}100%{box-shadow:0 0 0 0 transparent}}
@media (prefers-reduced-motion:reduce){main[data-mod="ho"] .modpick .mp-ic{animation:none}}
"""
i=s.rindex("</style>");s=s[:i]+css2+s[i:]
open(p,'w',encoding='utf-8').write(s)
# ---------- 1.31.2 : mode apprenti — l'accordeur suit la corde pendant qu'on tourne la cheville ----------
# Avant, une mesure à plus de 40 cents de la mémoire était rejetée : en tournant la cheville, l'affichage restait figé.
# Maintenant, comme en chromatique : deux mesures de suite qui concordent = nouvelle hauteur, tout de suite ; maintien court.
s=open(p,encoding='utf-8').read()
rep("    if(!(TN.learner&&tnStrings())){if(TS.jump&&Math.abs(1200*Math.log2(r.f/TS.jump))<40){TS.hist=[TS.jump,r.f];f=r.f;TS.jump=null;}else TS.jump=r.f;}}",
    "    if(TS.jump&&Math.abs(1200*Math.log2(r.f/TS.jump))<40){TS.hist=[TS.jump,r.f];f=r.f;TS.jump=null;}else TS.jump=r.f;}")
rep("    if(TS.lastF&&performance.now()-TS.lastT<(TN.learner&&tnStrings()?1600:600)){tnShow(TS.lastF,r.rms);return;}",
    "    if(TS.lastF&&performance.now()-TS.lastT<600){tnShow(TS.lastF,r.rms);return;}")
open(p,'w',encoding='utf-8').write(s)

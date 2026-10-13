#!/usr/bin/env python3
"""Retours des testeurs (oct. 2026) : décompte des dictées, piano pour les rythmes, liens de la méthode,
pause en lecture de notes, micro plus sensible avec métronome visuel. À lancer après micbleed.py."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
# 1) dictée mélodique : décompte d'une mesure avant la mélodie et avant chaque mesure
rep("  M.mb=measureNav(M,k=>run(planOf(S.ex,{from:k,to:k+1,tail:true})));","  M.mb=measureNav(M,k=>run(planOf(S.ex,{from:k,to:k+1,tail:true,countIn:true})));")
rep("btn('▶ Mélodie',()=>run(planOf(S.ex))),M.mb,","btn('▶ Mélodie',()=>run(planOf(S.ex,{countIn:true}))),M.mb,")
# 2) son des rythmes : piano par défaut (on entend la durée des notes)
rep("perc:(()=>{try{return localStorage.getItem('atelier-perc')||'wood'}catch(e){return 'wood'}})()","perc:(()=>{try{return localStorage.getItem('atelier-perc')||'piano'}catch(e){return 'piano'}})()")
# 3) portée cachée pour de bon dans les modules sans portée (une ancienne partition restait visible)
rep("main[data-kind=\"quiz\"] #score,","main[data-kind=\"quiz\"] #score,main[data-kind=\"tools\"] #score,")
s=s.replace("</style>","main[data-kind=\"quiz\"] #score,main[data-kind=\"tools\"] #score{display:none!important}\n</style>",1)
# 4) méthode de travail : mots reliés à la bibliothèque (tonique, degré)
rep("function showMethod(id){const box=$('#method'),h=METHOD[id];box.hidden=!h;if(!h)return;box.querySelector('.methbody').innerHTML=h;}",
"""function showMethod(id){const box=$('#method'),h=METHOD[id];box.hidden=!h;if(!h)return;box.querySelector('.methbody').innerHTML=h;methLink(id,box);}
const METH_LINKS={pc:[[/(?<!\\p{L})(tonique|tonic|tónica)(?!\\p{L})/iu,'fonctions'],[/(?<!\\p{L})(degré|degree|grado)(?!\\p{L})/iu,'degres']],dm:[[/(?<!\\p{L})(degrés?|degrees?|grados?)(?!\\p{L})/iu,'degres']]};
function methLink(id,box){const L=METH_LINKS[id];if(!L)return;const b=box.querySelector('.methbody');let x=b.innerHTML;L.forEach(([re,t])=>{x=x.replace(re,m=>`<a href="#bt-${t}" class="methl" data-lib="${t}">${m}</a>`);});b.innerHTML=x;}
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a.methl');if(!a)return;e.preventDefault();openLibrary(a.dataset.lib);});""")
s=s.replace("</style>",".methbody a.methl{color:var(--accent);font-weight:700;text-decoration:underline;text-underline-offset:2px}\n</style>",1)
# 5) lecture de notes : pause (pour parler sans perdre de notes) et micro qu'on rallume en cours de série
rep("  $('#toolbar').replaceChildren(btn('Nouvelle série',newEx,'primary'),M.goBtn,...micControls({mode:'pitch',onEvent:ev=>M.micAnswer(ev.midi),start:()=>M.start(),api:(M.mic={})}));",
"""  M.pauseBtn=btn('⏸ Pause',()=>M.pause(),'');M.pauseBtn.hidden=true;
  $('#toolbar').replaceChildren(btn('Nouvelle série',newEx,'primary'),M.goBtn,M.pauseBtn,...micControls({mode:'pitch',onEvent:ev=>M.micAnswer(ev.midi),start:()=>M.start(),
    resumeOnToggle:()=>{const st=S.st;if(st.i>=0&&!st.done&&!st.paused){st.keep=true;return true;}return false;},api:(M.mic={})}));""")
rep("MOD.ln.start=function(){const st=S.st;Object.assign(st,{i:0,ok:0,err:0,done:false,lock:false,mark:null,t0:performance.now()});feedback('');this.setAcc(0);this.redraw();this.showProg();};",
"""MOD.ln.start=function(){const st=S.st;if(st.keep){st.keep=false;return;}Object.assign(st,{i:0,ok:0,err:0,done:false,lock:false,paused:false,mark:null,t0:performance.now()});feedback('');this.setAcc(0);this.redraw();this.showProg();this.pupd();};
MOD.ln.pupd=function(){const st=S.st,run=st.i>=0&&!st.done;this.pauseBtn.hidden=!run;this.pauseBtn.textContent=st.paused?'▶ Reprendre':'⏸ Pause';this.pauseBtn.classList.toggle('primary',!!st.paused);
  $('#score').classList.toggle('paused',!!st.paused);};
MOD.ln.pause=function(){const st=S.st,M=this;if(st.i<0||st.done)return;
  if(!st.paused){st.paused=true;st.pt=performance.now();st.wasMic=!!(M.mic&&M.mic.isRunning&&M.mic.isRunning());if(st.wasMic){st.keep=false;M.mic.end();}feedback('En pause : le micro n\\'écoute plus et le chrono est arrêté.');}
  else{st.paused=false;st.t0+=performance.now()-st.pt;feedback('');if(st.wasMic&&S.mic){st.keep=true;M.mic.begin();}}
  M.pupd();};""")
rep("MOD.ln.micAnswer=function(s){const st=S.st;if(st.i<0||st.done||st.lock)return;","MOD.ln.micAnswer=function(s){const st=S.st;if(st.i<0||st.done||st.lock||st.paused)return;")
rep("  if(st.lock)return;const n=S.ex.notes[st.i],ok=L===n.L&&(!c.acc&&!fromMic||st.acc===n.alt),b=M.btns[L];","  if(st.lock||st.paused)return;const n=S.ex.notes[st.i],ok=L===n.L&&(!c.acc&&!fromMic||st.acc===n.alt),b=M.btns[L];")
rep("    if(st.i>=S.ex.notes.length){st.done=true;","    if(st.i>=S.ex.notes.length){st.done=true;M.pupd();")
rep("  S.keyHandler=e=>{const k=+e.key;if(k>=1&&k<=7){M.answer(k-1);return true;}","  S.keyHandler=e=>{if(e.key==='p'||e.key==='P'){M.pause();return true;}const k=+e.key;if(k>=1&&k<=7){M.answer(k-1);return true;}")
rep("MOD.ln.fresh=function(){\n  const M=this,c=S.cfg.ln;Object.assign(S.st,{i:-1,ok:0,err:0,acc:0,lock:false,done:false,t0:0});","MOD.ln.fresh=function(){\n  const M=this,c=S.cfg.ln;Object.assign(S.st,{i:-1,ok:0,err:0,acc:0,lock:false,done:false,paused:false,keep:false,t0:0});setTimeout(()=>M.pupd(),0);")
rep("  tg.addEventListener('click',()=>{S.mic=!S.mic;try{localStorage.setItem('atelier-mic',S.mic?'1':'')}catch(e){}if(!S.mic)end();paint();});",
    "  tg.addEventListener('click',()=>{S.mic=!S.mic;try{localStorage.setItem('atelier-mic',S.mic?'1':'')}catch(e){}if(!S.mic)end();paint();if(S.mic&&!running&&o.resumeOnToggle&&o.resumeOnToggle())begin();});")
s=s.replace("</style>","#score.paused{opacity:.25;filter:blur(1px);pointer-events:none}\n</style>",1)
# 6) micro : plus sensible (gain automatique, seuils plus bas) ; pendant l'écoute, le métronome devient visuel
rep("echoCancellation:mode==='onset',noiseSuppression:false,autoGainControl:false}","echoCancellation:mode==='onset',noiseSuppression:false,autoGainControl:true}")
rep("  if(rms<Math.max(MIC.floor*3,.004)){","  if(rms<Math.max(MIC.floor*3,.0015)){")
rep("const attack=rms>MIC.prevRms*1.8&&rms>MIC.floor*6;","const attack=rms>MIC.prevRms*1.7&&rms>MIC.floor*5;")
rep("const r=yin(x,c.sampleRate);if(!r||r.clarity<.8){","const r=yin(x,c.sampleRate);if(!r||r.clarity<.74){")
rep("const need=Math.max(MIC.floor*5,.012,win?MIC.bleed*1.8:0);","const need=Math.max(MIC.floor*4,.005,win?MIC.bleed*1.8:0);")
rep("if(rms>need&&rms>MIC.prevRms*2.2&&","if(rms>need&&rms>MIC.prevRms*1.9&&")
rep("for(const k of plan.clicks||[]){const t=t0+k.u*plan.us;A.click(t,k.strong,g,k.ci);at(t,()=>{if(k.ci)CI.beat(k.b);if(onBeat)onBeat(k);});}",
    "for(const k of plan.clicks||[]){const t=t0+k.u*plan.us,quiet=MIC.on&&!k.ci&&!S.micMetro;if(!quiet)A.click(t,k.strong,g,k.ci);at(t,()=>{if(k.ci)CI.beat(k.b);else if(MIC.on)vBeat(k);if(onBeat)onBeat(k);});}")
rep("const S={mic:","const S={micMetro:(()=>{try{return localStorage.getItem('atelier-micmetro')==='1'}catch(e){return false}})(),mic:")
rep("function micControls(o){","""/* métronome visuel pendant que le micro écoute (le clic audible gênerait la détection) */
function vBeat(k){let v=document.getElementById('vbeat');const st=document.querySelector('.stand');if(!st)return;
  if(!v){v=document.createElement('div');v.id='vbeat';v.setAttribute('aria-hidden','true');st.append(v);}
  v.textContent=String((k.b||0)+1);v.className='on'+(k.strong?' strong':'');clearTimeout(v._t);v._t=setTimeout(()=>{v.className='';},180);}
function micControls(o){""")
rep("  const go=o.noGo?null:el('button',{class:'btn primary',type:'button'});",
    """  const go=o.noGo?null:el('button',{class:'btn primary',type:'button'});
  const met=(o.mode==='pitch'||o.mode==='onset')&&S.mod!=='ln'&&S.mod!=='la'?el('button',{class:'btn quiet toggle micmet',type:'button',title:'Avec des écouteurs, tu peux garder le clic du métronome pendant l\\'écoute'}):null;
  if(met)met.addEventListener('click',()=>{S.micMetro=!S.micMetro;try{localStorage.setItem('atelier-micmetro',S.micMetro?'1':'')}catch(e){}paint();});""")
rep("    if(go){go.hidden=!S.mic;go.replaceChildren(running?'■ Arrêter':'▶ Commencer');}",
    "    if(go){go.hidden=!S.mic;go.replaceChildren(running?'■ Arrêter':'▶ Commencer');}\n    if(met){met.hidden=!S.mic;met.replaceChildren(el('span',{class:'sw'+(S.micMetro?' on':''),'aria-hidden':'true'}),'Clic audible');met.setAttribute('aria-pressed',String(!!S.micMetro));}")
rep("  return (o.always?[go,chip]:[tg,go,chip]).filter(Boolean);","  return (o.always?[go,met,chip]:[tg,go,met,chip]).filter(Boolean);")
s=s.replace("</style>","""#vbeat{position:absolute;top:10px;right:12px;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font:800 1.2rem/1 var(--f-mono);color:var(--muted);border:2px solid var(--line);background:var(--surface);opacity:.5;transition:transform .08s,opacity .08s;z-index:3;pointer-events:none}
#vbeat.on{opacity:1;color:var(--accent-ink);background:var(--accent);border-color:var(--accent);transform:scale(1.12)}
#vbeat.on.strong{transform:scale(1.28)}
.stand{position:relative}
</style>""",1)
open(p,'w',encoding='utf-8').write(s);print('fixes3 ok')

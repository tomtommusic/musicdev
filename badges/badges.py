#!/usr/bin/env python3
"""Badges (récompenses) : module « Mes badges » + compteurs. À lancer après about/about.py."""
import sys,os
D=os.path.dirname(os.path.abspath(__file__))
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:70],s.count(a));s=s.replace(a,b)
i=s.index("  {id:'ho',kind:'tools'");j=s.index("\n",i)+1
s=s[:j]+"  {id:'bd',kind:'tools',t:'Mes badges',s:'Récompenses',d:'Pratique, explore et débloque des badges : bonnes réponses, séries, accordeur, enregistrements…'},\n"+s[j:]
rep("id==='gc'||id==='ho'||id==='ap')return{};","id==='gc'||id==='ho'||id==='ap'||id==='bd')return{};")
rep("(dm|dr|iv|pc|ln|lm|lr|so|la|tq|mt|ac|en|dg|gc|ho|ap)","(dm|dr|iv|pc|ln|lm|lr|so|la|tq|mt|ac|en|dg|gc|ho|ap|bd)")
# crochets
rep("function tally(ok){const t=S.stats[S.mod]||(S.stats[S.mod]={ok:0,tot:0});t.tot++;if(ok)t.ok++;showTally();}","function tally(ok){const t=S.stats[S.mod]||(S.stats[S.mod]={ok:0,tot:0});t.tot++;if(ok)t.ok++;showTally();if(typeof bdTally==='function')bdTally(ok);}")
rep("function openModule(id,shared,opts={}){\n","function openModule(id,shared,opts={}){\n  if(typeof bdOpen==='function')setTimeout(()=>bdOpen(id),0);\n")
rep("TS.stream=stream;","TS.stream=stream;if(typeof bdHit==='function')bdHit('tuner');")
rep("function metroStart(){","function metroStart(){if(typeof bdHit==='function'&&!RS.on&&!RS.arming)bdHit('metro');")
rep("await recStore(RS.last);recShow();","await recStore(RS.last);recShow();if(typeof bdHit==='function'){bdHit('rec');if(RS.lyrRec)bdHit('lyrrec');}")
rep("RS.rec.start(1000);RS.on=true;RS.t0=performance.now();","RS.rec.start(1000);RS.on=true;RS.t0=performance.now();RS.lyrRec=typeof LY!=='undefined'&&!!LY.text.trim()&&LY.speed>0;")
rep("mst:{style:MST.style,int:MST.int,room:!!MST.room,before:MS2.before,after:MS2.after},useOrig:false});await recStore(L);recShow();","mst:{style:MST.style,int:MST.int,room:!!MST.room,before:MS2.before,after:MS2.after},useOrig:false});await recStore(L);recShow();if(typeof bdHit==='function')bdHit('mst');")
rep("stop();t.done=true;t.date=Date.now();QZ.view='res';","stop();t.done=true;t.date=Date.now();QZ.view='res';if(typeof bdHit==='function'&&qzScore(t)>=.8*t.qs.length)bdHit('quiz80');")
rep("function gcRender(){\n  const root=MOD.gc.root;if(!root)return;","function gcRender(){\n  const root=MOD.gc.root;if(!root)return;if(typeof bdHit==='function')bdHit('chord');")
rep("function dgRender(){\n  const root=MOD.dg.root;if(!root)return;","function dgRender(){\n  const root=MOD.dg.root;if(!root)return;if(typeof bdAdd==='function'&&DG.inst)bdAdd('dg',DG.inst);")
code=open(D+'/badges.js',encoding='utf-8').read()
rep("/* ---------- démarrage ---------- */",code+"\n/* ---------- démarrage ---------- */")
css=open(D+'/badges.css',encoding='utf-8').read()
k=s.rfind('</style>',0,s.find('<div class="app">'));s=s[:k]+css+s[k:]
open(p,'w',encoding='utf-8').write(s);print('badges ok')

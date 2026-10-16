#!/usr/bin/env python3
"""Précision rythmique (débutant / intermédiaire) + écart moyen, pour Lecture à vue, Lecture rythmique et Lecture batterie."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
HELP=r'''/* ---------- précision rythmique : débutant (souple, par défaut) ou intermédiaire (exigeant) ---------- */
const PREC_OPTS=[['deb','Débutant : fenêtre large, une note un peu décalée compte comme réussie'],['int','Intermédiaire : fenêtre serrée, chaque note doit être à temps']];
function precMode(){try{return localStorage.getItem('atelier-prec')==='int'?'int':'deb'}catch(e){return 'deb'}}
/* fenêtre « à temps » (s) selon l'intervalle le plus court entre deux notes ; au-delà et jusqu'à precLate()×tol : décalé (orange) */
function precTol(minI,kind){const lm=kind==='lm';return precMode()==='int'?(lm?Math.max(.09,Math.min(.2,.5*minI)):Math.max(.06,Math.min(.15,.45*minI))):Math.max(lm?.12:.1,Math.min(lm?.25:.22,.55*minI));}
const precLate=()=>precMode()==='int'?2:2.5;
/* réussi ? en débutant, les notes décalées comptent et une petite marge d'entrées de trop est tolérée (bruits du micro) */
function precPass(ok,late,N,bad,extra){return precMode()==='int'?(ok===N&&bad===0&&extra===0):(ok+late===N&&bad===0&&extra<=Math.max(1,Math.round(N*.1)));}
/* écart moyen entre les coups joués et les coups attendus */
function precLine(offs){if(!offs.length)return'';const ms=offs.map(x=>x*1000),abs=Math.round(ms.reduce((a,b)=>a+Math.abs(b),0)/ms.length),avg=ms.reduce((a,b)=>a+b,0)/ms.length;
  const tr=Math.abs(avg)<20?T('bien centré'):avg<0?T('plutôt en avance'):T('plutôt en retard');return ' '+T('Écart moyen : {0} ms').replace('{0}',abs)+' ('+tr+').';}
function precField(){return field(['Précision rythmique',typeof betaTag==='function'?betaTag():null].filter(Boolean),el('div',{class:'field'},sel('s_prec',PREC_OPTS,precMode(),v=>{try{localStorage.setItem('atelier-prec',v)}catch(e){}}),el('span',{class:'hint'},'Réglage commun à Lecture à vue et Lecture rythmique, gardé sur cet appareil.')));}
'''
rep("function feedback(msg,kind){",HELP+"function feedback(msg,kind){")
# --- lecture rythmique
i=s.index("MOD.lr.evaluate=function(plan,s){");j=s.index("\n};\n",i)+4
s=s[:i]+r'''MOD.lr.evaluate=function(plan,s){
  const M=this,exp=plan.items.filter(it=>!it.rest),taps=S.st.taps.slice(),used=new Set(),res=[],offs=[];
  let minI=1e9;for(let k=1;k<plan.items.length;k++)minI=Math.min(minI,plan.items[k].t-plan.items[k-1].t);
  const tol=precTol(minI,'lr'),LW=precLate();let ok=0,late=0,miss=0;
  for(const it of exp){let best=-1,bd=1e9;taps.forEach((t,j)=>{if(used.has(j))return;const d=Math.abs(t-it.t);if(d<bd){bd=d;best=j;}});
    if(best>=0&&bd<=LW*tol){used.add(best);offs.push(taps[best]-it.t);if(bd<=tol){ok++;res.push([it.i,'is-ok']);}else{late++;res.push([it.i,'is-late']);}}else{miss++;res.push([it.i,'is-bad']);}}
  const firstT=exp.length?exp[0].t:0, extra=taps.filter((t,j)=>!used.has(j)&&t>firstT-tol).length, N=exp.length, all=precPass(ok,late,N,miss,extra);
  S.st.res=res;M.redraw();tally(all);const z=n=>n>1?'s':'';
  const parts=[`${ok} note${z(ok)} à temps sur ${N}`];
  if(late)parts.push(`· ${late} note${z(late)} un peu décalée${z(late)}`);if(miss)parts.push(`· ${miss} note${z(miss)} manquée${z(miss)}`);if(extra)parts.push(`· ${extra} frappe${z(extra)} de trop`);
  feedback(parts.map(x=>T(x)).join(' ')+'.'+precLine(offs),all?'ok':'bad');
};
'''+s[j:]
# --- lecture à vue
i=s.index("MOD.lm.evaluate=function(plan){");j=s.index("\n};\n",i)+4
s=s[:i]+r'''MOD.lm.evaluate=function(plan){
  /* chaque note attendue est associée à l'entrée la plus proche dans le temps ;
     juste et à temps = vert, bonne note mais décalée = orange, fausse ou oubliée = rouge */
  const M=this,exp=plan.items.filter(it=>!it.rest),inp=S.st.inputs.slice(),used=new Set(),res=[],offs=[];
  let minI=1e9;for(let k=1;k<plan.items.length;k++)minI=Math.min(minI,plan.items[k].t-plan.items[k-1].t);
  const tol=precTol(minI,'lm'),LW=precLate(),TR=transp();
  const right=(x,e)=>x.L!=null?x.L===e.L:(((x.midi-TR-e.midi)%12+12)%12===0);
  let ok=0,late=0,wrong=0,missed=0;
  for(const it of exp){const e=S.ex.events[it.i];let best=-1,bd=1e9;
    inp.forEach((x,j)=>{if(used.has(j))return;const d=Math.abs(x.t-it.t);if(d<bd){bd=d;best=j;}});
    if(best<0||bd>LW*tol){missed++;res.push([it.i,'is-bad']);continue;}
    const x=inp[best];used.add(best);
    if(!right(x,e)){wrong++;res.push([it.i,'is-bad']);continue;}
    offs.push(x.t-it.t);
    if(bd<=tol){ok++;res.push([it.i,'is-ok']);}
    else{late++;res.push([it.i,'is-late']);}}
  const extra=inp.length-used.size,N=exp.length,all=precPass(ok,late,N,wrong+missed,extra);
  S.st.res=res;M.redraw();tally(all);const z=n=>n>1?'s':'';
  const parts=[`${ok} note${z(ok)} juste${z(ok)} et à temps sur ${N}`];
  if(late)parts.push(`· ${late} bonne${z(late)} note${z(late)} un peu décalée${z(late)}`);if(wrong)parts.push(`· ${wrong} fausse${z(wrong)} note${z(wrong)}`);
  if(missed)parts.push(`· ${missed} note${z(missed)} oubliée${z(missed)}`);if(extra)parts.push(`· ${extra} entrée${z(extra)} de trop`);
  feedback(parts.map(x=>T(x)).join(' ')+'.'+precLine(offs),all?'ok':'bad');
};
'''+s[j:]
# --- lecture batterie
rep("const tol=Math.max(.06,Math.min(.15,.45*minI));\n  let ok=0,late=0,miss=0,N=0,wrongEl=0;","const tol=precTol(minI,'lb'),LW=precLate(),offs=[];\n  let ok=0,late=0,miss=0,N=0,wrongEl=0;")
rep("      if(best<0||bd>2*tol){miss++;st='is-bad';","      if(best<0||bd>LW*tol){miss++;st='is-bad';")
rep("      used.add(best);if(bd<=tol)ok++;","      used.add(best);offs.push(ins[best].t-it.t);if(bd<=tol)ok++;")
rep("extra=ins.filter((x,j)=>!used.has(j)&&x.t>firstT-tol).length,all=ok===N&&extra===0;","extra=ins.filter((x,j)=>!used.has(j)&&x.t>firstT-tol).length,all=precPass(ok,late,N,miss,extra);")
rep("  feedback(parts.map(x=>T(x)).join(' ')+'.',all?'ok':'bad');\n};","  feedback(parts.map(x=>T(x)).join(' ')+'.'+precLine(offs),all?'ok':'bad');\n};")
# --- réglages
rep("  if(id==='lr'){const i=el('input',{type:'checkbox',id:'s_metro'})","  if(id==='lm'||id==='lr')opts.push(precField());\n  if(id==='lr'){const i=el('input',{type:'checkbox',id:'s_metro'})")
open(p,'w',encoding='utf-8').write(s);print('precision ok')

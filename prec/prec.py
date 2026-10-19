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
function precTol(minI,kind){const lm=kind==='lm';return precMode()==='int'?(lm?Math.max(.09,Math.min(.2,.5*minI)):Math.max(.06,Math.min(.15,.45*minI))):Math.max(lm?.15:.12,Math.min(lm?.3:.26,.6*minI));}
/* fenêtre « décalé » : jusqu'à 2 ou 2,5 fois la fenêtre « à temps », sans dépasser la moitié de l'intervalle le plus court (sinon on confondrait avec la note suivante) */
const precLate=(tol,minI)=>Math.max(1.25,Math.min(precMode()==='int'?2:3,(minI||1e9)*.5/(tol||1)));
/* réussi ? en débutant, les notes décalées comptent et une petite marge d'entrées de trop est tolérée (bruits du micro) */
function precPass(ok,late,N,bad,extra){return precMode()==='int'?(ok===N&&bad===0&&extra===0):(ok+late===N&&bad===0&&extra<=Math.max(2,Math.round(N*.15)));}
/* écart moyen entre les coups joués et les coups attendus */
function precLine(offs){if(!offs.length)return'';const ms=offs.map(x=>x*1000),abs=Math.round(ms.reduce((a,b)=>a+Math.abs(b),0)/ms.length),avg=ms.reduce((a,b)=>a+b,0)/ms.length;
  const tr=Math.abs(avg)<20?T('bien centré'):avg<0?T('plutôt en avance'):T('plutôt en retard');return ' '+T('Écart moyen : {0} ms').replace('{0}',abs)+' ('+tr+').';}
/* justesse : écart toléré (cents) entre la hauteur chantée/jouée et la note écrite */
const PITCH_OPTS=[['hi','Élevée : à ±25 cents de la note'],['vhi','Très élevée : à ±15 cents de la note'],['std','Souple : la bonne note suffit (±50 cents)']];
/* réglage propre à chaque module : la voix (solfège) part de ±50 cents, critère des études sur le chant juste ; l'instrument (lecture à vue) de ±25 */
function pitchMode(mod){mod=mod||S.mod;try{const v=localStorage.getItem('atelier-pitch-'+mod);if(v==='vhi'||v==='std'||v==='hi')return v;}catch(e){}return mod==='so'?'std':'hi';}
const pitchTol=mod=>({hi:25,vhi:15,std:50})[pitchMode(mod)];
/* écart médian (cents) pendant le cœur de la note, octave libre ; null si le micro n'a rien capté */
function pitchDev(it,us,smp,target){if(!smp||!smp.length)return null;const a=it.t+it.d*us*.25,b=it.t+it.d*us*.9,v=smp.filter(x=>x.t>=a&&x.t<=b).map(x=>((x.mf-target)%12+18)%12-6).sort((p,q)=>p-q);
  return v.length>=2?v[v.length>>1]*100:null;}
function pitchLine(devs){if(!devs.length)return'';const abs=Math.round(devs.reduce((a,b)=>a+Math.abs(b),0)/devs.length),avg=devs.reduce((a,b)=>a+b,0)/devs.length;
  const tr=Math.abs(avg)<8?T('bien centré'):avg<0?T('plutôt bas'):T('plutôt haut');return ' '+T('Justesse : écart moyen de {0} cents').replace('{0}',abs)+' ('+tr+').';}
function pitchField(){return field(['Justesse attendue',typeof betaTag==='function'?betaTag():null].filter(Boolean),el('div',{class:'field'},sel('s_pitch',PITCH_OPTS,pitchMode(),v=>{try{localStorage.setItem('atelier-pitch-'+S.mod,v)}catch(e){}}),el('span',{class:'hint'},S.mod==='so'?'Vérifiée au micro. Un cent = un centième de demi-ton. Les études sur le chant juste comptent une note comme juste à ±50 cents.':'Vérifiée au micro. Un cent = un centième de demi-ton.')));}
function precField(){return field(['Précision rythmique',typeof betaTag==='function'?betaTag():null].filter(Boolean),el('div',{class:'field'},sel('s_prec',PREC_OPTS,precMode(),v=>{try{localStorage.setItem('atelier-prec',v)}catch(e){}}),el('span',{class:'hint'},'Réglage commun à Lecture à vue, Lecture rythmique et Solfège, gardé sur cet appareil.')));}
'''
rep("function feedback(msg,kind){",HELP+"function feedback(msg,kind){")
# --- lecture rythmique
i=s.index("MOD.lr.evaluate=function(plan,s){");j=s.index("\n};\n",i)+4
s=s[:i]+r'''MOD.lr.evaluate=function(plan,s){
  const M=this,exp=plan.items.filter(it=>!it.rest),taps=S.st.taps.slice(),used=new Set(),res=[],offs=[];
  let minI=1e9;for(let k=1;k<plan.items.length;k++)minI=Math.min(minI,plan.items[k].t-plan.items[k-1].t);
  const tol=precTol(minI,'lr'),LW=precLate(tol,minI);let ok=0,late=0,miss=0;
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
  const M=this,exp=plan.items.filter(it=>!it.rest),inp=S.st.inputs.slice(),used=new Set(),res=[],offs=[],devs=[];let offp=0;
  let minI=1e9;for(let k=1;k<plan.items.length;k++)minI=Math.min(minI,plan.items[k].t-plan.items[k-1].t);
  const tol=precTol(minI,'lm'),LW=precLate(tol,minI),TR=transp();
  const right=(x,e)=>x.L!=null?x.L===e.L:(((x.midi-TR-e.midi)%12+12)%12===0);
  let ok=0,late=0,wrong=0,missed=0;
  for(const it of exp){const e=S.ex.events[it.i];let best=-1,bd=1e9;
    inp.forEach((x,j)=>{if(used.has(j))return;const d=Math.abs(x.t-it.t);if(d<bd){bd=d;best=j;}});
    if(best<0||bd>LW*tol){missed++;res.push([it.i,'is-bad']);continue;}
    const x=inp[best];used.add(best);
    if(!right(x,e)){wrong++;res.push([it.i,'is-bad']);continue;}
    offs.push(x.t-it.t);
    if(x.L==null){const dv=pitchDev(it,plan.us,S.st.smp,e.midi+TR);if(dv!=null){devs.push(dv);if(Math.abs(dv)>pitchTol('lm')){offp++;res.push([it.i,'is-bad']);continue;}}}
    if(bd<=tol){ok++;res.push([it.i,'is-ok']);}
    else{late++;res.push([it.i,'is-late']);}}
  const extra=inp.length-used.size,N=exp.length,all=precPass(ok,late,N,wrong+missed+offp,extra);
  S.st.res=res;M.redraw();tally(all);const z=n=>n>1?'s':'';
  const parts=[`${ok} note${z(ok)} juste${z(ok)} et à temps sur ${N}`];if(offp)parts.push(`· ${offp} note${z(offp)} pas assez juste${z(offp)}`);
  if(late)parts.push(`· ${late} bonne${z(late)} note${z(late)} un peu décalée${z(late)}`);if(wrong)parts.push(`· ${wrong} fausse${z(wrong)} note${z(wrong)}`);
  if(missed)parts.push(`· ${missed} note${z(missed)} oubliée${z(missed)}`);if(extra)parts.push(`· ${extra} entrée${z(extra)} de trop`);
  feedback(parts.map(x=>T(x)).join(' ')+'.'+precLine(offs)+pitchLine(devs),all?'ok':'bad');
};
'''+s[j:]
# --- lecture batterie
rep("const tol=Math.max(.06,Math.min(.15,.45*minI));\n  let ok=0,late=0,miss=0,N=0,wrongEl=0;","const tol=precTol(minI,'lb'),LW=precLate(tol,minI),offs=[];\n  let ok=0,late=0,miss=0,N=0,wrongEl=0;")
rep("      if(best<0||bd>2*tol){miss++;st='is-bad';","      if(best<0||bd>LW*tol){miss++;st='is-bad';")
rep("      used.add(best);if(bd<=tol)ok++;","      used.add(best);offs.push(ins[best].t-it.t);if(bd<=tol)ok++;")
rep("extra=ins.filter((x,j)=>!used.has(j)&&x.t>firstT-tol).length,all=ok===N&&extra===0;","extra=ins.filter((x,j)=>!used.has(j)&&x.t>firstT-tol).length,all=precPass(ok,late,N,miss,extra);")
rep("  feedback(parts.map(x=>T(x)).join(' ')+'.',all?'ok':'bad');\n};","  feedback(parts.map(x=>T(x)).join(' ')+'.'+precLine(offs),all?'ok':'bad');\n};")
# --- réglages
rep("  if(id==='lr'){const i=el('input',{type:'checkbox',id:'s_metro'})","  if(id==='lm'||id==='lr')opts.push(precField());\n  if(id==='lr'){const i=el('input',{type:'checkbox',id:'s_metro'})")
# lm : on garde les hauteurs captées pendant l'exercice pour mesurer la justesse
rep("const plan=planOf(S.ex,{countIn:true,metro:true});S.st.live=true;\n  run(plan,{sound:'none',onBeat:k=>M.beat(k.b),onStep:it=>M.now(it.i),onEnd:stopped=>{S.st.live=false;M.now(-1);M.beat(-1);if(!stopped)M.evaluate(plan);",
 "const plan=planOf(S.ex,{countIn:true,metro:true});S.st.live=true;MIC.samples=MIC.on?[]:null;\n  run(plan,{sound:'none',onBeat:k=>M.beat(k.b),onStep:it=>M.now(it.i),onEnd:stopped=>{S.st.live=false;S.st.smp=MIC.samples;MIC.samples=null;M.now(-1);M.beat(-1);if(!stopped)M.evaluate(plan);")
# solfège : le micro vérifie maintenant la justesse ET le rythme
rep("...micControls({mode:'pitch',onLive:(info,chip)=>{if(!info||info.midi==null){chip.textContent='🎤 …';return;}","...micControls({mode:'pitch',onEvent:ev=>{if(S.st.ons)S.st.ons.push(ev);},onLive:(info,chip)=>{if(!info||info.midi==null){chip.textContent='🎤 …';return;}")
rep("  if(MIC.on)MIC.samples=[];\n  run(plan,{sound:'none',onStep:it=>M.now(it.i),","  if(MIC.on)MIC.samples=[];S.st.ons=[];\n  run(plan,{sound:'none',onStep:it=>M.now(it.i),")
i=s.index("MOD.so.judge=function(plan,smp){");j=s.index("\n};\n",i)+4
s=s[:i]+r"""MOD.so.judge=function(plan,smp){
  /* la voix ne fait pas d'attaques nettes (consonnes, legato, notes répétées) : on juge chaque note sur le cœur de sa durée.
     présente et sur la bonne hauteur pendant une bonne partie de la note = à temps ; hauteur médiane comparée à la justesse demandée */
  const exp=plan.items.filter(it=>!it.rest),devs=[],offs=[];S.st.ons=null;
  if(!smp||!smp.length){feedback("Le micro n'a capté aucune note. Rapproche-toi du micro ou chante plus fort.",'bad');return;}
  let minI=1e9;for(let k=1;k<plan.items.length;k++)minI=Math.min(minI,plan.items[k].t-plan.items[k-1].t);
  const tolC=pitchTol('so'),cov=precMode()==='int'?.6:.4,FR=.033,tolT=precTol(minI,'lm');let ok=0,late=0,lateT=0,wrong=0,missed=0,offp=0;
  const dvOf=(x,m)=>(((x.mf-m)%12+18)%12-6)*100;
  (this.els||[]).forEach(e=>e&&e.classList.remove('is-ok','is-bad','is-late'));
  exp.forEach((it,n)=>{const el2=this.els&&this.els[it.i],mark=c=>{if(el2)el2.classList.add(c);},d=it.d*plan.us,a=it.t+d*.15,b=it.t+d*.85;
    const fr=smp.filter(x=>x.t>=a&&x.t<=b),exN=Math.max(1,(b-a)/FR);
    if(fr.length<Math.max(2,exN*.15)){missed++;mark('is-bad');return;}
    const v=fr.map(x=>dvOf(x,it.midi)).sort((p,q)=>p-q),med=v[v.length>>1];
    if(Math.abs(med)>65){wrong++;mark('is-bad');return;}
    devs.push(med);
    if(Math.abs(med)>tolC){offp++;mark('is-bad');return;}
    const prev=exp[n-1];if(!prev||(prev.midi-it.midi)%12!==0){const w=smp.find(x=>x.t>=it.t-Math.min(.3,d*.5)&&x.t<=it.t+d*.5&&Math.abs(dvOf(x,it.midi))<=60);if(w)offs.push(w.t-it.t);var att=w?w.t-it.t:null;}else var att=null;
    const good=fr.filter(x=>Math.abs(dvOf(x,it.midi))<=Math.max(60,tolC+25)).length/exN;
    if(good>=cov&&(att==null||Math.abs(att)<=tolT)){ok++;mark('is-ok');}else{late++;lateT+=(good>=cov)?1:0;mark('is-late');}});
  const N=exp.length,all=precPass(ok,late,N,wrong+missed+offp,0);
  if(!S.st.counted){tally(all);S.st.counted=true;}const z=n=>n>1?'s':'';
  const parts=[`${ok} note${z(ok)} juste${z(ok)} et à temps sur ${N}`];
  const lh=late-lateT;if(lateT)parts.push(`· ${lateT} bonne${z(lateT)} note${z(lateT)} un peu décalée${z(lateT)}`);if(lh)parts.push(`· ${lh} bonne${z(lh)} note${z(lh)} pas tenue${z(lh)} assez longtemps`);if(offp)parts.push(`· ${offp} note${z(offp)} pas assez juste${z(offp)}`);
  if(wrong)parts.push(`· ${wrong} fausse${z(wrong)} note${z(wrong)}`);if(missed)parts.push(`· ${missed} note${z(missed)} non captée${z(missed)}`);
  feedback(parts.map(x=>T(x)).join(' ')+'.'+precLine(offs)+pitchLine(devs),all?'ok':'bad');
};
"""+s[j:]
rep("  if(id==='lm'||id==='lr')opts.push(precField());","  if(id==='lm'||id==='lr'||id==='so')opts.push(precField());\n  if(id==='lm'||id==='so')opts.push(pitchField());")
rep("d:'Chante la mélodie en nommant les notes, avec le métronome. Écoute ensuite la solution pour te corriger.'","d:'Chante la mélodie en nommant les notes, avec le métronome. Avec le micro, la justesse et le rythme sont vérifiés ; sinon, écoute la solution et évalue-toi.'")
open(p,'w',encoding='utf-8').write(s);print('precision ok')

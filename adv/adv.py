#!/usr/bin/env python3
"""Accordeur plus sensible (guitare acoustique), micro plus tolérant en Lecture mélodique, intervalles augmentés/diminués,
doubles dièses / doubles bémols en lecture. À lancer après sync/sync.py."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
# ---------- 1. accordeur : seuil adaptatif au bruit ambiant, continuité pendant que la corde s'éteint, maintien de l'affichage ----------
rep("if(rms<.0025)return{rms};","if(rms<(TS.gate||.0025))return{rms};")
rep("rms=Math.sqrt(rms/N);if(rms<.0015)return{rms};","rms=Math.sqrt(rms/N);if(rms<Math.min(.0015,(TS.gate||.0025)*.8))return{rms};")
rep("if(!r.f||r.clarity<.8){TS.hist=[];tnShow(null,r.rms);return;}",
"""/* bruit ambiant appris quand rien ne joue : le seuil descend jusqu'à 0,0005 pour suivre une corde qui s'éteint */
  if(!r.f&&r.rms>0){TS.floor=TS.floor==null?r.rms:TS.floor*.92+Math.min(r.rms,.01)*.08;}
  TS.gate=Math.max(.0005,Math.min(.0025,(TS.floor||.001)*2.2));
  const med=TS.hist.length?TS.hist.slice().sort((a,b)=>a-b)[TS.hist.length>>1]:null;
  const cont=r.f&&med&&r.clarity>=.6&&Math.abs(1200*Math.log2(r.f/med))<35;   /* même note qui continue, plus faible */
  if(!r.f||(r.clarity<.8&&!cont)){
    if(TS.lastF&&performance.now()-TS.lastT<1600){tnShow(TS.lastF,r.rms);return;}   /* on garde la dernière lecture un moment */
    TS.hist=[];TS.lastF=null;tnShow(null,r.rms);return;}""")
rep("  tnShow(f,r.rms);\n}\nfunction tnTarget(f){","  TS.lastF=f;TS.lastT=performance.now();tnShow(f,r.rms);\n}\nfunction tnTarget(f){")
# ---------- 2. Lecture mélodique au micro : on ignore les hauteurs ambiguës et les bavures juste après une bonne note ----------
rep("MOD.la.micNote=function(s){const st=S.st;if(st.done)return;const[e]=this.notes[st.k],w=s-transp();this.play(((w-e.midi)%12+12)%12===0?e.midi:w);};",
"""MOD.la.micNote=function(s,cents){const st=S.st;if(st.done)return;const[e]=this.notes[st.k],w=s-transp(),okPc=((w-e.midi)%12+12)%12===0;
  if(!okPc){const now=performance.now();if(now-(st.lastOkT||0)<350)return;if(cents!=null&&Math.abs(cents)>30)return;   /* entre deux notes ou résonance de la note précédente */
    if(st.prevBad===w&&now-(st.prevBadT||0)<900)return;st.prevBad=w;st.prevBadT=now;}
  else st.lastOkT=performance.now();
  this.play(okPc?e.midi:w);};""")
rep("micControls({mode:'pitch',onEvent:ev=>M.micNote(ev.midi),","micControls({mode:'pitch',onEvent:ev=>M.micNote(ev.midi,ev.cents),")
# ---------- 3. intervalles augmentés et diminués ----------
rep("""  {id:'1J',n:1,s:0,ab:'Unisson',fr:'Unisson'},""","""  {id:'1J',n:1,s:0,ab:'Unisson',fr:'Unisson'},
  {id:'1aug',n:1,s:1,ab:'1 aug',fr:'Unisson augmenté',ad:1},
  {id:'2dim',n:2,s:0,ab:'2de dim',fr:'Seconde diminuée',ad:1},""")
rep("""  {id:'2M',n:2,s:2,ab:'2de M',fr:'Seconde majeure'},""","""  {id:'2M',n:2,s:2,ab:'2de M',fr:'Seconde majeure'},
  {id:'2aug',n:2,s:3,ab:'2de aug',fr:'Seconde augmentée',ad:1},
  {id:'3dim',n:3,s:2,ab:'3ce dim',fr:'Tierce diminuée',ad:1},""")
rep("""  {id:'3M',n:3,s:4,ab:'3ce M',fr:'Tierce majeure'},""","""  {id:'3M',n:3,s:4,ab:'3ce M',fr:'Tierce majeure'},
  {id:'3aug',n:3,s:5,ab:'3ce aug',fr:'Tierce augmentée',ad:1},
  {id:'4dim',n:4,s:4,ab:'4te dim',fr:'Quarte diminuée',ad:1},""")
rep("""  {id:'tr',n:4,s:6,ab:'Triton',fr:'Quarte augmentée (triton)'},""","""  {id:'tr',n:4,s:6,ab:'Triton',fr:'Quarte augmentée (triton)'},
  {id:'5dim',n:5,s:6,ab:'5te dim',fr:'Quinte diminuée',ad:1},""")
rep("""  {id:'5J',n:5,s:7,ab:'5te J',fr:'Quinte juste'},""","""  {id:'5J',n:5,s:7,ab:'5te J',fr:'Quinte juste'},
  {id:'5aug',n:5,s:8,ab:'5te aug',fr:'Quinte augmentée',ad:1},
  {id:'6dim',n:6,s:7,ab:'6te dim',fr:'Sixte diminuée',ad:1},""")
rep("""  {id:'6M',n:6,s:9,ab:'6te M',fr:'Sixte majeure'},""","""  {id:'6M',n:6,s:9,ab:'6te M',fr:'Sixte majeure'},
  {id:'6aug',n:6,s:10,ab:'6te aug',fr:'Sixte augmentée',ad:1},
  {id:'7dim',n:7,s:9,ab:'7e dim',fr:'Septième diminuée',ad:1},""")
rep("""  {id:'7M',n:7,s:11,ab:'7e M',fr:'Septième majeure'},""","""  {id:'7M',n:7,s:11,ab:'7e M',fr:'Septième majeure'},
  {id:'7aug',n:7,s:12,ab:'7e aug',fr:'Septième augmentée',ad:1},
  {id:'8dim',n:8,s:11,ab:'8ve dim',fr:'Octave diminuée',ad:1},""")
rep("""  {id:'8J',n:8,s:12,ab:'8ve',fr:'Octave juste'},""","""  {id:'8J',n:8,s:12,ab:'8ve',fr:'Octave juste'},
  {id:'8aug',n:8,s:13,ab:'8ve aug',fr:'Octave augmentée',ad:1},""")
# notes doublement altérées permises pour ces intervalles
rep("    if(Math.abs(other.alt)>1)continue;","    if(Math.abs(other.alt)>(iv.ad?2:1))continue;")
# réglage : intervalles usuels / augmentés et diminués séparés
rep("      field('Intervalles',checks(IVS.map(x=>[x.id,`${x.ab} · ${x.fr.toLowerCase()}`]),c.ivs,v=>{c.ivs=v;ch();}),true),",
"""      field('Intervalles',checks(IVS.filter(x=>!x.ad).map(x=>[x.id,`${x.ab} · ${x.fr.toLowerCase()}`]),c.ivs.filter(x=>!IV_BY[x].ad).length?c.ivs.filter(x=>!IV_BY[x].ad):[],v=>{c.ivs=[...c.ivs.filter(x=>IV_BY[x].ad),...v];ch();}),true),
      field(['Intervalles augmentés et diminués (théorie avancée)',typeof betaTag==='function'?betaTag():null].filter(Boolean),el('div',{class:'field'},checksOpt(IVS.filter(x=>x.ad).map(x=>[x.id,`${x.ab} · ${x.fr.toLowerCase()}`]),c.ivs.filter(x=>IV_BY[x].ad),v=>{c.ivs=[...c.ivs.filter(x=>!IV_BY[x].ad),...v];if(!c.ivs.length)c.ivs=['3M'];ch();}),
        el('span',{class:'hint'},'À l\\'oreille, un intervalle augmenté ou diminué sonne comme un autre (la seconde augmentée sonne comme une tierce mineure). Quand tu en choisis, les deux notes sont écrites sur la portée : nomme l\\'intervalle d\\'après l\\'écriture.')),true),""")
rep("function checks(opts,vals,on){","""/* comme checks(), mais on peut tout décocher */
function checksOpt(opts,vals,on){
  return el('div',{class:'checks'},opts.map(([v,l])=>{const i=el('input',{type:'checkbox',id:'c_'+S.mod+'_'+v.replace(/\\W/g,'_')});i.checked=vals.includes(v);
    i.addEventListener('change',()=>{const cur=[...i.closest('.checks').querySelectorAll('input')].map((x,k)=>x.checked?opts[k][0]:null).filter(Boolean);on(cur);});
    return el('label',{class:'chk'},i,l);}));
}
function checks(opts,vals,on){""")
# avec des intervalles augmentés ou diminués, la portée montre les notes dès le départ
rep("  if(!S.st.done)abc='X:1\\nL:1/4\\nK:C clef=treble\\nx2 x2 |]\\n';","  const showW=S.cfg.iv.ivs.some(x=>IV_BY[x]&&IV_BY[x].ad);\n  if(!S.st.done&&!showW)abc='X:1\\nL:1/4\\nK:C clef=treble\\nx2 x2 |]\\n';")
rep("""      :`X:1\\nL:1/4\\nK:C clef=treble\\n${abcPitch(a,st,ka)}2 ${abcPitch(b,st,ka)}2 |]\\nw: ${noteName(a)} ${noteName(b)}\\n`;}""",
"""      :`X:1\\nL:1/4\\nK:C clef=treble\\n${abcPitch(a,st,ka)}2 ${abcPitch(b,st,ka)}2 |]\\nw: ${noteName(a)} ${noteName(b)}\\n`;
    if(!S.st.done)abc=abc.replace(/\\nw: .*\\n$/,'\\n');}""")
rep("  else{const[a,b]=this.notes(),ka=[0,0,0,0,0,0,0],st={};","  else if(true){const[a,b]=this.notes(),ka=[0,0,0,0,0,0,0],st={};")
rep("M.hint.textContent='Écoute, puis choisis. Après la réponse, clique sur n\\'importe quel intervalle pour l\\'entendre à partir de la même note. Barre d\\'espace : réécouter.';",
"M.hint.textContent=c.ivs.some(x=>IV_BY[x]&&IV_BY[x].ad)?'Lis les deux notes sur la portée (écoute-les au besoin), puis nomme l\\'intervalle : nombre et qualité. Barre d\\'espace : réécouter.':'Écoute, puis choisis. Après la réponse, clique sur n\\'importe quel intervalle pour l\\'entendre à partir de la même note. Barre d\\'espace : réécouter.';")
# ---------- 4. altérations accidentelles (simples, puis doubles) en lecture ----------
rep("const noteName=n=>FRN[n.L]+(n.alt===1?'♯':n.alt===-1?'♭':'');","const noteName=n=>FRN[n.L]+(n.alt===1?'♯':n.alt===-1?'♭':n.alt===2?'𝄪':n.alt===-2?'𝄫':'');")
HELP=r'''/* ---------- altérations accidentelles dans les mélodies de lecture (lecture à vue, solfège, lecture mélodique) ----------
   simples : dièses, bémols, bécarres de passage ; doubles : en plus, doubles dièses et doubles bémols */
const ACC_OPTS=[['','Aucune (seulement l\'armure)'],['s','Dièses, bémols et bécarres'],['d','Avec doubles dièses et doubles bémols']];
const ACC_MODS=['lm','so','la'];
function accAlter(ex,mode){
  if(!mode||!ex||ex.kind!=='mel')return ex;
  const notes=ex.events.filter(e=>!e.rest),n=notes.length,sig=sigAlts(ex.key.sig),R=Math.random;
  const want=Math.max(1,Math.round(n*(mode==='d'?.22:.18)));let done=0,dbl=0;
  const idx=notes.map((_,i)=>i).slice(1,-1).sort(()=>R()-.5);
  for(const i of idx){if(done>=want)break;const e=notes[i],base=sig[e.L];
    let na;
    if(mode==='d'&&(dbl<1||R()<.45)){na=base>0?2:base<0?-2:(ex.key.sig<0?-2:ex.key.sig>0?2:(R()<.5?2:-2));if(Math.abs(na-e.alt)>2)continue;dbl++;}
    else{const c=[e.alt+1,e.alt-1].filter(x=>x>=-1&&x<=1&&x!==e.alt);if(!c.length)continue;na=pick(c);}
    const d=na-e.alt;e.alt=na;e.midi+=d;done++;}
  return ex;
}
function accField(){const c=S.cfg[S.mod];return field(['Altérations accidentelles',typeof betaTag==='function'?betaTag():null].filter(Boolean),el('div',{class:'field'},sel('s_acc2',ACC_OPTS,c.acc2||'',v=>{c.acc2=v;cfgChanged(S.mod);newEx();}),
  el('span',{class:'hint'},'Ajoute des notes altérées en plus de l\'armure. Avec les doubles, on voit 𝄪 (double dièse) et 𝄫 (double bémol), comme en théorie avancée.')));}
'''
rep("function feedback(msg,kind){",HELP+"function feedback(msg,kind){")
rep("genMelody=function(cfg){","genMelody=function(cfg){const _r=_genMelAcc(cfg);return ACC_MODS.includes(S.mod)?accAlter(_r,cfg.acc2):_r;};\nconst _genMelAcc=function(cfg){")
rep("  if(id==='lm'||id==='la')opts.push(field('Instrument de l\\'élève (micro)'","  if(ACC_MODS.includes(id))opts.push(accField());\n  if(id==='lm'||id==='la')opts.push(field('Instrument de l\\'élève (micro)'")
rep("  if('clef'in b&&['treble','bass','alt'].includes(c.clef))o.clef=c.clef;","  if('clef'in b&&['treble','bass','alt'].includes(c.clef))o.clef=c.clef;\n  if('clef'in b&&['s','d'].includes(c.acc2))o.acc2=c.acc2;")
# accordeur : la guitare (et les autres cordes) captent aussi les notes graves d'une basse
rep("function tnRange(){const s=tnStrings();if(!s)return[27,4200];const lo=Math.min(...s.notes),hi=Math.max(...s.notes);return[midiHz(lo)*.7,","function tnRange(){const s=tnStrings();if(!s)return[27,4200];const lo=Math.min(...s.notes),hi=Math.max(...s.notes);return[Math.min(midiHz(lo)*.7,29),")
open(p,'w',encoding='utf-8').write(s);print('adv ok')

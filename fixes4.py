#!/usr/bin/env python3
"""Tablature de guitare ou de basse électrique sous la portée (lecture à vue, lecture appliquée, solfège).
À lancer après fixes3.py."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
rep("""  ABCJS.renderAbc(target,abc,Object.assign({add_classes:true,""","""  const tb=TAB_MODS.includes(S.mod)&&target.id==='score'&&TAB_DEF[tabMode()];if(tb)opts=Object.assign({tablature:[tb()]},opts);
  ABCJS.renderAbc(target,abc,Object.assign({add_classes:true,""")
rep("""  return [...target.querySelectorAll('.abcjs-note, .abcjs-rest')];
}""","""  return [...target.querySelectorAll('.abcjs-note:not(.abcjs-tabNumber), .abcjs-rest:not(.abcjs-tabNumber)')];
}
/* tablature : la guitare et la basse s'écrivent une octave plus haut que le son réel (comme dans abcjs) */
const TAB_MODS=['lm','la'];
/* avec tablature : clé imposée, notes jouables sur toutes les cordes, jusqu'à la 12e case */
const TAB_RANGE={guitar:['treble',52,88],bass:['bass',40,67]}; /* de la corde grave à vide jusqu'à la 12e case de la corde aiguë */
const _genMel=genMelody;
genMelody=function(cfg){const tm=TAB_MODS.includes(S.mod)&&TAB_RANGE[tabMode()];if(!tm)return _genMel(cfg);
  const[clef,a,b]=tm,c2=Object.assign({},cfg,{clef});let best=null,bp=1e9;
  for(let k=0;k<60&&bp>0;k++){const ex=_genMel(c2),ns=ex.events.filter(e=>!e.rest);
    for(const sh of[ex.shift,ex.shift-1,ex.shift+1,ex.shift-2,ex.shift+2]){
      const p=ns.reduce((t,e)=>{const m=degInfo(ex.key,clef,sh,e.deg).midi;return t+Math.max(0,a-m)+Math.max(0,m-b);},0);
      if(p<bp){bp=p;best=[ex,sh];}if(!p)break;}}
  const[ex,sh]=best;if(sh!==ex.shift){ex.shift=sh;ex.events.forEach(e=>{if(!e.rest)Object.assign(e,degInfo(ex.key,clef,sh,e.deg));});}
  return ex;};
const TAB_DEF={guitar:()=>({instrument:'guitar',label:''}),bass:()=>({instrument:'violin',label:'',tuning:['E,,','A,,','D,','G,']})};
/* basse 4 cordes : le module « violon » d'abcjs dessine bien 4 lignes (celui de la guitare en dessinait 5) */

function tabMode(){try{return localStorage.getItem('atelier-tab')||''}catch(e){return ''}}""")
rep("""  if(id==='lr'){const i=el('input',{type:'checkbox',id:'s_metro'})""","""  if(TAB_MODS.includes(id))opts.push(field(['Tablature',typeof betaTag==='function'?betaTag():null].filter(Boolean),el('div',{class:'field'},sel('s_tab',[['','Aucune'],['guitar','Guitare'],['bass','Basse électrique']],tabMode(),v=>{try{localStorage.setItem('atelier-tab',v)}catch(e){};newEx();}),el('span',{class:'hint'},'Les numéros de case s\\'affichent sous la portée. La clé est imposée (sol pour la guitare, fa pour la basse) et les notes utilisent toutes les cordes, jusqu\\'à la 12e case.'))));
  if(id==='lr'){const i=el('input',{type:'checkbox',id:'s_metro'})""")
s=s.replace("</style>","#score .abcjs-tab-number,#score .abcjs-tabNumber{fill:currentColor}\n</style>",1)
rep("['Sujets',`${c.topics.length} notion${c.topics.length>1?'s':''}`],['Formats',c.formats.length===3?'tous':c.formats.map(f=>QZ_FORMATS.find(x=>x[0]===f)[1]).join(', ')]",
 "['Formats',c.formats.length===3?'tous':c.formats.map(f=>QZ_FORMATS.find(x=>x[0]===f)[1]).join(', ')],['Sujets',QZ_SUBJ.filter(x=>x.subs.some(([id])=>c.topics.includes(id))).map(x=>T(x.t)).join(', ')||'aucun']")
s=s.replace("</style>","@media (max-width:600px){main[data-kind=\"quiz\"] .meta>:nth-child(4){grid-column:1/4}}\n</style>",1)
rep("{id:'la',kind:'mel',t:'Lecture appliquée',s:'Voir → jouer',d:'Joue la mélodie note par note sur le clavier à l\\'écran ou avec ton clavier d\\'ordinateur.'}",
 "{id:'la',kind:'mel',t:'Lecture mélodique',s:'Voir → jouer note par note',d:'Joue la mélodie note par note, sans tempo : sur le clavier à l\\'écran, avec ton clavier d\\'ordinateur ou sur ton instrument avec le micro.'}")
# iPad à la verticale (601 à 860 px) : même menu déroulant des modules que sur mobile
rep("/* ===== mobile : menu déroulant des modules ===== */\n.modpick{display:none}\n@media (max-width:600px){","/* ===== mobile et tablette : menu déroulant des modules ===== */\n.modpick{display:none}\n@media (max-width:860px){")
# son de basse électrique
rep("const INSTRS=[['piano','Piano'],['guitare','Guitare'],['voix','Voix'],['flute','Flûte de pan']];","const INSTRS=[['piano','Piano'],['guitare','Guitare'],['basse','Basse électrique'],['voix','Voix'],['flute','Flûte de pan']];")
rep("note(m,t,d,v,dest){const k=S.inst;if(k==='guitare')","note(m,t,d,v,dest){const k=S.inst;if(k==='basse')return this.bass(m,t,d,v,dest);if(k==='guitare')")
rep("  vcache:{},\n  voiceBuf(",open('/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/bassjs.txt').read()+"  vcache:{},\n  voiceBuf(")
# basse dans l'ordre de la gamme : la tonique (I) est toujours la note la plus grave, les autres degrés au-dessus
rep("function voiceChord(tones,inv,prevUpper,id){\n  const bassT=tones[inv],bass=atOct(bassT.pc,40);",
 "function voiceChord(tones,inv,prevUpper,id,key){\n  const bassT=tones[inv],ton=key?scaleNote(key,0).pc:null,bass=ton==null?atOct(bassT.pc,40):atOct(ton,38)+((bassT.pc-ton+12)%12);")
rep("const v=voiceChord(tones,inv,prevUp,id);","const v=voiceChord(tones,inv,prevUp,id,key);")
rep("v=voiceChord(tones,inv,prev,id);","v=voiceChord(tones,inv,prev,id,key);")
open(p,'w',encoding='utf-8').write(s)

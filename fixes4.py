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
const TAB_MODS=['lm','la','so'];
const TAB_DEF={guitar:()=>({instrument:'guitar',label:''}),bass:()=>({instrument:'guitar',label:'',tuning:['E,,','A,,','D,','G,']})};
function tabMode(){try{return localStorage.getItem('atelier-tab')||''}catch(e){return ''}}""")
rep("""  if(id==='lr'){const i=el('input',{type:'checkbox',id:'s_metro'})""","""  if(TAB_MODS.includes(id))opts.push(field('Tablature',el('div',{class:'field'},sel('s_tab',[['','Aucune'],['guitar','Guitare'],['bass','Basse électrique']],tabMode(),v=>{try{localStorage.setItem('atelier-tab',v)}catch(e){};M.redraw&&M.redraw();}),el('span',{class:'hint'},'Les numéros de case s\\'affichent sous la portée. « ? » : note trop grave pour l\\'instrument. Choisis la clé de sol pour la guitare et la clé de fa pour la basse.'))));
  if(id==='lr'){const i=el('input',{type:'checkbox',id:'s_metro'})""")
s=s.replace("</style>","#score .abcjs-tab-number,#score .abcjs-tabNumber{fill:currentColor}\n</style>",1)
open(p,'w',encoding='utf-8').write(s)

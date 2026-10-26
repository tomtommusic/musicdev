#!/usr/bin/env python3
"""Modules « Vocalises » (section Voix) et « Accompagnateur » (Outils). Cachés dans l'app iOS tant qu'ils sont en essai. Après rud/rud.py, avant order/order.py."""
import sys,os
D=os.path.dirname(os.path.abspath(__file__))
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
i=s.index("  {id:'mt',");j=s.index("\n",i)+1
s=s[:j]+"  {id:'ba',kind:'tools',t:'Accompagnateur',s:'Grille d\\'accords et grooves',d:'Écris une grille d\\'accords et choisis un style : batterie, basse et piano t\\'accompagnent en boucle, au tempo et dans la tonalité de ton choix.'},\n"+s[j:]
i=s.index("  {id:'so',");j=s.index("\n",i)+1
s=s[:j]+"  {id:'vo',g:'Voix',kind:'tools',t:'Vocalises',s:'Réchauffer et développer la voix',d:'Des vocalises reconnues, classées par objectif : échauffement, souffle, résonance, agilité, étendue, justesse et diction. Le piano accompagne et monte d\\'un demi-ton à chaque répétition.'},\n"+s[j:]
rep("id==='rd'||id==='et')return{};","id==='rd'||id==='et'||id==='vo'||id==='ba')return{};")
rep("(dm|dr|iv|pc|ln|lm|lr|lb|rd|so|la|tq|mt|ac|en|dg|et|gc|ho|ap|bd)","(dm|dr|iv|pc|ln|lm|lr|lb|rd|so|vo|la|tq|mt|ba|ac|en|dg|et|gc|ho|ap|bd)")
rep("const MOD=Object.fromEntries(MODS.map(m=>[m.id,m]));","""const MOD=Object.fromEntries(MODS.map(m=>[m.id,m]));
/* modules en essai : offerts sur le site, pas encore dans l'app iOS */
if(location.protocol==='app:')['vo','ba'].forEach(id=>{const i=MODS.findIndex(m=>m.id===id);if(i>=0)MODS.splice(i,1);});""")
code=open(D+'/vo.js',encoding='utf-8').read()+open(D+'/ba.js',encoding='utf-8').read()
rep("/* ---------- démarrage ---------- */",code+"\n/* ---------- démarrage ---------- */")
css=open(D+'/vo.css',encoding='utf-8').read()
k=s.rfind('</style>',0,s.find('<div class="app">'));s=s[:k]+css+s[k:]
open(p,'w',encoding='utf-8').write(s);print('vo ok')

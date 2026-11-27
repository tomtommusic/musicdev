"""Module « Pièces pour enfants » (pe/songs.js + pe/pe.js + pe/pe.css). À lancer en dernier."""
import sys,os
D=os.path.dirname(os.path.abspath(__file__))
p=sys.argv[1];s=open(p,encoding='utf-8').read()
if "{id:'pe'," in s:print('deja');sys.exit(0)
def rep(a,b):
    global s
    assert s.count(a)==1,('introuvable',a[:70],s.count(a));s=s.replace(a,b)
rep("  {id:'vo',g:'Voix'","  {id:'pe',g:'Primaire',kind:'tools',t:'Pièces pour enfants',s:'Xylophone, flûte à bec, clarion',d:'Des chansons connues classées par niveau, en grosses notes avec leur nom à l\\'intérieur, et des pièces à 2, 3 ou 4 voix. Écoute, joue avec le métronome et imprime la partition.'},\n  {id:'vo',g:'Voix'")
rep("||id==='ba')return{};","||id==='ba'||id==='pe')return{};")
rep("|ho|ap|bd)(?:-([A-Za-z0-9_-]+))?$/","|ho|ap|bd|pe)(?:-([A-Za-z0-9_-]+))?$/")
code=open(D+'/songs.js',encoding='utf-8').read()+'\n'+open(D+'/pe.js',encoding='utf-8').read()
rep("/* ---------- démarrage ---------- */",code+"\n/* ---------- démarrage ---------- */")
css=open(D+'/pe.css',encoding='utf-8').read()
i=s.rfind('</style>',0,s.find('<div class="app">'));s=s[:i]+css+s[i:]
open(p,'w',encoding='utf-8').write(s);print('pe ok')

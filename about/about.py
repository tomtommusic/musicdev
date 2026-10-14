#!/usr/bin/env python3
"""Module « À propos » : politique de confidentialité, licences, version. À lancer après fixes4.py."""
import sys,os,re
D=os.path.dirname(os.path.abspath(__file__))
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,('introuvable',a[:70],s.count(a));s=s.replace(a,b)
ver=re.search(r"musicdev-([\d.]+)",open(os.path.join(os.path.dirname(os.path.abspath(p)),'sw.js')).read()).group(1)
i=s.index("  {id:'en',kind:'tools'");j=s.index("\n",i)+1
s=s[:j]+"  {id:'ap',g:'Infos',kind:'tools',t:'À propos',s:'Confidentialité et licences',d:'Qui a fait MusicDEV, comment tes données sont protégées (rien ne quitte ton appareil) et les licences des outils libres utilisés.'},\n"+s[j:]
rep("id==='gc'||id==='ho')return{};","id==='gc'||id==='ho'||id==='ap')return{};")
rep("(dm|dr|iv|pc|ln|lm|lr|so|la|tq|mt|ac|en|dg|gc|ho)","(dm|dr|iv|pc|ln|lm|lr|so|la|tq|mt|ac|en|dg|gc|ho|ap)")
code="const AP_VERSION='"+ver+"';\n"+open(D+'/about.js',encoding='utf-8').read()
rep("/* ---------- démarrage ---------- */",code+"\n/* ---------- démarrage ---------- */")
css=open(D+'/about.css',encoding='utf-8').read()
i=s.rfind('</style>',0,s.find('<div class="app">'));s=s[:i]+css+s[i:]
open(p,'w',encoding='utf-8').write(s);print('about ok',ver)

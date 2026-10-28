#!/usr/bin/env python3
"""Version complète : plus d'étiquettes Bêta, Vocalises et Accompagnateur aussi dans l'app iOS/Mac. À lancer après smp.py, avant i18n."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:90],s.count(a));s=s.replace(a,b)
rep("function betaTag(){return el('span',{class:'beta',","function betaTag(){return null;return el('span',{class:'beta',")
rep("if(location.protocol==='app:')['vo','ba'].forEach(","if(false)['vo','ba'].forEach(")
open(p,'w',encoding='utf-8').write(s)

#!/usr/bin/env python3
"""Modules « Rudiments » (batterie) et « Études » (instruments) + nouvelles sections du menu. Après adv/adv.py."""
import sys,os,re
D=os.path.dirname(os.path.abspath(__file__))
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
# menu : section « Batterie » (Lecture batterie + Rudiments) après Lecture mélodique ; section « Instruments » (Doigtés, Études, Accords)
i=s.index("  {id:'lb',kind:'drum'");j=s.index("\n",i)+1;lb=s[i:j];s=s[:i]+s[j:]
lb=lb.replace("{id:'lb',kind:'drum'","{id:'lb',g:'Batterie',kind:'drum'")
i=s.index("  {id:'la',kind:'mel'");j=s.index("\n",i)+1
s=s[:j]+lb+"  {id:'rd',kind:'tools',t:'Rudiments',s:'Technique de caisse claire',d:'Les 40 rudiments internationaux (PAS) : roulements, paradiddles, flas et ras, avec le doigté main droite / main gauche, à écouter et à jouer avec le métronome.'},\n"+s[j:]
rep("  {id:'dg',kind:'tools',t:'Doigtés d\\'instruments'","  {id:'dg',g:'Instruments',kind:'tools',t:'Doigtés d\\'instruments'")
i=s.index("  {id:'dg',g:'Instruments'");j=s.index("\n",i)+1
s=s[:j]+"  {id:'et',kind:'tools',t:'Études',s:'Gammes, arpèges, liaisons',d:'Des exercices techniques pour ton instrument : notes longues, gammes, tierces, arpèges, motifs, intervalles, gamme chromatique et liaisons pour les cuivres, dans la tonalité et le registre de ton choix.'},\n"+s[j:]
rep("id==='gc'||id==='ho'||id==='ap'||id==='bd')return{};","id==='gc'||id==='ho'||id==='ap'||id==='bd'||id==='rd'||id==='et')return{};")
rep("(dm|dr|iv|pc|ln|lm|lr|lb|so|la|tq|mt|ac|en|dg|gc|ho|ap|bd)","(dm|dr|iv|pc|ln|lm|lr|lb|rd|so|la|tq|mt|ac|en|dg|et|gc|ho|ap|bd)")
code=open(D+'/rud.js',encoding='utf-8').read()+open(D+'/et.js',encoding='utf-8').read()
rep("/* ---------- démarrage ---------- */",code+"\n/* ---------- démarrage ---------- */")
css=open(D+'/rud.css',encoding='utf-8').read()
k=s.rfind('</style>',0,s.find('<div class="app">'));s=s[:k]+css+s[k:]
open(p,'w',encoding='utf-8').write(s);print('rud ok')

#!/usr/bin/env python3
"""Accueil (visite guidée) + module « Accords de guitare ». À lancer après tools/integrate_tools.py."""
import sys,os
D=os.path.dirname(os.path.abspath(__file__))
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,('introuvable',a[:70],s.count(a));s=s.replace(a,b)
rep("const MODS=[\n","const MODS=[\n  {id:'ho',kind:'tools',t:'Accueil',s:'Bienvenue',d:'Un tour rapide de l\\'app : où trouver les modules, les explications et comment me joindre.'},\n")
rep("  {id:'mt',g:'Outils'","  {id:'gc',kind:'tools',t:'Accords',s:'Guitare, ukulélé, piano…',d:'Choisis un instrument, une fondamentale et un type d\\'accord, ou tape son nom : quelques positions à voir et à entendre.'},\n  {id:'mt',g:'Outils'")
rep("if(id==='bt'||id==='mt'||id==='ac'||id==='en'||id==='dg')return{};","if(id==='bt'||id==='mt'||id==='ac'||id==='en'||id==='dg'||id==='gc'||id==='ho')return{};")
rep("(dm|dr|iv|pc|ln|lm|lr|so|la|tq|mt|ac|en|dg)","(dm|dr|iv|pc|ln|lm|lr|so|la|tq|mt|ac|en|dg|gc|ho)")
rep("  openModule(m?m[1]:'dm',shared);","  openModule(m?m[1]:'ho',shared);")
rep("function openModule(id,shared,opts={}){\n","function openModule(id,shared,opts={}){\n  if(typeof hoOff==='function'&&id!=='ho')hoOff();document.querySelector('main').dataset.mod=id;\n")
code=open(D+'/gc/gc.js',encoding='utf-8').read()+'\n'+open(D+'/home/home.js',encoding='utf-8').read()
rep("/* ---------- démarrage ---------- */",code+"\n/* ---------- démarrage ---------- */")
css=open(D+'/gc/gc.css',encoding='utf-8').read()+open(D+'/home/home.css',encoding='utf-8').read()
i=s.rfind('</style>',0,s.find('<div class="app">'));s=s[:i]+css+s[i:]
# le logo ramène à l'accueil
rep('<div class="brand">','<div class="brand" role="link" tabindex="0" title="Accueil" onclick="openModule(\'ho\')" onkeydown="if(event.key===\'Enter\')openModule(\'ho\')" style="cursor:pointer">')
open(p,'w',encoding='utf-8').write(s);print('features2 ok')

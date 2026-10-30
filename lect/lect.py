#!/usr/bin/env python3
"""Bibliothèque, onglet Lecture : tablatures et partitions de batterie (FR dans l'app, EN/ES dans lib_en/lib_es.json).
Ajoute aussi la tablature sous les exemples (x.tab). À lancer après modes.py."""
import sys,os,json
D=os.path.dirname(os.path.abspath(__file__))
exec(open(D+'/lect_lib.py',encoding='utf-8').read())
exec(open(D+'/merge_cles.py',encoding='utf-8').read())
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
def topics(L):
    out=[]
    for t in TOPICS[L]:
        fr=[u for u in TOPICS['fr'] if u['id']==t['id']][0]
        x={'id':t['id'],'t':t['t'],'k':t['k'],'html':t['html'],'ex':[]}
        for e in EX.get(fr.get('x'),[]):
            y={'abc':e['abc'],'cap':e['cap'][L]}
            if L=='fr':
                if e.get('tab'):y['tab']=e['tab']
                if e.get('play') is False:y['play']=False
            x['ex'].append(y)
        if L=='fr':x['see']=fr['see']
        out.append(x)
    return out
js='const LIB_LECT='+json.dumps(topics('fr'),ensure_ascii=False).replace('</','<\\/')+';\n'
rep("const LIB=[...LIB1,...LIB2,...LIB3];","const LIB=[...LIB1,...LIB2,...LIB3];\n"+js+"LIB.find(c=>c.id==='lecture').topics.push(...LIB_LECT);\n"+(JS_MERGE%(json.dumps(TITLE['fr'],ensure_ascii=False),json.dumps(CLEF_ABC['fr'],ensure_ascii=False))))
rep("scale:x.scale||1})[0];","scale:x.scale||1,tablature:x.tab&&typeof TAB_DEF!=='undefined'&&TAB_DEF[x.tab]?[TAB_DEF[x.tab]()]:undefined})[0];")
i=s.rindex("</style>");s=s[:i]+"pre.tabtxt{font:600 .85rem/1.35 var(--f-mono,monospace);background:var(--sunk,rgba(0,0,0,.04));border:1px solid var(--line);border-radius:10px;padding:10px 12px;overflow-x:auto;white-space:pre;margin:.6em 0}\n"+s[i:]
open(p,'w',encoding='utf-8').write(s)
for L in ('en','es'):
    f=os.path.join(D,'..','i18n',f'lib_{L}.json');d=json.load(open(f,encoding='utf-8'))
    ids={t['id'] for t in TOPICS[L]}
    for c in d:
        if c['id']=='lecture':c['topics']=[t for t in c['topics'] if t['id'] not in ids]+topics(L)
    d=merge_json(d,L)
    json.dump(d,open(f,'w',encoding='utf-8'),ensure_ascii=False,indent=1)

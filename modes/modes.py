#!/usr/bin/env python3
"""Bibliothèque théorique : nouvelle catégorie « Modes et improvisation » (FR dans l'app, EN/ES dans lib_en/lib_es.json).
À lancer après v129.py (avant i18n)."""
import sys,os,json
D=os.path.dirname(os.path.abspath(__file__))
exec(open(D+'/impro_lib.py',encoding='utf-8').read())
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
def cat(L):
    T=TOPICS[L];out={'id':'impro','t':T['cat'],'topics':[]}
    for t in T['topics']:
        x={'id':t['id'],'t':t['t'],'k':t['k'],'html':t['html']}
        fr=[u for u in TOPICS['fr']['topics'] if u['id']==t['id']][0]
        x['ex']=[{'abc':e['abc'],'cap':e['cap'][L]} for e in EX.get(fr.get('x'),[])]
        if L=='fr':x['see']=fr['see']
        out['topics'].append(x)
    return out
js='const LIB3=['+json.dumps(cat('fr'),ensure_ascii=False).replace('</','<\\/')+'];\n'
rep("const LIB=[...LIB1,...LIB2];",js+"const LIB=[...LIB1,...LIB2,...LIB3];")
open(p,'w',encoding='utf-8').write(s)
# traductions : la catégorie doit être la 7e (même position que dans l'app)
for L in ('en','es'):
    f=os.path.join(D,'..','i18n',f'lib_{L}.json');d=json.load(open(f,encoding='utf-8'))
    d=[c for c in d if c['id']!='impro']+[cat(L)]
    json.dump(d,open(f,'w',encoding='utf-8'),ensure_ascii=False,indent=1)

#!/usr/bin/env python3
"""Bibliothèque théorique : nouvelle catégorie « Modes et improvisation » (FR dans l'app, EN/ES dans lib_en/lib_es.json).
À lancer après v129.py (avant i18n)."""
import sys,os,json
D=os.path.dirname(os.path.abspath(__file__))
exec(open(D+'/impro_lib.py',encoding='utf-8').read())
exec(open(D+'/merged.py',encoding='utf-8').read())
for L in ('fr','en','es'):TOPICS[L]['topics'].insert(0,MERGED[L])
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
# l'ancienne fiche « Les modes » (onglet Gammes) est fusionnée dans la nouvelle catégorie
a=s.index(" {id:'modes',t:'Les modes'");b=s.index(" {id:'autres-gammes'",a);s=s[:a]+s[b:]
js='const LIB3=['+json.dumps(cat('fr'),ensure_ascii=False).replace('</','<\\/')+'];\n'
rep("const LIB=[...LIB1,...LIB2];",js+"const LIB=[...LIB1,...LIB2,...LIB3];")
# Tester mes connaissances : sujet « Modes et improvisation » + écoute des modes (offerts en option, pas dans les réglages par défaut)
rep("['e_cad','Cadences'],['e_rhy','Rythmes']]},","['e_cad','Cadences'],['e_rhy','Rythmes'],['e_mde','Reconnaître un mode']]},")
rep(" {id:'eco',t:'Écoute',listen:true,"," {id:'mod',t:'Modes et improvisation',subs:[['m_for','Formules des modes'],['m_not','Notes d\\'un mode'],['m_acc','Quel mode sur quel accord'],['m_pen','Pentatoniques et blues'],['m_imp','Notions d\\'improvisation']]},\n {id:'eco',t:'Écoute',listen:true,")
rep("/* ---------- tirage d'un questionnaire ---------- */",open(D+'/qz_modes.js',encoding='utf-8').read()+"\n/* ---------- tirage d'un questionnaire ---------- */")
open(p,'w',encoding='utf-8').write(s)
# traductions : la catégorie doit être la 7e (même position que dans l'app)
for L in ('en','es'):
    f=os.path.join(D,'..','i18n',f'lib_{L}.json');d=json.load(open(f,encoding='utf-8'))
    d=[c for c in d if c['id']!='impro']+[cat(L)]
    for c in d:
        if c['id']=='gammes':c['topics']=[t for t in c['topics'] if t['id']!='modes']
    json.dump(d,open(f,'w',encoding='utf-8'),ensure_ascii=False,indent=1)

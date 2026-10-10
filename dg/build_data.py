import json
D='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/'
out={}
def ww(f,key):
    d=json.load(open(D+f));notes=[]
    for n in d['notes']:
        notes.append({'m':n['midi'],'k':n['keys'],'a':[{'k':a['keys'],'l':a.get('label','')} for a in n.get('alt',[])],'c':n.get('comment','')})
    out[key]=notes
ww('flute.json','flute');ww('clarinet.json','clar');ww('altosax.json','asax')
b=json.load(open(D+'brass.json'))
out['tpt']=[{'m':n['midi'],'v':n['valves'],'a':n.get('alt',[]),'c':n.get('comment','')} for n in b['trumpet']['notes']]
tb=[]
for n in b['trombone']['notes']:
    e={'m':n['midi'],'p':n['pos'],'a':n.get('alt',[]),'c':n.get('comment','')}
    tb.append(e)
out['tbn']=tb
js='const DG_DATA='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n'
open(D+'dg_data.js','w').write(js)
coms=set()
for k,v in out.items():
    for n in v:
        if n.get('c'):coms.add(n['c'])
        for a in n.get('a',[]):
            if isinstance(a,dict) and a.get('l'):coms.add(a['l'])
json.dump(sorted(coms),open(D+'comments_fr.json','w'),ensure_ascii=False,indent=0)
print(len(js),len(coms))

# Fusion des fiches « La portée » et « Les clés » (onglet Lecture) en une seule fiche « La portée et les clés ».
CLEF_ABC={
 'fr':'X:1\nL:1/4\nK:C clef=treble\n"^Clé de sol"C4 | [K:clef=bass] "^Clé de fa"C4 | [K:clef=alto] "^Clé d\'ut 3e ligne"C4 | [K:clef=tenor] "^Clé d\'ut 4e ligne"C4 |]',
 'en':'X:1\nL:1/4\nK:C clef=treble\n"^Treble clef"C4 | [K:clef=bass] "^Bass clef"C4 | [K:clef=alto] "^Alto clef (C, 3rd line)"C4 | [K:clef=tenor] "^Tenor clef (C, 4th line)"C4 |]',
 'es':'X:1\nL:1/4\nK:C clef=treble\n"^Clave de sol"C4 | [K:clef=bass] "^Clave de fa"C4 | [K:clef=alto] "^Clave de do en 3.ª"C4 | [K:clef=tenor] "^Clave de do en 4.ª"C4 |]'}
TITLE={'fr':'La portée et les clés','en':'The staff and clefs','es':'El pentagrama y las claves'}
BELOW={'fr':' (voir plus bas)','en':' (see below)','es':' (ver más abajo)'}
import re
def merge_json(d,L):
    for c in d:
        if c['id']!='lecture':continue
        ts=c['topics'];P=next((t for t in ts if t['id']=='portee'),None);C=next((t for t in ts if t['id']=='cles'),None)
        if not P or not C:return d
        P['t']=TITLE[L];P['k']=(P.get('k') or '')+' '+(C.get('k') or '')
        P['html']=re.sub(r'<a href="#" data-go="cles">([^<]*)</a>',lambda m:'<b>'+m.group(1)+'</b>'+BELOW[L],P['html'])+'\n<h4>'+C['t']+'</h4>\n'+C['html']
        cex=[dict(e) for e in C.get('ex',[])]
        if cex:cex[0]['abc']=CLEF_ABC[L]
        P['ex']=P.get('ex',[])+cex
        c['topics']=[t for t in ts if t['id']!='cles']
    for c in d:
        for t in c['topics']:t['html']=t['html'].replace('data-go="cles"','data-go="portee"')
    return d
JS_MERGE=r'''(()=>{const lec=LIB.find(c=>c.id==='lecture');if(!lec)return;const ts=lec.topics,P=ts.find(t=>t.id==='portee'),C=ts.find(t=>t.id==='cles');if(!P||!C)return;
  P.t=%s;P.k+=' '+C.k;P.html=P.html.replace(/<a href="#" data-go="cles">([^<]*)<\/a>/,'<b>$1</b> (voir plus bas)')+'\n<h4>'+C.t+'</h4>\n'+C.html;
  if(C.ex&&C.ex[0])C.ex[0].abc=%s;P.ex=(P.ex||[]).concat(C.ex||[]);ts.splice(ts.indexOf(C),1);
  LIB.forEach(c=>c.topics.forEach(t=>{t.html=t.html.replace(/data-go="cles"/g,'data-go="portee"');if(t.see)t.see=[...new Set(t.see.map(s=>s==='cles'?'portee':s))].filter(s=>s!==t.id);}));})();
'''

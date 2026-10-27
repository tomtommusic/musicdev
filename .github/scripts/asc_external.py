"""Met le dernier build de MusiDev en test externe (groupe « Testeurs ») et le soumet à la révision bêta d'Apple.
Utilise la clé API App Store Connect des secrets GitHub. Écrit un résumé lisible dans le journal (::notice::)."""
import os, time, json, sys, urllib.request, urllib.error
import jwt  # PyJWT

KEY_ID=os.environ['ASC_KEY_ID'];ISS=os.environ['ASC_ISSUER_ID'];P8=os.environ['ASC_KEY_P8']
BUNDLE=os.environ.get('BUNDLE','ca.tomtommusic.musicdev');GROUP=os.environ.get('GROUP','Testeurs')
FEEDBACK=os.environ.get('FEEDBACK_EMAIL','');WHAT=os.environ.get('WHAT_TO_TEST','')
API='https://api.appstoreconnect.apple.com'
def tok():
    now=int(time.time())
    return jwt.encode({'iss':ISS,'iat':now,'exp':now+1100,'aud':'appstoreconnect-v1'},P8,algorithm='ES256',headers={'kid':KEY_ID,'typ':'JWT'})
def call(method,path,body=None):
    req=urllib.request.Request(API+path,method=method,data=json.dumps(body).encode() if body is not None else None,
        headers={'Authorization':'Bearer '+tok(),'Content-Type':'application/json'})
    try:
        with urllib.request.urlopen(req) as r:
            t=r.read();return r.status,(json.loads(t) if t else {})
    except urllib.error.HTTPError as e:
        t=e.read().decode(errors='replace')
        try:j=json.loads(t)
        except Exception:j={'raw':t}
        return e.code,j
def note(m):print('::notice::'+m.replace('\n',' '))
def err(m):print('::error::'+m.replace('\n',' '))
def errs(j):return '; '.join((x.get('title','')+' — '+x.get('detail','')) for x in j.get('errors',[])) or json.dumps(j)[:400]

st,j=call('GET',f'/v1/apps?filter[bundleId]={BUNDLE}')
if st!=200 or not j.get('data'):err(f'App introuvable ({st}) : {errs(j)}');sys.exit(1)
app=j['data'][0]['id'];note(f'App trouvée : {j["data"][0]["attributes"]["name"]}')

PLAT=os.environ.get('PLATFORM','IOS')
st,j=call('GET',f'/v1/builds?filter[app]={app}&filter[preReleaseVersion.platform]={PLAT}&sort=-uploadedDate&limit=1&include=preReleaseVersion')
b=j['data'][0];bid=b['id'];a=b['attributes']
ver=(j.get('included') or [{}])[0].get('attributes',{}).get('version','?')
note(f'Dernier build : {ver} ({a["version"]}), état {a["processingState"]}')
if os.environ.get('MODE')=='status':
    st,jl=call('GET',f'/v1/builds?filter[app]={app}&filter[preReleaseVersion.platform]={PLAT}&sort=-uploadedDate&limit=6')
    out=[]
    for bb in jl.get('data',[]):
        st,jj=call('GET',f'/v1/builds/{bb["id"]}/buildBetaDetail')
        ebs=jj.get('data',{}).get('attributes',{}).get('externalBuildState','?')
        out.append(f'{bb["attributes"]["version"]}:{ebs}')
    note('ETAT_EXTERNE='+' '.join(out));sys.exit(0)
if a['processingState']!='VALID':err('Le build est encore en traitement chez Apple : réessaie dans quelques minutes.');sys.exit(1)
if a.get('usesNonExemptEncryption') is None:
    call('PATCH',f'/v1/builds/{bid}',{'data':{'type':'builds','id':bid,'attributes':{'usesNonExemptEncryption':False}}})

# textes de test (description de l'app, courriel pour les commentaires, quoi tester)
st,j=call('GET',f'/v1/apps/{app}/betaAppLocalizations')
locs={x['attributes']['locale']:x for x in j.get('data',[])}
DESC={'fr-CA':"MusiDev est un atelier de formation musicale : oreille (dictées, intervalles, accords), lecture (notes, lecture à vue, rythme, solfège, batterie), théorie, doigtés d'instruments, accordeur, métronome et enregistreur.",
      'en-CA':"MusiDev is a music training workshop: ear training (dictation, intervals, chords), reading (notes, sight-reading, rhythm, solfège, drums), theory, instrument fingerings, tuner, metronome and recorder."}
for loc,desc in DESC.items():
    attrs={'description':desc}
    if FEEDBACK:attrs['feedbackEmail']=FEEDBACK
    if loc in locs:
        x=locs[loc];cur=x['attributes']
        upd={k:v for k,v in attrs.items() if not cur.get(k)}
        if upd:call('PATCH',f'/v1/betaAppLocalizations/{x["id"]}',{'data':{'type':'betaAppLocalizations','id':x['id'],'attributes':upd}})
    else:
        st,jj=call('POST','/v1/betaAppLocalizations',{'data':{'type':'betaAppLocalizations','attributes':dict(attrs,locale=loc),'relationships':{'app':{'data':{'type':'apps','id':app}}}}})
        if st>=300:note(f'Description {loc} non créée : {errs(jj)}')
if WHAT:
    st,j=call('GET',f'/v1/builds/{bid}/betaBuildLocalizations')
    bl={x['attributes']['locale']:x['id'] for x in j.get('data',[])}
    for loc in ('fr-CA','en-CA'):
        if loc in bl:call('PATCH',f'/v1/betaBuildLocalizations/{bl[loc]}',{'data':{'type':'betaBuildLocalizations','id':bl[loc],'attributes':{'whatsNew':WHAT}}})
        else:call('POST','/v1/betaBuildLocalizations',{'data':{'type':'betaBuildLocalizations','attributes':{'locale':loc,'whatsNew':WHAT},'relationships':{'build':{'data':{'type':'builds','id':bid}}}}})

# groupe externe
st,j=call('GET',f'/v1/betaGroups?filter[app]={app}&limit=50')
ext=[g for g in j.get('data',[]) if not g['attributes'].get('isInternalGroup')]
g=next((x for x in ext if x['attributes']['name']==GROUP),ext[0] if ext else None)
if not g:
    st,jj=call('POST','/v1/betaGroups',{'data':{'type':'betaGroups','attributes':{'name':GROUP,'publicLinkEnabled':True,'publicLinkLimitEnabled':False,'feedbackEnabled':True},'relationships':{'app':{'data':{'type':'apps','id':app}}}}})
    if st>=300:err(f'Groupe externe non créé : {errs(jj)}');sys.exit(1)
    g=jj['data'];note(f'Groupe externe créé : {GROUP}')
else:
    note(f'Groupe externe : {g["attributes"]["name"]}')
    if not g['attributes'].get('publicLinkEnabled'):
        st,jj=call('PATCH',f'/v1/betaGroups/{g["id"]}',{'data':{'type':'betaGroups','id':g['id'],'attributes':{'publicLinkEnabled':True,'publicLinkLimitEnabled':False}}})
        if st<300:g=jj['data']
gid=g['id']
st,jj=call('POST',f'/v1/betaGroups/{gid}/relationships/builds',{'data':[{'type':'builds','id':bid}]})
note('Build ajouté au groupe.' if st<300 else f'Ajout du build au groupe : {errs(jj)}')

# testeurs à ajouter au groupe (courriels séparés par des virgules)
for em in [x.strip() for x in os.environ.get('ADD_TESTERS','').split(',') if x.strip()]:
    st,jj=call('POST','/v1/betaTesters',{'data':{'type':'betaTesters','attributes':{'email':em},'relationships':{'betaGroups':{'data':[{'type':'betaGroups','id':gid}]}}}})
    if st<300:note(f'Testeur ajouté au groupe : {em}')
    elif st==409:
        st2,j2=call('GET',f'/v1/betaTesters?filter[email]={em}')
        tid=(j2.get('data') or [{}])[0].get('id')
        if tid:
            st3,j3=call('POST',f'/v1/betaGroups/{gid}/relationships/betaTesters',{'data':[{'type':'betaTesters','id':tid}]})
            note(f'Testeur déjà connu, ajouté au groupe : {em}' if st3<300 else f'Testeur {em} : {errs(j3)}')
        else:note(f'Testeur {em} : {errs(jj)}')
    else:note(f'Testeur {em} non ajouté : {errs(jj)}')

# coordonnées pour le réviseur
st,j=call('GET',f'/v1/apps/{app}/betaAppReviewDetail')
d=j.get('data',{});da=d.get('attributes',{})
miss=[k for k in ('contactFirstName','contactLastName','contactPhone','contactEmail') if not da.get(k)]
if miss:
    err('Il manque les coordonnées pour le réviseur bêta (prénom, nom, téléphone, courriel) : App Store Connect > TestFlight > Informations de test. Champs manquants : '+', '.join(miss))
    sys.exit(1)
if da.get('demoAccountRequired') is None or da.get('demoAccountRequired'):
    call('PATCH',f'/v1/betaAppReviewDetails/{d["id"]}',{'data':{'type':'betaAppReviewDetails','id':d['id'],'attributes':{'demoAccountRequired':False}}})

st,jj=call('POST','/v1/betaAppReviewSubmissions',{'data':{'type':'betaAppReviewSubmissions','relationships':{'build':{'data':{'type':'builds','id':bid}}}}})
if st<300:note('Build soumis à la révision bêta d\'Apple (généralement moins d\'un jour).')
else:note(f'Soumission à la révision : {errs(jj)}')
st,j=call('GET',f'/v1/betaGroups/{gid}')
link=j.get('data',{}).get('attributes',{}).get('publicLink')
note(f'Lien public : {link}' if link else 'Lien public : pas encore disponible (il apparaît après l\'approbation).')

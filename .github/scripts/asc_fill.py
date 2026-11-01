"""Remplit le dossier App Store de MusiDev : langues, catégories, âge, prix, disponibilité, textes, captures, contact de révision.
Ne soumet RIEN à la révision. Écrit out/asc_fill.json (journal)."""
import os,json,sys,hashlib,glob,urllib.request
src=open(os.path.join(os.path.dirname(__file__),'asc_external.py')).read()
exec(src.split("st,j=call('GET',f'/v1/apps?filter[bundleId]")[0])
LOG=[];ST=os.environ.get('STEPS','all').split(',')
def log(*a):
    m=' '.join(str(x) for x in a);LOG.append(m);print(m)
def ok(st,j,what):
    if st>=300:log('ERREUR',what,st,errs(j))
    else:log('ok',what)
    return st<300
def on(s):return 'all' in ST or s in ST
M=json.load(open('ios/store/metadata.json'))
PRICE=os.environ.get('PRICE','3.99');COPY='2026 Tom Tom Music'
st,j=call('GET',f'/v1/apps?filter[bundleId]={BUNDLE}');aid=j['data'][0]['id']
st,j=call('GET',f'/v1/apps/{aid}/appInfos');info=[x for x in j['data'] if x['attributes']['state'] not in('READY_FOR_DISTRIBUTION','REPLACED_WITH_NEW_INFO')][0];iid=info['id']

if on('info'):
    ok(*call('PATCH',f'/v1/appInfos/{iid}',{'data':{'type':'appInfos','id':iid,'relationships':{
        'primaryCategory':{'data':{'type':'appCategories','id':'EDUCATION'}},'secondaryCategory':{'data':{'type':'appCategories','id':'MUSIC'}}}}}),'catégories')
    st,j=call('GET',f'/v1/appInfos/{iid}/appInfoLocalizations');have={x['attributes']['locale']:x['id'] for x in j['data']}
    for loc,m in M.items():
        a={'name':m['name'],'subtitle':m['subtitle'],'privacyPolicyUrl':m['privacyPolicyUrl']}
        if loc in have:ok(*call('PATCH',f'/v1/appInfoLocalizations/{have[loc]}',{'data':{'type':'appInfoLocalizations','id':have[loc],'attributes':a}}),'fiche '+loc)
        else:ok(*call('POST','/v1/appInfoLocalizations',{'data':{'type':'appInfoLocalizations','attributes':dict(a,locale=loc),'relationships':{'appInfo':{'data':{'type':'appInfos','id':iid}}}}}),'fiche '+loc)

if on('age'):
    st,j=call('GET',f'/v1/appInfos/{iid}/ageRatingDeclaration');rid=j['data']['id'];cur=j['data']['attributes']
    skip={'kidsAgeBand','ageRatingOverride','ageRatingOverrideV2','koreaAgeRatingOverride','gracRatingClassificationNumber','developerAgeRatingInfoUrl'}
    BOOL={'advertising','gambling','healthOrWellnessTopics','lootBox','messagingAndChat','parentalControls','ageAssurance','socialMedia','socialMediaAgeRestricted','unrestrictedWebAccess','userGeneratedContent'}
    att={k:(False if k in BOOL else 'NONE') for k in cur if k not in skip}
    st,jj=call('PATCH',f'/v1/ageRatingDeclarations/{rid}',{'data':{'type':'ageRatingDeclarations','id':rid,'attributes':att}})
    if st>=300:
        log('essai sans socialMediaAgeRestricted :',errs(jj));att.pop('socialMediaAgeRestricted',None)
        st,jj=call('PATCH',f'/v1/ageRatingDeclarations/{rid}',{'data':{'type':'ageRatingDeclarations','id':rid,'attributes':att}})
    ok(st,jj,'classification d\'âge (tout à « aucun »)')

if on('text'):
    st,j=call('GET',f'/v1/apps/{aid}/appStoreVersions?filter[appStoreState]=PREPARE_FOR_SUBMISSION,DEVELOPER_REJECTED,REJECTED,METADATA_REJECTED')
    for v in j['data']:
        vid=v['id'];P=v['attributes']['platform']
        ok(*call('PATCH',f'/v1/appStoreVersions/{vid}',{'data':{'type':'appStoreVersions','id':vid,'attributes':{'copyright':COPY}}}),P+' copyright')
        st,jl=call('GET',f'/v1/appStoreVersions/{vid}/appStoreVersionLocalizations');have={x['attributes']['locale']:x['id'] for x in jl['data']}
        for loc,m in M.items():
            a={k:m[k] for k in('description','keywords','promotionalText','supportUrl','marketingUrl')}
            if loc in have:ok(*call('PATCH',f'/v1/appStoreVersionLocalizations/{have[loc]}',{'data':{'type':'appStoreVersionLocalizations','id':have[loc],'attributes':a}}),P+' textes '+loc)
            else:ok(*call('POST','/v1/appStoreVersionLocalizations',{'data':{'type':'appStoreVersionLocalizations','attributes':dict(a,locale=loc),'relationships':{'appStoreVersion':{'data':{'type':'appStoreVersions','id':vid}}}}}),P+' textes '+loc)
        # contact de révision
        rv={'contactFirstName':os.environ.get('RV_FIRST',''),'contactLastName':os.environ.get('RV_LAST',''),'contactEmail':os.environ.get('RV_EMAIL',''),'contactPhone':os.environ.get('RV_PHONE',''),
            'demoAccountRequired':False,'notes':"No account or login is needed. Everything works offline and no data leaves the device. The microphone is only used, on request, by the tuner, the sight-reading/solfège pitch checking and the recorder. Interface available in French, English and Spanish (buttons at the top)."}
        rv={k:v for k,v in rv.items() if v!=''}
        st,jr=call('GET',f'/v1/appStoreVersions/{vid}/appStoreReviewDetail')
        if st<300 and jr.get('data'):ok(*call('PATCH',f'/v1/appStoreReviewDetails/{jr["data"]["id"]}',{'data':{'type':'appStoreReviewDetails','id':jr['data']['id'],'attributes':rv}}),P+' révision')
        else:ok(*call('POST','/v1/appStoreReviewDetails',{'data':{'type':'appStoreReviewDetails','attributes':rv,'relationships':{'appStoreVersion':{'data':{'type':'appStoreVersions','id':vid}}}}}),P+' révision')

if on('shots'):
    TYPES={'iphone':('IOS','APP_IPHONE_67'),'ipad':('IOS','APP_IPAD_PRO_3GEN_129'),'mac':('MAC_OS','APP_DESKTOP')}
    st,j=call('GET',f'/v1/apps/{aid}/appStoreVersions?filter[appStoreState]=PREPARE_FOR_SUBMISSION,DEVELOPER_REJECTED,REJECTED,METADATA_REJECTED')
    vers={v['attributes']['platform']:v['id'] for v in j['data']}
    for loc in sorted(os.listdir('ios/store/shots')):
        for dev,(P,DT) in TYPES.items():
            files=sorted(glob.glob(f'ios/store/shots/{loc}/{dev}/*.png'))
            if not files or P not in vers:continue
            st,jl=call('GET',f'/v1/appStoreVersions/{vers[P]}/appStoreVersionLocalizations');lid={x['attributes']['locale']:x['id'] for x in jl['data']}.get(loc)
            if not lid:log('ERREUR pas de langue',P,loc);continue
            st,js=call('GET',f'/v1/appStoreVersionLocalizations/{lid}/appScreenshotSets');sid=next((s['id'] for s in js['data'] if s['attributes']['screenshotDisplayType']==DT),None)
            if not sid:
                st,jc=call('POST','/v1/appScreenshotSets',{'data':{'type':'appScreenshotSets','attributes':{'screenshotDisplayType':DT},'relationships':{'appStoreVersionLocalization':{'data':{'type':'appStoreVersionLocalizations','id':lid}}}}})
                if not ok(st,jc,f'série {P} {loc} {DT}'):continue
                sid=jc['data']['id']
            st,je=call('GET',f'/v1/appScreenshotSets/{sid}/appScreenshots')
            for x in je.get('data',[]):call('DELETE',f'/v1/appScreenshots/{x["id"]}')
            for f in files:
                b=open(f,'rb').read()
                st,jc=call('POST','/v1/appScreenshots',{'data':{'type':'appScreenshots','attributes':{'fileName':os.path.basename(f),'fileSize':len(b)},'relationships':{'appScreenshotSet':{'data':{'type':'appScreenshotSets','id':sid}}}}})
                if not ok(st,jc,'réserve '+f):continue
                sh=jc['data']['id']
                for op in jc['data']['attributes']['uploadOperations']:
                    r=urllib.request.Request(op['url'],method=op['method'],data=b[op['offset']:op['offset']+op['length']],headers={h['name']:h['value'] for h in op['requestHeaders']})
                    urllib.request.urlopen(r).read()
                ok(*call('PATCH',f'/v1/appScreenshots/{sh}',{'data':{'type':'appScreenshots','id':sh,'attributes':{'uploaded':True,'sourceFileChecksum':hashlib.md5(b).hexdigest()}}}),'capture '+f)

if on('price'):
    allp=[];path=f'/v1/apps/{aid}/appPricePoints?filter[territory]=CAN&limit=200'
    while path:
        st,j=call('GET',path)
        if st>=300:break
        allp+=j.get('data',[]);nx=j.get('links',{}).get('next');path=nx.replace(API,'') if nx else None
    j={'data':allp}
    pts=[p for p in allp if p['attributes']['customerPrice'] in (PRICE,PRICE.rstrip('0'))]
    if not pts:log('ERREUR prix introuvable',PRICE,st,errs(j) if st>=300 else sorted({p['attributes']['customerPrice'] for p in j['data']})[:40])
    else:
        pp=pts[0]['id']
        ok(*call('POST','/v1/appPriceSchedules',{'data':{'type':'appPriceSchedules','relationships':{'app':{'data':{'type':'apps','id':aid}},'baseTerritory':{'data':{'type':'territories','id':'CAN'}},'manualPrices':{'data':[{'type':'appPrices','id':'${p0}'}]}}},
            'included':[{'type':'appPrices','id':'${p0}','attributes':{'startDate':None},'relationships':{'appPricePoint':{'data':{'type':'appPricePoints','id':pp}}}}]}),'prix '+PRICE+' CAD')

if on('dispo'):
    st,j=call('GET','/v1/territories?limit=200');ter=[t['id'] for t in j['data']]
    body={'data':{'type':'appAvailabilities','attributes':{'availableInNewTerritories':True},'relationships':{'app':{'data':{'type':'apps','id':aid}},
        'territoryAvailabilities':{'data':[{'type':'territoryAvailabilities','id':'${'+t+'}'} for t in ter]}}},
        'included':[{'type':'territoryAvailabilities','id':'${'+t+'}','attributes':{'available':True},'relationships':{'territory':{'data':{'type':'territories','id':t}}}} for t in ter]}
    ok(*call('POST','/v2/appAvailabilities',body),f'disponibilité {len(ter)} pays')

if 'version' in ST and os.environ.get('NEWVER'):
    st,j=call('GET',f'/v1/apps/{aid}/appStoreVersions?filter[appStoreState]=PREPARE_FOR_SUBMISSION,DEVELOPER_REJECTED,REJECTED,METADATA_REJECTED')
    for v in j['data']:
        ok(*call('PATCH',f'/v1/appStoreVersions/{v["id"]}',{'data':{'type':'appStoreVersions','id':v['id'],'attributes':{'versionString':os.environ['NEWVER']}}}),v['attributes']['platform']+' version '+os.environ['NEWVER'])

if on('build'):
    st,j=call('GET',f'/v1/apps/{aid}/appStoreVersions?filter[appStoreState]=PREPARE_FOR_SUBMISSION,DEVELOPER_REJECTED,REJECTED,METADATA_REJECTED')
    for v in j['data']:
        P=v['attributes']['platform'];VS=v['attributes']['versionString']
        st,jb=call('GET',f'/v1/builds?filter[app]={aid}&filter[preReleaseVersion.platform]={P}&filter[preReleaseVersion.version]={VS}&filter[processingState]=VALID&sort=-uploadedDate&limit=1')
        if not jb.get('data'):log('ERREUR aucune build',P,VS);continue
        bid=jb['data'][0]['id'];bn=jb['data'][0]['attributes']['version']
        call('PATCH',f'/v1/builds/{bid}',{'data':{'type':'builds','id':bid,'attributes':{'usesNonExemptEncryption':False}}})
        ok(*call('PATCH',f'/v1/appStoreVersions/{v["id"]}/relationships/build',{'data':{'type':'builds','id':bid}}),f'{P} {VS} : build {bn} rattachée')

os.makedirs('out',exist_ok=True);json.dump(LOG,open('out/asc_fill.json','w'),indent=1,ensure_ascii=False)

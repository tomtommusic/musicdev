"""Lecture seule : état du dossier App Store de MusiDev (fiche, versions, captures, âge, prix). Écrit out/asc_status.json."""
import os,json,sys
sys.path.insert(0,os.path.dirname(__file__))
os.environ.setdefault('FEEDBACK_EMAIL','')
import importlib.util
src=open(os.path.join(os.path.dirname(__file__),'asc_external.py')).read()
head=src.split("st,j=call('GET',f'/v1/apps?filter[bundleId]")[0]
exec(head)
R={}
def g(p):
    st,j=call('GET',p);return j if st<300 else {'_err':st,'_msg':errs(j)}
a=g(f'/v1/apps?filter[bundleId]={BUNDLE}');app=a['data'][0];aid=app['id'];R['app']=app['attributes']
infos=g(f'/v1/apps/{aid}/appInfos?include=primaryCategory,secondaryCategory,ageRatingDeclaration')
R['appInfos']=[{'id':x['id'],'attr':x['attributes'],'rel':{k:v.get('data') for k,v in x.get('relationships',{}).items() if 'data' in v}} for x in infos.get('data',[])]
R['included']=infos.get('included',[])
for x in infos.get('data',[]):
    R.setdefault('infoLoc',{})[x['id']]=[y['attributes'] for y in g(f'/v1/appInfos/{x["id"]}/appInfoLocalizations').get('data',[])]
    R.setdefault('ageRating',{})[x['id']]=g(f'/v1/appInfos/{x["id"]}/ageRatingDeclaration').get('data',{}).get('attributes')
vs=g(f'/v1/apps/{aid}/appStoreVersions?limit=10')
R['versions']=[]
for v in vs.get('data',[]):
    d={'id':v['id'],'attr':v['attributes'],'loc':[]}
    for l in g(f'/v1/appStoreVersions/{v["id"]}/appStoreVersionLocalizations').get('data',[]):
        sets=g(f'/v1/appStoreVersionLocalizations/{l["id"]}/appScreenshotSets').get('data',[])
        d['loc'].append({'attr':l['attributes'],'sets':[(s['attributes']['screenshotDisplayType'],len(g(f'/v1/appScreenshotSets/{s["id"]}/appScreenshots').get('data',[]))) for s in sets]})
    d['review']=g(f'/v1/appStoreVersions/{v["id"]}/appStoreReviewDetail')
    d['build']=g(f'/v1/appStoreVersions/{v["id"]}/build').get('data')
    R['versions'].append(d)
R['price']=g(f'/v1/apps/{aid}/appPriceSchedule?include=manualPrices')
R['availability']=g(f'/v2/appAvailabilities/{aid}') 
R['builds']=[(b['attributes']['version'],b['attributes'].get('processingState')) for b in g(f'/v1/builds?filter[app]={aid}&sort=-uploadedDate&limit=6').get('data',[])]
os.makedirs('out',exist_ok=True);json.dump(R,open('out/asc_status.json','w'),indent=1,ensure_ascii=False)
print('ok')

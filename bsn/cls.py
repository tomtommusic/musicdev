import sys,json
sys.path.insert(0,sys.argv[1])
from an import *
from ref import REF
ORDER=[2,4,3,5,1,0,10,9,11,6,7,8,14,13,12,15,16,17,20,18,22,23,19,21,27,29,28,25,24,26,33,32,30,31,34,36,35,39,38,37,40,41,42]
names=['A#1','B1','C2','C#2','D2','D#2','E2','F2','F#2','G2','G#2','A2','A#2','B2','C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3',
'A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5']
res={}
for nm,ix in zip(names,ORDER):
    a=load('%s/i-%03d.png'%(sys.argv[2],ix)); ds=diagrams(a); outs=[]
    for k,d in enumerate(ds):
        cs,_=comps(a,d,0,a.shape[1])
        cs=[c for c in cs if c['n']>=150 and min(abs(c['cx']+d['vx']-e['vx']) for e in ds)==abs(c['cx'])]
        st={};unk=[]
        for c in cs:
            best=min(REF,key=lambda r:(REF[r][0]-c['cx'])**2+(REF[r][1]-c['cy'])**2)
            dist=((REF[best][0]-c['cx'])**2+(REF[best][1]-c['cy'])**2)**.5
            if dist>12: unk.append((round(c['cx']),round(c['cy']),c['n'])); continue
            s='flick' if c['red']>.5 else 'on' if c['blue']>.5 else 'off'
            st[best]=s
        keys=[]
        for r,s in st.items():
            if r in('L1t','L1b'): continue
            if s=='on': keys.append(r)
            if s=='flick': keys.append('~'+r)
        if 'L1b' in st:
            if st['L1b']=='on' and st.get('L1t')=='on': keys.append('L1')
            elif st['L1b']=='on': keys.append('L1h')
        shown=[r for r in ('hE','hEb','Cst') if r in st]
        outs.append(dict(keys=keys,shown=shown,unk=unk))
    res[nm]=outs
    print(nm,ix,' | '.join(' '.join(sorted(o['keys']))+(' shown:'+','.join(o['shown']) if o['shown'] else '')+(' UNK:'+str(o['unk']) if o['unk'] else '') for o in outs))
json.dump(res,open(sys.argv[1]+'/wells.json','w'),indent=1)

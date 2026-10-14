import sys,cv2,numpy as np
D=sys.argv[1]; sys.path.insert(0,D)
from an import *; from ref import REF
SC=0.2
def f(v): return ('%.1f'%v).rstrip('0').rstrip('.')
def trace(img,which,keys):
    a=load(img); d=diagrams(a)[which]
    cs,lab=comps(a,d,0,a.shape[1]); out={}
    for k in keys:
        c=min(cs,key=lambda c:(REF[k][0]-c['cx'])**2+(REF[k][1]-c['cy'])**2)
        m=(lab==c['lab']).astype(np.uint8)
        m=cv2.dilate(m,np.ones((5,5),np.uint8))
        cn,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
        cn=max(cn,key=len); p=cv2.approxPolyDP(cn,1.1,True)[:,0,:]
        pts=[((x-d['vx'])*SC,(y-d['hy'])*SC) for x,y in p]
        out[k]='M'+' L'.join(f(x)+','+f(y) for x,y in pts)+' Z'
        out[k+'_c']=[float(c['cx']*SC),float(c['cy']*SC)]+[float(v) for v in c['bb']]
    return out
A=trace(D+'/../wells/im/i-002.png',0,['tHD','tBb','tB','tHC','tC','tD','tA','tCs','lEb','lCs','W','rBb','rFs','rAb','pF','pFs','pAb','R3'])
B=trace(D+'/../wells/im/i-042.png',0,['hE','hEb','Cst'])
A.update(B)
import json; json.dump(A,open(D+'/shapes.json','w'),indent=0)
for k,v in A.items():
    if not k.endswith('_c'): print(k,len(v),v[:80])

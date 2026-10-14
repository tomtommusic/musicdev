import numpy as np, sys
from PIL import Image
from scipy import ndimage as nd
def load(p):
    return np.asarray(Image.open(p).convert('RGB')).astype(int)
def diagrams(a):
    dark=a.max(2)<110
    H,W=dark.shape
    col=dark.sum(0)
    # vertical lines: columns with long dark runs
    cand=[x for x in range(W) if col[x]>0.55*H]
    groups=[]
    for x in cand:
        if groups and x-groups[-1][-1]<=3: groups[-1].append(x)
        else: groups.append([x])
    out=[]
    for g in groups:
        vx=sum(g)/len(g)
        # horizontal line: row with longest dark run crossing vx
        best=None
        for y in range(H):
            if not dark[y,int(vx)]: continue
            l=int(vx);r=int(vx)
            while l>0 and dark[y,l-1]: l-=1
            while r<W-1 and dark[y,r+1]: r+=1
            if best is None or r-l>best[0]: best=(r-l,y,l,r)
        out.append(dict(vx=vx,hy=best[1],hl=best[2],hr=best[3]))
    return out
def comps(a,d,x0,x1):
    dark=a.max(2)<110
    sub=~dark.copy(); sub[:, :max(0,int(x0))]=False; sub[:, int(x1):]=False
    lab,n=nd.label(sub)
    res=[]
    for i in range(1,n+1):
        m=lab==i; ys,xs=np.nonzero(m); N=len(xs)
        if N<20 or N>20000: continue
        px=a[m]
        blue=((px[:,2]>180)&(px[:,0]<90)).mean(); red=((px[:,0]>180)&(px[:,2]<90)).mean()
        res.append(dict(cx=xs.mean()-d['vx'],cy=ys.mean()-d['hy'],n=N,blue=blue,red=red,bb=(xs.min()-d['vx'],ys.min()-d['hy'],xs.max()-d['vx'],ys.max()-d['hy']),lab=i))
    return res,lab
if __name__=='__main__':
    a=load(sys.argv[1]); ds=diagrams(a); print(ds)
    for k,d in enumerate(ds):
        x0=0 if k==0 else (ds[k-1]['vx']+d['vx'])/2+40
        x1=a.shape[1] if k==len(ds)-1 else (d['vx']+ds[k+1]['vx'])/2+40
        for c in comps(a,d,x0,x1)[0]: print(k,round(c['cx']),round(c['cy']),c['n'],round(c['blue'],2),round(c['red'],2),[round(v) for v in c['bb']])

import math,re
P='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/dg_body.js'
f=lambda v:('%.1f'%v).rstrip('0').rstrip('.')
def poly(pts):return 'M'+' L'.join(f(x)+','+f(y) for x,y in pts)+' Z'
def rrect(cx,cy,w,h,r,rot=0,n=5):
    pts=[]
    for (sx,sy,a0) in [(1,-1,-90),(1,1,0),(-1,1,90),(-1,-1,180)]:
        ccx,ccy=cx+sx*(w/2-r),cy+sy*(h/2-r)
        for k in range(n+1):
            a=math.radians(a0+90*k/n);pts.append((ccx+r*math.cos(a),ccy+r*math.sin(a)))
    if rot:
        t=math.radians(rot);pts=[(cx+(x-cx)*math.cos(t)-(y-cy)*math.sin(t),cy+(x-cx)*math.sin(t)+(y-cy)*math.cos(t)) for x,y in pts]
    return poly(pts)
def taper(cx,top,bot,wt,wb,tilt=0):
    """clé effilée : bout rond de largeur wt en haut, wb en bas"""
    pts=[];rt,rb=wt/2,wb/2
    for k in range(9):a=math.radians(180+180*k/8);pts.append((cx+rt*math.cos(a),top+rt+rt*math.sin(a)))
    for k in range(9):a=math.radians(0+180*k/8);pts.append((cx+rb*math.cos(a),bot-rb+rb*math.sin(a)))
    if tilt:pts=[(x+tilt*(y-(top+bot)/2)/(bot-top),y) for x,y in pts]
    return poly(pts)
def band(cx,cy,ro,ri,a0,a1,sy=1):
    """croissant : bande entre deux arcs (angles en degrés)"""
    o=[(cx+ro*math.cos(math.radians(a0+(a1-a0)*k/12)),cy+sy*ro*math.sin(math.radians(a0+(a1-a0)*k/12))) for k in range(13)]
    i=[(cx+ri*math.cos(math.radians(a1-(a1-a0)*k/12)),cy+sy*ri*math.sin(math.radians(a1-(a1-a0)*k/12))) for k in range(13)]
    return poly(o+i)
def half(cx,y,rx,ry,up):
    pts=[(cx+rx*math.cos(math.radians(180+180*k/12 if up else 180-180*k/12)),y+ry*math.sin(math.radians(180+180*k/12 if up else 180-180*k/12))) for k in range(13)]
    return poly(pts)
def dshape(xr,y0,y1,rx):
    cy=(y0+y1)/2;ry=(y1-y0)/2
    return poly([(xr-rx*math.sin(math.radians(180*k/16)),cy-ry*math.cos(math.radians(180*k/16))) for k in range(17)])
def hook(x,y0,y1,w,footw):
    """clé en crochet : tige verticale qui se termine par un pied arrondi vers la gauche"""
    pts=[(x,y0),(x+w,y0),(x+w,y1-2)]
    for k in range(9):a=math.radians(0+180*k/8);pts.append((x+w-footw/2+footw/2*math.cos(a)-(w/2), y1-2+2*math.sin(a)))
    pts+= [(x+w-footw,y1-3.2),(x,y1-3.2)]
    return poly(pts)
K={}
K['tC']=dshape(-33.8,-37.8,-27.0,8.6)
K['tB']=taper(-30.8,-43.4,-27.8,2.0,4.8,tilt=1.6)
K['tBb']=taper(-25.0,-43.8,-28.2,2.0,4.8,tilt=1.6)
K['tHD']=taper(-16.2,-45.6,-33.8,1.8,5.8,tilt=-1.2)
K['tHC']=hook(-11.8,-38.2,-26.2,2.4,6.4)
K['tD']=taper(-36.7,-24.2,-3.0,6.4,2.2)
K['tA']=rrect(-10.5,-20.7,15.2,4.8,2.4)
K['tCs']=hook(-12.2,-15.4,-3.4,2.6,8.6)
K['rBb']=band(-16.6,13.6,9.6,7.4,198,320,sy=.95)
K['rFs']=band(-12.0,30.0,6.6,4.6,200,315)
K['rAb']=band(-7.8,35.0,6.6,4.6,200,315)
K['lEb']=half(24.5,-10.8,5.4,4.0,True)
K['lCs']=half(24.5,-7.8,5.4,4.0,False)
K['Cst']=band(19.6,7.2,3.8,2.2,-200,60)
K['pF']=rrect(21.0,51.4,6.4,6.4,1.6,rot=35)
K['pFs']=rrect(29.0,57.2,5.8,8.4,2.2,rot=-35)
K['pAb']=rrect(18.0,60.2,9.0,6.4,1.8,rot=30)
s=open(P).read()
i=s.index("  bsn:{vb:");j=s.index("    labels:[]},",i)
blk=s[i:j]
for k,d in K.items():
    blk,n=re.subn(r"\['%s','d','[^']*'\]"%k,"['%s','d','%s']"%(k,d),blk);assert n==1,k
# ellipses à moi : chuchoteur, mi aigu, mi♭ aigu, R3
for k,e in [('W',"['W','e',-18,-4.9,4,2.5]"),('hE',"['hE','e',17.6,-51.6,5.8,1.3,-15]"),('hEb',"['hEb','e',17.6,-35.6,5.8,1.3,-15]"),('R3',"['R3','e',10.6,42.2,7,3.2]")]:
    blk,n=re.subn(r"\['%s','d','[^']*'\]"%k,e,blk);assert n==1,k
blk=blk.replace("/* disposition du tableau de David Wells (schémas de Bret Pimentel) : pouces à gauche du trait, doigts à droite,","/* disposition des tableaux de basson (pouces à gauche du trait, doigts à droite), formes de clés dessinées pour MusicDEV ;")
s=s[:i]+blk+s[j:]
open(P,'w').write(s);print('ok')

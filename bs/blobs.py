from PIL import Image
import numpy as np, scipy.ndimage as nd, json
im=np.array(Image.open('/root/.claude/uploads/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/83422f83-image.jpg').convert('RGB')).astype(int)
R,G,B=im[...,0],im[...,1],im[...,2]
purple=(R>70)&(R<170)&(G<70)&(B>80)&(B<190)
pink=(R>180)&(G<90)&(B>180)
green=(G>110)&(R<90)&(B<130)&(G-R>40)
tops=[331,862,1393,1925];X0=96;CW=164.1
out=[]
for ri,t in enumerate(tops):
  for ci in range(10):
    x0=int(X0+ci*CW);y0=t
    for name,mask in (('p',purple),('k',pink),('g',green)):
      sub=mask[y0+120:y0+500,x0+2:x0+162]
      lab,n=nd.label(sub)
      for i in range(1,n+1):
        ys,xs=np.where(lab==i)
        if len(xs)<12: continue
        out.append({'r':ri,'c':ci,'col':name,'x':round(xs.mean()+2,1),'y':round(ys.mean()+120,1),'n':int(len(xs)),'w':int(xs.max()-xs.min()+1),'h':int(ys.max()-ys.min()+1)})
json.dump(out,open('blobs.json','w'))
print(len(out))

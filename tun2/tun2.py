#!/usr/bin/env python3
"""Accordeur : filtre anti-repliement avant le sous-échantillonnage. Sans lui, les harmoniques aiguës d'une corde
« se replient » et font croire à une note une octave plus bas (ex. corde trop tendue affichée « trop bas »)."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
a="function tnDecim(x,f){const z=new Float32Array(Math.floor(x.length/f));for(let i=0;i<z.length;i++){let s=0;for(let j=0;j<f;j++)s+=x[i*f+j];z[i]=s/f;}return z;}"
assert s.count(a)==1
b="""function tnDecim(x,f){
  /* passe-bas de Butterworth d'ordre 4 (deux biquads) à 0,4 × la nouvelle fréquence de Nyquist, puis on garde un échantillon sur f */
  const w=2*Math.PI*(.2/f),cw=Math.cos(w),sw=Math.sin(w),y=Float32Array.from(x);
  for(const Q of[.5412,1.3066]){const al=sw/(2*Q),a0=1+al,b0=(1-cw)/2/a0,b1=(1-cw)/a0,a1=-2*cw/a0,a2=(1-al)/a0;let x1=0,x2=0,y1=0,y2=0;
    for(let i=0;i<y.length;i++){const v=y[i],o=b0*v+b1*x1+b0*x2-a1*y1-a2*y2;x2=x1;x1=v;y2=y1;y1=o;y[i]=o;}}
  const z=new Float32Array(Math.floor(y.length/f));for(let i=0;i<z.length;i++)z[i]=y[i*f];return z;}"""
s=s.replace(a,b)
# vérification d'octave à pleine résolution : la recherche grossière peut trouver 2 ou 3 périodes au lieu d'une
a2="  if(!r.f)return{rms};\n  if(f===1)return{f:r.f,clarity:r.clarity,rms};"
assert s.count(a2)==1
b2='''  if(!r.f)return{rms};
  if(f>1){const per=L=>{const W=Math.min(2400,x.length-L-4);if(W<200)return 9;let best=9;for(let l=L-2;l<=L+2;l++){if(l<2)continue;let d=0,e=0;for(let i=0;i<W;i++){const a=x[i],b=x[i+l];d+=(a-b)*(a-b);e+=a*a+b*b;}if(e>0)best=Math.min(best,d/e);}return best;};
    const T0=sr/r.f,base=per(Math.round(T0));
    for(const k of[3,2]){if(r.f*k>fmax*1.05)continue;const v=per(Math.round(T0/k));if(v<.2&&v<=base+.05){r.f*=k;break;}}}
  if(f===1)return{f:r.f,clarity:r.clarity,rms};'''
s=s.replace(a2,b2)
# mode apprenti : on ne replie à l'octave qu'au-delà de ±10,5 demi-tons (une corde très trop tendue reste « trop haut »)
a3="  if(Math.abs(c)>900)c-=1200*Math.round(c/1200);"
assert s.count(a3)==1
s=s.replace(a3,"  if(Math.abs(c)>1050)c-=1200*Math.round(c/1200);")
# plage de recherche : jusqu'à ~11 demi-tons au-dessus de la corde la plus aiguë (corde beaucoup trop tendue)
a4="Math.max(midiHz(hi)*1.6,midiHz(lo)*4.5)"
assert s.count(a4)==1
s=s.replace(a4,"Math.max(midiHz(hi)*1.9,midiHz(lo)*4.5)")
open(p,'w',encoding='utf-8').write(s)

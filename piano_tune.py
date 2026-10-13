import subprocess,numpy as np,glob,re,json
NM={'C':0,'Db':1,'D':2,'Eb':3,'E':4,'F':5,'Gb':6,'G':7,'Ab':8,'A':9,'Bb':10,'B':11}
res={}
for f in glob.glob('raw/*.wav'):
    mm=re.match(r'raw/([A-G]b?)(\d)',f);m=(int(mm.group(2))+1)*12+NM[mm.group(1)]
    x=np.frombuffer(subprocess.run(['ffmpeg','-v','quiet','-i',f,'-f','f32le','-ac','1','-ar','44100','-'],capture_output=True).stdout,dtype=np.float32)
    on=np.argmax(np.abs(x)>np.abs(x).max()*.05);N=131072
    seg=x[on+4410:on+4410+N];seg=seg*np.hanning(len(seg));sp=np.abs(np.fft.rfft(seg,N));f_=np.fft.rfftfreq(N,1/44100)
    exp=440*2**((m-69)/12);out=[]
    # use partials 1..3 compensate inharmonicity loosely: take fundamental if strong
    for h in ([1] if m>=48 else [1,2]):
        band=(f_>exp*h*.97)&(f_<exp*h*1.03);i=np.where(band)[0][np.argmax(sp[band])]
        a,b,c=np.log(sp[i-1:i+2]+1e-12);d=.5*(a-c)/(a-2*b+c);fp=(i+d)*44100/N/h
        out.append(1200*np.log2(fp/exp))
    res[m]=round(out[0],1)
print(sorted(res.items()))
json.dump(res,open('tune.json','w'))

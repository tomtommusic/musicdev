import subprocess,numpy as np,glob,re,os,json
NM={'C':0,'Db':1,'D':2,'Eb':3,'E':4,'F':5,'Gb':6,'G':7,'Ab':8,'A':9,'Bb':10,'B':11}
SR=44100;os.makedirs('out',exist_ok=True)
def load(f):
    r=subprocess.run(['ffmpeg','-v','quiet','-i',f,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(r,dtype=np.float32).copy()
info={}
for f in glob.glob('raw/*.wav'):
    m=re.match(r'raw/([A-G]b?)(\d)',f);midi=(int(m.group(2))+1)*12+NM[m.group(1)]
    x=load(f);a=np.abs(x);on=max(0,np.argmax(a>a.max()*.05)-int(.004*SR))
    dur=4.0 if midi<33 else 6.0 if midi<=45 else 5.0 if midi<=57 else 4.0 if midi<=69 else 3.0 if midi<=81 else 2.2
    y=x[on:on+int(dur*SR)].copy()
    rms=np.sqrt(np.mean(y[:int(.4*SR)]**2));y*= .12*(1-.45*max(0,(midi-72)/36))/rms
    fl=int(min(1.0,dur*.35)*SR);y[-fl:]*=np.cos(np.linspace(0,np.pi/2,fl))**2
    pk=np.abs(y).max()
    if pk>.95:y*=.95/pk
    tmp='out/t.f32';y.astype(np.float32).tofile(tmp)
    subprocess.run(['ffmpeg','-v','quiet','-y','-f','f32le','-ar',str(SR),'-ac','1','-i',tmp,'-c:a','libmp3lame','-q:a','6',f'out/{midi}.mp3'],check=True)
    info[midi]=round(float(np.abs(y).max()),3)
os.remove('out/t.f32')
print(sorted(info.items()))

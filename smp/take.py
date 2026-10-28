import os
exec(open('ex.py').read())
import wave
def find(bank,prog,name):
    for n,pg,iz in zones(bank,prog):
        if nm(shdr[iz[53]][0])==name: return iz[53]
    raise Exception(name)
# id, bank, prog, sample, max seconds, fade seconds, out rate
DR=[('kick',128,0,'Std Kick',.45,.08),('snare',128,0,'Std Snr 1',.5,.12),('xs',128,0,'Rim Tap',.35,.15),
    ('hh',128,0,'Hi-Hat Closed',.35,.15),('hhp',128,0,'Hi-Hat Foot',.35,.15),('hho',128,0,'Hi-Hat Half-Open',1.3,.5),
    ('ride',128,0,'Ride1',2.0,.8),('bell',128,0,'BellRide',1.6,.7),('crash',128,0,'Crsh 1',2.8,1.2),
    ('ftom',128,0,'Flr Studio',.8,.3),('mtom',128,0,'Md Studio(L)',.75,.3),('htom',128,0,'Hi Studio',.7,.3),
    ('kickj',128,32,'Std Kick 7',.45,.1),('brush',128,40,'Brush Snr 1',.4,.12)]
BS=[('eb%d'%r,0,33,n,2.2,.5) for r,n in [(28,'Finger Bass EO'),(34,'Finger Bass A1'),(39,'Finger Bass D1'),(43,'Finger Bass GO'),(48,'Finger Bass G5')]]+\
   [('ab%d'%r,0,32,n,1.8,.5) for r,n in [(28,'Acoustic Bass E2'),(36,'Acoustic Bass C3'),(41,'Acoustic Bass F3'),(46,'Acoustic Bass A#3')]]
import subprocess
tot=0
for id,bank,prog,name,mx,fd in DR+BS:
    sid=find(bank,prog,name);x,rate,root,corr,s=decode(sid);x=x.astype(np.float64)
    # skip leading silence
    th=np.abs(x).max()*.02;i0=max(0,int(np.argmax(np.abs(x)>th))-int(rate*.0005));x=x[i0:]
    n=min(len(x),int(mx*rate));x=x[:n].copy();f=int(fd*rate);f=min(f,n)
    x[n-f:]*=np.cos(np.linspace(0,np.pi/2,f))**2
    x=x/np.abs(x).max()*.95
    wav='out/%s.wav'%id
    with wave.open(wav,'wb') as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes((x*32767).astype('<i2').tobytes())
    br='96k' if bank==128 else '80k'
    subprocess.run(['ffmpeg','-v','quiet','-y','-i',wav,'-codec:a','libmp3lame','-b:a',br,'out/%s.mp3'%id])
    sz=os.path.getsize('out/%s.mp3'%id);tot+=sz;print(id,name,rate,'%.2fs'%(n/rate),sz,'root',root)
print('total',tot)

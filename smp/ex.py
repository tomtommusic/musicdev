import sys,struct,subprocess,numpy as np
ARGS=sys.argv[1:];sys.argv=[0,"/home/claude/ms/share/sound/MS Basic.sf3"]
exec(open('sf.py').read().split("if __name__")[0])
o_smpl=None
for cid,o,sz in chunks(b,12,len(b)):
    if cid==b'LIST' and b[o:o+4]==b'sdta':
        for c2,o2,s2 in chunks(b,o+4,o+sz):
            if c2==b'smpl': o_smpl=(o2,s2)
def find_preset(bank,prog):
    for i,p in enumerate(phdr[:-1]):
        if p[2]==bank and p[1]==prog: return i
def zones(bank,prog):
    pi=find_preset(bank,prog);res=[]
    for pb in range(phdr[pi][3],phdr[pi+1][3]):
        pg=gens([(x[0],x[1]) for x in pgen],pbag[pb][0],pbag[pb+1][0])
        if 41 not in pg: continue
        ii=pg[41]
        for iz in inst_zones(ii):
            if 53 not in iz: continue
            res.append((nm(inst[ii][0]),pg,iz))
    return res
def kr(v): v&=0xffff; return v&255,v>>8
cache={}
def decode(sid):
    if sid in cache: return cache[sid]
    s=shdr[sid];o=o_smpl[0]
    data=b[o+s[1]:o+s[2]]
    p=subprocess.run(['ffmpeg','-v','quiet','-i','-','-f','f32le','-ac','1','-'],input=data,capture_output=True)
    x=np.frombuffer(p.stdout,dtype=np.float32);cache[sid]=(x,s[5],s[6],s[7],s)
    return cache[sid]

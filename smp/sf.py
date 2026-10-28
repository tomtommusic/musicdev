import struct,sys
def chunks(b,o,e):
    while o<e:
        cid=b[o:o+4];sz=struct.unpack('<I',b[o+4:o+8])[0];yield cid,o+8,sz;o+=8+sz+(sz&1)
def load(path):
    b=open(path,'rb').read();assert b[:4]==b'RIFF'
    out={}
    for cid,o,sz in chunks(b,12,len(b)):
        if cid==b'LIST':
            typ=b[o:o+4]
            for c2,o2,s2 in chunks(b,o+4,o+sz): out[c2.decode()]=(o2,s2)
    return b,out
def recs(b,loc,fmt,n):
    o,sz=loc;size=struct.calcsize(fmt);return [struct.unpack(fmt,b[o+i*size:o+(i+1)*size]) for i in range(sz//size)]
b,C=load(sys.argv[1])
phdr=recs(b,C['phdr'],'<20sHHHIII',0)
pbag=recs(b,C['pbag'],'<HH',0);pgen=recs(b,C['pgen'],'<HH',0)
inst=recs(b,C['inst'],'<20sH',0);ibag=recs(b,C['ibag'],'<HH',0);igen=recs(b,C['igen'],'<Hh',0)
shdr=recs(b,C['shdr'],'<20sIIIIIBbHH',0)
nm=lambda s:s.split(b'\0')[0].decode('latin1')
def gens(lst,a,z):
    d={}
    for g in lst[a:z]: d[g[0]]=g[1]
    return d
def inst_zones(i):
    res=[]
    for bi in range(inst[i][1],inst[i+1][1]):
        g=gens([(x[0],x[1]) for x in igen],ibag[bi][0],ibag[bi+1][0]);res.append(g)
    return res
if __name__=='__main__':
    for i,p in enumerate(phdr[:-1]):
        print(p[2],p[1],nm(p[0]))

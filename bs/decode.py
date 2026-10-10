import json
b=json.load(open('blobs_n.json'))
K={'tD':(19,188),'tB':(29,184),'tBb':(39,184),'fA':(56,188),'fC':(61,202),'tC':(22,212),'hD':(54,216),'W':(48,228),
   'L1':(114,188),'L2':(113,226),'L3':(114,257),'Zu':(139,269),'Zl':(144,280),
   'tE':(55,329),'tBig':(54,347),'tFs':(62,366),'tAb':(70,378),'R1':(114,339),'R2':(116,380),'Rx':(115,400),'RF':(110,413),
   'bA':(81,421),'bB':(98,434),'bC':(77,437)}
cells={}
for o in b:
    best=min(K,key=lambda k:(K[k][0]-o['x'])**2+(K[k][1]-o['y'])**2);d=((K[best][0]-o['x'])**2+(K[best][1]-o['y'])**2)**.5
    if d>9: print('far',o,best,d)
    key=best
    if best=='L1' and o['n']<35: key='L1h'
    c=cells.setdefault((o['r'],o['c']),{'p':set(),'g':set(),'k':set()})
    c[o['col']].add(key)
rows=[['A#1','B1','C2','C#2','D2','D#2','E2','F2','F#2','*'],['G2','G#2','*','A2','A#2','*','B2','C3','C#3','D3'],['D#3','*','*','E3','F3','F#3','*','G3','G#3','*'],['A3','*','A#3','*','*','*','B3','*','C4','*']]
out=[]
for r,row in enumerate(rows):
    for c,n in enumerate(row):
        x=cells.get((r,c),{'p':set(),'g':set(),'k':set()})
        out.append({'note':n,'r':r,'c':c,'keys':sorted(x['p']|x['g']),'flick':sorted(x['g']),'adlib':sorted(x['k'])})
for o in out: print(o['note'],o['keys'],'flick',o['flick'],'adlib',o['adlib'])
json.dump(out,open('cells.json','w'))

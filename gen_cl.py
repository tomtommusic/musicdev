import json
W1="https://www.wfg.woodwind.org/clarinet/cl_bas_1.html"
W2="https://www.wfg.woodwind.org/clarinet/cl_bas_2.html"
WF="https://www.wfg.woodwind.org/clarinet/cl_fing.html"
I1="https://theinstrumentalist.com/?p=3710"
IP="https://theinstrumentalist.com/?p=6329"
WB="https://en.wikibooks.org/wiki/Clarinet/Clarinet_Basics/Fingering/Crossing_the_'Break'"
TC="https://www.theclarinet.net/clarinet-fingering-chart.html"
BP="https://bretpimentel.com/commonly-fudged-woodwind-fingerings"
LH=["T","L1","L2","L3"]; RH=["R1","R2","R3"]; G=LH+RH
names=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
def n(m): return f"{names[m%12]}{m//12-1}"
D={}
def add(m,keys,alt=None,comment=None,src=None,conf="high"):
    e={"note":n(m),"midi":m,"keys":keys}
    if alt: e["alt"]=alt
    if comment: e["comment"]=comment
    e["sources"]=src or [W1]
    e["confidence"]=conf
    D[m]=e
add(52,G+["lE"],[{"keys":G+["rE"],"label":"Mi auriculaire droit"}],
    "Règle courante : Mi grave à gauche, Fa grave à droite.",[W1,IP,WB])
add(53,G+["rF"],[{"keys":G+["lF"],"label":"Fa auriculaire gauche"}],
    "Doigté gauche utile pour enchaîner Fa–Sol#.",[W1,TC,WB])
add(54,G+["lFs"],None,"Clé Fa# seulement à gauche sur la clarinette Boehm standard (17 clés).",[W1,WF])
add(55,G,None,None,[W1,WB])
add(56,G+["rAb"],None,None,[W1,IP])
add(57,LH+["R1","R2"],None,None,[W1])
add(58,LH+["R1"],None,None,[W1])
add(59,LH+["R2"],None,"Doigté « fourche ». Un doigté chromatique avec la clé-palette Si/Fa# de la main droite existe (non représenté).",[W1,W2],"medium")
add(60,LH,None,None,[W1])
add(61,LH+["CsGs"],None,"Clé Do#/Sol# actionnée par l'auriculaire gauche.",[W1,WF])
add(62,["T","L1","L2"],None,None,[W1])
add(63,["T","L1","L2","S4"],[{"keys":["T","L1","L2","EbBb"],"label":"Clé-palette (sliver)"}],
    "Clé latérale = la plus basse des 4 clés de trille.",[W1,I1,WF])
add(64,["T","L1"],None,None,[W1])
add(65,["T"],None,None,[W1])
add(66,["L1"],[{"keys":["T","S3","S4"],"label":"Fa# chromatique"}],
    "Pouce ouvert. Alternative : pouce + 2 clés latérales du bas (depuis/vers Fa).",[W1,I1])
add(67,[],None,"Sol de gorge : aucune touche (clarinette tenue par le pouce droit).",[W1])
add(68,["Gs"],None,None,[W1,WF])
add(69,["A"],None,None,[W1,WB])
add(70,["Reg","A"],[{"keys":["A","S2"],"label":"Trille La–Sib"}],
    "Pouce ouvert ; on presse la clé de registre et la clé La.",[W1,WB,I1])
add(71,["Reg"]+G+["lE"],[{"keys":["Reg"]+G+["rE"],"label":"Si auriculaire droit"}],
    "Règle courante : Si à gauche, Do à droite. Certaines méthodes débutantes font tenir aussi Do droit (rF).",[W2,IP,BP,WB])
add(72,["Reg"]+G+["rF"],[{"keys":["Reg"]+G+["lF"],"label":"Do auriculaire gauche"}],None,[W2,IP,WB])
add(73,["Reg"]+G+["lFs"],None,None,[W2,WF])
add(74,["Reg"]+G,None,None,[W2])
add(75,["Reg"]+G+["rAb"],None,"Seul le Mib aigu se joue obligatoirement à l'auriculaire droit.",[W2,IP])
add(76,["Reg"]+LH+["R1","R2"],None,None,[W2])
add(77,["Reg"]+LH+["R1"],None,None,[W2])
add(78,["Reg"]+LH+["R2"],None,"Doigté « fourche ». Doigté chromatique avec la clé-palette Si/Fa# droite non représenté.",[W2],"medium")
add(79,["Reg"]+LH,None,None,[W2])
add(80,["Reg"]+LH+["CsGs"],None,"Clé Do#/Sol# actionnée par l'auriculaire gauche.",[W2,WF])
add(81,["Reg","T","L1","L2"],None,None,[W2])
add(82,["Reg","T","L1","L2","S4"],[{"keys":["Reg","T","L1","L2","EbBb"],"label":"Clé-palette (sliver)"}],
    "Clé latérale = la plus basse des 4 clés de trille.",[W2,WF])
add(83,["Reg","T","L1"],None,None,[W2])
add(84,["Reg","T"],None,None,[W2])
notes=[D[m] for m in range(52,85)]
assert len(notes)==33
json.dump({"instrument":"clarinet_bb","pitch":"written","notes":notes},
  open("/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/clarinet.json","w"),ensure_ascii=False,indent=1)
print("ok", notes[0]["note"], notes[-1]["note"])

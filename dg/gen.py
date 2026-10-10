import json
W1="https://www.wfg.woodwind.org/sax/sax_bas_1.html"
W2="https://www.wfg.woodwind.org/sax/sax_bas_2.html"
W4="https://www.wfg.woodwind.org/sax/sax_alt_4.html"
LEE="https://www.lee.k12.al.us/cms/lib/AL02210054/Centricity/Domain/305/fingering.chart.saxophone.basic.pdf"
LS="https://learnsaxophone.com/how-to-play-b-flat-and-a-sharp-on-alto-saxophone/"
SG="https://www.saxgourmet.com/?p=177"
SS="https://saxstation.com/saxophone-high-note-fingerings-f-to-eb.htm"
L=["L1","L2","L3"]; R=["R1","R2","R3"]
names=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
def n(m): return names[m%12]+str(m//12-1)
low={
58:(L+["LBb"]+R+["RC"],None,"Si♭ grave. RC (Do grave) indiqué par les tableaux; sur la plupart des saxos modernes, il se ferme déjà mécaniquement.",[W1,LEE,LS],"high"),
59:(L+["LB"]+R+["RC"],None,"Si grave. RC indiqué par les tableaux; souvent fermé mécaniquement.",[W1,LEE],"high"),
60:(L+R+["RC"],None,None,[W1,LEE],"high"),
61:(L+["LCs"]+R+["RC"],None,"Do♯ grave. WFG ajoute RC; plusieurs méthodes l'omettent (facultatif).",[W1,LEE],"medium"),
62:(L+R,None,None,[W1,LEE],"high"),
63:(L+R+["REb"],None,None,[W1,LEE],"high"),
64:(L+["R1","R2"],None,None,[W1,LEE],"high"),
65:(L+["R1"],None,None,[W1,LEE],"high"),
66:(L+["R2"],None,"Doigté de base (majeur droit). Variante chromatique avec la clé de Fa♯ auxiliaire (R1 + clé latérale) non représentée.",[W1,LEE],"high"),
67:(L,None,None,[W1,LEE],"high"),
68:(L+["Gs"],None,None,[W1,LEE],"high"),
69:(["L1","L2"],None,None,[W1,LEE],"high"),
70:(["L1","Bis"],[{"keys":["L1","L2","SBb"],"label":"Si♭ de côté"}],"Si♭ « bis » : idéal sans Si naturel à proximité. Aussi : « 1 et 1 » (L1 + R1) avec Fa. WFG classe le Si♭ de côté comme doigté de base.",[W1,LEE,LS],"medium"),
71:(["L1"],None,None,[W1,LEE],"high"),
72:(["L2"],[{"keys":["L1","SC"],"label":"Do de côté"}],"Do de côté : utile en passage chromatique Si–Do.",[W1,LEE],"high"),
73:([],None,"Aucune clé enfoncée.",[W1,LEE],"high"),
}
notes=[]
for m in range(58,79):
    if m in low:
        k,a,c,s,conf=low[m]
    else:
        k,a,c,s,conf=low[m-12]; k=["Oct"]+k
        if a: a=[{"keys":["Oct"]+x["keys"],"label":x["label"]} for x in a]
        s=[W2,LEE] if m<=78 else s
        c={74:None,75:None,82:None}.get(m,c)
        if m==82: s=[W2,LS]
        if m==78: c=None; a=None
        if m==85: c="Aucune clé sauf l'octave."
    notes.append((m,k,a,c,s,conf))
# fix octave-2 entries after 78 handled below
notes=[x for x in notes if x[0]<=78]
# 2nd octave 79..85 from 67..73
for m in range(79,86):
    k,a,c,s,conf=low[m-12]; k=["Oct"]+k
    if a: a=[{"keys":["Oct"]+x["keys"],"label":x["label"]} for x in a]
    if m==85: c="Seulement la clé d'octave."
    elif m==78+0: pass
    elif m not in (82,84): c=None
    src=[W2,LS] if m==82 else [W2,LEE] if m<=78 else [W2]
    notes.append((m,k,a,c,src,conf))
fix={78:None}
top={
86:(["Oct","PD"],None,"Clé de paume Ré.",[W2],"high"),
87:(["Oct","PD","PEb"],None,None,[W2],"high"),
88:(["Oct","PD","PEb","SE"],None,"SE = clé latérale Mi (main droite, côté).",[W2],"high"),
89:(["Oct","PD","PEb","PF","SE"],[{"keys":["Oct","FF","L2"],"label":"Fa avant (front F)"}],"Fa avant : index gauche sur la clé Fa avant, majeur sur L2.",[W2,SS],"high"),
90:(["Oct","PD","PEb","PF","SE","SFs"],None,"Clé de Fa♯ aigu (main droite).",[W4,SG],"high"),
}
for m,v in top.items(): notes.append((m,)+v)
out=[]
for m,k,a,c,s,conf in sorted(notes):
    if m==82: c="Si♭ « bis » ; aussi « 1 et 1 » (L1 + R1). WFG classe le Si♭ de côté comme doigté de base."
    if m==84: c="Do de côté : utile en passage chromatique Si–Do."
    if m==78: c="Doigté de base (majeur droit)."; s=[W2,LEE]
    e={"note":n(m),"midi":m,"keys":k}
    if a: e["alt"]=a
    if c: e["comment"]=c
    e["sources"]=s; e["confidence"]=conf
    out.append(e)
assert len(out)==33 and [e["midi"] for e in out]==list(range(58,91))
json.dump({"instrument":"alto_sax","pitch":"written","notes":out},open("altosax.json","w"),ensure_ascii=False,indent=1)
for e in out: print(e["note"],e["keys"],e.get("alt",""),e["confidence"],e["sources"][0][-15:])

import json
W1="https://www.wfg.woodwind.org/flute/fl_bas_1.html"
W2="https://www.wfg.woodwind.org/flute/fl_bas_2.html"
W3="https://www.wfg.woodwind.org/flute/fl_bas_3.html"
WA3="https://www.wfg.woodwind.org/flute/fl_alt_3.html"
LEE="https://www.lee.k12.al.us/cms/lib/AL02210054/Centricity/Domain/305/fingering.chart.flute.piccolo.basic.pdf"
CLUFF="https://jennifercluff.blogspot.com/2016/02/high-b-and-how-to-get-it-to-speak.html"
PIM="https://bretpimentel.com/making-sense-of-third-octave-flute-fingerings/"
L=["thB","L1","L2","L3"]; R=["R1","R2","R3"]
names=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
def lower(oct_src):
    return {
    "E":(L+["R1","R2","Ds"],None,None),
    "F":(L+["R1","Ds"],None,None),
    "F#":(L+["R3","Ds"],None,"Le 3e doigt droit (annulaire), pas l'index."),
    "G":(L+["Ds"],None,None),
    "G#":(L+["Gs","Ds"],None,None),
    "A":(["thB","L1","L2","Ds"],None,None),
    "A#":(["thB","thBb","L1","Ds"],[{"keys":["thB","L1","R1","Ds"],"label":"Si♭ « 1 et 1 » (index droit)"}],"Si♭ du pouce : à éviter si un si naturel suit. « 1 et 1 » : pouce sur la clé de si seulement."),
    "B":(["thB","L1","Ds"],None,None),
    }
data=[]
def add(n,o,keys,alt=None,comment=None,src=None,conf="high"):
    midi=12*(o+1)+names.index(n)
    e={"note":f"{n}{o}","midi":midi,"keys":keys}
    if alt: e["alt"]=alt
    if comment: e["comment"]=comment
    e["sources"]=src; e["confidence"]=conf
    data.append(e)
s1=[W1,LEE]; s2=[W2,LEE]; s3=[W3,LEE]
add("C",4,L+R+["C"],comment="Auriculaire droit sur la clé (rouleau) de do grave.",src=s1)
add("C#",4,L+R+["Cs"],comment="Auriculaire droit sur la clé de do♯.",src=s1)
add("D",4,L+R,comment="Aucune clé d'auriculaire droit.",src=s1)
add("D#",4,L+R+["Ds"],src=s1)
for n,(k,a,c) in lower(1).items(): add(n,4,k,a,c,s1)
add("C",5,["L1","Ds"],comment="Pas de pouce.",src=s1)
add("C#",5,["Ds"],comment="Tout ouvert sauf la clé de mi♭ (auriculaire droit).",src=s1)
add("D",5,["thB","L2","L3"]+R,comment="Comme ré grave, mais index gauche levé et sans auriculaire.",src=s2)
add("D#",5,["thB","L2","L3"]+R+["Ds"],comment="Index gauche levé.",src=s2)
for n,(k,a,c) in lower(2).items():
    add(n,5,k,a,("Même doigté qu'à l'octave inférieure. "+(c or "")).strip(),s2)
add("C",6,["L1","Ds"],comment="Même doigté que do5.",src=s2)
add("C#",6,["Ds"],comment="Même doigté que do♯5.",src=s2)
add("D",6,["thB","L2","L3","Ds"],comment="Comme ré médium, mais main droite levée et auriculaire sur mi♭.",src=s3)
add("D#",6,L+["Gs"]+R+["Ds"],comment="Tous les doigts + clé de sol♯ + mi♭.",src=s3)
add("E",6,["thB","L1","L2","R1","R2","Ds"],src=s3)
add("F",6,["thB","L1","L3","R1","Ds"],src=s3)
add("F#",6,["thB","L1","L3","R3","Ds"],comment="Annulaire droit (pas l'index).",src=s3)
add("G",6,["L1","L2","L3","Ds"],comment="Pas de pouce.",src=s3)
add("G#",6,["L2","L3","Gs","Ds"],comment="Pas de pouce ni d'index gauche.",src=s3)
add("A",6,["thB","L2","R1","Ds"],src=[W3,LEE,PIM])
add("A#",6,["thB","R1","Tr1"],comment="Index droit + 1re clé de trille ; aucune clé d'auriculaire.",src=[W3,LEE,PIM],conf="medium")
add("B",6,["thB","L1","L3","Tr2"],comment="Comme fa♯6 mais 2e clé de trille au lieu de l'annulaire droit ; auriculaire droit facultatif (stabilité).",src=[W3,CLUFF,PIM])
add("C",7,["L1","L2","L3","Gs","R1"],comment="Pas de pouce ni d'auriculaire droit (patte de do). Avec patte de si : auriculaire sur la clé « gizmo ».",src=[W3,WA3,PIM],conf="medium")
assert len(data)==37 and [d["midi"] for d in data]==list(range(60,97))
json.dump({"instrument":"flute","pitch":"concert","notes":data},open("/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/flute.json","w"),ensure_ascii=False,indent=1)
print("ok")

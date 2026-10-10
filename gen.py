import json
names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
def nm(m): return f"{names[m%12]}{m//12-1}"
Y="Yamaha Musical Instrument Guide – trumpet fingering (yamaha.com/en/musical_instrument_guide/trumpet/play/play002.html)"
W="Wikipedia – Trumpet (valves, 1-2 = 3, slides 1 et 3)"
B="BBTrumpet – How to read trumpet notes (bbtrumpet.com)"
T={54:([1,2,3],[], "Note très haute : sortir la coulisse du 3e piston.","high"),
55:([1,3],[], "Haute : sortir la coulisse du 3e piston.","high"),
56:([2,3],[], "","high"),
57:([1,2],[[3]], "","high"),
58:([1],[], "","high"),59:([2],[], "","high"),60:([],[], "","high"),
61:([1,2,3],[], "Très haute : sortir la coulisse du 3e piston.","high"),
62:([1,3],[], "Haute : sortir la coulisse du 3e piston.","high"),
63:([2,3],[], "","high"),
64:([1,2],[[3]], "","high"),
65:([1],[], "","high"),66:([2],[], "","high"),
67:([],[[1,3]], "","high"),
68:([2,3],[], "","high"),
69:([1,2],[[3]], "","high"),
70:([1],[], "","high"),71:([2],[], "","high"),
72:([],[[2,3]], "","high"),
73:([1,2],[[3]], "Tend à être haute : sortir légèrement la coulisse du 1er piston.","high"),
74:([1],[[1,3]], "Tend à être haute : sortir légèrement la coulisse du 1er piston.","high"),
75:([2],[[2,3]], "","high"),
76:([],[[1,2]], "Un peu basse (5e harmonique).","high"),
77:([1],[], "","high"),78:([2],[], "","high"),
79:([],[[1,3]], "","high"),
80:([2,3],[], "","high"),
81:([1,2],[[3]], "","high"),
82:([1],[], "","high"),83:([2],[], "","high"),84:([],[], "","high")}
tr=[]
for m in range(54,85):
    v,a,c,conf=T[m]
    tr.append(dict(note=nm(m),midi=m,valves=v,alt=a,comment=c,sources=[Y,W,B],confidence=conf))
E="Micah Everett, Ole Miss Low Brass Studio – Chromatic Slide Position Chart for Tenor Trombone (olemiss.edu/lowbrass/studio/fingeringcharts/tenortromboneposition.pdf)"
EO="Micah Everett – Overtone Series Chart for Tenor Trombone (tendances des partiels)"
O="Online Trombone Journal – Alternate Positions (trombone.org/articles/view.php?id=346)"
WT="Wikipedia – Trombone (positions, 5e partiel bas, 7e partiel ~31 cents bas)"
P={40:(7,[],""),41:(6,[],""),42:(5,[],""),43:(4,[],""),44:(3,[],""),45:(2,[],""),46:(1,[],""),
47:(7,[],""),48:(6,[],""),49:(5,[],""),50:(4,[],""),51:(3,[],""),
52:(2,[7],""),53:(1,[6],""),54:(5,[],""),55:(4,[],""),
56:(3,[7],"La 7e position (5e partiel) est rarement utilisée."),
57:(2,[6],""),58:(1,[5],"En 5e : 5e partiel, un peu bas, rentrer légèrement."),
59:(4,[7],"5e partiel, un peu bas : 4e légèrement rentrée."),
60:(3,[6],"5e partiel, un peu bas : 3e légèrement rentrée."),
61:(2,[5],"5e partiel, un peu bas : 2e légèrement rentrée."),
62:(1,[4],"En 1re (5e partiel) un peu basse; en 4e (6e partiel) un peu haute : 4e légèrement sortie."),
63:(3,[6],"En 6e : 7e partiel très bas, jouer la 6e rentrée."),
64:(2,[5],"En 5e : 7e partiel très bas, jouer la 5e rentrée."),
65:(1,[4,6],"En 4e : 7e partiel, 4e rentrée."),
66:(3,[5],"En 3e : 7e partiel très bas, 3e nettement rentrée."),
67:(4,[2],"En 2e : 7e partiel, 2e rentrée. La 4e (8e partiel) est juste."),
68:(3,[5],""),
69:(2,[4],""),
70:(1,[5],""),
71:(4,[2],"En 4e (10e partiel) un peu basse : rentrer légèrement."),
72:(3,[1],"En 3e (10e partiel) un peu basse : rentrer légèrement; en 1re (9e partiel) un peu haute."),
73:(2,[],"10e partiel, un peu basse : 2e légèrement rentrée."),
74:(1,[4],""),
75:(3,[],"12e partiel, un peu haut."),
76:(2,[],"12e partiel, un peu haut."),
77:(1,[],"")}
med={66,67,71,72,73,75,76,56}
tb=[]
for m in range(40,78):
    p,a,c=P[m]
    tb.append(dict(note=nm(m),midi=m,pos=p,alt=a,comment=c,sources=[E,EO,O,WT] if m>=52 else [E,WT],confidence="medium" if m in med else "high"))
out={"trumpet":{"pitch":"written","notes":tr},"trombone":{"pitch":"concert","notes":tb}}
json.dump(out,open('/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/brass.json','w'),ensure_ascii=False,indent=1)
print(len(tr),len(tb),tr[0]['note'],tr[-1]['note'],tb[0]['note'],tb[-1]['note'])

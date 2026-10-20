import sys,re
p=sys.argv[1];s=open(p).read()
# ordre du menu : Accueil, badges, Outils, puis le reste ; Lecture mélodique juste sous Lecture de notes
a=s.index("  {id:'ho',kind:'tools'");b=s.index("\n",s.index("  {id:'ap',g:'Infos'"))+1
lines=s[a:b].splitlines(keepends=True)
by={re.match(r"  \{id:'(\w+)'",l).group(1):l for l in lines}
assert len(by)==len(lines),'deja'
order=['ho','bd','mt','ac','en','dm','dr','iv','pc','ln','la','lm','lr','so','lb','rd','bt','tq','dg','et','gc','ap']
assert set(order)==set(by),(set(by)^set(order))
s=s[:a]+''.join(by[k] for k in order)+s[b:]
open(p,'w').write(s)

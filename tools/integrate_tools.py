import sys
T='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/tools/'
p=sys.argv[1];s=open(p).read()
if 'MODULE : Outils' in s: print('deja');sys.exit()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:60],s.count(a)); s=s.replace(a,b)
rep("""  {id:'tq',kind:'quiz',""","""  {id:'ou',g:'Outils',kind:'tools',t:'Métronome et accordeur',s:'Outils de travail',d:'Un métronome avec subdivisions et un accordeur chromatique précis, avec les accords courants et alternatifs de la guitare, de la basse, du ukulélé, du banjo et des cordes frottées.'},
  {id:'tq',kind:'quiz',""")
# keep tq in Théorie group: tools after it would steal grouping -> move tools entry after tq instead
s=s.replace("""  {id:'ou',g:'Outils',kind:'tools',t:'Métronome et accordeur',s:'Outils de travail',d:'Un métronome avec subdivisions et un accordeur chromatique précis, avec les accords courants et alternatifs de la guitare, de la basse, du ukulélé, du banjo et des cordes frottées.'},
  {id:'tq',kind:'quiz',""","""  {id:'tq',kind:'quiz',""")
i=s.index("  {id:'tq',kind:'quiz',");j=s.index('\n',i)
s=s[:j+1]+"""  {id:'mt',g:'Outils',kind:'tools',t:'Métronome',s:'Garder le tempo',d:'Règle le tempo et les subdivisions, puis appuie sur Démarrer (ou sur la barre d\\'espace).'},
  {id:'ac',kind:'tools',t:'Accordeur',s:'Accorder son instrument',d:'Active le micro, choisis ton instrument et joue une note : vise le voyant vert du centre.'},
  {id:'en',kind:'tools',t:'Enregistreur',s:'S\\'enregistrer et partager',d:'Enregistre-toi, réécoute, nomme le fichier et partage-le par courriel ou autrement.'},
"""+s[j+1:]
s=s.replace("  {id:'mt',g:'Outils'","  {id:'dg',kind:'tools',t:'Doigtés',s:'Vents et cordes',d:'Choisis un instrument : tous ses doigtés et toutes les notes du manche, à voir et à entendre.'},\n  {id:'mt',g:'Outils'",1)
rep("  if(id==='bt')return{};","  if(id==='bt'||id==='mt'||id==='ac'||id==='en'||id==='dg')return{};")
rep("  if(M.kind==='lib'){S.ex=null;M.fresh();return;}","  if(M.kind==='lib'||M.kind==='tools'){S.ex=null;M.fresh();return;}")
rep("function openModule(id,shared,opts={}){\n","function openModule(id,shared,opts={}){\n  if(typeof toolsStop==='function')toolsStop();\n")
rep("function buildSettings(){\n  if(MOD[S.mod].kind==='lib')return;","function buildSettings(){\n  if(MOD[S.mod].kind==='lib'||MOD[S.mod].kind==='tools')return;")
rep("(dm|dr|iv|pc|ln|lm|lr|so|la|tq)","(dm|dr|iv|pc|ln|lm|lr|so|la|tq|mt|ac|en|dg)")
rep("  openModule(m?m[1]:'dm',shared);","  if(/^#?ou\\b/.test(location.hash||'')){openModule('mt');return;}\n  openModule(m?m[1]:'dm',shared);")
code=open(T+'tools.js').read().replace('function toolsStop(){metroStop();tunerStop();}','function toolsStop(){if(typeof recStop===\'function\')recStop();metroStop();tunerStop();}')+open(T+'rec.js').read()+open(T+'../dg/dg_data.js').read()+open(T+'../dg/dg.js').read()
rep("/* ---------- démarrage ---------- */",code+"\n/* ---------- démarrage ---------- */")
css=open(T+'tools.css').read()+open(T+'rec.css').read()+open(T+'../dg/dg.css').read();i=s.rfind('</style>',0,s.find('<body'));s=s[:i]+css+s[i:]
open(p,'w').write(s);print('ok',p)

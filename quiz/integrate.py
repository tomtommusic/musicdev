import sys,re
Q='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/quiz/'
p=sys.argv[1];s=open(p).read()
if 'MODULE : Tester mes connaissances' in s: print('deja',p); sys.exit()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:70],s.count(a))
    s=s.replace(a,b)
# 1. module list
rep("""  {id:'bt',g:'Théorie',kind:'lib',t:'Bibliothèque théorique',s:'Comprendre',d:'Toutes les notions utiles pour lire, écouter et analyser la musique : de la portée aux cadences. Cherche une notion ou parcours les onglets.'},
];""","""  {id:'bt',g:'Théorie',kind:'lib',t:'Bibliothèque théorique',s:'Comprendre',d:'Toutes les notions utiles pour lire, écouter et analyser la musique : de la portée aux cadences. Cherche une notion ou parcours les onglets.'},
  {id:'tq',kind:'quiz',t:'Tester mes connaissances',s:'Évaluer',d:'Un questionnaire tiré au hasard selon les sujets et le niveau choisis dans les réglages : une question par page, ton résultat à la fin, et des PDF à partager ou à imprimer.'},
];""")
# 2. preset
rep("  if(id==='bt')return{};","  if(id==='bt')return{};\n  if(id==='tq')return{n:10,level:1,formats:['mc','short','staff'],topics:['l_sol','l_fa','r_fig','r_sil','g_arm','g_maj','i_nom','a_qua','t_nua','t_tem']};")
# 3. sanitize
rep("  if('chords'in b){","  if('topics'in b){const v=arr(c.topics,QZ_ALL_SUBS);if(v)o.topics=v;num('n',5,40);num('level',1,3);const f=arr(c.formats,['mc','short','staff']);if(f&&f.length)o.formats=f;return o;}\n  if('chords'in b){")
# 4. meta
rep("  if(ex.kind==='iv'){const c=S.cfg.iv;","  if(ex.kind==='quiz'){const c=S.cfg.tq;put([['Questions',String(c.n)],['Niveau',QZ_LEVELS[c.level-1][1]],['Sujets',`${c.topics.length} notion${c.topics.length>1?'s':''}`],['Formats',c.formats.length===3?'tous':c.formats.map(f=>QZ_FORMATS.find(x=>x[0]===f)[1]).join(', ')]]);return;}\n  if(ex.kind==='iv'){const c=S.cfg.iv;")
# 5. settings
rep("  if(M.kind==='iv'){\n    fs.push(sec('Intervalles',","""  if(M.kind==='quiz'){
    const box=subj=>{const all=subj.subs.map(x=>x[0]);const head=el('input',{type:'checkbox',id:'qz_'+subj.id});
      const items=subj.subs.map(([sid,t])=>{const i=el('input',{type:'checkbox',id:'qz_'+sid});i.checked=c.topics.includes(sid);
        i.addEventListener('change',()=>{c.topics=i.checked?[...c.topics.filter(x=>x!==sid),sid]:c.topics.filter(x=>x!==sid);sync();ch();});return el('label',{class:'chk'},i,t);});
      const sync=()=>{const on=all.filter(x=>c.topics.includes(x)).length;head.checked=on===all.length;head.indeterminate=on>0&&on<all.length;};
      head.addEventListener('change',()=>{c.topics=c.topics.filter(x=>!all.includes(x)).concat(head.checked?all:[]);items.forEach(l=>l.querySelector('input').checked=head.checked);sync();ch();});sync();
      return el('div',{class:'qzsubj field wide'},el('label',{class:'chk qzall'},head,el('b',{},subj.t)),el('div',{class:'checks'},items));};
    fs.push(sec('Questionnaire','Les questions sont tirées au hasard à chaque nouveau questionnaire'),
      field('Nombre de questions',sel('s_qn',[5,10,15,20,25,30,40].map(n=>[n,n]),c.n,v=>{c.n=+v;ch();})),
      field('Niveau',el('div',{class:'field'},sel('s_qlv',QZ_LEVELS,c.level,v=>{c.level=+v;ch();}),el('span',{class:'hint'},'Le niveau change la difficulté des notes, des tonalités, des intervalles et des accords proposés.'))),
      field('Formats de questions',el('div',{class:'field'},checks(QZ_FORMATS,c.formats,v=>{c.formats=v;ch();}),el('span',{class:'hint'},'L\\'app choisit au hasard un format permis pour chaque question.')),true),
      sec('Sujets','Coche un sujet en entier, ou seulement certaines notions'),
      ...QZ_SUBJ.filter(x=>!x.listen).map(box),
      sec('Écoute (dans l\\'app seulement)','Questions où il faut écouter. Elles ne sont jamais incluses dans le PDF à imprimer.'),
      box(QZ_SUBJ.find(x=>x.listen)),
      ...soundFields());
    p.replaceChildren(LEVELS,slotBar(id),...fs);return;
  }
  if(M.kind==='iv'){
    fs.push(sec('Intervalles',""")
rep("function buildSettings(){\n","function buildSettings(){\n  if(MOD[S.mod].kind==='lib')return;\n")
# 6. newEx
rep("  if(M.kind==='lib'){S.ex=null;M.fresh();return;}","  if(M.kind==='lib'){S.ex=null;M.fresh();return;}\n  if(M.kind==='quiz'){S.ex={kind:'quiz'};S.lastEx[S.mod]=S.ex;S.st={};metaLine(S.ex);if(typeof QZ!=='undefined'&&QZ.view!=='res')QZ.view='start';M.fresh();return;}")
# 7. boot hash
rep("const m=(location.hash||'').match(/^#?(dm|dr|iv|pc|ln|lm|lr|so|la)(?:-","const m=(location.hash||'').match(/^#?(dm|dr|iv|pc|ln|lm|lr|so|la|tq)(?:-")
# 9. code + css
code=''.join(open(Q+f).read()+'\n' for f in ['qz_gen.js','qz_ui.js','qz_pdf.js'])
rep("/* ---------- démarrage ---------- */",code+"/* ---------- démarrage ---------- */")
css=open(Q+'qz.css').read()
i=s.rfind('</style>',0,s.find('<body'));s=s[:i]+css+s[i:]
open(p,'w').write(s);print('ok',p)

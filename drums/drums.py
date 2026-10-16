#!/usr/bin/env python3
"""Module « Lecture batterie » (lb). À lancer après badges/badges.py, avant i18n."""
import sys,os
D=os.path.dirname(os.path.abspath(__file__))
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
i=s.index("  {id:'lr',kind:'rhy'");j=s.index("\n",i)+1
s=s[:j]+"  {id:'lb',kind:'drum',t:'Lecture batterie',s:'Voir → jouer à la batterie',d:'Lis une partition de batterie et joue-la sur ta batterie avec le décompte et le métronome ; la note en cours est surlignée. Écoute le modèle pour comparer.'},\n"+s[j:]
rep("  if(id==='lm')return{keys:['C']","  if(id==='lb')return drPreset();\n  if(id==='lm')return{keys:['C']")
rep("  if('chords'in b){","  if('els'in b){num('measures',1,8);num('tempo',40,160);o.metro=c.metro!==false;return drSanitize(c,o);}\n  if('chords'in b){")
rep("S.ex=M.kind==='notes'?genNotes(c):","S.ex=M.kind==='drum'?genDrums(c):M.kind==='notes'?genNotes(c):")
rep("(dm|dr|iv|pc|ln|lm|lr|so|la|tq|mt|ac|en|dg|gc|ho|ap|bd)","(dm|dr|iv|pc|ln|lm|lr|lb|so|la|tq|mt|ac|en|dg|gc|ho|ap|bd)")
rep("&&S.mod!=='lr')return;","&&S.mod!=='lr'&&S.mod!=='lb')return;")
# réglages
rep("  if(M.kind==='mel'){\n    fs.push(sec('Hauteurs'","""  if(M.kind==='drum'){
    const lvOf=()=>DR_LV.findIndex(([,x])=>x.els.length===c.els.length&&x.els.every(e=>c.els.includes(e))&&!!x.dbl===!!c.dbl);
    fs.push(sec('Batterie','Progression : on ajoute les éléments un à un'),
      field('Niveau',sel('s_drlv',[[-1,'Personnalisé'],...DR_LV.map(([l],k)=>[k,l])],lvOf(),v=>{const k=+v;if(k<0)return;Object.assign(c,structuredClone(DR_LV[k][1]));ch();buildSettings();}),true),
      field('Éléments',checks(DR_ORDER.map(x=>[x,DRK[x].t]),c.els,v=>{c.els=v;ch();buildSettings();}),true),
      field('Roulements',el('label',{class:'chk'},(()=>{const i=el('input',{type:'checkbox',id:'s_drdbl'});i.checked=!!c.dbl;i.addEventListener('change',()=>{c.dbl=i.checked;ch();buildSettings();});return i;})(),'Doubles croches dans les roulements de toms')),
      sec('Rythme','Sans charleston ni ride, la partition est une ligne de grosse caisse et de caisse claire faite avec les figures choisies'),
      field('Mesures',checks(['2/4','3/4','4/4'].map(k=>[k,k]),c.meters,v=>{c.meters=v;ch();})),
      field('Nombre de mesures',sel('s_meas',[1,2,3,4,6,8].map(n=>[n,n]),c.measures,v=>{c.measures=+v;ch();})));
    const tl=el('span',{},`${c.tempo} pulsations/min`), tr=el('input',{type:'range',id:'s_tempo',min:40,max:160,step:2,value:c.tempo});
    tr.addEventListener('input',()=>tl.textContent=`${tr.value} pulsations/min`);tr.addEventListener('change',()=>{c.tempo=+tr.value;if(S.ex)S.ex.tempo=c.tempo;cfgChanged(id);metaLine(S.ex);});
    fs.push(field('Tempo',el('div',{class:'field'},tr,el('span',{class:'hint'},tl))));
    fs.push(field('Figures permises (ligne sans charleston)',checks(FIG.filter(f=>!f.comp).map(f=>[f.id,f.fr]),c.figs.filter(x=>FIG_BY[x]&&!FIG_BY[x].comp),v=>{c.figs=v;ch();}),true));
    {const i=el('input',{type:'checkbox',id:'s_drmetro'});i.checked=c.metro!==false;i.addEventListener('change',()=>{c.metro=i.checked;cfgChanged(id);});fs.push(sec('Options : lecture batterie'),field('Métronome',el('label',{class:'chk'},i,'Garder le métronome pendant la lecture')));}
    p.replaceChildren(LEVELS,slotBar(id),...fs);return;
  }
  if(M.kind==='mel'){
    fs.push(sec('Hauteurs'""")
rep("lr:'pulsation',","lr:'pulsation',lb:'pulsation',")
code=open(D+'/drums.js',encoding='utf-8').read()
rep("/* ========== MODULE : solfège ========== */",code+"\n/* ========== MODULE : solfège ========== */")
css=open(D+'/drums.css',encoding='utf-8').read()
k=s.rfind('</style>',0,s.find('<div class="app">'));s=s[:k]+css+s[k:]
open(p,'w',encoding='utf-8').write(s);print('batterie ok')

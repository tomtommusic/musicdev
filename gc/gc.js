/* ========== MODULE : accords ==========
   On choisit un instrument, une fondamentale et un type (ou on tape « Am7 », « Sol7 », « F#m »…) :
   l'app calcule les positions jouables (ou les touches du piano) et en montre quelques variantes. */
const GC_INSTS=[
  {id:'gtr',t:'Guitare',tune:[40,45,50,55,59,64]},
  {id:'uke',t:'Ukulélé',tune:[67,60,64,69],free:true},
  {id:'banjo',t:'Banjo 5 cordes',tune:[50,55,59,62],free:true,fifth:67},
  {id:'mando',t:'Mandoline',tune:[55,62,69,76],free:true,span:4},
  {id:'piano',t:'Piano',kb:true}];
const GC_LET=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const GC_TYPES=[
  {id:'maj',sym:'',n:'majeur',iv:[0,4,7]},
  {id:'m',sym:'m',n:'mineur',iv:[0,3,7]},
  {id:'7',sym:'7',n:'septième',iv:[0,4,7,10],opt:[7]},
  {id:'maj7',sym:'maj7',n:'septième majeure',iv:[0,4,7,11],opt:[7]},
  {id:'m7',sym:'m7',n:'mineur septième',iv:[0,3,7,10],opt:[7]},
  {id:'sus2',sym:'sus2',n:'suspendu 2',iv:[0,2,7]},
  {id:'sus4',sym:'sus4',n:'suspendu 4',iv:[0,5,7]},
  {id:'7sus4',sym:'7sus4',n:'septième suspendu 4',iv:[0,5,7,10],opt:[7]},
  {id:'6',sym:'6',n:'sixte',iv:[0,4,7,9],opt:[7]},
  {id:'m6',sym:'m6',n:'mineur sixte',iv:[0,3,7,9],opt:[7]},
  {id:'add9',sym:'add9',n:'add9',iv:[0,4,7,2],opt:[7]},
  {id:'9',sym:'9',n:'neuvième',iv:[0,4,7,10,2],opt:[7]},
  {id:'dim',sym:'°',n:'diminué',iv:[0,3,6]},
  {id:'dim7',sym:'°7',n:'septième diminuée',iv:[0,3,6,9]},
  {id:'m7b5',sym:'m7♭5',n:'demi-diminué',iv:[0,3,6,10]},
  {id:'aug',sym:'+',n:'augmenté',iv:[0,4,8]}];
const GC={root:0,type:'maj',inst:'gtr'};
try{Object.assign(GC,JSON.parse(localStorage.getItem('atelier-gc')||'{}'));}catch(e){}
const gcSave=()=>{try{localStorage.setItem('atelier-gc',JSON.stringify({root:GC.root,type:GC.type,inst:GC.inst}));}catch(e){}};
const gcType=id=>GC_TYPES.find(t=>t.id===id)||GC_TYPES[0];
const gcInst=()=>GC_INSTS.find(i=>i.id===GC.inst)||GC_INSTS[0];
/* nom d'une note selon l'orthographe du symbole (bémols pour mi♭, la♭, si♭, dièses sinon) */
const gcFlat=r=>[3,8,10].includes(r);
const gcNote=(pc,flat)=>dgCap(T(dgName(pc,flat)));
/* symbole d'accord dans la langue choisie : lettres en anglais (Am7), solfège ailleurs (La m7) */
const gcSym=(r,ty)=>{if(typeof I18N!=='undefined'&&I18N.lang==='en')return GC_LET[r]+ty.sym;return gcNote(r,gcFlat(r))+(/^[a-z]/.test(ty.sym)?' ':'')+ty.sym;};

/* ---------- recherche des positions (instruments à cordes frettées) ---------- */
function gcVoicings(root,type,I){
  I=I||GC_INSTS[0];const TU=I.tune,N=TU.length,free=!!I.free,span=I.span||3;
  const ty=gcType(type),pcs=new Set(ty.iv.map(i=>(root+i)%12)),req=ty.iv.filter(i=>!(ty.opt||[]).includes(i)).map(i=>(root+i)%12);
  const seen=new Set(),out=[];
  const evalF=fr=>{
    const snd=fr.map((f,i)=>f>=0?i:-1).filter(i=>i>=0);if(snd.length<(free?N-1:3))return;
    const bass=snd[0];if(!free&&(TU[bass]+fr[bass])%12!==root)return;
    let inner=0;for(let i=free?0:bass;i<N;i++)if(fr[i]<0)inner++;if(inner>1)return;
    const have=new Set(snd.map(i=>(TU[i]+fr[i])%12));if(!req.every(p=>have.has(p)))return;
    const fd=snd.filter(i=>fr[i]>0);const opens=snd.length-fd.length;
    let minF=0,maxF=0;if(fd.length){minF=Math.min(...fd.map(i=>fr[i]));maxF=Math.max(...fd.map(i=>fr[i]));}
    if(maxF-minF>span||maxF>12)return;if(opens&&maxF>4+(span-3))return;if(opens&&inner)return;
    /* barré : la plus basse case tenue sur plusieurs cordes, sans corde à vide ni étouffée dessous */
    let barre=null,fingers=fd.length;const atMin=fd.filter(i=>fr[i]===minF);
    if(atMin.length>=2&&(fd.length>4||(atMin.length>=3&&!opens))){const a=atMin[0],b=atMin[atMin.length-1];let ok=true;for(let i=a;i<=b;i++)if(fr[i]<minF)ok=false;
      if(ok){barre={f:minF,a,b};fingers=1+fd.filter(i=>fr[i]>minF).length;}}
    if(fingers>4)return;
    const key=fr.join(',');if(seen.has(key))return;seen.add(key);
    let sc;
    if(free){const low=snd.reduce((a,i)=>TU[i]+fr[i]<TU[a]+fr[a]?i:a,snd[0]);
      sc=snd.length*3-inner*5-minF*.5+(maxF<=3?opens*.6:0)+(opens&&maxF<=3?4:0)+((TU[low]+fr[low])%12===root?2:0)-(maxF-minF>=3?1:0)-(snd.length<N?4:0);}
    else sc=snd.length*3-inner*5-minF*.5-bass*1.6+(maxF<=3?opens*.6:0)-(opens&&maxF>=4?2:0)+(opens&&maxF<=3?4:0)-(!opens&&bass<=1&&fr[bass]>minF+1?3:0)-(minF>=3&&fr[bass]>minF?2:0)-(maxF-minF===3?1:0)-(barre&&barre.b-barre.a>=4&&fingers===4?.5:0)-(snd.length<4?6:0);
    out.push({fr:fr.slice(),minF,maxF,barre,fingers,bass,sc,opens});
  };
  for(let w=0;w<=12;w++){const lo=Math.max(1,w),hi=lo+span;
    const opt=TU.map(o=>{const a=[-1];if(pcs.has(o%12))a.push(0);for(let f=lo;f<=hi;f++)if(pcs.has((o+f)%12))a.push(f);return a;});
    const fr=[];const rec=i=>{if(i===N){evalF(fr);return;}for(const f of opt[i]){fr[i]=f;rec(i+1);}};rec(0);}
  out.sort((a,b)=>b.sc-a.sc);
  /* quelques variantes bien différentes : autre corde de basse ou autre région du manche */
  const pick=[];const clash=(p,v)=>(free||p.bass===v.bass)&&!!p.opens===!!v.opens&&Math.abs((p.minF||0)-(v.minF||0))<3;
  for(const v of out){if(pick.length>=4)break;if(v.sc<(free?3:7))continue;if(pick.some(p=>clash(p,v)))continue;pick.push(v);}
  return pick.sort((a,b)=>(a.minF||0)-(b.minF||0)||a.bass-b.bass);
}
/* doigts : 1 pour le barré, puis dans l'ordre des cases (et des cordes) */
function gcFingers(v){const f=[],fd=v.fr.map((x,i)=>i).filter(i=>v.fr[i]>0);let n=1;
  if(v.barre){for(let i=v.barre.a;i<=v.barre.b;i++)if(v.fr[i]===v.barre.f)f[i]=1;n=2;}
  fd.filter(i=>f[i]==null).sort((a,b)=>v.fr[a]-v.fr[b]||a-b).forEach(i=>{f[i]=n++;});return f;}

/* ---------- diagramme (cordes) ---------- */
function gcDiagram(v,root,flat,TU){
  const NS='http://www.w3.org/2000/svg',N=TU.length,SX=18,SY=22,X0=N<6?34:26,Y0=30,NF=5;
  const start=v.maxF<=5?1:v.minF;const svg=document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox',`0 0 ${X0*2+SX*5} ${Y0+SY*NF+30}`);svg.setAttribute('class','gcd');svg.setAttribute('aria-hidden','true');
  const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.append(e);return e;};
  const off=(5-(N-1))*SX/2,x=i=>X0+off+i*SX,y=f=>Y0+(f-start+.5)*SY;
  for(let k=0;k<=NF;k++)mk('line',{x1:x(0),x2:x(N-1),y1:Y0+k*SY,y2:Y0+k*SY,class:'gcfret'});
  if(start===1)mk('rect',{x:x(0)-1,y:Y0-4,width:SX*(N-1)+2,height:5,class:'gcnut'});
  else mk('text',{x:x(0)-9,y:y(start)+4,'text-anchor':'end',class:'gcpos'},String(start));
  for(let i=0;i<N;i++)mk('line',{x1:x(i),x2:x(i),y1:Y0,y2:Y0+NF*SY,class:'gcstr','stroke-width':Math.max(.9,2.4-(TU[i]-40)/20)});
  const fg=gcFingers(v);
  if(v.barre)mk('rect',{x:x(v.barre.a)-7,y:y(v.barre.f)-7,width:(v.barre.b-v.barre.a)*SX+14,height:14,rx:7,class:'gcdot'});
  for(let i=0;i<N;i++){const f=v.fr[i];
    if(f<0)mk('text',{x:x(i),y:Y0-10,'text-anchor':'middle',class:'gcx'},'×');
    else if(f===0)mk('circle',{cx:x(i),cy:Y0-14,r:4.6,class:'gco'});
    else{if(!(v.barre&&f===v.barre.f&&i>v.barre.a&&i<v.barre.b&&fg[i]===1))mk('circle',{cx:x(i),cy:y(f),r:7.6,class:'gcdot'});
      if(!(v.barre&&fg[i]===1&&i!==v.barre.a))mk('text',{x:x(i),y:y(f)+3.6,'text-anchor':'middle',class:'gcfn'},String(fg[i]));}
    if(f>=0){const pc=(TU[i]+f)%12;mk('text',{x:x(i),y:Y0+NF*SY+16,'text-anchor':'middle',class:'gcnn'+(pc===root?' root':'')},gcNote(pc,flat).slice(0,4));}}
  return svg;
}
function gcStrum(v,TU){try{const c=A.init();if(typeof qzUnmute==='function')qzUnmute();let t=c.currentTime+.04;
  for(let i=0;i<TU.length;i++)if(v.fr[i]>=0){const m=TU[i]+v.fr[i];if(A.guitar)A.guitar(m,t,2.2,.55);else A.piano(m,t,2,.5);t+=.04;}}catch(e){}}

/* ---------- piano : l'accord et ses renversements sur un clavier ---------- */
function gcPianoVoicings(root,type){
  const ty=gcType(type),r0=(root<=5?60:48)+root;
  const tones=ty.iv.map(i=>(ty.id==='9'||ty.id==='add9')&&i===2?14:i).sort((a,b)=>a-b).map(i=>r0+i);
  const n=ty.id==='9'?1:tones.length,out=[];
  for(let k=0;k<n;k++){let v=tones.map((m,j)=>j<k?m+12:m).sort((a,b)=>a-b);if(Math.max(...v)>84)v=v.map(m=>m-12);out.push({inv:k,notes:v});}
  return out;
}
function gcKeyboard(notes,root,flat){
  const NS='http://www.w3.org/2000/svg',WW=20,WH=86,BW=13,BH=54;
  const lo=Math.floor(Math.min(...notes)/12)*12,hi=Math.max(lo+23,Math.floor(Math.max(...notes)/12)*12+11);
  const whites=[];for(let m=lo;m<=hi;m++)if(!dgBlack(m))whites.push(m);
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${whites.length*WW+2} ${WH+4}`);svg.setAttribute('class','gckb');svg.setAttribute('aria-hidden','true');
  const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.append(e);return e;};
  const on=new Set(notes),wx={};whites.forEach((m,i)=>wx[m]=1+i*WW);
  whites.forEach(m=>{mk('rect',{x:wx[m],y:1,width:WW,height:WH,rx:3,class:'gcw'+(on.has(m)?' on':'')});
    if(on.has(m))mk('text',{x:wx[m]+WW/2,y:WH-8,'text-anchor':'middle',class:'gckn'+(m%12===root?' root':'')},gcNote(m%12,flat).slice(0,4));});
  for(let m=lo;m<=hi;m++)if(dgBlack(m)){const x=wx[m-1]+WW-BW/2;mk('rect',{x,y:1,width:BW,height:BH,rx:2,class:'gcb'+(on.has(m)?' on':'')});
    if(on.has(m))mk('text',{x:x+BW/2,y:BH-7,'text-anchor':'middle',class:'gckn b'+(m%12===root?' root':'')},gcNote(m%12,flat).slice(0,4));}
  if(lo<=60&&hi>=60)mk('circle',{cx:wx[60]+WW/2,cy:WH-22,r:2,class:'gcc4'});
  return svg;
}
function gcPlayKeys(notes){try{const c=A.init();if(typeof qzUnmute==='function')qzUnmute();const t=c.currentTime+.04;notes.forEach((m,i)=>A.piano(m,t+i*.03,2,.45));}catch(e){}}

/* ---------- lecture d'un symbole tapé : « Am7 », « Sol7 », « F#m », « Si♭maj7 », « Do dim »… ---------- */
const GC_SOLF={do:0,'ré':2,re:2,mi:4,fa:5,sol:7,la:9,si:11};
const GC_QUAL=[['maj7','maj7'],['ma7','maj7'],['m7b5','m7b5'],['m7♭5','m7b5'],['min7b5','m7b5'],['ø7','m7b5'],['ø','m7b5'],['7sus4','7sus4'],['dim7','dim7'],['°7','dim7'],['o7','dim7'],['add9','add9'],['sus2','sus2'],['sus4','sus4'],['sus','sus4'],['min7','m7'],['m7','m7'],['-7','m7'],['7m','maj7'],['Δ7','maj7'],['Δ','maj7'],['M7','maj7'],['min6','m6'],['m6','m6'],['min','m'],['dim','dim'],['°','dim'],['aug','aug'],['+','aug'],['maj','maj'],['m','m'],['-','m'],['M','maj'],['9','9'],['7','7'],['6','6'],['','maj']];
function gcParse(q){
  let s=(q||'').trim().replace(/\s+/g,'').replace(/dièse|diese/i,'#').replace(/bémol|bemol/i,'b');if(!s)return null;
  const tries=[];const low=s.toLowerCase();
  for(const[k,v]of Object.entries(GC_SOLF))if(low.startsWith(k))tries.push([v,s.slice(k.length)]);
  const L='CDEFGAB'.indexOf(s[0].toUpperCase());if(L>=0)tries.push([[0,2,4,5,7,9,11][L],s.slice(1)]);
  for(let[r,rest]of tries){
    if(/^[#♯]/.test(rest)){r=(r+1)%12;rest=rest.slice(1);}else if(/^[b♭]/.test(rest)&&!/^b5/.test(rest)){r=(r+11)%12;rest=rest.slice(1);}
    for(const[k,v]of GC_QUAL){const a=k.length&&/[a-z]/.test(k)?rest.toLowerCase():rest;if(a===k||(k.length&&/[a-z]/i.test(k)&&a===k.toLowerCase()))return{root:r,type:v};}}
  return null;
}

/* ---------- vue ---------- */
const GC_INV=['Position fondamentale','1er renversement','2e renversement','3e renversement','4e renversement'];
function gcRender(){
  const root=MOD.gc.root;if(!root)return;const ty=gcType(GC.type),flat=gcFlat(GC.root),I=gcInst();
  const sym=gcSym(GC.root,ty),name=gcNote(GC.root,flat)+' '+T(ty.n);
  const notes=ty.iv.map(i=>gcNote((GC.root+i)%12,flat||[3,6,10].includes(i)&&ty.id!=='aug'));
  const search=el('input',{type:'search',class:'gcq',placeholder:T('Ex. : Am7, Sol7, F♯m'),'aria-label':T('Chercher un accord'),autocomplete:'off',autocapitalize:'off',spellcheck:'false'});
  const msg=el('span',{class:'gcmsg',role:'status'});
  const go=()=>{const r=gcParse(search.value);if(!r){msg.textContent=T('Accord non reconnu.');return;}GC.root=r.root;GC.type=r.type;gcSave();gcRender();};
  search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});
  let cards,hint;
  if(I.kb){const vs=gcPianoVoicings(GC.root,GC.type);
    cards=el('div',{class:'gcgrid kb'},...vs.map(v=>{const lab=T(GC_INV[v.inv]);
      return el('button',{type:'button',class:'gccard kb',onclick:()=>gcPlayKeys(v.notes),'aria-label':sym+' — '+lab},gcKeyboard(v.notes,GC.root%12,flat),
        el('span',{class:'gckeys','data-notr':''},v.notes.map(m=>gcNote(m%12,flat)).join(' – ')),el('span',{class:'gccap','data-notr':''},lab),el('span',{class:'gcplay','aria-hidden':'true'},'▶'));}));
    hint='Touche un clavier pour l\'entendre. Les noms sont écrits sur les touches à jouer; le point marque le do central.';}
  else{const vs=gcVoicings(GC.root,GC.type,I);
    cards=vs.length?el('div',{class:'gcgrid'},...vs.map(v=>{
      const lab=v.minF===0||(v.opens&&v.minF<=3)?T('Position ouverte'):v.barre?TL(`Barré, case ${v.barre.f}`,`Barre, fret ${v.barre.f}`,`Cejilla, traste ${v.barre.f}`):TL(`Case ${v.minF}`,`Fret ${v.minF}`,`Traste ${v.minF}`);
      return el('button',{type:'button',class:'gccard',onclick:()=>gcStrum(v,I.tune),'aria-label':sym+' — '+lab},gcDiagram(v,GC.root,flat,I.tune),el('span',{class:'gccap','data-notr':''},lab),el('span',{class:'gcplay','aria-hidden':'true'},'▶'));}))
      :el('p',{class:'hint'},'Aucune position simple trouvée pour cet accord.');
    hint='Touche un diagramme pour l\'entendre. × = corde étouffée · ○ = corde à vide · chiffres = doigts (1 = index) · nom en gras = fondamentale.';}
  const fifth=I.fifth?el('p',{class:'gcfifth'},new Set(ty.iv.map(i=>(GC.root+i)%12)).has(I.fifth%12)?'5e corde (sol aigu) : à vide, elle fait partie de l\'accord.':'5e corde (sol aigu) : ne la joue pas, le sol ne fait pas partie de l\'accord.'):null;
  root.replaceChildren(
    el('section',{class:'mtsec gcpick'},
      el('p',{class:'gclab first'},'Instrument'),
      el('div',{class:'gcchips'},...GC_INSTS.map(i=>el('button',{type:'button',class:'dgchip','aria-pressed':String(i.id===GC.inst),onclick:()=>{GC.inst=i.id;gcSave();gcRender();}},i.t))),
      el('div',{class:'gcsearch'},search,btn('Trouver',go,'primary'),msg),
      el('p',{class:'gclab'},'Fondamentale'),
      el('div',{class:'gcchips'},...GC_LET.map((l,r)=>el('button',{type:'button',class:'dgchip gcroot','aria-pressed':String(r===GC.root),onclick:()=>{GC.root=r;gcSave();gcRender();}},
        dgBlack(r)?gcNote(r,false)+' / '+gcNote(r,true):gcNote(r,false)))),
      el('p',{class:'gclab'},'Type d\'accord'),
      el('div',{class:'gcchips'},...GC_TYPES.map(t=>el('button',{type:'button',class:'dgchip','aria-pressed':String(t.id===GC.type),onclick:()=>{GC.type=t.id;gcSave();gcRender();}},
        el('b',{'data-notr':''},gcSym(GC.root,t)),el('span',{class:'gctn'},' '+T(t.n)))))),
    el('section',{class:'mtsec gcres'},
      el('div',{class:'gchead'},el('h2',{class:'gcsym','data-notr':''},sym),el('div',{},el('p',{class:'gcname','data-notr':''},name),
        el('p',{class:'gcnotes'},el('span',{},'Notes'),' ',el('b',{'data-notr':''},notes.join(' – '))))),
      cards,fifth,el('p',{class:'hint'},hint)));
}
MOD.gc.mount=function(){$('#toolbar').replaceChildren();this.root=el('div',{class:'tl gc'});$('#answer').replaceChildren(this.root);};
MOD.gc.fresh=function(){gcRender();};

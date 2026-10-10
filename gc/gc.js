/* ========== MODULE : accords de guitare ==========
   On choisit une fondamentale et un type (ou on tape « Am7 », « Sol7 », « F#m »…) :
   l'app calcule les positions jouables sur une guitare en accordage standard et en montre quelques variantes. */
const GC_TUNE=[40,45,50,55,59,64];
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
const GC={root:0,type:'maj'};
try{Object.assign(GC,JSON.parse(localStorage.getItem('atelier-gc')||'{}'));}catch(e){}
const gcSave=()=>{try{localStorage.setItem('atelier-gc',JSON.stringify({root:GC.root,type:GC.type}));}catch(e){}};
const gcType=id=>GC_TYPES.find(t=>t.id===id)||GC_TYPES[0];
/* nom d'une note selon l'orthographe du symbole (bémols pour mi♭, la♭, si♭, dièses sinon) */
const gcFlat=r=>[3,8,10].includes(r);
const gcNote=(pc,flat)=>dgCap(T(dgName(pc,flat)));
/* symbole d'accord dans la langue choisie : lettres en anglais (Am7), solfège ailleurs (La m7) */
const gcSym=(r,ty)=>{if(typeof I18N!=='undefined'&&I18N.lang==='en')return GC_LET[r]+ty.sym;return gcNote(r,gcFlat(r))+(/^[a-z]/.test(ty.sym)?' ':'')+ty.sym;};

/* ---------- recherche des positions ---------- */
function gcVoicings(root,type){
  const ty=gcType(type),pcs=new Set(ty.iv.map(i=>(root+i)%12)),req=ty.iv.filter(i=>!(ty.opt||[]).includes(i)).map(i=>(root+i)%12);
  const seen=new Set(),out=[];
  const evalF=fr=>{
    const snd=fr.map((f,i)=>f>=0?i:-1).filter(i=>i>=0);if(snd.length<3)return;
    const bass=snd[0];if((GC_TUNE[bass]+fr[bass])%12!==root)return;
    let inner=0;for(let i=bass;i<6;i++)if(fr[i]<0)inner++;if(inner>1)return;
    const have=new Set(snd.map(i=>(GC_TUNE[i]+fr[i])%12));if(!req.every(p=>have.has(p)))return;
    const fd=snd.filter(i=>fr[i]>0);const opens=snd.length-fd.length;
    let minF=0,maxF=0;if(fd.length){minF=Math.min(...fd.map(i=>fr[i]));maxF=Math.max(...fd.map(i=>fr[i]));}
    if(maxF-minF>3||maxF>12)return;if(opens&&maxF>4)return;if(opens&&inner)return;
    /* barré : la plus basse case tenue sur plusieurs cordes, sans corde à vide ni étouffée dessous */
    let barre=null,fingers=fd.length;const atMin=fd.filter(i=>fr[i]===minF);
    if(atMin.length>=2&&(fd.length>4||(atMin.length>=3&&!opens))){const a=atMin[0],b=atMin[atMin.length-1];let ok=true;for(let i=a;i<=b;i++)if(fr[i]<minF)ok=false;
      if(ok){barre={f:minF,a,b};fingers=1+fd.filter(i=>fr[i]>minF).length;}}
    if(fingers>4)return;
    const key=fr.join(',');if(seen.has(key))return;seen.add(key);
    const sc=snd.length*3-inner*5-minF*.5-bass*1.6+(maxF<=3?opens*.6:0)-(opens&&maxF>=4?2:0)+(opens&&maxF<=3?4:0)-(!opens&&bass<=1&&fr[bass]>minF+1?3:0)-(minF>=3&&fr[bass]>minF?2:0)-(maxF-minF===3?1:0)-(barre&&barre.b-barre.a>=4&&fingers===4?.5:0)-(snd.length<4?6:0);
    out.push({fr:fr.slice(),minF,maxF,barre,fingers,bass,sc,opens,base:sc-(opens&&maxF<=3?4:0)});
  };
  for(let w=0;w<=12;w++){const lo=Math.max(1,w),hi=lo+3;
    const opt=GC_TUNE.map(o=>{const a=[-1];if(pcs.has(o%12))a.push(0);for(let f=lo;f<=hi;f++)if(pcs.has((o+f)%12))a.push(f);return a;});
    const fr=[];const rec=i=>{if(i===6){evalF(fr);return;}for(const f of opt[i]){fr[i]=f;rec(i+1);}};rec(0);}
  out.sort((a,b)=>b.sc-a.sc);
  /* quelques variantes bien différentes : autre corde de basse ou autre région du manche */
  const pick=[];const clash=(p,v)=>p.bass===v.bass&&!!p.opens===!!v.opens&&Math.abs((p.minF||0)-(v.minF||0))<3;
  const best=Math.max(...out.map(v=>v.base));for(const v of out){if(pick.length>=4)break;if(v.sc<7)continue;if(pick.some(p=>clash(p,v)))continue;pick.push(v);}
  return pick.sort((a,b)=>(a.minF||0)-(b.minF||0)||a.bass-b.bass);
}
/* doigts : 1 pour le barré, puis dans l'ordre des cases (et des cordes) */
function gcFingers(v){const f=[],fd=[0,1,2,3,4,5].filter(i=>v.fr[i]>0);let n=1;
  if(v.barre){for(let i=v.barre.a;i<=v.barre.b;i++)if(v.fr[i]===v.barre.f)f[i]=1;n=2;}
  fd.filter(i=>f[i]==null).sort((a,b)=>v.fr[a]-v.fr[b]||a-b).forEach(i=>{f[i]=n++;});return f;}

/* ---------- diagramme ---------- */
function gcDiagram(v,root,flat){
  const NS='http://www.w3.org/2000/svg',SX=18,SY=22,X0=26,Y0=30,NF=5;
  const start=v.maxF<=5?1:v.minF;const svg=document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox',`0 0 ${X0*2+SX*5} ${Y0+SY*NF+30}`);svg.setAttribute('class','gcd');svg.setAttribute('aria-hidden','true');
  const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.append(e);return e;};
  const x=i=>X0+i*SX,y=f=>Y0+(f-start+.5)*SY;
  for(let k=0;k<=NF;k++)mk('line',{x1:x(0),x2:x(5),y1:Y0+k*SY,y2:Y0+k*SY,class:'gcfret'});
  if(start===1)mk('rect',{x:x(0)-1,y:Y0-4,width:SX*5+2,height:5,class:'gcnut'});
  else mk('text',{x:x(0)-9,y:y(start)+4,'text-anchor':'end',class:'gcpos'},String(start));
  for(let i=0;i<6;i++)mk('line',{x1:x(i),x2:x(i),y1:Y0,y2:Y0+NF*SY,class:'gcstr','stroke-width':1.6-i*.15});
  const fg=gcFingers(v);
  if(v.barre)mk('rect',{x:x(v.barre.a)-7,y:y(v.barre.f)-7,width:(v.barre.b-v.barre.a)*SX+14,height:14,rx:7,class:'gcdot'});
  for(let i=0;i<6;i++){const f=v.fr[i];
    if(f<0)mk('text',{x:x(i),y:Y0-10,'text-anchor':'middle',class:'gcx'},'×');
    else if(f===0)mk('circle',{cx:x(i),cy:Y0-14,r:4.6,class:'gco'});
    else{const isR=(GC_TUNE[i]+f)%12===root;if(!(v.barre&&f===v.barre.f&&i>v.barre.a&&i<v.barre.b&&fg[i]===1))mk('circle',{cx:x(i),cy:y(f),r:7.6,class:'gcdot'+(isR?' root':'')});
      if(!(v.barre&&fg[i]===1&&i!==v.barre.a))mk('text',{x:x(i),y:y(f)+3.6,'text-anchor':'middle',class:'gcfn'},String(fg[i]));}
    if(f>=0){const pc=(GC_TUNE[i]+f)%12;mk('text',{x:x(i),y:Y0+NF*SY+16,'text-anchor':'middle',class:'gcnn'+(pc===root?' root':'')},gcNote(pc,flat).replace('♯','♯').slice(0,4));}}
  return svg;
}
function gcStrum(v){try{const c=A.init();if(typeof qzUnmute==='function')qzUnmute();let t=c.currentTime+.04;
  for(let i=0;i<6;i++)if(v.fr[i]>=0){const m=GC_TUNE[i]+v.fr[i];if(A.guitar)A.guitar(m,t,2.2,.55);else A.piano(m,t,2,.5);t+=.04;}}catch(e){}}

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
function gcRender(){
  const root=MOD.gc.root;if(!root)return;const ty=gcType(GC.type),flat=gcFlat(GC.root);
  const sym=gcSym(GC.root,ty),name=gcNote(GC.root,flat)+' '+T(ty.n);
  const notes=ty.iv.map(i=>gcNote((GC.root+i)%12,flat||[3,6,10].includes(i)&&ty.id!=='aug'));
  const vs=gcVoicings(GC.root,GC.type);
  const search=el('input',{type:'search',class:'gcq',placeholder:T('Ex. : Am7, Sol7, F♯m'),'aria-label':T('Chercher un accord'),autocomplete:'off',autocapitalize:'off',spellcheck:'false'});
  const msg=el('span',{class:'gcmsg',role:'status'});
  const go=()=>{const r=gcParse(search.value);if(!r){msg.textContent=T('Accord non reconnu.');return;}GC.root=r.root;GC.type=r.type;gcSave();gcRender();};
  search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});
  root.replaceChildren(
    el('section',{class:'mtsec gcpick'},
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
      vs.length?el('div',{class:'gcgrid'},...vs.map(v=>{
        const lab=v.minF===0||(v.opens&&v.minF<=3)?T('Position ouverte'):v.barre?TL(`Barré, case ${v.barre.f}`,`Barre, fret ${v.barre.f}`,`Cejilla, traste ${v.barre.f}`):TL(`Case ${v.minF}`,`Fret ${v.minF}`,`Traste ${v.minF}`);
        return el('button',{type:'button',class:'gccard',onclick:()=>gcStrum(v),'aria-label':sym+' — '+lab},gcDiagram(v,GC.root,flat),el('span',{class:'gccap','data-notr':''},lab),el('span',{class:'gcplay','aria-hidden':'true'},'▶'));}))
        :el('p',{class:'hint'},'Aucune position simple trouvée pour cet accord.'),
      el('p',{class:'hint'},'Touche un diagramme pour l\'entendre. × = corde étouffée · ○ = corde à vide · chiffres = doigts (1 = index) · nom en gras = fondamentale.')));
}
MOD.gc.mount=function(){$('#toolbar').replaceChildren();this.root=el('div',{class:'tl gc'});$('#answer').replaceChildren(this.root);};
MOD.gc.fresh=function(){gcRender();};

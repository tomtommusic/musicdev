
/* ---------- schémas des vents (façon tableau de méthode) ---------- */
/* items : [id,'o',x,y,r] trou · [id,'e',x,y,rx,ry,rot] petite clé · [id,'d',path] clé dessinée.
   sil : silhouette discrète de l'instrument, dessinée derrière les clés */
const nl=(...n)=>n.map(x=>dgCap(T(x))).join('/');
const DG_LAYOUT={
  flute:{vb:'-4 0 288 96',
    sil:['M2,28 H268 a2,2 0 0 1 2,2 V46 a2,2 0 0 1 -2,2 H2 Z','M-2,30 a6,8 0 0 1 12,0 v16 a6,8 0 0 1 -12,0 Z'],
    seps:[[120,22,120,54]],
    items:()=>[
    ['thB','d','M20,72 Q31,62 47,64 L47,80 Q31,82 20,72 Z'],['thBb','d','M50,65 h14 a3,3 0 0 1 3,3 v8 a3,3 0 0 1 -3,3 h-14 z'],
    ['L1','o',28,38,12],['L2','o',58,38,12],['L3','o',88,38,12],['Gs','d','M104,31 A7,7 0 0 1 104,45 Z'],
    ['R1','o',140,38,12],['Tr1','e',155,19,4,4],['R2','o',170,38,12],['Tr2','e',185,19,4,4],['R3','o',200,38,12],
    ['Ds','d','M218,32 A9,9 0 0 1 218,50 Z'],['Cs','d','M236,29 h9 a4,4 0 0 1 4,4 v3 a4,4 0 0 1 -4,4 h-9 z'],['C','d','M236,45 h16 a3.5,3.5 0 0 1 0,7 h-16 z']],
    labels:[[58,14,'Main gauche'],[170,9,'Main droite'],[44,94,'Pouce']]},
  clar:{vb:'0 -46 92 256',
    sil:['M39,-44 h8 l3,22 h-14 Z','M35,-22 h16 v14 h-16 Z','M37,-8 h12 V164 h-12 Z','M37,162 h12 C50,178 58,192 68,202 H18 C28,192 36,178 37,162 Z'],
    seps:[[35,81,51,81]],deco:[['M13,2 v44 M31,2 v44','dgbr']],
    items:()=>[
    ['Reg','d','M22,5 C26,11 27,17 27,20 A5,5 0 0 1 17,20 C17,17 18,11 22,5 Z'],['T','o',22,37,5.5],
    ['Gs','e',47,21,2.4,4.2],['A','e',54,21,2.4,4.2],
    ['L1','o',43,38,6.2],['L2','o',43,54,6.2],['EbBb','d','M50,49 q5,0 5,5 q0,5 -5,5 q3,-5 0,-10 Z'],['L3','o',43,70,6.2],
    ['S1','e',32,66,1.9,1.9],['S2','e',32,71.5,1.9,1.9],['S3','e',32,77,1.9,1.9],['S4','e',32,82.5,1.9,1.9],
    ['R1','o',43,92,6.2],['R2','o',43,108,6.2],['R3','o',43,124,6.2],
    ['CsGs','e',62,82,2.4,2.4],['lFs','e',62,91,2.8,4.6],['lE','e',57.5,101,2.8,4.6,30],['lF','e',66.5,101,2.8,4.6,-30],
    ['rAb','e',37,140,5.2,3.6],['rFs','e',49,140,5.2,3.6],['rE','e',37,149,5.2,3.6],['rF','e',49,149,5.2,3.6]],
    labels:[]},
  asax:{vb:'-2 -30 108 232',
    sil:[],silS:['M14,-24 C28,-22 40,-14 46,-2 V140 C46,170 56,184 70,184 C84,184 88,172 88,150 V124'],silF:['M76,126 L70,104 H106 L100,126 Z'],
    seps:[[36,87,56,87]],deco:[['M16,18 v28 M33,18 v28','dgbr']],
    items:()=>[
    ['PD','e',8,14,4,2.3,-30],['PEb','e',5.5,23,4,2.3,-10],['PF','e',8,32,4,2.3,15],
    ['FF','e',46,25,3.4,2.4],['Oct','d','M24.5,22 C28.5,28 29.5,33 29.5,36 A5,5 0 0 1 19.5,36 C19.5,33 20.5,28 24.5,22 Z'],
    ['L1','o',46,38,7],['Bis','e',57,47,2.4,2.4],['L2','o',46,56,7],['L3','o',46,74,7],
    ['Gs','e',22,80,6,3.4],['LCs','e',16,89,4.6,3.4],['LB','e',28,89,4.6,3.4],['LBb','e',22,98,6,3.4],
    ['SE','e',64,92,2.6,3.8],['SC','e',64,101,2.6,3.8],['SBb','e',64,110,2.6,3.8],['SFs','e',70,84,2.4,3.4],
    ['R1','o',46,100,7],['R2','o',46,118,7],['R3','o',46,136,7],
    ['REb','e',40,153,5.5,3.8],['RC','e',53,153,5.5,3.8]],
    labels:[]},
};
function dgWindSvg(inst,keys,size){
  const L=DG_LAYOUT[inst],on=new Set(keys),NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',L.vb);svg.setAttribute('class','dgsvg '+inst+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);svg.append(e);return e;};
  {const g=mk('g',{class:'dgsilg'});const sp=(d,c)=>{const e=document.createElementNS(NS,'path');e.setAttribute('d',d);e.setAttribute('class',c);g.append(e);};
   (L.sil||[]).forEach(d=>sp(d,'dgsilf'));(L.silS||[]).forEach(d=>sp(d,'dgsils'));(L.silF||[]).forEach(d=>sp(d,'dgsilf'));}
  for(const[x1,y1,x2,y2]of(L.seps||[]))mk('line',{x1,y1,x2,y2,class:'dgsep'});
  for(const[d,c]of(L.deco||[]))mk('path',{d,class:c});
  for(const it of L.items()){const[id,tp,x,y]=it,cls='dgk '+(on.has(id)?'on':'off');
    if(tp==='d'){mk('path',{d:it[2],class:cls});continue;}
    if(tp==='e'){const a={cx:x,cy:y,rx:it[4],ry:it[5],class:cls+' small'};if(it[6])a.transform=`rotate(${it[6]} ${x} ${y})`;mk('ellipse',a);continue;}
    mk('circle',{cx:x,cy:y,r:it[4],class:cls});}
  for(const[x,y,s]of(L.labels||[])){const t=mk('text',{x,y,class:'dgcap','text-anchor':'middle'});t.textContent=T(s);}
  return svg;
}
/* trompette : trois pistons sur une silhouette de trompette */
function dgValvesSvg(v,size){
  const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 170 70');svg.setAttribute('class','dgsvg tpt'+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.append(e);return e;};
  mk('path',{d:'M2,46 h6 v-4 h4 v8 h-4 v-4 M12,44 H120 C136,44 150,34 166,22 V66 C150,54 136,48 120,48 H12 Z',class:'dgsil'});
  mk('path',{d:'M30,58 C24,58 22,62 30,64 H112 C120,62 118,58 112,58',class:'dgsilline'});
  [1,2,3].forEach((n,i)=>{const x=34+i*36;mk('rect',{x:x-9,y:30,width:18,height:30,rx:4,class:'dgsil'});
    mk('rect',{x:x-2.5,y:18,width:5,height:12,class:'dgstem'});
    mk('circle',{cx:x,cy:16,r:12,class:'dgk '+(v.includes(n)?'on':'off')});
    mk('text',{x,y:20.5,'text-anchor':'middle',class:'dgvn'+(v.includes(n)?' on':'')},String(n));});
  return svg;
}
/* trombone : coulisse et ses 7 positions, sous une silhouette discrète */
function dgSlideSvg(p,alts,size){
  const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 250 74');svg.setAttribute('class','dgsvg tbn'+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.append(e);return e;};
  const X=k=>22+(k-1)*33;
  mk('path',{d:'M4,10 H70 C78,10 82,4 96,0 V26 C82,22 78,16 70,16 H10 Z',class:'dgsil'});
  mk('path',{d:'M14,30 H60 M14,44 H60',class:'dgsilline'});
  const end=X(p||1)+12;
  mk('path',{d:`M14,32 H${end} a5,5 0 0 1 0,10 H14`,class:'dgslide'});
  for(let k=1;k<=7;k++){const x=X(k),isP=k===p,isA=(alts||[]).includes(k);
    mk('line',{x1:x,y1:50,x2:x,y2:56,class:'dgtick'});
    if(isP||isA)mk('circle',{cx:x,cy:37,r:isP?11:9,class:'dgk '+(isP?'on':'alt')});
    mk('text',{x,y:isP||isA?41.5:68,'text-anchor':'middle',class:'dgvn'+(isP?' on':isA?' alt':' dim')},String(k));}
  return svg;
}

/* noms des clés (hors trous de doigts) pour la légende sous le schéma */
function dgKeyNames(inst){const pg=T('Auriculaire gauche'),pd=T('Auriculaire droit');return({
  flute:{thB:T('Clé de si (pouce)'),thBb:T('Levier de si♭ (pouce)'),Gs:T('Clé de sol♯'),Ds:T('Clé de mi♭'),Cs:T('Clé de do♯'),C:T('Clé de do grave'),Tr1:T('Clé de trille 1'),Tr2:T('Clé de trille 2')},
  clar:{Reg:T('Clé de registre'),A:T('Clé de la'),Gs:T('Clé de sol♯'),EbBb:T('Clé mi♭/si♭ (palette)'),CsGs:`${pg} : ${nl('do♯','sol♯')}`,lFs:`${pg} : ${nl('fa♯','do♯')}`,lE:`${pg} : ${nl('mi','si')}`,lF:`${pg} : ${nl('fa','do')}`,
    S1:T('Clé latérale')+' 1',S2:T('Clé latérale')+' 2',S3:T('Clé latérale')+' 3',S4:T('Clé latérale')+' 4',rAb:`${pd} : ${nl('la♭','mi♭')}`,rFs:`${pd} : ${nl('fa♯','do♯')}`,rE:`${pd} : ${nl('mi','si')}`,rF:`${pd} : ${nl('fa','do')}`},
  asax:{Oct:T('Clé d\'octave'),PD:T('Clé de paume')+' '+T('ré'),PEb:T('Clé de paume')+' '+T('mi♭'),PF:T('Clé de paume')+' '+T('fa'),FF:T('Fa avant'),Bis:T('Clé bis'),Gs:T('Clé de sol♯'),LCs:`${pg} : ${nl('do♯')}`,LB:`${pg} : ${nl('si')}`,LBb:`${pg} : ${nl('si♭')}`,
    SE:T('Clé latérale')+' '+T('mi'),SC:T('Clé latérale')+' '+T('do'),SBb:T('Clé latérale')+' '+T('si♭'),SFs:T('Clé de fa♯ aigu'),REb:`${pd} : ${nl('mi♭')}`,RC:`${pd} : ${nl('do')}`}})[inst]||{};}
function dgLegend(inst,keys){const N=dgKeyNames(inst),l=keys.filter(k=>N[k]).map(k=>N[k]);return l.length?el('p',{class:'dgleg'},el('span',{class:'fl'},'Clés à presser'),...l.map(x=>el('span',{class:'dgkey','data-notr':''},x))):null;}

/* ---------- vue ---------- */
function dgInst(){return DG_INST.find(i=>i.id===DG.inst)||null;}
function dgRender(){
  const root=MOD.dg.root;if(!root)return;const I=dgInst();
  const picker=el('div',{class:'dgpick'},...DG_FAMS.map(f=>el('div',{class:'dgfam'},el('span',{class:'dgfl'},f),
    el('div',{class:'dgchips'},...DG_INST.filter(i=>i.fam===f).map(i=>el('button',{type:'button',class:'dgchip','aria-pressed':String(i.id===DG.inst),onclick:()=>{DG.inst=i.id;dgSave();dgRender();window.scrollTo({top:0,behavior:'smooth'});}},i.t))))));
  if(!I){root.replaceChildren(el('section',{class:'mtsec'},el('h3',{},'Choisis un instrument'),picker));S.keyHandler=null;return;}
  const head=el('div',{class:'dghead'},el('h2',{},I.t),el('p',{class:'hint'},I.info));
  const body=I.kind==='fret'||I.kind==='bow'?dgStringsView(I):dgWindView(I);
  root.replaceChildren(el('details',{class:'dgpickwrap'},el('summary',{},el('span',{class:'dgil'},'Instrument : '),el('b',{},I.t),el('span',{class:'dgchg'},'Changer')),picker),head,body);
}
/* vents : la note choisie en grand, puis le tableau complet comme dans une méthode */
function dgWindView(I){
  const notes=DG_DATA[I.data];let cur=DG.sel[I.id];if(!notes.some(n=>n.m===cur))cur=notes.find(n=>n.m>=60&&n.m<=72)?.m??notes[0].m;
  const detail=el('section',{class:'mtsec dgdet'}),chart=el('div',{class:'dgchart '+I.data});
  const sound=m=>m+I.tr;
  const vtxt=v=>v.length?v.join('-'):'0';
  /* un doigté (principal ou autre) avec sa légende courte */
  const fig=(n,alt,size)=>{
    if(I.kind==='tpt'){const v=alt||n.v;return el('figure',{class:'dgf'},dgValvesSvg(v,size),el('figcaption',{class:'dgv'},vtxt(v)));}
    if(I.kind==='tbn'){const p=alt||n.p;return el('figure',{class:'dgf'},dgSlideSvg(p,[],size),el('figcaption',{class:'dgv'},String(p)));}
    return el('figure',{class:'dgf'},dgWindSvg(I.data,alt?alt.k:n.k,size),alt&&alt.l&&size==='big'?el('figcaption',{},alt.l):null);};
  const altsOf=n=>(n.a||[]).filter(a=>a!=null);
  const cells=new Map();
  const show=(m,scroll)=>{cur=m;DG.sel[I.id]=m;dgSave();const i=notes.findIndex(n=>n.m===m),n=notes[i];
    cells.forEach((c,k)=>c.setAttribute('aria-current',String(k===m)));
    const alts=altsOf(n);
    const real=I.tr?el('p',{class:'hint'},'Son réel : ',el('b',{},dgCap(T(dgName(sound(m),true)))),I.tr===-2?' (un ton plus bas)':I.tr===-9?' (une sixte majeure plus bas)':''):null;
    const figs=[fig(n,null,'big')];alts.forEach(a=>{figs.push(el('span',{class:'dgou'},'ou'));figs.push(fig(n,a,'big'));});
    detail.replaceChildren(...[
      el('div',{class:'dgdtop'},el('button',{type:'button',class:'btn quiet dgnav','aria-label':'Note précédente',disabled:i===0,onclick:()=>show(notes[i-1].m)},'‹'),
        el('div',{class:'dgdname'},dgNameEl(m,'dgnm big'),el('span',{class:'dgsub'},I.kind==='tbn'?'Position':I.kind==='tpt'?'Pistons':'Doigté')),
        el('button',{type:'button',class:'btn quiet dgnav','aria-label':'Note suivante',disabled:i===notes.length-1,onclick:()=>show(notes[i+1].m)},'›')),
      el('div',{class:'dgdmain'},dgStaff(m,I.clef,false,true),el('div',{class:'dgfigs'},...figs)),
      el('div',{class:'qzbtns'},btn('▶ Écouter',()=>dgPlay(sound(m),I.timbre),'')),
      real,
      I.kind==='ww'?dgLegend(I.data,n.k):null,
      n.c?el('p',{class:'dgcom'},n.c):null].filter(Boolean));
    if(scroll)detail.scrollIntoView({behavior:'smooth',block:'start'});
  };
  for(const n of notes){
    const alts=altsOf(n);const parts=[fig(n,null,'mini')];alts.forEach(a=>{parts.push(el('span',{class:'dgou'},'ou'));parts.push(fig(n,a,'mini'));});
    const c=el('button',{type:'button',class:'dgcell2'+(alts.length?' wide':''),'aria-current':'false',onclick:()=>{show(n.m,true);dgPlay(sound(n.m),I.timbre);}},
      el('span',{class:'dgch'},dgNameEl(n.m,'dgnm')),dgStaff(n.m,I.clef,true,true),el('div',{class:'dgfigs mini'},...parts));
    cells.set(n.m,c);chart.append(c);}
  show(cur);
  S.keyHandler=e=>{const i=notes.findIndex(n=>n.m===cur);if(e.code==='ArrowRight'&&i<notes.length-1){show(notes[i+1].m);return true;}if(e.code==='ArrowLeft'&&i>0){show(notes[i-1].m);return true;}if(e.code==='Space'){dgPlay(sound(cur),I.timbre);return true;}};
  const legend=I.kind==='ww'?el('p',{class:'dgkeyleg'},el('span',{class:'dglk on'}),' ','enfoncé',el('span',{class:'dglk off'}),' ','ouvert'):null;
  return el('div',{class:'dgwrap'},detail,el('section',{class:'mtsec'},el('div',{class:'dgcharthead'},el('h3',{},'Tableau des doigtés'),legend),el('p',{class:'hint'},'Touche une case pour voir le doigté en grand et l\'entendre.'),chart));
}

/* ---------- cordes : manche dessiné ---------- */
const DG_FING={
  vln:['0','1 bas','1','2 bas','2','3','3 haut','4'],
  vc:['0','1 ext.','1','2','3','4','4 ext.'],
  cb:['0','1 (½ pos.)','1','2','4']};
let DG_UID=0;
function dgStringsView(I){
  const fret=I.kind==='fret',n=I.strings.length,maxF=fret?DG.frets:12,NS='http://www.w3.org/2000/svg',uid='dg'+(++DG_UID);
  const bowKind=I.id; /* vln, vla, vc, cb */
  const info=el('section',{class:'mtsec dgsinfo'});
  /* proportions : manche fin, cases qui rapetissent comme sur un vrai instrument */
  const SP=fret?(n>4?24:28):(I.id==='vln'||I.id==='vla'?26:I.id==='vc'?28:30),PAD=fret?12:10,NW=SP*(n-1)+PAD*2;
  const span=fret?maxF+0.7:13.4,LEN=fret?(maxF>12?900:720):720,L=LEN/(1-Math.pow(2,-span/12)),pos=f=>L*(1-Math.pow(2,-f/12));
  const HEAD=fret?118:128,TOP=HEAD,BOT=fret?120:90,M=34; /* M : marge latérale (chevilles, numéros) */
  const VW=NW+M*2,VH=TOP+LEN+BOT;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${VW} ${VH}`);svg.setAttribute('class','dgneck '+(fret?'fret':'bow')+' '+I.id);
  const mk=(t,a,txt,parent)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;(parent||svg).append(e);return e;};
  const cx=VW/2,x0=M,x1=M+NW,sx=i=>M+PAD+i*SP;
  /* dégradés */
  const defs=mk('defs',{});
  const lg=(id,stops,x2='1',y2='0')=>{const g=mk('linearGradient',{id:uid+id,x1:'0',y1:'0',x2,y2},null,defs);stops.forEach(([o,c,op])=>mk('stop',{offset:o,'stop-color':c,'stop-opacity':op??1},null,g));};
  if(fret){lg('fb',[[0,'#2A1A10'],[.12,'#4A2E1C'],[.5,'#5C3A24'],[.88,'#4A2E1C'],[1,'#2A1A10']]);lg('hs',[[0,'#3A2416'],[.5,'#6B4429'],[1,'#3A2416']]);lg('body',[[0,'#C9955C'],[.5,'#E3B47A'],[1,'#C9955C']]);}
  else{lg('fb',[[0,'#050505'],[.15,'#1C1A19'],[.5,'#2B2826'],[.85,'#1C1A19'],[1,'#050505']]);lg('hs',[[0,'#6A2E12'],[.5,'#A9551F'],[1,'#6A2E12']]);lg('body',[[0,'#7A3512',.9],[.5,'#B8621F',.9],[1,'#7A3512',.9]]);}
  lg('wound',[[0,'#8C6A3A'],[.5,'#E9D3A2'],[1,'#8C6A3A']]);lg('plain',[[0,'#8A9096'],[.5,'#F4F6F8'],[1,'#8A9096']]);lg('fret',[[0,'#9AA1A8'],[.5,'#F2F4F6'],[1,'#9AA1A8']],'0','1');
  /* corps (en bas, discret) */
  if(fret){const y=TOP+LEN-6;mk('path',{d:`M${x0-2},${y} C${x0-30},${y+30} ${x0-40},${y+70} ${x0-34},${VH} H${x1+34} C${x1+40},${y+70} ${x1+30},${y+30} ${x1+2},${y} Z`,fill:`url(#${uid}body)`,class:'dgbody2'});
    if(I.id==='gtr'){const ry=TOP+LEN+BOT*0.95;mk('circle',{cx,cy:ry,r:NW*0.55,class:'dghole'});}}
  else{const y=TOP+LEN*0.78;mk('path',{d:`M${cx-NW*0.5},${y} C${cx-NW*1.6},${y+10} ${cx-NW*2.2},${y+50} ${cx-NW*2.4},${VH} H${cx+NW*2.4} C${cx+NW*2.2},${y+50} ${cx+NW*1.6},${y+10} ${cx+NW*0.5},${y} Z`,fill:`url(#${uid}body)`,class:'dgbody2'});}
  /* tête : chevilles de guitare/basse, ou volute et chevillier */
  const posts=[];
  if(fret){
    const per=n/2;
    mk('path',{d:`M${x0},${TOP} L${x0-8},${18} Q${cx},${-4} ${x1+8},${18} L${x1},${TOP} Z`,fill:`url(#${uid}hs)`,class:'dghead2'});
    for(let i=0;i<n;i++){const left=i<per,k=left?per-1-i:i-per,y=34+k*(TOP-50)/Math.max(1,per-1||1);
      const px=left?x0-14:x1+14;mk('rect',{x:left?px-12:px,y:y-4,width:12,height:8,rx:3,class:'dgpeg'});posts[i]=[left?x0+6:x1-6,y];}
  }else{
    const pb=TOP-18;
    mk('path',{d:`M${cx-NW*0.42},${TOP} L${cx-NW*0.34},${40} L${cx+NW*0.34},${40} L${cx+NW*0.42},${TOP} Z`,fill:`url(#${uid}hs)`,class:'dghead2'});
    mk('circle',{cx,cy:24,r:NW*0.34,fill:`url(#${uid}hs)`,class:'dghead2'});mk('path',{d:`M${cx},${24} m-${NW*0.2},0 a${NW*0.2},${NW*0.2} 0 1 1 ${NW*0.24},${NW*0.12} a${NW*0.1},${NW*0.1} 0 1 1 -${NW*0.08},-${NW*0.14}`,class:'dgscroll'});
    for(let i=0;i<n;i++){const y=52+i*((pb-52)/Math.max(1,n-1)),left=i%2===0;mk('path',{d:left?`M${cx-NW*0.36},${y} h-${M*0.8} a5,5 0 0 1 0,-10 h${M*0.4}`:`M${cx+NW*0.36},${y} h${M*0.8} a5,5 0 0 0 0,-10 h-${M*0.4}`,class:'dgpeg2'});}
  }
  /* touche */
  const fbW=y=>fret?NW:NW*(0.86+0.14*(y-TOP)/LEN);
  if(fret)mk('rect',{x:x0,y:TOP,width:NW,height:LEN+(I.id==='gtr'?0:10),fill:`url(#${uid}fb)`,class:'dgfb'});
  else{const wb=fbW(TOP+LEN);mk('path',{d:`M${cx-NW*0.43},${TOP} L${cx-wb/2},${TOP+LEN} Q${cx},${TOP+LEN+10} ${cx+wb/2},${TOP+LEN} L${cx+NW*0.43},${TOP} Z`,fill:`url(#${uid}fb)`,class:'dgfb'});}
  if(fret){mk('line',{x1:x0+1,y1:TOP,x2:x0+1,y2:TOP+LEN,class:'dgbind'});mk('line',{x1:x1-1,y1:TOP,x2:x1-1,y2:TOP+LEN,class:'dgbind'});}
  mk('rect',{x:fret?x0-1:cx-NW*0.45,y:TOP-6,width:fret?NW+2:NW*0.9,height:6,rx:1.5,class:'dgnut'});
  if(fret){for(let f=1;f<=maxF;f++)mk('rect',{x:x0,y:TOP+pos(f)-1.4,width:NW,height:2.8,fill:`url(#${uid}fret)`});
    const mid=f=>TOP+(pos(f-1)+pos(f))/2;
    for(const f of[3,5,7,9,15,17,19])if(f<=maxF)mk('circle',{cx,cy:mid(f),r:4.2,class:'dginlay'});
    if(maxF>=12)for(const dx of[-SP*1.2,SP*1.2])mk('circle',{cx:cx+dx,cy:mid(12),r:4.2,class:'dginlay'});
    for(let f=1;f<=maxF;f++)mk('text',{x:x1+M-6,y:mid(f)+3,class:'dgfnum','text-anchor':'end'},String(f));}
  /* cordes (graves filées à gauche, aiguës lisses à droite) */
  const wound=i=>fret?(I.id==='bass'||i<3):i<2;
  const sxAt=(i,y)=>{if(fret)return sx(i);const w=fbW(y)-PAD*2*0.9,t=(i/(n-1))-0.5;return cx+t*(w-4);};
  I.strings.forEach((s,i)=>{const w=Math.max(.8,(fret?(I.id==='bass'?3.6:2.4):2.4)-i*(fret?(I.id==='bass'?0.45:0.3):0.35)),st=`url(#${uid}${wound(i)?'wound':'plain'})`;
    const yb=TOP+LEN+(fret?BOT*0.6:6);
    if(fret&&posts[i]){mk('line',{x1:posts[i][0],y1:posts[i][1],x2:sx(i),y2:TOP-6,stroke:st,'stroke-width':w*0.8,'stroke-linecap':'round'});mk('circle',{cx:posts[i][0],cy:posts[i][1],r:3.2,class:'dgpost'});}
    mk('line',{x1:sxAt(i,TOP),y1:fret?TOP-6:46,x2:sxAt(i,TOP+LEN),y2:yb,stroke:st,'stroke-width':w,'stroke-linecap':'round'});});
  /* notes */
  const dots=[];
  const pick=(m,si,f,g)=>{dots.forEach(d=>{d.g.classList.toggle('same',d.m%12===m%12);d.g.classList.toggle('exact',d.m===m);d.g.classList.toggle('sel',d.g===g);});
    const fg=!fret&&DG_FING[I.fing][f];
    info.replaceChildren(el('div',{class:'dgdtop'},el('div',{class:'dgdname'},dgNameEl(m,'dgnm big'),el('span',{class:'dgsub'},
        `${T('Corde')} ${dgCap(T(dgName(I.strings[si],true)))} · `+(fret?(f===0?T('à vide'):`${T('case')} ${f}`):(f===0?T('à vide'):fg?`${T('doigt')} ${T(fg)}`:T('position plus haute'))))),
        btn('▶ Écouter',()=>dgPlay(m,I.timbre),'')),
      el('div',{class:'dgdmain'},dgStaff(m+I.tr,I.clef)),
      el('p',{class:'hint'},'En couleur : toutes les places qui donnent la même note ; en plus foncé, exactement la même hauteur.'));
    dgPlay(m,I.timbre);};
  I.strings.forEach((s,si)=>{for(let f=0;f<=maxF;f++){
    const m=s+f,fg=!fret&&DG_FING[I.fing][f],first=!fret&&f>0&&!!fg;
    const y=f===0?TOP-20:fret?TOP+(pos(f-1)+pos(f))/2:TOP+pos(f);
    const x=f===0?(fret?sx(si):sxAt(si,TOP)):sxAt(si,y);
    const g=mk('g',{class:'dgnote'+(f===0?' open':'')+(!fret&&f>0&&!fg?' high':'')+(first?' first':'')+(dgBlack(m)?' blk':''),tabindex:'0',role:'button'});
    const r=fret?(SP/2-1.5):(first||f===0?SP/2-1.8:SP/2-4.5);
    mk('circle',{cx:x,cy:y,r},null,g);
    mk('text',{x,y:y+(first?-0.5:3),'text-anchor':'middle',class:'dgnt'},dgCap(T(dgName(m,DG.flats))),g);
    if(first)mk('text',{x,y:y+7,'text-anchor':'middle',class:'dgfg'},T(fg).replace(' (½ pos.)','½'),g);
    const go=()=>pick(m,si,f,g);g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    dots.push({g,m});}});
  const opts=el('div',{class:'dgopts'},
    el('div',{class:'seg'},...[[false,'♯ dièses'],[true,'♭ bémols']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.flats===v),onclick:()=>{DG.flats=v;dgSave();dgRender();}},l))),
    fret?el('div',{class:'seg'},...[[12,'Cases 0–12'],[19,'Cases 0–19']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.frets===v),onclick:()=>{DG.frets=v;dgSave();dgRender();}},l))):null);
  info.replaceChildren(el('p',{class:'hint'},fret?'Touche une note sur le manche pour l\'entendre et voir toutes les places qui la donnent.':'Touche une note pour l\'entendre. Les grands ronds montrent la 1re position, avec le numéro du doigt ; les petits, les positions plus hautes.'));
  S.keyHandler=null;
  return el('div',{class:'dgwrap dgstrings'},info,el('section',{class:'mtsec dgnecksec'},el('h3',{},fret?'Toutes les notes du manche':'Notes de la touche'),opts,el('div',{class:'dgneckwrap'},svg)));
}

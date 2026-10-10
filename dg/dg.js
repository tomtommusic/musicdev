
/* ========== MODULE : Doigtés (vents et cordes) ========== */
MOD.dg.mount=function(){$('#toolbar').replaceChildren();this.root=el('div',{class:'tl dg'});$('#answer').replaceChildren(this.root);};
MOD.dg.fresh=function(){dgRender();};
const DG=tlLoad('atelier-dg',{inst:'',sel:{},frets:12,flats:false});DG.sel=Object.assign({},DG.sel);
const dgSave=()=>tlSave('atelier-dg',DG);
const DG_SH=['do','do♯','ré','ré♯','mi','fa','fa♯','sol','sol♯','la','la♯','si'],DG_FL=['do','ré♭','ré','mi♭','mi','fa','sol♭','sol','la♭','la','si♭','si'];
const dgCap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const dgName=(m,fl)=>(fl?DG_FL:DG_SH)[((m%12)+12)%12];
const dgBlack=m=>[1,3,6,8,10].includes(((m%12)+12)%12);
/* nom affiché : « Do♯ / Ré♭ » (chaque nom traduit séparément) */
function dgNameEl(m,cls){const s=dgName(m,false),f=dgName(m,true);return el('span',{class:cls||'dgnm'},el('b',{},dgCap(T(s))),...(dgBlack(m)?[' / ',el('b',{},dgCap(T(f)))]:[]));}
const DG_LET=['C','^C','D','^D','E','F','^F','G','^G','A','^A','B'];
function dgAbcNote(m){const pc=((m%12)+12)%12,o=Math.floor(m/12)-1;let s=DG_LET[pc];const acc=s[0]==='^'?'^':'';let L=acc?s[1]:s;L=o>=5?L.toLowerCase()+"'".repeat(o-5):L+','.repeat(Math.max(0,4-o));return acc+L;}
const DG_FLET=['C','_D','D','_E','E','F','_G','G','_A','A','_B','B'];
function dgAbcFlat(m){const pc=((m%12)+12)%12,o=Math.floor(m/12)-1;let s=DG_FLET[pc];const acc=s[0]==='_'?'_':'';let L=acc?s[1]:s;L=o>=5?L.toLowerCase()+"'".repeat(o-5):L+','.repeat(Math.max(0,4-o));return acc+L;}
/* portée : la note (et son enharmonique, comme dans les tableaux de méthode) */
function dgStaff(m,clef,small,pair){const box=el('div',{class:'dgstaff'+(small?' small':'')});const two=pair&&dgBlack(m);
  requestAnimationFrame(()=>{if(!box.isConnected||!HAS_ABC())return;ABCJS.renderAbc(box,`X:1\nL:1/4\nK:C clef=${clef}\n${two?dgAbcNote(m)+'2 '+dgAbcFlat(m)+'2':dgAbcNote(m)+'4'}|]`,{add_classes:true,staffwidth:small?(two?112:62):(two?110:86),scale:small?.68:1.45,paddingleft:0,paddingright:2,paddingtop:0,paddingbottom:0,foregroundColor:'currentColor'});});
  return box;}
/* son : la note réelle, timbre proche de l'instrument quand il existe */
function dgPlay(m,timbre){try{const c=A.init();if(typeof qzUnmute==='function')qzUnmute();const t=c.currentTime+.03;
  if(timbre==='guitare'&&A.guitar)A.guitar(m,t,1.6,.8);else if(timbre==='flute'&&A.flute)A.flute(m,t,1.2,.8);else A.piano(m,t,1.4,.8);}catch(e){}}

/* ---------- instruments ---------- */
const DG_INST=[
  {id:'flute',fam:'Bois',t:'Flûte traversière',kind:'ww',data:'flute',clef:'treble',tr:0,timbre:'flute',info:'En do : on lit les notes réelles.'},
  {id:'clar',fam:'Bois',t:'Clarinette en si♭',kind:'ww',data:'clar',clef:'treble',tr:-2,info:'Notes écrites. Le son réel est un ton plus bas.'},
  {id:'asax',fam:'Bois',t:'Saxophone alto',kind:'ww',data:'asax',clef:'treble',tr:-9,info:'En mi♭ : notes écrites. Le son réel est une sixte majeure plus bas.'},
  {id:'tpt',fam:'Cuivres',t:'Trompette en si♭',kind:'tpt',data:'tpt',clef:'treble',tr:-2,info:'Notes écrites. Le son réel est un ton plus bas. 0 = aucun piston.'},
  {id:'tbn',fam:'Cuivres',t:'Trombone',kind:'tbn',data:'tbn',clef:'bass',tr:0,info:'Notes réelles en clé de fa. Positions de la coulisse : 1 (fermée) à 7 (la plus sortie).'},
  {id:'vln',fam:'Cordes frottées',t:'Violon',kind:'bow',strings:[55,62,69,76],clef:'treble',tr:0,fing:'vln',info:'Cordes sol, ré, la, mi. Doigts en 1re position : 0 = corde à vide, 1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire.'},
  {id:'vla',fam:'Cordes frottées',t:'Alto',kind:'bow',strings:[48,55,62,69],clef:'alto',tr:0,fing:'vln',info:'Cordes do, sol, ré, la (clé d\'ut 3e ligne). Mêmes doigtés que le violon, une quinte plus bas.'},
  {id:'vc',fam:'Cordes frottées',t:'Violoncelle',kind:'bow',strings:[36,43,50,57],clef:'bass',tr:0,fing:'vc',info:'Cordes do, sol, ré, la. Doigts en 1re position : 1 à 4, un doigt par demi-ton.'},
  {id:'cb',fam:'Cordes frottées',t:'Contrebasse',kind:'bow',strings:[28,33,38,43],clef:'bass',tr:12,fing:'cb',info:'Cordes mi, la, ré, sol. S\'écrit une octave plus haut que le son réel. Doigtés 1-2-4 (méthode Simandl).'},
  {id:'gtr',fam:'Cordes pincées',t:'Guitare',kind:'fret',strings:[40,45,50,55,59,64],clef:'treble',tr:12,timbre:'guitare',info:'Accordage standard mi, la, ré, sol, si, mi. S\'écrit une octave plus haut que le son réel.'},
  {id:'bass',fam:'Cordes pincées',t:'Basse électrique',kind:'fret',strings:[28,33,38,43],clef:'bass',tr:12,timbre:'guitare',info:'Accordage standard mi, la, ré, sol. S\'écrit une octave plus haut que le son réel.'},
  {id:'mando',fam:'Cordes pincées',t:'Mandoline',kind:'fret',strings:[55,62,69,76],clef:'treble',tr:0,timbre:'guitare',info:'Quatre paires de cordes accordées sol, ré, la, mi, comme le violon. S\'écrit au son réel.'},
  {id:'banjo',fam:'Cordes pincées',t:'Banjo 5 cordes',kind:'fret',strings:[67,50,55,59,62],short:{i:0,from:5},clef:'treble',tr:12,timbre:'guitare',info:'Accordage en sol ouvert : sol aigu (5e corde, courte), ré, sol, si, ré. La 5e corde commence à la 5e case. S\'écrit une octave plus haut que le son réel.'},
];
const DG_FAMS=['Bois','Cuivres','Cordes frottées','Cordes pincées'];

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
  clar:{vb:'0 -46 92 262',
    sil:['M44,-44 h8 l3,22 h-14 Z','M41,-22 h14 v14 h-14 Z','M43,-8 h10 V178 h-10 Z','M43,176 h10 C54,190 62,204 72,214 H24 C34,204 42,190 43,176 Z'],
    seps:[],
    items:()=>[
    ['Reg','d','M30,-0.5 C31,3.4 33.2,7.4 33.2,9.3 A3.2,3.2 0 0 1 26.8,9.3 C26.8,7.4 29,3.4 30,-0.5 Z'],['T','o',30,24,4.6],
    ['A','d','M50,15.5 C50.8,18.8 52.7,22.2 52.7,23.8 A2.7,2.7 0 0 1 47.3,23.8 C47.3,22.2 49.2,18.8 50,15.5 Z'],['Gs','d','M60.5,15.5 C61.3,18.8 63.2,22.2 63.2,23.8 A2.7,2.7 0 0 1 57.8,23.8 C57.8,22.2 59.7,18.8 60.5,15.5 Z'],
    ['L1','o',50,40,7.2],['L2','o',50,60,7.2],['EbBb','d','M43.2,69.2 Q54.4,74.6 61.2,63.4 Q53.5,69.6 44.2,67.2 Z'],['L3','o',50,80,7.2],
    ['CsGs','e',62.2,85,4.6,2.3,-28],
    ['S1','e',36,86,2.3,1.4],['S2','e',36,90.4,2.3,1.4],['S3','e',36,94.8,2.3,1.4],['S4','e',36,99.2,2.3,1.4],
    ['lF','e',70.2,90.6,5.2,2,-12],
    ['lE','d','M60,95 C63,92.6 67,94 66.6,99 C66.2,106 66.6,112 66.6,118.5 C64.8,113 61,106 59.5,100 C59,98 59.2,96 60,95 Z'],
    ['lFs','d','M70.6,94.8 C73,93.6 74.9,95.4 74.5,98 C73.9,105 71.6,112 69.1,120.5 C68.3,113 68.2,105 68.8,98 C69.4,96.5 69.9,95.2 70.6,94.8 Z'],
    ['R1','o',50,105,7.2],['R2','o',50,125,7.2],['BFs','e',43.4,133.4,4.2,1.5,-55],['R3','o',50,145,7.2],
    ['rFs','e',45,158.5,4.8,2.9],['rAb','e',55,158.5,4.8,2.9],['rE','e',45,165,4.8,2.9],['rF','e',55,165,4.8,2.9]],
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
    ['R1','o',46,100,7],['R2','o',46,118,7],['AFs','e',36.5,127,2,3.4],['R3','o',46,136,7],
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
    if(tp==='d'){mk('path',{d:it[2],class:cls+' small'});continue;}
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
  const X=k=>22+(k-1)*33;const ps=String(p||1),adj=ps.startsWith('-')?-1:ps.startsWith('+')?1:0;p=parseInt(ps.replace(/[^0-9]/g,''))||1;
  mk('path',{d:'M4,10 H70 C78,10 82,4 96,0 V26 C82,22 78,16 70,16 H10 Z',class:'dgsil'});
  mk('path',{d:'M14,30 H60 M14,44 H60',class:'dgsilline'});
  const end=X(p)+12+adj*9;
  mk('path',{d:`M14,32 H${end} a5,5 0 0 1 0,10 H14`,class:'dgslide'});
  for(let k=1;k<=7;k++){const x=X(k),isP=k===p,isA=(alts||[]).includes(k);
    mk('line',{x1:x,y1:50,x2:x,y2:56,class:'dgtick'});
    if(isP||isA)mk('circle',{cx:x,cy:37,r:isP?11:9,class:'dgk '+(isP?'on':'alt')});
    mk('text',{x,y:isP||isA?41.5:68,'text-anchor':'middle',class:'dgvn'+(isP?' on':isA?' alt':' dim')},String(k));}
  if(adj){const x=X(p),y=62;mk('path',{d:adj<0?`M${x+4},${y} H${x-8} m4,-4 l-4,4 l4,4`:`M${x-4},${y} H${x+8} m-4,-4 l4,4 l-4,4`,class:'dgadj'});}
  return svg;
}

/* noms des clés (hors trous de doigts) pour la légende sous le schéma */
function dgKeyNames(inst){const pg=T('Auriculaire gauche'),pd=T('Auriculaire droit');return({
  flute:{thB:T('Clé de si (pouce)'),thBb:T('Levier de si♭ (pouce)'),Gs:T('Clé de sol♯'),Ds:T('Clé de mi♭'),Cs:T('Clé de do♯'),C:T('Clé de do grave'),Tr1:T('Clé de trille 1'),Tr2:T('Clé de trille 2')},
  clar:{Reg:T('Clé de registre'),A:T('Clé de la'),Gs:T('Clé de sol♯'),EbBb:T('Clé mi♭/si♭ (palette)'),CsGs:`${pg} : ${nl('do♯','sol♯')}`,lFs:`${pg} : ${nl('fa♯','do♯')}`,lE:`${pg} : ${nl('mi','si')}`,lF:`${pg} : ${nl('fa','do')}`,
    S1:T('Clé latérale')+' 1',S2:T('Clé latérale')+' 2',S3:T('Clé latérale')+' 3',S4:T('Clé latérale')+' 4',rAb:`${pd} : ${nl('la♭','mi♭')}`,rFs:`${pd} : ${nl('fa♯','do♯')}`,rE:`${pd} : ${nl('mi','si')}`,rF:`${pd} : ${nl('fa','do')}`,BFs:T('Clé de si/fa♯ (main droite)')},
  asax:{Oct:T('Clé d\'octave'),PD:T('Clé de paume')+' '+T('ré'),PEb:T('Clé de paume')+' '+T('mi♭'),PF:T('Clé de paume')+' '+T('fa'),FF:T('Fa avant'),Bis:T('Clé bis'),Gs:T('Clé de sol♯'),LCs:`${pg} : ${nl('do♯')}`,LB:`${pg} : ${nl('si')}`,LBb:`${pg} : ${nl('si♭')}`,
    SE:T('Clé latérale')+' '+T('mi'),SC:T('Clé latérale')+' '+T('do'),SBb:T('Clé latérale')+' '+T('si♭'),SFs:T('Clé de fa♯ aigu'),AFs:T('Clé de fa♯ auxiliaire'),REb:`${pd} : ${nl('mi♭')}`,RC:`${pd} : ${nl('do')}`}})[inst]||{};}
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
    if(I.kind==='tbn'){const p=alt||n.p;return el('figure',{class:'dgf'},dgSlideSvg(p,[],size),el('figcaption',{class:'dgv'},String(p).replace('-','−')));}
    const ks=alt?alt.k:n.k;let cap=null;
    if(I.data==='clar'&&altsOf(n).length){const side=k2=>{const L=k2.some(k=>/^(lE|lF|lFs|CsGs)$/.test(k)),R=k2.some(k=>/^(rE|rF|rFs|rAb)$/.test(k));
      const g=TL('G','L','I'),d=TL('D','R','D');return L&&R?g+'+'+d:L?g:R?d:null;};
      const all=[n.k,...altsOf(n).map(a=>a.k)].map(side);if(new Set(all).size>1)cap=side(ks);}
    return el('figure',{class:'dgf'},dgWindSvg(I.data,ks,size),size==='big'?(alt&&alt.l?el('figcaption',{},alt.l):cap?el('figcaption',{class:'dglr'},cap):null):cap?el('figcaption',{class:'dglr'},cap):null);};
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
  const legend=I.kind==='tbn'?el('p',{class:'dgkeyleg'},'− = rentrer légèrement la coulisse · + = la sortir légèrement'):I.kind==='ww'?el('p',{class:'dgkeyleg'},el('span',{class:'dglk on'}),' ','enfoncé',el('span',{class:'dglk off'}),' ','ouvert'):null;
  return el('div',{class:'dgwrap'},detail,el('section',{class:'mtsec'},el('div',{class:'dgcharthead'},el('h3',{},'Tableau des doigtés'),legend),el('p',{class:'hint'},'Touche une case pour voir le doigté en grand et l\'entendre.'),chart));
}

/* ---------- cordes : manche dessiné ---------- */
const DG_COL={C:'#E2312B',D:'#35A2DB',E:'#2BA35A',F:'#2C3A91',G:'#F0A132',A:'#D72679',B:'#7A3E9B'},DG_LSH='CCDDEFFGGAAB',DG_LFL='CDDEEFGGAABB';
const DG_SCOL=['#D2872C','#2F9C69','#2F73C2','#C2417E'];
const DG_FING={
  vln:['0','1 bas','1','2 bas','2','3','3 haut','4'],
  vc:['0','1 ext.','1','2','3','4','4 ext.'],
  cb:['0','1 (½ pos.)','1','2','4']};
let DG_UID=0;
/* manche façon tableau de guitare : bois, cordes, frettes régulières, notes en pastilles (naturelles claires, altérées foncées) */
function dgStringsView(I){
  const fret=I.kind==='fret',n=I.strings.length,maxF=fret?DG.frets:12,NS='http://www.w3.org/2000/svg',uid='dg'+(++DG_UID);
  const info=el('section',{class:'mtsec dgsinfo'});
  const SP=34,R=fret?15.5:14,PADX=19,NW=SP*(n-1)+PADX*2,ROW=fret?52:46,TOPH=34,NUT=fret?50:46;
  /* cordes frottées : espacement réel (de plus en plus serré vers le chevalet), façon affiche */
  const bowY=f=>f===0?20:NUT-10+1000*(1-2**(-f/12));
  const VW=NW+(fret?24:30),VH=fret?NUT+ROW*maxF+18:bowY(maxF)+R+14;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${VW} ${VH}`);svg.setAttribute('class','dgneck v4 '+(fret?'fret':'bow')+' '+I.id);
  const mk=(t,a,txt,parent)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;(parent||svg).append(e);return e;};
  const sx=i=>PADX+i*SP,rowY=f=>fret?(f===0?18:NUT+ROW*(f-0.5)):bowY(f);
  const defs=mk('defs',{});
  const g1=mk('linearGradient',{id:uid+'w',x1:0,y1:0,x2:1,y2:0},null,defs);
  (fret?[[0,'#5a3b26'],[.18,'#7a5236'],[.5,'#8a5f3f'],[.82,'#7a5236'],[1,'#5a3b26']]:[[0,'#141210'],[.2,'#26221e'],[.5,'#2f2a25'],[.8,'#26221e'],[1,'#141210']]).forEach(([o,c])=>mk('stop',{offset:o,'stop-color':c},null,g1));
  /* noms des cordes */
  /* touche en bois et quelques veines */
  mk('rect',{x:4,y:NUT-14,width:NW-8,height:VH-NUT+10,rx:3,fill:`url(#${uid}w)`,class:'dgwood4'});
  for(let k=0;k<7;k++){const x=10+k*(NW-20)/6+(k%2?3:-2);mk('path',{d:`M${x},${NUT-12} C${x+4},${NUT+ROW*3} ${x-4},${NUT+ROW*7} ${x+2},${VH-6}`,class:'dggrain'});}
  /* sillet, frettes (ou repères de demi-tons), cordes */
  mk('rect',{x:4,y:NUT-3,width:NW-8,height:6,class:'dgnut4'});
  if(!fret)for(let f=1;f<=maxF;f++){const fg=DG_FING[I.fing][f];if(!/^\d$/.test(fg||''))continue;const y=bowY(f);
    mk('rect',{x:0,y:y-1.6,width:NW+2,height:3.2,rx:1,class:'dgtape'});mk('text',{x:NW+5,y:y+4,class:'dgtapet'},TL(fg==='1'?'1er':fg+'e',fg==='1'?'1st':fg==='2'?'2nd':fg==='3'?'3rd':fg+'th',fg+'.º'));}
  for(let f=1;f<=maxF&&fret;f++){const y=NUT+ROW*f;mk('line',{x1:6,y1:y,x2:NW-6,y2:y,class:'dgfret4'});
    if(fret)mk('text',{x:NW+12,y:NUT+ROW*(f-0.5)+3,'text-anchor':'middle',class:'dgfnum'},String(f));}
  if(fret){for(const f of[3,5,7,9,15,17,19])if(f<=maxF)mk('circle',{cx:NW/2,cy:NUT+ROW*(f-0.5)+ (f%2?0:0),r:3.4,class:'dginlay4'});
    if(maxF>=12)for(const dx of[-SP,SP])mk('circle',{cx:NW/2+dx,cy:NUT+ROW*11.5,r:3.4,class:'dginlay4'});}
  I.strings.forEach((s,i)=>{const sh=I.short&&I.short.i===i,y1=sh?NUT+ROW*I.short.from:NUT-14;
    mk('line',{x1:sx(i),y1,x2:sx(i),y2:VH,class:'dgstr4',...(fret?{}:{style:`stroke:${DG_SCOL[i]}`}),'stroke-width':I.short?Math.max(1,2.6-(s-50)/12):Math.max(1,(fret?(I.id==='bass'?3.2:2.2):2)-i*(fret?(I.id==='bass'?0.4:0.25):0.3))});
    if(sh)mk('circle',{cx:sx(i),cy:y1,r:4,class:'dgpeg'});});
  /* notes */
  const dots=[],staffBoxes=[];
  const pick=(m,si,f,g)=>{dots.forEach(d=>{d.g.classList.toggle('same',d.m%12===m%12);d.g.classList.toggle('exact',d.m===m);d.g.classList.toggle('sel',d.g===g);});
    staffBoxes.forEach(b=>b.querySelectorAll('.abcjs-note').forEach(n=>n.classList.toggle('dgson',+n.dataset.m===m&&+n.dataset.si===si)));
    const fg=!fret&&DG_FING[I.fing][f];
    info.replaceChildren(el('div',{class:'dgdtop'},el('div',{class:'dgdname'},dgNameEl(m,'dgnm big'),el('span',{class:'dgsub'},
        `${T('Corde')} ${dgCap(T(dgName(I.strings[si],true)))} · `+(fret?(f===0?T('à vide'):`${T('case')} ${f}`):(f===0?T('à vide'):fg?`${T('doigt')} ${T(fg)}`:T('position plus haute'))))),
        btn('▶ Écouter',()=>dgPlay(m,I.timbre),'')),
      el('div',{class:'dgdmain'},dgStaff(m+I.tr,I.clef)),
      el('p',{class:'hint'},'En couleur : toutes les places qui donnent la même note ; en plus foncé, exactement la même hauteur.'));
    dgPlay(m,I.timbre);};
  I.strings.forEach((s,si)=>{for(let f=0;f<=maxF;f++){
    const sh=I.short&&I.short.i===si;if(sh&&f>0&&f<=I.short.from)continue;
    const m=s+(sh&&f>0?f-I.short.from:f),fg=!fret&&DG_FING[I.fing][f],first=!fret&&f>0&&!!fg,high=!fret&&f>0&&!fg;
    const x=sx(si),y=sh&&f===0?rowY(I.short.from):rowY(f);
    let g;
    if(!fret){g=mk('g',{class:'dgn5'+(dgBlack(m)?' acc':' nat')+(f===0?' open':''),tabindex:'0',role:'button'});
      const pc=((m%12)+12)%12,cs=DG_COL[DG_LSH[pc]],cf=DG_COL[DG_LFL[pc]],nm=fl=>dgCap(T(dgName(m,fl)));
      if(!dgBlack(m)){mk('circle',{cx:x,cy:y,r:R,class:'dgn5c'},null,g);mk('text',{x,y:y+4,'text-anchor':'middle',class:'dgn5t'},nm(false),g);}
      else{mk('circle',{cx:x,cy:y,r:R,class:'dgn5c'},null,g);
        mk('line',{x1:x-R,y1:y,x2:x+R,y2:y,class:'dgn5sep'},null,g);
        mk('text',{x,y:y-3.2,'text-anchor':'middle',class:'dgn5t s'},nm(false),g);mk('text',{x,y:y+10,'text-anchor':'middle',class:'dgn5t s'},nm(true),g);}
      mk('circle',{cx:x,cy:y,r:R,class:'dgn5ring'},null,g);
      const go=()=>pick(m,si,f,g);g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
      if(f===0)g.style.setProperty('--sc',DG_SCOL[si]);
      dots.push({g,m,si,f});continue;}
    g=mk('g',{class:'dgn4'+(dgBlack(m)?' acc':' nat')+(f===0?' open':'')+(high?' high':''),tabindex:'0',role:'button'});
    if(f===0){mk('rect',{x:x-SP/2+1,y:y-14,width:SP-2,height:26,rx:6,class:'dgn4hit'},null,g);mk('text',{x,y:y+6,'text-anchor':'middle',class:'dgsname'},dgCap(T(dgName(m,DG.flats))),g);}
    else{mk('circle',{cx:x,cy:y,r:R},null,g);
    mk('text',{x,y:y+4,'text-anchor':'middle',class:'dgn4t'},dgCap(T(dgName(m,DG.flats))),g);}
    if(first){const lab=fg.replace(' bas','↓').replace(' haut','↑').replace(' ext.','x').replace(' (½ pos.)','½');const w=lab.length>1?15:12.4;
      mk('rect',{x:x+R-3-w/2,y:y+R-10.2,width:w,height:12.4,rx:6.2,class:'dgn4b'},null,g);mk('text',{x:x+R-3,y:y+R-1.6,'text-anchor':'middle',class:'dgn4bt'},lab,g);}
    const go=()=>pick(m,si,f,g);g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    dots.push({g,m});}});
  const opts=el('div',{class:'dgopts'},
    el('div',{class:'seg'},...[[false,'♯ dièses'],[true,'♭ bémols']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.flats===v),onclick:()=>{DG.flats=v;dgSave();dgRender();}},l))),
    fret?el('div',{class:'seg'},...[[12,'Cases 0–12'],[19,'Cases 0–19']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.frets===v),onclick:()=>{DG.frets=v;dgSave();dgRender();}},l))):null);
  info.replaceChildren(el('p',{class:'hint'},fret?'Touche une note sur le manche pour l\'entendre et voir toutes les places qui la donnent.':'Touche une note pour l\'entendre. Les rubans blancs marquent la place des doigts en 1re position, comme sur les touches d\'élèves.'));
  S.keyHandler=null;
  /* cordes frottées : la portée, corde par corde (une couleur par corde), avec le doigt sous chaque note */
  let staffSec=null;
  if(!fret){
    const labOf=f=>DG_FING[I.fing][f].replace(' bas','↓').replace(' haut','↑').replace(' ext.','x').replace(' (½ pos.)','½');
    const abcN=m=>(DG.flats?dgAbcFlat:dgAbcNote)(m+I.tr);
    const rows=I.strings.map((s,si)=>{const fs=DG_FING[I.fing].map((x,f)=>f),box=el('div',{class:'dgsstaff'});staffBoxes.push(box);
      requestAnimationFrame(()=>{if(!box.isConnected||!HAS_ABC())return;
        ABCJS.renderAbc(box,`X:1\nL:1/4\nK:C clef=${I.clef}\n${fs.map(f=>abcN(s+f)+'4').join(' ')} |]\nw: ${fs.map(labOf).join(' ')}`,{add_classes:true,responsive:'resize',staffwidth:Math.max(270,Math.min(560,(box.clientWidth||560)-8)),scale:1,paddingtop:4,paddingbottom:0,paddingleft:0,paddingright:4,foregroundColor:'currentColor'});
        const ns=[...box.querySelectorAll('.abcjs-note')];ns.forEach((n,k)=>{const f=fs[k];if(f==null)return;n.dataset.m=s+f;n.dataset.si=si;n.dataset.f=f;});
        /* on touche près d'une note (pas forcément dans la tête de la ronde) : la plus proche horizontalement */
        box.onclick=e=>{let best=null,bd=1e9;ns.forEach(n=>{const r=n.getBoundingClientRect(),d=Math.abs(e.clientX-(r.left+r.right)/2);if(d<bd){bd=d;best=n;}});
          if(!best||bd>40)return;const f=+best.dataset.f,d=dots.find(d=>d.si===si&&d.f===f);pick(s+f,si,f,d&&d.g);};});
      const nm=dgCap(T(dgName(s,true)));
      return el('div',{class:'dgsrow',style:`--sc:${DG_SCOL[si]}`},el('div',{class:'dgstab'},el('b',{'data-notr':''},TL('Corde de '+nm.toLowerCase(),nm+' string','Cuerda de '+nm.toLowerCase()))),box);});
    staffSec=el('section',{class:'mtsec dgstaffsec'},el('h3',{},'Quelle corde ? Quel doigt ?'),
      el('p',{class:'hint'},'Chaque couleur est une corde. Sous chaque note : le doigt en 1re position (0 = corde à vide, ↓ bas, ↑ haut, x extension). Une même note peut parfois se jouer sur deux cordes. Touche une note pour l\'entendre et la voir sur la touche.'),
      el('div',{class:'dgsrows'},...rows));
  }
  return el('div',{class:'dgwrap dgstrings'},info,staffSec,el('section',{class:'mtsec dgnecksec'},el('h3',{},fret?'Toutes les notes du manche':'Notes de la touche'),opts,el('div',{class:'dgneckwrap'},svg)));
}


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
function dgStaff(m,clef,small){const box=el('div',{class:'dgstaff'+(small?' small':'')});
  requestAnimationFrame(()=>{if(!box.isConnected||!HAS_ABC())return;ABCJS.renderAbc(box,`X:1\nL:1/4\nK:C clef=${clef}\n${dgAbcNote(m)}4|]`,{add_classes:true,staffwidth:small?62:86,scale:small?.68:1.45,paddingleft:0,paddingright:2,paddingtop:0,paddingbottom:0,foregroundColor:'currentColor'});});
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
];
const DG_FAMS=['Bois','Cuivres','Cordes frottées','Cordes pincées'];

/* ---------- schémas des vents ---------- */
/* chaque élément : [id, type, x, y, (r|w,h), étiquette] ; type o = trou/anneau, k = petite clé, p = clé en pastille */
const nl=(...n)=>n.map(x=>dgCap(T(x))).join('/');
const DG_LAYOUT={
  flute:{w:280,h:96,body:[],items:()=>[
    ['thB','d','M20,72 Q31,62 47,64 L47,80 Q31,82 20,72 Z'],['thBb','d','M50,65 h14 a3,3 0 0 1 3,3 v8 a3,3 0 0 1 -3,3 h-14 z'],
    ['L1','o',28,38,12],['L2','o',58,38,12],['L3','o',88,38,12],['Gs','d','M104,31 A7,7 0 0 1 104,45 Z'],
    ['R1','o',140,38,12],['Tr1','k',155,19,4],['R2','o',170,38,12],['Tr2','k',185,19,4],['R3','o',200,38,12],
    ['Ds','d','M218,32 A9,9 0 0 1 218,50 Z'],['Cs','d','M236,29 h9 a4,4 0 0 1 4,4 v3 a4,4 0 0 1 -4,4 h-9 z'],['C','d','M236,45 h16 a3.5,3.5 0 0 1 0,7 h-16 z']],
    seps:[[120,22,120,54]],
    labels:[[58,14,'Main gauche'],[170,9,'Main droite'],[44,94,'Pouce']]},
  clar:{w:100,h:168,body:[],seps:[[34,84,54,84]],
    deco:[['M12,6 v28 M30,6 v28','dgbr']],
    items:()=>[
    ['Reg','d','M21,8 C26,15 27,21 27,24 A6,6 0 0 1 15,24 C15,21 16,15 21,8 Z'],['T','o',21,42,6],
    ['A','e',44,12,5.5,3],['Gs','e',56,19,4,2.6],
    ['L1','o',44,36,6.5],['EbBb','e',33,48,2.2,5],['L2','o',44,54,6.5],['L3','o',44,72,6.5],
    ['CsGs','e',76,78,3,3],['lFs','e',76,88,3.6,6,0],['lE','e',70,100,3.6,6,30],['lF','e',82,100,3.6,6,-30],
    ['S1','e',58,90,3.4,2],['S2','e',58,96,3.4,2],['S3','e',58,102,3.4,2],['S4','e',58,108,3.4,2],
    ['R1','o',44,96,6.5],['R2','o',44,114,6.5],['R3','o',44,132,6.5],
    ['rAb','e',37,149,6,4.2],['rFs','e',51,149,6,4.2],['rE','e',37,159,6,4.2],['rF','e',51,159,6,4.2]],
    labels:[]},
  asax:{w:150,h:340,body:[],seps:[[58,192,92,192]],items:()=>[
    ['Oct','k',30,70,7,'8va'],
    ['PD','p',22,22,22,9,dgCap(T('ré'))],['PEb','p',22,36,22,9,dgCap(T('mi♭'))],['PF','p',22,50,22,9,dgCap(T('fa'))],
    ['FF','k',96,48,5,'F'],['L1','o',75,72,11],['Bis','k',90,91,4,'bis'],['L2','o',75,110,11],['L3','o',75,148,11],
    ['Gs','p',30,168,28,9,dgCap(T('sol♯'))],['LCs','p',30,182,28,9,dgCap(T('do♯'))],['LB','p',30,196,28,9,dgCap(T('si'))],['LBb','p',30,210,28,9,dgCap(T('si♭'))],
    ['SE','p',122,176,22,9,dgCap(T('mi'))],['SC','p',122,190,22,9,dgCap(T('do'))],['SBb','p',122,204,22,9,dgCap(T('si♭'))],['SFs','p',122,218,22,9,dgCap(T('fa♯'))],
    ['R1','o',75,236,11],['R2','o',75,274,11],['R3','o',75,312,11],
    ['REb','p',114,300,24,9,dgCap(T('mi♭'))],['RC','p',114,314,24,9,dgCap(T('do'))]],
    labels:[]},
};
function dgWindSvg(inst,keys,size){
  const L=DG_LAYOUT[inst],on=new Set(keys),NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${L.w} ${L.h}`);svg.setAttribute('class','dgsvg '+inst+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);svg.append(e);return e;};
  for(const[x1,y1,x2,y2]of L.body)mk('line',{x1,y1,x2,y2,class:'dgbody'});
  for(const[x1,y1,x2,y2]of(L.seps||[]))mk('line',{x1,y1,x2,y2,class:'dgsep'});
  for(const[d,c]of(L.deco||[]))mk('path',{d,class:c});
  for(const it of L.items()){const[id,tp,x,y]=it,pressed=on.has(id),cls='dgk '+(pressed?'on':'off');
    if(tp==='d'){mk('path',{d:it[2],class:cls});continue;}
    if(tp==='e'){const a={cx:x,cy:y,rx:it[4],ry:it[5],class:cls+' small'};if(it[6])a.transform=`rotate(${it[6]} ${x} ${y})`;mk('ellipse',a);continue;}
    if(tp==='o'||tp==='k'){const r=it[4];mk('circle',{cx:x,cy:y,r,class:cls+(tp==='k'?' small':'')});
      if(it[5]&&tp==='k'){const t=mk('text',{x:x+(inst==='flute'?0:r+3),y:inst==='flute'?y+(y<50?-8:r+10):y+3,class:'dglab','text-anchor':inst==='flute'?'middle':'start'});t.textContent=it[5];}
      if(it[5]&&tp==='o'){const t=mk('text',{x:x-r-4,y:y+3,class:'dglab','text-anchor':'end'});t.textContent=it[5];}}
    else{const w=it[4],h=it[5];mk('rect',{x:x-w/2,y:y-h/2,width:w,height:h,rx:h/2,class:cls});
      const t=mk('text',{x:x,y:y+(inst==='flute'?h/2+9:3),class:'dglab'+(inst==='flute'?'':' in'+(pressed?' on':'')),'text-anchor':'middle'});t.textContent=it[6]||'';}}
  for(const[x,y,s]of L.labels){if(!s)continue;const t=mk('text',{x,y,class:'dgcap','text-anchor':'middle'});t.textContent=T(s);}
  return svg;
}
function dgValvesSvg(v,size){
  const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 120 54');svg.setAttribute('class','dgsvg tpt'+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  [1,2,3].forEach((n,i)=>{const x=22+i*38,c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',24);c.setAttribute('r',15);c.setAttribute('class','dgk '+(v.includes(n)?'on':'off'));svg.append(c);
    const t=document.createElementNS(NS,'text');t.setAttribute('x',x);t.setAttribute('y',29);t.setAttribute('text-anchor','middle');t.setAttribute('class','dgvn'+(v.includes(n)?' on':''));t.textContent=n;svg.append(t);});
  return svg;
}
function dgSlideSvg(p,alts,size){
  const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 240 58');svg.setAttribute('class','dgsvg tbn'+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.append(e);return e;};
  mk('line',{x1:14,y1:22,x2:228,y2:22,class:'dgbody'});
  for(let k=1;k<=7;k++){const x=14+(k-1)*34,isP=k===p,isA=(alts||[]).includes(k);
    mk('circle',{cx:x,cy:22,r:isP?11:isA?9:4,class:'dgk '+(isP?'on':isA?'alt':'off')+(isP||isA?'':' tick')});
    mk('text',{x,y:isP||isA?26:50,'text-anchor':'middle',class:'dgvn'+(isP?' on':isA?' alt':' dim')},String(k));}
  return svg;
}

/* noms des clés (hors trous de doigts) pour la légende sous le schéma */
function dgKeyNames(inst){const pg=T('Auriculaire gauche'),pd=T('Auriculaire droit');return({
  flute:{thB:T('Clé de si (pouce)'),thBb:T('Levier de si♭ (pouce)'),Gs:T('Clé de sol♯'),Ds:T('Clé de mi♭'),Cs:T('Clé de do♯'),C:T('Clé de do grave'),Tr1:T('Clé de trille 1'),Tr2:T('Clé de trille 2')},
  clar:{T:T('Trou du pouce'),Reg:T('Clé de registre'),A:T('Clé de la'),Gs:T('Clé de sol♯'),EbBb:T('Clé mi♭/si♭ (palette)'),CsGs:`${pg} : ${nl('do♯','sol♯')}`,lFs:`${pg} : ${nl('fa♯','do♯')}`,lE:`${pg} : ${nl('mi','si')}`,lF:`${pg} : ${nl('fa','do')}`,
    S1:T('Clé latérale')+' 1',S2:T('Clé latérale')+' 2',S3:T('Clé latérale')+' 3',S4:T('Clé latérale')+' 4',rAb:`${pd} : ${nl('la♭','mi♭')}`,rFs:`${pd} : ${nl('fa♯','do♯')}`,rE:`${pd} : ${nl('mi','si')}`,rF:`${pd} : ${nl('fa','do')}`},
  asax:{Oct:T('Clé d\'octave'),PD:T('Clé de paume')+' '+T('ré'),PEb:T('Clé de paume')+' '+T('mi♭'),PF:T('Clé de paume')+' '+T('fa'),FF:T('Fa avant'),Bis:T('Clé bis'),Gs:T('Clé de sol♯'),LCs:`${pg} : ${nl('do♯')}`,LB:`${pg} : ${nl('si')}`,LBb:`${pg} : ${nl('si♭')}`,
    SE:T('Clé latérale')+' '+T('mi'),SC:T('Clé latérale')+' '+T('do'),SBb:T('Clé latérale')+' '+T('si♭'),SFs:T('Clé de fa♯ aigu'),REb:`${pd} : ${nl('mi♭')}`,RC:`${pd} : ${nl('do')}`}})[inst]||{};}
function dgLegend(inst,keys){const N=dgKeyNames(inst),l=keys.filter(k=>N[k]&&k!=='T').map(k=>N[k]);return l.length?el('p',{class:'dgleg'},el('span',{class:'fl'},'Clés à presser'),...l.map(x=>el('span',{class:'dgkey','data-notr':''},x))):null;}

/* ---------- vue ---------- */
function dgInst(){return DG_INST.find(i=>i.id===DG.inst)||null;}
function dgRender(){
  const root=MOD.dg.root;if(!root)return;const I=dgInst();
  const picker=el('div',{class:'dgpick'},...DG_FAMS.map(f=>el('div',{class:'dgfam'},el('span',{class:'dgfl'},f),
    el('div',{class:'dgchips'},...DG_INST.filter(i=>i.fam===f).map(i=>el('button',{type:'button',class:'dgchip','aria-pressed':String(i.id===DG.inst),onclick:()=>{DG.inst=i.id;dgSave();dgRender();window.scrollTo({top:0,behavior:'smooth'});}},i.t))))));
  if(!I){root.replaceChildren(el('section',{class:'mtsec'},el('h3',{},'Choisis un instrument'),picker));S.keyHandler=null;return;}
  const head=el('div',{class:'dghead'},el('h2',{},I.t),el('p',{class:'hint'},I.info));
  let body;
  if(I.kind==='fret'||I.kind==='bow')body=dgStringsView(I);else body=dgWindView(I);
  root.replaceChildren(el('details',{class:'dgpickwrap'},el('summary',{},el('span',{class:'dgil'},'Instrument : '),el('b',{},I.t),el('span',{class:'dgchg'},'Changer')),picker),head,body);
}
/* vents : fiche de la note choisie + toutes les notes */
function dgWindView(I){
  const notes=DG_DATA[I.data];let cur=DG.sel[I.id];if(!notes.some(n=>n.m===cur))cur=notes.find(n=>n.m>=60&&n.m<=72)?.m??notes[0].m;
  const detail=el('section',{class:'mtsec dgdet'}),grid=el('div',{class:'dggrid '+I.data});
  const diag=(n,size,keys)=>I.kind==='tpt'?dgValvesSvg(keys||n.v,size):I.kind==='tbn'?dgSlideSvg(n.p,size==='big'?n.a:[],size):dgWindSvg(I.data,keys||n.k,size);
  const sound=m=>m+I.tr;
  const cards=new Map();
  const show=(m,scroll)=>{cur=m;DG.sel[I.id]=m;dgSave();const i=notes.findIndex(n=>n.m===m),n=notes[i];
    cards.forEach((c,k)=>c.setAttribute('aria-current',String(k===m)));
    const alts=[];
    if(I.kind==='tpt')(n.a||[]).forEach(v=>alts.push(el('figure',{class:'dgalt'},dgValvesSvg(v),el('figcaption',{},v.length?v.join('-'):'0'))));
    else if(I.kind!=='tbn')(n.a||[]).forEach(a=>alts.push(el('figure',{class:'dgalt'},dgWindSvg(I.data,a.k),el('figcaption',{},a.l||'Autre doigté'))));
    const label=I.kind==='tpt'?el('p',{class:'dgbig'},n.v.length?n.v.join('-'):'0'):I.kind==='tbn'?el('p',{class:'dgbig'},`${n.p}`,el('small',{},n.a&&n.a.length?` (${T('ou')} ${n.a.join(', ')})`:'')):null;
    const real=I.tr?el('p',{class:'hint'},'Son réel : ',el('b',{},dgCap(T(dgName(sound(m),true)))),I.tr===-2?' (un ton plus bas)':I.tr===-9?' (une sixte majeure plus bas)':''):null;
    detail.replaceChildren(...[
      el('div',{class:'dgdtop'},el('button',{type:'button',class:'btn quiet dgnav','aria-label':'Note précédente',disabled:i===0,onclick:()=>show(notes[i-1].m)},'‹'),
        el('div',{class:'dgdname'},dgNameEl(m,'dgnm big'),el('span',{class:'dgsub'},I.kind==='tbn'?'Position':I.kind==='tpt'?'Pistons':'Doigté')),
        el('button',{type:'button',class:'btn quiet dgnav','aria-label':'Note suivante',disabled:i===notes.length-1,onclick:()=>show(notes[i+1].m)},'›')),
      el('div',{class:'dgdmain'},dgStaff(m,I.clef),el('div',{class:'dgdiag'},diag(n,'big'),label)),
      el('div',{class:'qzbtns'},btn('▶ Écouter',()=>dgPlay(sound(m),I.timbre),'')),
      real,
      I.kind==='ww'?dgLegend(I.data,n.k):null,
      n.c?el('p',{class:'dgcom'},n.c):null,
      alts.length?el('div',{class:'dgalts'},el('span',{class:'fl'},alts.length>1?'Autres doigtés':'Autre doigté'),...alts):null].filter(Boolean));
    if(scroll)detail.scrollIntoView({behavior:'smooth',block:'start'});
  };
  for(const n of notes){const c=el('button',{type:'button',class:'dgcard','aria-current':'false',onclick:()=>{show(n.m,true);dgPlay(sound(n.m),I.timbre);}},
      dgNameEl(n.m),dgStaff(n.m,I.clef,true),el('div',{class:'dgmini'},diag(n,'mini')),
      I.kind==='tpt'?el('span',{class:'dgv'},n.v.length?n.v.join('-'):'0'):I.kind==='tbn'?el('span',{class:'dgv'},String(n.p)):null);
    cards.set(n.m,c);grid.append(c);}
  show(cur);
  S.keyHandler=e=>{const i=notes.findIndex(n=>n.m===cur);if(e.code==='ArrowRight'&&i<notes.length-1){show(notes[i+1].m);return true;}if(e.code==='ArrowLeft'&&i>0){show(notes[i-1].m);return true;}if(e.code==='Space'){dgPlay(sound(cur),I.timbre);return true;}};
  return el('div',{class:'dgwrap'},detail,el('section',{class:'mtsec'},el('h3',{},'Toutes les notes'),el('p',{class:'hint'},'Touche une note pour voir son doigté en grand et l\'entendre.'),grid));
}
/* cordes : manche (cases pour la guitare et la basse, touche sans frettes pour les cordes frottées) */
const DG_FING={
  vln:['0','1 bas','1','2 bas','2','3','3 haut','4'],
  vc:['0','1 ext.','1','2','3','4','4 ext.'],
  cb:['0','1 (½ pos.)','1','2','4']};
function dgStringsView(I){
  const fret=I.kind==='fret',n=I.strings.length,maxF=fret?DG.frets:12,NS='http://www.w3.org/2000/svg';
  const info=el('section',{class:'mtsec dgsinfo'});
  const wrap=el('div',{class:'dgneckwrap'});
  const horiz=false;
  /* géométrie réelle : distance du sillet = L·(1−2^(−f/12)) */
  const span=fret?maxF+0.6:13.2,LEN=horiz?1100:820,L=LEN/(1-Math.pow(2,-span/12));
  const pos=f=>L*(1-Math.pow(2,-f/12));
  const SP=horiz?34:48,PADV=SP*0.8,W=SP*(n-1)+PADV*2,NUT=horiz?56:62,TOT=NUT+LEN+12;
  const svg=document.createElementNS(NS,'svg');
  const VW=horiz?TOT:W+(fret?20:0),VH=horiz?W+(fret?16:0):TOT;svg.setAttribute('viewBox',`0 0 ${VW} ${VH}`);svg.setAttribute('class','dgneck '+(horiz?'h':'v')+(fret?' fret':' bow'));
  const P=(u,v)=>horiz?[u,W-v]:[v,u]; /* u : le long du manche ; v : en travers (corde grave à gauche / en bas) */
  const mk=(t,a,txt,parent)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;(parent||svg).append(e);return e;};
  const rect=(u1,v1,u2,v2,a)=>{const[x1,y1]=P(u1,v1),[x2,y2]=P(u2,v2);return mk('rect',Object.assign({x:Math.min(x1,x2),y:Math.min(y1,y2),width:Math.abs(x2-x1),height:Math.abs(y2-y1)},a));};
  const line=(u1,v1,u2,v2,a)=>{const[x1,y1]=P(u1,v1),[x2,y2]=P(u2,v2);return mk('line',Object.assign({x1,y1,x2,y2},a));};
  const sv=i=>PADV+i*SP;
  /* touche */
  if(fret)rect(NUT,4,NUT+LEN,W-4,{class:'dgwood',rx:6});
  else{const[a1,b1]=P(NUT,10),[a2,b2]=P(NUT+LEN,0),[a3,b3]=P(NUT+LEN,W),[a4,b4]=P(NUT,W-10);mk('path',{d:`M${a1},${b1} L${a2},${b2} L${a3},${b3} L${a4},${b4} Z`,class:'dgwood'});}
  rect(NUT-7,2,NUT,W-2,{class:'dgnut'});
  if(fret){for(let f=1;f<=maxF;f++)line(NUT+pos(f),4,NUT+pos(f),W-4,{class:'dgfret'});
    for(const f of[3,5,7,9,15,17,19])if(f<=maxF){const u=NUT+(pos(f-1)+pos(f))/2;const[x,y]=P(u,W/2);mk('circle',{cx:x,cy:y,r:5,class:'dginlay'});}
    if(maxF>=12){const u=NUT+(pos(11)+pos(12))/2;for(const v of[W/2-SP,W/2+SP]){const[x,y]=P(u,v);mk('circle',{cx:x,cy:y,r:5,class:'dginlay'});}}
    for(let f=1;f<=maxF;f++){const u=NUT+(pos(f-1)+pos(f))/2,[x,y]=P(u,horiz?0:W);mk('text',{x:horiz?x:W+17,y:horiz?W+12:y+4,class:'dgfnum','text-anchor':horiz?'middle':'end'},String(f));}}
  /* cordes */
  I.strings.forEach((s,i)=>line(NUT-4,sv(i),NUT+LEN,sv(i),{class:'dgstr','stroke-width':(fret?2.6:2.2)-i*(fret?0.35:0.3)}));
  /* notes */
  const dots=[];let sel=null;
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
    const u=f===0?NUT-30:fret?NUT+(pos(f-1)+pos(f))/2+ (f===1?4:0):NUT+pos(f);
    const[x,y]=P(u,sv(si));
    const g=mk('g',{class:'dgnote'+(f===0?' open':'')+(!fret&&f>0&&!fg?' high':'')+(first?' first':'')+(dgBlack(m)?' blk':''),tabindex:'0',role:'button'});
    const r=fret?15:(first||f===0?15:12);
    mk('circle',{cx:x,cy:y,r},null,g);
    mk('text',{x,y:y+(first?-1:4),'text-anchor':'middle',class:'dgnt'},dgCap(T(dgName(m,DG.flats))),g);
    if(first)mk('text',{x,y:y+9,'text-anchor':'middle',class:'dgfg'},T(fg),g);
    const go=()=>pick(m,si,f,g);g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    dots.push({g,m});}});
  /* noms des cordes à la tête */
  wrap.append(svg);
  const opts=el('div',{class:'dgopts'},
    el('div',{class:'seg'},...[[false,'♯ dièses'],[true,'♭ bémols']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.flats===v),onclick:()=>{DG.flats=v;dgSave();dgRender();}},l))),
    fret?el('div',{class:'seg'},...[[12,'Cases 0–12'],[19,'Cases 0–19']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.frets===v),onclick:()=>{DG.frets=v;dgSave();dgRender();}},l))):null);
  info.replaceChildren(el('p',{class:'hint'},fret?'Touche une note sur le manche pour l\'entendre et voir toutes les places qui la donnent.':'Touche une note pour l\'entendre. Les grands ronds montrent la 1re position, avec le numéro du doigt ; les petits, les positions plus hautes.'));
  S.keyHandler=null;
  return el('div',{class:'dgwrap'},info,el('section',{class:'mtsec'},el('h3',{},fret?'Toutes les notes du manche':'Notes de la touche'),opts,wrap));
}


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
  {id:'oboe',fam:'Bois',t:'Hautbois',kind:'ww',data:'oboe',clef:'treble',tr:0,info:'En do : on lit les notes réelles. Demi-trou : l\'index gauche est levé et seul le petit point sous le trou est noir.'},
  {id:'bsn',fam:'Bois',t:'Basson',kind:'ww',data:'bsn',clef:'bass',tr:0,info:"En clé de fa, au son réel, d'après le tableau de David Wells. À gauche du trait : les clés des pouces ; à droite : les trous et les clés des doigts. Main gauche en haut, main droite en bas. Le demi-trou est dessiné à moitié plein et les clés de « flick » sont en orange."},
  {id:'clar',fam:'Bois',t:'Clarinette en si♭',kind:'ww',data:'clar',clef:'treble',tr:-2,info:'Notes écrites. Le son réel est un ton plus bas.'},
  {id:'asax',fam:'Bois',t:'Saxophone alto',kind:'ww',data:'asax',clef:'treble',tr:-9,info:'En mi♭ : notes écrites. Le son réel est une sixte majeure plus bas.'},
  {id:'tpt',fam:'Cuivres',t:'Trompette en si♭',kind:'tpt',data:'tpt',clef:'treble',tr:-2,info:'Notes écrites. Le son réel est un ton plus bas. 0 = aucun piston.'},
  {id:'tbn',fam:'Cuivres',t:'Trombone',kind:'tbn',data:'tbn',clef:'bass',tr:0,info:'Notes réelles en clé de fa. Positions de la coulisse : 1 (fermée) à 7 (la plus sortie).'},
  {id:'tuba',fam:'Cuivres',t:'Tuba',kind:'tpt',data:'tuba',clef:'bass',tr:0,info:'Tuba en si♭ (BB♭) à 3 pistons, en clé de fa et au son réel. 0 = aucun piston.'},
  {id:'vln',fam:'Cordes frottées',t:'Violon',kind:'bow',strings:[55,62,69,76],clef:'treble',tr:0,fing:'vln',info:'Cordes sol, ré, la, mi. Doigts en 1re position : 0 = corde à vide, 1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire.'},
  {id:'vla',fam:'Cordes frottées',t:'Alto',kind:'bow',strings:[48,55,62,69],clef:'alto',tr:0,fing:'vln',info:'Cordes do, sol, ré, la (clé d\'ut 3e ligne). Mêmes doigtés que le violon, une quinte plus bas.'},
  {id:'vc',fam:'Cordes frottées',t:'Violoncelle',kind:'bow',strings:[36,43,50,57],clef:'bass',tr:0,fing:'vc',info:'Cordes do, sol, ré, la. Doigts en 1re position : 1 à 4, un doigt par demi-ton.'},
  {id:'cb',fam:'Cordes frottées',t:'Contrebasse',kind:'bow',strings:[28,33,38,43],clef:'bass',tr:12,fing:'cb',info:'Cordes mi, la, ré, sol. S\'écrit une octave plus haut que le son réel. Doigtés 1-2-4 (méthode Simandl).'},
  {id:'gtr',fam:'Cordes pincées',t:'Guitare',kind:'fret',strings:[40,45,50,55,59,64],clef:'treble',tr:12,timbre:'guitare',info:'Accordage standard mi, la, ré, sol, si, mi. S\'écrit une octave plus haut que le son réel.'},
  {id:'bass',fam:'Cordes pincées',t:'Basse électrique',kind:'fret',strings:[28,33,38,43],clef:'bass',tr:12,timbre:'guitare',info:'Accordage standard mi, la, ré, sol. S\'écrit une octave plus haut que le son réel.'},
  {id:'mando',fam:'Cordes pincées',t:'Mandoline',kind:'fret',strings:[55,62,69,76],clef:'treble',tr:0,timbre:'guitare',info:'Quatre paires de cordes accordées sol, ré, la, mi, comme le violon. S\'écrit au son réel.'},
  {id:'banjo',fam:'Cordes pincées',t:'Banjo 5 cordes',kind:'fret',strings:[67,50,55,59,62],short:{i:0,from:5},clef:'treble',tr:12,timbre:'guitare',info:'Accordage en sol ouvert : sol aigu (5e corde, courte), ré, sol, si, ré. La 5e corde commence à la 5e case. S\'écrit une octave plus haut que le son réel.'},
  {id:'drums',fam:'Percussions',t:'Batterie',kind:'drum',info:'Portée à 5 lignes sans hauteur précise (clé de percussion) : chaque ligne ou interligne correspond à un élément de la batterie.'},
];
const DG_FAMS=['Bois','Cuivres','Cordes frottées','Cordes pincées','Percussions'];

/* ---------- schémas des vents (façon tableau de méthode) ---------- */
/* items : [id,'o',x,y,r] trou · [id,'e',x,y,rx,ry,rot] petite clé · [id,'d',path] clé dessinée.
   sil : silhouette discrète de l'instrument, dessinée derrière les clés */
const nl=(...n)=>n.map(x=>dgCap(T(x))).join('/');
const DG_LAYOUT={
  flute:{vb:'4 6 304 100',
    /* disposition des tableaux de méthode (ex. Quality Music Gear) : pouce en bas à gauche, sol♯ en drapeau au-dessus,
       levier de si♭ et clés de trille sous la main droite, mi♭ en « d », rouleaux de la patte empilés, clé gizmo */
    sil:[],seps:[],
    items:()=>[
    ['thBb','d','M12,74 a4,4 0 0 1 4,-4 h50 v6 h-38 v18 a6,6 0 0 1 -6,6 h-4 a6,6 0 0 1 -6,-6 Z'],
    ['thB','d','M40,82 h36 a18,18 0 0 1 -36,0 Z'],
    ['L1','o',30,50,10],['L2','o',66,50,14],['L3','o',100,50,14],
    ['Gs','d','M104,17 a3,3 0 0 1 3,-3 h18 a3,3 0 0 1 3,3 v35 h-6 v-32 h-15 a3,3 0 0 1 -3,-3 Z'],
    ['Bbl','d','M116,76 a2,2 0 0 1 2,-2 h14 a7,6 0 0 1 14,0 v4 a2,2 0 0 1 -2,2 h-26 a2,2 0 0 1 -2,-2 Z'],
    ['R1','o',160,50,14],['Tr1','e',178,72,4.5,7],['R2','o',196,50,14],['Tr2','e',214,72,4.5,7],['R3','o',232,50,14],
    ['Ds','d','M254,50 h6 v44 h-16 v-12 C244,74 247,70 254,70 Z'],
    ['Bft','d','M270,46 h22 a3,3 0 0 1 0,6 h-22 a3,3 0 0 1 0,-6 Z'],['C','d','M270,56 h22 a3,3 0 0 1 0,6 h-22 a3,3 0 0 1 0,-6 Z'],
    ['Cs','d','M268,68 h26 v3 a13,11 0 0 1 -26,0 Z'],
    ['Gz','d','M302,52 c3,4 4,7 4,9 a4,4 0 0 1 -8,0 c0,-2 1,-5 4,-9 Z']],
    labels:[]},
  clar:{vb:'4 8 74 242',
    /* disposition des tableaux de méthode (style Bret Pimentel) : clé de registre en goutte au-dessus du trou du pouce,
       colonne des trous, auriculaire gauche à droite de l'annulaire, auriculaire droit en 2 × 2 sous la colonne.
       Les petites clés (la, sol♯, clés latérales, palette, si/fa♯) n'apparaissent que quand on les utilise. */
    sil:[],seps:[],
    opt:{A:['A','Gs'],Gs:['Gs'],S1:['S1','S2','S3','S4'],S2:['S1','S2','S3','S4'],S3:['S1','S2','S3','S4'],S4:['S1','S2','S3','S4'],EbBb:['EbBb'],BFs:['BFs']},
    items:()=>[
    ['Reg','d','M16,13 C18,18 19.4,21.5 19.4,24 a3.4,3.4 0 0 1 -6.8,0 C12.6,21.5 14,18 16,13 Z'],['T','o',16,42,6],
    ['A','d','M41,34 c1.6,3.6 2.8,6.2 2.8,7.8 a2.8,2.8 0 0 1 -5.6,0 c0,-1.6 1.2,-4.2 2.8,-7.8 Z'],
    ['Gs','d','M50,34 c1.6,3.6 2.8,6.2 2.8,7.8 a2.8,2.8 0 0 1 -5.6,0 c0,-1.6 1.2,-4.2 2.8,-7.8 Z'],
    ['L1','o',41,64,9],['L2','o',41,89,9],['EbBb','d','M44,100 Q50,103.5 56,96.5 Q50,101 45,97.8 Z'],['L3','o',41,116,9],
    ['CsGs','e',55,124,7.5,3.2,-15],['lF','e',66,131,7.5,3.2,-22],
    ['lE','d','M50,138 C51.5,133 58.5,132.5 60,137.5 C61,147 60,156 58,166 C55,157 51.5,148 50,141 Z'],
    ['lFs','d','M66,137 C69,135 72,137 71,141 C69.5,151 66.5,161 61.5,172 C61.5,161 63,150 64,142 C64.2,139.5 65,137.8 66,137 Z'],
    ['S1','e',20,128,3.4,1.8],['S2','e',20,134,3.4,1.8],['S3','e',20,140,3.4,1.8],['S4','e',20,146,3.4,1.8],
    ['R1','o',41,157,9],['R2','o',41,183,9],['BFs','e',53,193,5,1.6,-55],['R3','o',41,210,9],
    ['rFs','e',29,229,5.6,3.8],['rAb','e',41,229,5.6,3.8],['rE','e',29,239,5.6,3.8],['rF','e',41,239,5.6,3.8]],
    labels:[]},
  oboe:{vb:'12 0 58 127',
    /* disposition des tableaux de méthode (Essential Elements) : clé d'octave du pouce entre deux barres,
       colonne des trous, 2e clé d'octave à droite de l'index, sol♯ en biais, groupe de l'auriculaire gauche
       en « fleur » à côté du trait, clé de fa sous le majeur droit, groupe de l'auriculaire droit en bas */
    sil:[],seps:[[36,59,44,59]],deco:[['M18,4 v19 M30,4 v19','dgbr'],['M27,106 h15 M27,113 h15 M27,120 h15','dgbr']],
    items:()=>[
    ['Oct1','d','M24,6 C26.5,11 27.6,14.5 27.6,17 a3.6,3.6 0 0 1 -7.2,0 C20.4,14.5 21.5,11 24,6 Z'],
    ['Oct2','d','M46.5,8 h2.8 a1.4,1.4 0 0 1 1.4,1.4 v6.2 a1.4,1.4 0 0 1 -1.4,1.4 h-2.8 a1.4,1.4 0 0 1 -1.4,-1.4 v-6.2 a1.4,1.4 0 0 1 1.4,-1.4 Z'],
    ['L1','o',40,15,5.4],['L1h','o',40,23.4,2.1],['L2','o',40,33,5.4],['L3','o',40,47,5.4],
    ['Gs','e',48.5,50.5,5,1.5,-28],
    ['lEb','d','M50,59 c-2,-3 -2,-7 1,-8 c2,1 2,5 1,8 Z'],['lB','d','M53,57 c0,-4 3,-7 7,-6 c1,3 -2,6 -7,6 Z'],
    ['lBb','d','M55,58.5 h3.2 a3.3,3.1 0 0 1 0,6.2 h-1 v4.2 h-2.2 Z'],
    ['R1','o',40,67,5.4],['R2','o',40,81,5.4],['Fk','d','M35,88 h10 a1.2,1.2 0 0 1 0,2.4 h-10 a1.2,1.2 0 0 1 0,-2.4 Z'],['R3','o',40,98,5.4],
    ['rC','d','M23,108 c0,-3 4,-5 8,-4.5 c3,.4 6,1.5 8,3.6 c-3,1.5 -6,2.1 -9,2.1 c-4,0 -7,0 -7,-1.2 Z'],
    ['rCs','e',36,110,3,2.2],
    ['rEb','d','M22,116.5 c0,-3.6 4,-5.4 8,-4.6 c3,.6 5,2.3 7,4 c2,.1 4,.4 6,1.2 c-4,1.4 -8,1.8 -12,2 c-5,.3 -9,.2 -9,-2.6 Z']],
    labels:[]},
  bsn:{vb:'-45 -56 81 124',
    /* disposition des tableaux de basson (pouces à gauche du trait, doigts à droite), formes de clés dessinées pour MusicDEV ;
       main gauche au-dessus du trait horizontal ; mi aigu, mi♭ aigu et trille de do♯ n'apparaissent que quand on s'en sert */
    sil:[],seps:[[0,-46.8,0,44.2],[-21.6,0,21.4,0]],
    opt:{hE:['hE'],hEb:['hEb'],Cst:['Cst'],L1h:['L1h']},
    items:()=>[
    ['tC','d','M-33.8,-37.8 L-35.5,-37.7 L-37.1,-37.4 L-38.6,-36.9 L-39.9,-36.2 L-41,-35.4 L-41.7,-34.5 L-42.2,-33.5 L-42.4,-32.4 L-42.2,-31.3 L-41.7,-30.3 L-41,-29.4 L-39.9,-28.6 L-38.6,-27.9 L-37.1,-27.4 L-35.5,-27.1 L-33.8,-27 Z'],
    ['tB','d','M-32.5,-42.4 L-32.5,-42.8 L-32.3,-43.1 L-32,-43.3 L-31.6,-43.4 L-31.2,-43.3 L-30.9,-43.1 L-30.6,-42.8 L-30.5,-42.4 L-27.8,-30.2 L-27.9,-29.3 L-28.4,-28.5 L-29.1,-28 L-30,-27.8 L-30.9,-28 L-31.8,-28.5 L-32.4,-29.3 L-32.6,-30.2 Z'],
    ['tBb','d','M-26.7,-42.8 L-26.7,-43.2 L-26.5,-43.5 L-26.2,-43.7 L-25.8,-43.8 L-25.4,-43.7 L-25.1,-43.5 L-24.8,-43.2 L-24.7,-42.8 L-22,-30.6 L-22.1,-29.7 L-22.6,-28.9 L-23.3,-28.4 L-24.2,-28.2 L-25.1,-28.4 L-26,-28.9 L-26.6,-29.7 L-26.8,-30.6 Z'],
    ['tHD','d','M-16.6,-44.7 L-16.5,-45 L-16.3,-45.3 L-16,-45.5 L-15.6,-45.6 L-15.3,-45.5 L-15,-45.3 L-14.8,-45 L-14.8,-44.7 L-13.6,-36.7 L-13.9,-35.6 L-14.7,-34.6 L-15.7,-34 L-16.8,-33.8 L-17.9,-34 L-18.8,-34.6 L-19.3,-35.6 L-19.4,-36.7 Z'],
    ['tHC','d','M-11.8,-38.2 L-9.4,-38.2 L-9.4,-28.2 L-10.6,-28.2 L-10.8,-27.4 L-11.5,-26.8 L-12.6,-26.4 L-13.8,-26.2 L-15,-26.4 L-16.1,-26.8 L-16.8,-27.4 L-17,-28.2 L-15.8,-29.4 L-11.8,-29.4 Z'],
    ['tD','d','M-39.9,-21 L-39.7,-22.2 L-39,-23.3 L-37.9,-24 L-36.7,-24.2 L-35.5,-24 L-34.4,-23.3 L-33.7,-22.2 L-33.5,-21 L-35.6,-4.1 L-35.7,-3.7 L-35.9,-3.3 L-36.3,-3.1 L-36.7,-3 L-37.1,-3.1 L-37.5,-3.3 L-37.7,-3.7 L-37.8,-4.1 Z'],
    ['tA','d','M-5.3,-23.1 L-4.6,-23 L-3.9,-22.6 L-3.4,-22.1 L-3,-21.4 L-2.9,-20.7 L-2.9,-20.7 L-3,-20 L-3.4,-19.3 L-3.9,-18.8 L-4.6,-18.4 L-5.3,-18.3 L-15.7,-18.3 L-16.4,-18.4 L-17.1,-18.8 L-17.6,-19.3 L-18,-20 L-18.1,-20.7 L-18.1,-20.7 L-18,-21.4 L-17.6,-22.1 L-17.1,-22.6 L-16.4,-23 L-15.7,-23.1 Z'],
    ['tCs','d','M-12.2,-15.4 L-9.6,-15.4 L-9.6,-5.4 L-10.9,-5.4 L-11.2,-4.6 L-12.2,-4 L-13.6,-3.6 L-15.2,-3.4 L-16.8,-3.6 L-18.2,-4 L-19.2,-4.6 L-19.5,-5.4 L-18.2,-6.6 L-12.2,-6.6 Z'],
    ['W','e',-18,-4.9,4,2.5],
    ['rBb','d','M-25.7,10.8 L-25.1,9.3 L-24.1,7.9 L-23,6.8 L-21.6,5.8 L-20.1,5.1 L-18.4,4.6 L-16.7,4.5 L-15,4.6 L-13.4,5 L-11.8,5.7 L-10.5,6.6 L-9.2,7.7 L-10.9,9.1 L-11.9,8.2 L-12.9,7.5 L-14.1,7 L-15.4,6.7 L-16.7,6.6 L-18,6.7 L-19.3,7 L-20.4,7.6 L-21.5,8.3 L-22.4,9.2 L-23.1,10.3 L-23.6,11.4 Z'],
    ['rE','o',-16.2,15,6.4],
    ['rFs','d','M-18.2,27.7 L-17.7,26.7 L-17.1,25.8 L-16.4,25 L-15.5,24.4 L-14.5,23.9 L-13.4,23.6 L-12.3,23.4 L-11.2,23.4 L-10.2,23.7 L-9.1,24.1 L-8.2,24.6 L-7.3,25.3 L-8.7,26.7 L-9.3,26.3 L-10,25.9 L-10.7,25.6 L-11.5,25.4 L-12.2,25.4 L-13,25.5 L-13.7,25.7 L-14.4,26.1 L-15,26.5 L-15.6,27.1 L-16,27.7 L-16.3,28.4 Z'],
    ['rAb','d','M-14,32.7 L-13.5,31.7 L-12.9,30.8 L-12.2,30 L-11.3,29.4 L-10.3,28.9 L-9.2,28.6 L-8.1,28.4 L-7,28.4 L-6,28.7 L-4.9,29.1 L-4,29.6 L-3.1,30.3 L-4.5,31.7 L-5.1,31.3 L-5.8,30.9 L-6.5,30.6 L-7.3,30.4 L-8,30.4 L-8.8,30.5 L-9.5,30.7 L-10.2,31.1 L-10.8,31.5 L-11.4,32.1 L-11.8,32.7 L-12.1,33.4 Z'],
    ['hE','e',17.6,-51.6,5.8,1.3,-15],
    ['L1','o',10.6,-42.6,5.2],
    ['L1h','d','M5.4,-42.6 A5.2,5.2 0 0 0 15.8,-42.6 Z'],
    ['hEb','e',17.6,-35.6,5.8,1.3,-15],
    ['L2','o',10.6,-27.4,5.2],
    ['L3','o',10.6,-12.2,5.2],
    ['lEb','d','M19.1,-10.8 L19.3,-11.8 L19.8,-12.8 L20.7,-13.6 L21.8,-14.3 L23.1,-14.7 L24.5,-14.8 L25.9,-14.7 L27.2,-14.3 L28.3,-13.6 L29.2,-12.8 L29.7,-11.8 L29.9,-10.8 Z'],
    ['lCs','d','M19.1,-7.8 L19.3,-6.8 L19.8,-5.8 L20.7,-5 L21.8,-4.3 L23.1,-3.9 L24.5,-3.8 L25.9,-3.9 L27.2,-4.3 L28.3,-5 L29.2,-5.8 L29.7,-6.8 L29.9,-7.8 Z'],
    ['R1','o',10.6,11.2,5.2],
    ['Cst','d','M16,8.5 L15.8,7.1 L16.1,5.7 L16.9,4.5 L18.1,3.7 L19.5,3.4 L20.9,3.6 L22.1,4.4 L23,5.5 L23.4,6.9 L23.2,8.3 L22.6,9.6 L21.5,10.5 L20.7,9.1 L21.3,8.6 L21.7,7.8 L21.8,7 L21.6,6.2 L21.1,5.6 L20.4,5.1 L19.5,5 L18.7,5.2 L18,5.6 L17.6,6.3 L17.4,7.1 L17.5,8 Z'],
    ['R2','o',10.6,26.6,5.2],
    ['R3','e',10.6,42.2,7,3.2],
    ['pF','d','M24.1,49.7 L24.5,50 L24.7,50.5 L24.8,51 L24.8,51.5 L24.5,51.9 L22.7,54.5 L22.4,54.9 L21.9,55.1 L21.4,55.2 L20.9,55.2 L20.5,54.9 L17.9,53.1 L17.5,52.8 L17.3,52.3 L17.2,51.8 L17.2,51.3 L17.5,50.9 L19.3,48.3 L19.6,47.9 L20.1,47.7 L20.6,47.6 L21.1,47.6 L21.5,47.9 Z'],
    ['pFs','d','M27.2,53.4 L27.8,53.1 L28.5,53 L29.1,53.1 L29.8,53.4 L30.2,53.9 L32.5,57.2 L32.8,57.8 L32.9,58.5 L32.8,59.2 L32.5,59.8 L32,60.2 L30.8,61 L30.2,61.3 L29.5,61.4 L28.9,61.3 L28.2,61 L27.8,60.5 L25.5,57.2 L25.2,56.6 L25.1,55.9 L25.2,55.2 L25.5,54.6 L26,54.2 Z'],
    ['pAb','d','M21.9,58.8 L22.4,59.1 L22.7,59.6 L22.8,60.1 L22.8,60.7 L22.6,61.2 L21.2,63.7 L20.8,64.1 L20.4,64.4 L19.8,64.6 L19.3,64.5 L18.7,64.3 L14.1,61.6 L13.6,61.3 L13.3,60.8 L13.2,60.3 L13.2,59.7 L13.4,59.2 L14.8,56.7 L15.2,56.3 L15.6,56 L16.2,55.8 L16.7,55.9 L17.3,56.1 Z']],
    labels:[]},
  asax:{vb:'12 -8 58 116',
    /* disposition des tableaux de méthode (Essential Elements) : clé d'octave entre deux barres, colonne des trous ;
       les autres clés (paume, fa avant, bis, table de l'auriculaire gauche, clés latérales, auriculaire droit)
       n'apparaissent que quand on s'en sert, comme dans les tableaux */
    sil:[],seps:[[36,52,44,52]],deco:[['M18,6 v18 M30,6 v18','dgbr']],
    opt:{FF:['FF'],Bis:['Bis'],PD:['PD','PEb','PF'],PEb:['PD','PEb','PF'],PF:['PD','PEb','PF'],
      Gs:['Gs','LCs','LB','LBb'],LCs:['Gs','LCs','LB','LBb'],LB:['Gs','LCs','LB','LBb'],LBb:['Gs','LCs','LB','LBb'],
      SE:['SE','SC','SBb'],SC:['SE','SC','SBb'],SBb:['SE','SC','SBb'],SFs:['SFs'],AFs:['AFs'],REb:['REb','RC'],RC:['REb','RC']},
    items:()=>[
    ['Oct','d','M24,6 C26.5,11 27.6,14.5 27.6,17 a3.6,3.6 0 0 1 -7.2,0 C20.4,14.5 21.5,11 24,6 Z'],
    ['FF','o',40,3.5,2],
    ['PD','d','M47,-3 c3,-1 6,-1 9,1 c1,1 0,2 -1,1.6 c-2.6,-1.2 -5,-1.2 -7.6,-.2 Z'],
    ['PEb','d','M48.5,2.5 c3,-1 6,-1 9,1 c1,1 0,2 -1,1.6 c-2.6,-1.2 -5,-1.2 -7.6,-.2 Z'],
    ['PF','d','M50,8 c3,-1 6,-1 9,1 c1,1 0,2 -1,1.6 c-2.6,-1.2 -5,-1.2 -7.6,-.2 Z'],
    ['L1','o',40,15,5.2],['Bis','o',40,22.2,1.7],['L2','o',40,29,5.2],['L3','o',40,43,5.2],
    ['Gs','d','M47,49.5 a4.5,3.2 0 0 1 9,0 v1 h-9 Z'],['LCs','d','M47,51.5 h4.5 v3 h-4.5 Z'],['LB','d','M51.5,51.5 h4.5 v3 h-4.5 Z'],
    ['LBb','d','M47,55.5 h9 v1 a4.5,3.2 0 0 1 -9,0 Z'],
    ['SFs','e',32,55.5,1.4,2.1],['SE','e',32,61,1.4,2.1],['SC','e',32,66,1.4,2.1],['SBb','e',32,71,1.4,2.1],
    ['R1','o',40,61,5.2],['R2','o',40,75,5.2],['AFs','d','M32.5,80 h2 v5 h-2 Z'],['R3','o',40,89,5.2],
    ['REb','d','M29.4,98 a3.6,3.6 0 0 1 7.2,0 Z'],['RC','d','M29.4,98.4 h7.2 a3.6,3.6 0 0 1 -7.2,0 Z']],
    labels:[]},
};
function dgWindSvg(inst,keys,size){
  const L=DG_LAYOUT[inst],fl=new Set(keys.filter(k=>k[0]==='~').map(k=>k.slice(1))),on=new Set(keys.map(k=>k.replace('~',''))),NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',L.vb);svg.setAttribute('class','dgsvg '+inst+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);svg.append(e);return e;};
  {const g=mk('g',{class:'dgsilg'});const sp=(d,c)=>{const e=document.createElementNS(NS,'path');e.setAttribute('d',d);e.setAttribute('class',c);g.append(e);};
   (L.sil||[]).forEach(d=>sp(d,'dgsilf'));(L.silS||[]).forEach(d=>sp(d,'dgsils'));(L.silF||[]).forEach(d=>sp(d,'dgsilf'));}
  for(const[x1,y1,x2,y2]of(L.seps||[]))mk('line',{x1,y1,x2,y2,class:'dgsep'});
  for(const[d,c]of(L.deco||[]))mk('path',{d,class:c});
  for(const it of L.items()){const[id,tp,x,y]=it,cls='dgk '+(on.has(id)?'on':'off')+(fl.has(id)?' flick':'');
    if(L.opt&&L.opt[id]&&!L.opt[id].some(k=>on.has(k)))continue; /* clé dessinée seulement quand elle sert (comme les tableaux) */
    if(tp==='d'){mk('path',{d:it[2],class:cls+' small'});continue;}
    if(tp==='h'){if(on.has(id)){const r=it[4];mk('path',{d:`M${x},${y-r} A${r},${r} 0 0 0 ${x},${y+r} Z`,class:'dgk on half'});}continue;}
    if(tp==='e'){const a={cx:x,cy:y,rx:it[4],ry:it[5],class:cls+' small'};if(it[6])a.transform=`rotate(${it[6]} ${x} ${y})`;mk('ellipse',a);continue;}
    mk('circle',{cx:x,cy:y,r:it[4],class:cls});}
  for(const[x,y,s]of(L.labels||[])){const t=mk('text',{x,y,class:'dgcap','text-anchor':'middle'});t.textContent=T(s);}
  return svg;
}
/* trompette : trois pistons sur une silhouette de trompette */
function dgValvesSvg(v,size,inst){
  const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 170 70');svg.setAttribute('class','dgsvg tpt'+(size?' '+size:''));svg.setAttribute('aria-hidden','true');
  const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.append(e);return e;};
  if(inst==='tuba'){mk('path',{d:'M18,62 C6,62 6,38 18,36 H124 C136,36 138,22 132,6 H164 C156,22 150,46 140,56 C134,62 128,62 120,62 Z',class:'dgsil'});}
  else{  mk('path',{d:'M2,46 h6 v-4 h4 v8 h-4 v-4 M12,44 H120 C136,44 150,34 166,22 V66 C150,54 136,48 120,48 H12 Z',class:'dgsil'});
  mk('path',{d:'M30,58 C24,58 22,62 30,64 H112 C120,62 118,58 112,58',class:'dgsilline'});}
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
  flute:{thB:T('Clé de si (pouce)'),thBb:T('Levier de si♭ (pouce)'),Gs:T('Clé de sol♯'),Ds:T('Clé de mi♭'),Cs:T('Clé de do♯'),C:T('Clé de do grave'),Tr1:T('Clé de trille 1'),Tr2:T('Clé de trille 2'),Bbl:T('Levier de si♭ (main droite)'),Bft:T('Rouleau de si grave'),Gz:T('Clé « gizmo »')},
  clar:{Reg:T('Clé de registre'),A:T('Clé de la'),Gs:T('Clé de sol♯'),EbBb:T('Clé mi♭/si♭ (palette)'),CsGs:`${pg} : ${nl('do♯','sol♯')}`,lFs:`${pg} : ${nl('fa♯','do♯')}`,lE:`${pg} : ${nl('mi','si')}`,lF:`${pg} : ${nl('fa','do')}`,
    S1:T('Clé latérale')+' 1',S2:T('Clé latérale')+' 2',S3:T('Clé latérale')+' 3',S4:T('Clé latérale')+' 4',rAb:`${pd} : ${nl('la♭','mi♭')}`,rFs:`${pd} : ${nl('fa♯','do♯')}`,rE:`${pd} : ${nl('mi','si')}`,rF:`${pd} : ${nl('fa','do')}`,BFs:T('Clé de si/fa♯ (main droite)')},
  oboe:{Oct1:T('Clé d\'octave (pouce)'),Oct2:T('2e clé d\'octave'),L1h:T('Demi-trou (index gauche)'),Gs:T('Clé de sol♯'),lEb:`${pg} : ${nl('mi♭')}`,lB:`${pg} : ${nl('si')}`,lBb:`${pg} : ${nl('si♭')}`,Fk:T('Clé de fa'),rC:`${pd} : ${nl('do')}`,rCs:`${pd} : ${nl('do♯')}`,rEb:`${pd} : ${nl('mi♭')}`},
  bsn:{W:T('Clé de pianissimo (pouce gauche)'),tA:T('Clé de la'),tHC:T('Clé de do aigu'),tHD:T('Clé de ré aigu'),tD:T('Pouce gauche')+' : '+nl('ré'),tC:T('Pouce gauche')+' : '+nl('do'),tB:T('Pouce gauche')+' : '+nl('si'),tBb:T('Pouce gauche')+' : '+nl('si♭'),tCs:T('Pouce gauche')+' : '+nl('do♯'),
    L1h:T('Demi-trou (index gauche)'),hE:T('Clé de mi aigu'),hEb:T('Clé de mi♭ aigu'),lEb:T('Clé de mi♭'),lCs:T('Clé de do♯ grave'),rBb:T('Pouce droit')+' : '+nl('si♭'),rE:T('Pouce droit')+' : '+nl('mi'),rFs:T('Pouce droit')+' : '+nl('fa♯'),rAb:T('Pouce droit')+' : '+nl('la♭'),
    pF:`${pd} : ${nl('fa')}`,pFs:`${pd} : ${nl('fa♯')}`,pAb:`${pd} : ${nl('la♭')}`,Cst:T('Clé de trille de do♯')},
  asax:{Oct:T('Clé d\'octave'),PD:T('Clé de paume')+' '+T('ré'),PEb:T('Clé de paume')+' '+T('mi♭'),PF:T('Clé de paume')+' '+T('fa'),FF:T('Fa avant'),Bis:T('Clé bis'),Gs:T('Clé de sol♯'),LCs:`${pg} : ${nl('do♯')}`,LB:`${pg} : ${nl('si')}`,LBb:`${pg} : ${nl('si♭')}`,
    SE:T('Clé latérale')+' '+T('mi'),SC:T('Clé latérale')+' '+T('do'),SBb:T('Clé latérale')+' '+T('si♭'),SFs:T('Clé de fa♯ aigu'),AFs:T('Clé de fa♯ auxiliaire'),REb:`${pd} : ${nl('mi♭')}`,RC:`${pd} : ${nl('do')}`}})[inst]||{};}
function dgLegend(inst,keys){const N=dgKeyNames(inst),l=keys.filter(k=>N[k.replace('~','')]).map(k=>k[0]==='~'?N[k.slice(1)]+' ('+T('flick')+')':N[k]);return l.length?el('p',{class:'dgleg'},el('span',{class:'fl'},'Clés à presser'),...l.map(x=>el('span',{class:'dgkey','data-notr':''},x))):null;}

/* ---------- vue ---------- */
function dgInst(){return DG_INST.find(i=>i.id===DG.inst)||null;}
function dgRender(){
  const root=MOD.dg.root;if(!root)return;const I=dgInst();
  const picker=el('div',{class:'dgpick'},...DG_FAMS.map(f=>el('div',{class:'dgfam'},el('span',{class:'dgfl'},f),
    el('div',{class:'dgchips'},...DG_INST.filter(i=>i.fam===f).map(i=>el('button',{type:'button',class:'dgchip','aria-pressed':String(i.id===DG.inst),onclick:()=>{DG.inst=i.id;dgSave();dgRender();window.scrollTo({top:0,behavior:'smooth'});}},i.t))))));
  if(!I){root.replaceChildren(el('section',{class:'mtsec'},el('h3',{},'Choisis un instrument'),picker));S.keyHandler=null;return;}
  const head=el('div',{class:'dghead'},el('h2',{},I.t),el('p',{class:'hint'},I.info));
  const body=I.kind==='drum'?dgDrumView(I):I.kind==='fret'||I.kind==='bow'?dgStringsView(I):dgWindView(I);
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
    if(I.kind==='tpt'){const v=alt||n.v;return el('figure',{class:'dgf'},dgValvesSvg(v,size,I.id),el('figcaption',{class:'dgv'},vtxt(v)));}
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
const DG_SCOL=['#D2872C','#2F9C69','#2F73C2','#C2417E','#7A5BC7','#B0632A'];
/* cases montrées sur la portée (1re position) pour les cordes pincées */
const DG_FPOS={bass:4,mando:7,banjo:4};
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
    mk('line',{x1:sx(i),y1,x2:sx(i),y2:VH,class:'dgstr4',...(fret&&DG_FPOS[I.id]==null?{}:{style:`stroke:${DG_SCOL[i]}`}),'stroke-width':I.short?Math.max(1,2.6-(s-50)/12):Math.max(1,(fret?(I.id==='bass'?3.2:2.2):2)-i*(fret?(I.id==='bass'?0.4:0.25):0.3))});
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
    if(f===0){mk('rect',{x:x-SP/2+1,y:y-14,width:SP-2,height:26,rx:6,class:'dgn4hit'},null,g);mk('text',{x,y:y+6,'text-anchor':'middle',class:'dgsname',...(DG_FPOS[I.id]!=null?{style:`fill:${DG_SCOL[si]}`}:{})},dgCap(T(dgName(m,DG.flats))),g);}
    else{mk('circle',{cx:x,cy:y,r:R},null,g);
    mk('text',{x,y:y+4,'text-anchor':'middle',class:'dgn4t'},dgCap(T(dgName(m,DG.flats))),g);}
    if(first){const lab=fg.replace(' bas','↓').replace(' haut','↑').replace(' ext.','x').replace(' (½ pos.)','½');const w=lab.length>1?15:12.4;
      mk('rect',{x:x+R-3-w/2,y:y+R-10.2,width:w,height:12.4,rx:6.2,class:'dgn4b'},null,g);mk('text',{x:x+R-3,y:y+R-1.6,'text-anchor':'middle',class:'dgn4bt'},lab,g);}
    const go=()=>pick(m,si,f,g);g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    dots.push({g,m,si,f});}});
  const opts=el('div',{class:'dgopts'},
    el('div',{class:'seg'},...[[false,'♯ dièses'],[true,'♭ bémols']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.flats===v),onclick:()=>{DG.flats=v;dgSave();dgRender();}},l))),
    fret?el('div',{class:'seg'},...[[12,'Cases 0–12'],[19,'Cases 0–19']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.frets===v),onclick:()=>{DG.frets=v;dgSave();dgRender();}},l))):null);
  info.replaceChildren(el('p',{class:'hint'},fret?'Touche une note sur le manche pour l\'entendre et voir toutes les places qui la donnent.':'Touche une note pour l\'entendre. Les rubans blancs marquent la place des doigts en 1re position, comme sur les touches d\'élèves.'));
  S.keyHandler=null;
  /* cordes frottées : la portée, corde par corde (une couleur par corde), avec le doigt sous chaque note */
  let staffSec=null;
  const staffOn=!fret||DG_FPOS[I.id]!=null;
  if(staffOn){
    const labOf=f=>fret?String(f):DG_FING[I.fing][f].replace(' bas','↓').replace(' haut','↑').replace(' ext.','x').replace(' (½ pos.)','½');
    const abcN=m=>(DG.flats?dgAbcFlat:dgAbcNote)(m+I.tr);
    const rows=I.strings.map((s,si)=>{const sh=I.short&&I.short.i===si,fs=fret?(sh?[0]:Array.from({length:DG_FPOS[I.id]+1},(x,f)=>f)):DG_FING[I.fing].map((x,f)=>f),box=el('div',{class:'dgsstaff'});staffBoxes.push(box);
      requestAnimationFrame(()=>{if(!box.isConnected||!HAS_ABC())return;
        ABCJS.renderAbc(box,`X:1\nL:1/4\nK:C clef=${I.clef}\n${fs.map(f=>abcN(s+f)+'4').join(' ')} |]\nw: ${fs.map(labOf).join(' ')}`,{add_classes:true,responsive:'resize',staffwidth:Math.max(270,Math.min(560,(box.clientWidth||560)-8)),scale:1,paddingtop:4,paddingbottom:0,paddingleft:0,paddingright:4,foregroundColor:'currentColor'});
        const ns=[...box.querySelectorAll('.abcjs-note')];ns.forEach((n,k)=>{const f=fs[k];if(f==null)return;n.dataset.m=s+f;n.dataset.si=si;n.dataset.f=f;});
        /* on touche près d'une note (pas forcément dans la tête de la ronde) : la plus proche horizontalement */
        box.onclick=e=>{let best=null,bd=1e9;ns.forEach(n=>{const r=n.getBoundingClientRect(),d=Math.abs(e.clientX-(r.left+r.right)/2);if(d<bd){bd=d;best=n;}});
          if(!best||bd>40)return;const f=+best.dataset.f,d=dots.find(d=>d.si===si&&d.f===f);pick(s+f,si,f,d&&d.g);};});
      const nm=dgCap(T(dgName(s,true)));
      const lab=sh?TL('5e corde ('+nm.toLowerCase()+')','5th string ('+nm+')','5.ª cuerda ('+nm.toLowerCase()+')'):TL('Corde de '+nm.toLowerCase(),nm+' string','Cuerda de '+nm.toLowerCase());
      return el('div',{class:'dgsrow',style:`--sc:${DG_SCOL[si]}`},el('div',{class:'dgstab'},el('b',{'data-notr':''},lab)),box);});
    staffSec=el('section',{class:'mtsec dgstaffsec'},el('h3',{},'Quelle corde ? Quel doigt ?'),
      el('p',{class:'hint'},fret?(I.id==='mando'?'Chaque couleur est une corde. Sous chaque note : la case à appuyer (0 = corde à vide). Doigts : index pour les cases 1 et 2, majeur 3 et 4, annulaire 5, auriculaire 7. Touche une note pour l\'entendre et la voir sur le manche.':'Chaque couleur est une corde. Sous chaque note : la case à appuyer (0 = corde à vide); en 1re position, le doigt porte le même numéro que la case. Touche une note pour l\'entendre et la voir sur le manche.'):'Chaque couleur est une corde. Sous chaque note : le doigt en 1re position (0 = corde à vide, ↓ bas, ↑ haut, x extension). Une même note peut parfois se jouer sur deux cordes. Touche une note pour l\'entendre et la voir sur la touche.'),
      el('div',{class:'dgsrows'},...rows));
  }
  return el('div',{class:'dgwrap dgstrings'},info,staffSec,el('section',{class:'mtsec dgnecksec'},el('h3',{},fret?'Toutes les notes du manche':'Notes de la touche'),opts,el('div',{class:'dgneckwrap'},svg)));
}

/* ---------- batterie : chaque élément et sa place sur la portée ---------- */
const DG_DRUMS=[
  {id:'hhp',t:'Charleston (au pied)',pos:-1,x:true,w:'Sous la portée, tête en x',h:'Pied gauche : on ferme les deux cymbales.'},
  {id:'kick',t:'Grosse caisse',pos:1,w:'1er interligne',h:'Pied droit, sur la pédale.'},
  {id:'ftom',t:'Tom basse',pos:3,w:'2e interligne',h:'Le plus grave des toms, posé au sol.'},
  {id:'snare',t:'Caisse claire',pos:5,w:'3e interligne',h:'Le cœur du rythme : souvent sur les temps 2 et 4.'},
  {id:'mtom',t:'Tom médium',pos:6,w:'4e ligne',h:'Fixé sur la grosse caisse.'},
  {id:'htom',t:'Tom aigu',pos:7,w:'4e interligne',h:'Le plus aigu des toms.'},
  {id:'ride',t:'Cymbale ride',pos:8,x:true,w:'5e ligne, tête en x',h:'Pour garder un rythme régulier.'},
  {id:'hh',t:'Charleston (baguettes)',pos:9,x:true,w:'Au-dessus de la portée, tête en x',h:'Les deux cymbales fermées, jouées à la baguette.'},
  {id:'crash',t:'Cymbale crash',pos:10,x:true,w:'Ligne supplémentaire au-dessus, tête en x',h:'Pour marquer un accent ou un début de phrase.'}];
function dgDrumPlay(id){try{const c=A.init();if(typeof qzUnmute==='function')qzUnmute();const t=c.currentTime+.02,out=A.out||c.destination;
  const env=(g,a,d)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(a,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+d);};
  const noise=d=>{const b=c.createBuffer(1,Math.ceil(c.sampleRate*d),c.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;return s;};
  const tone=(f0,f1,d,a)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d*.8);env(g,a,d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.05);};
  const hiss=(type,f,q,d,a)=>{const s=noise(d+.05),fl=c.createBiquadFilter(),g=c.createGain();fl.type=type;fl.frequency.value=f;fl.Q.value=q;env(g,a,d);s.connect(fl);fl.connect(g);g.connect(out);s.start(t);s.stop(t+d+.05);};
  if(id==='kick')tone(140,42,.35,.9);
  else if(id==='snare'){if(A.snare)A.snare(t,out);else{tone(190,150,.12,.4);hiss('highpass',1800,.7,.18,.5);}}
  else if(id==='ftom')tone(110,80,.45,.7);else if(id==='mtom')tone(165,120,.38,.65);else if(id==='htom')tone(220,165,.32,.6);
  else if(id==='hh')hiss('highpass',7500,.8,.06,.35);else if(id==='hhp')hiss('highpass',6000,.8,.09,.25);
  else if(id==='ride'){hiss('bandpass',5200,1.2,.9,.22);tone(3100,3000,.7,.04);}
  else if(id==='crash')hiss('highpass',4200,.6,1.6,.4);
}catch(e){}}
function dgDrumView(I){
  const NS='http://www.w3.org/2000/svg',SP=7,TOP=34,LW=34,STEP=62,W=LW+40+STEP*DG_DRUMS.length,H=150;
  const Y=p=>TOP+4*SP*2-p*SP;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('class','dgdrum');
  const mk=(t,a,txt,par)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;(par||svg).append(e);return e;};
  for(let k=0;k<5;k++)mk('line',{x1:6,x2:W-6,y1:Y(k*2),y2:Y(k*2),class:'dgdl'});
  mk('rect',{x:16,y:Y(6),width:4,height:SP*2,class:'dgdc'});mk('rect',{x:24,y:Y(6),width:4,height:SP*2,class:'dgdc'});
  const cards=[],marks=[];
  const sel=i=>{marks.forEach((g,k)=>g.classList.toggle('on',k===i));cards.forEach((c,k)=>c.setAttribute('aria-pressed',String(k===i)));dgDrumPlay(DG_DRUMS[i].id);};
  DG_DRUMS.forEach((d,i)=>{const x=LW+40+i*STEP+STEP/2-20,y=Y(d.pos);
    const g=mk('g',{class:'dgdn',tabindex:'0',role:'button','aria-label':T(d.t)});marks.push(g);
    mk('rect',{x:x-STEP/2+4,y:8,width:STEP-8,height:H-16,rx:8,class:'dgdhit'},null,g);
    if(d.pos>=10)mk('line',{x1:x-12,x2:x+12,y1:Y(10),y2:Y(10),class:'dgdl'},null,g);
    if(d.pos<=-2)mk('line',{x1:x-12,x2:x+12,y1:Y(-2),y2:Y(-2),class:'dgdl'},null,g);
    if(d.x){mk('path',{d:`M${x-5.5},${y-5.5} L${x+5.5},${y+5.5} M${x-5.5},${y+5.5} L${x+5.5},${y-5.5}`,class:'dgdx'},null,g);}
    else mk('ellipse',{cx:x,cy:y,rx:6.6,ry:4.8,transform:`rotate(-20 ${x} ${y})`,class:'dgdh'},null,g);
    mk('line',{x1:x+6,x2:x+6,y1:y-(d.x?5:1),y2:y-26,class:'dgds'},null,g);
    mk('circle',{cx:x,cy:H-20,r:10,class:'dgdnum'},null,g);mk('text',{x,y:H-16,'text-anchor':'middle',class:'dgdnt'},String(i+1),g);
    g.addEventListener('click',()=>sel(i));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(i);}});});
  DG_DRUMS.forEach((d,i)=>cards.push(el('button',{type:'button',class:'dgdcard','aria-pressed':'false',onclick:()=>sel(i)},
    el('span',{class:'dgdcn'},String(i+1)),el('span',{class:'dgdct'},el('b',{},d.t),el('span',{class:'dgdw'},d.w),el('span',{class:'dgdhh'},d.h)),el('span',{class:'gcplay','aria-hidden':'true'},'▶'))));
  S.keyHandler=null;
  return el('div',{class:'dgwrap dgdrums'},
    el('section',{class:'mtsec'},el('h3',{},'La batterie sur la portée'),el('p',{class:'hint'},'Chaque élément a sa place sur la portée. Les cymbales s\'écrivent avec une tête en x. Touche une note ou une carte pour l\'entendre.'),
      el('div',{class:'dgdwrap'},svg)),
    el('section',{class:'mtsec'},el('div',{class:'dgdgrid'},...cards)));
}


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

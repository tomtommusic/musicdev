
/* ========== Accompagnateur : gammes et modes pour improviser ==========
   Affiche la gamme (ou le mode) sur une portée, ou sur un manche de guitare ou de basse, comme dans les vidéos de « jam tracks » :
   la tonique en foncé, les notes de l'accord joué en couleur, les autres notes de la gamme en clair.
   Trois choix : la tonalité de la grille (trouvée automatiquement), le mode de chaque accord, ou une gamme choisie. */
const BA_SC={
  ionian:{n:'Ionien (majeur)',s:[0,2,4,5,7,9,11]},
  dorian:{n:'Dorien',s:[0,2,3,5,7,9,10]},
  phrygian:{n:'Phrygien',s:[0,1,3,5,7,8,10]},
  lydian:{n:'Lydien',s:[0,2,4,6,7,9,11]},
  mixolydian:{n:'Mixolydien',s:[0,2,4,5,7,9,10]},
  aeolian:{n:'Éolien (mineur naturel)',s:[0,2,3,5,7,8,10]},
  locrian:{n:'Locrien',s:[0,1,3,5,6,8,10]},
  harmmin:{n:'Mineur harmonique',s:[0,2,3,5,7,8,11]},
  phrygdom:{n:'Phrygien dominant',s:[0,1,4,5,7,8,10]},
  melmin:{n:'Mineur mélodique',s:[0,2,3,5,7,9,11]},
  pentamaj:{n:'Pentatonique majeure',s:[0,2,4,7,9],d:[1,2,3,5,6]},
  pentamin:{n:'Pentatonique mineure',s:[0,3,5,7,10],d:[1,3,4,5,7]},
  blues:{n:'Blues',s:[0,3,5,6,7,10],d:[1,3,4,5,5,7]},
  wholetone:{n:'Par tons',s:[0,2,4,6,8,10],d:[1,2,3,4,5,7]},
  dimwh:{n:'Diminuée (ton – demi-ton)',s:[0,2,3,5,6,8,9,11],d:[1,2,3,4,5,6,6,7]}};
const BA_MODES=['ionian','dorian','phrygian','lydian','mixolydian','aeolian','locrian'];
const BA_LETN=['C','D','E','F','G','A','B'],BA_LPC=[0,2,4,5,7,9,11],BA_MAJ=[0,2,4,5,7,9,11];
const baAcc=a=>a===0?'':a===1?'♯':a===-1?'♭':a===2?'𝄪':'𝄫';
/* orthographe : chaque degré garde sa lettre (do ré mi… dans l'ordre) ; on choisit la tonique qui donne le moins d'altérations */
function baSpell(rootPc,type){
  const sc=BA_SC[type],deg=sc.d||sc.s.map((_,i)=>i+1);let best=null;
  for(let L=0;L<7;L++){const a=((rootPc-BA_LPC[L])+18)%12-6;if(Math.abs(a)>1)continue;
    const notes=sc.s.map((st,i)=>{const li=(L+deg[i]-1)%7,acc=(((rootPc+st)%12-BA_LPC[li])+18)%12-6;return{li,acc,pc:(rootPc+st)%12};});
    const cost=notes.reduce((c,n)=>c+Math.abs(n.acc)*(Math.abs(n.acc)>1?5:1),0)+(a===1?.1:0);
    if(!best||cost<best.cost)best={cost,notes};}
  return best.notes.map((n,i)=>({pc:n.pc,li:n.li,acc:n.acc,name:BA_LETN[n.li]+baAcc(n.acc),
    deg:(()=>{const st=sc.s[i],d=deg[i],x=((st-BA_MAJ[d-1])+18)%12-6;return(x<0?'♭':x>0?'♯':'')+d;})()}));
}
/* tonalité de la grille : la gamme majeure ou mineure qui contient le mieux les accords (le premier et le dernier accord départagent) */
function baKey(bars){
  const chs=bars.flat();if(!chs.length)return{root:0,type:'ionian'};let best=null;
  for(let r=0;r<12;r++)for(const type of['ionian','aeolian']){const set=BA_SC[type].s.map(x=>(r+x)%12);let sc=0;
    chs.forEach(c=>{const p=baPc(c),t=c.iv.map(x=>(p+x)%12);sc+=t.filter(x=>set.includes(x)).length/t.length;});
    const f=chs[0],l=chs[chs.length-1],minor=c=>c.iv.includes(3);
    if(baPc(f)===r)sc+=minor(f)===(type==='aeolian')?.8:.2;if(baPc(l)===r)sc+=minor(l)===(type==='aeolian')?.5:.1;
    if(!best||sc>best.sc+1e-9)best={sc,root:r,type};}
  return best;
}
/* mode d'un accord : dans la tonalité de la grille si l'accord en fait partie, sinon d'après sa qualité */
function baChordMode(ch,key){
  const p=baPc(ch),tones=ch.iv.map(x=>(p+x)%12),q=ch.q||'';
  if(key){const set=BA_SC[key.type].s.map(x=>(key.root+x)%12),i=set.indexOf(p);
    if(i>=0&&tones.every(t=>set.includes(t)))return{root:p,type:BA_MODES[((key.type==='aeolian'?5:0)+i)%7]};
    /* en mineur, l'accord de dominante majeur (E7 en la mineur) : mode de la 5te de la gamme mineure harmonique */
    if(key.type==='aeolian'&&p===(key.root+7)%12&&ch.iv.includes(4))return{root:p,type:'phrygdom'};}
  if(/m7b5|m7♭5|ø/.test(q))return{root:p,type:'locrian'};
  if(/dim|°/.test(q))return{root:p,type:'dimwh'};
  if(/aug|\+/.test(q))return{root:p,type:'wholetone'};
  const minor=ch.iv.includes(3);
  if(minor)return{root:p,type:ch.iv.includes(11)?'melmin':'dorian'};
  if(ch.iv.includes(10)||/sus/.test(q)||!ch.iv.includes(4))return{root:p,type:'mixolydian'};
  return{root:p,type:'ionian'};
}
/* ---- dessin ---- */
const BA_TUN={gtr:[64,59,55,50,45,40],bass:[43,38,33,28]};   /* cordes, de l'aiguë à la grave (mi4 si3 sol3 ré3 la2 mi2) */
function baFretboard(kind,notes,root,chordPcs,lab,narrow){
  const tun=BA_TUN[kind],F=15,fw=narrow?38:46,sh=26,top=18,left=34,W=left+F*fw+14,H=top+(tun.length-1)*sh+30;
  const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('width',W);svg.setAttribute('height',H);svg.setAttribute('class','bafb');
  svg.setAttribute('role','img');svg.setAttribute('aria-label',T('Manche')+' : '+notes.map(n=>n.name).join(' '));
  const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.appendChild(e);return e;};
  const x=f=>f===0?left-16:left+(f-.5)*fw,y=s=>top+s*sh;
  [3,5,7,9,15].forEach(f=>mk('circle',{cx:left+(f-.5)*fw,cy:(y(0)+y(tun.length-1))/2,r:5,class:'fbdot'}));
  [-1,1].forEach(d=>mk('circle',{cx:left+11.5*fw,cy:(y(0)+y(tun.length-1))/2+d*sh*(tun.length>4?1:.5),r:5,class:'fbdot'}));
  for(let f=0;f<=F;f++)mk('line',{x1:left+f*fw,x2:left+f*fw,y1:y(0),y2:y(tun.length-1),class:f===0?'fbnut':'fbfret'});
  tun.forEach((m,s)=>mk('line',{x1:left,x2:left+F*fw,y1:y(s),y2:y(s),class:'fbstr','stroke-width':1+s*.35}));
  [3,5,7,9,12,15].forEach(f=>mk('text',{x:left+(f-.5)*fw,y:H-6,class:'fbnum'},String(f)));
  const by={};notes.forEach(n=>by[n.pc]=n);
  /* notes de l'accord hors de la gamme (ex. sol♯ de E7 en la mineur) : affichées quand même */
  chordPcs.forEach(pc=>{if(!by[pc])by[pc]={pc,name:BA_NAMES_SH[pc],deg:BA_NAMES_SH[pc],out:true};});
  tun.forEach((m,s)=>{for(let f=0;f<=F;f++){const pc=(m+f)%12,n=by[pc];if(!n)continue;
    const cls=pc===root?'fbn root':chordPcs.includes(pc)?'fbn chord'+(n.out?' out':''):'fbn scale';
    const g=document.createElementNS(NS,'g');g.setAttribute('class',cls);svg.appendChild(g);
    const c=document.createElementNS(NS,pc===root?'rect':'circle');
    if(pc===root){c.setAttribute('x',x(f)-11);c.setAttribute('y',y(s)-11);c.setAttribute('width',22);c.setAttribute('height',22);c.setAttribute('rx',5);}
    else{c.setAttribute('cx',x(f));c.setAttribute('cy',y(s));c.setAttribute('r',cls.includes('chord')?12:9.5);}
    g.appendChild(c);const t=document.createElementNS(NS,'text');t.setAttribute('x',x(f));t.setAttribute('y',y(s)+4);t.textContent=lab==='deg'?n.deg:n.name;g.appendChild(t);}});
  return svg;
}
function baStaff(box,notes,chordPcs,bass){
  const used={};let oct=bass?2:4,prevLi=-1;const parts=[];
  [...notes,notes[0]].forEach((n,i)=>{if(i>0&&n.li<=prevLi)oct++;prevLi=n.li;
    const L=BA_LETN[n.li],acc=n.acc>0?'^'.repeat(n.acc):n.acc<0?'_'.repeat(-n.acc):(used[L]?'=':'');used[L]=n.acc!==0;
    const name=oct>=5?L.toLowerCase()+"'".repeat(oct-5):L+','.repeat(Math.max(0,4-oct));
    parts.push((chordPcs.includes(n.pc)?'"^●"':'')+acc+name);});
  const abc=`X:1\nL:1/4\nK:C clef=${bass?'bass':'treble'}\n${parts.join(' ')} |]\nw: ${[...notes,notes[0]].map(n=>n.deg.replace(/^1$/,'1')).join(' ')}`;
  try{const w=box.clientWidth||320;ABCJS.renderAbc(box,abc,{add_classes:true,staffwidth:Math.max(240,Math.min(560,w-20)),scale:w<420?.85:1,paddingleft:0,paddingright:0});}catch(e){box.textContent=notes.map(n=>n.name).join(' ');}
}
/* ---- section dans l'Accompagnateur ---- */
function baScSection(M,save){
  if(!BA_S.sc)BA_S.sc={show:'gtr',src:'grid',root:0,type:'ionian',lab:'name'};const C=BA_S.sc;
  const disp=el('div',{class:'bascdisp'}),info=el('p',{class:'bascinfo'}),leg=el('p',{class:'hint basclegend'});
  const NAMES=BA_NAMES_SH.map((n,i)=>[i,n]);
  const rootSel=sel('ba_scroot',NAMES,C.root,v=>{C.root=+v;save();M.scPaint();});
  const typeSel=sel('ba_sctype',Object.entries(BA_SC).map(([k,v])=>[k,T(v.n)]),C.type,v=>{C.type=v;save();M.scPaint();});
  const fixedRow=el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Tonique'),rootSel),el('label',{class:'qzfield'},el('span',{class:'fl'},'Gamme ou mode'),typeSel));
  const showSel=sel('ba_scshow',[['none',T('Rien')],['staff',T('Portée')],['gtr',T('Manche de guitare')],['bass',T('Manche de basse')]],C.show,v=>{C.show=v;save();M.scPaint();});
  const srcSel=sel('ba_scsrc',[['grid',T('Tonalité de la grille (automatique)')],['chord',T('Mode de chaque accord')],['fixed',T('Choisir une gamme…')]],C.src,v=>{C.src=v;save();M.scPaint();});
  const labSel=sel('ba_sclab',[['name',T('Noms des notes')],['deg',T('Degrés')]],C.lab,v=>{C.lab=v;save();M.scPaint();}),labF=el('label',{class:'qzfield'},el('span',{class:'fl'},'Étiquettes'),labSel);
  M.scCh=null;
  M.scPaint=()=>{
    fixedRow.hidden=C.src!=='fixed';labF.hidden=C.show==='staff'||C.show==='none';
    if(C.show==='none'){disp.replaceChildren();info.textContent='';leg.hidden=true;return;}
    const bars=baGrid(BA_S.grid).bars;if(!bars.length){disp.replaceChildren();info.textContent='';return;}
    const ch=M.scCh||bars[0][0],key=baKey(bars);
    const sc=C.src==='fixed'?{root:C.root,type:C.type}:C.src==='chord'?baChordMode(ch,key):key;
    const notes=baSpell(sc.root,sc.type),chordPcs=ch.iv.map(x=>(baPc(ch)+x)%12);
    const nm=notes[0].name+' '+T(BA_SC[sc.type].n).toLowerCase();
    info.replaceChildren(el('b',{},nm),' : '+notes.map(n=>n.name).join(' ')+'   ·   ',T('Accord')+' '+baName(ch)+' : ',
      el('b',{},chordPcs.map(pc=>{const n=notes.find(x=>x.pc===pc);return n?n.name:BA_NAMES_SH[pc];}).join(' ')));
    if(C.show==='staff'){const b=el('div',{class:'bascstaff'});disp.replaceChildren(b);baStaff(b,notes,chordPcs,false);leg.textContent=T('● au-dessus d\'une note = note de l\'accord joué. Sous la portée : les degrés de la gamme.');}
    else{disp.replaceChildren(el('div',{class:'bascfb'},baFretboard(C.show,notes,sc.root,chordPcs,C.lab,(disp.clientWidth||600)<520)));
      leg.replaceChildren(el('span',{class:'lg root'},'■'),' '+T('tonique')+'   ',el('span',{class:'lg chord'},'●'),' '+T('notes de l\'accord joué')+'   ',el('span',{class:'lg scale'},'○'),' '+T('autres notes de la gamme'),(disp.clientWidth||600)<760?el('span',{class:'scrollhint'},' · '+T('glisse le manche pour voir les cases suivantes')):'');}
    leg.hidden=false;};
  M.scChord=(ch)=>{if(!ch||C.show==='none')return;if(M.scCh===ch)return;M.scCh=ch;M.scPaint();};
  return el('section',{class:'mtsec bascsec'},el('h3',{},'Gammes et modes pour improviser'),
    el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Afficher'),showSel),el('label',{class:'qzfield'},el('span',{class:'fl'},'Gamme'),srcSel),labF),
    fixedRow,info,disp,leg,
    el('p',{class:'hint'},'Pendant la lecture, les notes de l\'accord joué s\'allument. Commence par viser ces notes sur les temps forts, puis relie-les avec les autres notes de la gamme. Voir la Bibliothèque théorique › Modes et improvisation.'));
}

let DG_UID=0;
/* manche façon tableau de guitare : bois, cordes, frettes régulières, notes en pastilles (naturelles claires, altérées foncées) */
function dgStringsView(I){
  const fret=I.kind==='fret',n=I.strings.length,maxF=fret?DG.frets:12,NS='http://www.w3.org/2000/svg',uid='dg'+(++DG_UID);
  const info=el('section',{class:'mtsec dgsinfo'});
  const SP=34,R=15.5,PADX=19,NW=SP*(n-1)+PADX*2,ROW=fret?52:46,TOPH=34,NUT=TOPH+40;
  const VW=NW+(fret?24:0),VH=NUT+ROW*maxF+18;
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${VW} ${VH}`);svg.setAttribute('class','dgneck v4 '+(fret?'fret':'bow')+' '+I.id);
  const mk=(t,a,txt,parent)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;(parent||svg).append(e);return e;};
  const sx=i=>PADX+i*SP,rowY=f=>f===0?NUT-20:NUT+ROW*(f-0.5);
  const defs=mk('defs',{});
  const g1=mk('linearGradient',{id:uid+'w',x1:0,y1:0,x2:1,y2:0},null,defs);
  (fret?[[0,'#5a3b26'],[.18,'#7a5236'],[.5,'#8a5f3f'],[.82,'#7a5236'],[1,'#5a3b26']]:[[0,'#141210'],[.2,'#26221e'],[.5,'#2f2a25'],[.8,'#26221e'],[1,'#141210']]).forEach(([o,c])=>mk('stop',{offset:o,'stop-color':c},null,g1));
  /* noms des cordes */
  I.strings.forEach((s,i)=>mk('text',{x:sx(i),y:20,'text-anchor':'middle',class:'dgsname'},dgCap(T(dgName(s,DG.flats)))));
  /* touche en bois et quelques veines */
  mk('rect',{x:4,y:NUT-34,width:NW-8,height:VH-NUT+30,rx:3,fill:`url(#${uid}w)`,class:'dgwood4'});
  for(let k=0;k<7;k++){const x=10+k*(NW-20)/6+(k%2?3:-2);mk('path',{d:`M${x},${NUT-30} C${x+4},${NUT+ROW*3} ${x-4},${NUT+ROW*7} ${x+2},${VH-6}`,class:'dggrain'});}
  /* sillet, frettes (ou repères de demi-tons), cordes */
  mk('rect',{x:4,y:NUT-3,width:NW-8,height:6,class:'dgnut4'});
  for(let f=1;f<=maxF;f++){const y=NUT+ROW*f;mk('line',{x1:6,y1:y,x2:NW-6,y2:y,class:fret?'dgfret4':'dgtick4'});
    if(fret)mk('text',{x:NW+12,y:NUT+ROW*(f-0.5)+3,'text-anchor':'middle',class:'dgfnum'},String(f));}
  if(fret){for(const f of[3,5,7,9,15,17,19])if(f<=maxF)mk('circle',{cx:NW/2,cy:NUT+ROW*(f-0.5)+ (f%2?0:0),r:3.4,class:'dginlay4'});
    if(maxF>=12)for(const dx of[-SP,SP])mk('circle',{cx:NW/2+dx,cy:NUT+ROW*11.5,r:3.4,class:'dginlay4'});}
  I.strings.forEach((s,i)=>mk('line',{x1:sx(i),y1:NUT-34,x2:sx(i),y2:VH,class:'dgstr4','stroke-width':Math.max(1,(fret?(I.id==='bass'?3.2:2.2):2)-i*(fret?(I.id==='bass'?0.4:0.25):0.3))}));
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
    const m=s+f,fg=!fret&&DG_FING[I.fing][f],first=!fret&&f>0&&!!fg,high=!fret&&f>0&&!fg;
    const x=sx(si),y=rowY(f);
    const g=mk('g',{class:'dgn4'+(dgBlack(m)?' acc':' nat')+(f===0?' open':'')+(high?' high':''),tabindex:'0',role:'button'});
    mk('circle',{cx:x,cy:y,r:f===0?R-3:R},null,g);
    mk('text',{x,y:y+4,'text-anchor':'middle',class:'dgn4t'},dgCap(T(dgName(m,DG.flats))),g);
    if(first){mk('circle',{cx:x+R-3,cy:y+R-4,r:6.2,class:'dgn4b'},null,g);mk('text',{x:x+R-3,y:y+R-1.6,'text-anchor':'middle',class:'dgn4bt'},T(fg).replace(/\D.*$/,'')||'0',g);}
    const go=()=>pick(m,si,f,g);g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    dots.push({g,m});}});
  const opts=el('div',{class:'dgopts'},
    el('div',{class:'seg'},...[[false,'♯ dièses'],[true,'♭ bémols']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.flats===v),onclick:()=>{DG.flats=v;dgSave();dgRender();}},l))),
    fret?el('div',{class:'seg'},...[[12,'Cases 0–12'],[19,'Cases 0–19']].map(([v,l])=>el('button',{type:'button','aria-pressed':String(DG.frets===v),onclick:()=>{DG.frets=v;dgSave();dgRender();}},l))):null);
  info.replaceChildren(el('p',{class:'hint'},fret?'Touche une note sur le manche pour l\'entendre et voir toutes les places qui la donnent.':'Touche une note pour l\'entendre. Le petit chiffre indique le doigt en 1re position (bas, haut : voir la note choisie) ; les notes pâles se jouent dans des positions plus hautes.'));
  S.keyHandler=null;
  return el('div',{class:'dgwrap dgstrings'},info,el('section',{class:'mtsec dgnecksec'},el('h3',{},fret?'Toutes les notes du manche':'Notes de la touche'),opts,el('div',{class:'dgneckwrap'},svg)));
}

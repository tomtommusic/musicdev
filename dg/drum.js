
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
  const yOf=p=>TOP+SP*8-p*SP/2*2/2*1;/* pos 0 = 1re ligne (mi) ; chaque pas = un demi-interligne */
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

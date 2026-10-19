
/* ========== MODULE : Rudiments (les 40 rudiments internationaux de la PAS) ==========
   Écriture : groupes ligaturés séparés par « / », mesures par « | ».
   Note : [f|d|z][>](R|L)(4|8|16|32)[.] — f = fla (1 appoggiature), d = ra (2 appoggiatures), z = roulement écrasé (buzz), > = accent.
   « (3 » : les 3 notes suivantes forment un triolet. « r8 » : silence. */
const RUD=[
 {n:1,c:'roll',t:'Roulement simple (single stroke roll)',m:'2/4',p:'R16 L16 R16 L16 / R16 L16 R16 L16',tip:'Coups alternés bien égaux. Commence lentement, puis accélère sans perdre la régularité.'},
 {n:2,c:'roll',t:'Single stroke four',m:'2/4',p:'(3 R16 L16 R16 / >L8 / (3 L16 R16 L16 / >R8',tip:'Trois coups rapides en triolet, puis un accent : « 1-2-3-QUATRE ».'},
 {n:3,c:'roll',t:'Single stroke seven',m:'2/4',p:'(3 R16 L16 R16 (3 L16 R16 L16 / >R8 r8',tip:'Six coups en triolets, puis l\'accent sur le temps.'},
 {n:4,c:'roll',t:'Roulement écrasé (multiple bounce roll)',m:'2/4',p:'zR8 zL8 / zR8 zL8',tip:'Laisse rebondir la baguette sur la peau (« buzz ») : chaque coup devient un petit roulement serré. Le « z » indique le roulement écrasé.'},
 {n:5,c:'roll',t:'Roulement à trois coups (triple stroke roll)',m:'2/4',p:'(3 R16 R16 R16 (3 L16 L16 L16 / (3 R16 R16 R16 (3 L16 L16 L16',tip:'Trois coups par main, bien égaux : poignet pour le 1er, doigts pour les 2 suivants.'},
 {n:6,c:'roll',t:'Roulement ouvert (double stroke open roll)',m:'2/4',p:'R16 R16 L16 L16 / R16 R16 L16 L16',tip:'Deux coups par main (« papa-mama »). Le 2e coup doit être aussi fort que le 1er.'},
 {n:7,c:'roll',t:'Roulement de 5 (five stroke roll)',m:'2/4',p:'R16 R16 L16 L16 / >R8 r8 | L16 L16 R16 R16 / >L8 r8',tip:'Deux doubles puis un accent. La 2e mesure commence de la main gauche.'},
 {n:8,c:'roll',t:'Roulement de 6 (six stroke roll)',m:'3/4',p:'>R16 L16 L16 R16 / R16 >L16 >R16 L16 / L16 R16 R16 >L16',tip:'Un coup accentué, deux doubles, un coup accentué : « BAM-papa-mama-BAM ».'},
 {n:9,c:'roll',t:'Roulement de 7 (seven stroke roll)',m:'2/4',p:'R16 R16 L16 L16 / R16 R16 >L8',tip:'Trois doubles puis l\'accent.'},
 {n:10,c:'roll',t:'Roulement de 9 (nine stroke roll)',m:'3/4',p:'R16 R16 L16 L16 / R16 R16 L16 L16 / >R8 r8',tip:'Quatre doubles puis l\'accent sur le 3e temps.'},
 {n:11,c:'roll',t:'Roulement de 10 (ten stroke roll)',m:'3/4',p:'R16 R16 L16 L16 / R16 R16 L16 L16 / >R8 >L8',tip:'Quatre doubles puis deux coups accentués.'},
 {n:12,c:'roll',t:'Roulement de 11 (eleven stroke roll)',m:'3/4',p:'R16 R16 L16 L16 / R16 R16 L16 L16 / R16 R16 >L8',tip:'Cinq doubles puis l\'accent.'},
 {n:13,c:'roll',t:'Roulement de 13 (thirteen stroke roll)',m:'4/4',p:'R16 R16 L16 L16 / R16 R16 L16 L16 / R16 R16 L16 L16 / >R8 r8',tip:'Six doubles puis l\'accent sur le 4e temps.'},
 {n:14,c:'roll',t:'Roulement de 15 (fifteen stroke roll)',m:'4/4',p:'R16 R16 L16 L16 / R16 R16 L16 L16 / R16 R16 L16 L16 / R16 R16 >L8',tip:'Sept doubles puis l\'accent.'},
 {n:15,c:'roll',t:'Roulement de 17 (seventeen stroke roll)',m:'5/4',p:'R16 R16 L16 L16 / R16 R16 L16 L16 / R16 R16 L16 L16 / R16 R16 L16 L16 / >R8 r8',tip:'Huit doubles puis l\'accent.'},
 {n:16,c:'diddle',t:'Paradiddle simple (single paradiddle)',m:'2/4',p:'>R16 L16 R16 R16 / >L16 R16 L16 L16',tip:'« Pa-ra-di-dle » : deux coups alternés puis un double. L\'accent change de main à chaque groupe.'},
 {n:17,c:'diddle',t:'Paradiddle double (double paradiddle)',m:'3/4',p:'>R16 L16 R16 L16 / R16 R16 >L16 R16 / L16 R16 L16 L16',tip:'Quatre coups alternés puis un double.'},
 {n:18,c:'diddle',t:'Paradiddle triple (triple paradiddle)',m:'4/4',p:'>R16 L16 R16 L16 / R16 L16 R16 R16 / >L16 R16 L16 R16 / L16 R16 L16 L16',tip:'Six coups alternés puis un double.'},
 {n:19,c:'diddle',t:'Paradiddle-diddle',m:'3/4',p:'>R16 L16 R16 R16 / L16 L16 >R16 L16 / R16 R16 L16 L16',tip:'Deux coups alternés puis deux doubles. Très utilisé autour des toms.'},
 {n:20,c:'flam',t:'Fla (flam)',m:'2/4',p:'fR4 / fL4',tip:'Une petite note (appoggiature) jouée tout près de la surface, juste avant le coup principal de l\'autre main : « fla ».'},
 {n:21,c:'flam',t:'Fla accentué (flam accent)',m:'2/4',p:'(3 f>R8 L8 R8 / (3 f>L8 R8 L8',tip:'Fla accentué puis deux coups, en triolets. La main de départ alterne.'},
 {n:22,c:'flam',t:'Fla-tap (flam tap)',m:'2/4',p:'fR16 R16 fL16 L16 / fR16 R16 fL16 L16',tip:'Un fla puis un coup de la même main.'},
 {n:23,c:'flam',t:'Flamacue',m:'2/4',p:'fR16 >L16 R16 L16 / fR8 r8',tip:'Fla, accent sur le 2e coup, puis un fla sur le temps suivant.'},
 {n:24,c:'flam',t:'Fla-paradiddle (flam paradiddle)',m:'2/4',p:'fR16 L16 R16 R16 / fL16 R16 L16 L16',tip:'Un paradiddle avec un fla sur la première note.'},
 {n:25,c:'flam',t:'Moulin avec fla (single flammed mill)',m:'2/4',p:'fR16 R16 L16 R16 / fL16 L16 R16 L16',tip:'Le double vient en premier (« moulin »), avec un fla dessus.'},
 {n:26,c:'flam',t:'Fla-paradiddle-diddle',m:'3/4',p:'fR16 L16 R16 R16 / L16 L16 fR16 L16 / R16 R16 L16 L16',tip:'Le paradiddle-diddle avec un fla sur la première note.'},
 {n:27,c:'flam',t:'Pataflafla',m:'2/4',p:'fR16 L16 R16 fL16 / fR16 L16 R16 fL16',tip:'Fla sur le 1er et le 4e coup de chaque groupe.'},
 {n:28,c:'flam',t:'Triolet suisse (Swiss army triplet)',m:'2/4',p:'(3 fR16 R16 L16 (3 fR16 R16 L16 / (3 fR16 R16 L16 (3 fR16 R16 L16',tip:'Fla, puis la même main, puis l\'autre main, en triolets.'},
 {n:29,c:'flam',t:'Fla-tap inversé (inverted flam tap)',m:'2/4',p:'fR16 L16 fL16 R16 / fR16 L16 fL16 R16',tip:'Le coup simple est joué par la main qui vient de faire l\'appoggiature.'},
 {n:30,c:'flam',t:'Fla-ra (flam drag)',m:'6/8',p:'f>R8 L16 L16 R8 / f>L8 R16 R16 L8',tip:'Fla accentué, un double, puis un coup.'},
 {n:31,c:'drag',t:'Ra (drag)',m:'2/4',p:'dR4 / dL4',tip:'Deux petites notes rapides (rebond) juste avant le coup principal de l\'autre main.'},
 {n:32,c:'drag',t:'Ra-tap simple (single drag tap)',m:'2/4',p:'dR8 >L8 / dL8 >R8',tip:'Un ra, puis un coup accentué de l\'autre main.'},
 {n:33,c:'drag',t:'Ra-tap double (double drag tap)',m:'6/8',p:'dR8 dR8 >L8 / dL8 dL8 >R8',tip:'Deux ras, puis un coup accentué.'},
 {n:34,c:'drag',t:'Leçon 25 (lesson 25)',m:'2/4',p:'dR16 L16 >R8 / dL16 R16 >L8',tip:'Un ra, un coup, puis l\'accent.'},
 {n:35,c:'drag',t:'Dragadiddle simple (single dragadiddle)',m:'2/4',p:'>R16 dL16 R16 R16 / >L16 dR16 L16 L16',tip:'Un paradiddle avec un ra sur le 2e coup.'},
 {n:36,c:'drag',t:'Ra-paradiddle no 1 (drag paradiddle #1)',m:'3/4',p:'>R8 dR16 L16 / R16 R16 >L8 / dL16 R16 L16 L16',tip:'Un coup accentué, puis un paradiddle avec un ra sur la première note.'},
 {n:37,c:'drag',t:'Ra-paradiddle no 2 (drag paradiddle #2)',m:'3/4',p:'>R16 dR16 dR16 L16 / R16 R16 >L16 dL16 / dL16 R16 L16 L16',tip:'Comme le no 1, avec deux ras avant le paradiddle.'},
 {n:38,c:'drag',t:'Ratamacue simple (single ratamacue)',m:'2/4',p:'(3 dR16 L16 R16 / >L8 / (3 dL16 R16 L16 / >R8',tip:'Un ra, un triolet, puis l\'accent : « ra-ta-ma-CUE ».'},
 {n:39,c:'drag',t:'Ratamacue double (double ratamacue)',m:'2/4',p:'dR8 / (3 dR16 L16 R16 / >L8 r8 | dL8 / (3 dL16 R16 L16 / >R8 r8',tip:'Un ra de plus avant le ratamacue.'},
 {n:40,c:'drag',t:'Ratamacue triple (triple ratamacue)',m:'2/4',p:'dR8 dR8 / (3 dR16 L16 R16 >L8 | dL8 dL8 / (3 dL16 R16 L16 >R8',tip:'Deux ras de plus avant le ratamacue.'}];
const RUD_CAT=[['roll','Roulements'],['diddle','Diddles (paradiddles)'],['flam','Flas'],['drag','Ras']];
const RUD_S=tlLoad('atelier-rud',{n:1,tempo:70,rep:4});
/* lecture du motif → notes {dur (en 32es), st, acc, gr:0/1/2, buzz, rest, trip} groupées par ligatures et mesures */
function rudParse(p){
  const bars=[];let bar=[],grp=[],trip=0;
  for(const tok of p.split(/\s+/)){
    if(tok==='|'){if(grp.length)bar.push(grp);grp=[];bars.push(bar);bar=[];continue;}
    if(tok==='/'){if(grp.length)bar.push(grp);grp=[];continue;}
    if(tok==='(3'){trip=3;continue;}
    let m=tok.match(/^r(\d+)$/);if(m){grp.push({rest:1,dur:32/+m[1]});continue;}
    m=tok.match(/^([fdz]?)(>?)([RL])(\d+)(\.?)$/);if(!m)continue;
    let dur=32/+m[4];if(m[5])dur*=1.5;
    grp.push({st:m[3],acc:!!m[2],gr:m[1]==='f'?1:m[1]==='d'?2:0,buzz:m[1]==='z',dur,trip:trip>0?(trip===3?'s':'m'):''});
    if(trip>0)trip--;}
  if(grp.length)bar.push(grp);if(bar.length)bars.push(bar);return bars;
}
function rudAbc(r,reps){
  const bars=rudParse(r.p);let body='',lyr=[];
  for(const bar of bars){body+=bar.map(g=>g.map(x=>{
      if(x.rest)return 'z'+(x.dur===1?'':x.dur);
      const d=x.trip?x.dur*2/3*1.5:x.dur;const dd=x.dur===1?'':String(x.dur);
      lyr.push(x.st);
      return (x.trip==='s'?'(3':'')+(x.buzz?'"^z"':'')+(x.acc?'!>!':'')+(x.gr===1?(x.st==='R'?'{/c}':'{/c}'):x.gr===2?'{cc}':'')+'c'+dd;}).join('')).join(' ')+' |';}
  return `X:1\nM:${r.m}\nL:1/32\nK:C clef=perc stafflines=1\n|:${body.replace(/\|$/,'')}:|\nw: ${lyr.join(' ')}\n`;
}
/* moments (en 32es) de chaque coup, appoggiatures comprises */
function rudEvents(r){
  const out=[];let u=0,i=0;
  for(const bar of rudParse(r.p))for(const g of bar)for(const x of g){
    const d=x.trip?x.dur*2/3:x.dur;
    if(!x.rest){out.push({u,d,st:x.st,acc:x.acc,gr:x.gr,buzz:x.buzz,i:i++});}
    u+=d;}
  return{ev:out,len:u};
}
function rudPlay(withClick){
  stop();const r=RUD.find(x=>x.n===RUD_S.n)||RUD[0],{ev,len}=rudEvents(r),c=A.init();if(typeof qzUnmute==='function')qzUnmute();
  const [bn,bd]=r.m.split('/').map(Number),beat32=32/bd*(bd===8?3:1),us=60/RUD_S.tempo/beat32,reps=RUD_S.rep;
  const ci=withClick?(bd===8?bn/3:bn)*beat32:0;
  const items=[],clicks=[];
  for(let k=0;k<reps;k++)for(const e of ev)items.push({u:ci+k*len+e.u,d:e.d,rest:false,i:e.i,e});
  if(withClick){const per=bd===8?bn/3:bn;for(let b=0;b<per;b++)clicks.push({u:b*beat32,strong:b===0,b,ci:true});for(let u=ci;u<ci+reps*len-1e-6;u+=beat32)clicks.push({u,strong:((u-ci)%len)<1e-6,b:Math.round((u-ci)/beat32)%per});}
  const M=MOD.rd;const s=run({items,clicks,us,endU:ci+reps*len,ci,meter:withClick?{beats:bd===8?bn/3:bn,label:r.m}:null},{sound:'none',onStep:it=>M.now(it.i),onEnd:()=>M.now(-1)});
  for(const it of items){const e=it.e,t=it.t,v=e.acc?1:.6,dur=it.d*us;
    if(e.gr===1)drHit('snare',t-.03,s.g,.28);
    if(e.gr===2){drHit('snare',t-.07,s.g,.25);drHit('snare',t-.035,s.g,.25);}
    if(e.buzz){const n=Math.max(3,Math.round(dur/.035));for(let k=0;k<n;k++)drHit('snare',t+k*dur*.85/n,s.g,k?.32:v);}
    else drHit('snare',t,s.g,v);}
}
MOD.rd.mount=function(){
  const M=this;M.bar=el('div',{class:'qzbtns rudbar'},btn('▶ Écouter',()=>rudPlay(false),'primary'),btn('● Jouer avec le métronome',()=>rudPlay(true)),btn('Rudiment au hasard',()=>{RUD_S.n=pick(RUD).n;tlSave('atelier-rud',RUD_S);M.fresh();}),stopBtn());
  M.root=el('div',{class:'tl rudw'});$('#answer').replaceChildren(M.root);
};
MOD.rd.fresh=function(){
  const M=this,r=RUD.find(x=>x.n===RUD_S.n)||RUD[0];
  const sel=el('select',{id:'rd_sel','aria-label':'Rudiment'},...RUD_CAT.map(([c,l])=>{const g=el('optgroup',{label:T(l)});RUD.filter(x=>x.c===c).forEach(x=>{const o=el('option',{value:x.n},`${x.n}. ${T(x.t)}`);if(x.n===r.n)o.selected=true;g.append(o);});return g;}));
  sel.addEventListener('change',()=>{RUD_S.n=+sel.value;tlSave('atelier-rud',RUD_S);M.fresh();});
  const nav=d=>{const i=RUD.findIndex(x=>x.n===r.n);RUD_S.n=RUD[(i+d+RUD.length)%RUD.length].n;tlSave('atelier-rud',RUD_S);M.fresh();};
  const tl=el('b',{},`♩ = ${RUD_S.tempo}`),tr=el('input',{type:'range',min:40,max:200,step:2,value:RUD_S.tempo,'aria-label':'Tempo'});
  tr.addEventListener('input',()=>{RUD_S.tempo=+tr.value;tl.textContent=`♩ = ${RUD_S.tempo}`;tlSave('atelier-rud',RUD_S);});
  const rp=sel2('rd_rep',[[2,'2 fois'],[4,'4 fois'],[8,'8 fois'],[16,'16 fois']],RUD_S.rep,v=>{RUD_S.rep=+v;tlSave('atelier-rud',RUD_S);});
  M.stand=el('div',{class:'rudstaff'});
  M.root.replaceChildren(M.bar,
    el('div',{class:'rudpick'},el('button',{type:'button',class:'btn quiet sq','aria-label':'Rudiment précédent',onclick:()=>nav(-1)},'‹'),sel,el('button',{type:'button',class:'btn quiet sq','aria-label':'Rudiment suivant',onclick:()=>nav(1)},'›')),
    el('div',{class:'rudhead'},el('span',{class:'rudnum'},String(r.n)),el('div',{},el('h2',{},T(r.t),typeof betaTag==='function'?betaTag():null),el('p',{class:'hint'},T(RUD_CAT.find(x=>x[0]===r.c)[1])+' · '+r.m))),
    M.stand,el('p',{class:'rudtip'},T(r.tip)),
    el('div',{class:'rudctl'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Tempo'),el('div',{class:'row2'},tr,tl)),el('label',{class:'qzfield'},el('span',{class:'fl'},'Répéter'),rp)),
    el('details',{class:'rudleg'},el('summary',{},'Comment lire'),el('p',{class:'hint'},'R = main droite, L = main gauche (sous chaque note). Petite note barrée = fla (une appoggiature), deux petites notes = ra (deux appoggiatures), > = accent, z = roulement écrasé. Les barres de reprise indiquent de répéter le motif.')));
  M.draw();
};
function sel2(id,opts,val,on){return sel(id,opts,val,on);}
MOD.rd.draw=function(){const M=this,r=RUD.find(x=>x.n===RUD_S.n)||RUD[0];if(!HAS_ABC())return;
  {const w=(M.stand.clientWidth||600)-16,sc=w<520?1:1.25;ABCJS.renderAbc(M.stand,rudAbc(r),{add_classes:true,staffwidth:Math.max(240,Math.min(720,w/sc-10)),scale:sc,paddingtop:10,paddingbottom:4,foregroundColor:'currentColor'});}
  M.els=[...M.stand.querySelectorAll('.abcjs-note')];};
MOD.rd.now=function(i){(this.els||[]).forEach(e=>e.classList.remove('is-now'));if(i>=0&&this.els&&this.els[i])this.els[i].classList.add('is-now');};
MOD.rd.redraw=function(){this.draw();};

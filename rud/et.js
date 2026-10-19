
/* ========== MODULE : Études techniques (gammes, arpèges, notes longues, liaisons…) ==========
   Exercices générés pour chaque instrument du module Doigtés, en notes écrites, dans un registre confortable.
   ez : registre facile (notes écrites, MIDI) ; tr : son réel = note écrite + tr (comme dans Doigtés) */
const ET_INST={
  flute:{ez:[60,86]},oboe:{ez:[58,82]},bsn:{ez:[36,62]},clar:{ez:[52,77]},asax:{ez:[58,84]},
  tpt:{ez:[55,79],slur:{base:[60,67,72,76,79],combos:[['0',0],['2',-1],['1',-2],['1-2',-3],['2-3',-4],['1-3',-5],['1-2-3',-6]]}},
  tbn:{ez:[40,65],slur:{base:[46,53,58,62,65],combos:[['1',0],['2',-1],['3',-2],['4',-3],['5',-4],['6',-5],['7',-6]],pos:1}},
  tuba:{ez:[28,53],slur:{base:[34,41,46,50,53],combos:[['0',0],['2',-1],['1',-2],['1-2',-3],['2-3',-4],['1-3',-5],['1-2-3',-6]]}},
  vln:{ez:[55,81]},vla:{ez:[48,74]},vc:{ez:[36,62]},cb:{ez:[40,64]},gtr:{ez:[52,79]},bass:{ez:[40,65]},mando:{ez:[55,81]}};
const ET_TYPES=[
  ['long','Notes longues','Une note par mesure : son stable, souffle (ou archet) régulier du début à la fin. Écoute la justesse.'],
  ['scale','Gamme','Monte et descends la gamme. Garde un son égal sur toutes les notes et le même tempo du début à la fin.'],
  ['thirds','Gamme en tierces','La gamme par sauts de tierce (do-mi, ré-fa…). Excellent pour les doigts et l\'oreille.'],
  ['arp','Arpèges (I – IV – V – I)','Les notes des accords de la tonalité, une après l\'autre. Vise chaque note sans glisser.'],
  ['pattern','Motifs de 4 notes','Groupes de 4 notes qui montent puis descendent la gamme (style Clarke). Pense « groupe » plutôt que « note ».'],
  ['ivs','Intervalles depuis la tonique','La tonique alterne avec chaque degré de la gamme : 1-2-1, 1-3-1, 1-4-1… Prépare chaque saut.'],
  ['chrom','Gamme chromatique','Tous les demi-tons sur une octave : dièses en montant, bémols en descendant.'],
  ['slurs','Liaisons (souplesse des lèvres)','Cuivres : deux notes de la même série d\'harmoniques, avec le même doigté (ou la même position). Change de note avec l\'air et les lèvres seulement.']];
const ET_S=tlLoad('atelier-et',{inst:'',type:'scale',key:'C',reg:'ez',rhy:'e',tempo:72});
const etInst=()=>DG_INST.find(x=>x.id===ET_S.inst&&ET_INST[x.id])||DG_INST.find(x=>x.id==='flute');
/* notes écrites d'un degré (le 7e degré du mineur est haussé : mineur harmonique) */
function etNote(key,deg,oct0){const li=key.t+deg,L=mod7(li),oct=oct0+Math.floor(li/7);let alt=sigAlts(key.sig)[L];if(key.minor&&mod7(deg)===6)alt+=1;return{L,oct,alt,midi:12*(oct+1)+PC[L]+alt};}
function etBuild(){
  const I=etInst(),C=ET_INST[I.id],key=KEYS[ET_S.key]||KEYS.C,type=ET_S.type,rng=ET_S.reg==='ez'?C.ez:[C.ez[0]-3,C.ez[1]+7];
  let seq=[],dur=ET_S.rhy==='q'?4:2,meter=METERS['4/4'],labels=null;
  const fit=degs=>{ /* octave de départ qui fait tenir l'exercice dans le registre, au plus près du centre */
    let best=null;for(let o=1;o<=6;o++){const ns=degs.map(d=>etNote(key,d,o)),lo=Math.min(...ns.map(n=>n.midi)),hi=Math.max(...ns.map(n=>n.midi));
      if(lo>=rng[0]&&hi<=rng[1]){const sc=Math.abs((lo+hi)/2-(rng[0]+rng[1])/2);if(!best||sc<best.sc)best={o,sc,ns};}}return best?best.ns:null;};
  const up=n=>Array.from({length:n+1},(_,i)=>i),two=fit(up(14))&&ET_S.reg!=='ez';
  const span=two?14:7;
  if(type==='long'){seq=fit(up(7));dur=16;}
  else if(type==='scale'){const d=up(span);seq=fit([...d,...d.slice(0,-1).reverse()]);}
  else if(type==='thirds'){const th=sp=>{const d=[];for(let i=0;i<=sp-2;i++)d.push(i,i+2);for(let i=sp;i>=2;i--)d.push(i,i-2);d.push(0);return d;};seq=fit(th(span))||fit(th(7));}
  else if(type==='arp'){const d=[0,2,4,7,4,2, 3,5,7,10,7,5, 4,6,8,11,8,6, 0,2,4,7,4,2,0];seq=fit(d)||fit([0,2,4,7,4,2,3,5,7,5,4,6,8,6,0])||fit([0,2,4,7,4,2,-1,1,4,1,-1,0]);}
  else if(type==='pattern'){const pt=sp=>{const d=[];for(let i=0;i<=sp-3;i++)d.push(i,i+1,i+2,i+3);for(let i=sp;i>=3;i--)d.push(i,i-1,i-2,i-3);d.push(0);return d;};seq=fit(pt(span))||fit(pt(7));}
  else if(type==='ivs'){const d=[];for(let i=1;i<=7;i++)d.push(0,i);d.push(0);seq=fit(d);}
  else if(type==='chrom'){
    const t=fit([0,7]);if(t){const t0=t[0].midi,SH=[[0,0],[0,1],[1,0],[1,1],[2,0],[3,0],[3,1],[4,0],[4,1],[5,0],[5,1],[6,0]],FL=[[0,0],[1,-1],[1,0],[2,-1],[2,0],[3,0],[4,-1],[4,0],[5,-1],[5,0],[6,-1],[6,0]];
      const sp=(m,tab)=>{const pc=((m%12)+12)%12,[li,alt]=tab[pc],oct=Math.floor((m-pc)/12)-1;return{L:li,oct,alt,midi:m};};
      const ton=k=>k===0?t[0]:k===12?t[1]:null;for(let k=0;k<=12;k++)seq.push(ton(k)||sp(t0+k,SH));for(let k=11;k>=0;k--)seq.push(ton(k)||sp(t0+k,FL));}}
  else if(type==='slurs'){
    if(!C.slur)return null;const S0=C.slur,hi=ET_S.reg==='ez'?3:4;seq=[];labels=[];
    for(const[name,sh] of S0.combos){const p=S0.base.slice(0,hi+1).map(m=>m+sh);
      const pat=[p[1],p[2],p[1],p[2],p[1],p[0],p[1],p[0]];
      for(const m of pat){const pc=((m%12)+12)%12,tab=[[0,0],[1,-1],[1,0],[2,-1],[2,0],[3,0],[4,-1],[4,0],[5,-1],[5,0],[6,-1],[6,0]],[li,alt]=tab[pc];seq.push({L:li,oct:Math.floor((m-pc)/12)-1,alt,midi:m});}
      labels.push(name);}
    dur=4;}
  if(!seq||!seq.length)return null;
  /* découpe en mesures de 4/4 ; on complète la dernière par la tonique tenue */
  const bar=16,events=[];let pos=0,m=0,fi=0;
  seq.forEach((n,i)=>{const last=i===seq.length-1&&type!=='long'&&type!=='slurs';let d=dur;
    if(last){d=bar-pos;if(d<=0){m++;pos=0;d=bar;}}
    events.push(Object.assign({},n,{dur:d,rest:false,m,pos,fi:Math.floor((m*bar+pos)/4)}));pos+=d;if(pos>=bar){pos=0;m++;}});
  if(pos>0){events.push({dur:bar-pos,rest:true,m,pos,fi:-1});m++;}
  const measures=events.length?events[events.length-1].m+1:1;
  return{kind:'mel',key,meter,clef:I.clef==='alto'?'alto':I.clef,shift:0,events,tempo:ET_S.tempo,measures,slurLabels:labels,inst:I};
}
MOD.et.mount=function(){
  const M=this;M.bar=el('div',{class:'qzbtns etbar'},btn('▶ Écouter',()=>M.play(false),'primary'),btn('● Jouer avec le métronome',()=>M.play(true)),btn('Étude au hasard',()=>{ET_S.type=pick(M.types()).at(0);ET_S.key=pick(M.keys());tlSave('atelier-et',ET_S);M.fresh();}),stopBtn());
  M.root=el('div',{class:'tl etw'});$('#answer').replaceChildren(M.root);
};
MOD.et.types=function(){const I=etInst();return ET_TYPES.filter(t=>t[0]!=='slurs'||ET_INST[I.id].slur);};
MOD.et.keys=function(){return ALL_KEYS.filter(k=>KEYS[k]);};
MOD.et.fresh=function(){
  const M=this;if(!ET_S.inst||!ET_INST[ET_S.inst])ET_S.inst='flute';const I=etInst();
  if(!M.types().some(t=>t[0]===ET_S.type))ET_S.type='scale';
  const save=()=>{tlSave('atelier-et',ET_S);M.fresh();};
  const fams=[...new Set(DG_INST.filter(x=>ET_INST[x.id]).map(x=>x.fam))];
  const ins=el('select',{id:'et_inst','aria-label':'Instrument'},...fams.map(f=>{const g=el('optgroup',{label:T(f)});DG_INST.filter(x=>x.fam===f&&ET_INST[x.id]).forEach(x=>{const o=el('option',{value:x.id},T(x.t));if(x.id===I.id)o.selected=true;g.append(o);});return g;}));
  ins.addEventListener('change',()=>{ET_S.inst=ins.value;save();});
  const typ=sel('et_type',M.types().map(t=>[t[0],t[1]]),ET_S.type,v=>{ET_S.type=v;save();});
  const key=sel('et_key',M.keys().map(k=>[k,KEYS[k].fr]),ET_S.key,v=>{ET_S.key=v;save();});
  const reg=sel('et_reg',[['ez','Facile (registre central)'],['full','Étendu (plus grave et plus aigu)']],ET_S.reg,v=>{ET_S.reg=v;save();});
  const rhy=sel('et_rhy',[['q','Noires'],['e','Croches']],ET_S.rhy,v=>{ET_S.rhy=v;save();});
  const tl=el('b',{},`♩ = ${ET_S.tempo}`),tr=el('input',{type:'range',min:40,max:160,step:2,value:ET_S.tempo,'aria-label':'Tempo'});
  tr.addEventListener('input',()=>{ET_S.tempo=+tr.value;tl.textContent=`♩ = ${ET_S.tempo}`;if(M.ex)M.ex.tempo=ET_S.tempo;tlSave('atelier-et',ET_S);});
  const ty=ET_TYPES.find(t=>t[0]===ET_S.type);
  M.stand=el('div',{class:'etstaff'});M.fing=el('div',{class:'etfing'});M.lab=el('p',{class:'hint etlab'});
  M.root.replaceChildren(M.bar,
    el('div',{class:'etctl'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Instrument'),ins),el('label',{class:'qzfield'},el('span',{class:'fl'},'Étude'),typ),
      el('label',{class:'qzfield'},el('span',{class:'fl'},'Tonalité'),key),el('label',{class:'qzfield'},el('span',{class:'fl'},'Registre'),reg),
      ET_S.type==='long'||ET_S.type==='slurs'?null:el('label',{class:'qzfield'},el('span',{class:'fl'},'Rythme'),rhy),
      el('label',{class:'qzfield'},el('span',{class:'fl'},'Tempo'),el('div',{class:'row2'},tr,tl))),
    el('div',{class:'ethead'},el('h2',{},T(ty[1]),typeof betaTag==='function'?betaTag():null),el('p',{class:'hint'},T(I.t)+(I.tr&&I.kind!=='fret'&&I.kind!=='bow'?' · '+T('notes écrites'):''))),
    M.stand,M.lab,el('p',{class:'ettip'},T(ty[2])),
    el('p',{class:'hint'},I.kind==='ww'||I.kind==='tpt'||I.kind==='tbn'?'Clique sur une note de la partition pour voir son doigté.':''),M.fing);
  M.ex=etBuild();if(!M.ex){M.stand.replaceChildren(el('p',{class:'hint'},'Cette étude ne tient pas dans le registre choisi : essaie le registre étendu ou une autre tonalité.'));return;}
  if(M.ex.slurLabels)M.lab.textContent=(I.kind==='tbn'?T('Positions'):T('Pistons'))+' : '+M.ex.slurLabels.join(' · ');
  M.draw();
};
MOD.et.draw=function(){const M=this,ex=M.ex;if(!ex||!HAS_ABC())return;
  const abc=abcOf(ex,{perLine:$('#answer').clientWidth<560?2:4}).replace(/^(K:[^\n]*)$/m,'$1');
  M.stand.replaceChildren();const els=draw(M.stand,abc);M.els=mapEls(els,ex);
  M.els.forEach((e,i)=>{if(!e)return;e.style.cursor='pointer';e.addEventListener('click',()=>M.showFing(i));});};
MOD.et.redraw=function(){this.draw();};
MOD.et.now=function(i){(this.els||[]).forEach(e=>e&&e.classList.remove('is-now'));if(i>=0&&this.els&&this.els[i]){this.els[i].classList.add('is-now');}};
MOD.et.showFing=function(i){
  const M=this,ex=M.ex,e=ex&&ex.events[i],I=ex&&ex.inst;if(!e||e.rest||!I)return;
  const notes=I.data&&DG_DATA[I.data];const n=notes&&notes.find(x=>x.m===e.midi);
  (M.els||[]).forEach(x=>x&&x.classList.remove('is-sel'));M.els[i]&&M.els[i].classList.add('is-sel');
  dgPlay(e.midi+(I.kind==='fret'||I.kind==='bow'?-(I.tr||0):(I.tr||0)),I.timbre);
  if(!n){M.fing.replaceChildren();return;}
  const fig=I.kind==='ww'?dgWindSvg(I.data,n.k,'big'):I.kind==='tpt'?dgValvesSvg(n.v,'big',I.id):I.kind==='tbn'?dgSlideSvg(n.p,[],'big'):null;
  M.fing.replaceChildren(el('div',{class:'etfbox'},el('b',{class:'etfn'},dgCap(T(noteName(e)))),fig));
};
MOD.et.play=function(withClick){
  const M=this,ex=M.ex;if(!ex)return;A.init();if(typeof qzUnmute==='function')qzUnmute();
  const I=ex.inst,sh=I.kind==='fret'||I.kind==='bow'?-(I.tr||0):(I.tr||0);
  const plan=planOf(ex,{countIn:withClick,metro:withClick});plan.items.forEach(it=>{if(it.midi!=null)it.midi+=sh;});
  run(plan,{onStep:it=>M.now(it.i),onEnd:()=>M.now(-1)});
};

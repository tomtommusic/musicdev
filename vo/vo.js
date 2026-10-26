/* ========== MODULE : Vocalises ==========
   Exercices vocaux classiques de la pédagogie du chant, classés par objectif.
   Chaque motif est écrit en demi-tons à partir de la tonique, avec sa durée en croches et sa syllabe.
   Le piano donne l'accord de départ, accompagne (option : joue aussi la mélodie), puis monte ou descend d'un demi-ton. */
const VO_CATS=[['ech','Échauffement'],['souf','Souffle et soutien'],['res','Résonance et placement'],['agi','Agilité'],['eten','Étendue et passage'],['just','Justesse'],['dic','Voyelles et diction']];
/* p : [demi-tons, durée en croches, syllabe] ; gl : glissando (le piano ne joue que les repères) */
const VO_EX=[
 {id:'lip',c:'ech',t:'Trille des lèvres',src:'Échauffement classique',tempo:96,syl:'Brrr',
  p:[[0,1],[2,1],[4,1],[5,1],[7,1],[5,1],[4,1],[2,1],[0,4]],
  how:['Lèvres détendues et rapprochées : souffle pour les faire vibrer (« brrr »), comme un moteur de bateau.','Garde un débit d\'air constant sur toute la gamme ; le son doit rester continu.','Si les lèvres s\'arrêtent, pose un doigt sur chaque joue et pousse légèrement vers le nez.'],
  why:'Réveille le souffle et la voix sans effort : la vibration des lèvres équilibre l\'air et le son.'},
 {id:'hum',c:'ech',t:'Fredonnement bouche fermée',src:'Échauffement classique',tempo:80,syl:'Mm',
  p:[[0,2],[4,2],[7,2],[4,2],[0,4]],
  how:['Lèvres fermées, dents légèrement séparées, langue au repos.','Cherche une vibration sur les lèvres et le nez (comme un « mm » de plaisir).','Garde la mâchoire souple : le son reste doux, sans pousser.'],
  why:'Place la voix vers l\'avant et la réchauffe en douceur.'},
 {id:'siren',c:'ech',t:'Sirène',src:'Échauffement classique',tempo:60,syl:'Ng',gl:true,
  p:[[0,4],[12,4],[0,4]],
  how:['Chante « ng » (comme la fin de « camping »), bouche entrouverte.','Glisse lentement du grave à l\'aigu puis redescends, sans t\'arrêter, comme une sirène.','Passe les changements de registre en douceur : allège le son en montant.'],
  why:'Relie les registres (voix de poitrine et de tête) et assouplit les cordes vocales.'},
 {id:'sigh',c:'ech',t:'Soupir descendant',src:'Échauffement classique',tempo:60,syl:'Ha',gl:true,
  p:[[12,4],[0,4]],
  how:['Commence dans l\'aigu, léger, sur un « ha » comme un soupir de soulagement.','Laisse le son glisser vers le grave, sans pression.','Garde la gorge ouverte, comme au début d\'un bâillement.'],
  why:'Détend le larynx et prépare une voix libre dans l\'aigu.'},
 {id:'szv',c:'souf',t:'S – Z – V tenus',src:'Exercice de soutien',tempo:70,
  p:[[0,8,'Sss'],[0,8,'Zzz'],[0,8,'Vvv']],
  how:['Inspire par le bas (ventre et côtes qui s\'ouvrent), épaules immobiles.','« Sss » sans son, puis « Zzz » et « Vvv » sur la note du piano.','Garde le son parfaitement égal du début à la fin de chaque note : pas de baisse à la fin.'],
  why:'Développe un souffle régulier et la gestion de l\'air (le soutien).'},
 {id:'stac',c:'souf',t:'Arpège piqué « Ha ha ha »',src:'Exercice de soutien',tempo:88,syl:'Ha',
  p:[[0,1],[null,1],[4,1],[null,1],[7,1],[null,1],[12,1],[null,1],[7,1],[null,1],[4,1],[null,1],[0,2]],
  how:['Chaque note est courte et détachée, comme un petit rire.','Sens ton ventre rebondir légèrement à chaque « ha » : c\'est lui qui lance le son, pas la gorge.','Relâche entre les notes pour que l\'air revienne tout seul.'],
  why:'Renforce l\'appui du souffle et la précision des attaques.'},
 {id:'messa',c:'souf',t:'Messa di voce',src:'Tradition bel canto',tempo:60,syl:'A',
  p:[[0,16]],
  how:['Tiens une seule note sur « a ».','Commence très doucement, enfle progressivement jusqu\'à un son plein, puis reviens au plus doux.','Le timbre et la justesse ne doivent pas changer pendant le crescendo et le decrescendo.'],
  why:'Exercice de maîtrise par excellence : contrôle du souffle, de la nuance et de la justesse.'},
 {id:'mamemi',c:'res',t:'Ma – mé – mi – mo – mou',src:'Échauffement classique',tempo:96,
  p:[[7,2,'ma'],[5,2,'mé'],[4,2,'mi'],[2,2,'mo'],[0,4,'mou']],
  how:['Le « m » place le son vers l\'avant ; garde cette sensation sur chaque voyelle.','Ouvre la bouche différemment pour chaque voyelle, mais sans changer la position du son.','Articule avec les lèvres et la langue, mâchoire souple.'],
  why:'Unifie les voyelles et garde la résonance vers l\'avant.'},
 {id:'nya',c:'res',t:'« Nya » sur cinq notes',src:'Technique de chant contemporain',tempo:100,syl:'Nya',
  p:[[0,1],[2,1],[4,1],[5,1],[7,1],[5,1],[4,1],[2,1],[0,4]],
  how:['Chante « nya » avec un son un peu nasal et brillant, comme pour taquiner quelqu\'un.','Le son reste petit et précis, même en montant.','N\'élargis pas la bouche en montant : garde la même forme.'],
  why:'Développe le mordant (« twang ») et aide à passer dans l\'aigu sans crier.'},
 {id:'oct',c:'eten',t:'Arpège à l\'octave',src:'Échauffement classique',tempo:84,syl:'A',
  p:[[0,2],[4,2],[7,2],[12,2],[7,2],[4,2],[0,4]],
  how:['Monte l\'arpège sur un « a » ouvert et lié.','Pense la note du haut légère : allège en montant au lieu de pousser.','Redescends sans perdre de qualité : la note grave reste brillante.'],
  why:'Élargit l\'étendue et égalise la voix sur une octave.'},
 {id:'leap',c:'eten',t:'Saut d\'octave',src:'Échauffement classique',tempo:76,
  p:[[0,2,'Wi'],[12,4,'a'],[7,2,'a'],[4,2,'a'],[0,4,'a']],
  how:['Lance le saut sur « wi », très léger, puis ouvre en « a » sur la note du haut.','Vise la note du haut directement, sans glisser.','Redescends l\'arpège en gardant le son rond.'],
  why:'Travaille l\'attaque des aigus et la souplesse entre les registres.'},
 {id:'nine',c:'agi',t:'Gamme de neuf notes',src:'Tradition bel canto',tempo:72,syl:'A',
  p:[[0,1],[2,1],[4,1],[5,1],[7,1],[9,1],[11,1],[12,1],[14,2],[12,1],[11,1],[9,1],[7,1],[5,1],[4,1],[2,1],[0,4]],
  how:['Chante la gamme liée, sur un seul souffle si possible.','Chaque note doit être nette et égale, sans glisser entre elles.','Commence lentement, puis monte le tempo quand c\'est propre.'],
  why:'Classique des méthodes de chant lyrique : agilité, égalité et longueur de souffle.'},
 {id:'thirds',c:'agi',t:'Gamme en tierces',src:'Tradition bel canto',tempo:80,syl:'A',
  p:[[0,1],[4,1],[2,1],[5,1],[4,1],[7,1],[5,1],[9,1],[7,1],[4,1],[0,4]],
  how:['Chante les tierces liées sur « a ».','Garde la même couleur de son sur toutes les notes.','Précision avant vitesse : ralentis si une note devient floue.'],
  why:'Développe l\'agilité et l\'oreille des intervalles.'},
 {id:'turn',c:'agi',t:'Gruppetto',src:'Tradition bel canto',tempo:66,syl:'A',
  p:[[0,1],[2,1],[0,1],[-1,1],[0,2],[4,2],[7,2],[4,2],[0,4]],
  how:['Le petit ornement du début (note, note au-dessus, note, note au-dessous, note) doit être léger et rapide.','Le reste de l\'arpège est calme et lié.','Travaille l\'ornement seul au besoin, puis remets-le dans l\'exercice.'],
  why:'Prépare les ornements du répertoire classique et baroque.'},
 {id:'ivs',c:'just',t:'Intervalles depuis la tonique',src:'Exercice de justesse',tempo:72,syl:'Lou',
  p:[[0,2],[2,2],[0,2],[4,2],[0,2],[5,2],[0,2],[7,2],[0,4]],
  how:['Reviens toujours à la tonique entre deux intervalles : c\'est ton point de repère.','Écoute la note du piano avant de chanter ; vise le centre de la note.','Essaie ensuite sans la mélodie au piano (option) : seulement les accords.'],
  why:'Fixe la justesse des intervalles par rapport à la tonique.'},
 {id:'triad',c:'just',t:'Accord parfait lent',src:'Exercice de justesse',tempo:60,syl:'No',
  p:[[0,4],[4,4],[7,4],[4,4],[0,8]],
  how:['Chante lentement les notes de l\'accord sur « no ».','Écoute comment ta note se fond dans l\'accord du piano : elle doit « sonner » avec lui.','Ajuste en douceur si tu entends un frottement.'],
  why:'Apprend à chanter juste dans l\'harmonie, comme dans une chorale.'},
 {id:'vowels',c:'dic',t:'Voyelles sur une note',src:'Tradition bel canto',tempo:72,
  p:[[0,2,'mi'],[0,2,'mé'],[0,2,'ma'],[0,2,'mo'],[0,4,'mou']],
  how:['Une seule note, cinq voyelles : seul l\'intérieur de la bouche change.','Garde la même hauteur et la même intensité d\'une voyelle à l\'autre.','Le « m » de chaque syllabe ramène le son vers l\'avant.'],
  why:'Égalise les voyelles : la base d\'un timbre homogène.'},
 {id:'bidi',c:'dic',t:'« Bi – di – bi – di »',src:'Exercice de diction',tempo:96,
  p:[[0,1,'bi'],[2,1,'di'],[4,1,'bi'],[5,1,'di'],[7,1,'bi'],[5,1,'di'],[4,1,'bi'],[2,1,'di'],[0,4,'bi']],
  how:['Articule les consonnes avec le bout de la langue et les lèvres, rapidement et légèrement.','Les consonnes ne coupent pas le son : la ligne reste liée.','Accélère progressivement le tempo.'],
  why:'Rend la diction plus claire et plus rapide sans tension.'}];
/* types de voix : tonique la plus grave, note la plus haute chantée, clé de lecture */
const VO_VOICES=[['sop','Soprano',57,79,'treble'],['mez','Mezzo-soprano',55,77,'treble'],['alt','Alto',53,74,'treble'],['ten','Ténor',48,69,'treble-8'],['bar','Baryton',45,65,'bass'],['bas','Basse',41,62,'bass']];
const VO_S=tlLoad('atelier-vo',{ex:'lip',voice:'mez',dir:'up',tempo:0,guide:true,cat:'',from:null,to:null});
const VO={sess:null,els:[]};
const VO_KEY_NAMES=['do','ré♭','ré','mi♭','mi','fa','fa♯','sol','la♭','la','si♭','si'];
const VO_ABC_KEY=['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const VO_LET='CDEFGAB',VO_NAT=[0,2,4,5,7,9,11],VO_DEG={0:0,2:1,4:2,5:3,7:4,9:5,11:6};
function voEx(){return VO_EX.find(x=>x.id===VO_S.ex)||VO_EX[0];}
function voVoice(){return VO_VOICES.find(v=>v[0]===VO_S.voice)||VO_VOICES[1];}
function voSpan(ex){const n=ex.p.filter(x=>x[0]!=null).map(x=>x[0]);return[Math.min(...n),Math.max(...n)];}
/* toniques possibles pour cette voix et cet exercice */
function voRange(){const ex=voEx(),v=voVoice(),[lo,hi]=voSpan(ex);const a=Math.max(v[2],v[2]-lo),b=v[3]-hi;return[a,Math.max(a,b)];}
function voKeys(){
  const[a,b]=voRange();let f=VO_S.from==null?a:Math.max(a,Math.min(b,VO_S.from)),t=VO_S.to==null?Math.min(b,f+7):Math.max(a,Math.min(b,VO_S.to));
  if(f>t)[f,t]=[t,f];
  const up=[];for(let k=f;k<=t;k++)up.push(k);
  if(VO_S.dir==='down')return up.reverse();if(VO_S.dir==='updown')return up.concat(up.slice(0,-1).reverse());if(VO_S.dir==='one')return[f];return up;
}
const VO_KN={en:['C','D♭','D','E♭','E','F','F♯','G','A♭','A','B♭','B'],es:['do','re♭','re','mi♭','mi','fa','fa♯','sol','la♭','la','si♭','si']};
const voKeyName=m=>((typeof I18N!=='undefined'&&VO_KN[I18N.lang])||VO_KEY_NAMES)[((m%12)+12)%12]+String(Math.floor(m/12)-1);
/* nom abc d'une note du motif (tonalité majeure de la tonique), selon l'armure */
function voAbcNote(tonic,semi,shift=0){
  tonic+=shift;
  const tp=((tonic%12)+12)%12,tl=VO_LET.indexOf(VO_ABC_KEY[tp][0]);
  const oct=Math.floor(semi/12),r=((semi%12)+12)%12,deg=VO_DEG[r]!=null?VO_DEG[r]:VO_DEG[r-1];
  const li=(tl+deg)%7,midi=tonic+semi,np=VO_NAT[li];let o=Math.round((midi-np)/12)-1;
  const alt=midi-((o+1)*12+np);
  let s=VO_LET[li];
  /* altération hors armure (gamme majeure : seulement si demi-ton chromatique) */
  const inKey=VO_DEG[r]!=null;const acc=inKey?'':(alt>0?'^':alt<0?'_':'=');
  if(o>=5){s=s.toLowerCase()+"'".repeat(o-5);}else s=s+','.repeat(Math.max(0,4-o));
  return acc+s;
}
function voAbc(ex,tonic,clef){
  const sh=clef==='treble-8'?12:0;
  const L=ex.p.map(([d,len])=>(d==null?'z':voAbcNote(tonic,d,sh))+(len===1?'':String(len)));
  const syl=ex.p.filter(x=>x[0]!=null).map(x=>(x[2]||ex.syl||'a').replace(/ /g,'~'));
  const total=ex.p.reduce((a,x)=>a+x[1],0),M=total%8===0?'4/4':'none';
  let body='',acc=0;for(let i=0;i<L.length;i++){body+=L[i]+' ';acc+=ex.p[i][1];if(M==='4/4'&&acc%8===0&&i<L.length-1)body+='| ';if(M==='3/4'&&acc%6===0&&i<L.length-1)body+='| ';}
  return`X:1\nM:${M}\nL:1/8\nK:${VO_ABC_KEY[((tonic%12)+12)%12]} clef=${clef}\n${ex.gl?'!slide!':''}${body}|]\nw: ${syl.join(' ')}\n`;
}
function voStop(){const s=VO.sess;if(!s)return;VO.sess=null;clearInterval(s.timer);s.timers.forEach(clearTimeout);
  try{s.g.gain.setTargetAtTime(0,A.ctx.currentTime,.03);setTimeout(()=>s.g.disconnect(),300);}catch(e){}
  MOD.vo.now(-1,null);MOD.vo.ui&&MOD.vo.ui();}
/* accord du piano (main gauche + accord) pour une tonique : I, ou V7 pour la transition */
function voChord(tonic){const pc=((tonic%12)+12)%12,b=36+pc,r=55+pc;return[b,r,r+4,r+7];}
function voPlay(){
  voStop();const c=A.init();if(typeof qzUnmute==='function')qzUnmute();if(typeof stop==='function')stop();
  const ex=voEx(),keys=voKeys(),bpm=VO_S.tempo||ex.tempo,e8=30/bpm;
  const g=c.createGain();g.gain.value=1;g.connect(A.out);
  const s={g,timers:[],ev:[],i:0,timer:0,t0:c.currentTime+.15};VO.sess=s;
  /* on prépare la liste d'événements : accord de départ (2 temps), motif, et ainsi de suite pour chaque tonique */
  let t=s.t0;const lag=typeof audioLag==='function'?audioLag():0;
  keys.forEach((k,ki)=>{
    s.ev.push({t,f:()=>{voChord(k).forEach((m,j)=>A.piano(m,t,e8*3.6,j?.35:.45,g));A.piano(k,t,e8*3.6,.5,g);},ui:{key:k,ki,n:keys.length,note:-1}});
    t+=e8*4;
    let u=0;const tab=ex.p;
    tab.forEach(([d,len],ni)=>{
      const tt=t+u*e8,dur=len*e8;
      if(d!=null){
        if(VO_S.guide&&!(ex.gl&&ni>0&&ni<tab.length-1))s.ev.push({t:tt,f:()=>A.piano(k+d,tt,Math.min(dur*.95,e8*8),.42,g)});
        if(u%4===0)s.ev.push({t:tt,f:()=>voChord(k).slice(1).forEach(m=>A.piano(m,tt,Math.min(e8*4,dur+e8*2)*.95,.22,g))});
      }
      s.ev.push({t:tt,ui:{key:k,ki,n:keys.length,note:ni}});
      u+=len;});
    t+=u*e8+e8*(ex.gl?2:1);
  });
  s.end=t;
  const tick=()=>{if(VO.sess!==s)return;if(S.mod!=='vo'){voStop();return;}const now=c.currentTime;
    while(s.i<s.ev.length&&s.ev[s.i].t<now+.25){const e=s.ev[s.i++];if(e.f)e.f();
      if(e.ui){const u=e.ui;s.timers.push(setTimeout(()=>{if(VO.sess===s)MOD.vo.now(u.note,u);},Math.max(0,(e.t+lag-now)*1000)));}}
    if(s.i>=s.ev.length&&now>s.end){voStop();}};
  tick();s.timer=setInterval(tick,40);MOD.vo.ui&&MOD.vo.ui();
}
MOD.vo.mount=function(){
  const M=this;M.root=el('div',{class:'tl vow'});$('#answer').replaceChildren(M.root);
};
MOD.vo.fresh=function(){
  const M=this,ex=voEx(),v=voVoice();
  const save=()=>tlSave('atelier-vo',VO_S);
  const re=()=>{save();if(VO.sess)voStop();M.fresh();};
  /* filtres par objectif */
  const chips=el('div',{class:'vocats',role:'group','aria-label':'Objectif'},
    [['','Tous'],...VO_CATS].map(([k,l])=>el('button',{type:'button',class:'vochip','aria-pressed':String(VO_S.cat===k),onclick:()=>{VO_S.cat=k;save();M.fresh();}},T(l))));
  const list=el('div',{class:'volist'},VO_EX.filter(x=>!VO_S.cat||x.c===VO_S.cat).map(x=>el('button',{type:'button',class:'voitem'+(x.id===ex.id?' on':''),'aria-pressed':String(x.id===ex.id),
    onclick:()=>{VO_S.ex=x.id;VO_S.from=null;VO_S.to=null;VO_S.tempo=0;re();}},el('b',{},T(x.t)),el('small',{},T(VO_CATS.find(c=>c[0]===x.c)[1])))));
  const[a,b]=voRange();const keyOpts=[];for(let k=a;k<=b;k++)keyOpts.push([k,voKeyName(k)]);
  const from=VO_S.from==null?a:Math.max(a,Math.min(b,VO_S.from)),to=VO_S.to==null?Math.min(b,from+7):Math.max(a,Math.min(b,VO_S.to));
  const voiceSel=sel('vo_voice',VO_VOICES.map(x=>[x[0],x[0]==='alt'?((typeof I18N!=='undefined'&&I18N.lang==='es')?'Contralto':'Alto'):T(x[1])]),VO_S.voice,x=>{VO_S.voice=x;VO_S.from=null;VO_S.to=null;re();});
  {const o=voiceSel.querySelector('option[value="alt"]');if(o)o.setAttribute('data-notr','');}
  const fromSel=sel('vo_from',keyOpts,from,x=>{VO_S.from=+x;re();}),toSel=sel('vo_to',keyOpts,to,x=>{VO_S.to=+x;re();});
  const dirSel=sel('vo_dir',[['up',T('Monter d\'un demi-ton à chaque fois')],['down',T('Descendre d\'un demi-ton à chaque fois')],['updown',T('Monter puis redescendre')],['one',T('Rester sur la tonalité de départ')]],VO_S.dir,x=>{VO_S.dir=x;re();});
  const bpm=VO_S.tempo||ex.tempo,tl=el('b',{},`♩ = ${bpm}`),tr=el('input',{type:'range',min:40,max:160,step:2,value:bpm,'aria-label':'Tempo'});
  tr.addEventListener('input',()=>{VO_S.tempo=+tr.value;tl.textContent=`♩ = ${VO_S.tempo}`;save();});
  tr.addEventListener('change',()=>{if(VO.sess)voPlay();});
  const guide=el('input',{type:'checkbox',id:'vo_guide'});guide.checked=!!VO_S.guide;guide.addEventListener('change',()=>{VO_S.guide=guide.checked;save();});
  const shift=d=>{const f=Math.max(a,Math.min(b,from+d)),t2=Math.max(a,Math.min(b,to+d));VO_S.from=f;VO_S.to=Math.max(f,t2);re();};
  M.play=btn('▶ Commencer',()=>VO.sess?voStop():voPlay(),'primary');
  M.keyLab=el('div',{class:'vokey','aria-live':'polite'});
  M.stand=el('div',{class:'vostaff'});
  M.ui=()=>{M.play.textContent=VO.sess?T('■ Arrêter'):T('▶ Commencer');M.play.classList.toggle('on',!!VO.sess);};
  const keys=voKeys();
  M.root.replaceChildren(
    chips,list,
    el('div',{class:'vocard'},
      el('div',{class:'vohead'},el('div',{},el('h2',{},T(ex.t),typeof betaTag==='function'?betaTag():null),el('p',{class:'hint'},T(VO_CATS.find(c=>c[0]===ex.c)[1])+' · '+T(ex.src))),),
      el('p',{class:'vowhy'},T(ex.why)),
      M.stand,M.keyLab,
      el('div',{class:'vobar'},M.play,
        el('button',{type:'button',class:'btn quiet',title:T('Tout descendre d\'un demi-ton'),onclick:()=>shift(-1)},'♭ −½'),
        el('button',{type:'button',class:'btn quiet',title:T('Tout monter d\'un demi-ton'),onclick:()=>shift(1)},'♯ +½')),
      el('details',{class:'vohow',open:''},el('summary',{},'Comment faire'),el('ol',{},ex.how.map(h=>el('li',{},T(h)))))),
    el('section',{class:'mtsec'},el('h3',{},'Réglages'),
      el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Type de voix'),voiceSel),
        el('label',{class:'qzfield'},el('span',{class:'fl'},'Tonalité de départ'),fromSel),
        el('label',{class:'qzfield'},el('span',{class:'fl'},'Tonalité d\'arrivée'),toSel)),
      el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Progression'),dirSel),
        el('label',{class:'qzfield'},el('span',{class:'fl'},'Tempo'),el('div',{class:'row2'},tr,tl))),
      el('label',{class:'chk'},guide,'Le piano joue aussi la mélodie (guide)'),
      el('p',{class:'hint'},T('{0} répétitions, de {1} à {2}. Le piano donne l\'accord de départ avant chaque répétition, puis change de tonalité.').replace('{0}',keys.length).replace('{1}',voKeyName(keys[0])).replace('{2}',voKeyName(keys[keys.length-1]))),
      el('p',{class:'hint'},'Chante sans forcer : si une note devient difficile, arrête-toi ou change la tonalité d\'arrivée. Les vocalises réchauffent la voix, elles ne doivent jamais faire mal.')));
  M.tonic=keys[0];M.draw();M.now(-1,null);M.ui();
  S.keyHandler=e=>{if(e.code==='Space'){e.preventDefault();VO.sess?voStop():voPlay();return true;}};
};
MOD.vo.draw=function(){const M=this;if(!HAS_ABC()||!M.stand)return;const ex=voEx(),v=voVoice();
  const w=(M.stand.clientWidth||600)-16,sc=w<520?1:1.2;
  ABCJS.renderAbc(M.stand,voAbc(ex,M.tonic,v[4]),{add_classes:true,staffwidth:Math.max(240,Math.min(760,w/sc-10)),scale:sc,paddingtop:8,paddingbottom:4,foregroundColor:'currentColor'});
  M.els=[...M.stand.querySelectorAll('.abcjs-note,.abcjs-rest')];};
MOD.vo.now=function(i,u){const M=this;
  if(u&&u.key!==M.tonic){M.tonic=u.key;M.draw();}
  (M.els||[]).forEach(e=>e.classList.remove('is-now'));if(i>=0&&M.els&&M.els[i])M.els[i].classList.add('is-now');
  if(M.keyLab)M.keyLab.textContent=u?T('Tonalité : {0} majeur · {1} / {2}').replace('{0}',voKeyName(u.key)).replace('{1}',u.ki+1).replace('{2}',u.n):T('Tonalité de départ : {0} majeur').replace('{0}',voKeyName(M.tonic));};
MOD.vo.redraw=function(){this.draw();};

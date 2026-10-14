/* ========== BADGES (récompenses) ==========
   Compteurs gardés seulement sur l'appareil ; un badge se débloque quand son objectif est atteint. */
const BD_KEY='atelier-badges';
const BD=(()=>{try{const o=JSON.parse(localStorage.getItem(BD_KEY)||'null');if(o&&o.c)return o;}catch(e){}return{c:{},sets:{},days:[],got:{},run:0};})();
const bdSave=()=>{try{localStorage.setItem(BD_KEY,JSON.stringify(BD));}catch(e){}};
const bdC=k=>BD.c[k]||0;
const bdSetN=k=>(BD.sets[k]||[]).length;
function bdStreak(){const ds=[...BD.days].sort();let best=0,cur=0,prev=null;for(const d of ds){const t=Date.parse(d+'T12:00:00');cur=prev!=null&&Math.round((t-prev)/864e5)===1?cur+1:1;prev=t;if(cur>best)best=cur;}return best;}
/* [id, icône, titre, description, objectif, valeur actuelle] */
const BADGES=[
  ['first','🎧','Premier pas','Réussis ton premier exercice.',1,()=>bdC('ok')],
  ['ok10','🎯','Dans le mille','10 bonnes réponses au total.',10,()=>bdC('ok')],
  ['ok100','🏅','Centurion','100 bonnes réponses au total.',100,()=>bdC('ok')],
  ['ok500','🏆','Maestro','500 bonnes réponses au total.',500,()=>bdC('ok')],
  ['run10','🔥','En feu','10 bonnes réponses de suite.',10,()=>bdC('bestRun')],
  ['dm','🎼','Oreille mélodique','Réussis 10 dictées mélodiques.',10,()=>bdC('ok_dm')],
  ['rhy','🥁','Métronome humain','Réussis 10 rythmes (dictée ou lecture rythmique).',10,()=>bdC('ok_dr')+bdC('ok_lr')],
  ['iv','📏','Chasseur d\'intervalles','Reconnais 25 intervalles.',25,()=>bdC('ok_iv')],
  ['pc','🎹','Harmoniste','Reconnais 10 progressions d\'accords.',10,()=>bdC('ok_pc')],
  ['ln','👀','Lecteur éclair','Lis 50 notes correctement.',50,()=>bdC('ok_ln')],
  ['read','🎶','Musicien lecteur','Réussis 10 lectures (à vue, mélodique ou solfège).',10,()=>bdC('ok_lm')+bdC('ok_la')+bdC('ok_so')],
  ['quiz','🎓','Examen réussi','Termine un questionnaire avec 80 % ou plus.',1,()=>bdC('quiz80')],
  ['tuner','🎻','Bien accordé','Utilise l\'accordeur 5 fois.',5,()=>bdC('tuner')],
  ['metro','⏱️','Gardien du tempo','Utilise le métronome 5 fois.',5,()=>bdC('metro')],
  ['rec','🎙️','En studio','Fais 5 enregistrements.',5,()=>bdC('rec')],
  ['lyr','📝','Parolier','Enregistre avec les paroles qui défilent.',1,()=>bdC('lyrrec')],
  ['mst','✨','Touche finale','Applique un post-traitement à une prise.',1,()=>bdC('mst')],
  ['chord','🎸','Collectionneur d\'accords','Consulte 20 accords dans le dictionnaire.',20,()=>bdC('chord')],
  ['dg','🎺','Multi-instrumentiste','Consulte les doigtés de 3 instruments.',3,()=>bdSetN('dg')],
  ['mods','🧭','Explorateur','Ouvre 10 modules différents.',10,()=>bdSetN('mods')],
  ['days5','📅','Assidu','Utilise l\'app 5 jours différents.',5,()=>BD.days.length],
  ['week','🗓️','Une semaine de suite','Utilise l\'app 7 jours consécutifs.',7,()=>bdStreak()]
];
function bdCheck(){
  let news=[];
  for(const[id,ic,t,d,goal,val]of BADGES){if(BD.got[id])continue;if(val()>=goal){BD.got[id]=Date.now();news.push([ic,t]);}}
  bdSave();news.forEach((b,i)=>setTimeout(()=>bdToast(b),i*1800));
  if(S.mod==='bd'&&MOD.bd.root)bdView();
}
function bdHit(k,n){BD.c[k]=(BD.c[k]||0)+(n||1);bdCheck();}
function bdAdd(set,v){const a=BD.sets[set]||(BD.sets[set]=[]);if(!a.includes(v)){a.push(v);bdCheck();}}
function bdTally(ok){
  if(ok){BD.c.ok=(BD.c.ok||0)+1;BD.c['ok_'+S.mod]=(BD.c['ok_'+S.mod]||0)+1;BD.run=(BD.run||0)+1;if(BD.run>(BD.c.bestRun||0))BD.c.bestRun=BD.run;}
  else BD.run=0;
  bdCheck();
}
function bdOpen(id){if(id&&id!=='ho'&&id!=='bd'&&id!=='ap')bdAdd('mods',id);}
function bdToday(){const d=new Date(),p=n=>String(n).padStart(2,'0');const k=`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;if(!BD.days.includes(k)){BD.days.push(k);if(BD.days.length>400)BD.days=BD.days.slice(-400);bdCheck();}}
function bdToast([ic,t]){
  const el0=el('div',{class:'bdtoast',role:'status'},el('span',{class:'bdti'},ic),el('span',{},el('small',{},T('Badge débloqué !')),el('b',{},T(t))));
  el0.addEventListener('click',()=>openModule('bd'));document.body.append(el0);
  setTimeout(()=>el0.classList.add('out'),3600);setTimeout(()=>el0.remove(),4200);
}
MOD.bd.mount=function(){$('#toolbar').replaceChildren();this.root=el('div',{class:'tl bd'});$('#answer').replaceChildren(this.root);bdView();};
MOD.bd.fresh=function(){bdView();};
function bdView(){
  const root=MOD.bd.root;if(!root)return;const n=BADGES.filter(b=>BD.got[b[0]]).length;
  root.replaceChildren(
    el('div',{class:'bdhead'},el('p',{class:'bdcount'},el('b',{},`${n} / ${BADGES.length}`),' ',T('badges débloqués')),typeof betaTag==='function'?betaTag():null),
    el('div',{class:'bdgrid'},...BADGES.map(([id,ic,t,d,goal,val])=>{const got=BD.got[id],v=Math.min(goal,val());
      return el('div',{class:'bdcard'+(got?' got':'')},el('span',{class:'bdic','aria-hidden':'true'},ic),el('b',{class:'bdt'},T(t)),el('span',{class:'bdd'},T(d)),
        got?el('span',{class:'bddate'},'✓ '+new Date(got).toLocaleDateString(TL('fr-CA','en-CA','es-ES'))):
          el('span',{class:'bdbar',style:`--p:${(v/goal*100).toFixed(0)}%`},el('i'),el('em',{'data-notr':''},`${v} / ${goal}`)));})),
    el('p',{class:'hint'},T('Tes badges sont gardés seulement sur cet appareil.')));
}
/* au démarrage : jour d'utilisation */
setTimeout(bdToday,1500);

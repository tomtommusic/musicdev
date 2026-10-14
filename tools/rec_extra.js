
/* ========== ENREGISTREUR : paroles qui défilent + mastering automatique ========== */

/* étiquette « Bêta » : fonction nouvelle, en phase de test */
function betaTag(){return el('span',{class:'beta',title:T('Fonction nouvelle, en phase de test : tes commentaires sont les bienvenus.')},T('Bêta'));}
/* ---------- paroles (téléprompteur) ---------- */
const LY_DEF={text:'',speed:20,size:26,open:false};
const LY=tlLoad('atelier-lyr',LY_DEF);
const lySave=()=>tlSave('atelier-lyr',LY);
const LS={raf:0,run:false,last:0,acc:0};
function lyLineH(){return LY.size*1.45;}
function lyTick(ts){
  const u=RS.ui;if(!LS.run||!u||!u.lybox){LS.raf=0;return;}
  const dt=LS.last?Math.min(.1,(ts-LS.last)/1000):0;LS.last=ts;
  /* vitesse en lignes par minute ; le défilement s'ajoute à la position actuelle : on peut glisser du doigt pour se recaler */
  LS.acc+=dt*LY.speed/60*lyLineH();
  if(LS.acc>=1){const px=Math.floor(LS.acc);LS.acc-=px;u.lybox.scrollTop+=px;}
  if(u.lybox.scrollTop+u.lybox.clientHeight>=u.lybox.scrollHeight-1&&!RS.on){lyRun(false);return;}
  LS.raf=requestAnimationFrame(lyTick);
}
function lyRun(on){
  LS.run=!!on&&LY.speed>0&&!!LY.text.trim();LS.last=0;LS.acc=0;cancelAnimationFrame(LS.raf);LS.raf=0;
  if(LS.run)LS.raf=requestAnimationFrame(lyTick);
  lyPaint();
}
/* appelé par l'enregistreur : départ du haut au début de la prise, arrêt à la fin */
function lyGo(on){const u=RS.ui;if(!u||!u.lybox)return;if(on){u.lybox.scrollTop=0;lyRun(true);}else lyRun(false);}
function lyPaint(){
  const u=RS.ui;if(!u||!u.ly)return;
  u.ly.classList.toggle('editing',!!u.lyEditing);
  u.lyplay.textContent=LS.run?'⏸ Pause':'▶ Défiler';
  u.lyspd.textContent=LY.speed?LY.speed+' '+T('lignes/min'):T('Manuel');
  u.lybox.style.fontSize=LY.size+'px';
  const empty=!LY.text.trim();u.lytxt.textContent=empty?'':LY.text;u.ly.classList.toggle('empty',empty);
  if(u.lfgo){u.lfgo.textContent=RS.on||RS.arming?'■':'●';u.lfgo.classList.toggle('on',RS.on||RS.arming);u.lfgo.setAttribute('aria-label',RS.on||RS.arming?'Arrêter':'Enregistrer');}
}
function lyFull(on){
  const u=RS.ui;if(!u)return;u.ly.classList.toggle('full',on);document.documentElement.classList.toggle('lyfull',on);
  if(on){u.ly.scrollIntoView({block:'start'});}
}
function lyView(u){
  const mk=(lab,fn,cls='',aria)=>{const b=el('button',{type:'button',class:'btn '+cls,onclick:fn},lab);if(aria)b.setAttribute('aria-label',aria);return b;};
  u.lytxt=el('div',{class:'lytxt'});
  u.lybox=el('div',{class:'lybox',tabindex:'0'},el('div',{class:'lypad'}),u.lytxt,el('div',{class:'lypad end'}));
  u.lybox.addEventListener('click',()=>{if(LY.speed>0&&LY.text.trim())lyRun(!LS.run);});
  u.lyarea=el('textarea',{class:'lyarea',rows:'10',spellcheck:'false',placeholder:'Colle ou écris tes paroles ici. Les espaces et les paragraphes sont gardés.'});
  u.lyarea.value=LY.text;
  u.lyarea.addEventListener('input',()=>{LY.text=u.lyarea.value;clearTimeout(u.lyt);u.lyt=setTimeout(lySave,300);});
  const done=mk('✓ Terminé',()=>{LY.text=u.lyarea.value;lySave();u.lyEditing=false;lyPaint();},'primary');
  const edit=mk('✎ Paroles',()=>{lyFull(false);lyRun(false);u.lyEditing=true;lyPaint();setTimeout(()=>u.lyarea.focus(),0);},'lyfs');
  u.lyplay=mk('▶ Défiler',()=>{if(!LS.run&&u.lybox.scrollTop+u.lybox.clientHeight>=u.lybox.scrollHeight-1)u.lybox.scrollTop=0;lyRun(!LS.run);});
  const top=mk('⇤ Début',()=>{u.lybox.scrollTop=0;LS.acc=0;},'quiet');
  u.lyspd=el('b',{class:'lyspd'});
  const spd=d=>mk(d>0?'+':'−',()=>{LY.speed=Math.max(0,Math.min(80,LY.speed+d));lySave();if(!LY.speed)lyRun(false);lyPaint();},'lystep',d>0?'Plus vite':'Moins vite');
  const size=d=>mk(d>0?'A+':'A−',()=>{const r=u.lybox.scrollTop/Math.max(1,u.lybox.scrollHeight);LY.size=Math.max(16,Math.min(56,LY.size+d));lySave();lyPaint();u.lybox.scrollTop=r*u.lybox.scrollHeight;},'lystep',d>0?'Texte plus gros':'Texte plus petit');
  u.lfgo=el('button',{type:'button',class:'lfgo',onclick:()=>RS.on||RS.arming?recStop():recStart()},'●');
  u.lfclock=el('b',{class:'lfclock'},'0:00');
  const full=mk('⛶ Plein écran',()=>lyFull(true),'lyfs');
  const close=mk('✕',()=>lyFull(false),'quiet lyclose','Quitter le plein écran');
  u.ly=el('section',{class:'mtsec lysec'},
    el('div',{class:'lyhead'},el('h3',{},'Paroles',betaTag()),el('div',{class:'lyfullbar'},u.lfgo,u.lfclock,close)),
    el('div',{class:'lyedit'},u.lyarea,el('div',{class:'qzbtns'},done)),
    el('div',{class:'lyshow'},
      u.lybox,
      el('p',{class:'lyempty hint'},'Colle tes paroles pour les voir défiler pendant l\'enregistrement.'),
      el('div',{class:'lyctl'},
        el('div',{class:'lygrp'},spd(-2),u.lyspd,spd(2)),
        el('div',{class:'lygrp'},size(-2),size(2)),
        u.lyplay,top,edit,full)),
    el('p',{class:'hint lyhint'},'Le texte part du début dès que l\'enregistrement commence (après le décompte). Touche le texte pour le mettre en pause ; glisse du doigt pour le recaler. « Manuel » : aucun défilement automatique.'));
  u.lyEditing=!LY.text.trim()&&false;
  setTimeout(lyPaint,0);
  return u.ly;
}

/* ---------- mastering automatique ---------- */
/* chaîne : passe-haut → égaliseur selon le style → compresseur doux → volume visé (LUFS approx.) → limiteur à -1 dB ; tout se fait sur l'appareil */
const MST_STYLES=[['chaud','Chaud'],['equilibre','Équilibré'],['brillant','Brillant']];
const MST_INT=[['leger','Léger'],['moyen','Moyen'],['fort','Fort']];
const MST=tlLoad('atelier-mst',{style:'equilibre',int:'moyen',room:false});
async function mstDecode(blob){const c=A.init();return await new Promise((ok,ko)=>{blob.arrayBuffer().then(ab=>{const p=c.decodeAudioData(ab,ok,ko);if(p&&p.then)p.then(ok,ko);}).catch(ko);});}
/* volume intégré approximatif : blocs de 400 ms, porte absolue -70 et relative -10 (comme le LUFS, sans pondération K) */
function mstLoud(chs,sr){
  const B=Math.round(sr*.4),H=Math.round(sr*.1),n=chs[0].length,ms=[];
  for(let s=0;s+B<=n;s+=H){let e=0;for(const d of chs)for(let i=s;i<s+B;i++)e+=d[i]*d[i];ms.push(e/B/chs.length);}
  if(!ms.length)return -70;const L=m=>10*Math.log10(m+1e-12);
  let g=ms.filter(m=>L(m)>-70);if(!g.length)return -70;
  const rel=L(g.reduce((a,b)=>a+b,0)/g.length)-10;g=g.filter(m=>L(m)>rel);
  return L(g.reduce((a,b)=>a+b,0)/g.length);
}
function mstWav(ch,sr){
  const n=ch[0].length,nc=ch.length,ab=new ArrayBuffer(44+n*2*nc),v=new DataView(ab),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
  w(0,'RIFF');v.setUint32(4,36+n*2*nc,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,nc,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2*nc,true);v.setUint16(32,2*nc,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2*nc,true);
  let o=44;for(let i=0;i<n;i++)for(let c=0;c<nc;c++){const s=Math.max(-1,Math.min(1,ch[c][i]+(Math.random()-Math.random())/32768));v.setInt16(o,s<0?s*32768:s*32767,true);o+=2;}
  return new Blob([ab],{type:'audio/wav'});
}
function mstView(au){
  const L=RS.last,box=el('div',{class:'mstbox'});
  const pick=(opts,key)=>el('div',{class:'mstseg',role:'group'},...opts.map(([v,lab])=>{const b=el('button',{type:'button',class:'btn quiet mstopt','aria-pressed':String(MST[key]===v)},lab);
    b.addEventListener('click',()=>{MST[key]=v;tlSave('atelier-mst',MST);b.parentNode.querySelectorAll('.mstopt').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});return b;}));
  const state=el('p',{class:'hint mststate'});
  const run=btn(L.orig?'Refaire le post-traitement':'✨ Appliquer le post-traitement',async()=>{
    run.disabled=true;state.textContent=T('Post-traitement en cours… (quelques secondes)');
    try{const w=await mstProcess(L.orig||L.blob,MST.style,MST.int,{room:!!MST.room,onStep:t=>{state.textContent=T('Post-traitement en cours…')+' '+T(t);}});if(!L.orig){L.orig=L.blob;L.origType=L.type;L.origExt=L.ext;}
      Object.assign(L,{blob:w,type:'audio/wav',ext:'wav',mst:{style:MST.style,int:MST.int,room:!!MST.room,before:MS2.before,after:MS2.after},useOrig:false});await recStore(L);recShow();}
    catch(e){state.textContent='Le post-traitement n\'a pas fonctionné sur cet appareil.';run.disabled=false;}},'primary');
  const room=el('input',{type:'checkbox'});room.checked=!!MST.room;room.addEventListener('change',()=>{MST.room=room.checked;tlSave('atelier-mst',MST);});
  const parts=[el('div',{class:'mstrow'},el('span',{class:'fl'},'Style'),pick(MST_STYLES,'style')),el('div',{class:'mstrow'},el('span',{class:'fl'},'Intensité'),pick(MST_INT,'int')),
    el('label',{class:'chk mstroom'},room,'Ajouter une légère ambiance de salle (utile pour une voix enregistrée de près)'),el('div',{class:'qzbtns'},run)];
  if(L.orig){
    /* comparer avant / après au même endroit de la pièce */
    const ab=(useOrig)=>{const t=au.currentTime,pl=!au.paused;L.useOrig=useOrig;au.src=URL.createObjectURL(useOrig?L.orig:L.blob);
      au.addEventListener('loadedmetadata',()=>{try{au.currentTime=t;}catch(e){}if(pl)au.play().catch(()=>{});},{once:true});
      bo.setAttribute('aria-pressed',String(useOrig));bm.setAttribute('aria-pressed',String(!useOrig));};
    const bo=el('button',{type:'button',class:'btn quiet mstopt','aria-pressed':'false',onclick:()=>ab(true)},'Original');
    const bm=el('button',{type:'button',class:'btn quiet mstopt','aria-pressed':'true',onclick:()=>ab(false)},'Avec post-traitement');
    const undo=btn('Retirer le post-traitement',async()=>{Object.assign(L,{blob:L.orig,type:L.origType,ext:L.origExt,orig:null,mst:null});await recStore(L);recShow();},'quiet');
    const sn=MST_STYLES.find(x=>x[0]===L.mst.style),inn=MST_INT.find(x=>x[0]===L.mst.int);
    const lu=v=>(v==null||!isFinite(v))?'–':(Math.round(v*10)/10).toString().replace('.',I18N.lang==='en'?'.':',')+' LUFS';
    parts.unshift(el('p',{class:'mstdone'},el('b',{},'✓ Post-traitement appliqué'),' ',el('span',{},`${T(sn?sn[1]:'')} · ${T(inn?inn[1]:'').toLowerCase()}${L.mst.room?' · '+T('ambiance'):''}`)),
      L.mst.before!=null?el('p',{class:'hint mstlu'},T('Volume'),' : ',el('b',{'data-notr':''},lu(L.mst.before)),' → ',el('b',{'data-notr':''},lu(L.mst.after))):null,
      el('div',{class:'mstrow'},el('span',{class:'fl'},'Écouter'),el('div',{class:'mstseg'},bo,bm)));
    parts.push(el('div',{class:'qzbtns'},undo));
    state.textContent='Le fichier partagé ou téléchargé est la version avec post-traitement.';
  }
  box.append(el('h4',{},'Post-traitement',betaTag()),
    el('p',{class:'hint'},'Analyse ta prise, puis la peaufine : égalisation adaptée à ta voix ou ton instrument, « s » adoucis, compression douce et volume ajusté, sans saturer. Les nuances de ton interprétation sont gardées.'),
    ...parts,state);
  return box;
}

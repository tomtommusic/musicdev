/* ========== MODULE : Tester mes connaissances — interface ========== */
const QZ={test:null,view:'start',i:0,name:'',title:'Évaluation de théorie musicale',confirm:false};
const QZ_STORE='atelier-quiz';
const QZ_ARM={responsive:undefined,staffwidth:150,scale:1.45,paddingtop:6,paddingbottom:6,paddingleft:4,paddingright:4};
const QZ_GLYPH={responsive:undefined,staffwidth:40,scale:1.6,paddingtop:4,paddingbottom:4,paddingleft:4,paddingright:4};
function qzSave(){try{if(!QZ.test){localStorage.removeItem(QZ_STORE);return;}const t=QZ.test;
  localStorage.setItem(QZ_STORE,JSON.stringify({seed:t.seed,cfg:t.cfg,resp:t.resp,done:t.done,name:t.name,i:QZ.i,view:QZ.view,date:t.date}));}catch(e){}}
function qzLoad(){try{const o=JSON.parse(localStorage.getItem(QZ_STORE)||'null');if(!o||!o.cfg)return;
  const qs=qzBuild(o.cfg,o.seed);if(!qs.length)return;
  QZ.test={seed:o.seed,cfg:o.cfg,qs,resp:o.resp||[],done:!!o.done,name:o.name||'',date:o.date||Date.now()};QZ.i=Math.min(o.i||0,qs.length-1);QZ.view=o.view==='res'?'res':'q';QZ.name=QZ.test.name;}catch(e){}}
const qzAnswered=(q,r)=>r!=null&&(Array.isArray(r)?(q.fields?r.every(x=>x):r.length>0):typeof r==='number'||String(r).trim()!=='');
const qzScore=t=>t.qs.reduce((a,q,i)=>a+(q.check(t.resp[i])?1:0),0);
const qzDate=d=>new Date(d).toLocaleDateString(TL('fr-CA','en-CA','es-ES'),{year:'numeric',month:'long',day:'numeric'});
const qzSubjLabel=q=>`${QZ_SUB[q.sub].subj.t} · ${QZ_SUB[q.sub].t}`;
function qzNew(){const c=clone(S.cfg.tq),seed=(Math.random()*2**32)>>>0;const qs=qzBuild(c,seed);
  if(!qs.length){feedback('Aucune question possible avec ces réglages : coche au moins une notion et un format compatible.','bad');return;}
  QZ.test={seed,cfg:c,qs,resp:new Array(qs.length).fill(null),done:false,name:QZ.name,date:Date.now()};QZ.i=0;QZ.view='q';QZ.confirm=false;qzSave();qzRender();}

MOD.tq.mount=function(){
  $('#toolbar').replaceChildren();
  this.root=el('div',{class:'qz'});$('#answer').replaceChildren(this.root);
  if(!QZ.test)qzLoad();
};
MOD.tq.fresh=function(){qzRender();};
MOD.tq.redraw=function(){qzRender();};
function qzRender(){
  const root=MOD.tq.root;if(!root||S.mod!=='tq')return;S.keyHandler=null;feedback('');
  if(QZ.view==='q'&&QZ.test)root.replaceChildren(qzQuestionView());
  else if(QZ.view==='res'&&QZ.test&&QZ.test.done)root.replaceChildren(qzResultView());
  else{QZ.view='start';root.replaceChildren(qzStartView());}
}
function qzGo(i){QZ.i=Math.max(0,Math.min(QZ.test.qs.length-1,i));QZ.confirm=false;qzSave();qzRender();
  const top=$('.qzhead');if(top&&top.getBoundingClientRect().top<0)top.scrollIntoView({block:'start',behavior:'smooth'});}

/* ---------- accueil ---------- */
function qzStartView(){
  const c=S.cfg.tq,subs=c.topics.filter(s=>QZ_SUB[s]),lv=QZ_LEVELS[c.level-1][1];
  const bySubj=QZ_SUBJ.map(s=>({s,on:s.subs.filter(([id])=>subs.includes(id))})).filter(x=>x.on.length);
  const name=el('input',{type:'text',class:'qzin',id:'qz_name',maxlength:'40',placeholder:'Ton nom (facultatif)',autocomplete:'name'});name.value=QZ.name||'';
  name.addEventListener('input',()=>{QZ.name=name.value.trim();});
  const t=QZ.test,inProg=t&&!t.done,answered=t?t.qs.filter((q,i)=>qzAnswered(q,t.resp[i])).length:0;
  const fm=c.formats.length===3?'tous les formats':c.formats.map(f=>QZ_FORMATS.find(x=>x[0]===f)[1].toLowerCase()).join(', ');
  const student=el('div',{class:'qzcard qzstart'},
    el('p',{class:'eyebrow'},'Questionnaire'),
    el('h2',{},'Prêt à tester tes connaissances ?'),
    el('p',{class:'qzsum'},`${c.n} questions tirées au hasard · niveau ${lv.toLowerCase()} · ${fm}`),
    bySubj.length?el('ul',{class:'qzsubjs'},bySubj.map(({s,on})=>el('li',{},el('b',{},s.t+(s.listen?' (écoute)':'')),' ',el('span',{},on.map(x=>x[1]).join(', '))))):
      el('p',{class:'qzwarn'},'Aucune notion choisie. Ouvre les réglages pour cocher les sujets à évaluer.'),
    el('p',{class:'hint'},'Une question par page. Tu peux revenir en arrière et changer tes réponses avant de terminer. Ton résultat s\'affiche tout de suite à la fin.'),
    el('label',{class:'qzfield'},el('span',{class:'fl'},'Nom'),name),
    el('div',{class:'qzbtns'},
      btn(inProg?'Nouveau questionnaire':'Commencer le questionnaire',()=>{QZ.name=name.value.trim();qzNew();},'primary'),
      inProg?btn(`Reprendre le questionnaire en cours (${answered}/${t.qs.length} répondues)`,()=>{QZ.view='q';qzRender();}):null,
      t&&t.done?btn('Voir mon dernier résultat',()=>{QZ.view='res';qzRender();}):null,
      btn('Réglages',()=>{const p=$('#settings');if(p.hidden)$('#setbtn').click();p.scrollIntoView({behavior:'smooth',block:'start'});},'quiet')));
  const title=el('input',{type:'text',class:'qzin',id:'qz_title',maxlength:'70'});title.value=QZ.title;title.addEventListener('input',()=>{QZ.title=title.value;});
  const out=el('div',{class:'qzdeliver'});
  const teacher=el('div',{class:'qzcard qzteach'},
    el('h3',{},'Pour l\'enseignant : un questionnaire à imprimer'),
    el('p',{class:'hint'},'Crée un PDF avec les mêmes réglages : de nouvelles questions à chaque fois, prêtes à photocopier, et le corrigé sur des pages séparées à la fin. Les questions d\'écoute ne sont pas incluses sur papier.'),
    el('label',{class:'qzfield'},el('span',{class:'fl'},'Titre'),title),
    el('div',{class:'qzbtns'},btn('Créer le PDF (questionnaire + corrigé)',async ev=>{
      const b=ev.currentTarget;const cfg=clone(S.cfg.tq),seed=(Math.random()*2**32)>>>0,qs=qzBuild(cfg,seed,{paper:true});
      if(!qs.length){out.replaceChildren(el('p',{class:'qzwarn'},'Aucune question imprimable avec ces réglages (les questions d\'écoute ne vont pas sur papier).'));return;}
      await qzMakePdf(b,out,()=>qzPdfBlank(qs,cfg),`MusicDEV-questionnaire-${new Date().toISOString().slice(0,10)}.pdf`);})),out);
  return el('div',{class:'qzwrap'},student,teacher);
}

/* ---------- une question ---------- */
function qzQuestionView(){
  const t=QZ.test,N=t.qs.length,i=QZ.i,q=t.qs[i],review=t.done,r=t.resp[i];
  const set=v=>{t.resp[i]=v;qzSave();dots.replaceWith(dots=qzDots());};
  let dots=qzDots();
  const card=el('div',{class:'qzcard qzq'+(review?' review':'')});
  card.append(el('p',{class:'qzprompt'},q.prompt));
  if(q.play)card.append(el('div',{class:'qzplay'},btn('▶ Écouter',()=>q.play(),'primary'),btn('■',()=>stop(),'quiet sq')));
  if(q.abc){const st=el('div',{class:'staff qzstaff'+(q.small?' small':'')});card.append(st);requestAnimationFrame(()=>draw(st,q.abc,/clef=none/.test(q.abc)?Object.assign({},QZ_GLYPH,{scale:2}):q.small?Object.assign({},QZ_ARM,{scale:1.9}):{paddingtop:12,paddingbottom:8}));}
  card.append(qzAnswerUI(q,r,set,review));
  if(review)card.append(qzVerdict(q,r));
  const last=i===N-1;
  const nav=el('div',{class:'qznav'},
    btn('‹ Précédente',()=>qzGo(i-1),'quiet'+(i===0?' hide':'')),
    review?btn('Retour au résultat',()=>{QZ.view='res';qzSave();qzRender();}):null,
    last?(review?null:btn('Terminer et voir mon résultat',()=>qzFinish(),'primary')):btn('Suivante ›',()=>qzGo(i+1),'primary'));
  const conf=QZ.confirm?qzConfirmBox():null;
  return el('div',{class:'qzwrap'},
    el('div',{class:'qzhead'},el('span',{class:'qznum'},`Question ${i+1} sur ${N}`),el('span',{class:'qztag'},qzSubjLabel(q))),
    dots,card,conf,nav,
    review?null:el('p',{class:'qzfoot'},btn('Terminer maintenant',()=>qzFinish(),'quiet'),btn('Quitter (le questionnaire est gardé)',()=>{QZ.view='start';qzRender();},'quiet')));
  function qzDots(){
    return el('div',{class:'qzdots',role:'navigation','aria-label':'Questions'},t.qs.map((qq,k)=>{
      const ans=qzAnswered(qq,t.resp[k]),cls=['qzdot',k===i?'cur':'',review?(qq.check(t.resp[k])?'ok':'bad'):ans?'done':''].filter(Boolean).join(' ');
      return el('button',{class:cls,type:'button','aria-label':`Question ${k+1}`+(ans?' (répondue)':''),'aria-current':k===i?'step':null,onclick:()=>qzGo(k)},String(k+1));}));
  }
}
function qzConfirmBox(){
  const t=QZ.test,miss=t.qs.map((q,i)=>qzAnswered(q,t.resp[i])?0:i+1).filter(Boolean);
  return el('div',{class:'qzconfirm'},el('p',{},`Il reste ${miss.length} question${miss.length>1?'s':''} sans réponse (n° ${miss.join(', ')}). Une question sans réponse compte comme une erreur.`),
    el('div',{class:'qzbtns'},btn('Terminer quand même',()=>qzFinish(true),'primary'),btn('Revenir à la première sans réponse',()=>qzGo(miss[0]-1),'quiet')));
}
function qzFinish(force){
  const t=QZ.test,miss=t.qs.filter((q,i)=>!qzAnswered(q,t.resp[i])).length;
  if(miss&&!force){QZ.confirm=true;qzRender();const c=$('.qzconfirm');if(c)c.scrollIntoView({block:'center',behavior:'smooth'});return;}
  stop();t.done=true;t.date=Date.now();QZ.view='res';QZ.confirm=false;qzSave();qzRender();window.scrollTo({top:0,behavior:'smooth'});
}
function qzVerdict(q,r){
  const ok=q.check(r);const box=el('div',{class:'qzverdict '+(ok?'ok':'bad')});
  box.append(el('p',{class:'qzv'},ok?'✓ Bonne réponse':(qzAnswered(q,r)?'✗ Ce n\'est pas la bonne réponse':'✗ Pas de réponse')));
  if(!ok){box.append(el('p',{},el('b',{},'Réponse attendue : '),q.answerText));
    if(q.answerAbc&&(q.pad||q.rhy)){const st=el('div',{class:'staff qzstaff'});box.append(st);requestAnimationFrame(()=>draw(st,q.answerAbc,{paddingtop:10,paddingbottom:6}));}}
  if(q.topic&&typeof LIB_TOPICS!=='undefined'&&LIB_TOPICS[q.topic])box.append(el('p',{},btn('📖 Revoir cette notion dans la bibliothèque',()=>openLibrary(q.topic),'quiet')));
  return box;
}

/* ---------- zones de réponse ---------- */
function qzAnswerUI(q,r,set,locked){
  if(q.opts){
    const glyph=q.opts.every(o=>o.abc&&/clef=none/.test(o.abc)),arm=!glyph&&q.opts.every(o=>o.abc&&o.small);
    const box=el('div',{class:'qzopts'+(glyph?' grid':arm?' grid wide':'')});
    q.opts.forEach((o,k)=>{
      const b=el('button',{type:'button',class:'qzopt'+(locked?(k===q.ans?' right':k===r?' wrong':''):''),'aria-pressed':String(r===k),disabled:locked},
        el('span',{class:'qzl'},QA[k]),o.abc?el('span',{class:'qzoabc'}):el('span',{class:'qzot'},o.t));
      if(o.abc)requestAnimationFrame(()=>{const t=b.querySelector('.qzoabc');draw(t,o.abc,/clef=none/.test(o.abc)?QZ_GLYPH:o.small?QZ_ARM:{paddingtop:6,paddingbottom:4});qzFitSvg(t);});
      b.addEventListener('click',()=>{set(k);box.querySelectorAll('.qzopt').forEach((x,j)=>x.setAttribute('aria-pressed',String(j===k)));});
      box.append(b);});
    return box;
  }
  if(q.fields){
    const vals=Array.isArray(r)?r.slice():q.fields.map(()=>'');
    return el('div',{class:'qzfields'},q.fields.map((f,k)=>{const s=el('select',{class:'qzsel','aria-label':f.label,disabled:locked});
      s.append(el('option',{value:''},f.label+'…'));f.options.forEach(([v,l])=>{const o=el('option',{value:v},l);if(vals[k]===v)o.selected=true;s.append(o);});
      s.addEventListener('change',()=>{vals[k]=s.value;set(vals.slice());});return el('label',{class:'qzfield'},el('span',{class:'fl'},f.label),s);}));
  }
  if(q.pad){
    if(locked){const st=el('div',{class:'staff qzstaff'});requestAnimationFrame(()=>draw(st,q.respAbc(r),{paddingtop:14,paddingbottom:10}));return el('div',{},el('p',{class:'hint'},'Ta réponse :'),st);}
    return makeQzPad(q,r,set).el;
  }
  if(q.rhy){
    if(locked){const st=el('div',{class:'staff qzstaff'});requestAnimationFrame(()=>draw(st,q.respAbc(r),{paddingtop:10,paddingbottom:6}));return el('div',{},el('p',{class:'hint'},'Ta réponse :'),st);}
    return makeQzRhy(q,r,set);
  }
  /* réponse courte */
  const inp=el('input',{type:'text',class:'qzin qzshort',placeholder:q.ph||'Ta réponse',autocomplete:'off',autocapitalize:'none',spellcheck:'false',disabled:locked,inputmode:q.num?'decimal':'text'});
  inp.value=r||'';inp.addEventListener('input',()=>set(inp.value));
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(QZ.i<QZ.test.qs.length-1)qzGo(QZ.i+1);}});
  const ins=ch=>{const a=inp.selectionStart??inp.value.length,b=inp.selectionEnd??a;inp.value=inp.value.slice(0,a)+ch+inp.value.slice(b);inp.focus();inp.setSelectionRange(a+1,a+1);set(inp.value);};
  return el('div',{class:'qzshortbox'},inp,locked||q.num?null:el('div',{class:'qzsym'},el('button',{type:'button',class:'btn quiet sq',title:'Dièse',onclick:()=>ins('♯')},'♯'),el('button',{type:'button',class:'btn quiet sq',title:'Bémol',onclick:()=>ins('♭')},'♭')),
    locked?null:el('p',{class:'hint'},q.hint||(q.num?'Écris un nombre.':'Les accents et les majuscules ne comptent pas. Tu peux écrire # pour dièse et b pour bémol.')));
}
/* une portée de taille fixe peut rétrécir dans une case étroite */
function qzFitSvg(t){const sv=t&&t.querySelector('svg');if(!sv||sv.getAttribute('viewBox'))return;const w=parseFloat(sv.getAttribute('width')),h=parseFloat(sv.getAttribute('height'));if(w&&h)sv.setAttribute('viewBox',`0 0 ${w} ${h}`);}
/* portée où l'on pose des notes (rondes) */
function makeQzPad(q,resp,onChange){
  const P=q.pad,notes=(Array.isArray(resp)?resp:[]).map(n=>Object.assign({},n));let acc=null;
  const staff=el('div',{class:'staff qzpad',tabindex:'0','aria-label':'Portée : touche une ligne ou un interligne pour poser une note'});
  const tag=el('div',{class:'edtag',hidden:true}),wrap=el('div',{class:'edwrap'},staff,tag);
  const accBtns=[[1,'♯','Dièse'],[-1,'♭','Bémol'],[0,'♮','Bécarre']].map(([a,g,n])=>el('button',{class:'edbtn edtog edacc',type:'button','data-a':a,title:`${n} pour la prochaine note`,onclick:()=>{acc=acc===a?null:a;paint();}},el('b',{},g),el('small',{},n)));
  const info=el('p',{class:'edinfo'});
  const paint=()=>{accBtns.forEach(b=>b.setAttribute('aria-pressed',String(acc===+b.dataset.a)));
    info.textContent=P.mode==='chord'?`Touche la portée pour ajouter une note (toutes empilées). Touche une note posée pour l'enlever.${notes.length?' Notes : '+notes.slice().sort((a,b)=>dia(a)-dia(b)).map(nn).join(' – '):''}`
      :P.mode==='seq'?`Touche la portée pour ajouter les notes de gauche à droite (${notes.length}/${P.max||8}).`:'Pose le doigt sur la portée et glisse jusqu\'à la bonne note (son nom s\'affiche), puis lève le doigt. ▲ ▼ ajustent ensuite la note. Choisis d\'abord ♯ ou ♭ si elle est altérée.';};
  /* portée agrandie : une portée courte qu'on étire sur toute la largeur (2× plus haute sur téléphone) */
  const touch=matchMedia('(pointer:coarse)').matches;
  let svg=null;const render=()=>{const w=staff.clientWidth||600;draw(staff,P.build(notes).replace('X:1\n','X:1\n%%stretchlast 1\n'),{paddingtop:16,paddingbottom:16,staffwidth:Math.max(120,Math.min(420,w/(touch?(P.mode==='seq'?1.6:2.8):1.5)))});svg=staff.querySelector('svg');};
  const commit=()=>{render();paint();onChange(notes.map(n=>({L:n.L,oct:n.oct,alt:n.alt})));};
  function hit(e){
    if(!svg)return null;const st=svg.querySelector('.abcjs-staff');if(!st)return null;const r=st.getBoundingClientRect(),step=r.height/8;
    const k=Math.round((e.clientY-r.top)/step);if(k<-6||k>14)return null;const d=STAFF_TOP[P.clef]-k;return{d,y:r.top+k*step,step};
  }
  /* aperçu : note fantôme + nom de la note, affiché au-dessus du doigt */
  function ghost(e,h){let g=svg&&svg.querySelector('.edghost');
    if(!h){tag.hidden=true;if(g)g.remove();return;}
    const n=fromDia(h.d,acc==null?0:acc),wr=wrap.getBoundingClientRect();tag.hidden=false;tag.textContent=nn(n);
    tag.style.left=(e.clientX-wr.left+(e.pointerType==='touch'?-18:14))+'px';tag.style.top=(h.y-wr.top-(e.pointerType==='touch'?58:12))+'px';
    const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=h.y;const ctm=svg.getScreenCTM();if(!ctm)return;const p=pt.matrixTransform(ctm.inverse()),sc=ctm.a||1;
    if(!g){g=document.createElementNS('http://www.w3.org/2000/svg','ellipse');g.setAttribute('class','edghost');svg.append(g);}
    g.setAttribute('cx',p.x);g.setAttribute('cy',p.y);g.setAttribute('rx',h.step*.62/sc);g.setAttribute('ry',h.step*.45/sc);}
  function place(h){
    const n=fromDia(h.d,acc==null?0:acc);if(acc===0)n.nat=true;
    if(P.mode==='one'){notes.length=0;notes.push(n);}
    else if(P.mode==='chord'){const k=notes.findIndex(x=>dia(x)===h.d);if(k>=0){if(acc==null)notes.splice(k,1);else notes[k]=n;}else if(notes.length<(P.max||4))notes.push(n);else{feedback(`Au plus ${P.max||4} notes.`,'bad');return;}}
    else{if(notes.length>=(P.max||8)){feedback('La portée est pleine : efface une note avant d\'en ajouter.','bad');return;}notes.push(n);}
    feedback('');acc=null;A.init();A.note(noteMidi(n),A.ctx.currentTime+.01,.5,.4,A.out);commit();
  }
  /* au doigt : on pose le doigt, on glisse pour ajuster (le nom de la note s'affiche), on lève pour poser */
  let drag=null;
  staff.addEventListener('pointerdown',e=>{if(typeof HELP!=='undefined'&&HELP.on)return;const h=hit(e);if(!h)return;drag={id:e.pointerId,h};try{staff.setPointerCapture(e.pointerId);}catch(x){}ghost(e,h);e.preventDefault();});
  staff.addEventListener('pointermove',e=>{const h=hit(e);if(drag&&e.pointerId===drag.id){if(h)drag.h=h;ghost(e,drag.h);}else if(e.pointerType==='mouse')ghost(e,h);});
  staff.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const h=drag.h;drag=null;tag.hidden=true;const g=svg&&svg.querySelector('.edghost');if(g)g.remove();place(h);});
  staff.addEventListener('pointercancel',()=>{drag=null;tag.hidden=true;});
  staff.addEventListener('pointerleave',e=>{if(drag)return;tag.hidden=true;const g=svg&&svg.querySelector('.edghost');if(g)g.remove();});
  /* ajustement fin : déplacer la dernière note d'une ligne ou d'un interligne */
  const nudge=dir=>{if(!notes.length)return;const n=notes[notes.length-1],m=fromDia(dia(n)+dir,n.alt);if(n.nat)m.nat=true;notes[notes.length-1]=m;A.init();A.note(noteMidi(m),A.ctx.currentTime+.01,.4,.4,A.out);commit();};
  const tools=el('div',{class:'toolbar qzpadtools'},btn('▲ Monter',()=>nudge(1)),btn('▼ Descendre',()=>nudge(-1)),btn('Effacer la dernière',()=>{notes.pop();commit();}),btn('Tout effacer',()=>{notes.length=0;commit();}),
    btn('▶ Écouter',()=>{const g=(P.given||[]).map(noteMidi),s=notes.slice().sort((a,b)=>P.mode==='seq'?0:dia(a)-dia(b)).map(noteMidi);if(P.mode==='chord'){A.init();stop();run({items:[...g.map((m,i)=>({u:i,d:1,midi:m})),...(s.length?[{u:g.length,d:2,chord:s}]:[])],us:.7,endU:g.length+2});}else{const all=[...g,...s];if(all.length){A.init();stop();run({items:all.map((m,i)=>({u:i,d:1,midi:m})),us:.55,endU:all.length});}}}));
  const elx=el('div',{class:'qzpadbox'},el('div',{class:'edpal'},el('div',{class:'edgrp'},...accBtns)),wrap,info,tools);
  requestAnimationFrame(()=>{render();paint();});
  return{el:elx};
}
/* compléter une mesure : éditeur de rythme, figures données verrouillées */
function makeQzRhy(q,resp,onChange){
  const R=q.rhy,me=METERS[R.meter];
  const ex={kind:'rhy',meter:me,measures:1,tempo:72,key:KEYS.C,clef:'treble',events:[]};
  const E=makeNoteEditor({mode:'rhy',ex,onChange:()=>onChange(E.evs.slice(G).map(e=>({dur:e.dur,rest:!!e.rest})))});
  const G=R.given.length;E.evs.push(...R.given.map(g=>({dur:g.dur,rest:!!g.rest})));
  if(Array.isArray(resp))E.evs.push(...resp.map(e=>({dur:e.dur,rest:!!e.rest})));
  const u=E.undo;E.undo=()=>{if(E.evs.length>G)u();};E.clear=()=>{E.evs.length=G;E.render();onChange([]);};
  requestAnimationFrame(()=>E.render());
  S.keyHandler=e=>E.handleKey(e);
  return el('div',{class:'qzrhy edbox'},E.palette,E.wrap,el('p',{class:'hint'},`Choisis une figure (ou active « Silence »), puis touche la portée pour l'ajouter après les figures déjà écrites.`),
    el('div',{class:'toolbar qzpadtools'},btn('Effacer la dernière',()=>E.undo()),btn('Tout effacer',()=>E.clear()),btn('▶ Écouter',()=>E.play())));
}

/* ---------- résultat ---------- */
function qzResultView(){
  const t=QZ.test,N=t.qs.length,sc=qzScore(t),pc=Math.round(100*sc/N);
  const msg=pc>=90?'Excellent travail !':pc>=75?'Très bien !':pc>=60?'C\'est un bon début. Revois les notions manquées.':'Continue de pratiquer : revois les notions ci-dessous dans la bibliothèque.';
  const rows=QZ_SUBJ.map(s=>{const qs=t.qs.map((q,i)=>[q,i]).filter(([q])=>q.subj===s.id);if(!qs.length)return null;const ok=qs.filter(([q,i])=>q.check(t.resp[i])).length;
    return el('tr',{},el('td',{},s.t),el('td',{},`${ok} / ${qs.length}`),el('td',{},el('span',{class:'qzbar'},el('i',{style:`width:${Math.round(100*ok/qs.length)}%`}))));}).filter(Boolean);
  const out=el('div',{class:'qzdeliver'});
  const list=el('ol',{class:'qzlist'},t.qs.map((q,i)=>{const ok=q.check(t.resp[i]);return el('li',{},el('button',{type:'button',class:'qzrow '+(ok?'ok':'bad'),onclick:()=>{QZ.view='q';qzGo(i);}},
    el('span',{class:'qzmark'},ok?'✓':'✗'),el('span',{class:'qzrt'},el('small',{},`Question ${i+1} · ${qzSubjLabel(q)}`),q.prompt)));}));
  return el('div',{class:'qzwrap'},
    el('div',{class:'qzcard qzres'},
      el('p',{class:'eyebrow'},(t.name?t.name+' · ':'')+qzDate(t.date)),
      el('div',{class:'qzscore'},el('b',{},`${sc} / ${N}`),el('span',{},`${pc} %`)),
      el('p',{class:'qzmsg'},msg),
      el('table',{class:'lt qztab'},el('tr',{},el('th',{},'Sujet'),el('th',{},'Réussite'),el('th',{},'')),rows),
      el('div',{class:'qzbtns'},
        btn('Créer le PDF de mes résultats',async ev=>{await qzMakePdf(ev.currentTarget,out,()=>qzPdfResult(t),`MusicDEV-resultats-${(t.name||'eleve').replace(/[^\p{L}\p{N}]+/gu,'-')}-${new Date(t.date).toISOString().slice(0,10)}.pdf`);},'primary'),
        btn('Revoir mes réponses',()=>{QZ.view='q';qzGo(0);}),
        btn('Nouveau questionnaire',()=>{QZ.view='start';qzRender();},'quiet')),
      out),
    el('div',{class:'qzcard'},el('h3',{},'Détail des questions'),el('p',{class:'hint'},'Touche une question pour voir ta réponse, la bonne réponse et un lien vers la notion.'),list));
}

/* ---------- PDF : création et partage ---------- */
async function qzMakePdf(button,out,build,fileName){
  const lab=button.textContent;button.disabled=true;button.textContent='Création du PDF…';out.replaceChildren(el('p',{class:'hint'},'Préparation des pages…'));
  try{const blob=await build();qzDeliver(out,blob,fileName);}
  catch(e){console.error(e);out.replaceChildren(el('p',{class:'qzwarn'},'Le PDF n\'a pas pu être créé : '+(e&&e.message||e)));}
  finally{button.disabled=false;button.textContent=lab;}
}
function qzDeliver(out,blob,fileName){
  const url=URL.createObjectURL(blob),file=new File([blob],fileName,{type:'application/pdf'});
  const canShare=!!(navigator.canShare&&navigator.share&&(()=>{try{return navigator.canShare({files:[file]});}catch(e){return false;}})());
  const kb=Math.max(1,Math.round(blob.size/1024));
  out.replaceChildren(el('div',{class:'qzpdfready'},
    el('p',{},el('b',{},'PDF prêt'),` · ${fileName} · ${kb>1024?(I18N.lang==='en'?(kb/1024).toFixed(1)+' MB':(kb/1024).toFixed(1).replace('.',',')+(I18N.lang==='es'?' MB':' Mo')):kb+(I18N.lang==='fr'?' ko':' KB')}`),
    el('div',{class:'qzbtns'},
      canShare?btn('Partager (courriel, imprimer, enregistrer…)',async()=>{try{await navigator.share({files:[file],title:fileName});}catch(e){}},'primary'):null,
      el('a',{class:'btn'+(canShare?'':' primary'),href:url,download:fileName},'Télécharger le PDF'),
      btn('Ouvrir pour imprimer',()=>{const w=window.open(url,'_blank');if(!w)location.href=url;}))));
}

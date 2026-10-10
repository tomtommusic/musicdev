/* ========== Langue de l'application : français (source), anglais, espagnol ========== */
const I18N={lang:(()=>{try{const v=localStorage.getItem('atelier-lang');return v==='en'||v==='es'?v:'fr';}catch(e){return 'fr';}})(),
  dict:{en:/*DICT_EN*/{},es:/*DICT_ES*/{}},lib:{en:/*LIB_EN*/[],es:/*LIB_ES*/[]},tpl:{},cache:{}};
(function buildTemplates(){
  for(const L of['en','es']){
    const out=[];
    for(const[k,v]of Object.entries(I18N.dict[L])){
      if(!/\{\d\}/.test(k))continue;
      const lit=k.replace(/\{\d\}/g,'');if(lit.replace(/[^A-Za-zÀ-ÿ]/g,'').length<2)continue;
      const re=new RegExp('^'+k.replace(/[.*+?^$()|[\]\\]/g,'\\$&').replace(/\\?\{(\d)\\?\}/g,'([\\s\\S]*?)').replace(/\{(\d)\}/g,'([\\s\\S]*?)')+'$');
      const order=[...k.matchAll(/\{(\d)\}/g)].map(m=>+m[1]);
      out.push({re,v,order,w:lit.length});
    }
    out.sort((a,b)=>b.w-a.w);I18N.tpl[L]=out;I18N.cache[L]=new Map();
  }
})();
const TR_NOTE={do:['C','do'],'ré':['D','re'],re:['D','re'],mi:['E','mi'],fa:['F','fa'],sol:['G','sol'],la:['A','la'],si:['B','si'],ut:['C','do']};
const TR_MODE={majeur:['major','mayor'],mineur:['minor','menor'],'augmenté':['augmented','aumentado'],'diminué':['diminished','disminuido'],majeure:['major','mayor'],mineure:['minor','menor']};
const TR_IVN={unisson:['unison','unísono'],seconde:['second','segunda'],tierce:['third','tercera'],quarte:['fourth','cuarta'],quinte:['fifth','quinta'],sixte:['sixth','sexta'],'septième':['seventh','séptima'],octave:['octave','octava']};
const TR_IVQ={juste:['perfect','justa'],majeure:['major','mayor'],mineure:['minor','menor'],'augmentée':['augmented','aumentada'],'diminuée':['diminished','disminuida']};
function trNoteTok(tok,L){
  const m=tok.match(/^(do|ré|re|mi|fa|sol|la|si|ut)([♯♭𝄪𝄫♮#]?)$/i);if(!m)return null;
  const base=TR_NOTE[m[1].toLowerCase()];if(!base)return null;let n=base[L==='en'?0:1];
  if(L==='es'&&m[1][0]===m[1][0].toUpperCase())n=n[0].toUpperCase()+n.slice(1);
  return n+m[2];
}
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
function trRules(s,L){
  const i=L==='en'?0:1;let m;
  let n=trNoteTok(s,L);if(n)return n;
  if((m=s.match(/^(\S+) (majeur|mineur|augmenté|diminué|majeure|mineure)$/i))){const a=trNoteTok(m[1],L);if(a){const md=TR_MODE[m[2].toLowerCase()][i];return L==='en'?`${a} ${md}`:`${a} ${md}`;}}
  if((m=s.match(/^(\S+) (grave|aigu|suraigu)$/))){const a=trNoteTok(m[1],L);if(a){const k=m[2];return L==='en'?(k==='grave'?'low ':k==='aigu'?'high ':'very high ')+a:a+(k==='grave'?' grave':k==='aigu'?' agudo':' sobreagudo');}}
  if((m=s.match(/^(Unisson|Seconde|Tierce|Quarte|Quinte|Sixte|Septième|Octave) (juste|majeure|mineure|augmentée|diminuée)$/i))){
    const nb=TR_IVN[m[1].toLowerCase()][i],q=TR_IVQ[m[2].toLowerCase()][i];const up=m[1][0]===m[1][0].toUpperCase();
    const r=L==='en'?`${q} ${nb}`:`${nb} ${q}`;return up?cap(r):r;}
  if((m=s.match(/^(\d+)(er|re|e)$/))){const k=+m[1];return L==='en'?k+(k%100>=11&&k%100<=13?'th':['th','st','nd','rd'][k%10]||'th'):k+'.º';}
  /* suites de notes : « fa♯, do♯ », « sol – si – ré » */
  if(/[–,]| et /.test(s)){const parts=s.split(/(\s*[–,]\s*|\s+et\s+)/);let ok=true;const out=parts.map((p,k)=>{if(k%2)return p.replace(/\bet\b/,L==='en'?'and':'y');const t=trNoteTok(p.trim(),L);if(t==null){ok=false;return p;}return t;});if(ok)return out.join('');}
  if((m=s.match(/^(\d+(?:[.,]\d+)?) ([^\d]+)$/))){const t=tCore(m[2],L);if(t!=null)return m[1]+' '+t;}
  if((m=s.match(/^Cadence (\S+)$/))){const t=tCore('Cadence '+m[1],L);if(t)return t;}
  return null;
}
function tCore(s,L){
  const C=I18N.cache[L];if(C.has(s))return C.get(s);
  C.set(s,null);let r=null;const D=I18N.dict[L];
  if(Object.prototype.hasOwnProperty.call(D,s))r=D[s];
  else{
    r=trRules(s,L);
    if(r==null)for(const t of I18N.tpl[L]){const m=s.match(t.re);if(!m)continue;
      const caps=m.slice(1),vals={};let miss=false;t.order.forEach((ix,k)=>{const v=caps[k];const tv=v.trim()?tCore(v.trim(),L):null;if(tv==null&&/[A-Za-zÀ-ÿ]{2}/.test(v))miss=true;vals[ix]=tv==null?v:v.replace(v.trim(),tv);});
      if(miss&&t.w<=8)continue;
      r=t.v.replace(/\{(\d)\}/g,(x,ix)=>vals[ix]!=null?vals[ix]:x);break;}
  }
  if(r==null&&/^[A-ZÀ-Ý][a-zà-ÿ]/.test(s)){const u=tCore(s[0].toLowerCase()+s.slice(1),L);if(u!=null)r=u[0].toUpperCase()+u.slice(1);}
  if(r==null&&/^[a-zà-ÿ]/.test(s)){const u=tCore(s[0].toUpperCase()+s.slice(1),L);if(u!=null)r=/^[A-Z]{2}/.test(u)?u:u[0].toLowerCase()+u.slice(1);}
  if(r==null)r=trSplit(s,L);
  if(C.size>5000)C.clear();C.set(s,r);return r;
}
/* repli : on traduit morceau par morceau (« A) … », « Étiquette : valeur », listes « · », phrases) */
function trSplit(s,L){
  let m;const sub=x=>{const t=x.trim();if(!t||!/[A-Za-zÀ-ÿ]/.test(t))return x;const r=tCore(t,L);return r==null?null:x.replace(t,r);};
  if((m=s.match(/^([A-H]\)\s+)([\s\S]+)$/))){const r=sub(m[2]);return r==null?null:m[1]+r;}
  if((m=s.match(/^([^:]{1,60}?)\s?:$/))){const r=sub(m[1]);return r==null?null:r+':';}
  const tryParts=(parts,keepAll)=>{let any=false,miss=false;const out=parts.map((p,k)=>{if(k%2)return p;const r=sub(p);if(r==null){miss=true;return p;}if(r!==p)any=true;return r;});return any&&(keepAll||!miss)?out:null;};
  for(const sep of[/(\s·\s)/,/(\s—\s)/,/(\s:\s)/]){
    if(!sep.test(s))continue;const parts=s.split(sep);const out=tryParts(parts,true);
    if(out)return out.map((p,k)=>k%2&&/:/.test(p)?': ':p).join('');}
  if((m=s.match(/^([\s\S]+?) \(([^()]+)\)([\s\S]*)$/))){const a=sub(m[1]),b0=tCore('('+m[2]+')',L),b=b0!=null&&/^\(.*\)$/.test(b0)?b0.slice(1,-1):sub(m[2]),c=m[3]?sub(m[3]):'';const a2=a==null?m[1]:a,b2=b==null?m[2]:b;if(c!=null&&(a!=null||b!=null)&&(a2!==m[1]||b2!==m[2]))return a2+' ('+b2+')'+c;}
  if(/, /.test(s)){const out=tryParts(s.split(/(, )/),true);if(out)return out.join('');}
  if(/[.!?]\s+\S/.test(s)){const sents=s.match(/[^.!?…]+(?:[.!?…]+|$)\s*/g)||[];if(sents.join('')===s&&sents.length>1){const parts=[];sents.forEach((x,k)=>{if(k)parts.push('');parts.push(x);});const out=tryParts(parts,false);if(out)return out.join('');}}
  return null;
}
const TL=(fr,en,es)=>I18N.lang==='en'?en:I18N.lang==='es'?es:fr;
function T(s){
  if(I18N.lang==='fr'||s==null)return s;const str=String(s);const m=str.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if(!m[2]||!/[A-Za-zÀ-ÿ]/.test(m[2]))return str;const r=tCore(m[2],I18N.lang);return r==null?str:m[1]+r+m[3];
}
/* traduction de la page : textes, attributs utiles ; la partition (abcjs) n'est jamais touchée */
const TR_SEEN=new WeakMap(),TR_ATTR=['placeholder','title','aria-label','label'];
const trSkip=n=>{const e=n.nodeType===1?n:n.parentElement;return !e||!!e.closest('script,style,.abcjs-container,[data-notr],textarea');};
function trText(n){const v=n.nodeValue;if(!v||!/[A-Za-zÀ-ÿ]/.test(v))return;const st=TR_SEEN.get(n);const fr=st&&v===st.out?st.fr:v;const out=T(fr);TR_SEEN.set(n,{fr,out});if(out!==v)n.nodeValue=out;}
function trAttrs(e){for(const a of TR_ATTR){if(!e.hasAttribute||!e.hasAttribute(a))continue;const v=e.getAttribute(a);const key='__tr_'+a;const st=e[key];const fr=st&&v===st.out?st.fr:v;const out=T(fr);e[key]={fr,out};if(out!==v)e.setAttribute(a,out);}}
function trTree(root){
  if(!root)return;if(root.nodeType===3){if(!trSkip(root))trText(root);return;}
  if(root.nodeType!==1||trSkip(root))return;trAttrs(root);
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode:x=>x.nodeType===1&&(x.matches('script,style,.abcjs-container,[data-notr],textarea'))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  let x;while((x=w.nextNode())){if(x.nodeType===3)trText(x);else trAttrs(x);}
}
const trObs=new MutationObserver(ms=>{
  for(const m of ms){
    if(m.type==='characterData'){if(!trSkip(m.target))trText(m.target);}
    else if(m.type==='attributes'){if(!trSkip(m.target))trAttrs(m.target);}
    else m.addedNodes.forEach(trTree);
  }
});
function trStart(){trObs.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:TR_ATTR});}
/* bibliothèque : on remplace le contenu des pages par la version traduite (l'original est gardé) */
let LIB_FR_SNAP=null;
function libApplyLang(){
  if(typeof LIB==='undefined')return;
  if(!LIB_FR_SNAP)LIB_FR_SNAP=LIB.map(c=>({t:c.t,topics:c.topics.map(x=>({t:x.t,title:x.title,k:x.k,html:x.html,ex:(x.ex||[]).map(e=>({abc:e.abc,cap:e.cap}))}))}));
  const src=I18N.lang==='fr'?LIB_FR_SNAP:I18N.lib[I18N.lang];
  LIB.forEach((c,ci)=>{const sc=(src||[])[ci]||LIB_FR_SNAP[ci],fc=LIB_FR_SNAP[ci];c.t=sc.t||fc.t;
    c.topics.forEach((x,ti)=>{const s=(sc.topics&&sc.topics[ti]&&sc.topics[ti].id===undefined)||!sc.topics?fc.topics[ti]:(sc.topics.find(y=>y.id===x.id)||fc.topics[ti]);const f=fc.topics[ti];
      x.t=s.t||f.t;x.title=s.title==null?f.title:s.title;x.k=(s.k||'')+' '+(f.k||'');x.html=s.html||f.html;
      (x.ex||[]).forEach((e,k)=>{const se=(s.ex||[])[k],fe=f.ex[k];e.abc=se&&se.abc||fe.abc;e.cap=se&&se.cap!=null?se.cap:fe.cap;});});});
}
function setLang(L){
  I18N.lang=L;try{localStorage.setItem('atelier-lang',L);}catch(e){}
  document.documentElement.lang=L==='fr'?'fr-CA':L;
  libApplyLang();trTree(document.body);
  document.querySelectorAll('.langsw button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===L)));
  if(typeof openModule==='function'&&S&&S.mod)openModule(S.mod,null,{keep:true});
}
function langSwitch(){
  const box=document.createElement('div');box.className='langsw';box.setAttribute('role','group');box.setAttribute('aria-label','Langue · Language · Idioma');box.dataset.notr='';
  [['fr','FR','Français'],['en','EN','English'],['es','ES','Español']].forEach(([l,lab,full])=>{const b=document.createElement('button');b.type='button';b.dataset.l=l;b.textContent=lab;b.title=full;b.setAttribute('aria-pressed',String(I18N.lang===l));b.addEventListener('click',()=>{if(I18N.lang!==l)setLang(l);});box.append(b);});
  return box;
}

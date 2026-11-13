/* ========== ACCUEIL : courte visite guidée ==========
   De petites bulles fléchées s'accrochent directement aux vrais éléments de l'app
   (liste ou menu des modules, langue, Explications) et disparaissent dès qu'on ouvre un module. */
const HO_MAIL='tomthivierge.artiste@gmail.com';
function hoOff(){document.querySelectorAll('.hotip').forEach(e=>e.remove());}
function hoTip(dir,title,txt){return el('div',{class:'hotip '+dir,role:'note'},el('b',{},title),' ',el('span',{},txt));}
function hoTips(){
  hoOff();if(S.mod!=='ho')return;
  const mp=document.querySelector('.modpick'),mobile=mp&&getComputedStyle(mp).display!=='none';
  const lang=document.querySelector('.rail .langsw'),mods=document.getElementById('mods'),help=document.getElementById('helpbtn');
  if(mobile)mp.after(hoTip('up','Les modules','Touche ici pour choisir ce que tu veux travailler.'));
  else if(mods)mods.before(hoTip('down','Les modules','Choisis ce que tu veux travailler.'));
}
/* raccourcis vers les outils, dessinés comme des icônes d'app */
const HO_APPS=[
  ['mt','<path d="M8.5 21h7L13.2 4h-2.4z"/><path d="M7 21h10"/><path d="M12 17l4.2-9.5"/><circle cx="15.4" cy="9.4" r="1.5" fill="currentColor" stroke="none"/>'],
  ['ac','<path d="M3.5 16.5a8.5 8.5 0 0 1 17 0"/><path d="M12 16.5l3.6-6.2"/><circle cx="12" cy="16.5" r="1.5" fill="currentColor" stroke="none"/><path d="M6 10.3l1.2 1.1M12 6.8v1.6M18 10.3l-1.2 1.1"/>'],
  ['en','<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.8 11a6.2 6.2 0 0 0 12.4 0"/><path d="M12 17.2V21M9 21h6"/>'],
  ['gc','<path d="M6 4.5h12M6 4.5v15M10 4.5v15M14 4.5v15M18 4.5v15M6 9.5h12M6 14.5h12"/><circle cx="10" cy="7" r="1.7" fill="currentColor" stroke="none"/><circle cx="14" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.7" fill="currentColor" stroke="none"/>'],
  ['ba','<ellipse cx="12" cy="11" rx="7.5" ry="2.8"/><path d="M4.5 11v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/><path d="M7.5 13.6v5.4M12 14v5.8M16.5 13.6v5.4"/><path d="M8 3.5l4 6M17 3.5l-4.5 6"/>']];
function hoApps(){
  return el('div',{class:'hoapps'},el('p',{class:'hoappst'},'Outils'),
    el('div',{class:'hoappgrid'},...HO_APPS.filter(([id])=>MOD[id]).map(([id,svg])=>{
      const ico=el('span',{class:'hoico ico-'+id,'aria-hidden':'true'});ico.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+svg+'</svg>';
      return el('button',{type:'button',class:'hoapp',onclick:()=>openModule(id)},ico,el('span',{class:'hoappn'},MOD[id].t));})));
}
MOD.ho.mount=function(){
  $('#toolbar').replaceChildren();
  const logo=document.querySelector('.rail .brand img');
  const mail=`mailto:${HO_MAIL}?subject=${encodeURIComponent('MusicDEV : commentaire')}`;
  $('#answer').replaceChildren(hoApps(),el('div',{class:'tl ho'},
    el('div',{class:'hohero'},logo?el('img',{src:logo.src,alt:'',class:'hologo'}):null,
      el('div',{},el('p',{class:'hotag'},'Bienvenue dans MusicDEV'),el('p',{class:'holead'},'Entraîne ton oreille, lis, joue et comprends la musique, à ton rythme.'))),

    el('ul',{class:'hosteps'},
      el('li',{},el('b',{},'1'),el('span',{},'Choisis un module.')),
      el('li',{},el('b',{},'2'),el('span',{},'Ajuste le niveau avec « Réglages ».')),
      el('li',{},el('b',{},'3'),el('span',{},'Dans un exercice, touche « Explications », puis l\'élément à comprendre.'))),
    el('div',{class:'homail'},el('p',{},el('b',{},'Une idée ? Un problème ?'),' ',el('span',{},'Écris-moi, ça m\'aide à améliorer l\'app.')),
      el('a',{class:'btn primary',href:mail},'✉ Envoyer un commentaire'),el('span',{class:'homaddr','data-notr':''},HO_MAIL))));
  setTimeout(hoTips,0);
};
MOD.ho.fresh=function(){setTimeout(hoTips,0);};
/* le menu mobile et le sélecteur de langue sont créés après le démarrage : on replace les bulles ensuite */
window.addEventListener('load',()=>{if(S.mod==='ho')hoTips();});
matchMedia('(max-width:600px)').addEventListener?.('change',()=>{if(S.mod==='ho')hoTips();});

/* sur l'accueil, « Explications » fait une démonstration : on ouvre la lecture de notes avec le mode explications actif */
document.addEventListener('click',e=>{if(S.mod!=='ho'||!e.target.closest||!e.target.closest('#helpbtn'))return;
  e.stopImmediatePropagation();e.preventDefault();openModule('ln');setTimeout(()=>{if(typeof helpSet==='function')helpSet(true);},250);},true);

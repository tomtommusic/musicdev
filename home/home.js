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
  if(lang)lang.after(hoTip('up lang','Langue','Français, English, Español.'));
  if(mobile)mp.after(hoTip('up','Les modules','Touche ici pour choisir ce que tu veux travailler.'));
  else if(mods)mods.before(hoTip('down','Les modules','Choisis ce que tu veux travailler.'));
}
MOD.ho.mount=function(){
  $('#toolbar').replaceChildren();
  const logo=document.querySelector('.rail .brand img');
  const mail=`mailto:${HO_MAIL}?subject=${encodeURIComponent('MusicDEV : commentaire')}`;
  $('#answer').replaceChildren(el('div',{class:'tl ho'},
    el('div',{class:'hohero'},logo?el('img',{src:logo.src,alt:'',class:'hologo'}):null,
      el('div',{},el('p',{class:'hotag'},'Bienvenue dans MusicDEV'),el('p',{class:'holead'},'Entraîne ton oreille, lis, joue et comprends la musique, à ton rythme.'))),
    el('ul',{class:'hosteps'},
      el('li',{},el('b',{},'1'),el('span',{},'Choisis un module.')),
      el('li',{},el('b',{},'2'),el('span',{},'Ajuste le niveau avec « Réglages ».')),
      el('li',{},el('b',{},'3'),el('span',{},'Dans un exercice, touche « Explications », puis l\'élément à comprendre.'))),
    el('div',{class:'homail'},el('p',{},el('b',{},'Une idée ? Un problème ?'),' ',el('span',{},'Écris-moi, ça m\'aide à améliorer l\'app.')),
      el('a',{class:'btn primary',href:mail},'✉ Envoyer un commentaire'),el('span',{class:'homaddr','data-notr':''},HO_MAIL))));
  setTimeout(hoTips,0);
};
MOD.ho.fresh=function(){setTimeout(hoTips,0);};
/* le menu mobile et le sélecteur de langue sont créés après le démarrage : on replace les bulles ensuite */
window.addEventListener('load',()=>{if(S.mod==='ho')hoTips();});
matchMedia('(max-width:600px)').addEventListener?.('change',()=>{if(S.mod==='ho')hoTips();});

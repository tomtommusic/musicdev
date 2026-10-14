/* ========== MODULE : À propos (confidentialité, licences, crédits) ========== */
const AP_MAIL='tomthivierge.artiste@gmail.com';
const AP_PRIV=[
  ['En bref','MusicDEV ne recueille aucun renseignement personnel. Pas de compte, pas de publicité, pas de statistiques d\'utilisation, pas de traceurs. Tout ce que tu fais dans l\'app reste sur ton appareil.'],
  ['Ce qui est gardé sur ton appareil','Tes réglages, tes résultats, ton dernier enregistrement et tes paroles sont enregistrés seulement dans la mémoire de ton appareil (stockage du navigateur ou de l\'app). Ils ne sont jamais envoyés ailleurs. Tu peux les effacer en supprimant l\'enregistrement, en effaçant les données du site ou en désinstallant l\'app.'],
  ['Le micro','Le micro est utilisé seulement quand tu l\'actives (lecture, accordeur, enregistreur). Le son est analysé en direct sur ton appareil pour reconnaître les notes et le rythme ; il n\'est jamais transmis. Un enregistrement reste sur ton appareil tant que tu ne choisis pas toi-même de le partager ou de le télécharger.'],
  ['Connexion internet','L\'app fonctionne sans connexion et n\'envoie aucune donnée. La version web est hébergée par GitHub Pages : comme tout site web, l\'hébergeur peut garder des journaux techniques (comme l\'adresse IP) selon sa propre politique de confidentialité.'],
  ['Si tu m\'écris','Si tu envoies un commentaire par courriel, ton adresse et ton message servent seulement à te répondre et à améliorer l\'app. Ils ne sont ni vendus ni partagés.'],
  ['Élèves et enfants','MusicDEV peut être utilisée par des élèves de tout âge : comme aucun renseignement n\'est recueilli, aucun consentement parental n\'est nécessaire pour l\'utiliser.'],
  ['Responsable et questions','Pour toute question sur la protection des renseignements personnels (y compris au sens de la Loi 25 du Québec), écris à la personne responsable : '],
  ['Changements','Si cette politique change, la nouvelle version sera publiée ici avec sa date.']
];
const AP_FONTS=[
  ['Atkinson Hyperlegible','Copyright 2020 Braille Institute of America, Inc.'],
  ['Lora','Copyright 2011 The Lora Project Authors (https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora".'],
  ['Bricolage Grotesque','Copyright 2022 The Bricolage Grotesque Project Authors (https://github.com/ateliertriay/bricolage)'],
  ['IBM Plex Mono','Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"']
];
MOD.ap.mount=function(){
  $('#toolbar').replaceChildren();
  const mail=el('a',{href:'mailto:'+AP_MAIL,'data-notr':''},AP_MAIL);
  const sec=(id,title,...kids)=>el('section',{class:'mtsec apsec',id:'ap-'+id},el('h3',{},title),...kids);
  const priv=sec('confidentialite','Politique de confidentialité',
    el('p',{class:'hint'},'En vigueur le 13 octobre 2026'),
    ...AP_PRIV.map(([h,t],i)=>el('div',{class:'apblock'},el('h4',{},h),el('p',{},t,i===6?mail:null,i===6?'.':null))));
  const lic=sec('licences','Licences',
    el('p',{},'MusicDEV utilise ces logiciels et polices libres. Merci à leurs auteurs.'),
    el('div',{class:'apblock'},el('h4',{},'abcjs ',el('span',{class:'aplic','data-notr':''},'MIT')),el('p',{class:'hint'},'Affichage des partitions.'),
      el('details',{},el('summary',{},'Voir la licence'),el('pre',{class:'aptext','data-notr':''},AP_MIT))),
    el('div',{class:'apblock'},el('h4',{},'Polices ',el('span',{class:'aplic','data-notr':''},'SIL OFL 1.1')),
      el('ul',{class:'aplist','data-notr':''},...AP_FONTS.map(([n,c])=>el('li',{},el('b',{},n),' — ',c))),
      el('details',{},el('summary',{},'Voir la licence'),el('pre',{class:'aptext','data-notr':''},AP_OFL))));
  const about=sec('app','MusicDEV',
    el('p',{},'Une app de formation auditive et de lecture musicale, créée au Québec par un enseignant de musique pour ses élèves.'),
    el('p',{class:'apver','data-notr':''},'Version '+AP_VERSION),
    el('p',{},'© 2026 Tom Tom Music. ',el('span',{},'Tous droits réservés.')),
    el('p',{},el('span',{},'Contact'),' — ',mail.cloneNode(true)));
  const nav=el('div',{class:'apnav'},...[['app','À propos'],['confidentialite','Confidentialité'],['licences','Licences']].map(([id,t])=>
    el('a',{href:'#ap-'+id,class:'btn quiet',onclick:e=>{e.preventDefault();document.getElementById('ap-'+id).scrollIntoView({behavior:'smooth',block:'start'});}},t)));
  $('#answer').replaceChildren(el('div',{class:'tl ap'},nav,about,priv,lic));
};
MOD.ap.fresh=function(){};

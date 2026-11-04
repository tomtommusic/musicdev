/* Français / English : choix mémorisé, sinon la langue du navigateur */
(function(){
  var d=document.documentElement,L;
  try{L=localStorage.getItem('tom-lang')}catch(e){}
  if(L!=='fr'&&L!=='en')L=/^fr/i.test(navigator.language||'fr')?'fr':'en';
  function set(l){L=l;d.setAttribute('data-lang',l);d.lang=l==='fr'?'fr-CA':'en-CA';
    var b=document.querySelector('.langbtn');if(b){b.textContent=l==='fr'?'EN':'FR';b.setAttribute('aria-label',l==='fr'?'Switch to English':'Passer en français');}
    var t=d.getAttribute('data-title-'+l);if(t)document.title=t;}
  set(L);
  document.addEventListener('DOMContentLoaded',function(){set(L);
    var b=document.querySelector('.langbtn');if(b)b.addEventListener('click',function(){var n=L==='fr'?'en':'fr';try{localStorage.setItem('tom-lang',n)}catch(e){}set(n);});});
})();

"""Choix du thème (Auto / Clair / Sombre) sous le sélecteur de langue, sur la page d'accueil."""
import sys
p=sys.argv[1];s=open(p).read()
if 'themesw' in s:print('deja');sys.exit(0)
EARLY="<script>try{var t=localStorage.getItem('atelier-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>\n"
i=s.index('<style');s=s[:i]+EARLY+s[i:]
CSS=""".themesw{display:inline-flex;border:1px solid var(--btn-edge);border-radius:999px;overflow:hidden;background:var(--btn);box-shadow:var(--shadow-sm);margin-top:8px}
.themesw[hidden]{display:none}
.themesw button{border:0;background:transparent;color:var(--muted);font:700 .78rem/1 var(--f-mono);letter-spacing:.04em;padding:8px 11px;cursor:pointer;min-height:36px}
.themesw button+button{border-left:1px solid var(--line)}
.themesw button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink)}
.themesw button:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
"""
i=s.rindex('</style>');s=s[:i]+CSS+s[i:]
JS="""<script>
/* thème : Auto (réglage de l'appareil) / Clair / Sombre, affiché sous les langues sur l'accueil */
(()=>{const LAB={fr:{auto:'Auto',light:'Clair',dark:'Sombre',g:'Thème'},en:{auto:'Auto',light:'Light',dark:'Dark',g:'Theme'},es:{auto:'Auto',light:'Claro',dark:'Oscuro',g:'Tema'}},ICO={auto:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg>',light:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>',dark:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'};
  const cur=()=>{try{return localStorage.getItem('atelier-theme')||'auto';}catch(e){return 'auto';}};
  const box=document.createElement('div');box.className='themesw';box.setAttribute('role','group');box.dataset.notr='';
  const btns=['auto','light','dark'].map(k=>{const b=document.createElement('button');b.type='button';b.dataset.t=k;
    b.addEventListener('click',()=>{try{localStorage.setItem('atelier-theme',k);}catch(e){}
      if(k==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',k);paint();});box.append(b);return b;});
  function paint(){const L=LAB[(typeof I18N!=='undefined'&&I18N.lang)||'fr']||LAB.fr,c=cur();box.setAttribute('aria-label',L.g);
    btns.forEach(b=>{b.innerHTML=ICO[b.dataset.t];b.title=L[b.dataset.t];b.setAttribute('aria-label',L[b.dataset.t]);b.setAttribute('aria-pressed',String(b.dataset.t===c));});}
  const ls=document.querySelector('.rail .langsw');
  function vis(){box.hidden=!(typeof S!=='undefined'&&S&&S.mod==='ho');
    /* langues et thème sur une même rangée */
    if(ls){let row=ls.parentElement;if(!row.classList.contains('prefrow')){row=document.createElement('div');row.className='prefrow';ls.before(row);row.append(ls);}if(box.parentElement!==row)row.append(box);}}
  paint();vis();addEventListener('resize',vis);
  if(typeof setLang==='function'){const o=setLang;setLang=function(L){const r=o.apply(this,arguments);paint();return r;};}
  if(typeof openModule==='function'){const o=openModule;openModule=function(){const r=o.apply(this,arguments);vis();return r;};}
})();
</script>
"""
i=s.rindex('</body>');s=s[:i]+JS+s[i:]
s=s.replace('.themesw[hidden]{display:none}','.themesw[hidden]{display:none}\n.rail .themesw{align-self:flex-start;margin-top:0}\n.themesw button{min-width:34px;padding:8px 9px;font-size:.95rem}\n.rail .prefrow{display:flex;flex-wrap:wrap;align-items:center;gap:8px;align-self:flex-start}\n@media (max-width:600px){.rail .prefrow{order:1}}\n.prefrow .langsw{order:0}.prefrow .themesw{order:1}\n.themesw button{display:inline-grid;place-items:center}')
open(p,'w').write(s);print('ok')

import sys
CSS = r'''
/* ===== mobile (≤ 600 px) : boutons en grille, bibliothèque en rangées défilantes ===== */
:root[data-theme="dark"] .libcats{background:rgb(255 255 255/.03)}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .libcats{background:rgb(255 255 255/.03)}}
@media (max-width:600px){
  #toolbar{padding:12px;border-radius:22px}
  #toolbar .tgrow{flex-direction:column;align-items:stretch;gap:10px}
  #toolbar .tg{display:flex;flex-wrap:wrap;gap:8px;padding:0;justify-content:stretch;align-items:stretch}
  #toolbar .tg + .tg{border-left:0;border-top:1px solid var(--line);padding-top:10px}
  #toolbar .tg > *{flex:1 1 calc(50% - 4px);min-width:0}
  #toolbar .btn{justify-content:center;min-height:46px;padding:10px 12px;font-size:.93rem}
  #toolbar .btn.primary{min-height:50px;font-size:1rem}
  #toolbar .mnav{flex:1 1 calc(100% - 54px);display:grid;grid-template-columns:46px minmax(0,1fr) 46px;gap:6px}
  #toolbar .mnav .btn{width:100%;padding-inline:6px}
  #toolbar .tg.listen > .btn{flex-basis:calc(50% - 31px);white-space:normal;line-height:1.15}
  #toolbar .tg > .btn[data-stop]{flex:0 0 46px;width:46px;height:46px;min-height:46px;font-size:0;padding:0}
  #toolbar .micchip{flex-basis:100%;text-align:center;justify-content:center}

  .libtop{gap:8px}
  .libsearch{padding:10px 16px;font-size:16px}
  .libcats,.libsubs{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;
    scroll-snap-type:x proximity;scroll-padding-inline:12px;margin-inline:-4px}
  .libcats::-webkit-scrollbar,.libsubs::-webkit-scrollbar{display:none}
  .libcats > *,.libsubs > *{flex:0 0 auto;scroll-snap-align:start;white-space:nowrap}
  .libcats{border-radius:999px;padding:5px;gap:2px;-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 22px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 22px),transparent)}
  .libcats::after{content:"";flex:0 0 14px}
  .libcat{padding:9px 14px;font-size:.95rem}
  .libsubs{padding:2px 4px 6px;gap:6px;
    -webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent)}
  .libsubs::after{content:"";flex:0 0 18px}
  .libsub{padding:8px 14px;font-size:.92rem}
  .libart{padding:18px 16px 16px;border-radius:16px;gap:10px}
  .libart h2{font-size:1.45rem}
  .libhtml{font-size:1rem;line-height:1.55}
  .lex{padding:10px 10px 8px;border-radius:12px}
  .lexbar{flex-wrap:wrap}
  .libnav{flex-direction:column}
  .libnav .btn{max-width:100%;width:100%;justify-content:space-between}
  .libsee{gap:6px}
}
'''
JS = r'''
<script>
/* mobile : garder l'onglet et la notion choisis visibles dans les rangées défilantes */
(()=>{const mq=matchMedia('(max-width:600px)');
const center=(row,sel)=>{const a=row&&row.querySelector(sel);if(!a||row.scrollWidth<=row.clientWidth)return;
  const r=row.getBoundingClientRect(),b=a.getBoundingClientRect();row.scrollLeft+=(b.left+b.width/2)-(r.left+r.width/2);};
const fix=()=>{if(!mq.matches)return;
  center(document.querySelector('.libcats'),'[aria-selected="true"]');center(document.querySelector('.libsubs'),'[aria-current="true"]');
  const q=document.querySelector('.libsearch');if(q&&!q.dataset.short){q.dataset.short=1;q.placeholder='Chercher : armure, triolet, cadence…';}};
new MutationObserver(()=>requestAnimationFrame(fix)).observe(document.getElementById('library'),{childList:true,subtree:true,attributes:true,attributeFilter:['aria-selected','aria-current']});
mq.addEventListener?.('change',fix);fix();})();
</script>
'''
for p in sys.argv[1:]:
    s=open(p).read()
    if 'mobile (≤ 600 px)' in s: print('deja',p); continue
    i=s.rfind('</style>', 0, s.find('<body'))
    s=s[:i]+CSS+s[i:]
    j=s.rfind('</body>')
    s=s[:j]+JS+s[j:]
    open(p,'w').write(s); print('ok',p)

import sys
CSS = r'''
/* ===== mobile : bande d'infos en grille, Réglages en bouton icône ===== */
.mi-set{display:none}
@media (max-width:600px){
  .stand > #setbtn{display:none}
  .stand .meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) 44px;column-gap:2px;align-items:start;padding:6px 8px 6px 0;padding-top:6px}
  .stand .meta .mi{padding:8px 2px 8px 10px;min-width:0}
  .stand .meta .mi > span{min-width:0}
  .stand .meta .mi b{overflow-wrap:anywhere;font-size:.9rem}
  .stand .meta .mi-set{display:flex;grid-column:4;grid-row:1 / span 6;align-self:center;justify-content:flex-end;padding:0}
  .mi-set button{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;cursor:pointer;
    background:var(--btn);border:1px solid var(--btn-edge);color:var(--ink);box-shadow:var(--shadow-sm);padding:0}
  .mi-set button svg{width:21px;height:21px}
  .mi-set button[aria-expanded="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
}
'''
JS = r'''
<script>
/* mobile : bouton Réglages (icône) placé dans la grille d'infos */
(()=>{const meta=document.getElementById('meta'),sb=document.getElementById('setbtn');if(!meta||!sb)return;
const cell=document.createElement('span');cell.className='mi-set';
const b=document.createElement('button');b.type='button';b.title='Réglages';b.setAttribute('aria-label','Réglages');b.setAttribute('aria-controls','settings');
b.innerHTML='<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h8M16 6h2M4 11h2M10 11h8M4 16h10M18 16h0"/><circle cx="14" cy="6" r="2"/><circle cx="8" cy="11" r="2"/><circle cx="16" cy="16" r="2"/></svg>';
b.addEventListener('click',()=>sb.click());cell.append(b);
const sync=()=>b.setAttribute('aria-expanded',sb.getAttribute('aria-expanded')||'false');
const place=()=>{if(meta.lastElementChild!==cell&&meta.querySelector('.mi'))meta.append(cell);};
new MutationObserver(place).observe(meta,{childList:true});
new MutationObserver(sync).observe(sb,{attributes:true,attributeFilter:['aria-expanded']});place();sync();})();
</script>
'''
for p in sys.argv[1:]:
    s=open(p).read()
    if 'Réglages en bouton icône' in s: print('deja',p); continue
    i=s.rfind('</style>',0,s.find('<body')); s=s[:i]+CSS+s[i:]
    j=s.rfind('</body>'); s=s[:j]+JS+s[j:]
    open(p,'w').write(s); print('ok',p)

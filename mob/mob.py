"""Ajustements mobiles : listes déroulantes qui débordent ; menu des modules en feuille (Android, où la liste native est peu lisible)."""
import sys
p=sys.argv[1];s=open(p).read()
if 'mpsheet' in s:print('deja');sys.exit(0)
CSS=""".qzfield{min-width:0;max-width:100%}
.qzfield select,.qzfield .qzsel{width:100%;min-width:0;max-width:100%;text-overflow:ellipsis}
.mpsheet{position:fixed;inset:0;z-index:1000;display:flex;align-items:flex-end;justify-content:center;background:rgb(0 0 0/.45)}
.mpsheet[hidden]{display:none}
.mpsheet .mpbox{background:var(--surface,#fff);color:var(--ink,inherit);width:100%;max-width:560px;max-height:82vh;overflow:auto;border-radius:18px 18px 0 0;padding:6px 0 calc(14px + env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgb(0 0 0/.25);overscroll-behavior:contain}
.mpsheet .mphead{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;padding:10px 18px;background:inherit;font:700 1.05rem/1.2 var(--f-serif,inherit);border-bottom:1px solid var(--line)}
.mpsheet .mpclose{border:0;background:transparent;color:inherit;font-size:1.4rem;line-height:1;padding:6px 10px;cursor:pointer}
.mpsheet .mpgrp{padding:14px 18px 4px;font:600 .72rem/1 var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.mpsheet .mpit{display:block;width:100%;text-align:left;border:0;background:transparent;color:inherit;padding:11px 18px;font:500 1rem/1.25 var(--f-sans,inherit);cursor:pointer}
.mpsheet .mpit small{display:block;font:500 .72rem/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:2px}
.mpsheet .mpit[aria-current="true"]{background:var(--accent);color:var(--accent-ink)}
.mpsheet .mpit[aria-current="true"] small{color:inherit;opacity:.8}
"""
i=s.rindex('</style>');s=s[:i]+CSS+s[i:]
JS="""<script>
/* Android : le menu des modules s'ouvre dans une feuille lisible au lieu de la liste native */
(()=>{if(!/Android/i.test(navigator.userAgent))return;
  const box=document.querySelector('.modpick'),sel=box&&box.querySelector('select');if(!sel)return;
  sel.style.pointerEvents='none';
  const sh=document.createElement('div');sh.className='mpsheet';sh.hidden=true;sh.setAttribute('role','dialog');sh.setAttribute('aria-modal','true');
  const bx=document.createElement('div');bx.className='mpbox';sh.append(bx);document.body.append(sh);
  const close=()=>{sh.hidden=true;};
  sh.addEventListener('click',e=>{if(e.target===sh)close();});
  function open(){bx.replaceChildren();const L=(typeof I18N!=='undefined'&&I18N.lang)||'fr';
    const hd=document.createElement('div');hd.className='mphead';hd.dataset.notr='';hd.append({fr:'Modules',en:'Modules',es:'Módulos'}[L]||'Modules');
    const x=document.createElement('button');x.type='button';x.className='mpclose';x.setAttribute('aria-label',{fr:'Fermer',en:'Close',es:'Cerrar'}[L]||'Fermer');x.textContent='×';x.onclick=close;hd.append(x);bx.append(hd);
    const sub={};if(typeof MODS!=='undefined')MODS.forEach(m=>sub[m.id]=m.s);
    const item=o=>{const b=document.createElement('button');b.type='button';b.className='mpit';b.dataset.notr='';b.textContent=o.textContent;
      if(sub[o.value]){const sm=document.createElement('small');sm.textContent=typeof T==='function'?T(sub[o.value]):sub[o.value];b.append(sm);}
      if(o.value===sel.value)b.setAttribute('aria-current','true');
      b.onclick=()=>{close();if(sel.value!==o.value){sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}};return b;};
    for(const c of sel.children){if(c.tagName==='OPTGROUP'){const g=document.createElement('div');g.className='mpgrp';g.dataset.notr='';g.textContent=c.label;bx.append(g);for(const o of c.children)bx.append(item(o));}
      else bx.append(item(c));}
    sh.hidden=false;const cur=bx.querySelector('[aria-current="true"]');if(cur)cur.scrollIntoView({block:'center'});}
  box.addEventListener('click',e=>{e.preventDefault();open();});
  box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!sh.hidden)close();});
  window.mpSheetOpen=()=>!sh.hidden;window.mpSheetClose=close;
})();
</script>
"""
i=s.rindex('</body>');s=s[:i]+JS+s[i:]
open(p,'w').write(s);print('ok')

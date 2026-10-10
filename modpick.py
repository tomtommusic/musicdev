import sys
CSS = r'''
/* ===== mobile : menu déroulant des modules ===== */
.modpick{display:none}
@media (max-width:600px){
  .rail .mods{display:none}
  .modpick{display:flex;position:relative;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--line);
    border-radius:16px;padding:10px 12px 10px 16px;box-shadow:var(--shadow-sm);box-shadow:inset 3px 0 0 var(--accent),var(--shadow-sm)}
  .modpick .mp-txt{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
  .modpick .mp-g{font:500 .66rem/1 var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
  .modpick .mp-t{font:700 1.1rem/1.2 var(--f-display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .modpick .mp-s{display:none;font:500 .7rem/1.2 var(--f-mono);letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}
  .modpick .mp-ic{flex:0 0 auto;display:grid;place-items:center;width:42px;height:42px;border-radius:12px;
    background:var(--btn);border:1px solid var(--btn-edge);color:var(--ink);box-shadow:var(--shadow-sm)}
  .modpick .mp-ic svg{width:20px;height:20px}
  .modpick select{position:absolute;inset:0;width:100%;height:100%;opacity:0;font-size:16px;cursor:pointer;-webkit-appearance:none;appearance:none}
  .modpick:has(select:focus-visible){outline:3px solid var(--accent);outline-offset:2px}
}
'''
JS = r'''
<script>
/* mobile : menu déroulant des modules (même navigation que la barre des modules) */
(()=>{const mods=document.getElementById('mods');if(!mods||typeof MODS==='undefined')return;
const box=document.createElement('label');box.className='modpick';
box.innerHTML='<span class="mp-txt"><span class="mp-g"></span><span class="mp-t"></span><span class="mp-s"></span></span><span class="mp-ic" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"/></svg></span>';
const sel=document.createElement('select');sel.setAttribute('aria-label','Choisir un module');box.append(sel);
let grp=null;const gOf={};let cur='';
for(const m of MODS){if(m.g){cur=m.g;grp=document.createElement('optgroup');grp.label=m.g;sel.append(grp);}
  gOf[m.id]=cur;const o=new Option(m.t,m.id);(grp||sel).append(o);}
mods.after(box);
const sync=()=>{const m=MODS.find(x=>x.id===S.mod)||MODS[0];sel.value=m.id;
  box.querySelector('.mp-g').textContent='Module'+(gOf[m.id]?' · '+gOf[m.id]:'');box.querySelector('.mp-t').textContent=m.t;box.querySelector('.mp-s').textContent=m.s||'';};
sel.addEventListener('change',()=>{openModule(sel.value);sync();scrollTo({top:0,behavior:'smooth'});});
new MutationObserver(sync).observe(mods,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-current']});sync();})();
</script>
'''
for p in sys.argv[1:]:
    s=open(p).read()
    if 'menu déroulant des modules ====' in s: print('deja',p); continue
    i=s.rfind('</style>',0,s.find('<body')); s=s[:i]+CSS+s[i:]
    j=s.rfind('</body>'); s=s[:j]+JS+s[j:]
    open(p,'w').write(s); print('ok',p)

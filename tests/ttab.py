from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();
    for lang in ['fr','en']:
        pg=b.new_page(viewport={'width':1200,'height':900})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(500)
        pg.evaluate(f"()=>{{localStorage.setItem('atelier-tab','guitar');localStorage.setItem('atelier-lang','{lang}')}}")
        pg.reload();pg.wait_for_timeout(600)
        pg.evaluate("()=>openModule('lm')");pg.wait_for_timeout(800)
        print(lang,pg.evaluate("()=>({els:MOD.lm.els.length,ev:S.ex.events.length,tab:document.querySelectorAll('#score .abcjs-tabNumber').length})"),errs)
        pg.screenshot(path=f'tab_{lang}.png')
        pg.evaluate("()=>openModule('la')");pg.wait_for_timeout(800)
        print(pg.evaluate("()=>({els:MOD.la.els.filter(Boolean).length,tab:document.querySelectorAll('#score .abcjs-tabNumber').length})"))
        # settings field
        print(pg.evaluate("()=>{const s=document.getElementById('s_tab');return s?[...s.options].map(o=>o.textContent):null}"))
    b.close()

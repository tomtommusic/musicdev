from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':844})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8790/');pg.wait_for_timeout(500)
    pg.evaluate("()=>{localStorage.setItem('atelier-tab','');localStorage.setItem('atelier-lang','es');localStorage.setItem('atelier-theme','dark')}")
    pg.reload();pg.wait_for_timeout(600)
    pg.evaluate("()=>openModule('so')");pg.wait_for_timeout(600)
    pg.evaluate("()=>document.getElementById('setbtn').click()");pg.wait_for_timeout(400)
    pg.select_option('#s_tab','bass');pg.wait_for_timeout(400)
    print(pg.evaluate("()=>({tab:document.querySelectorAll('#score .abcjs-tabNumber').length,ls:localStorage.getItem('atelier-tab'),opts:[...document.getElementById('s_tab').options].map(o=>o.textContent),hint:document.getElementById('s_tab').parentNode.textContent})"),errs)
    pg.locator('#s_tab').scroll_into_view_if_needed();pg.screenshot(path='tab_set.png')
    b.close()

from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h in [(820,1180),(768,1024),(1180,820)]:
        pg=b.new_page(viewport={'width':w,'height':h});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(700)
        pg.screenshot(path=f'ipad_ho_{w}.png')
        pg.evaluate("openModule('lm')");pg.wait_for_timeout(500);pg.screenshot(path=f'ipad_lm_{w}.png')
        print(w,pg.evaluate("[getComputedStyle(document.querySelector('.modpick')).display,getComputedStyle(document.querySelector('.rail .mods')).display]"),errs)
        if w<860:
            pg.select_option('.modpick select','dg');pg.wait_for_timeout(400);print(' select ->',pg.evaluate("S.mod"))
    b.close()

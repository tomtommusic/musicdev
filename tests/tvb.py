from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
    for w in [1200,390]:
        pg=b.new_page(viewport={'width':w,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(2500)
        print('preload',pg.evaluate("Object.keys(A.smp.buf).length"),pg.evaluate("!!A.ctx"))
        pg.evaluate("openModule('lr')");pg.wait_for_timeout(400)
        pg.evaluate("()=>{const b=[...document.querySelectorAll('#toolbar button')].find(x=>/Commencer/.test(x.textContent));b&&b.click()}")
        pg.wait_for_timeout(int(60000/72*5.5))
        print(pg.evaluate("()=>{const v=document.getElementById('vbeat');return v?[v.className,[...v.children].map(i=>i.className)]:null}"))
        pg.screenshot(path=f'vb_{w}.png');print(errs)
    b.close()

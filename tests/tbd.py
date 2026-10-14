from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required'])
    for lang,w in [('fr',390),('en',1200)]:
        ctx=b.new_context(viewport={'width':w,'height':900});pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(300);pg.evaluate(f"localStorage.clear();localStorage.setItem('atelier-lang','{lang}')");pg.reload();pg.wait_for_timeout(2000)
        pg.evaluate("openModule('iv')");pg.wait_for_timeout(300)
        pg.evaluate("for(let i=0;i<12;i++)tally(true)");pg.wait_for_timeout(500)
        pg.screenshot(path=f'bd_toast_{lang}.png')
        for m in ['dm','dr','pc','ln','lm','tq','mt','ac','en','gc','dg']:pg.evaluate(f"openModule('{m}')");pg.wait_for_timeout(120)
        pg.evaluate("openModule('ac')");pg.wait_for_timeout(300);pg.evaluate("tunerStart()");pg.wait_for_timeout(800)
        pg.evaluate("openModule('bd')");pg.wait_for_timeout(500)
        print(lang,pg.evaluate("[Object.keys(BD.got),BD.c,BD.sets,BD.days]"),errs)
        pg.screenshot(path=f'bd_view_{lang}.png',full_page=True)
        ctx.close()
    b.close()

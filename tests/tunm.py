from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required'])
    ctx=b.new_context();ctx.add_init_script("Object.defineProperty(navigator,'audioSession',{value:{type:'auto'}})")
    pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8790/');pg.wait_for_timeout(500)
    pg.evaluate("openModule('dm')");pg.wait_for_timeout(300)
    pg.evaluate("A.init();A.piano(60,A.ctx.currentTime,.3,.4)");print('après son',pg.evaluate("navigator.audioSession.type"))
    pg.evaluate("openModule('lm')");pg.wait_for_timeout(300)
    pg.evaluate("micStart('pitch')");pg.wait_for_timeout(800);print('micro',pg.evaluate("navigator.audioSession.type"),pg.evaluate("MIC.on"))
    pg.evaluate("micStop()");pg.wait_for_timeout(200);print('après micro',pg.evaluate("navigator.audioSession.type"))
    print(errs);b.close()

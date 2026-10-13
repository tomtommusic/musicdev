from playwright.sync_api import sync_playwright
TXT="Couplet 1\n  Je marche dans la rue\n  sous la pluie\n\nRefrain\nOh oh oh\n\n\nCouplet 2\nligne 1\nligne 2\nligne 3\nligne 4\nligne 5\nligne 6\nligne 7\nligne 8\nligne 9\nligne 10"
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required'])
    for w in [1200,390]:
        pg=b.new_page(viewport={'width':w,'height':850});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(500);pg.evaluate("openModule('en')");pg.wait_for_timeout(500)
        pg.click('text=Écrire ou coller');pg.fill('.lyarea',TXT);pg.click('text=Terminé');pg.wait_for_timeout(200)
        print('texte gardé',pg.evaluate("document.querySelector('.lytxt').textContent")==TXT, pg.evaluate("getComputedStyle(document.querySelector('.lytxt')).whiteSpace"))
        pg.locator('.lysec').screenshot(path=f'ly_{w}.png')
        # record 4 s with count-in
        pg.evaluate("RC.count=true;MT.bpm=120");pg.evaluate("recStart()");pg.wait_for_timeout(5500)
        st=pg.evaluate("[RS.on,LS.run,document.querySelector('.lybox').scrollTop]");print('pendant',st)
        pg.click('text=⛶ Plein écran');pg.wait_for_timeout(300);pg.screenshot(path=f'lyfull_{w}.png')
        pg.evaluate("recStop()");pg.wait_for_timeout(2500)
        print('après',pg.evaluate("[RS.on,LS.run,!!RS.last,document.querySelector('.lfgo').textContent]"))
        pg.click('.lyclose');pg.wait_for_timeout(200)
        print(pg.evaluate("[!!document.querySelector('.mstbox'),RS.last&&RS.last.ext]"),errs)
    b.close()

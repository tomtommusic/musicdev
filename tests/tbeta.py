from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for lang in ['fr','en']:
        pg=b.new_page(viewport={'width':1200,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(300);pg.evaluate(f"localStorage.setItem('atelier-lang','{lang}')");pg.reload();pg.wait_for_timeout(600)
        pg.evaluate("openModule('en')");pg.wait_for_timeout(300)
        pg.evaluate("""()=>{const sr=44100,n=sr*2,ch=[new Float32Array(n)];RS.last={blob:mstWav(ch,sr),type:'audio/wav',ext:'wav',dur:2,date:Date.now(),name:'t'};recShow();}""");pg.wait_for_timeout(300)
        print(lang,pg.evaluate("[document.querySelector('.lysec h3').innerText,document.querySelector('.mstbox h4').innerText]"))
        pg.locator('.lysec .lyhead').screenshot(path=f'beta_{lang}.png')
        pg.evaluate("openModule('lm')");pg.wait_for_timeout(300);pg.evaluate("document.getElementById('setbtn').click()");pg.wait_for_timeout(200)
        print(pg.evaluate("document.getElementById('s_tab').parentNode.parentNode.querySelector('.fl').innerText"),errs)
    b.close()

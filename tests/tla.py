from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for lang in ['fr','en','es']:
        pg=b.new_page(viewport={'width':1200,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(300)
        pg.evaluate(f"localStorage.setItem('atelier-lang','{lang}')");pg.reload();pg.wait_for_timeout(600)
        pg.evaluate("openModule('la')");pg.wait_for_timeout(400)
        print(lang,pg.evaluate("[document.querySelector('h1,h2').innerText,document.querySelector('[data-mod=la],#mods [data-id=la]')?.innerText||'']"),pg.evaluate("document.body.innerText.match(/(Lecture mélodique|Melodic reading|Lectura melódica)[^\\n]*\\n[^\\n]*/g)?.slice(0,2)"),pg.evaluate("/appliqu|Applied|aplicada/.test(document.body.innerText)"),errs)
    b.close()

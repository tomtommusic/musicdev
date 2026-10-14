from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for lang,w in [('fr',1200),('en',390),('es',390)]:
        pg=b.new_page(viewport={'width':w,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(300);pg.evaluate(f"localStorage.setItem('atelier-lang','{lang}')");pg.reload();pg.wait_for_timeout(500);pg.evaluate("openModule('ap')");pg.wait_for_timeout(400)
        t=pg.evaluate("document.querySelector('.ap').innerText")
        fr=[x for x in ['En bref','Le micro','Licences','Politique de','Voir la licence','Tous droits','recueille'] if x in t]
        print(lang,w,len(t),'FR:',fr if lang!='fr' else '-',errs, pg.evaluate("document.querySelector('.apver').innerText"))
        pg.screenshot(path=f'ap_{lang}_{w}.png',full_page=False)
    b.close()

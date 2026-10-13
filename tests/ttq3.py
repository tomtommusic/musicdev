from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for w in [1200,390]:
        pg=b.new_page(viewport={'width':w,'height':1000})
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(500);pg.evaluate("openModule('tq')");pg.wait_for_timeout(600)
        pg.screenshot(path=f'tq_{w}.png')
        print(pg.evaluate("()=>{const s=document.querySelector('.stand');return s?[s.offsetHeight,getComputedStyle(s).display,document.getElementById('meta').innerText]:null}"))
    b.close()

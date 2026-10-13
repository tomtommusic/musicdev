from playwright.sync_api import sync_playwright
import re
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1200,'height':900})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8790/');pg.wait_for_timeout(500)
    for tab in ['guitar','bass']:
        pg.evaluate(f"()=>localStorage.setItem('atelier-tab','{tab}')")
        res=[]
        for mod in ['lm','la']:
          pg.evaluate(f"openModule('{mod}')");pg.wait_for_timeout(200)
          pg.evaluate(f"()=>{{const c=S.cfg['{mod}'];c.lo=-5;c.hi=11;c.leap=7;c.keys=ALL_KEYS;c.clef='alt'}}")
          for i in range(15):
            pg.evaluate("newEx()");pg.wait_for_timeout(60)
            r=pg.evaluate("()=>({clef:S.ex.clef,ms:S.ex.events.filter(e=>!e.rest).map(e=>e.midi),tab:[...document.querySelectorAll('#score .abcjs-tab-number')].map(t=>t.textContent)})")
            fr=[x for x in r['tab'] if x.strip()]
            res.append((r['clef'],min(r['ms']),max(r['ms']),max([int(x) for x in fr if x.isdigit()]+[0]),'?' in ''.join(fr)))
        print(tab,set(x[0] for x in res),min(x[1] for x in res),max(x[2] for x in res),'maxfret',max(x[3] for x in res),'q',any(x[4] for x in res))
    pg.evaluate("openModule('so')");pg.wait_for_timeout(300)
    print('so tab',pg.evaluate("document.querySelectorAll('#score .abcjs-tabNumber').length"))
    pg.evaluate("openModule('tq')");pg.wait_for_timeout(300);print(pg.evaluate("document.getElementById('meta').innerText"))
    print(errs)
    b.close()

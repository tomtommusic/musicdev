from playwright.sync_api import sync_playwright
import re
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
    for lang in ['fr','en','es']:
      for w in [1200,390]:
        ctx=b.new_context(viewport={'width':w,'height':900});pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(400)
        pg.evaluate(f"()=>{{localStorage.setItem('atelier-lang','{lang}');localStorage.setItem('atelier-tab','guitar')}}");pg.reload();pg.wait_for_timeout(700)
        mods=pg.evaluate("MODS.map(m=>m.id)")
        for m in mods:
            n=len(errs)
            pg.evaluate(f"openModule('{m}')");pg.wait_for_timeout(300)
            pg.evaluate("()=>{const b=document.getElementById('setbtn');if(b&&b.offsetParent){b.click();b.click();}}");pg.wait_for_timeout(100)
            if len(errs)>n:print(lang,w,m,errs[n:])
        # untranslated French check for en
        if lang!='fr':
            pg.evaluate("openModule('lm')");pg.wait_for_timeout(300);pg.evaluate("document.getElementById('setbtn').click()");pg.wait_for_timeout(200)
            t=pg.evaluate("document.getElementById('s_tab').closest('.field,label,div').parentNode.innerText")
            print(lang,w,repr(t[:200]))
        print(lang,w,'mods',len(mods),'errs',len(errs))
        ctx.close()
    b.close()

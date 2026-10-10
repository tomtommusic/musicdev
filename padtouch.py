import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,color_scheme='dark'); pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#tq'); await pg.wait_for_timeout(900)
    await pg.evaluate("""()=>{localStorage.removeItem('atelier-quiz');let q;do{q=QZG.l_sol(1,['staff']);}while(!q||!q.pad);
      QZ.test={seed:1,cfg:S.cfg.tq,qs:[Object.assign(q,{subj:'lec'})],resp:[null],done:false,name:'',date:Date.now()};QZ.i=0;QZ.view='q';qzRender();}""")
    await pg.wait_for_timeout(500)
    await pg.locator(".qzpad").scroll_into_view_if_needed(); await pg.wait_for_timeout(300)
    r=await pg.evaluate("(()=>{const r=document.querySelector('.qzpad .abcjs-staff').getBoundingClientRect();return [r.x+r.width*0.6,r.y+r.height/2,r.height];})()")
    print('staff height px',round(r[2],1))
    await pg.evaluate("window.LOG=[];['pointerdown','pointerup','pointercancel','click','touchstart','touchend'].forEach(t=>document.querySelector('.qzpad').addEventListener(t,e=>LOG.push(t+':'+(e.pointerType||''))))")
    await pg.touchscreen.tap(r[0],r[1]); await pg.wait_for_timeout(400)
    print(await pg.evaluate("LOG"))
    print('placed',await pg.evaluate("JSON.stringify(QZ.test.resp[0])"))
    await pg.click('text=▲ Monter'); await pg.wait_for_timeout(200)
    print('after nudge',await pg.evaluate("JSON.stringify(QZ.test.resp[0])"))
    await pg.locator('.qzcard.qzq').screenshot(path=f'{D}/qzshots/pad_m.png'); print(errs); await b.close()
asyncio.run(main())

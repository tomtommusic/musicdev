import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for vp,nm in [({'width':1280,'height':900},'d'),({'width':390,'height':844},'m')]:
      c=await b.new_context(viewport=vp,device_scale_factor=2); pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#tq'); await pg.wait_for_timeout(900)
      await pg.evaluate("""()=>{localStorage.removeItem('atelier-quiz');const orig=Math.random;let q;do{q=QZG.g_arm(3,['mc']);}while(!q.opts[0].abc||!q.opts.some(o=>/K:(C#|Cb|F#|Gb)/.test(o.abc)));let q2;do{q2=QZG.g_arm(2,['mc']);}while(!(q2.abc&&q2.small));
        QZ.test={seed:1,cfg:S.cfg.tq,qs:[q,q2].map(x=>Object.assign(x,{subj:'gam'})),resp:[null,null],done:false,name:'',date:Date.now()};QZ.i=0;QZ.view='q';qzRender();}""")
      await pg.wait_for_timeout(400); await pg.locator('.qzcard.qzq').screenshot(path=f'{D}/qzshots/arm_{nm}.png')
      await pg.evaluate("qzGo(1)"); await pg.wait_for_timeout(400); await pg.locator('.qzcard.qzq').screenshot(path=f'{D}/qzshots/arm2_{nm}.png')
      print(errs); await c.close()
    await b.close()
asyncio.run(main())

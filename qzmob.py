import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark',is_mobile=True,has_touch=True)
    pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#tq'); await pg.wait_for_timeout(1000)
    await pg.evaluate("localStorage.removeItem('atelier-quiz');QZ.test=null;S.cfg.tq.topics=['l_alt','r_cmp','i_nom','a_ecr','g_arm','e_rhy','r_fig'];S.cfg.tq.n=7;newEx();")
    await pg.wait_for_timeout(300)
    await pg.screenshot(path=f'{D}/qzshots/m_start.png',full_page=True)
    await pg.click('text=Commencer le questionnaire'); await pg.wait_for_timeout(500)
    for i in range(7):
      await pg.screenshot(path=f'{D}/qzshots/m_q{i}.png',full_page=True)
      if i<6: await pg.click('.qznav >> text=Suivante ›'); await pg.wait_for_timeout(300)
    print(errs)
    await b.close()
asyncio.run(main())

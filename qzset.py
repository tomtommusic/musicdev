import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for vp,nm in [({'width':1280,'height':900},'d'),({'width':390,'height':844},'m')]:
      c=await b.new_context(viewport=vp,device_scale_factor=1 if nm=='d' else 2); pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#tq'); await pg.wait_for_timeout(900)
      await pg.evaluate("document.getElementById('setbtn').click()"); await pg.wait_for_timeout(400)
      await pg.click('#qz_lec'); await pg.click('#qz_r_cmp'); await pg.wait_for_timeout(300)
      print(nm, await pg.evaluate("S.cfg.tq.topics.join(',')"), await pg.evaluate("document.getElementById('qz_rhy').indeterminate"), errs)
      await pg.locator('#settings').screenshot(path=f'{D}/qzshots/set_{nm}.png')
      await c.close()
    await b.close()
asyncio.run(main())

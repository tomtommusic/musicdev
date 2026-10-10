import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for scheme in ['dark','light']:
      c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme=scheme,is_mobile=True,has_touch=True)
      pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html'); await pg.wait_for_timeout(800)
      for mid in ['dm','dr','ln','lr','la','iv','pc']:
        await pg.evaluate(f"openModule('{mid}')"); await pg.wait_for_timeout(300)
        tb=pg.locator('#toolbar'); await tb.scroll_into_view_if_needed()
        await tb.screenshot(path=f'{D}/m_{scheme}_{mid}.png')
        ov=await pg.evaluate("document.documentElement.scrollWidth-innerWidth")
        if ov>0: print('overflow',mid,ov)
      await pg.evaluate("openModule('bt')"); await pg.wait_for_timeout(500)
      await pg.evaluate("scrollTo(0,0)")
      await pg.screenshot(path=f'{D}/m_{scheme}_lib.png')
      # click a later sub chip
      subs=pg.locator('.libsub'); n=await subs.count()
      await subs.nth(n-1).click(); await pg.wait_for_timeout(400)
      await pg.locator('.libcats').scroll_into_view_if_needed()
      await pg.screenshot(path=f'{D}/m_{scheme}_lib2.png')
      await pg.locator('.libcat').nth(4).click(); await pg.wait_for_timeout(400)
      await pg.screenshot(path=f'{D}/m_{scheme}_lib3.png',full_page=False)
      ov=await pg.evaluate("document.documentElement.scrollWidth-innerWidth"); print(scheme,'lib overflow',ov,'errs',errs)
      await c.close()
    await b.close()
asyncio.run(main())

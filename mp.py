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
      await pg.screenshot(path=f'{D}/mp_{scheme}_1.png')
      await pg.select_option('.modpick select','pc'); await pg.wait_for_timeout(500)
      print(scheme, await pg.evaluate("S.mod"), await pg.locator('.modpick .mp-t').text_content(), await pg.locator('.modpick .mp-g').text_content())
      await pg.evaluate("openModule('bt')"); await pg.wait_for_timeout(300)
      print(' sync', await pg.locator('.modpick select').input_value(), await pg.locator('.modpick .mp-t').text_content(), errs)
      await pg.evaluate("scrollTo(0,0)"); await pg.screenshot(path=f'{D}/mp_{scheme}_2.png')
      await c.close()
    c=await b.new_context(viewport={'width':1280,'height':800}); pg=await c.new_page()
    await pg.goto('http://localhost:8790/index.html'); await pg.wait_for_timeout(500)
    print('desktop modpick visible', await pg.locator('.modpick').is_visible(), 'mods visible', await pg.locator('#mods').is_visible())
    await b.close()
asyncio.run(main())

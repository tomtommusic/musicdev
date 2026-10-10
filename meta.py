import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark',is_mobile=True,has_touch=True)
    pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html'); await pg.wait_for_timeout(800)
    for mid in ['dm','dr','iv','pc','ln','lr','la']:
      await pg.evaluate(f"openModule('{mid}')"); await pg.wait_for_timeout(300)
      await pg.locator('.stand .meta').screenshot(path=f'{D}/meta_{mid}.png')
    await pg.evaluate("openModule('dm')"); await pg.wait_for_timeout(300)
    await pg.click('.mi-set button'); await pg.wait_for_timeout(300)
    print('open', await pg.evaluate("!document.getElementById('settings').hidden"), await pg.get_attribute('.mi-set button','aria-expanded'))
    await pg.locator('.stand').screenshot(path=f'{D}/meta_open.png')
    await pg.click('.mi-set button'); await pg.wait_for_timeout(200)
    print('closed', await pg.evaluate("document.getElementById('settings').hidden"), errs)
    await b.close()
asyncio.run(main())

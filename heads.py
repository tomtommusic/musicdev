import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark'); pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#ac'); await pg.wait_for_timeout(800)
    for inst in ['guitare','basse4','basse5','ukulele','banjo','violon']:
      await pg.select_option('#tn_inst',inst); await pg.wait_for_timeout(300)
      await pg.locator('.tnhead').screenshot(path=f'{D}/qzshots/h_{inst}.png')
    print(errs); await b.close()
asyncio.run(main())

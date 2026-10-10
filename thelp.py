import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for w in [1200,390]:
      c=await b.new_context(viewport={'width':w,'height':900},device_scale_factor=2);pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html');await pg.wait_for_timeout(900)
      print(w,await pg.evaluate("[getComputedStyle(document.querySelector('.helpwrap')).display,document.querySelectorAll('.hotip').length]"))
      await pg.screenshot(path=f'hh_{w}.png')
      await pg.click('#helpbtn');await pg.wait_for_timeout(600)
      print(await pg.evaluate("[S.mod,HELP.on,document.querySelectorAll('.hotip').length,getComputedStyle(document.querySelector('.helpwrap')).display]"),errs[:2])
      await pg.evaluate("openModule('gc')");print(await pg.evaluate("getComputedStyle(document.querySelector('.helpwrap')).display"))
      await c.close()
    await b.close()
asyncio.run(main())

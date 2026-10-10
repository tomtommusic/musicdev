import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,th,inst) in [(1200,'light','vln'),(390,'dark','vc'),(1200,'dark','cb')]:
      c=await b.new_context(viewport={'width':w,'height':900},device_scale_factor=2)
      pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#dg');await pg.evaluate(f"document.documentElement.dataset.theme='{th}'");await pg.wait_for_timeout(600)
      await pg.evaluate(f"DG.inst='{inst}';dgRender()");await pg.wait_for_timeout(600)
      await pg.add_style_tag(content='.dgsinfo{position:static!important}')
      ns=await pg.query_selector_all('.dgsstaff .abcjs-note');print(inst,len(ns))
      if ns:
        bb=await ns[5].bounding_box();await pg.mouse.click(bb['x']+bb['width']/2,bb['y']+bb['height']/2);await pg.wait_for_timeout(300)
      e=await pg.query_selector('.dgstaffsec');await e.screenshot(path=f'vs_{inst}_{w}.png')
      print(await pg.evaluate("document.querySelector('.dgsinfo')?.innerText.slice(0,80)"),await pg.evaluate("document.querySelectorAll('.dgn5.sel').length"),errs[:2])
      await c.close()
    await b.close()
asyncio.run(main())

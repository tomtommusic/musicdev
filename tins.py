import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,L,th) in [(1200,'fr','light'),(390,'en','dark')]:
      c=await b.new_context(viewport={'width':w,'height':900},device_scale_factor=2)
      await c.add_init_script(f"try{{localStorage.setItem('atelier-lang','{L}');localStorage.setItem('atelier-gc','{{\"root\":7,\"type\":\"7\",\"inst\":\"gtr\"}}')}}catch(e){{}}")
      pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#gc');await pg.evaluate(f"document.documentElement.dataset.theme='{th}'");await pg.wait_for_timeout(700)
      for inst in ['uke','banjo','mando','piano']:
        await pg.evaluate(f"GC.inst='{inst}';gcRender()");await pg.wait_for_timeout(250)
        e=await pg.query_selector('.gcres');await e.screenshot(path=f'ci_{inst}_{w}.png')
        print(w,inst,await pg.evaluate("document.querySelectorAll('.gccard').length"),await pg.evaluate("document.querySelector('.gcfifth')?.textContent||''"))
      await pg.click('.gccard');await pg.wait_for_timeout(200)
      await pg.evaluate("openModule('dg')");await pg.wait_for_timeout(600)
      for inst in ['banjo','mando']:
        await pg.evaluate(f"DG.inst='{inst}';dgRender()");await pg.wait_for_timeout(300)
        await pg.add_style_tag(content='.dgsinfo{position:static!important}')
        e=await pg.query_selector('.dgneckwrap');await e.screenshot(path=f'dn_{inst}_{w}.png')
      print(errs[:3]);await c.close()
    await b.close()
asyncio.run(main())

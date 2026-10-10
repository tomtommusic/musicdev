import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,th) in [(1200,'light'),(390,'dark')]:
      c=await b.new_context(viewport={'width':w,'height':900},device_scale_factor=2)
      pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#dg');await pg.evaluate(f"document.documentElement.dataset.theme='{th}'");await pg.wait_for_timeout(600)
      await pg.add_style_tag(content='.dgsinfo{position:static!important}')
      for inst in sys.argv[1:]:
        await pg.evaluate(f"DG.inst='{inst}';dgRender()");await pg.wait_for_timeout(700)
        if inst=='drums': await pg.evaluate("document.querySelectorAll('.dgdn')[3].dispatchEvent(new MouseEvent('click',{bubbles:true}))")
        sel={'drums':'.dgdrums','tuba':'.dgchart','oboe':'.dgchart','bsn':'.dgchart'}.get(inst,'.dgstaffsec')
        e=await pg.query_selector(sel)
        if e: await e.screenshot(path=f'nw_{inst}_{w}.png')
        else: print('missing',inst)
      print(w,errs[:3]);await c.close()
    await b.close()
asyncio.run(main())

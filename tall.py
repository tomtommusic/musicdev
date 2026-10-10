import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for L in ['fr','en','es']:
      c=await b.new_context(viewport={'width':390,'height':844});await c.add_init_script(f"try{{localStorage.setItem('atelier-lang','{L}')}}catch(e){{}}")
      pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#dg');await pg.wait_for_timeout(700)
      for i in await pg.evaluate("DG_INST.map(i=>i.id)"):
        await pg.evaluate(f"DG.inst='{i}';dgRender()");await pg.wait_for_timeout(150)
      await pg.evaluate("DG.inst='drums';dgRender()");await pg.wait_for_timeout(300)
      t=await pg.evaluate("document.querySelector('.dgdrums').innerText.slice(0,160).replace(/\\n/g,' | ')")
      print(L,errs[:3],t)
      if L=='en':await pg.screenshot(path='m_drums.png',full_page=False)
      await c.close()
    await b.close()
asyncio.run(main())

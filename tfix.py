import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for L in ['fr','en','es']:
      c=await b.new_context(viewport={'width':1100,'height':900});await c.add_init_script(f"try{{localStorage.setItem('atelier-lang','{L}');localStorage.setItem('atelier-gc','{{\"root\":9,\"type\":\"m7\"}}')}}catch(e){{}}")
      pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#gc');await pg.wait_for_timeout(800)
      print(L,await pg.evaluate("[document.querySelector('.gcsym').textContent,[...document.querySelectorAll('.gcchips')[1].querySelectorAll('b')].map(b=>b.textContent).join(', ')]"))
      vis={}
      for m in ['ho','dm','dr','iv','pc','ln','lm','lr','so','la','bt','tq','dg','gc','mt','ac','en']:
        await pg.evaluate(f"openModule('{m}')");await pg.wait_for_timeout(120)
        vis[m]=await pg.evaluate("getComputedStyle(document.querySelector('.helpwrap')).display!=='none'")
      print(' aide visible :',[k for k,v in vis.items() if v],'| cachée :',[k for k,v in vis.items() if not v],errs[:2])
      await c.close()
    await b.close()
asyncio.run(main())

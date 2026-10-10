import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,h,th,L,hash,name) in [(1280,860,'light','fr','','h_desk'),(390,844,'dark','fr','','h_mob'),(1280,900,'dark','en','#gc','g_desk'),(390,844,'light','fr','#gc','g_mob')]:
      c=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2)
      await c.add_init_script(f"try{{localStorage.setItem('atelier-lang','{L}');localStorage.removeItem('atelier-gc')}}catch(e){{}}")
      pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html'+hash);await pg.evaluate(f"document.documentElement.dataset.theme='{th}'");await pg.wait_for_timeout(1200)
      await pg.screenshot(path=name+'.png',full_page=name=='g_mob')
      print(name,errs[:3])
      await c.close()
    await b.close()
asyncio.run(main())

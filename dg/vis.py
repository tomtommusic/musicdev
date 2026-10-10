import asyncio,sys
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/'
L=sys.argv[1] if len(sys.argv)>1 else 'fr'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,h,tag) in [(1280,900,'d'),(390,844,'m')]:
      ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2 if tag=='m' else 1)
      await ctx.add_init_script(f"localStorage.setItem('atelier-lang','{L}')")
      pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
      await pg.goto('http://localhost:8790/index.html#dg');await pg.wait_for_timeout(900)
      await pg.screenshot(path=f'{D}{tag}_{L}_pick.png',full_page=True)
      for inst in ['flute','clar','asax','tpt','tbn','vln','vc','cb','gtr','bass','vla']:
        await pg.evaluate(f"DG.inst='{inst}';dgRender()");await pg.wait_for_timeout(700)
        if inst in('vln','gtr','cb'):
          await pg.evaluate("document.querySelectorAll('.dgn4')[9].dispatchEvent(new MouseEvent('click',{bubbles:true}))");await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{D}{tag}_{L}_{inst}.png',full_page=True)
      print(tag,errs);await ctx.close()
asyncio.run(main())

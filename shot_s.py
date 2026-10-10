import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();c=await b.new_context(viewport={'width':1200,'height':900},device_scale_factor=2,color_scheme=sys.argv[2])
    pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#dg');await pg.wait_for_timeout(800)
    await pg.evaluate(f"DG.inst='{sys.argv[1]}';dgRender()");await pg.wait_for_timeout(500)
    if len(sys.argv)>3: await pg.evaluate("document.querySelectorAll('.dgn5')[%s].dispatchEvent(new MouseEvent('click',{bubbles:true}))"%sys.argv[3]);await pg.wait_for_timeout(300)
    sel='.dgneckwrap' if sys.argv[1] in('vln','vla','vc','cb','gtr','bass') else '.dgchart'
    await pg.add_style_tag(content='.dgsinfo{position:static!important}')
    e=await pg.query_selector(sel);await e.screenshot(path=f's_{sys.argv[1]}_{sys.argv[2]}.png')
    print(errs);await b.close()
asyncio.run(main())

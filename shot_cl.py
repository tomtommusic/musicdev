import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();c=await b.new_context(viewport={'width':1200,'height':900},device_scale_factor=2,color_scheme=sys.argv[1])
    pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#dg');await pg.wait_for_timeout(800)
    print(await pg.evaluate("DG_INST.map(i=>i.id).join(',')"))
    await pg.evaluate("DG.inst=DG_INST.find(i=>/cla/.test(i.id)).id;dgRender()");await pg.wait_for_timeout(600)
    ch=await pg.query_selector('.dgchart')
    await ch.screenshot(path=f'clchart_{sys.argv[1]}.png')
    await pg.screenshot(path=f'cltop_{sys.argv[1]}.png')
    print(errs)
    await b.close()
asyncio.run(main())

import asyncio,sys
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for scheme in ['light','dark']:
      ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme=scheme)
      pg=await ctx.new_page()
      await pg.goto('http://localhost:8790/index.html#dg');await pg.wait_for_timeout(700)
      for inst,m in [('clar',[60,63,66,70,71,72,73]),('asax',[60,70])]:
        await pg.evaluate(f"DG.inst='{inst}';DG.sel['{inst}']={m[0]};dgRender()");await pg.wait_for_timeout(500)
        await pg.locator('.dgdet').screenshot(path=f'{D}w_{inst}_{scheme}.png')
        await pg.locator('.dgchart').screenshot(path=f'{D}wc_{inst}_{scheme}.png')
      await ctx.close()
asyncio.run(main())

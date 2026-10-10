import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':1280,'height':1300})).new_page()
    await pg.goto('http://localhost:8790/index.html#ou'); await pg.wait_for_timeout(900)
    print('hash ou ->',await pg.evaluate("S.mod"))
    await pg.locator('.rail').screenshot(path='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/qzshots/rail.png'); await b.close()
asyncio.run(main())

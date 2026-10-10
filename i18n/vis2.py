import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2);await ctx.add_init_script("localStorage.setItem('atelier-lang','en')")
    pg=await ctx.new_page()
    await pg.goto('http://localhost:8790/index.html#mt');await pg.wait_for_timeout(800);await pg.screenshot(path='shots/m_en_mt.png',full_page=True)
    await pg.goto('http://localhost:8790/index.html#tq');await pg.evaluate("localStorage.removeItem('atelier-quiz')");await pg.reload();await pg.wait_for_timeout(800)
    await pg.evaluate("()=>{S.cfg.tq.topics=['g_rel','i_nom','a_qua'];newEx();}");await pg.wait_for_timeout(300)
    await pg.evaluate("document.querySelector('.qz button.primary').click()");await pg.wait_for_timeout(500)
    await pg.locator('.qzwrap').screenshot(path='shots/m_en_q.png')
asyncio.run(main())

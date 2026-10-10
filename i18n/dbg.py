import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context();await ctx.add_init_script("localStorage.setItem('atelier-lang','en')")
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#tq');await pg.wait_for_timeout(800)
    await pg.evaluate("()=>{S.cfg.tq.topics=QZ_ALL_SUBS.slice();S.cfg.tq.n=60;newEx();}");await pg.wait_for_timeout(300)
    print(await pg.evaluate("[...document.querySelectorAll('.qz button')].map(b=>b.textContent).slice(0,10)"))
    print(await pg.evaluate("(()=>{const b=[...document.querySelectorAll('.qz button')][0];const n=b.firstChild;const st=TR_SEEN.get(n);return [n.nodeType, JSON.stringify(st), b.childNodes.length];})()"))
    print(errs)
asyncio.run(main())

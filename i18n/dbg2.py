import asyncio,sys
from playwright.async_api import async_playwright
L=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context();await ctx.add_init_script(f"localStorage.setItem('atelier-lang','{L}')")
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto('http://localhost:8790/index.html#tq');await pg.wait_for_timeout(800)
    await pg.evaluate("()=>{S.cfg.tq.topics=QZ_ALL_SUBS.slice();S.cfg.tq.n=40;newEx();}");await pg.wait_for_timeout(300)
    await pg.evaluate("document.querySelector('.qzteach .qzbtns button').click()");await pg.wait_for_timeout(15000)
    print(await pg.evaluate("document.querySelector('.qzteach .qzdeliver').innerText"))
    href=await pg.get_attribute('.qzteach .qzpdfready a','href')
    import base64
    data=await pg.evaluate("async(u)=>{const b=await (await fetch(u)).arrayBuffer();let s='';const a=new Uint8Array(b);for(let i=0;i<a.length;i+=32768)s+=String.fromCharCode(...a.subarray(i,i+32768));return btoa(s);}",href)
    open(f'shots/teach_{L}.pdf','wb').write(base64.b64decode(data))
    print(errs)
asyncio.run(main())

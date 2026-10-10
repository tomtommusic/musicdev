import asyncio,sys,re
from playwright.async_api import async_playwright
exec(open('crawl.py').read().split('async def main')[0].replace("L = sys.argv[1] if len(sys.argv) > 1 else 'en'","L=sys.argv[1]"))
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':1200,'height':900});await ctx.add_init_script(f"localStorage.setItem('atelier-lang','{L}')")
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#dg');await pg.wait_for_timeout(800)
    left={}
    for inst in ['flute','clar','asax','tpt','tbn','vln','vla','vc','cb','gtr','bass']:
      await pg.evaluate(f"DG.inst='{inst}';dgRender()");await pg.wait_for_timeout(400)
      n=await pg.evaluate("document.querySelectorAll('.dgcard,.dgcell').length")
      for i in range(0,n,1):
        await pg.evaluate(f"document.querySelectorAll('.dgcard,.dgcell')[{i}].click()")
        for t in await pg.evaluate(JS): left.setdefault(t,inst)
    for k,v in left.items(): print(v,'|',k[:150])
    print(L,len(left),errs)
asyncio.run(main())

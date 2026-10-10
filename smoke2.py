import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await (await b.new_context()).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)+' | '+(e.stack or '')[:400]))
    await pg.goto('http://localhost:8791/x.html'); await pg.wait_for_timeout(800)
    for m in ['dm','dr','iv','pc','ln','lm','lr','so','la','bt','dm']:
      n=len(errs); await pg.evaluate(f"openModule('{m}')"); await pg.wait_for_timeout(250)
      if len(errs)>n: print('after',m)
      await pg.evaluate("document.getElementById('setbtn').click()"); await pg.wait_for_timeout(150); await pg.evaluate("document.getElementById('setbtn').click()")
    print('errors',errs); await b.close()
asyncio.run(main())

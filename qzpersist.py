import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await (await b.new_context()).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#tq'); await pg.wait_for_timeout(800)
    await pg.evaluate("localStorage.removeItem('atelier-quiz');QZ.test=null;QZ.view='start';qzRender()")
    await pg.click('text=Commencer le questionnaire'); await pg.wait_for_timeout(300)
    await pg.evaluate("QZ.test.resp[0]=QZ.test.qs[0].opts?QZ.test.qs[0].ans:'x';qzGo(2)")
    before=await pg.evaluate("[QZ.test.qs.map(q=>q.prompt).join('|'),QZ.i]")
    await pg.reload(); await pg.wait_for_timeout(900)
    after=await pg.evaluate("QZ.test?[QZ.test.qs.map(q=>q.prompt).join('|'),QZ.i,QZ.view,QZ.test.resp[0]]:null")
    print('same questions',before[0]==after[0],'i',after[1],'view',after[2],'resp0',after[3])
    txt=await pg.inner_text('.qzstart'); print('resume button' ,'Reprendre' in txt, errs)
    await b.close()
asyncio.run(main())

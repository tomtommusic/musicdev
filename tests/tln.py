import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required'])
    c=await b.new_context(permissions=['microphone']);pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('c:'+m.text) if m.type=='error' else None)
    await pg.goto('http://localhost:8790/index.html#ln');await pg.wait_for_timeout(800)
    st=lambda: pg.evaluate("[S.mic,MIC.on,S.st.i,S.st.done,S.st.lock,[...document.querySelectorAll('#toolbar button')].filter(b=>!b.hidden).map(b=>b.textContent.trim()).join(' | '),document.getElementById('feedback').textContent]")
    print('0',await st())
    await pg.click('#toolbar .toggle');await pg.wait_for_timeout(300);print('micro on',await st())
    btns=await pg.query_selector_all('#toolbar button.primary');
    await pg.evaluate("[...document.querySelectorAll('#toolbar button')].find(b=>/Commencer/.test(b.textContent)&&!b.hidden).click()");await pg.wait_for_timeout(1500);print('started',await st())
    await pg.click('#toolbar .toggle');await pg.wait_for_timeout(400);print('micro off',await st())
    for k in range(3):
      await pg.evaluate("document.querySelectorAll('.names button')[0].click()");await pg.wait_for_timeout(1000)
    print('after answers',await st())
    await pg.evaluate("[...document.querySelectorAll('#toolbar button')].find(b=>/Commencer/.test(b.textContent)&&!b.hidden)?.click()");await pg.wait_for_timeout(500);print('restart',await st())
    print(errs[:5]);await b.close()
asyncio.run(main())

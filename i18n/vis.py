import asyncio,base64,sys
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/i18n/shots'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for (w,h,tag) in [(1280,900,'d'),(390,844,'m')]:
      ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2 if tag=='m' else 1,accept_downloads=True)
      pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#dm');await pg.evaluate("localStorage.clear()");await pg.reload();await pg.wait_for_timeout(800)
      await pg.screenshot(path=f'{D}/{tag}_fr.png')
      await pg.click('.langsw button[data-l=en]');await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'{D}/{tag}_en.png')
      await pg.evaluate("openModule('ac')");await pg.wait_for_timeout(400);await pg.screenshot(path=f'{D}/{tag}_en_ac.png',full_page=True)
      await pg.click('.langsw button[data-l=es]');await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'{D}/{tag}_es_ac.png',full_page=True)
      await pg.evaluate("S.lib.topic='relatives';openModule('bt')");await pg.wait_for_timeout(600);await pg.screenshot(path=f'{D}/{tag}_es_bt.png',full_page=True)
      await pg.evaluate("S.lib.topic='truc-armures';openModule('bt')");await pg.wait_for_timeout(600)
      await pg.evaluate("document.querySelector('.attile')&&document.querySelectorAll('.attile')[3].click()");await pg.wait_for_timeout(300)
      await pg.screenshot(path=f'{D}/{tag}_es_trick.png',full_page=True)
      await pg.reload();await pg.wait_for_timeout(800)
      print(tag,'lang after reload',await pg.evaluate("I18N.lang"), await pg.evaluate("document.querySelector('#title').textContent"))
      await pg.click('.langsw button[data-l=fr]');await pg.wait_for_timeout(500)
      print(tag,'fr title',await pg.evaluate("document.querySelector('#title').textContent"), await pg.evaluate("LIB_TOPICS['relatives'].t"))
      print('errs',errs)
      await ctx.close()
asyncio.run(main())

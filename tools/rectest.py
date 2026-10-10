import asyncio,sys
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/tools/'
L=sys.argv[1] if len(sys.argv)>1 else 'fr'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream',f'--use-file-for-fake-audio-capture={D}a2zero.wav','--autoplay-policy=no-user-gesture-required'])
    for (w,h,tag) in [(1280,900,'d'),(390,844,'m')]:
      ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2 if tag=='m' else 1,accept_downloads=True,permissions=['microphone'])
      await ctx.add_init_script(f"localStorage.setItem('atelier-lang','{L}')")
      pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
      await pg.goto('http://localhost:8790/index.html#en');await pg.wait_for_timeout(800)
      await pg.screenshot(path=f'{D}rec_{tag}_{L}_0.png',full_page=True)
      await pg.click('.rcgo');await pg.wait_for_timeout(1200)
      st=await pg.evaluate("document.querySelector('.rcstate').textContent");print('during countin',st)
      await pg.wait_for_timeout(3500)
      print('rec on',await pg.evaluate("RS.on"),await pg.evaluate("document.querySelector('.rcclock').textContent"))
      await pg.screenshot(path=f'{D}rec_{tag}_{L}_1.png')
      await pg.click('.rcgo');await pg.wait_for_timeout(800)
      print('take',await pg.evaluate("RS.last&&[RS.last.type,RS.last.ext,Math.round(RS.last.dur),RS.last.blob.size,RS.last.name]"))
      await pg.fill('#rc_name','Gamme de do / élève:Tom');await pg.locator('#rc_name').blur();await pg.wait_for_timeout(500)
      print('name',await pg.input_value('#rc_name'))
      await pg.screenshot(path=f'{D}rec_{tag}_{L}_2.png',full_page=True)
      async with pg.expect_download() as dl:
        await pg.locator('.rctake .qzbtns button').filter(has_text='l').first.click() if False else await pg.evaluate("recDownload()")
      d=await dl.value;print('download',d.suggested_filename)
      print('after',await pg.evaluate("document.querySelector('.rcafter').innerText.slice(0,80)"))
      await pg.reload();await pg.wait_for_timeout(1200)
      print('restored',await pg.evaluate("RS.last&&RS.last.name"),await pg.evaluate("!!document.querySelector('.rcaudio')"))
      await pg.click('.rcgo');await pg.wait_for_timeout(400)
      print('confirm',await pg.evaluate("document.querySelector('.rcafter').innerText.slice(0,60)"),await pg.evaluate("RS.arming||RS.on"))
      await pg.evaluate("document.querySelector('.rcafter .btn.primary').click()");await pg.wait_for_timeout(400)
      print('arming after confirm',await pg.evaluate("RS.arming||RS.on"))
      await pg.evaluate("openModule('mt')");await pg.wait_for_timeout(500)
      print('stopped by leaving',await pg.evaluate("RS.arming||RS.on"))
      await pg.evaluate("openModule('en')");await pg.wait_for_timeout(800)
      await pg.evaluate("recDelete()");await pg.wait_for_timeout(300)
      print('deleted',await pg.evaluate("RS.last"),await pg.evaluate("recLoad()"))
      print('errs',errs);await ctx.close()
asyncio.run(main())

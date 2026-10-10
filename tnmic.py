import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',f'--use-file-for-fake-audio-capture={D}/tools/a2plus4.wav','--autoplay-policy=no-user-gesture-required'])
    c=await b.new_context(viewport={'width':1280,'height':1000},permissions=['microphone']); pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#ac'); await pg.wait_for_timeout(900)
    await pg.select_option('#tn_inst','guitare'); await pg.wait_for_timeout(200)
    await pg.click('text=Activer le micro'); 
    for k in range(6):
      await pg.wait_for_timeout(700)
      print(await pg.inner_text('.tnbox'), '|', await pg.inner_text('.tnhz'))
    await pg.locator('.tnwrap').screenshot(path=f'{D}/qzshots/tuner_d.png')
    await pg.evaluate("openModule('mt')"); await pg.wait_for_timeout(300)
    await pg.click('.mtpre >> text=Croches'); await pg.click('.mtgo'); await pg.wait_for_timeout(1300)
    print('running', await pg.evaluate("MS.on"), await pg.inner_text('.mtbar'))
    await pg.locator('.mtwrap').screenshot(path=f'{D}/qzshots/metro_d.png')
    await pg.click('.mtgo'); print('stopped', await pg.evaluate("MS.on"), 'tuner off', await pg.evaluate("TS.on"))
    print(errs); await b.close()
asyncio.run(main())

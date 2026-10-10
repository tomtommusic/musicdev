import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',f'--use-file-for-fake-audio-capture={D}/tools/a2plus4.wav'])
    c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,color_scheme='dark',permissions=['microphone']); pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#ou'); await pg.wait_for_timeout(900)
    await pg.evaluate("TL.tab='metro';MOD.ou.show('metro')"); await pg.wait_for_timeout(300)
    await pg.screenshot(path=f'{D}/qzshots/metro_m.png',full_page=True)
    await pg.click('.tltabs >> text=Accordeur'); await pg.select_option('#tn_inst','ukulele'); await pg.click('text=Activer le micro'); await pg.wait_for_timeout(1500)
    await pg.screenshot(path=f'{D}/qzshots/tuner_m.png',full_page=True)
    print(errs); await b.close()
asyncio.run(main())

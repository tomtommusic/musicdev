import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',f'--use-file-for-fake-audio-capture={D}/tools/a2zero.wav'])
    c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark',permissions=['microphone']);pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#ac');await pg.wait_for_timeout(800)
    await pg.select_option('#tn_inst','chroma');await pg.select_option('#tn_tr','sib');await pg.click('text=Activer le micro');await pg.wait_for_timeout(1800)
    print((await pg.inner_text('.tnbox')).replace('\n',' '));await pg.locator('.tnwrap').screenshot(path=f'{D}/qzshots/wind.png')
    await pg.select_option('#tn_tr','ut');await pg.wait_for_timeout(1000);print((await pg.inner_text('.tnbox')).replace('\n',' '));print(errs);await b.close()
asyncio.run(main())

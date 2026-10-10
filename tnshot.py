import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def one(p,wav,out):
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',f'--use-file-for-fake-audio-capture={D}/tools/{wav}.wav'])
    c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark',permissions=['microphone']);pg=await c.new_page()
    await pg.goto('http://localhost:8790/index.html#ac');await pg.wait_for_timeout(800)
    await pg.select_option('#tn_inst','guitare');await pg.click('text=Activer le micro');await pg.wait_for_timeout(2000)
    await pg.locator('.tnpanel').screenshot(path=f'{D}/qzshots/{out}.png');await b.close()
async def main():
  async with async_playwright() as p:
    for w in ['a2zero','a2plus4','a2m12']: await one(p,w,'led_'+w)
asyncio.run(main())

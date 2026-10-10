import sys,asyncio
from playwright.async_api import async_playwright
D=sys.argv[1]
async def one(p,wav,inst,learner,out,wait=2200):
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',f'--use-file-for-fake-audio-capture={D}/tools/{wav}.wav'])
    c=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme='dark',permissions=['microphone']);pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#ac');await pg.wait_for_timeout(700)
    await pg.select_option('#tn_inst',inst)
    if learner!=await pg.is_checked('#tn_learn'): await pg.click('#tn_learn')
    await pg.click('text=Activer le micro');await pg.wait_for_timeout(wait)
    g=await pg.evaluate("document.querySelector('.tnguide')&&!document.querySelector('.tnguide').hidden?document.querySelector('.tnguide').innerText.replace(/\\n/g,' | '):''")
    print(out,'|',g,'| lock',await pg.evaluate("TS.lock"),'done',await pg.evaluate("[...TS.done]"),errs)
    await pg.locator('.tnpanel').screenshot(path=f'{D}/qzshots/{out}.png');await b.close()
async def main():
  async with async_playwright() as p:
    await one(p,'a2zero','guitare',True,'learn_danger')
    await one(p,'f2','guitare',True,'learn_high')
    await one(p,'e2','guitare',True,'learn_ok',3800)
    await one(p,'a2zero','guitare',False,'head_guitar')
    await one(p,'a2zero','banjo',False,'head_banjo',800)
    await one(p,'a2zero','ukulele',False,'head_uke',800)
asyncio.run(main())

import asyncio
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/tools/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required'])
    ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,permissions=['microphone'])
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#en');await pg.wait_for_timeout(800)
    await pg.locator('.rcstep').nth(3).click();await pg.locator('.rcstep').nth(2).click()
    print('bpm',await pg.evaluate("MT.bpm"),await pg.locator('.rctv').text_content(),await pg.locator('.rcbpm').text_content())
    await pg.click('.rcprev');await pg.wait_for_timeout(600);print('preview',await pg.evaluate("MS.on"),await pg.locator('.rcprev').text_content())
    await pg.click('.rcgo');await pg.wait_for_timeout(300);print('preview stopped by rec',await pg.evaluate("MS.on"),await pg.evaluate("[...document.querySelectorAll('.rcstep')].every(b=>b.disabled)"))
    await pg.wait_for_timeout(3500);await pg.click('.rcgo');await pg.wait_for_timeout(800)
    print('take',await pg.evaluate("!!RS.last"),await pg.locator('.rcprev').is_disabled())
    await pg.locator('.rctempo').screenshot(path=D+'rec_tempo.png')
    await pg.evaluate("openModule('mt')");await pg.wait_for_timeout(300);print('mt shows',await pg.locator('.mtbpm').text_content())
    await pg.evaluate("recDelete()");print(errs)
asyncio.run(main())

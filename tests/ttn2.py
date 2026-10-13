import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
    c=await b.new_context(permissions=['microphone'],viewport={'width':390,'height':844},device_scale_factor=2)
    await c.add_init_script("try{localStorage.setItem('atelier-tuner',JSON.stringify({inst:'basse4',learner:true,a4:440,tol:2,set:{}}))}catch(e){}")
    pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#ac');await pg.wait_for_timeout(800)
    await pg.evaluate("tunerStart()");await pg.wait_for_timeout(1500)
    g=lambda: pg.evaluate("[TS.on,TS.lock,document.querySelector('.tnguide b')?.textContent,document.querySelector('.tnmsg')?.textContent.slice(0,50)]")
    print(await g())
    # bouton « Corde suivante » doit répondre même micro actif
    for k in range(3):
      await pg.click("text=Corde suivante ›");await pg.wait_for_timeout(250);print('suivante',await g())
    await pg.click("text=‹ Corde précédente");await pg.wait_for_timeout(250);print('précédente',await g())
    await pg.click('.tnpeg[data-k="3"] .tnknob');await pg.wait_for_timeout(250);print('cheville 3',await g())
    await pg.screenshot(path='tn_m.png',full_page=True)
    # mode normal : chromatique
    await pg.evaluate("TN.learner=false;openModule('ac')");await pg.wait_for_timeout(300);await pg.evaluate("tunerStart()");await pg.wait_for_timeout(1200)
    print('normal',await pg.evaluate("[document.querySelector('.tnnote').textContent,document.querySelector('.tnhint')?.textContent.slice(0,40),document.querySelectorAll('.tnpeg.done').length]"),errs[:3])
    await b.close()
asyncio.run(main())

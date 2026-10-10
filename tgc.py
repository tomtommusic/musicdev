import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();c=await b.new_context(viewport={'width':1100,'height':900});
    await c.add_init_script("try{localStorage.setItem('atelier-lang','es')}catch(e){}")
    pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#gc');await pg.wait_for_timeout(800)
    for q in ['Sol7','F#m','Bbmaj7','xyz']:
      await pg.fill('.gcq',q);await pg.press('.gcq','Enter');await pg.wait_for_timeout(250)
      print(q,await pg.evaluate("[document.querySelector('.gcsym')?.textContent,document.querySelector('.gcname')?.textContent,document.querySelector('.gcmsg')?.textContent,document.querySelectorAll('.gccard').length,[...document.querySelectorAll('.gccap')].map(e=>e.textContent).join(' | ')]"))
    await pg.click('.gccard');await pg.wait_for_timeout(300)
    # ouvrir un autre module : les bulles d'accueil ne doivent pas rester
    await pg.evaluate("openModule('ho')");await pg.wait_for_timeout(300);n1=await pg.evaluate("document.querySelectorAll('.hotip').length")
    await pg.evaluate("openModule('dm')");await pg.wait_for_timeout(300);n2=await pg.evaluate("document.querySelectorAll('.hotip').length")
    print('tips',n1,n2,errs[:3])
    await b.close()
asyncio.run(main())

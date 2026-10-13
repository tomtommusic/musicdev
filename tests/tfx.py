import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required'])
    for L in ['fr','en']:
      c=await b.new_context(permissions=['microphone'],viewport={'width':1100,'height':900});await c.add_init_script(f"try{{localStorage.clear();localStorage.setItem('atelier-lang','{L}')}}catch(e){{}}")
      pg=await c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8790/index.html#pc');await pg.wait_for_timeout(800)
      print(L,'perc',await pg.evaluate("S.perc"),'liens méthode',await pg.evaluate("[...document.querySelectorAll('#method a.methl')].map(a=>a.textContent+'→'+a.dataset.lib)"))
      await pg.evaluate("document.querySelector('#method').open=true");await pg.click('#method a.methl');await pg.wait_for_timeout(400);print(' après clic',await pg.evaluate("[S.mod,S.lib.topic]"))
      await pg.evaluate("openModule('dm')");await pg.wait_for_timeout(300)
      await pg.evaluate("[...document.querySelectorAll('#toolbar button')].find(b=>/Mélodie|Melody|Melodía/.test(b.textContent)).click()");await pg.wait_for_timeout(300)
      print(' décompte dictée',await pg.evaluate("!document.getElementById('countin').hidden"),await pg.evaluate("document.getElementById('countin').textContent.slice(0,40)"))
      await pg.evaluate("stop()");await pg.evaluate("openModule('ln')");await pg.wait_for_timeout(300)
      await pg.evaluate("[...document.querySelectorAll('#toolbar button')].find(b=>/Commencer|Start|Empezar/.test(b.textContent)&&!b.hidden).click()");await pg.wait_for_timeout(300)
      await pg.evaluate("document.querySelectorAll('.names button')[0].click()");await pg.wait_for_timeout(1100)
      print(' série',await pg.evaluate("[S.st.i,S.st.paused,MOD.ln.pauseBtn.hidden,MOD.ln.pauseBtn.textContent]"))
      await pg.evaluate("MOD.ln.pauseBtn.click()");await pg.evaluate("document.querySelectorAll('.names button')[1].click()");await pg.wait_for_timeout(400)
      print(' pause',await pg.evaluate("[S.st.i,S.st.paused,MOD.ln.pauseBtn.textContent,document.getElementById('score').classList.contains('paused')]"))
      await pg.evaluate("MOD.ln.pauseBtn.click()");await pg.wait_for_timeout(200);print(' reprise',await pg.evaluate("[S.st.i,S.st.paused]"))
      # micro + métronome visuel en lecture à vue
      await pg.evaluate("openModule('lm')");await pg.wait_for_timeout(300)
      await pg.evaluate("S.mic=true");await pg.evaluate("openModule('lm')");await pg.wait_for_timeout(300)
      print(' boutons lm',await pg.evaluate("[...document.querySelectorAll('#toolbar button')].filter(b=>!b.hidden).map(b=>b.textContent.trim()).join(' | ')"))
      await pg.evaluate("[...document.querySelectorAll('#toolbar button')].find(b=>/Commencer|Start|Empezar/.test(b.textContent)&&!b.hidden).click()");await pg.wait_for_timeout(4500)
      print(' vbeat',await pg.evaluate("[MIC.on,!!document.getElementById('vbeat')]"),errs[:3])
      await c.close()
    await b.close()
asyncio.run(main())

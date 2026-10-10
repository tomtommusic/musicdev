import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--use-file-for-fake-audio-capture=/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/tools/a2zero.wav']); c=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,permissions=['microphone']); pg=await c.new_page()
    await pg.goto('http://localhost:8790/index.html#ac'); await pg.wait_for_timeout(700)
    await pg.select_option('#tn_inst','guitare'); await pg.click('#tn_learn') if not await pg.is_checked('#tn_learn') else None
    await pg.wait_for_timeout(300); await pg.click('text=Activer le micro'); await pg.wait_for_timeout(2000)
    r=await pg.evaluate("""()=>{const out=[];const W=390;document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>W+1)out.push([e.tagName,e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className,Math.round(r.width),Math.round(r.right)]);});return [document.documentElement.scrollWidth,W,out.slice(0,12)];}""")
    print(r); await b.close()
asyncio.run(main())

import asyncio,json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await (await b.new_context()).new_page()
    await pg.goto('http://localhost:8790/index.html'); await pg.wait_for_timeout(900)
    lib=await pg.evaluate("LIB.map(c=>({id:c.id,t:c.t,topics:c.topics.map(x=>({id:x.id,t:x.t,title:x.title||null,k:x.k||'',html:x.html,ex:(x.ex||[]).map(e=>({abc:e.abc,cap:e.cap||null}))}))}))")
    json.dump(lib,open('/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/i18n/lib_fr.json','w'),ensure_ascii=False,indent=1)
    print(len(lib),sum(len(c['topics']) for c in lib), sum(len(t['html']) for c in lib for t in c['topics']))
    await b.close()
asyncio.run(main())

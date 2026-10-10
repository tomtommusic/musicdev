import sys,asyncio,json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await (await b.new_context()).new_page()
    await pg.goto('http://localhost:8790/index.html#tq'); await pg.wait_for_timeout(800)
    r=await pg.evaluate("""(subs)=>{const out=[];for(const s of subs)for(const lv of [1,2,3])for(let k=0;k<6;k++){const q=QZG[s](lv,['mc','short','staff']);if(!q)continue;
      out.push(`${s} L${lv} [${q.fmt}] ${q.prompt}${q.abc?'  ABC:'+q.abc.split('\\n').slice(-2).join(' / '):''}${q.opts?'  OPTS: '+q.opts.map((o,i)=>(i===q.ans?'*':'')+(o.t||o.lab||'abc')).join(' | '):''}  => ${q.answerText}`);}return out;}""",sys.argv[1].split(','))
    print('\n'.join(r)); await b.close()
asyncio.run(main())

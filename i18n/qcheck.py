import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2);await ctx.add_init_script("localStorage.setItem('atelier-lang','en')")
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#tq');await pg.wait_for_timeout(800)
    r=await pg.evaluate("""()=>{const out=[];for(let s=1;s<40;s++){const qs=qzBuild({...S.cfg.tq,topics:['l_sol','l_fa','g_rel','g_deg','i_dt','r_fig','g_min','t_tem'],n:20,level:2},s,{});for(const q of qs){if(q.fmt!=='short')continue;const t=T(q.answerText.replace(/\\s*\\(.*\\)$/,''));out.push([q.sub,q.answerText,t,q.check(t)]);}}return out;}""")
    bad=[x for x in r if not x[3]];print(len(r),'bad',len(bad));[print(x) for x in bad[:15]]
    print([x for x in r if x[0]=='l_sol'][:3])
    print(errs)
asyncio.run(main())

import asyncio
from playwright.async_api import async_playwright
JS=r"""
async()=>{
  openModule('lr');await new Promise(r=>setTimeout(r,300));
  A.init();await A.ctx.resume();
  // faux micro : le clic revient au micro 80 ms après, à un volume modeste; une frappe forte quand on la programme
  const claps=[];window.__claps=claps;
  MIC.on=true;MIC.mode='onset';MIC.clk=[];MIC.bleed=0;MIC.floor=.003;MIC.prevRms=0;MIC.lastOn=0;
  const got=[];MIC.onEvent=e=>got.push(+(e.t).toFixed(3));MIC.onLive=null;MIC.buf=new Float32Array(2048);
  MIC.an={getFloatTimeDomainData:x=>{const now=A.ctx.currentTime;let a=.0015;
    for(const k of MIC.clk){const d=now-(k.t+.08);if(d>=0&&d<.045)a=Math.max(a,.06);}
    for(const t of claps){const d=now-t;if(d>=0&&d<.06)a=Math.max(a,.3);}
    for(let i=0;i<x.length;i++)x[i]=(Math.random()*2-1)*a*1.7;}};
  MIC.timer=setInterval(micTick,12);
  const t0=A.ctx.currentTime+.2,us=.5;
  // décompte 4 clics, puis 8 clics; frappes sur les clics 5,6,8 et une entre 9 et 10
  for(let b=0;b<12;b++)A.click(t0+b*us,b%4===0,null,b<4);
  [4,5,7].forEach(b=>claps.push(t0+b*us+.08));claps.push(t0+9.5*us+.08);
  await new Promise(r=>setTimeout(r,(12*us+.6)*1000));clearInterval(MIC.timer);MIC.on=false;
  return {got:got.map(t=>+((t-t0)/us).toFixed(2)),bleed:MIC.bleed};
}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=await b.new_page()
    await pg.goto('http://localhost:8790/index.html');await pg.wait_for_timeout(800)
    print(await pg.evaluate(JS));await b.close()
asyncio.run(main())

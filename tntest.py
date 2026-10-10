import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await (await b.new_context()).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8790/index.html#ou'); await pg.wait_for_timeout(900)
    r=await pg.evaluate("""()=>{
      const sr=48000,out=[];
      const gen=(f,N,ph=0)=>{const x=new Float32Array(N);for(let i=0;i<N;i++){const t=i/sr;let v=0;for(let h=1;h<=8;h++)v+=Math.sin(2*Math.PI*f*h*t+ph*h)/(h*1.3)*(h===1?.6:1);x[i]=.2*v+(Math.random()-.5)*.004;}return x;};
      const tests=[[23,'B0'],[28,'E1'],[33,'A1'],[40,'E2'],[45,'A2'],[50,'D3'],[55,'G3'],[59,'B3'],[64,'E4'],[67,'G4'],[69,'A4'],[76,'E5'],[88,'E6']];
      for(const[m,nm] of tests)for(const dc of [-7,-1.5,0,2.4,6]){
        const f=440*Math.pow(2,(m-69+dc/100)/12);const fmin=Math.min(27,f*.7),fmax=Math.max(2100,f*1.5);
        const need=Math.min(4096,Math.max(2048,Math.pow(2,Math.ceil(Math.log2(sr/(f*.7)*2.2)))));
        const ests=[];for(let k=0;k<5;k++){const res=tnDetect(gen(f,need,k*.7),sr,f*.7,f*1.45);if(res.f)ests.push(1200*Math.log2(res.f/f));}
        ests.sort((a,b)=>a-b);const med=ests[ests.length>>1];
        out.push([nm,dc,ests.length,med==null?null:+med.toFixed(3)]);
      }
      const t0=performance.now();const x=gen(41.2,4096);for(let k=0;k<20;k++)tnDetect(x,sr,28,120);const ms=(performance.now()-t0)/20;
      return {out,ms};}""")
    worst=max(abs(x[3]) for x in r['out'] if x[3] is not None)
    print('worst error (cents)',worst,'| ms/frame bass',round(r['ms'],2))
    for x in r['out']:
      if x[3] is None or abs(x[3])>0.3: print(x)
    print(errs); await b.close()
asyncio.run(main())

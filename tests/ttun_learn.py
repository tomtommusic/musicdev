import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8792/index.html');await pg.wait_for_timeout(800)
    print(await pg.evaluate("Object.entries(TUNINGS).map(([k,v])=>k+':'+(v.notes||[]).join(',')).join(' | ')"))
    r=await pg.evaluate("""()=>{const sr=48000,N=8192,out={};TS.gate=.0005;
      const synth=(f,weakF)=>{const x=new Float32Array(N);const H=[1,.7,.5,.4,.3,.25,.2,.15];for(let h=1;h<=8;h++){const a=H[h-1]*(h===1&&weakF?.15:1),ph=Math.random()*6.28;for(let i=0;i<N;i++)x[i]+=a*.05*Math.sin(2*Math.PI*f*h*i/sr+ph)*Math.exp(-i/sr*1.5);}return x;};
      for(const inst of Object.keys(TUNINGS)){TN.inst=inst;TN.learner=true;const s=tnStrings();if(!s)continue;const[fmin,fmax]=tnRange();const rows=[];
        for(let k=0;k<s.notes.length;k++){TS.lock=k;const bad=[];
          for(let c=-300;c<=1050;c+=50){for(const weak of [false,true]){const f=midiHz(s.notes[k])*2**(c/1200),r=tnDetect(synth(f,weak),sr,fmin,fmax);if(!r.f){bad.push(c+(weak?'w':'')+':none');continue;}
            const tg=tnTarget(r.f);if(Math.sign(Math.round(tg.cents/10))!==Math.sign(c)||Math.abs(tg.cents-c)>30)bad.push(c+(weak?'w':'')+'→'+Math.round(tg.cents));}}
          rows.push('corde'+k+'['+bad.join(' ')+']');}
        out[inst]=rows.join(' ');}
      return out;}""")
    for k,v in r.items(): print(k,':',v[:700])
    print(errs[:3]);await b.close()
asyncio.run(main())

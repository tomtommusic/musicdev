import sys,asyncio,json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    c=await b.new_context(viewport={'width':1280,'height':900})
    pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append('console:'+m.text))
    await pg.goto('http://localhost:8790/index.html#tq'); await pg.wait_for_timeout(1000)
    r=await pg.evaluate("""()=>{
      const out={n:0,bad:[],fmt:{},subs:{}};
      for(const lv of [1,2,3]) for(const s of QZ_ALL_SUBS) for(const fm of [['mc'],['short'],['staff'],['mc','short','staff']]) for(let k=0;k<12;k++){
        let q;try{q=QZG[s](lv,fm);}catch(e){out.bad.push([s,lv,fm.join(),'THROW '+e.message]);continue;}
        if(!q)continue;out.n++;out.fmt[q.fmt]=(out.fmt[q.fmt]||0)+1;out.subs[s]=(out.subs[s]||0)+1;
        const tag=[s,lv,q.fmt,q.prompt];
        if(!q.prompt)out.bad.push([...tag,'no prompt']);
        if(!q.answerText)out.bad.push([...tag,'no answerText']);
        if(q.opts){if(q.opts.length<2)out.bad.push([...tag,'opts<2']);if(!q.check(q.ans))out.bad.push([...tag,'mc check']);
          const labs=q.opts.map(o=>(o.t||'')+'|'+(o.abc||''));if(new Set(labs).size!==labs.length)out.bad.push([...tag,'dup opts']);
          if(q.opts.some((o,i)=>i!==q.ans&&q.check(i)))out.bad.push([...tag,'multi ok']);}
        else if(q.fields){if(!q.check(q.fans))out.bad.push([...tag,'fields check']);}
        else if(q.pad){if(!q.check(q.pad.answer))out.bad.push([...tag,'pad check',JSON.stringify(q.pad.answer)]);}
        else if(q.rhy){}
        else if(q.fmt==='short'){const t=q.answerText.replace(/\\s*\\(.*\\)$/,'');if(!q.check(t))out.bad.push([...tag,'short check',q.answerText]);}
        if(/undefined|NaN|null/.test(q.prompt+q.answerText+(q.opts||[]).map(o=>(o.t||'')+(o.lab||'')).join()))out.bad.push([...tag,'undefined text',q.answerText,(q.opts||[]).map(o=>o.t).join('/')]);
        if(q.opts&&q.opts.some(o=>/𝄪|𝄫/.test(o.t||'')))out.bad.push([...tag,'double acc',(q.opts||[]).map(o=>o.t).join('/')]);
      }
      return out;}""")
    print('questions',r['n'],r['fmt']); print('per sub',r['subs'])
    for x in r['bad'][:60]: print('BAD',x)
    print('nbad',len(r['bad']))
    print('errs',errs[:10])
    await b.close()
asyncio.run(main())

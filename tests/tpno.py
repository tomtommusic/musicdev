from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']);pg=b.new_page()
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8790/');pg.wait_for_timeout(500)
    pg.evaluate("A.init()");pg.wait_for_timeout(3000)
    r=pg.evaluate("""async()=>{const out={n:Object.keys(A.smp.buf).length,offs:Object.values(A.smp.buf).slice(0,5).map(s=>s.off.toFixed(4))};
      for(const m of [36,48,60,61,72,84,96]){const res={};
        for(const fn of ['piano','pianoSynth']){const oc=new OfflineAudioContext(1,44100*1.5,44100),sv=A.ctx;A.ctx=oc;A[fn](m,0,1,.45,oc.destination);A.ctx=sv;
          const buf=await oc.startRendering(),d=buf.getChannelData(0);let s=0,pk=0,on=-1;for(let i=0;i<22050;i++){s+=d[i]*d[i];pk=Math.max(pk,Math.abs(d[i]));}
          for(let i=0;i<d.length;i++)if(Math.abs(d[i])>.01){on=i;break;}
          res[fn]=[Math.sqrt(s/22050).toFixed(3),pk.toFixed(2),(on/44.1).toFixed(1)+'ms'];}
        out[m]=res;}
      return out;}""")
    import json;print(json.dumps(r),errs)
    b.close()

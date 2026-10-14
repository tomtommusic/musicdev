from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg=b.new_page(viewport={'width':390,'height':850});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:print('console',m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8790/');pg.wait_for_timeout(500);pg.evaluate("openModule('en')");pg.wait_for_timeout(400)
    r=pg.evaluate("""async()=>{const mk=(secs)=>{const sr=48000,n=sr*secs,x=new Float32Array(n);let ph=0;
        for(let i=0;i<n;i++){const t=i/sr,ph8=t%4,on=ph8<3,env=on?.08*(1+.7*Math.sin(2*Math.PI*.7*t)):0;
          const f0=180+40*Math.sin(2*Math.PI*.3*t);ph+=2*Math.PI*f0/sr;
          let v=env*(Math.sin(ph)+.6*Math.sin(2*ph)+.4*Math.sin(3*ph)+.25*Math.sin(5*ph)+.15*Math.sin(9*ph));
          if(on&&(t%1)<.08)v+=.05*(Math.random()*2-1); /* « s » */
          v+=.0015*(Math.random()*2-1)+.02*Math.sin(2*Math.PI*60*t)*0; x[i]=v;}
        return mstWav([x],sr);};
      const out={};
      for(const [st,it,room] of [['equilibre','moyen',false],['chaud','leger',false],['brillant','fort',true]]){const blob=mk(12);const t0=performance.now();
        const w=await mstProcess(blob,st,it,{room});const buf=await mstDecode(w);const d=[];for(let c=0;c<buf.numberOfChannels;c++)d.push(buf.getChannelData(c));let pk=0;for(const x of d)for(const v of x)pk=Math.max(pk,Math.abs(v));
        out[st+'/'+it+(room?'/salle':'')]=[MS2.before.toFixed(1),MS2.after.toFixed(1),(20*Math.log10(pk)).toFixed(2)+' dB',buf.numberOfChannels+'ch',Math.round(performance.now()-t0)+'ms',JSON.stringify(MS2.eq)];}
      const big=mk(180);const t0=performance.now();await mstProcess(big,'equilibre','moyen',{});out['3 min']=Math.round(performance.now()-t0)+'ms';
      return out;}""")
    for k,v in r.items():print(k,v)
    print(errs);b.close()

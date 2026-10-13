from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg=b.new_page(viewport={'width':390,'height':850});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8790/');pg.wait_for_timeout(500);pg.evaluate("openModule('en')");pg.wait_for_timeout(400)
    # synthetic take: voice-like signal with pumping, 8 s
    r=pg.evaluate("""async()=>{const sr=44100,n=sr*8,ch=[new Float32Array(n)];for(let i=0;i<n;i++){const t=i/sr;const env=.15*(1+.8*Math.sin(2*Math.PI*.5*t))*(Math.sin(2*Math.PI*3*t)>-.3?1:.05);ch[0][i]=env*(Math.sin(2*Math.PI*220*t)+.5*Math.sin(2*Math.PI*440*t)+.3*Math.sin(2*Math.PI*1800*t)+.05*(Math.random()*2-1));}
      const blob=mstWav(ch,sr);RS.last={blob,type:'audio/wav',ext:'wav',dur:8,date:Date.now(),name:'test'};recShow();
      const out={};for(const st of ['chaud','equilibre','brillant'])for(const it of ['leger','moyen','fort']){const t0=performance.now();const w=await mstProcess(blob,st,it);const buf=await mstDecode(w);const d=[];for(let c=0;c<buf.numberOfChannels;c++)d.push(buf.getChannelData(c));let pk=0;for(const x of d)for(const v of x)pk=Math.max(pk,Math.abs(v));
        out[st+'/'+it]=[mstLoud(d,buf.sampleRate).toFixed(1),(20*Math.log10(pk)).toFixed(2),Math.round(performance.now()-t0)+'ms'];}
      return out;}""")
    for k,v in r.items():print(k,v)
    pg.click('text=Appliquer le mastering');pg.wait_for_timeout(2500)
    print(pg.evaluate("[!!RS.last.orig,RS.last.mst&&RS.last.mst.style,document.querySelector('.mstdone')?.innerText]"))
    pg.click('text=Original');pg.wait_for_timeout(300);print('A/B',pg.evaluate("RS.last.useOrig"))
    pg.locator('.rctake').screenshot(path='mst_390.png')
    pg.click('text=Retirer le mastering');pg.wait_for_timeout(500);print('retiré',pg.evaluate("[!!RS.last.orig,RS.last.ext]"),errs)
    b.close()

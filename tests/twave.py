from playwright.sync_api import sync_playwright
import sys
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page();pg.goto('http://localhost:8790/');pg.wait_for_timeout(600)
    r=pg.evaluate("""async()=>{const sr=48000,n=sr*12,x=new Float32Array(n);let ph=0;
      /* phrases de 1,5 s à niveau constant (deux niveaux : fort / doux), 0,5 s de souffle entre */
      for(let i=0;i<n;i++){const t=i/sr,c=t%2,on=c<1.5,amp=on?(Math.floor(t/2)%2?0.04:0.12):0;ph+=2*Math.PI*220/sr;
        x[i]=amp*(Math.sin(ph)+.5*Math.sin(2*ph)+.3*Math.sin(3*ph)+.2*Math.sin(5*ph))+.002*(Math.random()*2-1);}
      const env=(d,sr)=>{const H=Math.round(sr*.05),o=[];for(let s=0;s+H<=d.length;s+=H){let e=0;for(let i=s;i<s+H;i++)e+=d[i]*d[i];o.push(10*Math.log10(e/H+1e-12));}return o;};
      const meas=async(blob)=>{const buf=await mstDecode(blob),d=buf.getChannelData(0),E=env(d,buf.sampleRate);
        let wob=0,gapv=[],ph=[];for(let k=0;k<6;k++){const a=Math.round((k*2+.2)/.05),b=Math.round((k*2+1.3)/.05);const seg=E.slice(a,b);wob=Math.max(wob,Math.max(...seg)-Math.min(...seg));ph.push(seg.reduce((s,v)=>s+v,0)/seg.length);
          const g=E.slice(Math.round((k*2+1.6)/.05),Math.round((k*2+1.9)/.05));gapv.push(g.reduce((s,v)=>s+v,0)/g.length);}
        const loud=ph.filter((v,i)=>i%2==0),soft=ph.filter((v,i)=>i%2==1);
        return {wobble_dB:wob.toFixed(1),loud_minus_soft:(loud.reduce((a,b)=>a+b)/3-soft.reduce((a,b)=>a+b)/3).toFixed(1),gap_spread:(Math.max(...gapv)-Math.min(...gapv)).toFixed(1),phrase_to_gap:(ph.reduce((a,b)=>a+b)/6-gapv.reduce((a,b)=>a+b)/6).toFixed(1)};};
      const blob=mstWav([x],sr);const out={orig:await meas(blob)};
      const lv=await recLevel(blob);out.leveler=await meas(lv);
      for(const it of ['leger','moyen','fort'])out['mst_'+it]=await meas(await mstProcess(lv,'equilibre',it,{}));
      return out;}""")
    for k,v in r.items():print(k,v)
    b.close()

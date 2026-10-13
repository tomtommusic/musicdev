import asyncio
from playwright.async_api import async_playwright
JS=r"""async()=>{
 const sr=44100,n=sr*6,x=new Float32Array(n);
 for(let i=0;i<n;i++){const t=i/sr,pump=.25+.75*(.5+.5*Math.sin(2*Math.PI*1.2*t));x[i]=.3*pump*Math.sin(2*Math.PI*220*t);}
 const ab=new ArrayBuffer(44+n*2),v=new DataView(ab),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
 w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
 for(let i=0;i<n;i++)v.setInt16(44+i*2,x[i]*32767,true);
 const out=await recLevel(new Blob([ab],{type:'audio/wav'}));
 const c=A.init();const b=await c.decodeAudioData(await out.arrayBuffer());const y=b.getChannelData(0);
 const env=a=>{const F=Math.round(b.sampleRate*.05),r=[];for(let f=10;f<a.length/F-10;f++){let s=0;for(let i=f*F;i<(f+1)*F;i++)s+=a[i]*a[i];r.push(Math.sqrt(s/F));}const mx=Math.max(...r),mn=Math.min(...r);return (20*Math.log10(mx/mn)).toFixed(1)+' dB';};
 return ['avant',env(x),'après',env(y),out.size];
}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();await pg.goto('http://localhost:8790/index.html#en');await pg.wait_for_timeout(700)
    print(await pg.evaluate(JS));await b.close()
asyncio.run(main())

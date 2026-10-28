import asyncio,json
from playwright.async_api import async_playwright
JS=r'''()=>{const names=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];const res=[];
 const keys={major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10]};
 const grids=[['major','C | Am | F | G'],['major','C | F | G | C'],['major','Dm7 | G7 | Cmaj7 | Cmaj7'],['major','Cmaj7 | Am7 | Dm7 | G7'],['major','C | Em | F | G | Am | Dm | G | C'],['major','Fmaj7 | Em7 | Dm7 | Cmaj7'],
  ['minor','Am | Dm | Em | Am'],['minor','Am | F | C | G'],['minor','Am7 | Dm7 | Em7 | Am7'],['major','Gsus4 | G | Csus2 | C'],['major','C5 | F5 | G5 | C5'],['major','Bm7b5 | E7 | Am | Am']];
 for(const[sk,sv]of Object.entries(BA_STYLES))for(const[mk,st0]of Object.entries(sv.v))for(const I of [1,2,3]){BA_S.style=sk;BA_S.meter=mk;BA_S.tr=0;const st=baArr(st0,I,sk);
  const spb=st.m*st.sub;
  for(const[kt,g]of grids){const key=keys[kt].map(x=>(x+(kt==='minor'?9:0))%12);const bars=baGrid(g).bars;
   for(let rep=0;rep<30;rep++){let wl=null,wch=null,wprev=null;
   for(let bi=0;bi<bars.length;bi++){const bar=bars[bi],n=bar.length,per=spb/n;
    for(let step=0;step<spb;step++){const ci=Math.floor(step/per),ch=bar[ci],nextCh=ci+1<n?bar[ci+1]:bars[(bi+1)%bars.length][0],chStart=step%per===0;
     const tones=ch.iv.map(x=>(ch.root+x)%12),ok=new Set([...tones,...key]);
     const chk=(m,what)=>{const pc=((m%12)+12)%12;
       const diat=!/b5|E7/.test(g);   /* grilles diatoniques : tout doit être dans la tonalité ou l'accord */
       const bad=diat?!ok.has(pc):!(tones.includes(pc)||baScale(ch).map(x=>(ch.root+x)%12).includes(pc));
       if(bad)res.push(`${sk} ${mk} | ${g} | ${ch.tok} : ${what} ${names[pc]}`);};
     for(const[pos,deg]of st.bs){if(pos!==step)continue;let m;
      if(deg==='W'){if(chStart||!wl){const same=wch&&wch.root===ch.root&&wch.q===ch.q;wl=baWalk(ch,nextCh,Math.max(1,Math.round(per/st.sub)),wprev,same);wch=ch;}
       const k=Math.floor((step%per)/st.sub);m=wl[Math.min(k,wl.length-1)]+12;wprev=m-12;}
      else m=baBassNote(ch,st.alt&&deg==='R'&&bi%2===1?'5':deg,nextCh);chk(m,'basse('+deg+')');}
     if(st.ar)for(const[pos,deg]of st.ar){if(pos!==step)continue;const R0=48+ch.root,f5=baF5(ch),th=baTh(ch);const m=deg==='R'?R0:deg==='5'?R0+f5:deg==='8'?R0+12:R0+12+th;chk(m,'arpège');}
     else if(st.cp)for(const[pos]of st.cp){if(pos!==step)continue;let notes=baVoice(ch);
      if(st.shell){const r=ch.root;const th=baTh(ch),sv=ch.iv.includes(11)?11:ch.iv.includes(10)?10:ch.iv.includes(9)?9:7;notes=[48+((r+th)%12),48+((r+sv)%12)];}
      if(st.pw){const b=48+ch.root;notes=[b,b+baF5(ch),b+12];}
      notes.forEach(m=>{if(!tones.includes(((m%12)+12)%12))res.push(`${sk} ${mk} | ${g} | ${ch.tok} : piano hors accord ${names[m%12]}`);});}
   }}}}}
 const u={};res.forEach(x=>u[x]=(u[x]||0)+1);return Object.entries(u).sort((a,b)=>b[1]-a[1]);}'''
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8791/index.html');await pg.wait_for_timeout(800)
    r=await pg.evaluate(JS);print(len(r));[print(n,x) for x,n in r[:60]];print(errs);await b.close()
asyncio.run(main())

import sys,asyncio,json,base64
from playwright.async_api import async_playwright
D=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    c=await b.new_context(viewport={'width':1280,'height':900},accept_downloads=True)
    pg=await c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append('console:'+m.text))
    await pg.goto('http://localhost:8790/index.html#tq'); await pg.wait_for_timeout(1200)
    await pg.evaluate("localStorage.removeItem('atelier-quiz')")
    await pg.reload(); await pg.wait_for_timeout(1000)
    await pg.screenshot(path=f'{D}/qzshots/start.png',full_page=True)
    # all topics, 20 questions, level 2
    await pg.evaluate("""()=>{S.cfg.tq.topics=QZ_ALL_SUBS.slice();S.cfg.tq.n=40;S.cfg.tq.level=2;newEx();}""")
    await pg.wait_for_timeout(300)
    await pg.click('text=Commencer le questionnaire'); await pg.wait_for_timeout(600)
    n=await pg.evaluate("QZ.test.qs.length"); print('n',n)
    kinds=await pg.evaluate("QZ.test.qs.map(q=>q.sub+':'+q.fmt+(q.pad?':'+q.pad.mode:'')+(q.rhy?':rhy':'')+(q.fields?':fields':''))"); print(kinds)
    shots=0;seen=set()
    for i in range(n):
      info=await pg.evaluate(f"(()=>{{const q=QZ.test.qs[{i}];return {{fmt:q.fmt,pad:!!q.pad,rhy:!!q.rhy,fields:!!q.fields,opts:q.opts?q.opts.length:0,ans:q.ans,sub:q.sub}}}})()")
      key=(info['fmt'],info['pad'],info['rhy'],info['fields'])
      # answer: correct for even i, wrong/partial for odd
      good=i%2==0
      if info['opts']:
        k=info['ans'] if good else (info['ans']+1)%info['opts']
        await pg.locator('.qzopt').nth(k).click()
      elif info['fields']:
        vals=await pg.evaluate(f"QZ.test.qs[{i}].fans")
        sels=pg.locator('.qzsel')
        for j,v in enumerate(vals):
          await sels.nth(j).select_option(v if good else (await sels.nth(j).locator('option').nth(1).get_attribute('value')))
      elif info['pad']:
        # click on staff at some height: use answer if good via evaluate (simulate clicks at computed positions is complex) -> click middle line then set resp
        st=pg.locator('.qzpad'); bb=await st.bounding_box()
        await pg.mouse.click(bb['x']+bb['width']*0.7,bb['y']+bb['height']/2)
        if good: await pg.evaluate(f"(()=>{{const q=QZ.test.qs[{i}];QZ.test.resp[{i}]=q.pad.answer.map(n=>({{L:n.L,oct:n.oct,alt:n.alt}}));qzSave();}})()")
      elif info['rhy']:
        st=pg.locator('.qzrhy .edstaff'); bb=await st.bounding_box()
        await pg.mouse.click(bb['x']+bb['width']*0.8,bb['y']+bb['height']/2)
      else:
        ans=await pg.evaluate(f"QZ.test.qs[{i}].answerText.replace(/\\s*\\(.*\\)$/,'')")
        await pg.fill('.qzshort',ans if good else 'xyz')
      if key not in seen:
        seen.add(key); shots+=1
        await pg.locator('.qzwrap').screenshot(path=f'{D}/qzshots/q{shots}_{info["sub"]}.png')
      if i<n-1: await pg.click('.qznav >> text=Suivante ›')
      await pg.wait_for_timeout(120)
    await pg.click('text=Terminer et voir mon résultat'); await pg.wait_for_timeout(600)
    if await pg.locator('.qzconfirm').count():
      await pg.locator('.qzconfirm').screenshot(path=f'{D}/qzshots/confirm.png'); await pg.click('text=Terminer quand même'); await pg.wait_for_timeout(600)
    print('score',await pg.evaluate("qzScore(QZ.test)"), 'resp nulls', await pg.evaluate("QZ.test.resp.map((r,i)=>r==null?QZ.test.qs[i].sub+':'+i:null).filter(Boolean)"))
    await pg.screenshot(path=f'{D}/qzshots/result.png',full_page=True)
    # PDF result
    await pg.click('text=Créer le PDF de mes résultats'); await pg.wait_for_selector('.qzpdfready',timeout=60000)
    href=await pg.get_attribute('.qzpdfready a','href')
    data=await pg.evaluate("async(u)=>{const b=await (await fetch(u)).arrayBuffer();let s='';const a=new Uint8Array(b);for(let i=0;i<a.length;i+=32768)s+=String.fromCharCode(...a.subarray(i,i+32768));return btoa(s);}",href)
    open(f'{D}/qzshots/result.pdf','wb').write(base64.b64decode(data))
    # review a question
    await pg.click('text=Revoir mes réponses'); await pg.wait_for_timeout(500)
    await pg.locator('.qzwrap').screenshot(path=f'{D}/qzshots/review1.png')
    await pg.evaluate("qzGo(1)"); await pg.wait_for_timeout(500)
    await pg.locator('.qzwrap').screenshot(path=f'{D}/qzshots/review2.png')
    # teacher PDF
    await pg.evaluate("QZ.view='start';qzRender()"); await pg.wait_for_timeout(300)
    await pg.evaluate("S.cfg.tq.n=25"); 
    await pg.click('text=Créer le PDF (questionnaire + corrigé)'); await pg.wait_for_selector('.qzteach .qzpdfready',timeout=60000)
    href=await pg.get_attribute('.qzteach .qzpdfready a','href')
    data=await pg.evaluate("async(u)=>{const b=await (await fetch(u)).arrayBuffer();let s='';const a=new Uint8Array(b);for(let i=0;i<a.length;i+=32768)s+=String.fromCharCode(...a.subarray(i,i+32768));return btoa(s);}",href)
    open(f'{D}/qzshots/blank.pdf','wb').write(base64.b64decode(data))
    print('errs',errs[:10])
    await b.close()
asyncio.run(main())

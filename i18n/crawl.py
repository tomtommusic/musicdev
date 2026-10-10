import asyncio, json, sys, re
from playwright.async_api import async_playwright
L = sys.argv[1] if len(sys.argv) > 1 else 'en'
OUT = sys.argv[2] if len(sys.argv) > 2 else f'/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/i18n/left_{L}.json'
JS = r"""
() => {
  const out=new Set();const vis=e=>{for(let x=e;x&&x!==document.body;x=x.parentElement){if(x.hidden)return false;const cs=getComputedStyle(x);if(cs.display==='none'||cs.visibility==='hidden')return false;}return true;};
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n;
  const FRX=FRXRE;const bad=v=>/[A-Za-zÀ-ÿ]{3}/.test(v)&&FRX.test(v)&&T(v)===v;
  while((n=w.nextNode())){
    if(n.nodeType===1){if(n.matches('script,style')||n.closest('[data-notr]'))continue;for(const a of['placeholder','title','aria-label']){const v=n.getAttribute(a);const st=n['__tr_'+a];const fr=st?st.fr:v;if(v&&v===fr&&bad(v))out.add('@'+a+': '+v);}continue;}
    const p=n.parentElement;if(!p||p.closest('script,style,[data-notr],.abcjs-container'))continue;
    const st=TR_SEEN.get(n);const t=n.nodeValue.trim();if(!t)continue;
    if((!st||st.out===st.fr)&&bad(t)&&vis(p))out.add(t);}
  return [...out];
}
""".replace('FRXRE', r"/[èêàâçùûôîœ]|\b[ldjnqst]'[a-zà-ÿ]|\b(le|les|des|du|une|est|et|pour|avec|sur|dans|ta|ton|tes|ou|pas|au|aux|qui|mesures?|croches?|doubles?|aucune?|tous|toutes|montant|descendant|rapide|lent|aigu|suraigu|noires?|blanches?|rondes?|Partition|Réussites|Explications|clé|réglages?|écoute|Écoute|réponse|Réponse|Modules|Clique|Touche|Choisis|Joue|Ajoute|Partage|Créer|Voir|Recommencer)\b" + ("|[é]|\\b(la|de|en|que|un|grave|note|notes|Tempo)\\b" if L=='en' else "") + "/i")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1200, 'height': 900})
        await ctx.add_init_script(f"try{{localStorage.setItem('atelier-lang','{L}')}}catch(e){{}}")
        pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:8790/index.html'); await pg.wait_for_timeout(900)
        left = {}
        def add(where, items):
            for t in items: left.setdefault(t, where)
        mods = await pg.evaluate("MODS.map(m=>m.id)")
        for m in mods:
            await pg.evaluate(f"openModule('{m}')"); await pg.wait_for_timeout(300)
            add(m, await pg.evaluate(JS))
            await pg.evaluate("document.getElementById('setbtn').click()"); await pg.wait_for_timeout(200)
            add(m + ':set', await pg.evaluate(JS))
            await pg.evaluate("document.getElementById('setbtn').click()")
            for k in range(3):
                try:
                    await pg.evaluate("(()=>{const b=[...document.querySelectorAll('#toolbar button.primary, .qz button.primary')][0];if(b)b.click();})()")
                except Exception: pass
                await pg.wait_for_timeout(250); add(m + ':new', await pg.evaluate(JS))
        CF = """(fr)=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const st=TR_SEEN.get(n);const t=(st?st.fr:n.nodeValue).trim();if(t===fr){const b=n.parentElement.closest('button,a');if(b){b.click();return true;}}}return false;}"""
        await pg.evaluate("localStorage.removeItem('atelier-quiz')")
        await pg.goto('http://localhost:8790/index.html#tq'); await pg.evaluate("localStorage.removeItem('atelier-quiz')"); await pg.reload(); await pg.wait_for_timeout(900)
        await pg.evaluate("()=>{S.cfg.tq.topics=QZ_ALL_SUBS.slice();S.cfg.tq.n=60;S.cfg.tq.level=3;S.cfg.tq.listen=true;newEx();}"); await pg.wait_for_timeout(300)
        add('tq:cfg', await pg.evaluate(JS))
        print('start', await pg.evaluate(CF, 'Commencer le questionnaire'), await pg.evaluate('QZ.test?QZ.test.qs.length:0')); await pg.wait_for_timeout(500)
        n = await pg.evaluate("QZ.test?QZ.test.qs.length:0")
        for i in range(n):
            add(f'tq:q{i}', await pg.evaluate(JS))
            await pg.evaluate(f"""()=>{{const q=QZ.test.qs[{i}];const o=document.querySelectorAll('.qzopt');if(o.length){{o[(q.ans+{i}%2)%o.length].click();return;}}const s=document.querySelector('.qzshort');if(s){{s.value='xyz';s.dispatchEvent(new Event('input',{{bubbles:true}}));}}}}""")
            await pg.wait_for_timeout(80); add(f'tq:q{i}a', await pg.evaluate(JS))
            if i < n-1: await pg.evaluate(CF, 'Suivante ›'); await pg.wait_for_timeout(80)
        await pg.evaluate(CF, 'Terminer et voir mon résultat'); await pg.wait_for_timeout(400)
        add('tq:confirm', await pg.evaluate(JS))
        await pg.evaluate(CF, 'Terminer quand même'); await pg.wait_for_timeout(500)
        add('tq:result', await pg.evaluate(JS))
        await pg.evaluate(CF, 'Revoir mes réponses'); await pg.wait_for_timeout(400)
        add('tq:review', await pg.evaluate(JS))
        # bibliothèque : chaque notion
        ids = await pg.evaluate("LIB_ORDER")
        for t in ids:
            await pg.evaluate(f"S.lib.topic='{t}';openModule('bt')"); await pg.wait_for_timeout(120)
            add('bt:' + t, await pg.evaluate(JS))
        json.dump(left, open(OUT, 'w'), ensure_ascii=False, indent=0)
        print(L, 'left', len(left), 'errors', errs[:5])
        await b.close()
asyncio.run(main())

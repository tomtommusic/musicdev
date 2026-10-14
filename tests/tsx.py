from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for scheme,w in [('light',1200),('dark',390)]:
        ctx=b.new_context(viewport={'width':w,'height':900},color_scheme=scheme);pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/index.html#dg');pg.wait_for_timeout(700)
        for m in [70,86]:
            pg.evaluate(f"DG.inst='asax';DG.sel['asax']={m};dgRender()");pg.wait_for_timeout(400)
            pg.locator('.dgdet').screenshot(path=f'sx_det_{m}_{scheme}.png')
        pg.locator('.dgchart').screenshot(path=f'sx_chart_{scheme}.png');print(errs)
    b.close()

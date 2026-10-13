from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for scheme,w in [('light',1200),('dark',390)]:
        ctx=b.new_context(viewport={'width':w,'height':900},device_scale_factor=2 if w<500 else 1,color_scheme=scheme);pg=ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/index.html#dg');pg.wait_for_timeout(700)
        pg.evaluate("DG.inst='flute';DG.sel['flute']=60;dgRender()");pg.wait_for_timeout(500)
        pg.locator('.dgdet').screenshot(path=f'fl_det_{scheme}.png')
        pg.locator('.dgchart').screenshot(path=f'fl_chart_{scheme}.png')
        print(errs)
    b.close()

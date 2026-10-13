from playwright.sync_api import sync_playwright
import re
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    for lang in ['en','es']:
        pg=b.new_page(viewport={'width':1200,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8790/');pg.wait_for_timeout(300);pg.evaluate(f"localStorage.setItem('atelier-lang','{lang}')");pg.reload();pg.wait_for_timeout(600)
        pg.evaluate("openModule('en')");pg.wait_for_timeout(300)
        pg.evaluate("""async()=>{const sr=44100,n=sr*3,ch=[new Float32Array(n)];for(let i=0;i<n;i++)ch[0][i]=.2*Math.sin(i/20);RS.last={blob:mstWav(ch,sr),type:'audio/wav',ext:'wav',dur:3,date:Date.now(),name:'t'};recShow();LY.text='abc\\ndef';lyPaint();}""")
        pg.wait_for_timeout(400)
        t=pg.evaluate("[document.querySelector('.lysec').innerText,document.querySelector('.mstbox').innerText]")
        fr=[w for w in ['Paroles','Défiler','Début','lignes','Plein','Mastering automatique','Intensité','Équilibré','Appliquer','Écrire'] if w in ' '.join(t)]
        print(lang,'FR restant:',fr,errs)
        pg.click('.mstbox .btn.primary');pg.wait_for_timeout(1500)
        t=pg.evaluate("document.querySelector('.mstbox').innerText");print(lang,re.sub(r'\s+',' ',t)[:300])
    b.close()

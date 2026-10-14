import re,html,json
exec(open('tr.py').read())
tr={f:(e,s) for f,e,s in T}
src=open('about_src.js').read()
blk=re.search(r"const AP_PRIV=\[(.*?)\n\];",src,re.S).group(1)
items=re.findall(r"\['((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'\]",blk)
items=[(a.replace("\\'","'"),b.replace("\\'","'")) for a,b in items]
MAIL='tomthivierge.artiste@gmail.com'
def sec(lang,title,date,lst):
    out=f'<section lang="{lang}"><h1>{title}</h1><p class="d">{date}</p>'
    for i,(h,t) in enumerate(lst):
        out+=f'<h2>{html.escape(h)}</h2><p>{html.escape(t)}'+(f'<a href="mailto:{MAIL}">{MAIL}</a>.' if i==6 else '')+'</p>'
    return out+'</section>'
fr=sec('fr','MusicDEV — Politique de confidentialité','En vigueur le 13 octobre 2026',items)
en=sec('en','MusicDEV — Privacy policy',tr['En vigueur le 13 octobre 2026'][0],[(tr[h][0],tr[t][0]) for h,t in items])
es=sec('es','MusicDEV — Política de privacidad',tr['En vigueur le 13 octobre 2026'][1],[(tr[h][1],tr[t][1]) for h,t in items])
page=f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MusicDEV — Confidentialité / Privacy</title>
<style>body{{font:16px/1.55 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 16px;color:#17212E;background:#fff}}h1{{font-size:1.4rem}}h2{{font-size:1.05rem;margin:1.2em 0 .3em}}.d{{color:#556171}}nav a{{margin-right:12px}}section{{margin-bottom:48px}}@media(prefers-color-scheme:dark){{body{{background:#10151C;color:#E6ECF2}}a{{color:#8fd3ff}}}}</style></head>
<body><nav><a href="#fr">Français</a><a href="#en">English</a><a href="#es">Español</a></nav>
{fr.replace('<section','<section id="fr"',1)}{en.replace('<section','<section id="en"',1)}{es.replace('<section','<section id="es"',1)}</body></html>'''
open('/home/claude/musicdev/privacy.html','w').write(page);print(len(items))

"""Habillage clair des « appareils » (métronome, accordeur, enregistreur) quand l'app est en thème clair.
Lit light/devices.css et le place après les autres styles, seulement pour le thème clair :
html[data-theme=light], ou thème auto avec un système en mode clair."""
import sys,re,os
p=sys.argv[1];s=open(p).read()
if 'id="devices-light"' in s:print('deja');sys.exit(0)
css=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'devices.css')).read()
css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
rules=re.findall(r'([^{}]+)\{([^}]*)\}',css)
def pre(sel,prefix):return ','.join(prefix+' '+x.strip() for x in sel.split(','))
a=''.join(pre(sel,':root[data-theme="light"]')+'{'+body.replace(';','!important;').rstrip(';').replace('!important!important','!important')+('!important' if not body.strip().endswith('!important') else '')+'}' for sel,body in rules)
b=''.join(pre(sel,':root:not([data-theme])')+'{'+body.replace(';','!important;').rstrip(';').replace('!important!important','!important')+('!important' if not body.strip().endswith('!important') else '')+'}' for sel,body in rules)
block='<style id="devices-light">'+a+'@media (prefers-color-scheme:light){'+b+'}</style>\n'
i=s.rfind('</style>');assert i>0;i+=len('</style>');s=s[:i]+'\n'+block+s[i:]
open(p,'w').write(s);print('ok devices-light')

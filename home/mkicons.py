"""Icônes d'outils de l'accueil : home/ico/*.webp (découpées du modèle fourni par l'utilisateur, modele-utilisateur.png)
   → bloc CSS entre les marqueurs dans home.css. Relancer après avoir changé une image."""
import base64,os,re
D=os.path.dirname(os.path.abspath(__file__))
GLOW={'mt':'47 160 130','ac':'240 150 50','en':'225 80 70','gc':'70 130 210','ba':'140 100 210'}
css="/* ICONES-DEBUT */\n.hoico svg{display:none}\n.hoico{background-size:cover!important;background-position:center!important}\n"
for k,g in GLOW.items():
    b=base64.b64encode(open(f'{D}/ico/{k}.webp','rb').read()).decode()
    css+=f".ico-{k}{{background:url(data:image/webp;base64,{b});box-shadow:0 6px 16px rgb({g}/.28),0 2px 4px rgb(0 0 0/.18)!important}}\n"
css+="/* ICONES-FIN */"
p=f'{D}/home.css';s=open(p).read()
if '/* ICONES-DEBUT */' in s:s=re.sub(r'/\* ICONES-DEBUT \*/.*?/\* ICONES-FIN \*/',lambda m:css,s,flags=re.S)
else:s+='\n'+css+'\n'
open(p,'w').write(s);print('icônes',len(css))

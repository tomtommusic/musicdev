#!/usr/bin/env python3
"""Batterie et basse échantillonnées (banque MS Basic de MuseScore, MIT). À lancer après v129, avant i18n."""
import sys,os,base64,json
D=os.path.dirname(os.path.abspath(__file__))
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:90],s.count(a));s=s.replace(a,b)
data={}
for f in sorted(os.listdir(D+'/mp3')):
    if f.endswith('.mp3'):data[f[:-4]]=base64.b64encode(open(D+'/mp3/'+f,'rb').read()).decode()
js='const SMP_D='+json.dumps(data,separators=(',',':'))+';\n'+open(D+'/smp.js',encoding='utf-8').read()
i=s.rindex('</body>');s=s[:i]+'<script>\n'+js+'</script>\n'+s[i:]
lic=("MuseScore General / MS Basic\n"
"FluidR3 (original version) by Frank Wen Copyright (c) 2000-02, 2008\n"
"Mono conversion (FluidR3Mono) by Michael Cowgill Copyright (c) 2014-17\n"
"Adaptation for MuseScore_General.sf2 by S. Christian Collins Copyright (c) 2018-19\n\n")
# texte MIT sans la ligne de copyright d'abcjs
rep("const AP_MIT=","const AP_MIT_BODY=\"Permission is hereby granted, free of charge, to any person obtaining a copy\\nof this software and associated documentation files (the \\\"Software\\\"), to deal\\nin the Software without restriction, including without limitation the rights\\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\\ncopies of the Software, and to permit persons to whom the Software is\\nfurnished to do so, subject to the following conditions:\\n\\nThe above copyright notice and this permission notice shall be included in\\nall copies or substantial portions of the Software.\\n\\nTHE SOFTWARE IS PROVIDED \\\"AS IS\\\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\\nTHE SOFTWARE.\";\nconst AP_MIT=")
rep("const AP_MIT=","const AP_SMP="+json.dumps(lic)+"+AP_MIT_BODY;\nconst AP_MIT=")
rep("el('details',{},el('summary',{},'Voir la licence'),el('pre',{class:'aptext','data-notr':''},AP_MIT))),",
    "el('details',{},el('summary',{},'Voir la licence'),el('pre',{class:'aptext','data-notr':''},AP_MIT))),\n"
    "    el('div',{class:'apblock'},el('h4',{},'Sons de batterie et de basse ',el('span',{class:'aplic','data-notr':''},'MIT')),el('p',{class:'hint'},'Enregistrements tirés de MuseScore General (FluidR3 de Frank Wen, FluidR3Mono de Michael Cowgill, adaptation de S. Christian Collins).'),\n"
    "      el('details',{},el('summary',{},'Voir la licence'),el('pre',{class:'aptext','data-notr':''},AP_SMP))),")
open(p,'w',encoding='utf-8').write(s)

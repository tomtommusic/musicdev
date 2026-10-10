#!/usr/bin/env python3
"""Ajoute la langue de l'application (FR/EN/ES) à index.html. À lancer après unmute.py."""
import json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
p = sys.argv[1]
s = open(p, encoding='utf-8').read()

def sub(a, b, n=1):
    global s
    assert s.count(a) >= 1, 'introuvable: ' + a[:80]
    s = s.replace(a, b, n)

def js(o):
    return json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')

eng = open(os.path.join(D, 'i18n.js'), encoding='utf-8').read()
extra_path = os.path.join(D, 'extra.json')
extra = json.load(open(extra_path, encoding='utf-8')) if os.path.exists(extra_path) else {'en': {}, 'es': {}}
for L in ('en', 'es'):
    d = json.load(open(os.path.join(D, f'ui_{L}.json'), encoding='utf-8'))
    d.update(extra.get(L, {}))
    d = {k: v for k, v in d.items() if k != v and v}
    lib = json.load(open(os.path.join(D, f'lib_{L}.json'), encoding='utf-8'))
    eng = eng.replace(f'/*DICT_{L.upper()}*/{{}}', js(d)).replace(f'/*LIB_{L.upper()}*/[]', js(lib))

# moteur chargé avant le script principal
sub('<script src="abcjs-basic-min.js"></script>\n', '<script src="abcjs-basic-min.js"></script>\n<script>\n' + eng + '\n</script>\n')
# html injecté par el() et les méthodes
sub("else if(k==='html')e.innerHTML=v;", "else if(k==='html')e.innerHTML=T(v);")
sub("box.querySelector('.methbody').innerHTML=h;", "box.querySelector('.methbody').innerHTML=T(h);")
# décompte : le texte « À toi ! » peut avoir été traduit
sub("b.querySelector('.go').textContent==='À toi !')", "[ 'À toi !',T('À toi !')].includes(b.querySelector('.go').textContent))")
sub("t.textContent=label;svg.append(t);", "t.textContent=T(label);svg.append(t);")
# bibliothèque traduite avant le démarrage
sub("const LIB_ORDER=LIB.flatMap(c=>c.topics.map(t=>t.id));", "const LIB_ORDER=LIB.flatMap(c=>c.topics.map(t=>t.id));\nlibApplyLang();")

# widget « truc des armures » : phrase composée
a0 = s.index("info.innerHTML=`<b>${R.keys[k]} majeur</b>")
a1 = s.index("(même armure).</span>`;", a0) + len("(même armure).</span>`;")
fr = s[a0+len("info.innerHTML="):a1-1]
s = s[:a0] + "{const KM=T(R.keys[k]+' majeur'),RM=T(R.rel[k]+' mineur'),LS=list.map(x=>T(x)).join(', ');info.innerHTML=TL(" + fr + \
  ",`<b>${KM}</b>: ${n} ${r==='s'?'sharp':'flat'}${n>1?'s':''} — ${n>1?'the first '+n:'the first one'} in the row: <b>${LS}</b>.<br><span>Relative minor: <b>${RM}</b> (same key signature).</span>`" + \
  ",`<b>${KM}</b>: ${n} ${r==='s'?'sostenido':'bemol'}${n>1?(r==='s'?'s':'es'):''} — ${n>1?'los '+n+' primeros':'el primero'} de la fila: <b>${LS}</b>.<br><span>Relativa menor: <b>${RM}</b> (misma armadura).</span>`);}" + s[a1:]
# CSS du sélecteur
css = """
/* ===== sélecteur de langue ===== */
.langsw{display:inline-flex;border:1px solid var(--btn-edge);border-radius:999px;overflow:hidden;background:var(--btn);box-shadow:var(--shadow-sm)}
.langsw button{border:0;background:transparent;color:var(--muted);font:700 .78rem/1 var(--f-mono);letter-spacing:.06em;padding:8px 11px;cursor:pointer;min-height:36px}
.langsw button+button{border-left:1px solid var(--line)}
.langsw button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink)}
.langsw button:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.rail .langsw{align-self:flex-start}
@media (max-width:600px){.rail .langsw{order:1}.rail .railnote{order:2}.langsw button{padding:8px 12px;min-height:38px}}
"""
sub('</style>', css + '</style>')
# démarrage : en dernier pour que les autres observateurs passent avant la traduction
boot = """<script>
/* langue : sélecteur dans l'en-tête, puis traduction de la page */
(()=>{const br=document.querySelector('.rail .brand');if(br)br.after(langSwitch());
  document.documentElement.lang=I18N.lang==='fr'?'fr-CA':I18N.lang;trStart();if(I18N.lang!=='fr')trTree(document.body);})();
</script>
"""
i = s.rfind('</body>')
s = s[:i] + boot + s[i:]
open(p, 'w', encoding='utf-8').write(s)
print('i18n ok')

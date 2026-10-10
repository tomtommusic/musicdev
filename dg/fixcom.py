import json
D='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/'
R={
'Doigté de base (majeur droit). Variante chromatique avec la clé de Fa♯ auxiliaire (R1 + clé latérale) non représentée.':('Doigté de base (majeur droit). Il existe aussi un fa♯ chromatique (index droit + clé latérale).','Basic fingering (right middle finger). There is also a chromatic F♯ (right index + side key).','Digitación básica (dedo medio derecho). También existe un fa♯ cromático (índice derecho + llave lateral).'),
"Do♯ grave. WFG ajoute RC; plusieurs méthodes l'omettent (facultatif).":("Do♯ grave. Certains tableaux ajoutent la clé de do grave (main droite) : facultatif.","Low C♯. Some charts add the low C key (right hand): optional.","Do♯ grave. Algunas tablas añaden la llave de do grave (mano derecha): opcional."),
'Fa avant : index gauche sur la clé Fa avant, majeur sur L2.':('Fa avant : index gauche sur la clé de fa avant, majeur gauche sur sa clé (la).','Front F: left index on the front F key, left middle finger on its key (A).','Fa frontal: índice izquierdo en la llave de fa frontal, dedo medio izquierdo en su llave (la).'),
'Règle courante : Si à gauche, Do à droite. Certaines méthodes débutantes font tenir aussi Do droit (rF).':('Règle courante : si à gauche, do à droite. Certaines méthodes pour débutants font aussi tenir la clé de do de droite.','Common rule: B with the left pinky, C with the right. Some beginner methods also have you hold the right C key.','Regla habitual: si con la izquierda, do con la derecha. Algunos métodos para principiantes también hacen mantener la llave de do derecha.'),
'SE = clé latérale Mi (main droite, côté).':('Clé latérale de mi aigu (côté de la main droite).','High E side key (right-hand side).','Llave lateral de mi agudo (lado de la mano derecha).'),
'Si grave. RC indiqué par les tableaux; souvent fermé mécaniquement.':('Si grave. La clé de do grave (main droite) est indiquée par les tableaux, mais elle se ferme souvent toute seule.','Low B. Charts show the low C key (right hand), but it often closes by itself.','Si grave. Las tablas indican la llave de do grave (mano derecha), pero a menudo se cierra sola.'),
'Si♭ grave. RC (Do grave) indiqué par les tableaux; sur la plupart des saxos modernes, il se ferme déjà mécaniquement.':('Si♭ grave. La clé de do grave (main droite) est indiquée par les tableaux; sur la plupart des saxos modernes, elle se ferme toute seule.','Low B♭. Charts show the low C key (right hand); on most modern saxophones it closes by itself.','Si♭ grave. Las tablas indican la llave de do grave (mano derecha); en la mayoría de los saxos modernos se cierra sola.'),
'Si♭ « bis » : idéal sans Si naturel à proximité. Aussi : « 1 et 1 » (L1 + R1) avec Fa. WFG classe le Si♭ de côté comme doigté de base.':("Si♭ « bis » : idéal quand aucun si naturel n'est proche. Aussi : « 1 et 1 » (index gauche + index droit). Beaucoup de tableaux donnent le si♭ de côté comme doigté de base.",'Bis B♭: ideal when no B natural is nearby. Also: "1 and 1" (left index + right index). Many charts give side B♭ as the basic fingering.','Si♭ «bis»: ideal cuando no hay un si natural cerca. También: «1 y 1» (índice izquierdo + índice derecho). Muchas tablas dan el si♭ lateral como digitación básica.'),
'Si♭ « bis » ; aussi « 1 et 1 » (L1 + R1). WFG classe le Si♭ de côté comme doigté de base.':('Si♭ « bis » ; aussi « 1 et 1 » (index gauche + index droit). Beaucoup de tableaux donnent le si♭ de côté comme doigté de base.','Bis B♭; also "1 and 1" (left index + right index). Many charts give side B♭ as the basic fingering.','Si♭ «bis»; también «1 y 1» (índice izquierdo + índice derecho). Muchas tablas dan el si♭ lateral como digitación básica.'),
}
js=open(D+'dg_data.js').read()
tr=json.load(open(D+'comments_tr.json'))
for old,(fr,en,es) in R.items():
    if json.dumps(old,ensure_ascii=False)[1:-1] not in js: continue
    js=js.replace(json.dumps(old,ensure_ascii=False)[1:-1],json.dumps(fr,ensure_ascii=False)[1:-1])
    tr.pop(old,None);tr[fr]={'en':en,'es':es}
open(D+'dg_data.js','w').write(js);json.dump(tr,open(D+'comments_tr.json','w'),ensure_ascii=False,indent=0)
print('ok',len(tr))

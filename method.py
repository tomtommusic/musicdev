import sys
NEW=r"""const METHOD={
 tq:`<ol><li><b>Lis toute la question</b> : clé, armure, « au-dessus » ou « au-dessous »… un détail change souvent la réponse.</li>
<li><b>Saute une question difficile</b> avec les flèches et reviens-y à la fin.</li>
<li><b>Après le résultat</b>, ouvre chaque question ratée : la bonne réponse s'affiche, avec un lien vers la notion.</li></ol>`,
 dm:`<ol><li><b>Première écoute sans écrire</b> : trouve la pulsation et si c'est majeur ou mineur.</li>
<li><b>Le rythme d'abord</b>, puis les hauteurs.</li>
<li><b>Situe-toi par rapport à la tonique</b> : les sauts tombent souvent sur les notes de l'accord de tonique ; le reste avance surtout par degrés conjoints.</li></ol>
<p><b>▶ Gamme et arpège</b> met la tonalité dans l'oreille ; <b>Mesure</b> rejoue un passage difficile.</p>`,
 dr:`<ol><li><b>Bats la pulsation</b> dès la première écoute.</li>
<li><b>Écris temps par temps</b> : combien de sons dans ce temps ? Un (noire), deux (croches), quatre (doubles)…</li>
<li><b>Vérifie le total</b> de chaque mesure.</li></ol>
<p><b>Mesure</b> rejoue une seule mesure : utile pour les rythmes serrés.</p>`,
 iv:`<ol><li><b>Chante l'intervalle intérieurement</b> avant de répondre.</li>
<li><b>Associe chaque intervalle à un début de chanson</b> que tu connais bien (voir « Repères pour reconnaître à l'oreille » dans la bibliothèque).</li>
<li><b>Après la réponse</b>, écoute les autres intervalles à partir de la même note pour comparer.</li></ol>`,
 pc:`<ol><li><b>Écoute ▶ Tonalité</b> pour bien entendre l'accord de tonique.</li>
<li><b>Suis la basse</b> : c'est elle qui révèle le degré (en do majeur : fa → IV, sol → V, la → vi).</li>
<li><b>Écoute si l'accord est majeur ou mineur</b> : ça distingue IV de ii, ou I de vi.</li></ol>
<p>Après la réponse, réécoute chaque accord seul.</p>`,
 ln:`<ul><li><b>Pars de notes repères</b> : en clé de sol, le sol de la 2<sup>e</sup> ligne ; en clé de fa, le fa de la 4<sup>e</sup> ligne. Les autres notes se trouvent à partir d'elles.</li>
<li><b>Vise la vitesse</b> : nommer une note en moins d'une seconde, c'est ce qui rend la lecture à vue possible.</li></ul>`,
 lm:`<ol><li><b>Avant de commencer</b>, repère la tonalité, la mesure et le passage le plus difficile.</li>
<li><b>Garde le tempo</b> : ne t'arrête pas sur une erreur.</li>
<li><b>Lis une note d'avance.</b></li></ol>`,
 lr:`<ol><li><b>Garde la pulsation dans ton corps</b> (pied ou tête) pendant que tu frappes.</li>
<li><b>Compte à voix basse</b> : « 1 et 2 et » pour les croches, « 1 i n e » (ou « 1 i &amp; e ») pour les doubles-croches.</li>
<li><b>Tiens les notes longues</b> toute leur valeur ; les silences comptent autant que les notes.</li>
<li>Si un passage bloque, <b>écoute le modèle</b>, puis recommence sans lui.</li></ol>`,
 so:`<ol><li><b>Donne-toi la tonalité</b> avec <b>▶ Gamme et arpège</b>, puis la première note avec <b>▶ 1re note</b>.</li>
<li><b>Garde la pulsation</b> et ne t'arrête pas sur une erreur.</li>
<li><b>Écoute la solution</b> pour te corriger, puis rechante.</li></ol>`,
 la:`<ol><li><b>Trouve la première note</b> sur le clavier avant de commencer.</li>
<li><b>Pense en intervalles</b> (« je monte d'une tierce ») plutôt que note par note.</li></ol>`,
};"""
for p in sys.argv[1:]:
    s=open(p).read();a=s.index('const METHOD={');b=s.index('\n};',a)+3
    s=s[:a]+NEW+s[b:];open(p,'w').write(s);print('ok',p)

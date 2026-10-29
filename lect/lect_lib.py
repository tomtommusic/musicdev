# Bibliothèque théorique, onglet Lecture : tablatures (guitare, basse) et partitions de batterie (FR, EN, ES).
def go(i, t): return f'<a href="#" data-go="{i}">{t}</a>'
X = '!style=x!'
TAB_RIFF = '''e|-------------------------|
B|-------------------------|
G|-------------------------|
D|----------2---3---2------|
A|------3-------------3----|
E|--0----------------------|'''
TAB_CHORD = '''   Sol (G)    Do (C)
e|---3---------0-----|
B|---0---------1-----|
G|---0---------0-----|
D|---0---------2-----|
A|---2---------3-----|
E|---3---------x-----|'''
TAB_BASS = '''G|-----------------|
D|-----------------|
A|-----0---3---5---|
E|--3--------------|'''

DRUM_LEG = f'X:1\nL:1/4\nK:C clef=perc\n{X}a {X}g {X}f e d c A F {X}D |]\nw: Crash Charl. Ride Tom~1 Tom~2 C.C. Tom~B. G.C. Ch.~pied'
H8 = lambda n: ' '.join([f'{X}g{X}g']*n)
DRUM_ROCK = f'X:1\nL:1/8\nM:4/4\n%%score (1 2)\nK:C clef=perc\nV:1 stem=up\nV:2 stem=down\n[V:1] {H8(4)} |]\n[V:2] F2 c2 FF c2 |]'
DRUM_VAR = f'X:1\nL:1/8\nM:4/4\n%%score (1 2)\nK:C clef=perc\nV:1 stem=up\nV:2 stem=down\n[V:1] {H8(3)} !open!{X}g{X}g | {H8(2)} ee dd |]\n[V:2] F2 c2 zF c2 | F2 c2 AA AA |]'

EX = {
 'tab': [
  {'abc': 'X:1\nL:1/8\nK:C\nE2 G2 A2 B2 | c2 B2 A2 G2 |]', 'tab': 'guitar', 'cap': {'fr': 'La même mélodie sur la portée (en haut) et en tablature (en bas) : la portée donne le rythme, la tablature dit où poser les doigts.', 'en': 'The same melody on the staff (top) and in tablature (bottom): the staff gives the rhythm, the tab tells you where to put your fingers.', 'es': 'La misma melodía en el pentagrama (arriba) y en tablatura (abajo): el pentagrama da el ritmo, la tablatura dice dónde poner los dedos.'}},
  {'abc': 'X:1\nL:1/4\nK:C clef=bass\nG,, C, D, E, | F, E, D, C, |]', 'tab': 'bass', 'cap': {'fr': 'Une ligne de basse avec sa tablature à 4 cordes.', 'en': 'A bass line with its 4-string tab.', 'es': 'Una línea de bajo con su tablatura de 4 cuerdas.'}}],
 'drumleg': [
  {'abc': DRUM_LEG, 'play': False, 'cap': {'fr': 'La place de chaque élément sur la portée de batterie (comme dans le module Lecture batterie).', 'en': 'Where each part of the kit goes on the drum staff (as in the Drum reading module).', 'es': 'El lugar de cada elemento en el pentagrama de batería (como en el módulo Lectura de batería).'}}],
 'drumread': [
  {'abc': DRUM_ROCK, 'play': False, 'cap': {'fr': 'Le rythme rock de base : charleston en croches (en haut), grosse caisse sur 1 et 3, caisse claire sur 2 et 4 (en bas).', 'en': 'The basic rock beat: hi-hat in eighth notes (top), bass drum on 1 and 3, snare on 2 and 4 (bottom).', 'es': 'El ritmo de rock básico: charles en corcheas (arriba), bombo en 1 y 3, caja en 2 y 4 (abajo).'}},
  {'abc': DRUM_VAR, 'play': False, 'cap': {'fr': 'Variante : grosse caisse sur le « et » de 3, charleston ouvert (o), puis un petit roulement de toms.', 'en': 'Variation: bass drum on the "and" of 3, open hi-hat (o), then a short tom fill.', 'es': 'Variante: bombo en el «y» del 3, charles abierto (o) y luego un breve redoble de toms.'}}]}

TOPICS = {
'fr': [
 {'id': 'tablature', 'x': 'tab', 't': 'Lire une tablature (guitare, basse)', 'k': 'tablature tab guitare basse cordes cases frettes corde a vide accord lire',
  'html': f'''<p>La <b>tablature</b> (ou « tab ») est une façon d'écrire la musique pour les instruments à cordes avec des frettes (guitare, basse, ukulélé). Au lieu de dire <i>quelle note</i> jouer, elle dit <b>où poser les doigts</b>.</p>
<ul><li><b>Chaque ligne est une corde.</b> À la guitare, il y a 6 lignes. <b>La ligne du haut est la corde la plus aiguë</b> (mi aigu, e) et la ligne du bas la plus grave (mi grave, E) : c'est l'inverse de ce qu'on voit en regardant la guitare.</li>
<li><b>Chaque chiffre est une case</b> (une frette) : 3 = appuie à la 3e case. <b>0 = corde à vide</b> (on la joue sans appuyer).</li>
<li>On lit <b>de gauche à droite</b>, comme une phrase. Des chiffres <b>empilés verticalement</b> se jouent <b>en même temps</b> (un accord).</li>
<li>Un <b>x</b> veut dire : corde étouffée ou pas jouée.</li></ul>
<p>Accordage standard de la guitare, de la corde grave à la corde aiguë : <b>mi la ré sol si mi</b> (E A D G B e). La basse a 4 cordes : <b>mi la ré sol</b> (E A D G).</p>
<pre class="tabtxt">{TAB_RIFF}</pre>
<p>Ici : corde de mi grave à vide, puis 3e case de la corde de la, 2e et 3e cases de la corde de ré…</p>
<pre class="tabtxt">{TAB_CHORD}</pre>
<p>Deux accords : chaque colonne de chiffres se gratte d'un seul coup.</p>
<pre class="tabtxt">{TAB_BASS}</pre>
<p>À la basse : même principe, avec 4 lignes.</p>
<p><b>Attention</b> : une tablature seule ne montre pas le <b>rythme</b> (la durée des notes). On la trouve donc souvent <b>sous une portée</b>, qui donne le rythme. Elle ne dit pas non plus quel doigt utiliser : c'est à toi de choisir le doigté le plus confortable.</p>
<p><b>Pour t'exercer</b> : dans Lecture mélodique ou Lecture à vue, active l'option « Tablature » (guitare ou basse) dans les réglages. Voir aussi {go('tablature-signes','Les signes de la tablature')}.</p>''',
  'see': ['tablature-signes', 'portee', 'cles']},
 {'id': 'tablature-signes', 't': 'Les signes de la tablature', 'k': 'tablature signes hammer on pull off glisse slide bend tire vibrato etouffe palm mute harmonique',
  'html': '''<p>Les tablatures utilisent des lettres et des symboles pour les techniques de jeu. Les plus courants :</p>
<table class="lt"><tr><th>Signe</th><th>Nom</th><th>Comment le jouer</th></tr>
<tr><td>5h7</td><td>Hammer-on (marteler)</td><td>Joue la case 5, puis frappe la case 7 avec un doigt de la main gauche, sans regratter.</td></tr>
<tr><td>7p5</td><td>Pull-off (tirer)</td><td>Joue la case 7, puis retire le doigt en « accrochant » la corde pour faire sonner la case 5.</td></tr>
<tr><td>5/7 &nbsp; 7\\5</td><td>Glissé (slide)</td><td>Glisse le doigt d'une case à l'autre en gardant la pression.</td></tr>
<tr><td>7b9</td><td>Bend (tiré)</td><td>Pousse la corde vers le haut pour monter la note (ici, jusqu'au son de la case 9).</td></tr>
<tr><td>7b9r7</td><td>Bend et relâché</td><td>Tire la corde, puis ramène-la à sa place.</td></tr>
<tr><td>7~</td><td>Vibrato</td><td>Fais osciller légèrement la note en bougeant la corde.</td></tr>
<tr><td>x</td><td>Note étouffée</td><td>Pose le doigt sur la corde sans appuyer : on entend un son percussif.</td></tr>
<tr><td>P.M.</td><td>Palm mute</td><td>Pose le tranchant de la main droite sur les cordes, près du chevalet : son étouffé.</td></tr>
<tr><td>(7)</td><td>Note fantôme ou liée</td><td>Note très douce, ou note tenue (pas regrattée).</td></tr>
<tr><td>&lt;12&gt;</td><td>Harmonique naturelle</td><td>Effleure la corde juste au-dessus de la frette 12, sans appuyer.</td></tr></table>
<p>Au-dessus de la tablature, on trouve parfois des flèches pour le sens du grattage : <b>↓</b> (vers le bas) et <b>↑</b> (vers le haut).</p>''',
  'see': ['tablature', 'articulations']},
 {'id': 'batterie-portee', 'x': 'drumleg', 't': 'La portée de batterie', 'k': 'batterie portee percussion cle neutre grosse caisse caisse claire charleston ride crash tom tete x',
  'html': f'''<p>La batterie s'écrit sur une portée de 5 lignes, avec une <b>clé de percussion</b> (deux petits traits verticaux). Ici, les lignes et les interlignes ne donnent pas des hauteurs de notes : <b>chaque position correspond à un élément de la batterie</b>.</p>
<table class="lt"><tr><th>Élément</th><th>Position sur la portée</th><th>Tête de note</th></tr>
<tr><td>Cymbale crash</td><td>ligne supplémentaire au-dessus</td><td>x</td></tr>
<tr><td>Charleston (hi-hat)</td><td>au-dessus de la portée</td><td>x</td></tr>
<tr><td>Ride</td><td>5e ligne (en haut)</td><td>x</td></tr>
<tr><td>Tom aigu (tom 1)</td><td>4e interligne</td><td>ronde</td></tr>
<tr><td>Tom médium (tom 2)</td><td>4e ligne</td><td>ronde</td></tr>
<tr><td>Caisse claire</td><td>3e interligne</td><td>ronde</td></tr>
<tr><td>Tom basse</td><td>2e interligne</td><td>ronde</td></tr>
<tr><td>Grosse caisse</td><td>1er interligne</td><td>ronde</td></tr>
<tr><td>Charleston au pied</td><td>sous la portée</td><td>x</td></tr></table>
<ul><li><b>Têtes en x</b> pour les cymbales, <b>têtes rondes</b> pour les fûts (tambours).</li>
<li>Plus l'instrument est grave, plus il est placé bas : grosse caisse en bas, cymbales en haut.</li>
<li>Souvent, on écrit <b>deux voix</b> : les mains (cymbales, toms) hampes vers le <b>haut</b>, les pieds (grosse caisse, charleston au pied) hampes vers le <b>bas</b>. La caisse claire est d'un côté ou de l'autre selon la partition.</li>
<li>Signes utiles : <b>&gt;</b> accent ; <b>o</b> charleston ouvert ; <b>+</b> charleston fermé ; une note entre parenthèses = <b>ghost note</b> (très douce).</li></ul>
<p>Attention : l'emplacement exact peut varier un peu d'un éditeur à l'autre. Une bonne partition donne une <b>légende</b> au début.</p>''',
  'see': ['batterie-lire', 'portee', 'figures-notes']},
 {'id': 'batterie-lire', 'x': 'drumread', 't': 'Lire un rythme de batterie', 'k': 'batterie lire rythme groove rock compter roulement fill mesure repeter',
  'html': f'''<p>Pour lire une partition de batterie, on lit <b>de gauche à droite</b> comme d'habitude, mais aussi <b>de haut en bas</b> : les notes alignées verticalement se jouent <b>en même temps</b>, avec des membres différents.</p>
<ol><li><b>Trouve le chiffre indicateur</b> et compte les temps à voix haute : « 1 et 2 et 3 et 4 et ». Voir {go('figures-notes','Figures de notes')}.</li>
<li><b>Lis d'abord une seule voix</b> : par exemple le charleston (souvent régulier, en croches).</li>
<li><b>Ajoute la grosse caisse et la caisse claire</b> : repère sur quel compte elles tombent (dans un rythme rock, grosse caisse sur 1 et 3, caisse claire sur 2 et 4).</li>
<li><b>Joue lentement</b>, avec le métronome, puis accélère.</li></ol>
<p><b>Repères</b> :</p>
<ul><li>Le <b>groove</b> (ou « beat ») est le motif qui se répète. On l'écrit souvent une fois, puis on le répète avec le signe <b>%</b> (répéter la mesure précédente).</li>
<li>Le <b>roulement</b> (ou « fill ») est un passage plus chargé, souvent sur les toms, qui annonce une nouvelle section.</li>
<li>Les <b>accents (&gt;)</b> se jouent plus fort ; les <b>ghost notes</b> (entre parenthèses), très doucement.</li></ul>
<p><b>Pour t'exercer</b> : le module Lecture batterie te fait lire et jouer des partitions de difficulté progressive, et le module Rudiments travaille la technique de la caisse claire.</p>''',
  'see': ['batterie-portee', 'pulsation', 'syncope']}],
'en': [
 {'id': 'tablature', 't': 'Reading tablature (guitar, bass)', 'k': 'tablature tab guitar bass strings frets open string chord read',
  'html': f'''<p><b>Tablature</b> (or "tab") is a way of writing music for fretted string instruments (guitar, bass, ukulele). Instead of telling you <i>which note</i> to play, it tells you <b>where to put your fingers</b>.</p>
<ul><li><b>Each line is a string.</b> On guitar there are 6 lines. <b>The top line is the highest string</b> (high E, e) and the bottom line the lowest (low E): the opposite of what you see when you look down at the guitar.</li>
<li><b>Each number is a fret</b>: 3 = press at the 3rd fret. <b>0 = open string</b> (played without pressing).</li>
<li>You read <b>from left to right</b>, like a sentence. Numbers <b>stacked vertically</b> are played <b>at the same time</b> (a chord).</li>
<li>An <b>x</b> means: muted or unplayed string.</li></ul>
<p>Standard guitar tuning, from the lowest to the highest string: <b>E A D G B e</b>. The bass has 4 strings: <b>E A D G</b>.</p>
<pre class="tabtxt">{TAB_RIFF}</pre>
<p>Here: open low E string, then 3rd fret of the A string, 2nd and 3rd frets of the D string…</p>
<pre class="tabtxt">{TAB_CHORD.replace("Sol (G)    Do (C)", "G          C     ")}</pre>
<p>Two chords: each column of numbers is strummed in one go.</p>
<pre class="tabtxt">{TAB_BASS}</pre>
<p>On bass: same principle, with 4 lines.</p>
<p><b>Careful</b>: tab on its own does not show the <b>rhythm</b> (how long the notes last). So it is often found <b>under a staff</b>, which gives the rhythm. It does not tell you which finger to use either: you choose the most comfortable fingering.</p>
<p><b>Practice</b>: in Melodic reading or Sight-reading, turn on the "Tablature" option (guitar or bass) in the settings. See also {go('tablature-signes','Tablature symbols')}.</p>''',
  'see': ['tablature-signes', 'portee', 'cles']},
 {'id': 'tablature-signes', 't': 'Tablature symbols', 'k': 'tablature symbols hammer on pull off slide bend vibrato muted palm mute harmonic',
  'html': '''<p>Tabs use letters and symbols for playing techniques. The most common ones:</p>
<table class="lt"><tr><th>Symbol</th><th>Name</th><th>How to play it</th></tr>
<tr><td>5h7</td><td>Hammer-on</td><td>Play fret 5, then hammer fret 7 with a left-hand finger, without picking again.</td></tr>
<tr><td>7p5</td><td>Pull-off</td><td>Play fret 7, then pull the finger off, "plucking" the string so fret 5 sounds.</td></tr>
<tr><td>5/7 &nbsp; 7\\5</td><td>Slide</td><td>Slide the finger from one fret to the other while keeping the pressure.</td></tr>
<tr><td>7b9</td><td>Bend</td><td>Push the string up to raise the note (here, up to the sound of fret 9).</td></tr>
<tr><td>7b9r7</td><td>Bend and release</td><td>Bend the string, then bring it back.</td></tr>
<tr><td>7~</td><td>Vibrato</td><td>Make the note waver slightly by moving the string.</td></tr>
<tr><td>x</td><td>Muted note</td><td>Rest the finger on the string without pressing: you hear a percussive sound.</td></tr>
<tr><td>P.M.</td><td>Palm mute</td><td>Rest the edge of your picking hand on the strings near the bridge: muted sound.</td></tr>
<tr><td>(7)</td><td>Ghost or tied note</td><td>Very soft note, or a held note (not picked again).</td></tr>
<tr><td>&lt;12&gt;</td><td>Natural harmonic</td><td>Lightly touch the string right above fret 12, without pressing.</td></tr></table>
<p>Above the tab you sometimes see strumming arrows: <b>↓</b> (down) and <b>↑</b> (up).</p>''',
  'see': ['tablature', 'articulations']},
 {'id': 'batterie-portee', 't': 'The drum staff', 'k': 'drums staff percussion clef bass drum snare hi-hat ride crash tom x notehead',
  'html': '''<p>Drums are written on a 5-line staff with a <b>percussion clef</b> (two short vertical bars). Here the lines and spaces do not give pitches: <b>each position stands for one part of the kit</b>.</p>
<table class="lt"><tr><th>Part</th><th>Position on the staff</th><th>Notehead</th></tr>
<tr><td>Crash cymbal</td><td>ledger line above</td><td>x</td></tr>
<tr><td>Hi-hat</td><td>above the staff</td><td>x</td></tr>
<tr><td>Ride</td><td>5th (top) line</td><td>x</td></tr>
<tr><td>High tom (tom 1)</td><td>4th space</td><td>round</td></tr>
<tr><td>Mid tom (tom 2)</td><td>4th line</td><td>round</td></tr>
<tr><td>Snare drum</td><td>3rd space</td><td>round</td></tr>
<tr><td>Floor tom</td><td>2nd space</td><td>round</td></tr>
<tr><td>Bass drum</td><td>1st space</td><td>round</td></tr>
<tr><td>Hi-hat pedal</td><td>below the staff</td><td>x</td></tr></table>
<ul><li><b>x noteheads</b> for cymbals, <b>round noteheads</b> for drums.</li>
<li>The lower the instrument, the lower it sits: bass drum at the bottom, cymbals at the top.</li>
<li>Drums are often written in <b>two voices</b>: the hands (cymbals, toms) with stems <b>up</b>, the feet (bass drum, hi-hat pedal) with stems <b>down</b>. The snare can be on either side depending on the score.</li>
<li>Useful signs: <b>&gt;</b> accent; <b>o</b> open hi-hat; <b>+</b> closed hi-hat; a note in brackets = <b>ghost note</b> (very soft).</li></ul>
<p>Careful: the exact placement can vary a little between publishers. A good score gives a <b>legend</b> at the beginning.</p>''',
  'see': ['batterie-lire', 'portee', 'figures-notes']},
 {'id': 'batterie-lire', 't': 'Reading a drum beat', 'k': 'drums read rhythm groove beat rock count fill bar repeat',
  'html': f'''<p>To read drum music, you read <b>from left to right</b> as usual, but also <b>from top to bottom</b>: notes lined up vertically are played <b>at the same time</b>, with different limbs.</p>
<ol><li><b>Find the time signature</b> and count the beats out loud: "1 and 2 and 3 and 4 and". See {go('figures-notes','Note values')}.</li>
<li><b>Read one voice first</b>: for example the hi-hat (often steady, in eighth notes).</li>
<li><b>Add the bass drum and the snare</b>: find which count they fall on (in a rock beat, bass drum on 1 and 3, snare on 2 and 4).</li>
<li><b>Play slowly</b>, with the metronome, then speed up.</li></ol>
<p><b>Landmarks</b>:</p>
<ul><li>The <b>groove</b> (or "beat") is the pattern that repeats. It is often written once, then repeated with the <b>%</b> sign (repeat the previous bar).</li>
<li>A <b>fill</b> is a busier passage, often on the toms, that leads into a new section.</li>
<li><b>Accents (&gt;)</b> are played louder; <b>ghost notes</b> (in brackets), very softly.</li></ul>
<p><b>Practice</b>: the Drum reading module has you read and play scores of increasing difficulty, and the Rudiments module works on snare technique.</p>''',
  'see': ['batterie-portee', 'pulsation', 'syncope']}],
'es': [
 {'id': 'tablature', 't': 'Leer una tablatura (guitarra, bajo)', 'k': 'tablatura tab guitarra bajo cuerdas trastes cuerda al aire acorde leer',
  'html': f'''<p>La <b>tablatura</b> (o «tab») es una manera de escribir música para instrumentos de cuerda con trastes (guitarra, bajo, ukelele). En lugar de decir <i>qué nota</i> tocar, dice <b>dónde poner los dedos</b>.</p>
<ul><li><b>Cada línea es una cuerda.</b> En la guitarra hay 6 líneas. <b>La línea de arriba es la cuerda más aguda</b> (mi agudo, e) y la de abajo la más grave (mi grave, E): lo contrario de lo que se ve al mirar la guitarra.</li>
<li><b>Cada número es un traste</b>: 3 = pisa en el 3.er traste. <b>0 = cuerda al aire</b> (se toca sin pisar).</li>
<li>Se lee <b>de izquierda a derecha</b>, como una frase. Los números <b>apilados verticalmente</b> se tocan <b>a la vez</b> (un acorde).</li>
<li>Una <b>x</b> significa: cuerda apagada o que no se toca.</li></ul>
<p>Afinación estándar de la guitarra, de la cuerda grave a la aguda: <b>mi la re sol si mi</b> (E A D G B e). El bajo tiene 4 cuerdas: <b>mi la re sol</b> (E A D G).</p>
<pre class="tabtxt">{TAB_RIFF}</pre>
<p>Aquí: cuerda de mi grave al aire, luego 3.er traste de la cuerda de la, 2.º y 3.er trastes de la cuerda de re…</p>
<pre class="tabtxt">{TAB_CHORD}</pre>
<p>Dos acordes: cada columna de números se rasguea de una sola vez.</p>
<pre class="tabtxt">{TAB_BASS}</pre>
<p>En el bajo: el mismo principio, con 4 líneas.</p>
<p><b>Atención</b>: una tablatura sola no muestra el <b>ritmo</b> (la duración de las notas). Por eso suele aparecer <b>debajo de un pentagrama</b>, que da el ritmo. Tampoco dice qué dedo usar: tú eliges la digitación más cómoda.</p>
<p><b>Para practicar</b>: en Lectura melódica o Lectura a primera vista, activa la opción «Tablatura» (guitarra o bajo) en los ajustes. Ver también {go('tablature-signes','Los signos de la tablatura')}.</p>''',
  'see': ['tablature-signes', 'portee', 'cles']},
 {'id': 'tablature-signes', 't': 'Los signos de la tablatura', 'k': 'tablatura signos hammer on pull off ligado slide bend vibrato apagada palm mute armonico',
  'html': '''<p>Las tablaturas usan letras y símbolos para las técnicas de interpretación. Los más comunes:</p>
<table class="lt"><tr><th>Signo</th><th>Nombre</th><th>Cómo tocarlo</th></tr>
<tr><td>5h7</td><td>Hammer-on (ligado ascendente)</td><td>Toca el traste 5 y luego golpea el traste 7 con un dedo de la mano izquierda, sin volver a pulsar.</td></tr>
<tr><td>7p5</td><td>Pull-off (ligado descendente)</td><td>Toca el traste 7 y luego retira el dedo «enganchando» la cuerda para que suene el traste 5.</td></tr>
<tr><td>5/7 &nbsp; 7\\5</td><td>Deslizamiento (slide)</td><td>Desliza el dedo de un traste a otro manteniendo la presión.</td></tr>
<tr><td>7b9</td><td>Bend (estirado)</td><td>Empuja la cuerda hacia arriba para subir la nota (aquí, hasta el sonido del traste 9).</td></tr>
<tr><td>7b9r7</td><td>Bend y soltar</td><td>Estira la cuerda y luego devuélvela a su sitio.</td></tr>
<tr><td>7~</td><td>Vibrato</td><td>Haz oscilar ligeramente la nota moviendo la cuerda.</td></tr>
<tr><td>x</td><td>Nota apagada</td><td>Apoya el dedo en la cuerda sin pisar: se oye un sonido percusivo.</td></tr>
<tr><td>P.M.</td><td>Palm mute</td><td>Apoya el canto de la mano derecha sobre las cuerdas, cerca del puente: sonido apagado.</td></tr>
<tr><td>(7)</td><td>Nota fantasma o ligada</td><td>Nota muy suave, o nota mantenida (sin volver a pulsar).</td></tr>
<tr><td>&lt;12&gt;</td><td>Armónico natural</td><td>Roza la cuerda justo encima del traste 12, sin pisar.</td></tr></table>
<p>Encima de la tablatura a veces hay flechas para el sentido del rasgueo: <b>↓</b> (hacia abajo) y <b>↑</b> (hacia arriba).</p>''',
  'see': ['tablature', 'articulations']},
 {'id': 'batterie-portee', 't': 'El pentagrama de batería', 'k': 'bateria pentagrama percusion clave bombo caja charles ride crash tom cabeza x',
  'html': '''<p>La batería se escribe en un pentagrama de 5 líneas con una <b>clave de percusión</b> (dos pequeñas barras verticales). Aquí las líneas y los espacios no indican alturas: <b>cada posición corresponde a un elemento de la batería</b>.</p>
<table class="lt"><tr><th>Elemento</th><th>Posición en el pentagrama</th><th>Cabeza de nota</th></tr>
<tr><td>Plato crash</td><td>línea adicional encima</td><td>x</td></tr>
<tr><td>Charles (hi-hat)</td><td>encima del pentagrama</td><td>x</td></tr>
<tr><td>Ride</td><td>5.ª línea (arriba)</td><td>x</td></tr>
<tr><td>Tom agudo (tom 1)</td><td>4.º espacio</td><td>redonda</td></tr>
<tr><td>Tom medio (tom 2)</td><td>4.ª línea</td><td>redonda</td></tr>
<tr><td>Caja</td><td>3.er espacio</td><td>redonda</td></tr>
<tr><td>Tom de piso</td><td>2.º espacio</td><td>redonda</td></tr>
<tr><td>Bombo</td><td>1.er espacio</td><td>redonda</td></tr>
<tr><td>Charles con el pie</td><td>debajo del pentagrama</td><td>x</td></tr></table>
<ul><li><b>Cabezas en x</b> para los platos, <b>cabezas redondas</b> para los tambores.</li>
<li>Cuanto más grave el instrumento, más abajo se coloca: bombo abajo, platos arriba.</li>
<li>A menudo se escriben <b>dos voces</b>: las manos (platos, toms) con plicas hacia <b>arriba</b> y los pies (bombo, charles con el pie) con plicas hacia <b>abajo</b>. La caja puede estar de un lado o del otro según la partitura.</li>
<li>Signos útiles: <b>&gt;</b> acento; <b>o</b> charles abierto; <b>+</b> charles cerrado; una nota entre paréntesis = <b>ghost note</b> (muy suave).</li></ul>
<p>Atención: la ubicación exacta puede variar un poco según la editorial. Una buena partitura da una <b>leyenda</b> al principio.</p>''',
  'see': ['batterie-lire', 'portee', 'figures-notes']},
 {'id': 'batterie-lire', 't': 'Leer un ritmo de batería', 'k': 'bateria leer ritmo groove rock contar redoble fill compas repetir',
  'html': f'''<p>Para leer una partitura de batería se lee <b>de izquierda a derecha</b>, como siempre, pero también <b>de arriba abajo</b>: las notas alineadas verticalmente se tocan <b>a la vez</b>, con miembros distintos.</p>
<ol><li><b>Busca el compás</b> y cuenta los tiempos en voz alta: «1 y 2 y 3 y 4 y». Ver {go('figures-notes','Figuras de nota')}.</li>
<li><b>Lee primero una sola voz</b>: por ejemplo el charles (a menudo regular, en corcheas).</li>
<li><b>Añade el bombo y la caja</b>: fíjate en qué conteo caen (en un ritmo de rock, bombo en 1 y 3, caja en 2 y 4).</li>
<li><b>Toca despacio</b>, con el metrónomo, y luego acelera.</li></ol>
<p><b>Referencias</b>:</p>
<ul><li>El <b>groove</b> (o «beat») es el patrón que se repite. A menudo se escribe una vez y luego se repite con el signo <b>%</b> (repetir el compás anterior).</li>
<li>El <b>redoble</b> (o «fill») es un pasaje más cargado, a menudo en los toms, que anuncia una nueva sección.</li>
<li>Los <b>acentos (&gt;)</b> se tocan más fuerte; las <b>ghost notes</b> (entre paréntesis), muy suave.</li></ul>
<p><b>Para practicar</b>: el módulo Lectura de batería te hace leer y tocar partituras de dificultad progresiva, y el módulo Rudimentos trabaja la técnica de la caja.</p>''',
  'see': ['batterie-portee', 'pulsation', 'syncope']}]}

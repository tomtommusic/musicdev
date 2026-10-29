# Bibliothèque théorique : catégorie « Modes et improvisation » (FR, EN, ES).
# Les exemples ABC sont les mêmes dans les trois langues (noms de notes en lettres, degrés en chiffres).
def go(i, t): return f'<a href="#" data-go="{i}">{t}</a>'

EX = {
 'formules': [
  {'abc': 'X:1\nL:1/4\nK:C\nC D E ^F G A B c |]\nw: 1 2 3 ♯4 5 6 7 1', 'cap': {'fr': 'Do lydien : la 4te augmentée (fa♯) donne la couleur.', 'en': 'C Lydian: the raised 4th (F♯) gives the colour.', 'es': 'Do lidio: la 4.ª aumentada (fa♯) da el color.'}},
  {'abc': 'X:1\nL:1/4\nK:C\nC D E F G A _B c |]\nw: 1 2 3 4 5 6 ♭7 1', 'cap': {'fr': 'Do mixolydien : majeur avec 7e mineure (si♭).', 'en': 'C Mixolydian: major with a flat 7th (B♭).', 'es': 'Do mixolidio: mayor con 7.ª menor (si♭).'}},
  {'abc': 'X:1\nL:1/4\nK:C\nC D _E F G A _B c |]\nw: 1 2 ♭3 4 5 6 ♭7 1', 'cap': {'fr': 'Do dorien : mineur avec 6te majeure (la naturel).', 'en': 'C Dorian: minor with a major 6th (A natural).', 'es': 'Do dórico: menor con 6.ª mayor (la natural).'}},
  {'abc': 'X:1\nL:1/4\nK:C\nC _D _E F G _A _B c |]\nw: 1 ♭2 ♭3 4 5 ♭6 ♭7 1', 'cap': {'fr': 'Do phrygien : mineur avec 2de mineure (ré♭).', 'en': 'C Phrygian: minor with a flat 2nd (D♭).', 'es': 'Do frigio: menor con 2.ª menor (re♭).'}}],
 'accords': [
  {'abc': 'X:1\nL:1/4\nK:C\n"Dm7"D F A c | "G7"G B d f | "Cmaj7"C E G B | "Am7"A, C E G |]', 'cap': {'fr': 'Les accords de la gamme de do : chacun a son mode, avec les mêmes 7 notes.', 'en': 'Chords of the C major scale: each one has its own mode, using the same 7 notes.', 'es': 'Acordes de la escala de do: cada uno tiene su modo, con las mismas 7 notas.'}}],
 'bases': [
  {'abc': 'X:1\nL:1/8\nK:C\n"C"E2 G2 A2 G2 | "F"A2 G2 E4 | "C"E2 G2 A2 c2 | "G"d2 c2 G4 |]', 'cap': {'fr': 'Un motif de 4 notes (pentatonique de do), répété puis varié : question, réponse.', 'en': 'A 4-note motif (C pentatonic), repeated then varied: question, answer.', 'es': 'Un motivo de 4 notas (pentatónica de do), repetido y luego variado: pregunta, respuesta.'}}],
 'penta': [
  {'abc': 'X:1\nL:1/4\nK:C\nA, C D E G A |]\nw: 1 ♭3 4 5 ♭7 1', 'cap': {'fr': 'Pentatonique mineure de la : la do ré mi sol.', 'en': 'A minor pentatonic: A C D E G.', 'es': 'Pentatónica menor de la: la do re mi sol.'}},
  {'abc': 'X:1\nL:1/4\nK:C\nA, C D _E =E G A |]\nw: 1 ♭3 4 ♭5 5 ♭7 1', 'cap': {'fr': 'Gamme blues de la : on ajoute la « blue note » (mi♭).', 'en': 'A blues scale: add the "blue note" (E♭).', 'es': 'Escala de blues de la: se añade la «blue note» (mi♭).'}},
  {'abc': 'X:1\nL:1/4\nK:C\nC D E G A c |]\nw: 1 2 3 5 6 1', 'cap': {'fr': 'Pentatonique majeure de do : les mêmes notes que la pentatonique mineure de la.', 'en': 'C major pentatonic: the same notes as A minor pentatonic.', 'es': 'Pentatónica mayor de do: las mismas notas que la pentatónica menor de la.'}}],
 'grille': [
  {'abc': 'X:1\nL:1/4\nK:C\n"Dm7"F2 A2 | "G7"F2 D2 | "Cmaj7"E4 |]', 'cap': {'fr': 'Notes guides du ii–V–I : la 7e de G7 (fa) descend d\'un demi-ton vers la 3ce de C (mi).', 'en': 'ii–V–I guide tones: the 7th of G7 (F) falls a half step to the 3rd of C (E).', 'es': 'Notas guía del ii–V–I: la 7.ª de G7 (fa) baja un semitono a la 3.ª de C (mi).'}},
  {'abc': 'X:1\nL:1/8\nK:C\n"G7"G B d f e ^d | "C"e4 z4 |]', 'cap': {'fr': 'Arpège de G7, puis note d\'approche chromatique (ré♯) vers la 3ce de C (mi).', 'en': 'G7 arpeggio, then a chromatic approach note (D♯) into the 3rd of C (E).', 'es': 'Arpegio de G7 y luego nota de aproximación cromática (re♯) hacia la 3.ª de C (mi).'}}]}

TOPICS = {
'fr': {'cat': 'Modes et improvisation', 'topics': [
 {'id': 'modes-formules', 'x': 'formules', 't': 'Les modes en formules', 'k': 'modes formule degres ionien dorien phrygien lydien mixolydien eolien locrien parallele clair sombre',
  'html': f'''<p>On peut voir les modes de deux façons. La première, sur les touches blanches (ré à ré, sol à sol…), est expliquée dans {go('modes','Les modes')}. La seconde, plus utile pour improviser, compare chaque mode à la <b>gamme majeure de même tonique</b> : on part toujours de la même note et on note ce qui change.</p>
<table class="lt"><tr><th>Mode</th><th>Formule</th><th>Note caractéristique</th></tr>
<tr><td>Lydien</td><td>1 2 3 <b>♯4</b> 5 6 7</td><td>♯4</td></tr>
<tr><td>Ionien (majeur)</td><td>1 2 3 4 5 6 7</td><td>—</td></tr>
<tr><td>Mixolydien</td><td>1 2 3 4 5 6 <b>♭7</b></td><td>♭7</td></tr>
<tr><td>Dorien</td><td>1 2 ♭3 4 5 <b>6</b> ♭7</td><td>6 (majeure)</td></tr>
<tr><td>Éolien (mineur naturel)</td><td>1 2 ♭3 4 5 ♭6 ♭7</td><td>♭6</td></tr>
<tr><td>Phrygien</td><td>1 <b>♭2</b> ♭3 4 5 ♭6 ♭7</td><td>♭2</td></tr>
<tr><td>Locrien</td><td>1 ♭2 ♭3 4 <b>♭5</b> ♭6 ♭7</td><td>♭5</td></tr></table>
<p>Le tableau va du mode le plus <b>lumineux</b> (lydien) au plus <b>sombre</b> (locrien) : chaque ligne abaisse une note de plus. Les trois premiers sont <b>majeurs</b> (3ce majeure), les quatre suivants <b>mineurs</b> (3ce mineure) ; le locrien a en plus une quinte diminuée.</p>
<p><b>Truc</b> : pour jouer un mode, pense à sa gamme de base (majeure ou mineure) et change seulement la note caractéristique.</p>''',
  'see': ['modes', 'modes-couleurs', 'modes-accords']},
 {'id': 'modes-couleurs', 't': 'Reconnaître la couleur d\'un mode', 'k': 'couleur mode caracteristique bourdon ambiance dorien mixolydien lydien phrygien chanson',
  'html': f'''<p>Chaque mode a une couleur, qu'on entend surtout grâce à sa <b>note caractéristique</b> jouée au-dessus d'une note tenue (un bourdon) ou de l'accord de la tonique.</p>
<ul><li><b>Lydien</b> : rêveur, flottant, « musique de film ». La ♯4 donne une impression d'envol.</li>
<li><b>Ionien</b> : le majeur habituel, stable et joyeux.</li>
<li><b>Mixolydien</b> : majeur mais détendu, un peu « rock » ou folk. On l'entend dans beaucoup de rock classique et de musique celtique.</li>
<li><b>Dorien</b> : mineur mais pas triste, plutôt « cool » : jazz modal, funk, latin, musique traditionnelle.</li>
<li><b>Éolien</b> : le mineur naturel, mélancolique : très courant en pop et en rock.</li>
<li><b>Phrygien</b> : sombre et tendu, avec un parfum espagnol ou métal (la ♭2 juste au-dessus de la tonique).</li>
<li><b>Locrien</b> : instable, rarement utilisé seul ; on le rencontre surtout sur l'accord m7♭5.</li></ul>
<p><b>Pour t'exercer</b> : dans l'Accompagnateur, écris une grille d'un seul accord (par exemple « Dm7 | Dm7 »), choisis « Choisir une gamme… » puis ré dorien, et improvise en insistant sur la note caractéristique (si). Change ensuite pour ré éolien (si♭) et compare.</p>''',
  'see': ['modes-formules', 'modes-accords', 'impro-bases']},
 {'id': 'modes-accords', 'x': 'accords', 't': 'Quel mode sur quel accord ?', 'k': 'mode accord degre diatonique ii V I dominant mineur harmonique phrygien dominant chord scale',
  'html': f'''<p>Les 7 accords d'une gamme majeure utilisent tous les mêmes 7 notes. Mais en partant de la fondamentale de chaque accord, ces notes forment un mode différent. C'est le principe de la relation <b>accord–gamme</b>.</p>
<table class="lt"><tr><th>Degré</th><th>Accord (en do)</th><th>Mode</th></tr>
<tr><td>I</td><td>Cmaj7</td><td>do ionien</td></tr>
<tr><td>ii</td><td>Dm7</td><td>ré dorien</td></tr>
<tr><td>iii</td><td>Em7</td><td>mi phrygien</td></tr>
<tr><td>IV</td><td>Fmaj7</td><td>fa lydien</td></tr>
<tr><td>V</td><td>G7</td><td>sol mixolydien</td></tr>
<tr><td>vi</td><td>Am7</td><td>la éolien</td></tr>
<tr><td>vii</td><td>Bm7♭5</td><td>si locrien</td></tr></table>
<p>Quand la grille reste dans la tonalité, une seule gamme suffit (do majeur ici) : penser en modes sert surtout à <b>viser les bonnes notes</b> de chaque accord. Les modes deviennent indispensables quand un accord sort de la tonalité.</p>
<p><b>En mineur</b> : l'accord de dominante est souvent majeur (E7 en la mineur). On utilise alors le mode de la 5te de la gamme mineure harmonique, le <b>phrygien dominant</b> : mi fa sol♯ la si do ré.</p>
<p><b>Repères rapides</b> : maj7 → ionien (ou lydien) ; m7 → dorien ; 7 → mixolydien ; m7♭5 → locrien.</p>''',
  'see': ['modes-formules', 'impro-grille', 'gammes-mineures']},
 {'id': 'impro-bases', 'x': 'bases', 't': 'Improviser : par où commencer ?', 'k': 'improviser improvisation commencer motif question reponse rythme silence note cible eviter',
  'html': '''<p>Improviser, c'est inventer une mélodie sur le moment, avec des règles qu'on choisit. Quelques étapes simples :</p>
<ol><li><b>Écoute la grille</b> plusieurs fois et trouve la tonalité (la note « maison »).</li>
<li><b>Commence avec peu de notes</b> : la pentatonique (5 notes) ne sonne presque jamais faux.</li>
<li><b>Le rythme avant les notes</b> : une seule note, avec un rythme intéressant, est déjà une phrase.</li>
<li><b>Crée un motif</b> de 2 à 4 notes, puis répète-le et varie-le (autre hauteur, autre rythme, une note de plus).</li>
<li><b>Question–réponse</b> : une phrase qui monte (question), puis une qui redescend et se pose (réponse).</li>
<li><b>Laisse des silences</b> : respirer rend la musique plus claire.</li>
<li><b>Vise les notes de l'accord</b> (fondamentale, 3ce, 5te) sur les temps forts et à la fin des phrases : ce sont les <b>notes cibles</b>. Les autres notes de la gamme servent de passage.</li></ol>
<p><b>Note à éviter</b> : sur un accord majeur, la 4te tenue longtemps frotte avec la 3ce (fa sur un accord de do). Utilise-la en passant, pas comme note d'arrivée.</p>
<p><b>Truc</b> : chante ta phrase avant de la jouer. Ce que tu peux chanter, tu peux le jouer.</p>''',
  'see': ['impro-penta-blues', 'impro-grille', 'modes-couleurs']},
 {'id': 'impro-penta-blues', 'x': 'penta', 't': 'Pentatoniques et gamme blues', 'k': 'pentatonique mineure majeure blues blue note relative position guitare boite rock',
  'html': f'''<p>Les gammes <b>pentatoniques</b> (5 notes) sont le meilleur point de départ : elles n'ont pas de demi-ton, donc presque aucune note ne frotte avec les accords. Voir aussi {go('autres-gammes','Autres gammes')}.</p>
<ul><li><b>Pentatonique mineure</b> (1 ♭3 4 5 ♭7) : sur une grille mineure, un blues ou du rock. La gamme la plus jouée à la guitare.</li>
<li><b>Pentatonique majeure</b> (1 2 3 5 6) : sur une grille majeure, en country, en pop ou en folk.</li>
<li><b>Gamme blues</b> : la pentatonique mineure + la <b>blue note</b> (♭5). Joue-la en passant, entre la 4te et la 5te.</li></ul>
<p><b>Relatives</b> : la pentatonique mineure de la et la pentatonique majeure de do ont les mêmes notes. Seule la note sur laquelle tu te poses change la couleur.</p>
<p><b>À la guitare</b> : la « position 1 » de la pentatonique mineure de la tient entre les cases 5 et 8, avec 2 notes par corde. La tonique (la) est sur la 6e et la 1re corde, case 5, et sur la 4e corde, case 7. Dans l'Accompagnateur, affiche le manche avec la pentatonique mineure pour voir toutes les positions.</p>''',
  'see': ['impro-bases', 'autres-gammes', 'impro-grille']},
 {'id': 'impro-grille', 'x': 'grille', 't': 'Improviser sur une grille d\'accords', 'k': 'improviser grille accords tonalite suivre les accords notes guides arpege approche chromatique ii V I jazz',
  'html': f'''<p>Deux approches, qu'on combine souvent :</p>
<ol><li><b>Une gamme pour toute la grille</b> : si tous les accords appartiennent à la même tonalité (par exemple C–G–Am–F en do majeur), la gamme de cette tonalité ou sa pentatonique marche du début à la fin. C'est simple et efficace en pop, en rock et en folk.</li>
<li><b>Suivre les accords</b> : on change de gamme (de mode) à chaque accord. C'est nécessaire quand un accord sort de la tonalité (E7 dans une grille en do, par exemple), et c'est la base du jazz. Voir {go('modes-accords','Quel mode sur quel accord ?')}</li></ol>
<p><b>Les outils pour « faire entendre » les accords :</b></p>
<ul><li><b>Arpèges</b> : joue les notes de l'accord (1 3 5 7) avant ou pendant le changement.</li>
<li><b>Notes guides</b> : la 3ce et la 7e de chaque accord. D'un accord à l'autre, elles bougent souvent d'un demi-ton ou d'un ton : relie-les et la grille s'entend même sans accompagnement.</li>
<li><b>Notes d'approche</b> : arrive sur une note de l'accord par le demi-ton au-dessus ou au-dessous, juste avant le temps fort.</li></ul>
<p><b>Dans MusiDev</b> : dans l'Accompagnateur, la section « Gammes et modes pour improviser » montre la gamme sur une portée ou sur un manche de guitare ou de basse. Pendant la lecture, les notes de l'accord joué s'allument. Choisis « Tonalité de la grille » pour la première approche, et « Mode de chaque accord » pour la seconde.</p>''',
  'see': ['modes-accords', 'impro-bases', 'impro-penta-blues']}]},

'en': {'cat': 'Modes and improvisation', 'topics': [
 {'id': 'modes-formules', 't': 'Modes as formulas', 'k': 'modes formula degrees ionian dorian phrygian lydian mixolydian aeolian locrian parallel bright dark',
  'html': f'''<p>There are two ways to look at the modes. The first one, on the white keys (D to D, G to G…), is explained in {go('modes','Modes')}. The second one, more useful for improvising, compares each mode with the <b>major scale on the same tonic</b>: you always start from the same note and note what changes.</p>
<table class="lt"><tr><th>Mode</th><th>Formula</th><th>Characteristic note</th></tr>
<tr><td>Lydian</td><td>1 2 3 <b>♯4</b> 5 6 7</td><td>♯4</td></tr>
<tr><td>Ionian (major)</td><td>1 2 3 4 5 6 7</td><td>—</td></tr>
<tr><td>Mixolydian</td><td>1 2 3 4 5 6 <b>♭7</b></td><td>♭7</td></tr>
<tr><td>Dorian</td><td>1 2 ♭3 4 5 <b>6</b> ♭7</td><td>6 (major)</td></tr>
<tr><td>Aeolian (natural minor)</td><td>1 2 ♭3 4 5 ♭6 ♭7</td><td>♭6</td></tr>
<tr><td>Phrygian</td><td>1 <b>♭2</b> ♭3 4 5 ♭6 ♭7</td><td>♭2</td></tr>
<tr><td>Locrian</td><td>1 ♭2 ♭3 4 <b>♭5</b> ♭6 ♭7</td><td>♭5</td></tr></table>
<p>The table goes from the <b>brightest</b> mode (Lydian) to the <b>darkest</b> (Locrian): each row lowers one more note. The first three are <b>major</b> (major 3rd), the next four <b>minor</b> (minor 3rd); Locrian also has a diminished 5th.</p>
<p><b>Tip</b>: to play a mode, think of its basic scale (major or minor) and change only the characteristic note.</p>''',
  'see': ['modes', 'modes-couleurs', 'modes-accords']},
 {'id': 'modes-couleurs', 't': 'Recognising the colour of a mode', 'k': 'colour mode characteristic drone mood dorian mixolydian lydian phrygian song',
  'html': '''<p>Each mode has a colour, which you mostly hear through its <b>characteristic note</b> played over a held note (a drone) or over the tonic chord.</p>
<ul><li><b>Lydian</b>: dreamy, floating, "film music". The ♯4 gives a feeling of lift-off.</li>
<li><b>Ionian</b>: the usual major, stable and happy.</li>
<li><b>Mixolydian</b>: major but laid-back, a bit "rock" or folk. You hear it in lots of classic rock and Celtic music.</li>
<li><b>Dorian</b>: minor but not sad, rather "cool": modal jazz, funk, Latin, traditional music.</li>
<li><b>Aeolian</b>: the natural minor, melancholic: very common in pop and rock.</li>
<li><b>Phrygian</b>: dark and tense, with a Spanish or metal flavour (the ♭2 right above the tonic).</li>
<li><b>Locrian</b>: unstable, rarely used on its own; you mostly meet it over the m7♭5 chord.</li></ul>
<p><b>Practice</b>: in the Backing band, write a one-chord progression (for example "Dm7 | Dm7"), choose "Choose a scale…" then D Dorian, and improvise while stressing the characteristic note (B). Then switch to D Aeolian (B♭) and compare.</p>''',
  'see': ['modes-formules', 'modes-accords', 'impro-bases']},
 {'id': 'modes-accords', 't': 'Which mode over which chord?', 'k': 'mode chord degree diatonic ii V I dominant harmonic minor phrygian dominant chord scale',
  'html': f'''<p>The 7 chords of a major scale all use the same 7 notes. But starting from the root of each chord, these notes form a different mode. This is the <b>chord–scale</b> relationship.</p>
<table class="lt"><tr><th>Degree</th><th>Chord (in C)</th><th>Mode</th></tr>
<tr><td>I</td><td>Cmaj7</td><td>C Ionian</td></tr>
<tr><td>ii</td><td>Dm7</td><td>D Dorian</td></tr>
<tr><td>iii</td><td>Em7</td><td>E Phrygian</td></tr>
<tr><td>IV</td><td>Fmaj7</td><td>F Lydian</td></tr>
<tr><td>V</td><td>G7</td><td>G Mixolydian</td></tr>
<tr><td>vi</td><td>Am7</td><td>A Aeolian</td></tr>
<tr><td>vii</td><td>Bm7♭5</td><td>B Locrian</td></tr></table>
<p>When the progression stays in the key, one scale is enough (C major here): thinking in modes mainly helps you <b>aim for the right notes</b> of each chord. Modes become essential when a chord leaves the key.</p>
<p><b>In minor</b>: the dominant chord is often major (E7 in A minor). You then use the mode built on the 5th degree of the harmonic minor scale, <b>Phrygian dominant</b>: E F G♯ A B C D.</p>
<p><b>Quick guide</b>: maj7 → Ionian (or Lydian); m7 → Dorian; 7 → Mixolydian; m7♭5 → Locrian.</p>''',
  'see': ['modes-formules', 'impro-grille', 'gammes-mineures']},
 {'id': 'impro-bases', 't': 'Improvising: where to start?', 'k': 'improvise improvisation start motif question answer rhythm silence target note avoid',
  'html': '''<p>Improvising means making up a melody on the spot, with rules you choose. A few simple steps:</p>
<ol><li><b>Listen to the progression</b> several times and find the key (the "home" note).</li>
<li><b>Start with few notes</b>: the pentatonic scale (5 notes) almost never sounds wrong.</li>
<li><b>Rhythm before notes</b>: a single note with an interesting rhythm is already a phrase.</li>
<li><b>Make a motif</b> of 2 to 4 notes, then repeat it and vary it (different pitch, different rhythm, one more note).</li>
<li><b>Question and answer</b>: a phrase that rises (question), then one that comes back down and lands (answer).</li>
<li><b>Leave silences</b>: breathing makes the music clearer.</li>
<li><b>Aim for chord tones</b> (root, 3rd, 5th) on strong beats and at the end of phrases: these are <b>target notes</b>. The other scale notes are passing notes.</li></ol>
<p><b>Avoid note</b>: over a major chord, the 4th held for a long time clashes with the 3rd (F over a C chord). Use it in passing, not as a landing note.</p>
<p><b>Tip</b>: sing your phrase before you play it. If you can sing it, you can play it.</p>''',
  'see': ['impro-penta-blues', 'impro-grille', 'modes-couleurs']},
 {'id': 'impro-penta-blues', 't': 'Pentatonic and blues scales', 'k': 'pentatonic minor major blues blue note relative position guitar box rock',
  'html': f'''<p><b>Pentatonic</b> scales (5 notes) are the best place to start: they have no half steps, so almost no note clashes with the chords. See also {go('autres-gammes','Other scales')}.</p>
<ul><li><b>Minor pentatonic</b> (1 ♭3 4 5 ♭7): over a minor progression, a blues or rock. The most played scale on guitar.</li>
<li><b>Major pentatonic</b> (1 2 3 5 6): over a major progression, in country, pop or folk.</li>
<li><b>Blues scale</b>: the minor pentatonic + the <b>blue note</b> (♭5). Play it in passing, between the 4th and the 5th.</li></ul>
<p><b>Relatives</b>: A minor pentatonic and C major pentatonic have the same notes. Only the note you land on changes the colour.</p>
<p><b>On guitar</b>: "position 1" of A minor pentatonic sits between frets 5 and 8, with 2 notes per string. The tonic (A) is on the 6th and 1st strings at fret 5, and on the 4th string at fret 7. In the Backing band, show the fretboard with the minor pentatonic to see every position.</p>''',
  'see': ['impro-bases', 'autres-gammes', 'impro-grille']},
 {'id': 'impro-grille', 't': 'Improvising over a chord progression', 'k': 'improvise progression chords key follow the changes guide tones arpeggio chromatic approach ii V I jazz',
  'html': f'''<p>Two approaches, often combined:</p>
<ol><li><b>One scale for the whole progression</b>: if all the chords belong to the same key (for example C–G–Am–F in C major), the scale of that key or its pentatonic works from start to finish. Simple and effective in pop, rock and folk.</li>
<li><b>Following the changes</b>: you change scale (mode) on each chord. It is necessary when a chord leaves the key (E7 in a C progression, for example), and it is the basis of jazz. See {go('modes-accords','Which mode over which chord?')}</li></ol>
<p><b>Tools to make the chords heard:</b></p>
<ul><li><b>Arpeggios</b>: play the chord tones (1 3 5 7) before or during the change.</li>
<li><b>Guide tones</b>: the 3rd and 7th of each chord. From one chord to the next they often move by a half or whole step: connect them and the progression can be heard even without accompaniment.</li>
<li><b>Approach notes</b>: arrive on a chord tone from a half step above or below, just before the strong beat.</li></ul>
<p><b>In MusiDev</b>: in the Backing band, the "Scales and modes for improvising" section shows the scale on a staff or on a guitar or bass fretboard. During playback, the notes of the current chord light up. Choose "Key of the progression" for the first approach and "Mode of each chord" for the second.</p>''',
  'see': ['modes-accords', 'impro-bases', 'impro-penta-blues']}]},

'es': {'cat': 'Modos e improvisación', 'topics': [
 {'id': 'modes-formules', 't': 'Los modos en fórmulas', 'k': 'modos formula grados jonico dorico frigio lidio mixolidio eolico locrio paralelo claro oscuro',
  'html': f'''<p>Hay dos maneras de ver los modos. La primera, en las teclas blancas (de re a re, de sol a sol…), se explica en {go('modes','Los modos')}. La segunda, más útil para improvisar, compara cada modo con la <b>escala mayor de la misma tónica</b>: se parte siempre de la misma nota y se anota lo que cambia.</p>
<table class="lt"><tr><th>Modo</th><th>Fórmula</th><th>Nota característica</th></tr>
<tr><td>Lidio</td><td>1 2 3 <b>♯4</b> 5 6 7</td><td>♯4</td></tr>
<tr><td>Jónico (mayor)</td><td>1 2 3 4 5 6 7</td><td>—</td></tr>
<tr><td>Mixolidio</td><td>1 2 3 4 5 6 <b>♭7</b></td><td>♭7</td></tr>
<tr><td>Dórico</td><td>1 2 ♭3 4 5 <b>6</b> ♭7</td><td>6 (mayor)</td></tr>
<tr><td>Eólico (menor natural)</td><td>1 2 ♭3 4 5 ♭6 ♭7</td><td>♭6</td></tr>
<tr><td>Frigio</td><td>1 <b>♭2</b> ♭3 4 5 ♭6 ♭7</td><td>♭2</td></tr>
<tr><td>Locrio</td><td>1 ♭2 ♭3 4 <b>♭5</b> ♭6 ♭7</td><td>♭5</td></tr></table>
<p>La tabla va del modo más <b>luminoso</b> (lidio) al más <b>oscuro</b> (locrio): cada fila baja una nota más. Los tres primeros son <b>mayores</b> (3.ª mayor) y los cuatro siguientes <b>menores</b> (3.ª menor); el locrio además tiene la quinta disminuida.</p>
<p><b>Truco</b>: para tocar un modo, piensa en su escala de base (mayor o menor) y cambia solo la nota característica.</p>''',
  'see': ['modes', 'modes-couleurs', 'modes-accords']},
 {'id': 'modes-couleurs', 't': 'Reconocer el color de un modo', 'k': 'color modo caracteristica bordon ambiente dorico mixolidio lidio frigio cancion',
  'html': '''<p>Cada modo tiene un color, que se oye sobre todo gracias a su <b>nota característica</b> tocada sobre una nota tenida (un bordón) o sobre el acorde de tónica.</p>
<ul><li><b>Lidio</b>: soñador, flotante, «música de película». El ♯4 da una sensación de despegue.</li>
<li><b>Jónico</b>: el mayor de siempre, estable y alegre.</li>
<li><b>Mixolidio</b>: mayor pero relajado, algo «rock» o folk. Se oye en mucho rock clásico y en la música celta.</li>
<li><b>Dórico</b>: menor pero no triste, más bien «cool»: jazz modal, funk, música latina, música tradicional.</li>
<li><b>Eólico</b>: el menor natural, melancólico: muy común en pop y rock.</li>
<li><b>Frigio</b>: oscuro y tenso, con sabor español o metal (el ♭2 justo encima de la tónica).</li>
<li><b>Locrio</b>: inestable, poco usado solo; aparece sobre todo sobre el acorde m7♭5.</li></ul>
<p><b>Para practicar</b>: en el Acompañante, escribe una progresión de un solo acorde (por ejemplo «Dm7 | Dm7»), elige «Elegir una escala…» y luego re dórico, e improvisa insistiendo en la nota característica (si). Después cambia a re eólico (si♭) y compara.</p>''',
  'see': ['modes-formules', 'modes-accords', 'impro-bases']},
 {'id': 'modes-accords', 't': '¿Qué modo sobre qué acorde?', 'k': 'modo acorde grado diatonico ii V I dominante menor armonica frigio dominante acorde escala',
  'html': f'''<p>Los 7 acordes de una escala mayor usan las mismas 7 notas. Pero partiendo de la fundamental de cada acorde, esas notas forman un modo distinto. Es la relación <b>acorde–escala</b>.</p>
<table class="lt"><tr><th>Grado</th><th>Acorde (en do)</th><th>Modo</th></tr>
<tr><td>I</td><td>Cmaj7</td><td>do jónico</td></tr>
<tr><td>ii</td><td>Dm7</td><td>re dórico</td></tr>
<tr><td>iii</td><td>Em7</td><td>mi frigio</td></tr>
<tr><td>IV</td><td>Fmaj7</td><td>fa lidio</td></tr>
<tr><td>V</td><td>G7</td><td>sol mixolidio</td></tr>
<tr><td>vi</td><td>Am7</td><td>la eólico</td></tr>
<tr><td>vii</td><td>Bm7♭5</td><td>si locrio</td></tr></table>
<p>Cuando la progresión se queda en la tonalidad, basta una sola escala (do mayor aquí): pensar en modos sirve sobre todo para <b>apuntar a las notas correctas</b> de cada acorde. Los modos se vuelven imprescindibles cuando un acorde sale de la tonalidad.</p>
<p><b>En menor</b>: el acorde de dominante suele ser mayor (E7 en la menor). Se usa entonces el modo del 5.º grado de la escala menor armónica, el <b>frigio dominante</b>: mi fa sol♯ la si do re.</p>
<p><b>Guía rápida</b>: maj7 → jónico (o lidio); m7 → dórico; 7 → mixolidio; m7♭5 → locrio.</p>''',
  'see': ['modes-formules', 'impro-grille', 'gammes-mineures']},
 {'id': 'impro-bases', 't': 'Improvisar: ¿por dónde empezar?', 'k': 'improvisar improvisacion empezar motivo pregunta respuesta ritmo silencio nota objetivo evitar',
  'html': '''<p>Improvisar es inventar una melodía en el momento, con reglas que uno elige. Algunos pasos sencillos:</p>
<ol><li><b>Escucha la progresión</b> varias veces y encuentra la tonalidad (la nota «casa»).</li>
<li><b>Empieza con pocas notas</b>: la pentatónica (5 notas) casi nunca suena mal.</li>
<li><b>El ritmo antes que las notas</b>: una sola nota con un ritmo interesante ya es una frase.</li>
<li><b>Crea un motivo</b> de 2 a 4 notas, luego repítelo y varíalo (otra altura, otro ritmo, una nota más).</li>
<li><b>Pregunta y respuesta</b>: una frase que sube (pregunta) y otra que vuelve a bajar y se posa (respuesta).</li>
<li><b>Deja silencios</b>: respirar hace la música más clara.</li>
<li><b>Apunta a las notas del acorde</b> (fundamental, 3.ª, 5.ª) en los tiempos fuertes y al final de las frases: son las <b>notas objetivo</b>. Las demás notas de la escala sirven de paso.</li></ol>
<p><b>Nota a evitar</b>: sobre un acorde mayor, la 4.ª tenida mucho tiempo choca con la 3.ª (fa sobre un acorde de do). Úsala de paso, no como nota de llegada.</p>
<p><b>Truco</b>: canta tu frase antes de tocarla. Lo que puedes cantar, lo puedes tocar.</p>''',
  'see': ['impro-penta-blues', 'impro-grille', 'modes-couleurs']},
 {'id': 'impro-penta-blues', 't': 'Pentatónicas y escala de blues', 'k': 'pentatonica menor mayor blues blue note relativa posicion guitarra caja rock',
  'html': f'''<p>Las escalas <b>pentatónicas</b> (5 notas) son el mejor punto de partida: no tienen semitonos, así que casi ninguna nota choca con los acordes. Ver también {go('autres-gammes','Otras escalas')}.</p>
<ul><li><b>Pentatónica menor</b> (1 ♭3 4 5 ♭7): sobre una progresión menor, un blues o rock. La escala más tocada en la guitarra.</li>
<li><b>Pentatónica mayor</b> (1 2 3 5 6): sobre una progresión mayor, en country, pop o folk.</li>
<li><b>Escala de blues</b>: la pentatónica menor + la <b>blue note</b> (♭5). Tócala de paso, entre la 4.ª y la 5.ª.</li></ul>
<p><b>Relativas</b>: la pentatónica menor de la y la pentatónica mayor de do tienen las mismas notas. Solo la nota en la que te posas cambia el color.</p>
<p><b>En la guitarra</b>: la «posición 1» de la pentatónica menor de la está entre los trastes 5 y 8, con 2 notas por cuerda. La tónica (la) está en la 6.ª y la 1.ª cuerda, traste 5, y en la 4.ª cuerda, traste 7. En el Acompañante, muestra el mástil con la pentatónica menor para ver todas las posiciones.</p>''',
  'see': ['impro-bases', 'autres-gammes', 'impro-grille']},
 {'id': 'impro-grille', 't': 'Improvisar sobre una progresión de acordes', 'k': 'improvisar progresion acordes tonalidad seguir los acordes notas guia arpegio aproximacion cromatica ii V I jazz',
  'html': f'''<p>Dos enfoques, que a menudo se combinan:</p>
<ol><li><b>Una escala para toda la progresión</b>: si todos los acordes pertenecen a la misma tonalidad (por ejemplo C–G–Am–F en do mayor), la escala de esa tonalidad o su pentatónica funciona de principio a fin. Sencillo y eficaz en pop, rock y folk.</li>
<li><b>Seguir los acordes</b>: se cambia de escala (de modo) en cada acorde. Es necesario cuando un acorde sale de la tonalidad (E7 en una progresión en do, por ejemplo), y es la base del jazz. Ver {go('modes-accords','¿Qué modo sobre qué acorde?')}</li></ol>
<p><b>Herramientas para «hacer oír» los acordes:</b></p>
<ul><li><b>Arpegios</b>: toca las notas del acorde (1 3 5 7) antes o durante el cambio.</li>
<li><b>Notas guía</b>: la 3.ª y la 7.ª de cada acorde. De un acorde a otro suelen moverse un semitono o un tono: únelas y la progresión se oye incluso sin acompañamiento.</li>
<li><b>Notas de aproximación</b>: llega a una nota del acorde desde el semitono de arriba o de abajo, justo antes del tiempo fuerte.</li></ul>
<p><b>En MusiDev</b>: en el Acompañante, la sección «Escalas y modos para improvisar» muestra la escala en un pentagrama o en un mástil de guitarra o de bajo. Durante la reproducción se iluminan las notas del acorde que suena. Elige «Tonalidad de la progresión» para el primer enfoque y «Modo de cada acorde» para el segundo.</p>''',
  'see': ['modes-accords', 'impro-bases', 'impro-penta-blues']}]}}

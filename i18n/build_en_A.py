import json, copy, os
D = os.path.dirname(os.path.abspath(__file__))
fr = json.load(open(os.path.join(D, 'lib_fr_A.json')))

CAT = {'lecture': 'Reading', 'rythme': 'Rhythm', 'gammes': 'Scales and keys'}

# Each topic: t, title, k, html, ex = list of (abc_replacements, cap)
T = {}

T['lire-partition'] = dict(
t="Reading a score",
title="Reading a score: overview",
k="symbols score sheet music staff reading overview",
html="""<p>You read a score like a text: left to right, line after line. Before you play the first note, take a few seconds to spot the information placed at the beginning.</p>
<ol>
<li><b>The staff</b>: the 5 lines the notes are written on (<a href="#" data-go="portee">The staff</a>).</li>
<li><b>The clef</b>, at the very beginning: it sets the names of the notes (<a href="#" data-go="cles">Clefs</a>).</li>
<li><b>The key signature</b>, right after the clef: the sharps or flats that apply to the whole piece. It tells you the key (<a href="#" data-go="armures">Key signatures</a>).</li>
<li><b>The time signature</b>: how many beats per measure and which note value gets one beat (<a href="#" data-go="mesures-simples">Simple meters</a>).</li>
<li><b>The tempo marking</b>, above the staff: the speed (<a href="#" data-go="tempo">Tempo</a>).</li>
<li><b>The dynamics</b>, below the staff: the volume (<a href="#" data-go="nuances">Dynamics</a>).</li>
<li><b>The notes and rests</b>: their position gives the pitch, their shape gives the duration (<a href="#" data-go="figures-notes">Note values</a>, <a href="#" data-go="silences">Rest values</a>).</li>
<li><b>The bar lines</b>, slurs and ties, articulations and repeat signs (<a href="#" data-go="barres">Bar lines</a>, <a href="#" data-go="reprises">Repeats</a>).</li>
</ol>
<p><b>Sight-reading tip</b>: before you start, find the key, the time signature, the hardest rhythm and the big leaps. Count one empty measure to set the pulse, then don't stop: you fix mistakes on the next read-through.</p>""",
ex=[([('T:Petite pièce', 'T:Little Piece')],
     "Title, tempo, treble clef, key signature (one sharp: G major), 3/4 time, dynamics, slur, rest, staccato and repeat bar lines.")])

T['portee'] = dict(
t="The staff", title=None,
k="staff lines spaces",
html="""<p>The <b>staff</b> is made of <b>5 horizontal lines</b> and <b>4 spaces</b> (the gaps between the lines). They are always counted <b>from bottom to top</b>: the 1<sup>st</sup> line is the lowest.</p>
<p>The higher a note sits on the staff, the higher it sounds. A note can be <b>on a line</b> (the line goes through it) or <b>in a space</b>. To go higher or lower than the staff, you add small <a href="#" data-go="lignes-sup">ledger lines</a>.</p>
<p>The staff alone doesn't tell you which notes are written: the <a href="#" data-go="cles">clef</a> gives the names of the lines.</p>""",
ex=[([('w: 1re 2e 3e 4e 5e', 'w: 1st 2nd 3rd 4th 5th')], "The 5 lines in treble clef: E, G, B, D, F."),
    ([('w: 1er 2e 3e 4e', 'w: 1st 2nd 3rd 4th')], "The 4 spaces: F, A, C, E.")])

T['cles'] = dict(
t="Clefs", title=None,
k="clef treble bass c clef alto tenor",
html="""<p>The <b>clef</b> gives the name of one line; all the other notes are worked out from it.</p>
<ul>
<li><b>Treble clef</b> (G clef, 2<sup>nd</sup> line): the note on the 2<sup>nd</sup> line is the <b>G</b> above middle C. Used for high voices, flute, violin, trumpet, the piano's right hand…</li>
<li><b>Bass clef</b> (F clef, 4<sup>th</sup> line): the note on the 4<sup>th</sup> line is the <b>F</b> below middle C. Used for low voices, double bass, bassoon, trombone, the piano's left hand…</li>
<li><b>C clef on the 3<sup>rd</sup> line</b> (alto clef): the 3<sup>rd</sup> line is <b>middle C</b>. Used mostly by the viola.</li>
<li><b>C clef on the 4<sup>th</sup> line</b> (tenor clef): the 4<sup>th</sup> line is middle C. Used for high passages on cello, bassoon and trombone.</li>
</ul>
<p>Tip for bass clef: the lines read <b>G, B, D, F, A</b> (“Good Boys Do Fine Always”) and the spaces <b>A, C, E, G</b> (“All Cows Eat Grass”).</p>""",
ex=[([('w: sol fa ut~3 ut~4', 'w: treble bass alto tenor')], "The same middle C written in all four clefs."),
    ([('w: sol si ré fa la', 'w: G B D F A')], "The lines in bass clef.")])

T['noms-notes'] = dict(
t="Note names", title=None,
k="note names letters c d e f g a b do re mi fa sol la si solfege octave",
html="""<p>There are <b>7 note names</b> that keep coming back in the same order: <b>C, D, E, F, G, A, B</b>, then C again, one octave higher.</p>
<p>In English-speaking countries and in jazz, notes are named with <b>letters</b>. In French and many other languages, they use solfège syllables instead:</p>
<table class="lt"><tr><th>French</th><td>do</td><td>ré</td><td>mi</td><td>fa</td><td>sol</td><td>la</td><td>si</td></tr>
<tr><th>Letters</th><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>A</td><td>B</td></tr></table>
<p>Watch out: in German, B means B♭ and H means B.</p>
<p><b>Octaves.</b> To give the exact pitch, you add an octave number. Depending on the book, middle C on the piano is called <b>do3</b> (French tradition) or <b>C4</b> (scientific pitch notation, common in North America). Always check which system your textbook uses.</p>
<p>The <b>reference A</b> used to tune instruments (A4, or la3 in the French system) vibrates at 440 Hz.</p>""",
ex=[([], "One octave from C to C, with both naming systems.")])

T['lignes-sup'] = dict(
t="Ledger lines", title=None,
k="ledger lines additional lines above below staff",
html="""<p>When a note goes past the staff, you draw <b>short ledger lines</b> above or below it. You keep counting lines and spaces just like on the staff.</p>
<p><b>Middle C</b> is written on a ledger line: below the staff in treble clef and above the staff in bass clef.</p>
<p>Beyond three or four ledger lines, it's better to change clef or use the marking <b>8va</b> (play an octave higher) or <b>8vb</b> (an octave lower).</p>""",
ex=[([('w: la si do ré sol la si do', 'w: A B C D G A B C')],
     "In treble clef: below the staff (A, B, middle C, D) and above it (G, A, B, C).")])

T['grand-systeme'] = dict(
t="The grand staff (piano)", title=None,
k="grand staff brace piano right hand left hand middle c",
html="""<p>The piano uses two staves joined by a <b>brace</b>: treble clef on top (usually the right hand) and bass clef below (usually the left hand). This is the <b>grand staff</b>.</p>
<p><b>Middle C</b> sits exactly between the two staves: one ledger line below the treble clef staff, or one ledger line above the bass clef staff. It's the same key on the piano.</p>""",
ex=[([], "Middle C written in each staff, then the two hands moving apart.")])

T['clavier'] = dict(
t="The keyboard", title=None,
k="piano keyboard white black keys half step",
html="""<p>On a keyboard, the <b>black keys</b> are grouped in <b>2s</b> and <b>3s</b>. <b>C</b> is the white key just to the left of a group of 2 black keys; <b>F</b> is just to the left of a group of 3.</p>
<p>Two neighboring keys (white or black) are a <b>half step</b> apart. Between <b>E and F</b> and between <b>B and C</b>, there is no black key: these are natural half steps (<a href="#" data-go="tons-demitons">Whole steps and half steps</a>).</p>
<p>A black key has two names: C♯ = D♭, D♯ = E♭, etc. (<a href="#" data-go="alterations">enharmonics</a>). Try the keyboard below.</p>
<div data-piano="48,71"></div>""",
ex=[])

T['alterations'] = dict(
t="Accidentals", title=None,
k="accidentals sharp flat natural double sharp double flat enharmonic",
html="""<p>An <b>accidental</b> changes the pitch of a note:</p>
<table class="lt"><tr><th>♯</th><td><b>sharp</b>: raises the note by a half step</td></tr>
<tr><th>♭</th><td><b>flat</b>: lowers the note by a half step</td></tr>
<tr><th>♮</th><td><b>natural</b>: cancels the sharp or flat, the note becomes natural again</td></tr>
<tr><th>𝄪</th><td><b>double sharp</b>: raises by two half steps</td></tr>
<tr><th>𝄫</th><td><b>double flat</b>: lowers by two half steps</td></tr></table>
<ul><li>Placed in the <a href="#" data-go="armures">key signature</a>, accidentals apply to the whole piece, in every octave.</li>
<li>Placed in front of a note (an <b>accidental</b> in the strict sense), they last until the end of the measure, for that note in that octave only.</li></ul>
<p><b>Enharmonics</b>: two names for the same sound. C♯ and D♭ sound the same on the piano, but you choose one or the other depending on the key and the direction of the melody.</p>""",
ex=[([('w: fa♯ si♭ si♮ fa𝄪 si𝄫', 'w: F♯ B♭ B♮ F𝄪 B𝄫')], "Sharp, flat, natural, double sharp, double flat."),
    ([('w: do♯ ré♭ fa♯ sol♭', 'w: C♯ D♭ F♯ G♭')], "Enharmonic notes: same sound, different name.")])

T['transpositeurs'] = dict(
t="Transposing instruments", title=None,
k="b flat e flat f clarinet trumpet saxophone horn transposition transposing",
html="""<p>Some instruments read one note but make another one sound: these are <b>transposing instruments</b>. An instrument is said to be “in B♭” when its written C sounds as B♭.</p>
<table class="lt"><tr><th>Instrument</th><th>Written C sounds…</th></tr>
<tr><td>B♭ clarinet, B♭ trumpet, soprano sax</td><td>B♭: a <b>major second lower</b></td></tr>
<tr><td>Tenor sax (B♭)</td><td>a <b>major ninth lower</b> (octave + second)</td></tr>
<tr><td>Alto sax (E♭)</td><td>E♭: a <b>major sixth lower</b></td></tr>
<tr><td>Baritone sax (E♭)</td><td>an octave + a major sixth lower</td></tr>
<tr><td>Horn in F</td><td>F: a <b>perfect fifth lower</b></td></tr></table>
<p>To play together, each musician gets a part that's already transposed. In MusicDEV, the <b>Student instrument (mic)</b> setting takes this transposition into account: you read the written note for your instrument and the mic compares it with the real sound.</p>""",
ex=[])

T['pulsation'] = dict(
t="Pulse, beats and measures", title=None,
k="pulse beat strong weak downbeat counting conducting",
html="""<p>The <b>pulse</b> is the steady beat you feel when you listen to music, the one you follow by tapping your foot. Each pulse is a <b>beat</b>.</p>
<p>Beats are grouped into <b>measures</b> of 2, 3 or 4 beats. The <b>1<sup>st</sup> beat</b> of the measure is the <b>strong beat</b> (downbeat): that's where you feel the weight. The others are weaker. In 4/4: <b>strong</b> – weak – <b>medium-strong</b> – weak.</p>
<p><b>Counting</b>: say the beat numbers (“1, 2, 3, 4”) and add “and” for half beats (“1 and 2 and”). For quarter beats: “1 e and a”.</p>
<p>In the Rhythm reading module, keep the pulse in your body (foot, head) while you clap the rhythm with your hands.</p>""",
ex=[([('w: 1 2 3 4 1 et 2 et 3 et 4 et 1 2 et 3', 'w: 1 2 3 4 1 & 2 & 3 & 4 & 1 2 & 3')], "Counting beats and half beats.")])

T['figures-notes'] = dict(
t="Note values", title=None,
k="whole half quarter eighth sixteenth thirty-second note duration value stem flag beam",
html="""<p>The shape of a note shows its <b>duration</b>. Each note value is worth half of the one before:</p>
<table class="lt"><tr><th>Note</th><th>Value (in quarter notes)</th><th>Equals</th></tr>
<tr><td>Whole note</td><td>4</td><td>2 half notes</td></tr>
<tr><td>Half note</td><td>2</td><td>2 quarter notes</td></tr>
<tr><td>Quarter note</td><td>1</td><td>2 eighth notes</td></tr>
<tr><td>Eighth note</td><td>½</td><td>2 sixteenth notes</td></tr>
<tr><td>Sixteenth note</td><td>¼</td><td>2 thirty-second notes</td></tr>
<tr><td>Thirty-second note</td><td>⅛</td><td></td></tr></table>
<p>A note is made of a <b>notehead</b> (hollow or filled), sometimes a <b>stem</b> (the vertical line) and <b>flags</b>. When several eighth notes follow each other within the same beat, the flags are replaced by a <b>beam</b> that shows the grouping by beat.</p>
<p>Stem: up, on the right of the notehead, if the note is below the 3<sup>rd</sup> line; down, on the left, from the 3<sup>rd</sup> line up.</p>""",
ex=[([], "Whole note, 2 half notes, 4 quarter notes, 8 eighth notes: each measure lasts 4 beats."),
    ([], "Eighth notes and sixteenth notes grouped by beat with beams.")])

T['silences'] = dict(
t="Rest values", title=None,
k="rests whole half quarter eighth sixteenth thirty-second rest",
html="""<p>Each note value has a matching <b>rest</b> of the same duration:</p>
<table class="lt"><tr><th>Note</th><th>Rest</th><th>Duration (in quarter notes)</th></tr>
<tr><td>Whole note</td><td><b>Whole rest</b> (rectangle hanging below the 4<sup>th</sup> line)</td><td>4</td></tr>
<tr><td>Half note</td><td><b>Half rest</b> (rectangle sitting on the 3<sup>rd</sup> line)</td><td>2</td></tr>
<tr><td>Quarter note</td><td><b>Quarter rest</b></td><td>1</td></tr>
<tr><td>Eighth note</td><td><b>Eighth rest</b></td><td>½</td></tr>
<tr><td>Sixteenth note</td><td><b>Sixteenth rest</b></td><td>¼</td></tr>
<tr><td>Thirty-second note</td><td><b>Thirty-second rest</b></td><td>⅛</td></tr></table>
<p>The <b>whole rest</b> is also used to show <b>a full measure of silence</b>, whatever the meter (3/4, 6/8…).</p>
<p>Tip: the whole rest “hangs” like a heavy object; the half rest “sits” like a hat.</p>""",
ex=[([], "Whole rest, half rests, quarter rests, eighth rests, sixteenth rests.")])

T['points-liaisons'] = dict(
t="Dots and ties", title=None,
k="dotted note double dot tie slur phrase legato",
html="""<p><b>A dot</b> placed after a note or rest adds <b>half of its value</b>:</p>
<ul><li>dotted half note = 2 + 1 = <b>3 beats</b></li><li>dotted quarter note = 1 + ½ = <b>1½ beats</b></li><li>dotted eighth note = ½ + ¼ = <b>¾ of a beat</b> (often followed by a sixteenth note)</li></ul>
<p><b>A double dot</b> adds half, then a quarter of the value: double-dotted quarter note = 1 + ½ + ¼ = 1¾ beats.</p>
<p><b>A tie</b> connects two notes <b>of the same pitch</b>: you play the first one and hold it for the length of both. It lets a note last across a bar line.</p>
<p><b>A slur</b> (or phrase mark) connects notes <b>of different pitches</b>: you play them smoothly connected (legato), without breaking the sound between them.</p>""",
ex=[([], "Dotted quarter + eighth, dotted half + quarter, then a tie and a slur.")])

T['mesures-simples'] = dict(
t="Simple meters", title=None,
k="time signature simple meter 2/4 3/4 4/4 common time cut time alla breve",
html="""<p>The <b>time signature</b> is placed after the key signature. In a <b>simple meter</b>, each beat divides into <b>two</b>.</p>
<ul><li>The <b>top</b> number = the <b>number of beats</b> per measure.</li>
<li>The <b>bottom</b> number = the note value that gets <b>one beat</b>: 2 = half note, 4 = quarter note, 8 = eighth note.</li></ul>
<table class="lt"><tr><th>Meter</th><th>Beats</th><th>Beat unit</th></tr>
<tr><td>2/4</td><td>2</td><td>quarter note (march)</td></tr>
<tr><td>3/4</td><td>3</td><td>quarter note (waltz, minuet)</td></tr>
<tr><td>4/4 or <b>C</b></td><td>4</td><td>quarter note (the most common)</td></tr>
<tr><td>2/2 or <b>¢</b> (alla breve)</td><td>2</td><td>half note</td></tr></table>""",
ex=[([], "2/4, 3/4, 4/4 and alla breve.")])

T['mesures-composees'] = dict(
t="Compound meters", title=None,
k="compound meter 6/8 9/8 12/8 dotted quarter triple division",
html="""<p>In a <b>compound meter</b>, each beat divides into <b>three</b>. The beat unit is a <b>dotted note</b> (most often the dotted quarter note).</p>
<ul><li>Top number ÷ 3 = <b>number of beats</b>.</li><li>The bottom number shows the note value worth <b>one third of a beat</b> (8 = eighth note).</li></ul>
<table class="lt"><tr><th>Meter</th><th>Beats</th><th>Beat unit</th><th>Division</th></tr>
<tr><td>6/8</td><td>2</td><td>dotted quarter note</td><td>3 eighth notes per beat</td></tr>
<tr><td>9/8</td><td>3</td><td>dotted quarter note</td><td>3 eighth notes per beat</td></tr>
<tr><td>12/8</td><td>4</td><td>dotted quarter note</td><td>3 eighth notes per beat</td></tr>
<tr><td>6/4</td><td>2</td><td>dotted half note</td><td>3 quarter notes per beat</td></tr></table>
<p>Watch out: 6/8 isn't “6 eighth-note beats” played fast, but <b>2 big beats</b> that swing: “<b>1</b> 2 3 <b>4</b> 5 6”.</p>""",
ex=[([], "6/8 (two dotted-quarter beats), 9/8 and 12/8.")])

T['nolets'] = dict(
t="Triplets and other tuplets", title=None,
k="triplet duplet quintuplet sextuplet tuplet irregular division",
html="""<p>A <b>tuplet</b> divides a duration in an unusual way. It's shown by a number above the group.</p>
<ul><li><b>Triplet</b> (3): <b>3 notes in the time of 2</b>. In 4/4, an eighth-note triplet fills one beat; a quarter-note triplet fills two beats.</li>
<li><b>Duplet</b> (2): <b>2 notes in the time of 3</b>, used in compound meter.</li>
<li><b>Quintuplet</b> (5), <b>sextuplet</b> (6)…: 5 or 6 notes in the time of 4.</li></ul>
<p>To play a triplet well, think of the word “tri-pl-et” (or “straw-ber-ry”) spread evenly over the beat.</p>""",
ex=[([], "Eighth-note triplet (one beat), then quarter-note triplet (two beats)."),
    ([], "Duplet in 6/8: two eighth notes in the time of three.")])

T['syncope'] = dict(
t="Syncopation and offbeats", title=None,
k="syncopation offbeat shifted accent",
html="""<p>A <b>syncopation</b> is a note that starts on a <b>weak</b> part of the beat (or on a weak beat) and is held into the next <b>strong</b> part. The accent is shifted: you feel things are off. Classic example: eighth – quarter – eighth.</p>
<p>An <b>offbeat</b> note is played on the weak part, after a rest on the strong part (eighth rest – eighth note). The note isn't held over.</p>
<p>Tip: count the “ands” out loud (“1 and 2 and”) and place the note on the “and” without cutting it short.</p>""",
ex=[([], "Two syncopations (eighth – quarter – eighth), then offbeats.")])

T['barres'] = dict(
t="Bar lines", title=None,
k="bar line double bar final barline measure pickup anacrusis",
html="""<p>A <b>bar line</b> is a vertical line that separates measures. Each measure contains exactly the number of beats shown by the <a href="#" data-go="mesures-simples">time signature</a>.</p>
<ul><li><b>Double bar line</b> (two thin lines): end of a section, change of key signature or time signature.</li>
<li><b>Final bar line</b> (thin line + thick line): end of the piece.</li>
<li><b>Repeat bar lines</b> (with two dots): a passage to play twice (<a href="#" data-go="reprises">Repeat signs</a>).</li></ul>
<p>A <b>pickup</b> (anacrusis) is an incomplete measure at the start of a piece (one or a few notes before the first downbeat). The last measure is then often shortened by the same amount.</p>""",
ex=[([], "Single bar line, double bar line, repeat bar lines, final bar line.")])

T['tempo'] = dict(
t="Tempo", title=None,
k="tempo bpm metronome allegro andante adagio largo presto moderato ritardando accelerando fermata",
html="""<p><b>Tempo</b> is the speed of the pulse. It's shown in two ways:</p>
<ul><li>with a <b>number of beats per minute</b> (♩ = 60: one quarter note per second), which you set on a metronome;</li>
<li>with an <b>Italian term</b> (approximate values):</li></ul>
<table class="lt"><tr><th>Term</th><th>Meaning</th><th>About</th></tr>
<tr><td>Largo, Lento</td><td>very slow</td><td>40–60</td></tr>
<tr><td>Adagio</td><td>slow</td><td>60–76</td></tr>
<tr><td>Andante</td><td>walking pace</td><td>76–108</td></tr>
<tr><td>Moderato</td><td>moderate</td><td>108–120</td></tr>
<tr><td>Allegro</td><td>fast, cheerful</td><td>120–168</td></tr>
<tr><td>Presto</td><td>very fast</td><td>168–200</td></tr></table>
<p><b>Tempo changes</b>: <i>accelerando</i> (accel., speeding up), <i>ritardando</i> or <i>rallentando</i> (rit., rall., slowing down), <i>a tempo</i> (back to the tempo), <i>rubato</i> (flexible tempo). The <b>fermata</b> (𝄐) holds a note or rest as long as the performer chooses.</p>""",
ex=[([], "Tempo marking and fermata.")])

T['tons-demitons'] = dict(
t="Whole steps and half steps", title=None,
k="whole step half step whole tone semitone chromatic diatonic",
html="""<p>The <b>half step</b> (semitone) is the smallest distance between two notes in our music: two neighboring keys on the piano. A <b>whole step</b> (whole tone) equals two half steps.</p>
<p>Between natural notes, there's a whole step everywhere, <b>except between E–F and B–C</b>, where there's only a half step.</p>
<ul><li><b>Diatonic half step</b>: two different letter names (E–F, C–D♭).</li>
<li><b>Chromatic half step</b>: same letter name, altered (C–C♯).</li></ul>""",
ex=[([('w: do ré mi fa sol la si do', 'w: C D E F G A B C')],
     "C to D (whole step), D to E (whole step), E to F (half step), F to G, G to A, A to B (whole steps), B to C (half step).")])

T['gamme-majeure'] = dict(
t="The major scale", title=None,
k="major scale whole whole half step pattern structure",
html="""<p>A <b>scale</b> is a series of stepwise notes that starts on one note (the <b>tonic</b>) and goes up to the same note an octave higher.</p>
<p>The <b>major scale</b> always follows the same pattern:</p>
<p class="formula">W – W – H – W – W – W – H</p>
<p>(W = whole step, H = half step). The half steps are between degrees 3–4 and 7–8. The C major scale uses only natural notes; for the others, you add sharps or flats to keep the pattern. These accidentals make up the <a href="#" data-go="armures">key signature</a>.</p>
<p>A major scale is made of two identical <b>tetrachords</b> (W–W–H) separated by a whole step: C-D-E-F / G-A-B-C.</p>""",
ex=[([], "C major, ascending and descending."),
    ([('w: sol la si do ré mi fa♯ sol', 'w: G A B C D E F♯ G')],
     "G major: you need an F♯ to keep the half step between degrees 7 and 8.")])

T['gammes-mineures'] = dict(
t="Minor scales", title=None,
k="minor scale natural harmonic melodic leading tone",
html="""<p class="lxtip">New to this? Start with the step-by-step walkthrough: <a href="#" data-go="relatives">from a major scale to its three minor scales</a>.</p>
<p>There are three forms of the minor scale. They all start the same way: <b>W – H – W – W</b> (the third is minor).</p>
<ul><li><b>Natural minor</b>: W – H – W – W – H – W – W. Same notes as its <a href="#" data-go="relatives">relative major</a> (A minor = the notes of C major).</li>
<li><b>Harmonic minor</b>: you <b>raise the 7<sup>th</sup> degree</b> by a half step. It becomes a <b>leading tone</b>, a half step below the tonic. Between degrees 6 and 7 you get an <b>augmented second</b> (a step and a half), which sounds very distinctive.</li>
<li><b>Melodic minor</b>: going up, you <b>raise the 6<sup>th</sup> and 7<sup>th</sup> degrees</b>; going down, you go back to the natural form.</li></ul>
<p>The harmonic form is mainly used to build chords (V and vii°); the melodic form, to write smooth melodies.</p>""",
ex=[([('w: la si do ré mi fa sol la', 'w: A B C D E F G A')], "A natural minor."),
    ([('w: la si do ré mi fa sol♯ la', 'w: A B C D E F G♯ A')], "A harmonic minor: G♯ (leading tone)."),
    ([], "A melodic minor: F♯ and G♯ going up, naturals going down.")])

T['degres'] = dict(
t="Scale degrees", title=None,
k="scale degrees tonic supertonic mediant subdominant dominant submediant leading tone subtonic roman numerals",
html="""<p>Each note of the scale is a <b>degree</b>, numbered with Roman numerals and given a name that describes its role:</p>
<table class="lt"><tr><th>Degree</th><th>Name</th><th>In C major</th></tr>
<tr><td>I</td><td><b>Tonic</b>: the resting note, the one that gives the key its name</td><td>C</td></tr>
<tr><td>II</td><td>Supertonic</td><td>D</td></tr>
<tr><td>III</td><td>Mediant (decides major or minor)</td><td>E</td></tr>
<tr><td>IV</td><td>Subdominant</td><td>F</td></tr>
<tr><td>V</td><td><b>Dominant</b>: the most important degree after the tonic</td><td>G</td></tr>
<tr><td>VI</td><td>Submediant</td><td>A</td></tr>
<tr><td>VII</td><td><b>Leading tone</b> (a half step below the tonic); <b>subtonic</b> if it's a whole step below (natural minor)</td><td>B</td></tr></table>
<p>The leading tone “pulls” your ear toward the tonic: that's what gives the feeling of an ending.</p>""",
ex=[([], "The degrees in C major.")])

T['armures'] = dict(
t="Key signatures", title=None,
k="key signature sharps flats order find key",
html="""<p>The <b>key signature</b> groups, at the start of each staff, the sharps or flats of the key. They're always written <b>in the same order</b>:</p>
<p class="formula">Sharps: F – C – G – D – A – E – B<br>Flats: B – E – A – D – G – C – F</p>
<p>(The order of flats is the order of sharps backwards.) To remember it all at once, see <a href="#" data-go="truc-armures">the Boss trick</a>.</p>
<p><b>Finding the major key</b>:</p>
<ul><li>with sharps: the tonic is <b>a half step above the last sharp</b> (last sharp C♯ → D major);</li>
<li>with flats: the tonic is <b>the second-to-last flat</b> (B♭, E♭ → E♭ major). Exception to remember: one flat = F major;</li>
<li>no accidentals: C major.</li></ul>
<p>Each key signature also matches a minor key, its <a href="#" data-go="relatives">relative</a>, a minor third lower. To tell which one, look at the melody: the last note, the final bass note and the presence of the leading tone (an accidental) give away the minor key.</p>""",
ex=[([('w: Sol Ré La Mi Si', 'w: G D A E B')], "Key signatures with sharps: G, D, A, E, B major (1 to 5 sharps)."),
    ([('w: Fa Si♭ Mi♭ La♭ Ré♭', 'w: F B♭ E♭ A♭ D♭')], "Key signatures with flats: F, B♭, E♭, A♭, D♭ major (1 to 5 flats).")])

T['truc-armures'] = dict(
t="The Boss trick",
title="The Boss trick: find a key signature at a glance",
k="boss trick key signature sharps flats order row key number accidentals find relative",
html="""<p>The Boss trick: all you need to remember is <b>two rows of names</b>. Each row gives you both <b>the order of the accidentals</b> and <b>the names of the keys</b>, and the number under each name tells you <b>how many accidentals</b> that major key has.</p>
<div class="trick-static">
<div class="tsrow"><span class="tslab">Sharps ♯</span><span>F♯<i>6</i></span><span>C♯<i>7</i></span><span>G<i>1</i></span><span>D<i>2</i></span><span>A<i>3</i></span><span>E<i>4</i></span><span>B<i>5</i></span></div>
<div class="tsrow"><span class="tslab">Flats ♭</span><span>B♭<i>2</i></span><span>E♭<i>3</i></span><span>A♭<i>4</i></span><span>D♭<i>5</i></span><span>G♭<i>6</i></span><span>C♭<i>7</i></span><span>F<i>1</i></span></div>
</div>
<p><b>Reading the row from left to right</b> gives the order of the accidentals: <b>F, C, G, D, A, E, B</b> for sharps and <b>B, E, A, D, G, C, F</b> for flats.</p>
<p><b>From the key to the key signature</b>: find the key in its row; the number underneath tells you how many accidentals there are. Then take them <b>from the beginning of the row</b>.<br>
<i>Example</i>: D major → number <b>2</b> → the first 2 in the sharps row: <b>F♯ and C♯</b>.</p>
<p><b>From the key signature to the key</b>: count the accidentals on the score and look for that number in the right row.<br>
<i>Example</i>: 4 flats → the <b>4</b> is under <b>A♭</b>: you're in <b>A♭ major</b>… or in its <a href="#" data-go="relatives">relative</a>, <b>F minor</b> (a minor third lower).</p>
<p>No accidentals: C major (or A minor). Try it: click a key below.</p>
<div data-widget="armtrick"></div>""",
ex=[])

T['quintes'] = dict(
t="The circle of fifths", title=None,
k="circle of fifths cycle keys closely related neighboring",
html="""<p>Going <b>up by fifths</b> from C, you add one sharp with each key; going down by fifths (or up by fourths), you add one flat.</p>
<table class="lt"><tr><th>Accidentals</th><th>Major</th><th>Relative minor</th></tr>
<tr><td>none</td><td>C</td><td>A</td></tr>
<tr><td>1♯ (F)</td><td>G</td><td>E</td></tr><tr><td>2♯</td><td>D</td><td>B</td></tr><tr><td>3♯</td><td>A</td><td>F♯</td></tr>
<tr><td>4♯</td><td>E</td><td>C♯</td></tr><tr><td>5♯</td><td>B</td><td>G♯</td></tr><tr><td>6♯</td><td>F♯</td><td>D♯</td></tr><tr><td>7♯</td><td>C♯</td><td>A♯</td></tr>
<tr><td>1♭ (B)</td><td>F</td><td>D</td></tr><tr><td>2♭</td><td>B♭</td><td>G</td></tr><tr><td>3♭</td><td>E♭</td><td>C</td></tr>
<tr><td>4♭</td><td>A♭</td><td>F</td></tr><tr><td>5♭</td><td>D♭</td><td>B♭</td></tr><tr><td>6♭</td><td>G♭</td><td>E♭</td></tr><tr><td>7♭</td><td>C♭</td><td>A♭</td></tr></table>
<p><b>Neighboring</b> (closely related) keys, one accidental apart, share many notes: music modulates between them easily. F♯ major and G♭ major are enharmonic, as are C♯/D♭ and B/C♭.</p>""",
ex=[])

T['relatives'] = dict(
t="Relative keys and minor scales",
title="Relative keys: from major to minor",
k="relative minor natural harmonic melodic sixth degree leading tone key signature",
html="""<p>Every major scale has a minor “sister” that uses <b>exactly the same notes</b> and therefore the <b>same key signature</b>: its <b>relative minor</b>. To find it, just start from the <b>6<sup>th</sup> degree</b> of the major scale.</p>
<p>Let's go through it with C major, step by step.</p>""",
ex=[([], "C major: no accidentals. The 6<sup>th</sup> degree is circled."),
    ([('w: la si do ré mi fa sol la', 'w: A B C D E F G A')],
     "A natural minor: same notes as C major, same key signature (no accidentals). C major and A minor are <b>relative keys</b>. Listen: the color is darker, but the ending lacks drive, because G is a whole step away from A."),
    ([('w: la si do ré mi fa sol♯ la', 'w: A B C D E F G♯ A')],
     "G♯ is now a half step below A: it's the <b>leading tone</b>, which “pulls” toward the tonic. This form is used to build chords (V becomes major: E–G♯–B). But between F and G♯ there's a big leap of <b>a step and a half</b> (augmented second), with a slightly exotic flavor."),
    ([('w: la si do ré mi fa♯ sol♯ la', 'w: A B C D E F♯ G♯ A'), ('w: la sol fa mi ré do si la', 'w: A G F E D C B A')],
     "Going <b>up</b>, F♯ and G♯ make the melody flow smoothly to the tonic. Going <b>down</b>, you no longer need the leading tone: you go back to the natural form (G and F circled).")])

T['modes'] = dict(
t="Modes", title=None,
k="modes ionian dorian phrygian lydian mixolydian aeolian locrian",
html="""<p>A <b>mode</b> is a 7-note scale defined by where its half steps fall. By playing the white keys of the piano starting from each note, you get the 7 modes:</p>
<table class="lt"><tr><th>Mode</th><th>On the white keys</th><th>Color</th></tr>
<tr><td>Ionian</td><td>C to C</td><td>= major</td></tr>
<tr><td>Dorian</td><td>D to D</td><td>minor with a major 6<sup>th</sup></td></tr>
<tr><td>Phrygian</td><td>E to E</td><td>minor with a minor 2<sup>nd</sup></td></tr>
<tr><td>Lydian</td><td>F to F</td><td>major with an augmented 4<sup>th</sup></td></tr>
<tr><td>Mixolydian</td><td>G to G</td><td>major with a minor 7<sup>th</sup></td></tr>
<tr><td>Aeolian</td><td>A to A</td><td>= natural minor</td></tr>
<tr><td>Locrian</td><td>B to B</td><td>minor 2<sup>nd</sup> and diminished 5<sup>th</sup></td></tr></table>
<p>You can hear them in Gregorian chant, folk music, jazz, rock and film music.</p>""",
ex=[([('w: ré mi fa sol la si do ré', 'w: D E F G A B C D')], "Mode on D (Dorian)."),
    ([('w: sol la si do ré mi fa sol', 'w: G A B C D E F G')], "Mode on G (Mixolydian): the 7th is an F natural.")])

T['autres-gammes'] = dict(
t="Other scales", title=None,
k="pentatonic chromatic blues whole tone scale",
html="""<ul><li><b>Major pentatonic</b> (5 notes, no half steps): degrees 1, 2, 3, 5, 6 (C D E G A). Very common in folk and popular music.</li>
<li><b>Minor pentatonic</b>: A C D E G (degrees 1, ♭3, 4, 5, ♭7).</li>
<li><b>Blues scale</b>: the minor pentatonic + the “blue note” (diminished fifth, ♭5): A C D E♭ E G.</li>
<li><b>Chromatic scale</b>: all 12 half steps. It's usually written with sharps going up and flats going down.</li>
<li><b>Whole-tone scale</b>: 6 notes separated by whole steps (C D E F♯ G♯ A♯). A floating color, a favorite of Debussy.</li></ul>""",
ex=[([('w: do ré mi sol la do', 'w: C D E G A C')], "C major pentatonic."),
    ([('w: la do ré mi♭ mi sol la', 'w: A C D E♭ E G A')], "A blues scale."),
    ([], "Ascending chromatic scale.")])

out = copy.deepcopy(fr)
for c in out:
    c['t'] = CAT[c['id']]
    for tp in c['topics']:
        tr = T[tp['id']]
        tp['t'] = tr['t']; tp['title'] = tr['title']; tp['k'] = tr['k']; tp['html'] = tr['html']
        assert len(tr['ex']) == len(tp['ex']), tp['id']
        for e, (reps, cap) in zip(tp['ex'], tr['ex']):
            for a, b in reps:
                assert e['abc'].count(a) == 1, (tp['id'], a)
                e['abc'] = e['abc'].replace(a, b)
            e['cap'] = cap
json.dump(out, open(os.path.join(D, 'lib_en_A.json'), 'w'), ensure_ascii=False, indent=1)
print('written')

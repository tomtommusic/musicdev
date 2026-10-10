import json, copy, sys
D='/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/i18n/'
fr=json.load(open(D+'lib_fr_B.json'))
CAT={'intervalles':'Intervals','harmonie':'Chords and Harmony','expression':'Expression'}
T={}
T['intervalles-def']=dict(t="What Is an Interval?",k="interval melodic harmonic count second third fourth fifth sixth seventh octave",
html="""<p>An <b>interval</b> is the distance between two notes.</p>
<ul><li><b>Melodic</b>: the notes are played one after the other (going up or down).</li>
<li><b>Harmonic</b>: the notes are played at the same time.</li></ul>
<p><b>The name (the number)</b> is found by counting the note names, <b>including the first and the last</b>: C → E = C, D, E = 3 notes = a <b>third</b>. C → G = a <b>fifth</b>. C → C = an <b>octave</b> (8).</p>
<p>The number isn't enough: C–E and C–E♭ are both thirds, but they don't sound the same. You also need the <a href="#" data-go="intervalles-qualites">quality</a>, which you find by counting half steps.</p>
<p>On the staff: from a line to the next line = a third; from a line to the neighboring space = a second; for an octave, you go from a line to a space (or the other way around).</p>""",
ex=[("X:1\nL:1/4\nK:C\nC2 D2 | C2 E2 | C2 F2 | C2 G2 | C2 A2 | C2 B2 | C2 c2 |]\nw: 2nd * 3rd * 4th * 5th * 6th * 7th * 8ve *","Melodic intervals starting on C.")])
T['intervalles-qualites']=dict(t="Interval Qualities and Chart",k="perfect major minor augmented diminished tritone half steps semitones chart",
html="""<p>The <b>quality</b> makes an interval more precise: <b>perfect</b> (P), <b>major</b> (M), <b>minor</b> (m), <b>augmented</b> (A) or <b>diminished</b> (d).</p>
<ul><li>Unisons, fourths, fifths and octaves are <b>perfect</b> (or augmented/diminished).</li>
<li>Seconds, thirds, sixths and sevenths are <b>major or minor</b> (or augmented/diminished).</li></ul>
<table class="lt"><tr><th>Interval</th><th>Abbr.</th><th>Half steps</th><th>Starting on C</th></tr>
<tr><td>Unison</td><td>P1</td><td>0</td><td>C</td></tr>
<tr><td>Minor second</td><td>m2</td><td>1</td><td>D♭</td></tr>
<tr><td>Major second</td><td>M2</td><td>2</td><td>D</td></tr>
<tr><td>Minor third</td><td>m3</td><td>3</td><td>E♭</td></tr>
<tr><td>Major third</td><td>M3</td><td>4</td><td>E</td></tr>
<tr><td>Perfect fourth</td><td>P4</td><td>5</td><td>F</td></tr>
<tr><td>Augmented fourth / diminished fifth (tritone)</td><td>A4 / d5</td><td>6</td><td>F♯ / G♭</td></tr>
<tr><td>Perfect fifth</td><td>P5</td><td>7</td><td>G</td></tr>
<tr><td>Minor sixth</td><td>m6</td><td>8</td><td>A♭</td></tr>
<tr><td>Major sixth</td><td>M6</td><td>9</td><td>A</td></tr>
<tr><td>Minor seventh</td><td>m7</td><td>10</td><td>B♭</td></tr>
<tr><td>Major seventh</td><td>M7</td><td>11</td><td>B</td></tr>
<tr><td>Perfect octave</td><td>P8</td><td>12</td><td>C</td></tr></table>
<p><b>Tip</b>: in a major scale, all the intervals going up from the tonic are major or perfect. One half step smaller = minor (or diminished for a perfect interval); one half step larger = augmented.</p>
<p>The <b>tritone</b> (three whole steps) splits the octave in half: it sounds tense and unstable.</p>""",
ex=[("X:1\nL:1/4\nK:C\n[C_D]2 [C=D]2 [C_E]2 [C=E]2 [CF]2 [C^F]2 | [CG]2 [C_A]2 [C=A]2 [C_B]2 [C=B]2 [Cc]2 |]\nw: m2 M2 m3 M3 P4 tritone P5 m6 M6 m7 M7 P8","Harmonic intervals starting on C.")])
T['renversement-intervalles']=dict(t="Inverting Intervals",k="invert inversion interval complementary nine",
html="""<p>To <b>invert</b> an interval, you move the bottom note up an octave (or the top note down an octave). C–E becomes E–C.</p>
<ul><li>The numbers add up to <b>9</b>: a third becomes a sixth, a second becomes a seventh, a fourth becomes a fifth.</li>
<li>The quality flips: <b>major ↔ minor</b>, <b>augmented ↔ diminished</b>, <b>perfect stays perfect</b>.</li></ul>
<p>Examples: M3 → m6; m2 → M7; P4 → P5; A4 → d5. This is handy for figuring out a large interval: it's often easier to work out its inversion.</p>""",
ex=[("X:1\nL:1/4\nK:C\nC2 E2 | E2 c2 | D2 G2 | G2 d2 |]\nw: M3 * m6 * P4 * P5 *","M3 becomes m6; P4 becomes P5.")])
T['intervalles-composes']=dict(t="Compound Intervals",k="ninth tenth eleventh thirteenth compound simple",
html="""<p>An interval larger than an octave is a <b>compound interval</b>. You can reduce it to a simple interval by subtracting 7: a <b>9<sup>th</sup></b> = octave + second, a <b>10<sup>th</sup></b> = octave + third, an <b>11<sup>th</sup></b> = octave + fourth, a <b>13<sup>th</sup></b> = octave + sixth.</p>
<p>The quality stays the same as the simple interval's: C–D (an octave higher) is a major 9<sup>th</sup>. These names are used a lot for jazz chords (C9, C11, C13).</p>""",
ex=[("X:1\nL:1/4\nK:C\nC2 d2 | C2 e2 | C2 f2 | C2 a2 |]\nw: M9 * M10 * P11 * M13 *","Compound intervals starting on C.")])
T['consonances']=dict(t="Consonance and Dissonance",k="consonance dissonance perfect imperfect tension rest",
html="""<p>According to the classical tradition:</p>
<ul><li><b>Perfect consonances</b>: unison, perfect fifth, octave. Very stable, “hollow.”</li>
<li><b>Imperfect consonances</b>: thirds and sixths (major and minor). Stable and colorful.</li>
<li><b>Dissonances</b>: seconds, sevenths, augmented and diminished intervals (including the tritone). They create tension that needs to resolve.</li></ul>
<p>The <b>perfect fourth</b> is a special case: consonant between two upper voices, but treated as a dissonance when it's formed with the bass (e.g., the <a href="#" data-go="renversements">six-four chord</a>).</p>
<p>Consonance and dissonance don't mean “pretty” and “ugly”: music moves forward thanks to the back-and-forth between tension and release.</p>""",
ex=[(None,"Perfect consonances, imperfect consonances, then dissonances (the B–F tritone resolves to C–E).")])
T['reperes']=dict(t="Reference Songs for Ear Training",k="song reference memorize ear intervals beginning",
html="""<p>To recognize a melodic interval, link it to the <b>beginning of a song you know</b>. Pick your own reference songs: ones you can sing without hesitating. A few classic examples:</p>
<table class="lt"><tr><th>Interval</th><th>Ascending</th><th>Descending</th></tr>
<tr><td>m2</td><td>Jaws (theme)</td><td>Für Elise (Beethoven)</td></tr>
<tr><td>M2</td><td>Frère Jacques; Happy Birthday (between the 2<sup>nd</sup> and 3<sup>rd</sup> notes)</td><td>Mary Had a Little Lamb</td></tr>
<tr><td>m3</td><td>Brahms' Lullaby</td><td>Hey Jude (Beatles)</td></tr>
<tr><td>M3</td><td>When the Saints Go Marching In</td><td>Swing Low, Sweet Chariot</td></tr>
<tr><td>P4</td><td>Bridal Chorus (Wagner, “Here Comes the Bride”); La Marseillaise</td><td></td></tr>
<tr><td>Tritone</td><td>Maria (West Side Story)</td><td></td></tr>
<tr><td>P5</td><td>Twinkle, Twinkle, Little Star; Star Wars (main theme, 2<sup>nd</sup> interval)</td><td>The Flintstones (theme)</td></tr>
<tr><td>m6</td><td>The Entertainer (Joplin), from the 3<sup>rd</sup> to the 4<sup>th</sup> note</td><td></td></tr>
<tr><td>M6</td><td>My Bonnie</td><td>Nobody Knows the Trouble I've Seen</td></tr>
<tr><td>m7</td><td>Somewhere (West Side Story)</td><td></td></tr>
<tr><td>M7</td><td>Think of an octave minus a half step: very tense, it “wants” to go up</td><td></td></tr>
<tr><td>P8</td><td>Over the Rainbow</td><td></td></tr></table>
<p><b>Other strategies</b>: place the notes in a scale (C–G: “1 to 5”), listen to the color (thirds are “sweet,” seconds “rub,” the tritone sounds “uneasy”), and sing the interval in your head before answering. The <b>Intervals</b> module lets you hear each interval again from the same starting note so you can compare.</p>""",
ex=[])
T['triades']=dict(t="Triads",k="chord major minor diminished augmented root third fifth stacked thirds",
html="""<p>A <b>triad</b> is a chord of three notes stacked in <b>thirds</b>: the <b>root</b>, the <b>third</b> and the <b>fifth</b>. C–E–G is the C triad.</p>
<table class="lt"><tr><th>Type</th><th>Construction (from the root)</th><th>Example</th><th>Symbol</th></tr>
<tr><td>Major (major triad)</td><td>M3 + P5</td><td>C E G</td><td>C</td></tr>
<tr><td>Minor (minor triad)</td><td>m3 + P5</td><td>C E♭ G</td><td>Cm</td></tr>
<tr><td>Diminished (diminished fifth)</td><td>m3 + d5</td><td>C E♭ G♭</td><td>C°</td></tr>
<tr><td>Augmented (augmented fifth)</td><td>M3 + A5</td><td>C E G♯</td><td>C+</td></tr></table>
<p>By ear: major sounds bright and stable; minor sounds darker; diminished sounds tense and “tight”; augmented sounds floating, like a question.</p>""",
ex=[("X:1\nL:1/4\nK:C\n[CEG]4 | [C_EG]4 | [C_E_G]4 | [CE^G]4 |]\nw: major minor diminished augmented","The four types of triads on C.")])
T['accords-degres']=dict(t="Chords on Each Scale Degree",k="diatonic chords scale degrees roman numerals major minor I ii iii IV V vi vii",
html="""<p>When you build a triad on each note of the scale (using only the notes of the key), you get the <b>diatonic chords</b>. They're named with <b>Roman numerals</b>: <b>uppercase</b> = major, <b>lowercase</b> = minor, ° = diminished, + = augmented.</p>
<table class="lt"><tr><th>Major</th><td>I</td><td>ii</td><td>iii</td><td>IV</td><td>V</td><td>vi</td><td>vii°</td></tr>
<tr><th>C major</th><td>C</td><td>Dm</td><td>Em</td><td>F</td><td>G</td><td>Am</td><td>B°</td></tr>
<tr><th>Harmonic minor</th><td>i</td><td>ii°</td><td>III+ (or III)</td><td>iv</td><td>V</td><td>VI</td><td>vii°</td></tr>
<tr><th>A minor</th><td>Am</td><td>B°</td><td>C+ (C)</td><td>Dm</td><td>E</td><td>F</td><td>G♯°</td></tr></table>
<p>Remember: in major, <b>I, IV and V are major</b>; ii, iii and vi are minor; vii° is diminished. In minor, you raise the leading tone so that <b>V is major</b> (harmonic minor). III usually uses the natural 7<sup>th</sup> (C rather than C+).</p>""",
ex=[(None,"The chords of C major."),(None,"The chords of A minor (V and vii° with the leading tone G♯).")])
T['renversements']=dict(t="Chord Inversions",k="root position first second inversion six four bass",
html="""<p>A chord is in <b>root position</b> when its root is in the bass. If another note is in the bass, the chord is <b>inverted</b>. What matters is the lowest note, not the order of the other notes.</p>
<table class="lt"><tr><th>Note in the bass</th><th>Name</th><th>Figures</th></tr>
<tr><td>Root</td><td>Root position</td><td>(5/3) — nothing written</td></tr>
<tr><td>Third</td><td>1<sup>st</sup> inversion (six chord)</td><td>⁶</td></tr>
<tr><td>Fifth</td><td>2<sup>nd</sup> inversion (six-four chord)</td><td>⁶₄</td></tr></table>
<p>The figures describe the intervals above the bass: in 1<sup>st</sup> inversion (E–G–C), you find a third and a <b>sixth</b>; in 2<sup>nd</sup> inversion (G–C–E), a <b>fourth</b> and a <b>sixth</b>.</p>
<p>By ear, listen mostly to the <b>bass line</b>: a six chord sounds lighter, less “settled.” The most common six-four chord is the <b>cadential I⁶₄</b>, right before V.</p>""",
ex=[(None,"The C chord in root position, then in 1st and 2nd inversion: the bass changes.")])
T['septiemes']=dict(t="Seventh Chords",k="seventh dominant V7 major minor half-diminished diminished inversions 6/5 4/3 4/2",
html="""<p>A <b>seventh chord</b> adds one more third on top of the triad: root, third, fifth and <b>seventh</b>.</p>
<table class="lt"><tr><th>Type</th><th>Triad + 7<sup>th</sup></th><th>On C</th><th>Where?</th></tr>
<tr><td><b>Dominant 7<sup>th</sup></b></td><td>major + m7</td><td>C7: C E G B♭</td><td>V7</td></tr>
<tr><td>Major 7<sup>th</sup></td><td>major + M7</td><td>Cmaj7: C E G B</td><td>I, IV in major</td></tr>
<tr><td>Minor 7<sup>th</sup></td><td>minor + m7</td><td>Cm7: C E♭ G B♭</td><td>ii, iii, vi in major</td></tr>
<tr><td>Half-diminished 7<sup>th</sup></td><td>diminished + m7</td><td>Cø7: C E♭ G♭ B♭</td><td>vii in major</td></tr>
<tr><td>Diminished 7<sup>th</sup></td><td>diminished + d7</td><td>C°7: C E♭ G♭ B𝄫</td><td>vii in minor</td></tr></table>
<p><b>V7</b> is the most important one: it contains the leading tone and the tritone (B–F in C), which resolve toward the tonic.</p>
<p><b>Inversions of V7</b>: V7 (root in the bass), <b>V⁶₅</b> (third), <b>V⁴₃</b> (fifth), <b>V⁴₂</b> (seventh). In the French tradition, you'll also see 7+, 6/5 (with the 5 crossed out), +6 and +4.</p>""",
ex=[(None,"The five seventh chords on C."),(None,"V7 in C major and its inversions.")])
T['chiffrage']=dict(t="Chord Symbols and Analysis",k="figures roman numerals lead sheet letter chord symbols C Cm C7 slash",
html="""<p>Two systems are used side by side:</p>
<p><b>1. Roman numerals</b> (analysis): they show the chord's <b>degree</b> in the key, and therefore its function. I–IV–V–I is the same progression in C major or in G major. Arabic numerals add the inversion (I⁶, V⁶₅…). This is what the <b>Progressions</b> module asks for.</p>
<p><b>2. Chord symbols</b> (letters): they show the actual chord, with no reference to the key. Used in jazz, popular music and on lead sheets:</p>
<table class="lt"><tr><th>Symbol</th><th>Chord</th></tr>
<tr><td>C</td><td>C major</td></tr><tr><td>Cm (or C−)</td><td>C minor</td></tr>
<tr><td>C° (or Cdim)</td><td>C diminished</td></tr><tr><td>C+ (or Caug)</td><td>C augmented</td></tr>
<tr><td>C7</td><td>C dominant 7<sup>th</sup></td></tr><tr><td>Cmaj7 (or CΔ)</td><td>C major 7<sup>th</sup></td></tr>
<tr><td>Cm7</td><td>C minor 7</td></tr><tr><td>Cø (or Cm7♭5)</td><td>C half-diminished</td></tr>
<tr><td>Csus4</td><td>C–F–G (a fourth instead of the third)</td></tr>
<tr><td>C/E</td><td>C chord with E in the bass</td></tr></table>""",
ex=[])
T['fonctions']=dict(t="Tonal Functions and Progressions",k="tonic subdominant predominant dominant function progression chord succession",
html="""<p>In a key, chords fall into three <b>functions</b>:</p>
<ul><li><b>Tonic</b> (rest): I, and sometimes vi or iii.</li>
<li><b>Predominant</b> or subdominant (moving away): IV and ii.</li>
<li><b>Dominant</b> (tension, pull toward the tonic): V, V7 and vii°.</li></ul>
<p>The most natural motion is: <b>Tonic → Predominant → Dominant → Tonic</b>. Some very common progressions:</p>
<ul><li>I – IV – V – I</li><li>I – ii – V – I (and ii – V – I in jazz)</li><li>I – vi – IV – V</li><li>I – V – vi – IV (very common in pop music)</li><li>vi – ii – V – I (circle-of-fifths sequence)</li></ul>
<p><b>How to approach harmonic dictation</b>: first listen to the <b>bass</b>, then the <b>quality</b> of each chord (major or minor), then use what you know about progressions. Examples: a bass going up from C to F suggests IV; D in the bass often suggests ii; a bass moving from G to A (instead of G to C) signals a deceptive cadence.</p>""",
ex=[(None,"I – IV – V – I, then ii – V – I in C major.")])
T['cadences']=dict(t="Cadences",k="cadence perfect authentic imperfect plagal half deceptive evaded",
html="""<p>A <b>cadence</b> is the chord progression that ends a phrase, like the punctuation at the end of a sentence.</p>
<table class="lt"><tr><th>Cadence</th><th>Chords</th><th>Effect</th></tr>
<tr><td><b>Perfect</b> (authentic)</td><td>V – I, both chords in root position</td><td>Period</td></tr>
<tr><td><b>Imperfect</b></td><td>V – I with at least one of the two chords inverted</td><td>Weaker ending</td></tr>
<tr><td><b>Half cadence</b></td><td>… – V (stops on the dominant)</td><td>Comma, question</td></tr>
<tr><td><b>Plagal</b></td><td>IV – I</td><td>The “Amen” of hymns</td></tr>
<tr><td><b>Deceptive</b></td><td>V – vi</td><td>Surprise: you expected I</td></tr></table>
<p>Variation: in many North American textbooks, a perfect authentic cadence also requires the tonic in the top voice; otherwise, it's called an imperfect authentic cadence. Check which definition your course uses.</p>""",
ex=[(None,"Perfect, plagal, half and deceptive cadences in C major.")])
T['notes-etrangeres']=dict(t="Nonchord Tones",k="nonchord tone non-harmonic passing tone neighbor tone appoggiatura suspension anticipation escape tone pedal",
html="""<p>A melody isn't made only of chord tones. <b>Nonchord tones</b> (notes that don't belong to the chord) connect and color the line:</p>
<ul><li><b>Passing tone</b>: connects two chord tones by step (C–<u>D</u>–E over a C chord).</li>
<li><b>Neighbor tone</b>: leaves a chord tone by step and comes back to it (E–<u>F</u>–E).</li>
<li><b>Appoggiatura</b>: a dissonance on the strong beat, struck directly, that resolves by step.</li>
<li><b>Suspension</b>: a note from the previous chord is held over the new chord, then moves down (preparation – dissonance – resolution).</li>
<li><b>Anticipation</b>: a note from the next chord arrives a little early.</li>
<li><b>Pedal tone</b>: a held note (often in the bass) while the chords change.</li></ul>""",
ex=[("X:1\nL:1/8\nK:C\n%%staves {1 2}\nV:1 clef=treble\nc2 d2 e4 | e2 f2 e4 | d4 c4 |]\nw: * passing * * neighbor * appog. *\nV:2 clef=bass\n[C,E,G,]8 | [C,E,G,]8 | [C,E,G,]8 |]","Over a C chord: passing tone, neighbor tone, appoggiatura.")])
T['nuances']=dict(t="Dynamics",k="dynamics piano forte mezzo crescendo decrescendo diminuendo sforzando fortepiano",
html="""<p><b>Dynamics</b> show the intensity (the volume). They're written below the staff, as Italian abbreviations:</p>
<table class="lt"><tr><th>Sign</th><th>Italian</th><th>Meaning</th></tr>
<tr><td><b><i>ppp</i></b></td><td>pianississimo</td><td>extremely soft</td></tr>
<tr><td><b><i>pp</i></b></td><td>pianissimo</td><td>very soft</td></tr>
<tr><td><b><i>p</i></b></td><td>piano</td><td>soft</td></tr>
<tr><td><b><i>mp</i></b></td><td>mezzo piano</td><td>moderately soft</td></tr>
<tr><td><b><i>mf</i></b></td><td>mezzo forte</td><td>moderately loud</td></tr>
<tr><td><b><i>f</i></b></td><td>forte</td><td>loud</td></tr>
<tr><td><b><i>ff</i></b></td><td>fortissimo</td><td>very loud</td></tr>
<tr><td><b><i>fff</i></b></td><td>fortississimo</td><td>extremely loud</td></tr></table>
<ul><li><b>Crescendo</b> (cresc. or ⟨): getting louder; <b>decrescendo</b> or <b>diminuendo</b> (decresc., dim. or ⟩): getting softer.</li>
<li><b><i>sfz</i></b> (sforzando): sudden accent on one note; <b><i>fp</i></b> (fortepiano): loud, then immediately soft; <i>subito</i>: suddenly.</li></ul>""",
ex=[(None,"Piano, crescendo, forte, diminuendo, pianissimo.")])
T['articulations']=dict(t="Articulations",k="staccato legato tenuto accent marcato fermata slur",
html="""<p><b>Articulations</b> show how to attack and connect the notes:</p>
<table class="lt"><tr><th>Sign</th><th>Name</th><th>Effect</th></tr>
<tr><td>dot above or below</td><td><b>Staccato</b></td><td>detached, short note</td></tr>
<tr><td>horizontal line</td><td><b>Tenuto</b></td><td>note held for its full value, slightly stressed</td></tr>
<tr><td>&gt;</td><td><b>Accent</b></td><td>stronger attack</td></tr>
<tr><td>^</td><td><b>Marcato</b></td><td>very strong accent</td></tr>
<tr><td>curve over several notes</td><td><b>Legato</b> (slur)</td><td>connected notes, without a break</td></tr>
<tr><td>𝄐</td><td><b>Fermata</b></td><td>hold longer, as long as you choose</td></tr></table>""",
ex=[(None,"Staccato, tenuto, accent, marcato, legato and fermata.")])
T['reprises']=dict(t="Repeat and Form Signs",k="repeat volta first second ending da capo dal segno coda fine",
html="""<ul><li><b>Repeat signs</b> (‖: … :‖): you play the passage twice. If there's no opening repeat sign, you go back to the beginning of the piece.</li>
<li><b>1<sup>st</sup> and 2<sup>nd</sup> endings</b> (numbered brackets): the first time, you play ending 1 and repeat; the second time, you skip ending 1 and play ending 2.</li>
<li><b>D.C.</b> (<i>Da Capo</i>): go back to the beginning. <b>D.C. al Fine</b>: go back to the beginning and stop at the word <b>Fine</b>.</li>
<li><b>D.S.</b> (<i>Dal Segno</i>): go back to the sign 𝄋.</li>
<li><b>Coda</b> (𝄌): ending section. “D.S. al Coda”: go back to the sign, play until “To Coda” (𝄌), then jump to the coda.</li></ul>
<p>Before you read, map out the road: where the repeats, endings, sign and coda are.</p>""",
ex=[(None,"Repeat with 1st and 2nd endings.")])
T['ornements']=dict(t="Ornaments",k="trill mordent turn appoggiatura acciaccatura grace note",
html="""<ul><li><b>Trill</b> (tr): fast alternation between the written note and the note just above it.</li>
<li><b>Mordent</b>: written note – neighboring note – written note, very fast. Going down: the mordent (the <i>pincé</i> of the French harpsichordists); going up: the upper mordent (<i>pralltriller</i>, short trill).</li>
<li><b>Turn</b> (∽): upper note – written note – lower note – written note.</li>
<li><b>Appoggiatura</b> (grace note): it takes part of the main note's value, on the beat.</li>
<li><b>Acciaccatura</b> (grace note with a slash): played very quickly, just before the main note.</li></ul>
<p>How exactly they're played depends on the period and style: in Baroque music, for example, the trill often starts on the upper note.</p>""",
ex=[(None,"Trill, mordent, turn, appoggiatura and acciaccatura.")])

en=copy.deepcopy(fr)
for c in en:
    c['t']=CAT[c['id']]
    for t in c['topics']:
        tr=T[t['id']]
        t['t']=tr['t']; t['k']=tr['k']; t['html']=tr['html']
        assert len(tr['ex'])==len(t['ex']),t['id']
        for e,(abc,cap) in zip(t['ex'],tr['ex']):
            if abc is not None: e['abc']=abc
            e['cap']=cap
json.dump(en,open(D+'lib_en_B.json','w'),ensure_ascii=False,indent=1)

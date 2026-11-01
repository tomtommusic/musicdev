import json
M={}
M['fr-CA']=dict(
name='MusiDev',subtitle='Formation auditive et théorie',
promotionalText="Dictées, lecture de notes, accordeur, métronome et accompagnateur : tout pour apprendre la musique, conçu par un enseignant du Québec. Sans pub ni compte.",
keywords='solfège,dictée,oreille,théorie,accordeur,métronome,lecture,rythme,intervalles,accords,gamme',
description="""MusiDev réunit dans une seule app tout ce qu'il faut pour développer l'oreille, apprendre à lire la musique et pratiquer son instrument. Conçue par un enseignant de musique au secondaire, elle convient aux élèves, aux musiciens amateurs et aux enseignants qui veulent un outil simple à utiliser en classe ou à la maison.

ENTENDRE
• Dictée mélodique et dictée rythmique : écoute, puis écris directement sur la portée.
• Intervalles : montants, descendants ou harmoniques.
• Progressions d'accords : reconnais les enchaînements à l'oreille.

LIRE ET JOUER
• Lecture de notes en clé de sol, de fa et d'ut, contre la montre.
• Lecture mélodique et lecture à vue : le micro vérifie chaque note que tu joues ou chantes.
• Lecture rythmique : frappe le rythme après le décompte.
• Solfège chanté avec vérification de la justesse.
• Lecture batterie et les 40 rudiments de caisse claire.

OUTILS
• Accordeur chromatique avec préréglages pour guitare, basse, ukulélé, violon et plus.
• Métronome avec subdivisions.
• Accompagnateur : écris une grille d'accords, choisis un style, et batterie, basse et piano t'accompagnent. Gammes et modes sur portée ou sur manche.
• Dictionnaire d'accords pour guitare, ukulélé et piano.
• Enregistreur pour t'écouter et partager tes prises.
• Doigtés d'instruments à vent et à cordes, études techniques et vocalises.

COMPRENDRE
• Bibliothèque théorique complète : portée et clés, rythme, gammes et tonalités, intervalles, accords, cadences, modes, improvisation, tablatures et partitions de batterie, avec exemples sonores.
• Tester mes connaissances : des questionnaires selon le niveau choisi.
• Badges pour garder la motivation.

RESPECT DE TA VIE PRIVÉE
Aucun compte, aucune publicité, aucun pistage. Tes résultats et tes enregistrements restent sur ton appareil.

Offerte en français, en anglais et en espagnol.""")
M['en-CA']=dict(
name='MusiDev',subtitle='Ear training and music theory',
promotionalText="Dictations, note reading, tuner, metronome and a backing band: everything to learn music, made by a Quebec music teacher. No ads, no account.",
keywords='ear training,solfege,dictation,theory,tuner,metronome,sight reading,rhythm,intervals,chords',
description="""MusiDev brings together everything you need to train your ear, learn to read music and practise your instrument. Designed by a high school music teacher, it works for students, hobby musicians and teachers who want a simple tool for the classroom or at home.

HEAR
• Melodic and rhythmic dictation: listen, then write straight onto the staff.
• Intervals: ascending, descending or harmonic.
• Chord progressions: recognise them by ear.

READ AND PLAY
• Note reading in treble, bass and alto clef, against the clock.
• Melodic reading and sight reading: the microphone checks every note you play or sing.
• Rhythm reading: tap the rhythm after the count-in.
• Sung solfège with pitch checking.
• Drum reading and the 40 snare drum rudiments.

TOOLS
• Chromatic tuner with presets for guitar, bass, ukulele, violin and more.
• Metronome with subdivisions.
• Backing band: write a chord chart, pick a style, and drums, bass and piano play along. Scales and modes on the staff or on the fretboard.
• Chord dictionary for guitar, ukulele and piano.
• Recorder to listen back and share your takes.
• Fingering charts for wind and string instruments, technical studies and vocal warm-ups.

UNDERSTAND
• A complete theory library: staff and clefs, rhythm, scales and keys, intervals, chords, cadences, modes, improvisation, tablature and drum notation, with audio examples.
• Test my knowledge: quizzes at the level you choose.
• Badges to stay motivated.

YOUR PRIVACY
No account, no ads, no tracking. Your results and recordings stay on your device.

Available in French, English and Spanish.""")
M['es-MX']=dict(
name='MusiDev',subtitle='Oído musical y teoría',
promotionalText="Dictados, lectura de notas, afinador, metrónomo y acompañamiento: todo para aprender música, creado por un profesor de Quebec. Sin anuncios ni cuenta.",
keywords='solfeo,dictado,oído,teoría,afinador,metrónomo,lectura,ritmo,intervalos,acordes,escala',
description="""MusiDev reúne en una sola app todo lo necesario para desarrollar el oído, aprender a leer música y practicar tu instrumento. Creada por un profesor de música de secundaria, sirve para estudiantes, músicos aficionados y docentes que buscan una herramienta sencilla para el aula o la casa.

ESCUCHAR
• Dictado melódico y rítmico: escucha y escribe directamente en el pentagrama.
• Intervalos: ascendentes, descendentes o armónicos.
• Progresiones de acordes: reconócelas de oído.

LEER Y TOCAR
• Lectura de notas en clave de sol, fa y do, contra reloj.
• Lectura melódica y a primera vista: el micrófono verifica cada nota que tocas o cantas.
• Lectura rítmica: marca el ritmo después de la cuenta.
• Solfeo cantado con verificación de la afinación.
• Lectura de batería y los 40 rudimentos de caja.

HERRAMIENTAS
• Afinador cromático con ajustes para guitarra, bajo, ukelele, violín y más.
• Metrónomo con subdivisiones.
• Acompañamiento: escribe una progresión, elige un estilo, y batería, bajo y piano te acompañan. Escalas y modos en el pentagrama o en el mástil.
• Diccionario de acordes para guitarra, ukelele y piano.
• Grabadora para escucharte y compartir tus tomas.
• Digitaciones de instrumentos de viento y cuerda, estudios técnicos y vocalizaciones.

COMPRENDER
• Biblioteca teórica completa: pentagrama y claves, ritmo, escalas y tonalidades, intervalos, acordes, cadencias, modos, improvisación, tablaturas y partituras de batería, con ejemplos sonoros.
• Pon a prueba tus conocimientos: cuestionarios según el nivel elegido.
• Insignias para mantener la motivación.

TU PRIVACIDAD
Sin cuenta, sin anuncios, sin rastreo. Tus resultados y grabaciones se quedan en tu dispositivo.

Disponible en francés, inglés y español.""")
B='https://tomtommusic.github.io/musicdev/'
for l,m in M.items():
    m['supportUrl']=B+'support.html';m['privacyPolicyUrl']=B+'privacy.html';m['marketingUrl']=B
    print(l,'sub',len(m['subtitle']),'promo',len(m['promotionalText']),'kw',len(m['keywords'].encode()),'desc',len(m['description']))
json.dump(M,open('metadata.json','w'),ensure_ascii=False,indent=1)

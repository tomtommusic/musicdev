import json, sys, os, re
D = os.path.dirname(os.path.abspath(__file__))
fr = json.load(open(os.path.join(D, 'lib_fr_B.json'), encoding='utf-8'))

CAT = {'intervalles': 'Intervalos', 'harmonie': 'Acordes y armonía', 'expression': 'Expresión'}

# topic id -> (t, k, html, [ (abc_or_None, cap) ... ])
T = {}

T['intervalles-def'] = ("¿Qué es un intervalo?",
"intervalo melodico armonico contar segunda tercera cuarta quinta sexta septima octava",
"""<p>Un <b>intervalo</b> es la distancia entre dos notas.</p>
<ul><li><b>Melódico</b>: las notas se tocan una después de la otra (subiendo o bajando).</li>
<li><b>Armónico</b>: las notas se tocan al mismo tiempo.</li></ul>
<p><b>El nombre (el número)</b> se obtiene contando los nombres de las notas, <b>incluyendo la primera y la última</b>: do → mi = do, re, mi = 3 notas = una <b>tercera</b>. Do → sol = una <b>quinta</b>. Do → do = una <b>octava</b> (8).</p>
<p>El número no basta: do–mi y do–mi♭ son dos terceras, pero no suenan igual. También hace falta la <a href="#" data-go="intervalles-qualites">calidad</a>, que se obtiene contando los semitonos.</p>
<p>En el pentagrama: de una línea a la línea vecina = tercera; de una línea al espacio vecino = segunda; para una octava, se pasa de una línea a un espacio (o al revés).</p>""",
[("X:1\nL:1/4\nK:C\nC2 D2 | C2 E2 | C2 F2 | C2 G2 | C2 A2 | C2 B2 | C2 c2 |]\nw: 2.ª * 3.ª * 4.ª * 5.ª * 6.ª * 7.ª * 8.ª *",
  "Intervalos melódicos a partir de do.")])

T['intervalles-qualites'] = ("Calidades y tabla de intervalos",
"justa mayor menor aumentada disminuida tritono semitonos tabla calidad",
"""<p>La <b>calidad</b> precisa un intervalo: <b>justo</b> (J), <b>mayor</b> (M), <b>menor</b> (m), <b>aumentado</b> (aum.) o <b>disminuido</b> (dism.).</p>
<ul><li>Los unísonos, cuartas, quintas y octavas son <b>justos</b> (o aumentados/disminuidos).</li>
<li>Las segundas, terceras, sextas y séptimas son <b>mayores o menores</b> (o aumentadas/disminuidas).</li></ul>
<table class="lt"><tr><th>Intervalo</th><th>Abrev.</th><th>Semitonos</th><th>A partir de do</th></tr>
<tr><td>Unísono</td><td>Unísono</td><td>0</td><td>do</td></tr>
<tr><td>Segunda menor</td><td>2.ª m</td><td>1</td><td>re♭</td></tr>
<tr><td>Segunda mayor</td><td>2.ª M</td><td>2</td><td>re</td></tr>
<tr><td>Tercera menor</td><td>3.ª m</td><td>3</td><td>mi♭</td></tr>
<tr><td>Tercera mayor</td><td>3.ª M</td><td>4</td><td>mi</td></tr>
<tr><td>Cuarta justa</td><td>4.ª J</td><td>5</td><td>fa</td></tr>
<tr><td>Cuarta aumentada / quinta disminuida (tritono)</td><td>4.ª aum / 5.ª dism</td><td>6</td><td>fa♯ / sol♭</td></tr>
<tr><td>Quinta justa</td><td>5.ª J</td><td>7</td><td>sol</td></tr>
<tr><td>Sexta menor</td><td>6.ª m</td><td>8</td><td>la♭</td></tr>
<tr><td>Sexta mayor</td><td>6.ª M</td><td>9</td><td>la</td></tr>
<tr><td>Séptima menor</td><td>7.ª m</td><td>10</td><td>si♭</td></tr>
<tr><td>Séptima mayor</td><td>7.ª M</td><td>11</td><td>si</td></tr>
<tr><td>Octava justa</td><td>8.ª</td><td>12</td><td>do</td></tr></table>
<p><b>Truco</b>: en una escala mayor, todos los intervalos desde la tónica hacia arriba son mayores o justos. Un semitono menos = menor (o disminuido para un intervalo justo); un semitono más = aumentado.</p>
<p>El <b>tritono</b> (tres tonos) divide la octava en dos: suena tenso e inestable.</p>""",
[("X:1\nL:1/4\nK:C\n[C_D]2 [C=D]2 [C_E]2 [C=E]2 [CF]2 [C^F]2 | [CG]2 [C_A]2 [C=A]2 [C_B]2 [C=B]2 [Cc]2 |]\nw: 2.ª~m 2.ª~M 3.ª~m 3.ª~M 4.ª~J tritono 5.ª~J 6.ª~m 6.ª~M 7.ª~m 7.ª~M 8.ª",
  "Los intervalos armónicos a partir de do.")])

T['renversement-intervalles'] = ("Inversión de los intervalos",
"invertir inversion intervalo complementario nueve",
"""<p><b>Invertir</b> un intervalo es colocar la nota de abajo una octava más arriba (o la de arriba una octava más abajo). Do–mi se convierte en mi–do.</p>
<ul><li>Los números suman <b>9</b>: una tercera se convierte en sexta, una segunda en séptima, una cuarta en quinta.</li>
<li>La calidad se invierte: <b>mayor ↔ menor</b>, <b>aumentado ↔ disminuido</b>, <b>justo sigue siendo justo</b>.</li></ul>
<p>Ejemplos: 3M → 6m; 2m → 7M; 4J → 5J; 4aum → 5dism. Es práctico para encontrar un intervalo grande: muchas veces es más fácil calcular su inversión.</p>""",
[(None, "3M se convierte en 6m; 4J se convierte en 5J.")])

T['intervalles-composes'] = ("Intervalos compuestos",
"novena decima undecima oncena decimotercera trecena compuesto simple",
"""<p>Un intervalo más grande que una octava es un <b>intervalo compuesto</b>. Se puede reducir a un intervalo simple restándole 7: una <b>9.ª</b> = octava + segunda, una <b>10.ª</b> = octava + tercera, una <b>11.ª</b> = octava + cuarta, una <b>13.ª</b> = octava + sexta.</p>
<p>La calidad es la misma que la del intervalo simple: do–re (una octava más arriba) es una 9.ª mayor. Estos nombres se usan mucho en los acordes de jazz (C9, C11, C13).</p>""",
[("X:1\nL:1/4\nK:C\nC2 d2 | C2 e2 | C2 f2 | C2 a2 |]\nw: 9.ª~M * 10.ª~M * 11.ª~J * 13.ª~M *",
  "Intervalos compuestos a partir de do.")])

T['consonances'] = ("Consonancias y disonancias",
"consonancia disonancia perfecta imperfecta tension reposo",
"""<p>Según la tradición clásica:</p>
<ul><li><b>Consonancias perfectas</b>: unísono, quinta justa, octava. Muy estables, «vacías».</li>
<li><b>Consonancias imperfectas</b>: terceras y sextas (mayores y menores). Estables y con color.</li>
<li><b>Disonancias</b>: segundas, séptimas, intervalos aumentados y disminuidos (entre ellos el tritono). Crean una tensión que pide resolverse.</li></ul>
<p>La <b>cuarta justa</b> es un caso aparte: es consonante entre dos voces superiores, pero se trata como disonancia cuando se forma con el bajo (p. ej., el acorde de <a href="#" data-go="renversements">sexta y cuarta</a>).</p>
<p>Consonancia y disonancia no significan «bonito» y «feo»: la música avanza gracias a la alternancia entre tensión y reposo.</p>""",
[(None, "Consonancias perfectas, imperfectas y luego disonancias (el tritono si–fa se resuelve en do–mi).")])

T['reperes'] = ("Referencias para reconocer de oído",
"cancion referencia memorizar oido intervalos comienzo",
"""<p>Para reconocer un intervalo melódico, se asocia con el <b>comienzo de una melodía conocida</b>. Elige tus propias referencias: las que puedas cantar sin dudar. Algunos ejemplos clásicos:</p>
<table class="lt"><tr><th>Intervalo</th><th>Ascendente</th><th>Descendente</th></tr>
<tr><td>2m</td><td>Tiburón (tema)</td><td>Para Elisa (Beethoven)</td></tr>
<tr><td>2M</td><td>Martinillo (Frère Jacques); Cumpleaños feliz (entre la 2.ª y la 3.ª nota)</td><td>Mary Had a Little Lamb</td></tr>
<tr><td>3m</td><td>Canción de cuna de Brahms</td><td>Hey Jude (Beatles)</td></tr>
<tr><td>3M</td><td>When the Saints Go Marching In</td><td>Swing Low, Sweet Chariot</td></tr>
<tr><td>4J</td><td>Marcha nupcial (Wagner); La Marsellesa</td><td></td></tr>
<tr><td>Tritono</td><td>Maria (West Side Story)</td><td></td></tr>
<tr><td>5J</td><td>Estrellita, ¿dónde estás? (Ah ! vous dirai-je, maman); Star Wars (tema principal, 2.º intervalo)</td><td>Los Picapiedra (tema)</td></tr>
<tr><td>6m</td><td>The Entertainer (Joplin), de la 3.ª a la 4.ª nota</td><td></td></tr>
<tr><td>6M</td><td>My Bonnie</td><td>Nobody Knows the Trouble I've Seen</td></tr>
<tr><td>7m</td><td>Somewhere (West Side Story)</td><td></td></tr>
<tr><td>7M</td><td>Piensa en la octava menos un semitono: muy tensa, «quiere» subir</td><td></td></tr>
<tr><td>8J</td><td>Over the Rainbow</td><td></td></tr></table>
<p><b>Otras estrategias</b>: situar las notas en una escala (do–sol: «1 a 5»), escuchar el color (terceras «dulces», segundas que «rozan», tritono «inquieto») y cantar el intervalo mentalmente antes de responder. El módulo <b>Intervalos</b> te permite volver a escuchar cada intervalo a partir de la misma nota para comparar.</p>""",
[])

T['triades'] = ("Las tríadas",
"acorde perfecto mayor menor disminuida aumentada fundamental tercera quinta superposicion triada",
"""<p>Una <b>tríada</b> es un acorde de tres notas superpuestas por <b>terceras</b>: la <b>fundamental</b>, la <b>tercera</b> y la <b>quinta</b>. Do–mi–sol es la tríada de do.</p>
<table class="lt"><tr><th>Tipo</th><th>Construcción (desde la fundamental)</th><th>Ejemplo</th><th>Símbolo</th></tr>
<tr><td>Mayor (acorde perfecto mayor)</td><td>3M + 5J</td><td>do mi sol</td><td>C</td></tr>
<tr><td>Menor (acorde perfecto menor)</td><td>3m + 5J</td><td>do mi♭ sol</td><td>Cm</td></tr>
<tr><td>Disminuida (quinta disminuida)</td><td>3m + 5dism</td><td>do mi♭ sol♭</td><td>C°</td></tr>
<tr><td>Aumentada (quinta aumentada)</td><td>3M + 5aum</td><td>do mi sol♯</td><td>C+</td></tr></table>
<p>De oído: la mayor suena luminosa y estable; la menor, más oscura; la disminuida, tensa y «apretada»; la aumentada, flotante, como una pregunta.</p>""",
[("X:1\nL:1/4\nK:C\n[CEG]4 | [C_EG]4 | [C_E_G]4 | [CE^G]4 |]\nw: mayor menor disminuida aumentada",
  "Los cuatro tipos de tríadas sobre do.")])

T['accords-degres'] = ("Los acordes sobre cada grado",
"acordes diatonicos grados numeros romanos mayor menor I ii iii IV V vi vii",
"""<p>Al construir una tríada sobre cada nota de la escala (solo con las notas de la tonalidad), se obtienen los <b>acordes diatónicos</b>. Se nombran con <b>números romanos</b>: <b>mayúscula</b> = mayor, <b>minúscula</b> = menor, ° = disminuido, + = aumentado.</p>
<table class="lt"><tr><th>Mayor</th><td>I</td><td>ii</td><td>iii</td><td>IV</td><td>V</td><td>vi</td><td>vii°</td></tr>
<tr><th>Do mayor</th><td>C</td><td>Dm</td><td>Em</td><td>F</td><td>G</td><td>Am</td><td>B°</td></tr>
<tr><th>Menor armónica</th><td>i</td><td>ii°</td><td>III+ (o III)</td><td>iv</td><td>V</td><td>VI</td><td>vii°</td></tr>
<tr><th>La menor</th><td>Am</td><td>B°</td><td>C+ (C)</td><td>Dm</td><td>E</td><td>F</td><td>G♯°</td></tr></table>
<p>Para recordar: en mayor, <b>I, IV y V son mayores</b>; ii, iii y vi son menores; vii° es disminuido. En menor, se sube la sensible para que el <b>V sea mayor</b> (menor armónica). El III usa normalmente la 7.ª natural (C en lugar de C+).</p>""",
[(None, "Los acordes de do mayor."),
 (None, "Los acordes de la menor (V y vii° con la sensible sol♯).")])

T['renversements'] = ("Inversiones de los acordes",
"estado fundamental primera segunda inversion sexta cuarta bajo",
"""<p>Un acorde está en <b>estado fundamental</b> cuando su fundamental está en el bajo. Si otra nota está en el bajo, el acorde está <b>invertido</b>. Lo que cuenta es la nota más grave, no el orden de las demás notas.</p>
<table class="lt"><tr><th>Nota en el bajo</th><th>Nombre</th><th>Cifrado</th></tr>
<tr><td>Fundamental</td><td>Estado fundamental</td><td>(5/3) — no se escribe nada</td></tr>
<tr><td>Tercera</td><td>1.ª inversión (acorde de sexta)</td><td>⁶</td></tr>
<tr><td>Quinta</td><td>2.ª inversión (acorde de sexta y cuarta)</td><td>⁶₄</td></tr></table>
<p>Los números describen los intervalos por encima del bajo: en 1.ª inversión (mi–sol–do), hay una tercera y una <b>sexta</b>; en 2.ª (sol–do–mi), una <b>cuarta</b> y una <b>sexta</b>.</p>
<p>De oído, escucha sobre todo la <b>línea del bajo</b>: un acorde de sexta suena más ligero, menos «asentado». El acorde de sexta y cuarta más frecuente es el <b>I⁶₄ cadencial</b>, justo antes del V.</p>""",
[(None, "El acorde de do en estado fundamental, en 1.ª y luego en 2.ª inversión: el bajo cambia.")])

T['septiemes'] = ("Los acordes de séptima",
"septima dominante V7 mayor menor semidisminuida disminuida inversiones 6/5 4/3 4/2",
"""<p>Un <b>acorde de séptima</b> añade una tercera más por encima de la tríada: fundamental, tercera, quinta y <b>séptima</b>.</p>
<table class="lt"><tr><th>Tipo</th><th>Tríada + 7.ª</th><th>Sobre do</th><th>¿Dónde?</th></tr>
<tr><td><b>7.ª de dominante</b></td><td>mayor + 7m</td><td>C7: do mi sol si♭</td><td>V7</td></tr>
<tr><td>7.ª mayor</td><td>mayor + 7M</td><td>Cmaj7: do mi sol si</td><td>I, IV en mayor</td></tr>
<tr><td>7.ª menor</td><td>menor + 7m</td><td>Cm7: do mi♭ sol si♭</td><td>ii, iii, vi en mayor</td></tr>
<tr><td>7.ª semidisminuida</td><td>disminuida + 7m</td><td>Cø7: do mi♭ sol♭ si♭</td><td>vii en mayor</td></tr>
<tr><td>7.ª disminuida</td><td>disminuida + 7dism</td><td>C°7: do mi♭ sol♭ si𝄫</td><td>vii en menor</td></tr></table>
<p>El <b>V7</b> es el más importante: contiene la sensible y el tritono (si–fa en do), que se resuelven hacia la tónica.</p>
<p><b>Inversiones del V7</b>: V7 (fundamental en el bajo), <b>V⁶₅</b> (tercera), <b>V⁴₃</b> (quinta), <b>V⁴₂</b> (séptima). En la tradición francesa también se escribe 7+, 6/5 (con el 5 tachado), +6 y +4.</p>""",
[(None, "Los cinco acordes de séptima sobre do."),
 (None, "El V7 de do mayor y sus inversiones.")])

T['chiffrage'] = ("El cifrado de los acordes",
"cifrado romano americano letras simbolos C Cm C7 barra slash",
"""<p>Se usan dos sistemas complementarios:</p>
<p><b>1. Números romanos</b> (análisis): indican el <b>grado</b> del acorde en la tonalidad y, por lo tanto, su función. I–IV–V–I es la misma progresión en do mayor o en sol mayor. Los números arábigos añaden la inversión (I⁶, V⁶₅…). Es lo que se pide en el módulo <b>Progresiones</b>.</p>
<p><b>2. Cifrado americano</b> (letras): indica el acorde real, sin referencia a la tonalidad. Se usa en jazz, en música popular y en las tablas de acordes:</p>
<table class="lt"><tr><th>Símbolo</th><th>Acorde</th></tr>
<tr><td>C</td><td>do mayor</td></tr><tr><td>Cm (o C−)</td><td>do menor</td></tr>
<tr><td>C° (o Cdim)</td><td>do disminuido</td></tr><tr><td>C+ (o Caug)</td><td>do aumentado</td></tr>
<tr><td>C7</td><td>do 7.ª de dominante</td></tr><tr><td>Cmaj7 (o CΔ)</td><td>do 7.ª mayor</td></tr>
<tr><td>Cm7</td><td>do menor 7</td></tr><tr><td>Cø (o Cm7♭5)</td><td>do semidisminuido</td></tr>
<tr><td>Csus4</td><td>do–fa–sol (cuarta en lugar de la tercera)</td></tr>
<tr><td>C/E</td><td>acorde de do con mi en el bajo</td></tr></table>""",
[])

T['fonctions'] = ("Funciones tonales y progresiones",
"tonica subdominante predominante dominante funcion progresion enlace",
"""<p>En una tonalidad, los acordes se agrupan en tres <b>funciones</b>:</p>
<ul><li><b>Tónica</b> (reposo): I, y a veces vi o iii.</li>
<li><b>Predominante</b> o subdominante (alejamiento): IV y ii.</li>
<li><b>Dominante</b> (tensión, llamada hacia la tónica): V, V7 y vii°.</li></ul>
<p>El movimiento más natural es: <b>Tónica → Predominante → Dominante → Tónica</b>. Algunos enlaces muy frecuentes:</p>
<ul><li>I – IV – V – I</li><li>I – ii – V – I (y ii – V – I en jazz)</li><li>I – vi – IV – V</li><li>I – V – vi – IV (muy común en la música pop)</li><li>vi – ii – V – I (progresión por quintas)</li></ul>
<p><b>Método para los dictados armónicos</b>: escucha primero el <b>bajo</b>, luego la <b>calidad</b> de cada acorde (mayor o menor), y después usa lo que sabes de los enlaces. Ejemplos: un bajo que sube de do a fa sugiere IV; re en el bajo suele sugerir ii; el bajo que va de sol a la (en lugar de sol a do) anuncia una cadencia rota.</p>""",
[(None, "I – IV – V – I, y luego ii – V – I en do mayor.")])

T['cadences'] = ("Las cadencias",
"cadencia perfecta autentica imperfecta plagal semicadencia rota evitada",
"""<p>Una <b>cadencia</b> es el enlace de acordes que termina una frase, como la puntuación al final de una oración.</p>
<table class="lt"><tr><th>Cadencia</th><th>Acordes</th><th>Efecto</th></tr>
<tr><td><b>Perfecta</b> (auténtica)</td><td>V – I, los dos acordes en estado fundamental</td><td>Punto final</td></tr>
<tr><td><b>Imperfecta</b></td><td>V – I con al menos uno de los dos acordes invertido</td><td>Conclusión más débil</td></tr>
<tr><td><b>Semicadencia</b></td><td>… – V (se detiene en la dominante)</td><td>Coma, pregunta</td></tr>
<tr><td><b>Plagal</b></td><td>IV – I</td><td>El «Amén» de los himnos</td></tr>
<tr><td><b>Rota</b></td><td>V – vi</td><td>Sorpresa: se esperaba I</td></tr></table>
<p>Variante: en varios manuales norteamericanos, la cadencia perfecta exige además la tónica en la voz superior; si no, se habla de cadencia auténtica imperfecta. Comprueba qué definición se usa en tu curso.</p>""",
[(None, "Cadencia perfecta, plagal, semicadencia y cadencia rota, en do mayor.")])

T['notes-etrangeres'] = ("Notas extrañas",
"notas extranas nota de paso bordadura apoyatura retardo anticipacion escapada pedal",
"""<p>Una melodía no contiene solo notas del acorde. Las <b>notas extrañas</b> (que no pertenecen al acorde) unen y dan color a la línea:</p>
<ul><li><b>Nota de paso</b>: une dos notas del acorde por movimiento conjunto (do–<u>re</u>–mi sobre el acorde de do).</li>
<li><b>Bordadura</b>: deja una nota del acorde por grado conjunto y vuelve a ella (mi–<u>fa</u>–mi).</li>
<li><b>Apoyatura</b>: disonancia colocada en el tiempo fuerte, atacada directamente, que se resuelve por grado conjunto.</li>
<li><b>Retardo</b>: una nota del acorde anterior se mantiene sobre el nuevo acorde y luego desciende (preparación – disonancia – resolución).</li>
<li><b>Anticipación</b>: una nota del acorde siguiente llega un poco antes de tiempo.</li>
<li><b>Pedal</b>: nota mantenida (a menudo en el bajo) mientras los acordes cambian.</li></ul>""",
[("X:1\nL:1/8\nK:C\n%%staves {1 2}\nV:1 clef=treble\nc2 d2 e4 | e2 f2 e4 | d4 c4 |]\nw: * paso * * bordadura * apoyat. *\nV:2 clef=bass\n[C,E,G,]8 | [C,E,G,]8 | [C,E,G,]8 |]",
  "Sobre el acorde de do: nota de paso, bordadura, apoyatura.")])

T['nuances'] = ("Los matices",
"matices dinamica piano forte mezzo crescendo decrescendo diminuendo sforzando fortepiano",
"""<p>Los <b>matices</b> indican la intensidad (el volumen). Se escriben debajo del pentagrama, abreviados en italiano:</p>
<table class="lt"><tr><th>Signo</th><th>Italiano</th><th>Significado</th></tr>
<tr><td><b><i>ppp</i></b></td><td>pianississimo</td><td>extremadamente suave</td></tr>
<tr><td><b><i>pp</i></b></td><td>pianissimo</td><td>muy suave</td></tr>
<tr><td><b><i>p</i></b></td><td>piano</td><td>suave</td></tr>
<tr><td><b><i>mp</i></b></td><td>mezzo piano</td><td>medianamente suave</td></tr>
<tr><td><b><i>mf</i></b></td><td>mezzo forte</td><td>medianamente fuerte</td></tr>
<tr><td><b><i>f</i></b></td><td>forte</td><td>fuerte</td></tr>
<tr><td><b><i>ff</i></b></td><td>fortissimo</td><td>muy fuerte</td></tr>
<tr><td><b><i>fff</i></b></td><td>fortississimo</td><td>extremadamente fuerte</td></tr></table>
<ul><li><b>Crescendo</b> (cresc. o ⟨): aumentando; <b>decrescendo</b> o <b>diminuendo</b> (decresc., dim. o ⟩): disminuyendo.</li>
<li><b><i>sfz</i></b> (sforzando): acento repentino en una nota; <b><i>fp</i></b> (fortepiano): fuerte e inmediatamente suave; <i>subito</i>: de repente.</li></ul>""",
[(None, "Piano, crescendo, forte, diminuendo, pianissimo.")])

T['articulations'] = ("Las articulaciones",
"staccato legato tenuto acento marcato calderon ligadura articulacion",
"""<p>Las <b>articulaciones</b> indican cómo atacar y unir las notas:</p>
<table class="lt"><tr><th>Signo</th><th>Nombre</th><th>Efecto</th></tr>
<tr><td>punto encima o debajo</td><td><b>Staccato</b></td><td>nota separada, corta</td></tr>
<tr><td>raya horizontal</td><td><b>Tenuto</b></td><td>nota sostenida todo su valor, ligeramente apoyada</td></tr>
<tr><td>&gt;</td><td><b>Acento</b></td><td>ataque más fuerte</td></tr>
<tr><td>^</td><td><b>Marcato</b></td><td>acento muy marcado</td></tr>
<tr><td>curva sobre varias notas</td><td><b>Legato</b> (ligadura de expresión)</td><td>notas ligadas, sin interrupción</td></tr>
<tr><td>𝄐</td><td><b>Calderón</b></td><td>sostener más tiempo, a elección</td></tr></table>""",
[(None, "Staccato, tenuto, acento, marcato, legato y calderón.")])

T['reprises'] = ("Signos de repetición y de estructura",
"repeticion volta primera segunda casilla da capo dal segno coda fine",
"""<ul><li><b>Barras de repetición</b> (‖: … :‖): el pasaje se toca dos veces. Si no hay barra de inicio, se repite desde el principio de la pieza.</li>
<li><b>1.ª y 2.ª casilla</b> (corchetes numerados): la primera vez, se toca la casilla 1 y se repite; la segunda vez, se salta la casilla 1 y se toca la casilla 2.</li>
<li><b>D.C.</b> (<i>Da Capo</i>): volver al principio. <b>D.C. al Fine</b>: volver al principio y detenerse en la palabra <b>Fine</b>.</li>
<li><b>D.S.</b> (<i>Dal Segno</i>): volver al signo 𝄋.</li>
<li><b>Coda</b> (𝄌): sección final. «D.S. al Coda»: volver al signo, tocar hasta «a la coda» (𝄌) y luego saltar a la coda.</li></ul>
<p>Antes de leer, identifica el recorrido: dónde están las repeticiones, las casillas, el signo y la coda.</p>""",
[(None, "Repetición con 1.ª y 2.ª casilla.")])

T['ornements'] = ("Los ornamentos",
"trino mordente grupeto apoyatura acciaccatura nota de adorno ornamento",
"""<ul><li><b>Trino</b> (tr): alternancia rápida entre la nota escrita y la nota vecina superior.</li>
<li><b>Mordente</b>: nota escrita – nota vecina – nota escrita, muy rápido. Hacia abajo: el mordente (el <i>pincé</i> de los clavecinistas franceses); hacia arriba: el mordente superior (<i>pralltriller</i>, trino corto).</li>
<li><b>Grupeto</b> (∽): nota superior – nota escrita – nota inferior – nota escrita.</li>
<li><b>Apoyatura</b> (nota pequeña): toma una parte del valor de la nota principal, en el tiempo.</li>
<li><b>Acciaccatura</b> (nota pequeña tachada): se toca muy brevemente, justo antes de la nota principal.</li></ul>
<p>La ejecución exacta depende de la época y del estilo: en la música barroca, por ejemplo, el trino suele empezar por la nota superior.</p>""",
[(None, "Trino, mordente, grupeto, apoyatura y acciaccatura.")])

SUPFIX = {'intervalles-composes','reperes','accords-degres','renversements','septiemes','chiffrage','reprises'}
for _id in SUPFIX:
    _t=list(T[_id]); _t[2]=re.sub(r'(\d+)\.([ªº])', lambda m: m.group(1)+'.<sup>'+('a' if m.group(2)=='ª' else 'o')+'</sup>', _t[2]); T[_id]=tuple(_t)
out = []
for c in fr:
    nc = {'id': c['id'], 't': CAT[c['id']], 'topics': []}
    for tp in c['topics']:
        t, k, html, exs = T[tp['id']]
        assert len(exs) == len(tp['ex']), tp['id']
        nex = []
        for (abc, cap), fe in zip(exs, tp['ex']):
            nex.append({'abc': abc if abc is not None else fe['abc'], 'cap': cap})
        nt = dict(tp)
        nt.update({'t': t, 'k': k, 'html': html, 'ex': nex})
        nt['title'] = tp['title']  # all null in source
        nc['topics'].append(nt)
    out.append(nc)
json.dump(out, open(os.path.join(D, 'lib_es_B.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('written')

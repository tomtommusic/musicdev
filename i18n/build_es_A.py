import json, sys
D = '/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/i18n/'
fr = json.load(open(D + 'lib_fr_A.json'))
K = None  # keep original abc

# per category: (t, [ (t, title, k, html, [(abc, cap), ...]) ])
ES = [
("Lectura", [
("Leer una partitura", "Leer una partitura: visión de conjunto",
 "simbolos partitura pentagrama lectura vision conjunto",
 r'''<p>Una partitura se lee como un texto: de izquierda a derecha, línea tras línea. Antes de tocar la primera nota, tómate unos segundos para localizar la información que aparece al principio.</p>
<ol>
<li><b>El pentagrama</b>: las 5 líneas sobre las que se escriben las notas (<a href="#" data-go="portee">El pentagrama</a>).</li>
<li><b>La clave</b>, justo al principio: fija el nombre de las notas (<a href="#" data-go="cles">Las claves</a>).</li>
<li><b>La armadura</b>, justo después de la clave: los sostenidos o bemoles que valen para toda la pieza. Indica la tonalidad (<a href="#" data-go="armures">Las armaduras</a>).</li>
<li><b>La indicación de compás</b>: cuántos tiempos hay en cada compás y qué figura vale un tiempo (<a href="#" data-go="mesures-simples">Compases simples</a>).</li>
<li><b>La indicación de tempo</b>, encima del pentagrama: la velocidad (<a href="#" data-go="tempo">El tempo</a>).</li>
<li><b>Los matices</b>, debajo del pentagrama: el volumen (<a href="#" data-go="nuances">Los matices</a>).</li>
<li><b>Las notas y los silencios</b>: su posición indica la altura y su forma, la duración (<a href="#" data-go="figures-notes">Figuras de nota</a>, <a href="#" data-go="silences">Figuras de silencio</a>).</li>
<li><b>Las barras de compás</b>, las ligaduras, las articulaciones y los signos de repetición (<a href="#" data-go="barres">Barras de compás</a>, <a href="#" data-go="reprises">Repeticiones</a>).</li>
</ol>
<p><b>Consejo de lectura a primera vista</b>: antes de empezar, localiza la tonalidad, el compás, el ritmo más difícil y los saltos importantes. Cuenta un compás en vacío para asentar el pulso y luego ya no te detengas: los errores se corrigen en la siguiente lectura.</p>''',
 [("X:1\nT:Pequeña pieza\nM:3/4\nL:1/8\nQ:\"Moderato\" 1/4=100\nK:G\n!mp! G2 B2 d2 | (c2 B2) A2 | B4 z2 |: !f! d3 c B2 | .A2 .G2 .F2 | G6 :|",
   "Título, tempo, clave de sol, armadura (un sostenido: sol mayor), compás de 3/4, matices, ligadura, silencio, staccato y barras de repetición.")]),
("El pentagrama", None, "lineas espacios",
 r'''<p>El <b>pentagrama</b> está formado por <b>5 líneas</b> horizontales y <b>4 espacios</b> (los huecos entre las líneas). Siempre se cuentan <b>de abajo arriba</b>: la 1.<sup>a</sup> línea es la más baja.</p>
<p>Cuanto más arriba está una nota en el pentagrama, más aguda es. Una nota puede estar <b>en una línea</b> (la línea la atraviesa) o <b>en un espacio</b>. Para ir más arriba o más abajo del pentagrama, se añaden pequeñas <a href="#" data-go="lignes-sup">líneas adicionales</a>.</p>
<p>El pentagrama por sí solo no dice qué notas están escritas: es la <a href="#" data-go="cles">clave</a> la que da el nombre de las líneas.</p>''',
 [("X:1\nL:1/4\nK:C\nE G B d f |]\nw: 1.ª 2.ª 3.ª 4.ª 5.ª", "Las 5 líneas, en clave de sol: mi, sol, si, re, fa."),
  ("X:1\nL:1/4\nK:C\nF A c e |]\nw: 1.º 2.º 3.º 4.º", "Los 4 espacios: fa, la, do, mi.")]),
("Las claves", None, "clave de sol fa do contralto viola tenor",
 r'''<p>La <b>clave</b> da el nombre de una línea; todas las demás notas se deducen a partir de ella.</p>
<ul>
<li><b>Clave de sol</b> (2.<sup>a</sup> línea): la nota de la 2.<sup>a</sup> línea es el <b>sol</b> por encima del do central. Para las voces agudas, la flauta, el violín, la trompeta, la mano derecha del piano…</li>
<li><b>Clave de fa</b> (4.<sup>a</sup> línea): la nota de la 4.<sup>a</sup> línea es el <b>fa</b> por debajo del do central. Para las voces graves, el contrabajo, el fagot, el trombón, la mano izquierda del piano…</li>
<li><b>Clave de do en 3.<sup>a</sup> línea</b> (clave de contralto): la 3.<sup>a</sup> línea es el <b>do central</b>. La usa sobre todo la viola.</li>
<li><b>Clave de do en 4.<sup>a</sup> línea</b> (clave de tenor): la 4.<sup>a</sup> línea es el do central. Para los pasajes agudos del violonchelo, el fagot y el trombón.</li>
</ul>
<p>Truco para la clave de fa: las líneas se leen <b>sol, si, re, fa, la</b> y los espacios <b>la, do, mi, sol</b>.</p>''',
 [("X:1\nL:1/4\nK:C clef=treble\nC4 | [K:clef=bass] C4 | [K:clef=alto] C4 | [K:clef=tenor] C4 |]\nw: sol fa do~3.ª do~4.ª", "El mismo do central escrito en las cuatro claves."),
  ("X:1\nL:1/4\nK:C clef=bass\nG,, B,, D, F, A, |]\nw: sol si re fa la", "Las líneas en clave de fa.")]),
("El nombre de las notas", None, "do re mi fa sol la si letras c d e f g a b",
 r'''<p>Hay <b>7 nombres de notas</b> que se repiten siempre en el mismo orden: <b>do, re, mi, fa, sol, la, si</b>, y luego otra vez do, una octava más arriba.</p>
<p>En los países de habla inglesa y en el jazz se usan <b>letras</b>:</p>
<table class="lt"><tr><th>Español</th><td>do</td><td>re</td><td>mi</td><td>fa</td><td>sol</td><td>la</td><td>si</td></tr>
<tr><th>Letras</th><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>A</td><td>B</td></tr></table>
<p>Atención: en alemán, B designa si♭ y H designa si.</p>
<p><b>Las octavas.</b> Para precisar la altura exacta, se añade un número de octava. Según los libros, el do central del piano se llama <b>do3</b> (tradición francesa) o <b>C4</b> (notación científica anglosajona, habitual en América del Norte). Comprueba siempre qué sistema usa tu manual.</p>
<p>El <b>la de referencia</b> para afinar los instrumentos (la3 o A4) vibra a 440 Hz.</p>''',
 [("X:1\nL:1/4\nK:C\nC D E F G A B c |]\nw: do re mi fa sol la si do\nw: C D E F G A B C", "Una octava de do a do, con los dos sistemas de nombres.")]),
("Líneas adicionales", None, "lineas adicionales suplementarias ledger",
 r'''<p>Cuando una nota sobrepasa el pentagrama, se trazan <b>líneas adicionales</b> cortas (o suplementarias) por encima o por debajo. Se siguen contando líneas y espacios como en el pentagrama.</p>
<p>El <b>do central</b> se escribe en una línea adicional, debajo del pentagrama en clave de sol y encima del pentagrama en clave de fa.</p>
<p>Más allá de tres o cuatro líneas adicionales, es preferible cambiar de clave o usar la indicación <b>8va</b> (tocar una octava más arriba) u <b>8vb</b> (una octava más abajo).</p>''',
 [("X:1\nL:1/4\nK:C\nA, B, C D | g a b c' |]\nw: la si do re sol la si do", "En clave de sol: debajo del pentagrama (la, si, do central, re) y encima (sol, la, si, do).")]),
("El sistema de piano", None, "sistema piano gran pentagrama llave mano derecha izquierda do central",
 r'''<p>El piano usa dos pentagramas unidos por una <b>llave</b>: la clave de sol arriba (normalmente la mano derecha) y la clave de fa abajo (normalmente la mano izquierda). Es el <b>sistema de piano</b> (o gran pentagrama).</p>
<p>El <b>do central</b> está justo entre los dos pentagramas: una línea adicional debajo de la clave de sol, o una línea adicional encima de la clave de fa. Es la misma tecla del piano.</p>''',
 [(K, "El do central escrito en cada pentagrama y luego las dos manos que se alejan.")]),
("El teclado", None, "piano teclas blancas negras semitono",
 r'''<p>En un teclado, las <b>teclas negras</b> están agrupadas de <b>2</b> en 2 y de <b>3</b> en 3. El <b>do</b> es la tecla blanca justo a la izquierda de un grupo de 2 teclas negras; el <b>fa</b>, justo a la izquierda de un grupo de 3.</p>
<p>Dos teclas vecinas (blanca o negra) están a un <b>semitono</b> la una de la otra. Entre <b>mi y fa</b> y entre <b>si y do</b> no hay tecla negra: son semitonos naturales (<a href="#" data-go="tons-demitons">Tonos y semitonos</a>).</p>
<p>Una tecla negra tiene dos nombres: do♯ = re♭, re♯ = mi♭, etc. (<a href="#" data-go="alterations">enarmonía</a>). Prueba el teclado de abajo.</p>
<div data-piano="48,71"></div>''',
 []),
("Las alteraciones", None, "sostenido bemol becuadro doble enarmonia accidental",
 r'''<p>Una <b>alteración</b> modifica la altura de una nota:</p>
<table class="lt"><tr><th>♯</th><td><b>sostenido</b>: sube la nota un semitono</td></tr>
<tr><th>♭</th><td><b>bemol</b>: baja la nota un semitono</td></tr>
<tr><th>♮</th><td><b>becuadro</b>: anula el sostenido o el bemol; la nota vuelve a ser natural</td></tr>
<tr><th>𝄪</th><td><b>doble sostenido</b>: sube dos semitonos</td></tr>
<tr><th>𝄫</th><td><b>doble bemol</b>: baja dos semitonos</td></tr></table>
<ul><li>Colocadas en la clave (<a href="#" data-go="armures">armadura</a>), las alteraciones valen para toda la pieza, en todas las octavas.</li>
<li>Colocadas delante de una nota (<b>alteración accidental</b>), valen hasta el final del compás, solo para esa nota en esa octava.</li></ul>
<p><b>Enarmonía</b>: dos nombres para el mismo sonido. Do♯ y re♭ suenan igual en el piano, pero se elige uno u otro según la tonalidad y la dirección de la melodía.</p>''',
 [("X:1\nL:1/4\nK:C\n^F2 | _B2 | =B2 | ^^F2 | __B2 |]\nw: fa♯ si♭ si♮ fa𝄪 si𝄫", "Sostenido, bemol, becuadro, doble sostenido, doble bemol."),
  ("X:1\nL:1/4\nK:C\n^C2 _D2 | ^F2 _G2 |]\nw: do♯ re♭ fa♯ sol♭", "Notas enarmónicas: mismo sonido, distinto nombre.")]),
("Instrumentos transpositores", None, "si bemol mi bemol fa clarinete trompeta saxofon trompa transposicion",
 r'''<p>Algunos instrumentos leen una nota pero hacen sonar otra: son los <b>instrumentos transpositores</b>. Se dice que un instrumento está «en si♭» cuando el do escrito suena si♭.</p>
<table class="lt"><tr><th>Instrumento</th><th>El do escrito suena…</th></tr>
<tr><td>Clarinete en si♭, trompeta en si♭, saxo soprano</td><td>si♭: una <b>segunda mayor más abajo</b></td></tr>
<tr><td>Saxo tenor (si♭)</td><td>una <b>novena mayor más abajo</b> (octava + segunda)</td></tr>
<tr><td>Saxo alto (mi♭)</td><td>mi♭: una <b>sexta mayor más abajo</b></td></tr>
<tr><td>Saxo barítono (mi♭)</td><td>una octava + una sexta mayor más abajo</td></tr>
<tr><td>Trompa en fa</td><td>fa: una <b>quinta justa más abajo</b></td></tr></table>
<p>Para tocar juntos, cada músico tiene su parte ya transportada. En MusicDEV, el ajuste <b>Instrumento del alumno (micrófono)</b> tiene en cuenta esta transposición: lees la nota escrita para tu instrumento y el micrófono la compara con el sonido real.</p>''',
 []),
]),
("Ritmo", [
("Pulso, tiempo y compás", None, "pulso tiempo fuerte debil contar marcar",
 r'''<p>El <b>pulso</b> es el latido regular que sientes al escuchar música, el que sigues golpeando con el pie. Cada latido es un <b>tiempo</b>.</p>
<p>Los tiempos se agrupan en <b>compases</b> de 2, 3 o 4 tiempos. El <b>1.<sup>er</sup> tiempo</b> del compás es el <b>tiempo fuerte</b>: es donde se siente el apoyo. Los demás son más débiles. En 4/4: <b>fuerte</b> – débil – <b>semifuerte</b> – débil.</p>
<p><b>Contar</b>: se dicen los números de los tiempos («1, 2, 3, 4») y se añade «y» para las mitades de tiempo («1 y 2 y»). Para los cuartos de tiempo: «1 e y a».</p>
<p>En el módulo Lectura rítmica, mantén el pulso en tu cuerpo (pie, cabeza) mientras marcas el ritmo con las manos.</p>''',
 [("X:1\nM:4/4\nL:1/8\nQ:1/4=80\nK:C clef=perc stafflines=1\nB2 B2 B2 B2 | BB BB BB BB | B2 BB B4 |]\nw: 1 2 3 4 1 y 2 y 3 y 4 y 1 2 y 3", "Contar los tiempos y los medios tiempos.")]),
("Figuras de nota", None, "redonda blanca negra corchea semicorchea fusa duracion valor plica corchete",
 r'''<p>La forma de la nota indica su <b>duración</b>. Cada figura vale la mitad de la anterior:</p>
<table class="lt"><tr><th>Figura</th><th>Valor (en negras)</th><th>Equivale a</th></tr>
<tr><td>Redonda</td><td>4</td><td>2 blancas</td></tr>
<tr><td>Blanca</td><td>2</td><td>2 negras</td></tr>
<tr><td>Negra</td><td>1</td><td>2 corcheas</td></tr>
<tr><td>Corchea</td><td>½</td><td>2 semicorcheas</td></tr>
<tr><td>Semicorchea</td><td>¼</td><td>2 fusas</td></tr>
<tr><td>Fusa</td><td>⅛</td><td></td></tr></table>
<p>La nota está formada por una <b>cabeza</b> (blanca o negra), a veces por una <b>plica</b> (la raya vertical) y por <b>corchetes</b>. Cuando varias corcheas se suceden en el mismo tiempo, los corchetes se sustituyen por una <b>barra</b> que muestra la agrupación por tiempos.</p>
<p>Plica: hacia arriba, a la derecha de la cabeza, si la nota está por debajo de la 3.<sup>a</sup> línea; hacia abajo, a la izquierda, a partir de la 3.<sup>a</sup> línea.</p>''',
 [(K, "Redonda, 2 blancas, 4 negras, 8 corcheas: cada compás dura 4 tiempos."),
  (K, "Corcheas y semicorcheas agrupadas por tiempos con barras.")]),
("Figuras de silencio", None, "silencio redonda blanca negra corchea semicorchea fusa",
 r'''<p>A cada figura de nota le corresponde un <b>silencio</b> de la misma duración:</p>
<table class="lt"><tr><th>Nota</th><th>Silencio</th><th>Duración (en negras)</th></tr>
<tr><td>Redonda</td><td><b>Silencio de redonda</b> (rectángulo colgado bajo la 4.<sup>a</sup> línea)</td><td>4</td></tr>
<tr><td>Blanca</td><td><b>Silencio de blanca</b> (rectángulo apoyado sobre la 3.<sup>a</sup> línea)</td><td>2</td></tr>
<tr><td>Negra</td><td><b>Silencio de negra</b></td><td>1</td></tr>
<tr><td>Corchea</td><td><b>Silencio de corchea</b></td><td>½</td></tr>
<tr><td>Semicorchea</td><td><b>Silencio de semicorchea</b></td><td>¼</td></tr>
<tr><td>Fusa</td><td><b>Silencio de fusa</b></td><td>⅛</td></tr></table>
<p>El <b>silencio de redonda</b> sirve también para indicar <b>un compás entero de silencio</b>, sea cual sea el compás (3/4, 6/8…).</p>
<p>Truco: el silencio de redonda «cuelga» como un objeto pesado; el de blanca está «apoyado» como un sombrero.</p>''',
 [(K, "Silencio de redonda, de blanca, de negra, de corchea y de semicorchea.")]),
("Puntillos y ligaduras", None, "nota con puntillo doble puntillo ligadura prolongacion expresion frase legato",
 r'''<p><b>El puntillo</b> colocado después de una nota o de un silencio le añade <b>la mitad de su valor</b>:</p>
<ul><li>blanca con puntillo = 2 + 1 = <b>3 tiempos</b></li><li>negra con puntillo = 1 + ½ = <b>1 tiempo y ½</b></li><li>corchea con puntillo = ½ + ¼ = <b>¾ de tiempo</b> (a menudo seguida de una semicorchea)</li></ul>
<p><b>El doble puntillo</b> añade la mitad y luego la cuarta parte del valor: negra con doble puntillo = 1 + ½ + ¼ = 1 ¾ tiempos.</p>
<p><b>La ligadura de prolongación</b> une dos notas <b>de la misma altura</b>: se toca la primera y se mantiene durante la duración de las dos. Permite pasar por encima de una barra de compás.</p>
<p><b>La ligadura de expresión</b> (o de fraseo) une notas <b>de alturas diferentes</b>: se tocan ligadas (legato), sin cortar el sonido entre ellas.</p>''',
 [(K, "Negra con puntillo + corchea, blanca con puntillo + negra, y luego ligadura de prolongación y ligadura de expresión.")]),
("Compases simples", None, "indicacion de compas 2/4 3/4 4/4 c alla breve",
 r'''<p>La <b>indicación de compás</b> se coloca después de la armadura. En un <b>compás simple</b>, cada tiempo se divide en <b>dos</b>.</p>
<ul><li>El número de <b>arriba</b> = el <b>número de tiempos</b> por compás.</li>
<li>El número de <b>abajo</b> = la figura que vale <b>un tiempo</b>: 2 = blanca, 4 = negra, 8 = corchea.</li></ul>
<table class="lt"><tr><th>Compás</th><th>Tiempos</th><th>Unidad de tiempo</th></tr>
<tr><td>2/4</td><td>2</td><td>negra (marcha)</td></tr>
<tr><td>3/4</td><td>3</td><td>negra (vals, minueto)</td></tr>
<tr><td>4/4 o <b>C</b></td><td>4</td><td>negra (el más habitual)</td></tr>
<tr><td>2/2 o <b>¢</b> (alla breve)</td><td>2</td><td>blanca</td></tr></table>''',
 [(K, "2/4, 3/4, 4/4 y alla breve.")]),
("Compases compuestos", None, "6/8 9/8 12/8 negra con puntillo ternario",
 r'''<p>En un <b>compás compuesto</b>, cada tiempo se divide en <b>tres</b>. La unidad de tiempo es una <b>figura con puntillo</b> (casi siempre la negra con puntillo).</p>
<ul><li>Número de arriba ÷ 3 = <b>número de tiempos</b>.</li><li>El número de abajo indica la figura que vale <b>un tercio de tiempo</b> (8 = corchea).</li></ul>
<table class="lt"><tr><th>Compás</th><th>Tiempos</th><th>Unidad de tiempo</th><th>División</th></tr>
<tr><td>6/8</td><td>2</td><td>negra con puntillo</td><td>3 corcheas por tiempo</td></tr>
<tr><td>9/8</td><td>3</td><td>negra con puntillo</td><td>3 corcheas por tiempo</td></tr>
<tr><td>12/8</td><td>4</td><td>negra con puntillo</td><td>3 corcheas por tiempo</td></tr>
<tr><td>6/4</td><td>2</td><td>blanca con puntillo</td><td>3 negras por tiempo</td></tr></table>
<p>Atención: 6/8 no son «6 tiempos de corchea» tocados rápido, sino <b>2 grandes tiempos</b> con balanceo: «<b>1</b> 2 3 <b>4</b> 5 6».</p>''',
 [(K, "6/8 (dos tiempos de negra con puntillo), 9/8 y 12/8.")]),
("Tresillos y otros grupos irregulares", None, "tresillo dosillo quintillo grupo irregular division",
 r'''<p>Un <b>grupo irregular</b> divide una duración de forma poco habitual. Se indica con un número encima del grupo.</p>
<ul><li><b>Tresillo</b> (3): <b>3 notas en el tiempo de 2</b>. En 4/4, un tresillo de corcheas ocupa un tiempo; un tresillo de negras ocupa dos tiempos.</li>
<li><b>Dosillo</b> (2): <b>2 notas en el tiempo de 3</b>, usado en compás compuesto.</li>
<li><b>Quintillo</b> (5), <b>seisillo</b> (6)…: 5 o 6 notas en el tiempo de 4.</li></ul>
<p>Para tocar bien un tresillo, piensa en la palabra «tre-si-llo» repartida por igual en el tiempo.</p>''',
 [(K, "Tresillo de corcheas (un tiempo) y luego tresillo de negras (dos tiempos)."),
  (K, "Dosillo en 6/8: dos corcheas en el tiempo de tres.")]),
("Síncopa y contratiempo", None, "sincopa contratiempo desplazamiento acento",
 r'''<p>Una <b>síncopa</b> es una nota que empieza en una parte <b>débil</b> del tiempo (o en un tiempo débil) y se prolonga sobre la parte <b>fuerte</b> siguiente. El acento se desplaza: se siente un desfase. Ejemplo clásico: corchea – negra – corchea.</p>
<p>Un <b>contratiempo</b> es una nota tocada en la parte débil, precedida de un silencio en la parte fuerte (silencio de corchea – corchea). La nota no se prolonga.</p>
<p>Truco: cuenta las «y» en voz alta («1 y 2 y») y coloca la nota en la «y» sin cortarla demasiado pronto.</p>''',
 [(K, "Dos síncopas (corchea – negra – corchea) y luego contratiempos.")]),
("Barras de compás", None, "barra doble barra final compas",
 r'''<p>La <b>barra de compás</b> es una raya vertical que separa los compases. Cada compás contiene exactamente el número de tiempos indicado por la <a href="#" data-go="mesures-simples">indicación de compás</a>.</p>
<ul><li><b>Doble barra</b> (dos rayas finas): final de una sección, cambio de armadura o de compás.</li>
<li><b>Barra final</b> (raya fina + raya gruesa): final de la pieza.</li>
<li><b>Barras de repetición</b> (con dos puntos): pasaje que se toca dos veces (<a href="#" data-go="reprises">Signos de repetición</a>).</li></ul>
<p>Una <b>anacrusa</b> es un compás incompleto al principio de la pieza (una o varias notas antes del primer tiempo fuerte). En ese caso, el último compás suele acortarse en la misma medida.</p>''',
 [(K, "Barra simple, doble barra, barras de repetición, barra final.")]),
("El tempo", None, "tempo bpm metronomo allegro andante adagio largo presto moderato ritardando accelerando",
 r'''<p>El <b>tempo</b> es la velocidad del pulso. Se indica de dos maneras:</p>
<ul><li>con un <b>número de pulsos por minuto</b> (♩ = 60: una negra por segundo), que se ajusta en un metrónomo;</li>
<li>con un <b>término italiano</b> (valores aproximados):</li></ul>
<table class="lt"><tr><th>Término</th><th>Significado</th><th>Aprox.</th></tr>
<tr><td>Largo, Lento</td><td>muy lento</td><td>40–60</td></tr>
<tr><td>Adagio</td><td>lento</td><td>60–76</td></tr>
<tr><td>Andante</td><td>andando, al paso</td><td>76–108</td></tr>
<tr><td>Moderato</td><td>moderado</td><td>108–120</td></tr>
<tr><td>Allegro</td><td>rápido, alegre</td><td>120–168</td></tr>
<tr><td>Presto</td><td>muy rápido</td><td>168–200</td></tr></table>
<p><b>Cambios de tempo</b>: <i>accelerando</i> (accel., acelerando), <i>ritardando</i> o <i>rallentando</i> (rit., rall., ralentizando), <i>a tempo</i> (volver al tempo), <i>rubato</i> (tempo flexible). El <b>calderón</b> (𝄐) prolonga una nota o un silencio a criterio del intérprete.</p>''',
 [(K, "Indicación de tempo y calderón.")]),
]),
("Escalas y tonalidades", [
("Tonos y semitonos", None, "tono semitono cromatico diatonico",
 r'''<p>El <b>semitono</b> es la distancia más pequeña entre dos notas en nuestra música: dos teclas vecinas del piano. El <b>tono</b> vale dos semitonos.</p>
<p>Entre las notas naturales hay un tono en todas partes, <b>salvo entre mi–fa y si–do</b>, donde solo hay un semitono.</p>
<ul><li><b>Semitono diatónico</b>: dos nombres diferentes (mi–fa, do–re♭).</li>
<li><b>Semitono cromático</b>: mismo nombre, alterado (do–do♯).</li></ul>''',
 [("X:1\nL:1/4\nK:C\nC D E F G A B c |]\nw: do re mi fa sol la si do", "Do re (tono), re mi (tono), mi fa (semitono), fa sol, sol la, la si (tonos), si do (semitono).")]),
("La escala mayor", None, "escala mayor tono tono semitono estructura",
 r'''<p>Una <b>escala</b> es una sucesión de notas por grados conjuntos que parte de una nota (la <b>tónica</b>) y sube hasta la misma nota una octava más arriba.</p>
<p>La <b>escala mayor</b> sigue siempre el mismo modelo:</p>
<p class="formula">T – T – ½ – T – T – T – ½</p>
<p>(T = tono, ½ = semitono). Los semitonos están entre los grados 3–4 y 7–8. La escala de do mayor solo usa notas naturales; para las demás, se añaden sostenidos o bemoles para respetar el modelo. Esas alteraciones forman la <a href="#" data-go="armures">armadura</a>.</p>
<p>Una escala mayor está formada por dos <b>tetracordos</b> idénticos (T–T–½) separados por un tono: do-re-mi-fa / sol-la-si-do.</p>''',
 [(K, "Do mayor, ascendente y descendente."),
  ("X:1\nL:1/4\nK:G\nG A B c d e f g |]\nw: sol la si do re mi fa♯ sol", "Sol mayor: hace falta un fa♯ para mantener el semitono entre los grados 7 y 8.")]),
("Las escalas menores", None, "menor natural armonica melodica sensible",
 r'''<p class="lxtip">¿Eres nuevo? Empieza por el método paso a paso: <a href="#" data-go="relatives">de la escala mayor a sus tres escalas menores</a>.</p>
<p>Hay tres formas de escala menor. Todas comparten el principio: <b>T – ½ – T – T</b> (la tercera es menor).</p>
<ul><li><b>Menor natural</b>: T – ½ – T – T – ½ – T – T. Mismas notas que su <a href="#" data-go="relatives">relativa mayor</a> (la menor = notas de do mayor).</li>
<li><b>Menor armónica</b>: se <b>sube el 7.<sup>o</sup> grado</b> un semitono. Se convierte en <b>sensible</b>, a un semitono de la tónica. Entre los grados 6 y 7 aparece una <b>segunda aumentada</b> (1 tono y ½), muy característica.</li>
<li><b>Menor melódica</b>: al subir, se <b>suben el 6.<sup>o</sup> y el 7.<sup>o</sup> grado</b>; al bajar, se vuelve a la forma natural.</li></ul>
<p>La forma armónica sirve sobre todo para construir los acordes (V y vii°); la forma melódica, para escribir melodías fluidas.</p>''',
 [("X:1\nL:1/4\nK:Am\nA, B, C D E F G A |]\nw: la si do re mi fa sol la", "La menor natural."),
  ("X:1\nL:1/4\nK:Am\nA, B, C D E F ^G A |]\nw: la si do re mi fa sol♯ la", "La menor armónica: sol♯ (sensible)."),
  (K, "La menor melódica: fa♯ y sol♯ al subir, naturales al bajar.")]),
("Los grados de la escala", None, "tonica supertonica mediante subdominante dominante superdominante sensible subtonica numeros romanos",
 r'''<p>Cada nota de la escala es un <b>grado</b>, numerado con números romanos y con un nombre que describe su función:</p>
<table class="lt"><tr><th>Grado</th><th>Nombre</th><th>En do mayor</th></tr>
<tr><td>I</td><td><b>Tónica</b>: la nota de reposo, la que da nombre a la tonalidad</td><td>do</td></tr>
<tr><td>II</td><td>Supertónica</td><td>re</td></tr>
<tr><td>III</td><td>Mediante (determina si es mayor o menor)</td><td>mi</td></tr>
<tr><td>IV</td><td>Subdominante</td><td>fa</td></tr>
<tr><td>V</td><td><b>Dominante</b>: el grado más importante después de la tónica</td><td>sol</td></tr>
<tr><td>VI</td><td>Superdominante</td><td>la</td></tr>
<tr><td>VII</td><td><b>Sensible</b> (a un semitono de la tónica); <b>subtónica</b> si está a un tono (menor natural)</td><td>si</td></tr></table>
<p>La sensible «atrae» al oído hacia la tónica: es lo que da la sensación de conclusión.</p>''',
 [(K, "Los grados en do mayor.")]),
("Las armaduras", None, "armadura sostenidos bemoles orden encontrar tonalidad",
 r'''<p>La <b>armadura</b> reúne, al principio de cada pentagrama, los sostenidos o los bemoles de la tonalidad. Siempre se escriben <b>en el mismo orden</b>:</p>
<p class="formula">Sostenidos: fa – do – sol – re – la – mi – si<br>Bemoles: si – mi – la – re – sol – do – fa</p>
<p>(El orden de los bemoles es el de los sostenidos al revés.) Para recordarlo todo de golpe, mira <a href="#" data-go="truc-armures">el truco del Boss</a>.</p>
<p><b>Encontrar la tonalidad mayor</b>:</p>
<ul><li>con sostenidos: la tónica está <b>un semitono por encima del último sostenido</b> (último sostenido do♯ → re mayor);</li>
<li>con bemoles: la tónica es <b>el penúltimo bemol</b> (si♭, mi♭ → mi♭ mayor). Excepción que hay que recordar: un solo bemol = fa mayor;</li>
<li>ninguna alteración: do mayor.</li></ul>
<p>Cada armadura corresponde también a una tonalidad menor, la <a href="#" data-go="relatives">relativa</a>, situada una tercera menor más abajo. Para saber cuál es, mira la melodía: la última nota, el bajo final y la presencia de la sensible (una alteración accidental) delatan el modo menor.</p>''',
 [("X:1\nL:1/4\nK:G\nG4 | [K:D] D4 | [K:A] A4 | [K:E] E4 | [K:B] B4 |]\nw: Sol Re La Mi Si", "Armaduras con sostenidos: sol, re, la, mi, si mayor (de 1 a 5 sostenidos)."),
  ("X:1\nL:1/4\nK:F\nF4 | [K:Bb] B4 | [K:Eb] E4 | [K:Ab] A4 | [K:Db] D4 |]\nw: Fa Si♭ Mi♭ La♭ Re♭", "Armaduras con bemoles: fa, si♭, mi♭, la♭, re♭ mayor (de 1 a 5 bemoles).")]),
("El truco del Boss", "El truco del Boss: encontrar una armadura de un vistazo",
 "boss truco armadura sostenidos bemoles orden fila tonalidad numero alteraciones encontrar relativa",
 r'''<p>El truco del Boss: basta con recordar <b>dos filas de nombres</b>. Cada fila da a la vez <b>el orden de las alteraciones</b> y <b>el nombre de las tonalidades</b>, y el número bajo cada nombre indica <b>cuántas alteraciones</b> tiene esa tonalidad mayor.</p>
<div class="trick-static">
<div class="tsrow"><span class="tslab">Sostenidos ♯</span><span>Fa♯<i>6</i></span><span>Do♯<i>7</i></span><span>Sol<i>1</i></span><span>Re<i>2</i></span><span>La<i>3</i></span><span>Mi<i>4</i></span><span>Si<i>5</i></span></div>
<div class="tsrow"><span class="tslab">Bemoles ♭</span><span>Si♭<i>2</i></span><span>Mi♭<i>3</i></span><span>La♭<i>4</i></span><span>Re♭<i>5</i></span><span>Sol♭<i>6</i></span><span>Do♭<i>7</i></span><span>Fa<i>1</i></span></div>
</div>
<p><b>Leer la fila de izquierda a derecha</b> da el orden de las alteraciones: <b>fa, do, sol, re, la, mi, si</b> para los sostenidos y <b>si, mi, la, re, sol, do, fa</b> para los bemoles.</p>
<p><b>De la tonalidad a la armadura</b>: busca la tonalidad en su fila; el número de debajo dice cuántas alteraciones hay. Luego se toman <b>desde el principio de la fila</b>.<br>
<i>Ejemplo</i>: re mayor → número <b>2</b> → los 2 primeros de la fila de los sostenidos: <b>fa♯ y do♯</b>.</p>
<p><b>De la armadura a la tonalidad</b>: cuenta las alteraciones en la partitura y busca ese número en la fila correcta.<br>
<i>Ejemplo</i>: 4 bemoles → el <b>4</b> está bajo <b>la♭</b>: estamos en <b>la♭ mayor</b>… o en su <a href="#" data-go="relatives">relativa</a>, <b>fa menor</b> (una tercera menor más abajo).</p>
<p>Ninguna alteración: do mayor (o la menor). Pruébalo: haz clic en una tonalidad aquí abajo.</p>
<div data-widget="armtrick"></div>''',
 []),
("El círculo de quintas", None, "ciclo circulo quintas tonalidades vecinas",
 r'''<p>Subiendo <b>de quinta en quinta</b> a partir de do, se añade un sostenido en cada tonalidad; bajando de quinta en quinta (o subiendo de cuarta en cuarta), se añade un bemol.</p>
<table class="lt"><tr><th>Alteraciones</th><th>Mayor</th><th>Menor relativa</th></tr>
<tr><td>ninguna</td><td>do</td><td>la</td></tr>
<tr><td>1♯ (fa)</td><td>sol</td><td>mi</td></tr><tr><td>2♯</td><td>re</td><td>si</td></tr><tr><td>3♯</td><td>la</td><td>fa♯</td></tr>
<tr><td>4♯</td><td>mi</td><td>do♯</td></tr><tr><td>5♯</td><td>si</td><td>sol♯</td></tr><tr><td>6♯</td><td>fa♯</td><td>re♯</td></tr><tr><td>7♯</td><td>do♯</td><td>la♯</td></tr>
<tr><td>1♭ (si)</td><td>fa</td><td>re</td></tr><tr><td>2♭</td><td>si♭</td><td>sol</td></tr><tr><td>3♭</td><td>mi♭</td><td>do</td></tr>
<tr><td>4♭</td><td>la♭</td><td>fa</td></tr><tr><td>5♭</td><td>re♭</td><td>si♭</td></tr><tr><td>6♭</td><td>sol♭</td><td>mi♭</td></tr><tr><td>7♭</td><td>do♭</td><td>la♭</td></tr></table>
<p>Las tonalidades <b>vecinas</b> (con una alteración de diferencia) comparten muchas notas: la música modula fácilmente entre ellas. Fa♯ mayor y sol♭ mayor son enarmónicas, igual que do♯/re♭ y si/do♭.</p>''',
 []),
("Tonalidades relativas y escalas menores", "Tonalidades relativas: de mayor a menor",
 "relativa menor natural antigua armonica melodica sexto grado sensible armadura",
 r'''<p>Cada escala mayor tiene una «hermana» menor que usa <b>exactamente las mismas notas</b> y, por tanto, la <b>misma armadura</b>: es su <b>relativa menor</b>. Para encontrarla, basta con partir del <b>6.<sup>o</sup> grado</b> de la escala mayor.</p>
<p>Sigamos el método con do mayor, paso a paso.</p>''',
 [(K, "Do mayor: ninguna alteración. El 6.<sup>o</sup> grado está rodeado con un círculo."),
  ("X:1\nL:1/4\nK:Am\nA, B, C D E F G A |]\nw: la si do re mi fa sol la", "La menor natural: mismas notas que do mayor, misma armadura (ninguna alteración). Do mayor y la menor son <b>tonalidades relativas</b>. Escucha: el color es más oscuro, pero al final le falta impulso, porque el sol está a un tono entero del la."),
  ("X:1\nL:1/4\nK:Am\nA, B, C D E F ^G A |]\nw: la si do re mi fa sol♯ la", "El sol♯ está ahora a un semitono del la: es la <b>sensible</b>, que «atrae» hacia la tónica. Esta forma sirve para construir los acordes (el V se vuelve mayor: mi–sol♯–si). Pero entre fa y sol♯ hay un gran salto de <b>un tono y medio</b> (segunda aumentada), con un color algo oriental."),
  ("X:1\nL:1/4\n%%stretchlast 1\nK:Am\nA, B, C D E ^F ^G A |\nw: la si do re mi fa♯ sol♯ la\nA =G =F E D C B, A, |]\nw: la sol fa mi re do si la", "Al <b>subir</b>, fa♯ y sol♯ hacen que la melodía fluya hacia la tónica. Al <b>bajar</b>, ya no hace falta la sensible: se vuelve a la forma natural (sol y fa rodeados con un círculo).")]),
("Los modos", None, "modos jonico dorico frigio lidio mixolidio eolico locrio",
 r'''<p>Un <b>modo</b> es una escala de 7 notas definida por la posición de sus semitonos. Tocando las teclas blancas del piano a partir de cada nota, se obtienen los 7 modos:</p>
<table class="lt"><tr><th>Modo</th><th>En las teclas blancas</th><th>Color</th></tr>
<tr><td>Jónico</td><td>de do a do</td><td>= mayor</td></tr>
<tr><td>Dórico</td><td>de re a re</td><td>menor con 6.<sup>a</sup> mayor</td></tr>
<tr><td>Frigio</td><td>de mi a mi</td><td>menor con 2.<sup>a</sup> menor</td></tr>
<tr><td>Lidio</td><td>de fa a fa</td><td>mayor con 4.<sup>a</sup> aumentada</td></tr>
<tr><td>Mixolidio</td><td>de sol a sol</td><td>mayor con 7.<sup>a</sup> menor</td></tr>
<tr><td>Eólico</td><td>de la a la</td><td>= menor natural</td></tr>
<tr><td>Locrio</td><td>de si a si</td><td>2.<sup>a</sup> menor y 5.<sup>a</sup> disminuida</td></tr></table>
<p>Se oyen en el canto gregoriano, la música tradicional, el jazz, el rock y las bandas sonoras.</p>''',
 [("X:1\nL:1/4\nK:C\nD E F G A B c d |]\nw: re mi fa sol la si do re", "Modo de re (dórico)."),
  ("X:1\nL:1/4\nK:C\nG A B c d e f g |]\nw: sol la si do re mi fa sol", "Modo de sol (mixolidio): la 7.ª es un fa natural.")]),
("Otras escalas", None, "pentatonica cromatica blues tonos enteros hexatonal",
 r'''<ul><li><b>Pentatónica mayor</b> (5 notas, sin semitonos): grados 1, 2, 3, 5, 6 (do re mi sol la). Muy presente en las músicas tradicionales y populares.</li>
<li><b>Pentatónica menor</b>: la do re mi sol (grados 1, ♭3, 4, 5, ♭7).</li>
<li><b>Escala de blues</b>: la pentatónica menor + la «blue note» (quinta disminuida, ♭5): la do re mi♭ mi sol.</li>
<li><b>Escala cromática</b>: los 12 semitonos. Normalmente se escribe con sostenidos al subir y con bemoles al bajar.</li>
<li><b>Escala de tonos enteros</b>: 6 notas separadas por tonos enteros (do re mi fa♯ sol♯ la♯). Color flotante, muy apreciado por Debussy.</li></ul>''',
 [("X:1\nL:1/4\nK:C\nC D E G A c |]\nw: do re mi sol la do", "Pentatónica mayor de do."),
  ("X:1\nL:1/4\nK:C\nA, C D _E =E G A |]\nw: la do re mi♭ mi sol la", "Escala de blues de la."),
  (K, "Escala cromática ascendente.")]),
]),
]

out = []
assert len(ES) == len(fr)
for c, (ct, tops) in zip(fr, ES):
    assert len(tops) == len(c['topics']), c['id']
    topics = []
    for t, (tt, title, k, html, exs) in zip(c['topics'], tops):
        assert len(exs) == len(t['ex']), t['id']
        assert (title is None) == (t['title'] is None), t['id']
        ex = [{"abc": (e['abc'] if a is None else a), "cap": cap} for e, (a, cap) in zip(t['ex'], exs)]
        topics.append({"id": t['id'], "t": tt, "title": title, "k": k, "html": html, "ex": ex})
    out.append({"id": c['id'], "t": ct, "topics": topics})
json.dump(out, open(D + 'lib_es_A.json', 'w'), ensure_ascii=False, indent=1)
print("ok")

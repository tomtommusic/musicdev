import json
E={};S={}
cap1=lambda x:x[0].upper()+x[1:]
def a(fr,en,es):E[fr]=en;S[fr]=es
a("Modules","Modules","Módulos")
a("Développement de l'oreille musicale","Ear training","Entrenamiento auditivo")
a("Solfège","Solfège","Solfeo")
a("Chaque exercice est généré au hasard selon le réglage choisi. Le bouton","Each exercise is generated at random from the chosen setting. The","Cada ejercicio se genera al azar según el ajuste elegido. El botón")
a("explique tout élément de la page.","button explains anything on the page.","explica cualquier elemento de la página.")
a("? Explications","? Help","? Ayuda")
a("Explications","Help","Ayuda")
a("Clique ensuite sur l'élément qui te cause problème : son explication s'ouvre dans la bibliothèque","Then click the part that's giving you trouble: its explanation opens in the library","Luego haz clic en el elemento que te cuesta: su explicación se abre en la biblioteca")
a("Clique sur l'élément qui te cause problème.","Click the part that's giving you trouble.","Haz clic en el elemento que te cuesta.")
a("Partition","Sheet music","Partitura")
a("Réglages du module","Module settings","Ajustes del módulo")
a("Réussites","Correct","Aciertos")
a("Méthode de travail","How to practice","Método de trabajo")
a("Conseils pour réussir ce module","Tips for this module","Consejos para este módulo")
a("Raccourcis : 2 à 6 = durées (double … ronde) · . = point · 0 = silence · Retour arrière = effacer · ↑ ↓ = déplacer la dernière note · + − = = dièse, bémol, bécarre.",
  "Shortcuts: 2 to 6 = note values (sixteenth … whole) · . = dot · 0 = rest · Backspace = delete · ↑ ↓ = move the last note · + − = = sharp, flat, natural.",
  "Atajos: 2 a 6 = figuras (semicorchea … redonda) · . = puntillo · 0 = silencio · Retroceso = borrar · ↑ ↓ = mover la última nota · + − = = sostenido, bemol, becuadro.")
a("Raccourcis : 2 à 6 = durées (double … ronde) · . = point · 0 = silence · Retour arrière = effacer · Entrée = ajouter la figure.",
  "Shortcuts: 2 to 6 = note values (sixteenth … whole) · . = dot · 0 = rest · Backspace = delete · Enter = add the note value.",
  "Atajos: 2 a 6 = figuras (semicorchea … redonda) · . = puntillo · 0 = silencio · Retroceso = borrar · Intro = añadir la figura.")
a("Raccourcis : 2 à 6 = durées (double … ronde) · . = point · 0 = silence · Retour arrière = effacer","Shortcuts: 2 to 6 = note values (sixteenth … whole) · . = dot · 0 = rest · Backspace = delete","Atajos: 2 a 6 = figuras (semicorchea … redonda) · . = puntillo · 0 = silencio · Retroceso = borrar")
for fr,en,es in [("mesure","measure","compás"),("mesures","measures","compases"),("croche","eighth note","corchea"),("croches","eighth notes","corcheas"),("double","sixteenth note","semicorchea"),("doubles","sixteenth notes","semicorcheas"),("noire","quarter note","negra"),("noires","quarter notes","negras"),("blanche","half note","blanca"),("blanches","half notes","blancas"),("ronde","whole note","redonda"),("rondes","whole notes","redondas"),("temps","beats","tiempos"),("triolets","triplets","tresillos"),("notes","notes","notas"),("accords","chords","acordes"),("questions","questions","preguntas"),
 ("fausse note","wrong note","nota falsa"),("fausse notes","wrong notes","notas falsas"),("note oubliée","missed note","nota olvidada"),("note oubliées","missed notes","notas olvidadas"),("entrée","extra note","nota de más"),("entrées","extra notes","notas de más")]:
    a(fr,en,es)
a("montant","ascending","ascendente");a("descendant","descending","descendente");a("Montant","Ascending","Ascendente");a("Descendant","Descending","Descendente")
a("harmonique (les deux notes ensemble)","harmonic (both notes together)","armónico (las dos notas juntas)")
a("aucune","none","ninguna");a("aucun","none","ninguno");a("tous","all","todos");a("toutes","all","todas")
a("tous les formats","all formats","todos los formatos")
a("rapide","fast","rápido");a("lent","slow","lento");a("1 s (rapide)","1 s (fast)","1 s (rápido)");a("3 s (lent)","3 s (slow)","3 s (lento)")
a("grave","low","grave");a("aigu","high","agudo");a("suraigu","very high","sobreagudo")
a("mesures, puis","measures, then","compases, luego");a("mesures en silence.","measures silent.","compases en silencio.")
a("Rythmes","Rhythms","Ritmos")
a("Qualité…","Quality…","Calidad…")
a("allant, au pas","flowing, at a walking pace","fluido, al paso");a("rapide, joyeux","fast, cheerful","rápido, alegre");a("modéré","moderate","moderado");a("très lent","very slow","muy lento");a("très rapide","very fast","muy rápido")
a("revenir au tempo","return to tempo","volver al tempo")
a("1 ton plus bas","1 whole step down","1 tono más bajo")
a("deuxième","second","segunda");a("premier","first","primera");a("le premier","the first one","el primero")
a("Réponse","Answer","Respuesta");a("Résultat :","Result:","Resultado:")
a("pincé","pincé","mordente")
a("1 ton ½","1½ steps","1 tono ½")
a("(même armure).","(same key signature).","(misma armadura).")
a("<b>1. La gamme de do majeur.</b> On repère sa 6<sup>e</sup> note : <b>la</b>.","<b>1. The C major scale.</b> Find its 6<sup>th</sup> note: <b>A</b>.","<b>1. La escala de do mayor.</b> Localiza su 6.ª nota: <b>la</b>.")
a("On repart de ce <b>la</b> en gardant <b>les mêmes notes</b>","Start again from that <b>A</b>, keeping <b>the same notes</b>","Empieza de nuevo desde ese <b>la</b> conservando <b>las mismas notas</b>")
a("<b>2. La gamme mineure naturelle</b> (aussi appelée gamme mineure <i>ancienne</i>).","<b>2. The natural minor scale</b> (also called the <i>Aeolian</i> minor).","<b>2. La escala menor natural</b> (también llamada menor <i>antigua</i>).")
a("On <b>hausse le 7<sup>e</sup> degré</b> d'un demi-ton : sol devient <b>sol♯</b>","<b>Raise the 7<sup>th</sup> degree</b> by a half step: G becomes <b>G♯</b>","Se <b>sube el 7.º grado</b> un semitono: sol pasa a <b>sol♯</b>")
a("<b>3. La gamme mineure harmonique.</b>","<b>3. The harmonic minor scale.</b>","<b>3. La escala menor armónica.</b>")
a("Pour adoucir ce saut, on <b>hausse aussi le 6<sup>e</sup> degré</b> en montant : fa devient <b>fa♯</b>","To smooth out that leap, <b>also raise the 6<sup>th</sup> degree</b> going up: F becomes <b>F♯</b>","Para suavizar ese salto, <b>se sube también el 6.º grado</b> al subir: fa pasa a <b>fa♯</b>")
a("<b>4. La gamme mineure mélodique.</b>","<b>4. The melodic minor scale.</b>","<b>4. La escala menor melódica.</b>")
a("en avance","early","adelantado");a("en retard","late","atrasado");a("en ralentissant","slowing down","ralentizando")
a("· silence","· rest","· silencio");a("(tonique)","(tonic)","(tónica)");a("(gamme mineure harmonique)","(harmonic minor scale)","(escala menor armónica)")
a("clique sur la portée pour poser le silence","click the staff to place the rest","haz clic en el pentagrama para poner el silencio")
a("clique sur la portée à la hauteur voulue","click the staff at the pitch you want","haz clic en el pentagrama a la altura deseada")
a("clique sur la portée pour l'ajouter","click the staff to add it","haz clic en el pentagrama para añadirla")
a("Mesure","Time","Compás")
for fr,en,es in [("naturelle","natural","natural"),("harmonique","harmonic","armónica"),("mélodique","melodic","melódica")]:
    a("Mineure "+fr,cap1(en)+" minor","Menor "+es);a("mineure "+fr,en+" minor","menor "+es);a("Gamme mineure "+fr,cap1(en)+" minor scale","Escala menor "+es);a("gamme mineure "+fr,en+" minor scale","escala menor "+es)

# enregistreur
for fr,en,es in [
 ("Enregistreur","Recorder","Grabadora"),("S'enregistrer et partager","Record and share","Grabarse y compartir"),
 ("Enregistre-toi, réécoute, nomme le fichier et partage-le par courriel ou autrement.","Record yourself, listen back, name the file and share it by email or any other way.","Grábate, escúchate, ponle nombre al archivo y compártelo por correo o como quieras."),
 ("L'enregistrement n'est pas possible dans ce navigateur.","Recording isn't possible in this browser.","No se puede grabar en este navegador."),
 ("Rien n'a été enregistré. Vérifie le micro et réessaie.","Nothing was recorded. Check the mic and try again.","No se grabó nada. Revisa el micrófono e inténtalo de nuevo."),
 ("C'est envoyé ?","Sent?","¿Enviado?"),(" Supprime l'enregistrement pour garder l'app légère."," Delete the recording to keep the app light."," Borra la grabación para que la app siga ligera."),
 ("Supprime l'enregistrement pour garder l'app légère.","Delete the recording to keep the app light.","Borra la grabación para que la app siga ligera."),
 ("Supprimer l'enregistrement","Delete the recording","Borrar la grabación"),("Garder pour l'instant","Keep it for now","Conservarla por ahora"),
 ("Un seul enregistrement à la fois.","One recording at a time.","Una sola grabación a la vez."),
 ("Le dernier sera supprimé : partage-le d'abord si tu veux le garder.","The last one will be deleted: share it first if you want to keep it.","La anterior se borrará: compártela antes si quieres conservarla."),
 ("Supprimer et enregistrer","Delete and record","Borrar y grabar"),("Annuler","Cancel","Cancelar"),
 ("■ Arrêter","■ Stop","■ Detener"),("● Enregistrer","● Record","● Grabar"),("Enregistrement…","Recording…","Grabando…"),("Préparation…","Getting ready…","Preparando…"),
 ("Enregistrement prêt","Recording ready","Grabación lista"),("Prêt","Ready","Listo"),
 ("Ton enregistrement apparaîtra ici : tu pourras l'écouter, le nommer, puis le partager.","Your recording will appear here: you can listen to it, name it, then share it.","Tu grabación aparecerá aquí: podrás escucharla, ponerle nombre y compartirla."),
 ("Nom du fichier","File name","Nombre del archivo"),("Partager…","Share…","Compartir…"),("Télécharger","Download","Descargar"),("Télécharger le fichier","Download the file","Descargar el archivo"),("Supprimer","Delete","Borrar"),
 ("« Partager » ouvre le menu de ton appareil : courriel, messages, AirDrop, Fichiers…","\"Share\" opens your device's menu: email, messages, AirDrop, Files…","«Compartir» abre el menú de tu dispositivo: correo, mensajes, AirDrop, Archivos…"),
 ("Le fichier est enregistré dans tes téléchargements : joins-le ensuite à un courriel.","The file is saved to your downloads: then attach it to an email.","El archivo se guarda en tus descargas: luego adjúntalo a un correo."),
 ("Ton enregistrement","Your recording","Tu grabación"),("Avant d'enregistrer","Before recording","Antes de grabar"),
 ("Décompte d'une mesure avant de commencer","One-measure count-in before starting","Cuenta previa de un compás antes de empezar"),
 ("Métronome pendant l'enregistrement (avec des écouteurs, il ne s'entend pas dans l'enregistrement)","Metronome while recording (with headphones, it won't be heard in the recording)","Metrónomo durante la grabación (con auriculares, no se oye en la grabación)"),
 ("Le tempo et le nombre de temps sont ceux du","Tempo and beats per measure come from the","El tempo y los tiempos por compás son los del"),("métronome","metronome","metrónomo"),
 ("Durée maximale","Maximum length","Duración máxima"),
 ("Garde l'écran allumé pendant l'enregistrement : s'il se verrouille, l'appareil coupe le micro. Un seul enregistrement est gardé à la fois, le temps de le partager.","Keep the screen on while recording: if it locks, the device cuts the mic. Only one recording is kept at a time, just long enough to share it.","Mantén la pantalla encendida durante la grabación: si se bloquea, el dispositivo corta el micrófono. Solo se guarda una grabación a la vez, el tiempo de compartirla."),
 ("Le micro a été refusé. Autorise-le dans les réglages de l'appareil ou du navigateur, puis réessaie.","Mic access was denied. Allow it in your device or browser settings, then try again.","Se denegó el micrófono. Permítelo en los ajustes del dispositivo o del navegador y vuelve a intentarlo."),
]:a(fr,en,es)

for fr,en,es in [("▶ Écouter le tempo","▶ Hear the tempo","▶ Escuchar el tempo"),("Ce tempo est aussi celui du","This is also the tempo of the","Este tempo es también el del"),("Temps par mesure","Beats per measure","Tiempos por compás")]:a(fr,en,es)

for fr,en,es in [("Décompte avant d'enregistrer","Count-in before recording","Cuenta previa antes de grabar"),("Métronome pendant l'enregistrement","Metronome while recording","Metrónomo durante la grabación"),
 (": décompte d'une mesure avant de commencer",": one-measure count-in before starting",": cuenta previa de un compás antes de empezar"),
 ("Métronome","Metronome","Metrónomo"),
 (": clic pendant l'enregistrement (avec des écouteurs, il ne s'entend pas dans l'enregistrement). Touche pour activer ou désactiver.",": click while recording (with headphones, it won't be heard in the recording). Tap to turn on or off.",": clic durante la grabación (con auriculares, no se oye en la grabación). Toca para activar o desactivar.")]:a(fr,en,es)

# doigtés
for fr,en,es in [
 ("Doigtés","Fingerings","Digitaciones"),("Vents et cordes","Winds and strings","Viento y cuerda"),
 ("Choisis un instrument : tous ses doigtés et toutes les notes du manche, à voir et à entendre.","Pick an instrument: all its fingerings and every note on the neck, to see and hear.","Elige un instrumento: todas sus digitaciones y todas las notas del mástil, para ver y escuchar."),
 ("Bois","Woodwinds","Maderas"),("Cuivres","Brass","Metales"),("Cordes frottées","Bowed strings","Cuerdas frotadas"),("Cordes pincées","Plucked strings","Cuerdas pulsadas"),
 ("Flûte traversière","Flute","Flauta traversa"),("Clarinette en si♭","B♭ clarinet","Clarinete en si♭"),("Saxophone alto","Alto saxophone","Saxofón alto"),("Trompette en si♭","B♭ trumpet","Trompeta en si♭"),
 ("Trombone","Trombone","Trombón"),("Violon","Violin","Violín"),("Alto","Viola","Viola"),("Violoncelle","Cello","Violonchelo"),("Contrebasse","Double bass","Contrabajo"),("Guitare","Guitar","Guitarra"),("Basse électrique","Electric bass","Bajo eléctrico"),
 ("En do : on lit les notes réelles.","In C: you read the actual pitches.","En do: se leen las notas reales."),
 ("Notes écrites. Le son réel est un ton plus bas.","Written notes. The actual sound is a whole step lower.","Notas escritas. El sonido real es un tono más grave."),
 ("En mi♭ : notes écrites. Le son réel est une sixte majeure plus bas.","In E♭: written notes. The actual sound is a major sixth lower.","En mi♭: notas escritas. El sonido real es una sexta mayor más grave."),
 ("Notes écrites. Le son réel est un ton plus bas. 0 = aucun piston.","Written notes. The actual sound is a whole step lower. 0 = no valves.","Notas escritas. El sonido real es un tono más grave. 0 = ningún pistón."),
 ("Notes réelles en clé de fa. Positions de la coulisse : 1 (fermée) à 7 (la plus sortie).","Actual pitches in bass clef. Slide positions: 1 (closed) to 7 (fully out).","Notas reales en clave de fa. Posiciones de la vara: 1 (cerrada) a 7 (la más extendida)."),
 ("Cordes sol, ré, la, mi. Doigts en 1re position : 0 = corde à vide, 1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire.","Strings G, D, A, E. First-position fingers: 0 = open string, 1 = index, 2 = middle, 3 = ring, 4 = pinky.","Cuerdas sol, re, la, mi. Dedos en 1.ª posición: 0 = cuerda al aire, 1 = índice, 2 = medio, 3 = anular, 4 = meñique."),
 ("Cordes do, sol, ré, la (clé d'ut 3e ligne). Mêmes doigtés que le violon, une quinte plus bas.","Strings C, G, D, A (alto clef). Same fingerings as the violin, a fifth lower.","Cuerdas do, sol, re, la (clave de do en 3.ª). Mismas digitaciones que el violín, una quinta más grave."),
 ("Cordes do, sol, ré, la. Doigts en 1re position : 1 à 4, un doigt par demi-ton.","Strings C, G, D, A. First-position fingers: 1 to 4, one finger per half step.","Cuerdas do, sol, re, la. Dedos en 1.ª posición: 1 a 4, un dedo por semitono."),
 ("Cordes mi, la, ré, sol. S'écrit une octave plus haut que le son réel. Doigtés 1-2-4 (méthode Simandl).","Strings E, A, D, G. Written an octave higher than it sounds. 1-2-4 fingering (Simandl method).","Cuerdas mi, la, re, sol. Se escribe una octava más aguda de lo que suena. Digitación 1-2-4 (método Simandl)."),
 ("Accordage standard mi, la, ré, sol, si, mi. S'écrit une octave plus haut que le son réel.","Standard tuning E, A, D, G, B, E. Written an octave higher than it sounds.","Afinación estándar mi, la, re, sol, si, mi. Se escribe una octava más aguda de lo que suena."),
 ("Accordage standard mi, la, ré, sol. S'écrit une octave plus haut que le son réel.","Standard tuning E, A, D, G. Written an octave higher than it sounds.","Afinación estándar mi, la, re, sol. Se escribe una octava más aguda de lo que suena."),
 ("Choisis un instrument","Pick an instrument","Elige un instrumento"),("Instrument","Instrument","Instrumento"),("Changer","Change","Cambiar"),
 ("Doigté","Fingering","Digitación"),("Position","Position","Posición"),("Pistons","Valves","Pistones"),("Son réel","Actual sound","Sonido real"),
 ("(un ton plus bas)","(a whole step lower)","(un tono más grave)"),("(une sixte majeure plus bas)","(a major sixth lower)","(una sexta mayor más grave)"),
 ("Autres doigtés","Other fingerings","Otras digitaciones"),("Autre doigté","Other fingering","Otra digitación"),("Toutes les notes","All notes","Todas las notas"),
 ("Touche une note pour voir son doigté en grand et l'entendre.","Tap a note to see its fingering up close and hear it.","Toca una nota para ver su digitación en grande y escucharla."),
 ("Note précédente","Previous note","Nota anterior"),("Note suivante","Next note","Nota siguiente"),("ou","or","o"),
 ("Corde","String","Cuerda"),("à vide","open","al aire"),("case","fret","traste"),("doigt","finger","dedo"),("position plus haute","higher position","posición más alta"),
 ("Les cases surlignées donnent la même note ; en plus foncé, exactement la même hauteur.","Highlighted spots give the same note; darker ones give exactly the same pitch.","Las casillas resaltadas dan la misma nota; las más oscuras, exactamente la misma altura."),
 ("Case","Fret","Traste"),("♯ dièses","♯ sharps","♯ sostenidos"),("♭ bémols","♭ flats","♭ bemoles"),("Cases 0–12","Frets 0–12","Trastes 0–12"),("Cases 0–19","Frets 0–19","Trastes 0–19"),
 ("Touche une case pour entendre la note et voir toutes les cases qui la donnent.","Tap a fret to hear the note and see every spot that gives it.","Toca un traste para oír la nota y ver todas las casillas que la dan."),
 ("Touche une note pour l'entendre. En gris : notes jouées dans des positions plus hautes.","Tap a note to hear it. Gray: notes played in higher positions.","Toca una nota para escucharla. En gris: notas tocadas en posiciones más altas."),
 ("Toutes les notes du manche","Every note on the neck","Todas las notas del mástil"),("Notes de la touche","Notes on the fingerboard","Notas del diapasón"),
 ("1 bas","low 1","1 bajo"),("2 bas","low 2","2 bajo"),("3 haut","high 3","3 alto"),("1 ext.","1 ext.","1 ext."),("4 ext.","4 ext.","4 ext."),("1 (½ pos.)","1 (½ pos.)","1 (½ pos.)"),
 ("Main gauche","Left hand","Mano izquierda"),("Main droite","Right hand","Mano derecha"),("Pouce","Thumb","Pulgar"),
]:a(fr,en,es)
import json as _j
for fr,v in _j.load(open('/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad/dg/comments_tr.json')).items():a(fr,v['en'],v['es'])

for fr,en,es in [
 ("Clé de si (pouce)","B key (thumb)","Llave de si (pulgar)"),("Levier de si♭ (pouce)","B♭ lever (thumb)","Palanca de si♭ (pulgar)"),("Clé de sol♯","G♯ key","Llave de sol♯"),("Clé de mi♭","E♭ key","Llave de mi♭"),
 ("Clé de do♯","C♯ key","Llave de do♯"),("Clé de do grave","Low C key","Llave de do grave"),("Clé de trille 1","Trill key 1","Llave de trino 1"),("Clé de trille 2","Trill key 2","Llave de trino 2"),
 ("Trou du pouce","Thumb hole","Orificio del pulgar"),("Clé de registre","Register key","Llave de registro"),("Clé de la","A key","Llave de la"),("Clé mi♭/si♭ (palette)","E♭/B♭ sliver key","Llave mi♭/si♭ (paleta)"),
 ("Auriculaire gauche","Left pinky","Meñique izquierdo"),("Auriculaire droit","Right pinky","Meñique derecho"),("Clé latérale","Side key","Llave lateral"),("Clé d'octave","Octave key","Llave de octava"),
 ("Clé de paume","Palm key","Llave de palma"),("Fa avant","Front F","Fa frontal"),("Clé bis","Bis key","Llave bis"),("Clé de fa♯ aigu","High F♯ key","Llave de fa♯ agudo"),("Clés à presser","Keys to press","Llaves que presionar"),
 ("En couleur : toutes les places qui donnent la même note ; en plus foncé, exactement la même hauteur.","In color: every spot that gives the same note; darker: exactly the same pitch.","En color: todos los lugares que dan la misma nota; más oscuro: exactamente la misma altura."),
 ("Touche une note sur le manche pour l'entendre et voir toutes les places qui la donnent.","Tap a note on the neck to hear it and see every spot that gives it.","Toca una nota en el mástil para escucharla y ver todos los lugares que la dan."),
 ("Touche une note pour l'entendre. Les grands ronds montrent la 1re position, avec le numéro du doigt ; les petits, les positions plus hautes.","Tap a note to hear it. Large circles show first position, with the finger number; small ones show higher positions.","Toca una nota para escucharla. Los círculos grandes muestran la 1.ª posición, con el número de dedo; los pequeños, las posiciones más altas."),
]:a(fr,en,es)

for fr,en,es in [("Tableau des doigtés","Fingering chart","Tabla de digitaciones"),("enfoncé","pressed","presionada"),("ouvert","open","abierta"),
 ("Touche une case pour voir le doigté en grand et l'entendre.","Tap a box to see the fingering up close and hear it.","Toca una casilla para ver la digitación en grande y escucharla.")]:a(fr,en,es)

a("Touche une note pour l'entendre. La pastille indique le doigt en 1re position (↓ bas, ↑ haut, x extension) ; les notes pâles se jouent dans des positions plus hautes.","Tap a note to hear it. The badge shows the first-position finger (↓ low, ↑ high, x extension); faded notes are played in higher positions.","Toca una nota para escucharla. La pastilla indica el dedo en 1.ª posición (↓ bajo, ↑ alto, x extensión); las notas pálidas se tocan en posiciones más altas.")
a("Clé latérale 2","Side key 2","Llave lateral 2")
a("Doigté chromatique","Chromatic fingering","Digitación cromática")
a("Fa♯ chromatique","Chromatic F♯","Fa♯ cromático")
a("Main droite baissée","Right hand down","Mano derecha abajo")
a("Registre suraigu.","Altissimo register.","Registro sobreagudo.")
a("Clé de si/fa♯ (main droite)","B/F♯ key (right hand)","Llave de si/fa♯ (mano derecha)")
a("Le tableau donne d'abord fa♯ gauche + fa droit ; fa♯ gauche seul ou fa♯ droit fonctionnent aussi.","The chart first gives left F♯ + right F; left F♯ alone or right F♯ also work.","La tabla da primero fa♯ izquierdo + fa derecho; fa♯ izquierdo solo o fa♯ derecho también funcionan.")
a("Le tableau donne d'abord les deux auriculaires (G+D) ; mi gauche ou mi droit seuls fonctionnent aussi.","The chart first gives both pinkies (L+R); left E or right E alone also work.","La tabla da primero ambos meñiques (I+D); mi izquierdo o mi derecho solos también funcionan.")
a("Le tableau donne d'abord les deux auriculaires (G+D) ; si gauche ou si droit seuls fonctionnent aussi.","The chart first gives both pinkies (L+R); left B or right B alone also work.","La tabla da primero ambos meñiques (I+D); si izquierdo o si derecho solos también funcionan.")
a("2e position, coulisse légèrement rentrée.","2nd position, slide slightly shortened.","2.ª posición, vara ligeramente recogida.")
a("3e position, coulisse légèrement rentrée.","3rd position, slide slightly shortened.","3.ª posición, vara ligeramente recogida.")
a("En 4e, rentrer légèrement la coulisse.","In 4th, shorten the slide slightly.","En 4.ª, recoge ligeramente la vara.")
a("− = rentrer légèrement la coulisse · + = la sortir légèrement","− = slightly shorten the slide · + = slightly extend it","− = recoger ligeramente la vara · + = sacarla ligeramente")
a("Clé mi♭/si♭","E♭/B♭ key","Llave mi♭/si♭")
a("Doigté de base : majeur droit. Variante : index droit + clé de fa♯ auxiliaire (petite clé entre les doigts 2 et 3 de la main droite).","Basic fingering: right middle finger. Alternate: right index + auxiliary F♯ key (small key between right-hand fingers 2 and 3).","Digitación básica: dedo medio derecho. Variante: índice derecho + llave de fa♯ auxiliar (pequeña llave entre los dedos 2 y 3 de la mano derecha).")
a("Fa♯ auxiliaire","Auxiliary F♯","Fa♯ auxiliar")
a("Clé de fa♯ auxiliaire","Auxiliary F♯ key","Llave de fa♯ auxiliar")
a("Le tableau donne d'abord le si♭ de côté (clé latérale) ; le si♭ « bis » est pratique quand aucun si naturel n'est proche.","The chart first gives side B♭ (side key); bis B♭ is handy when no B natural is nearby.","La tabla da primero el si♭ lateral (llave lateral); el si♭ «bis» es práctico cuando no hay un si natural cerca.")
a("Le tableau donne d'abord « 1 et 1 » (index gauche + index droit) ; le si♭ du pouce est pratique dans les tonalités en bémols.","The chart first gives \"1 and 1\" (left index + right index); thumb B♭ is handy in flat keys.","La tabla da primero «1 y 1» (índice izquierdo + índice derecho); el si♭ de pulgar es práctico en tonalidades con bemoles.")
a("Sans pouce. Le tableau ajoute la clé de mi♭ (auriculaire droit). Avec une patte de si : clé « gizmo ».","No thumb. The chart adds the E♭ key (right pinky). With a B foot: gizmo key.","Sin pulgar. La tabla añade la llave de mi♭ (meñique derecho). Con pata de si: llave «gizmo».")
a("Si♭ du pouce","Thumb B♭","Si♭ de pulgar")
a("Si♭ « bis »","Bis B♭","Si♭ «bis»")
a("Touche une note pour l'entendre. Les rubans blancs marquent la place des doigts en 1re position, comme sur les touches d'élèves.","Tap a note to hear it. The white tapes mark where the fingers go in first position, like on student fingerboards.","Toca una nota para escucharla. Las cintas blancas marcan dónde van los dedos en 1.ª posición, como en los diapasones de estudiantes.")
a("Doigtés d'instruments","Fingering Charts","Digitaciones de instrumentos")
a("Accords de guitare","Guitar Chords","Acordes de guitarra")
a("Trouver un accord","Find a chord","Encontrar un acorde")
a("Choisis une fondamentale et un type d'accord, ou tape son nom : quelques positions à voir et à entendre.","Pick a root and a chord type, or type its name: a few shapes to see and hear.","Elige una fundamental y un tipo de acorde, o escribe su nombre: algunas posiciones para ver y escuchar.")
a("Tape un accord : Am7, Sol7, F♯m…","Type a chord: Am7, G7, F♯m…","Escribe un acorde: Am7, Sol7, F♯m…")
a("Chercher un accord","Search for a chord","Buscar un acorde")
a("Accord non reconnu.","Chord not recognized.","Acorde no reconocido.")
a("Trouver","Find","Buscar")
a("Type d'accord","Chord type","Tipo de acorde")
a("majeur","major","mayor")
a("mineur","minor","menor")
a("septième","seventh","séptima")
a("septième majeure","major seventh","séptima mayor")
a("mineur septième","minor seventh","menor séptima")
a("suspendu 2","suspended 2","suspendido 2")
a("suspendu 4","suspended 4","suspendido 4")
a("septième suspendu 4","seventh suspended 4","séptima suspendido 4")
a("sixte","sixth","sexta")
a("mineur sixte","minor sixth","menor sexta")
a("add9","add9","add9")
a("neuvième","ninth","novena")
a("diminué","diminished","disminuido")
a("septième diminuée","diminished seventh","séptima disminuida")
a("demi-diminué","half-diminished","semidisminuido")
a("augmenté","augmented","aumentado")
a("Position ouverte","Open position","Posición abierta")
a("Aucune position simple trouvée pour cet accord.","No simple shape found for this chord.","No se encontró una posición sencilla para este acorde.")
a("Touche un diagramme pour l'entendre. × = corde étouffée · ○ = corde à vide · chiffres = doigts (1 = index) · nom en gras = fondamentale.","Tap a diagram to hear it. × = muted string · ○ = open string · numbers = fingers (1 = index) · bold name = root.","Toca un diagrama para escucharlo. × = cuerda apagada · ○ = cuerda al aire · números = dedos (1 = índice) · nombre en negrita = fundamental.")
a("Accueil","Home","Inicio")
a("Bienvenue","Welcome","Bienvenida")
a("Un tour rapide de l'app : où trouver les modules, les explications et comment me joindre.","A quick tour of the app: where to find the modules, help, and how to reach me.","Un recorrido rápido por la app: dónde encontrar los módulos, la ayuda y cómo contactarme.")
a("Bienvenue dans MusicDEV","Welcome to MusicDEV","Bienvenido a MusicDEV")
a("Entraîne ton oreille, lis, joue et comprends la musique, à ton rythme.","Train your ear, read, play and understand music, at your own pace.","Entrena tu oído, lee, toca y comprende la música, a tu ritmo.")
a("Choisis un module.","Pick a module.","Elige un módulo.")
a("Ajuste le niveau avec « Réglages ».","Adjust the level with \"Settings\".","Ajusta el nivel con «Ajustes».")
a("Un mot inconnu ? Touche « Explications ».","An unfamiliar word? Tap \"Help\".","¿Una palabra desconocida? Toca «Ayuda».")
a("Une idée ? Un problème ?","An idea? A problem?","¿Una idea? ¿Un problema?")
a("Écris-moi, ça m'aide à améliorer l'app.","Write to me, it helps me improve the app.","Escríbeme, me ayuda a mejorar la app.")
a("✉ Envoyer un commentaire","✉ Send feedback","✉ Enviar un comentario")
a("Langue","Language","Idioma")
a("Les modules","Modules","Los módulos")
a("Choisis ce que tu veux travailler.","Choose what you want to work on.","Elige lo que quieres practicar.")
a("Touche ici pour choisir ce que tu veux travailler.","Tap here to choose what you want to work on.","Toca aquí para elegir lo que quieres practicar.")
a("Touche « ? », puis l'élément à comprendre.","Tap \"?\", then the item you want explained.","Toca «?» y luego el elemento que quieres entender.")
a("Ex. : Am7, Sol7, F♯m","e.g. Am7, G7, F♯m","Ej.: Am7, Sol7, F♯m")
json.dump({'en':E,'es':S},open('extra.json','w'),ensure_ascii=False,indent=0)
print(len(E))

IV=[('1 aug','Unisson augmenté','A1','Augmented unison','1.ª aum','Unísono aumentado'),
('2de dim','Seconde diminuée','d2','Diminished second','2.ª dis','Segunda disminuida'),
('2de aug','Seconde augmentée','A2','Augmented second','2.ª aum','Segunda aumentada'),
('3ce dim','Tierce diminuée','d3','Diminished third','3.ª dis','Tercera disminuida'),
('3ce aug','Tierce augmentée','A3','Augmented third','3.ª aum','Tercera aumentada'),
('4te dim','Quarte diminuée','d4','Diminished fourth','4.ª dis','Cuarta disminuida'),
('5te dim','Quinte diminuée','d5','Diminished fifth','5.ª dis','Quinta disminuida'),
('5te aug','Quinte augmentée','A5','Augmented fifth','5.ª aum','Quinta aumentada'),
('6te dim','Sixte diminuée','d6','Diminished sixth','6.ª dis','Sexta disminuida'),
('6te aug','Sixte augmentée','A6','Augmented sixth','6.ª aum','Sexta aumentada'),
('7e dim','Septième diminuée','d7','Diminished seventh','7.ª dis','Séptima disminuida'),
('7e aug','Septième augmentée','A7','Augmented seventh','7.ª aum','Séptima aumentada'),
('8ve dim','Octave diminuée','d8','Diminished octave','8.ª dis','Octava disminuida'),
('8ve aug','Octave augmentée','A8','Augmented octave','8.ª aum','Octava aumentada')]
T=[]
for _a,_fr,ae,fe,as_,fs in IV:
    T+=[(_a,ae,as_),(_fr,fe,fs),(_fr.lower(),fe.lower(),fs.lower()),(_a+" · "+_fr.lower(),ae+" · "+fe.lower(),as_+" · "+fs.lower())]
T+=[
("Intervalles augmentés et diminués (théorie avancée)","Augmented and diminished intervals (advanced theory)","Intervalos aumentados y disminuidos (teoría avanzada)"),
("À l'oreille, un intervalle augmenté ou diminué sonne comme un autre (la seconde augmentée sonne comme une tierce mineure). Quand tu en choisis, les deux notes sont écrites sur la portée : nomme l'intervalle d'après l'écriture.","By ear, an augmented or diminished interval sounds like another one (an augmented second sounds like a minor third). When you choose some, both notes are written on the staff: name the interval from the notation.","Al oído, un intervalo aumentado o disminuido suena como otro (la segunda aumentada suena como una tercera menor). Si eliges alguno, las dos notas se escriben en el pentagrama: nombra el intervalo según la escritura."),
("Lis les deux notes sur la portée (écoute-les au besoin), puis nomme l'intervalle : nombre et qualité. Barre d'espace : réécouter.","Read the two notes on the staff (listen if needed), then name the interval: number and quality. Space bar: listen again.","Lee las dos notas en el pentagrama (escúchalas si hace falta) y nombra el intervalo: número y cualidad. Barra espaciadora: volver a escuchar."),
("Altérations accidentelles","Accidentals","Alteraciones accidentales"),
("Aucune (seulement l'armure)","None (key signature only)","Ninguna (solo la armadura)"),
("Dièses, bémols et bécarres","Sharps, flats and naturals","Sostenidos, bemoles y becuadros"),
("Avec doubles dièses et doubles bémols","With double sharps and double flats","Con dobles sostenidos y dobles bemoles"),
("Ajoute des notes altérées en plus de l'armure. Avec les doubles, on voit 𝄪 (double dièse) et 𝄫 (double bémol), comme en théorie avancée.","Adds altered notes on top of the key signature. With doubles you will see 𝄪 (double sharp) and 𝄫 (double flat), as in advanced theory.","Añade notas alteradas además de la armadura. Con las dobles verás 𝄪 (doble sostenido) y 𝄫 (doble bemol), como en teoría avanzada."),
]

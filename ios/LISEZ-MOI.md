# MusicDEV pour iPhone et iPad

Ce dossier contient le projet Xcode de l'app iOS. C'est la même app que le site et les versions Mac et Windows, placée dans une vraie app iPhone : icône, plein écran, hors ligne, micro, et le son joue même en mode silencieux.

## Ce qu'il faut

- Un Mac avec **Xcode** (gratuit dans l'App Store, environ 10 Go).
- Ton **identifiant Apple** (le même que sur ton iPhone).
- Un câble pour brancher l'iPhone au Mac.

## Installer sur ton iPhone

1. Sur GitHub, ouvre le dépôt **musicdev**, puis clique sur **Code → Download ZIP**. Décompresse le fichier.
2. Ouvre `ios/MusicDEV.xcodeproj` (double-clic). Xcode s'ouvre.
3. Dans **Xcode → Réglages → Comptes**, clique sur **+** et connecte ton identifiant Apple.
4. Dans la colonne de gauche, clique sur **MusicDEV** (l'icône bleue en haut), puis sur l'onglet **Signing & Capabilities**.
   - **Team :** choisis ton nom (Personal Team).
   - Si Xcode indique que l'identifiant `ca.tomtommusic.musicdev` est déjà pris, change-le pour quelque chose d'unique, par exemple `ca.tonnom.musicdev`.
5. Branche ton iPhone et déverrouille-le. Choisis **Se fier à cet ordinateur** si l'iPhone le demande.
6. En haut de la fenêtre Xcode, choisis ton iPhone comme destination, puis clique sur **▶︎**.
7. La première fois seulement, l'iPhone peut demander deux autorisations :
   - **Réglages → Confidentialité et sécurité → Mode développeur** → activer, puis redémarrer l'iPhone.
   - **Réglages → Général → VPN et gestion de l'appareil** → choisir ton identifiant Apple → **Faire confiance**.

## Durée de l'installation

- **Identifiant Apple gratuit :** l'app fonctionne 7 jours. Ensuite, rebranche l'iPhone et clique à nouveau sur ▶︎ dans Xcode. Tes réglages et tes résultats sont conservés.
- **Compte Apple Developer (99 $ US par an) :** l'app installée de la même façon dure 1 an. Pour la distribuer à d'autres, utilise **Product → Archive**, puis envoie-la sur TestFlight ou l'App Store.

## Mises à jour

Le projet ne contient pas de copie de l'app : à chaque compilation, Xcode prend les fichiers `index.html`, `abcjs-basic-min.js`, `fonts/` et `icons/` à la racine du dépôt. Pour mettre l'app à jour, télécharge la nouvelle version du dépôt et clique à nouveau sur ▶︎.

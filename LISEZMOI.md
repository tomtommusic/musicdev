# MusiDev : sources de construction

L'application publiée (https://tomtommusic.github.io/musicdev/) est le fichier `index.html` de la branche `main`.
Cette branche `sources` contient tout ce qui sert à le fabriquer. Point de sauvegarde figé : branches
`sauvegarde-2026-10-10` (app) et `sauvegarde-sources-2026-10-10` (sources).

## Reprendre le travail dans une nouvelle session
1. Cloner le dépôt : `git clone https://github.com/tomtommusic/musicdev` (branche `main`), puis
   `git worktree add ../src sources` (ou cloner la branche `sources` à part).
2. Les scripts contiennent un chemin absolu vers l'ancien dossier de travail
   (`/tmp/claude-0/-home-claude-musicdev/4258b5e8-eacb-5999-9d1d-cfd4cbd81d51/scratchpad`) et vers `/home/claude/musicdev` :
   remplacer ces chemins par les nouveaux (`grep -rl scratchpad .` pour les trouver).
3. Construire : `bash build.sh` → copie `index-before-quiz.html` dans `main/index.html`, puis applique dans l'ordre
   `quiz/integrate.py`, `method.py`, `tools/integrate_tools.py`, `features2.py` (accueil + accords de guitare), `unmute.py`, `micbleed.py`, `i18n/integrate_i18n.py`.
4. Publier : augmenter `VERSION` dans `sw.js` (actuellement `musicdev-1.34.0`), commit, push sur `main`
   (GitHub Pages se met à jour en ~30 s). Pousser aussi les sources modifiées sur cette branche.

## Repères
- Doigtés d'instruments : `dg/*.json` (flute, clarinet, altosax, brass) → `python3 dg/build_data.py && python3 dg/fixcom.py`
  → `dg/dg_data.js`; dessin : `cat dg/dg_head.js dg/dg_body.js > dg/dg.js`; styles `dg/dg.css`.
  Chartes copiées des tableaux fournis par l'utilisateur (clarinette mi3–sol6, flûte, saxo alto, trombone).
- Outils : `tools/` (métronome, accordeur, enregistreur `rec.js`).
- Traductions FR/EN/ES : moteur `i18n/i18n.js`; chaînes ajoutées dans `i18n/mkextra.py` → `python3 i18n/mkextra.py`.
- Micro : `micbleed.py` empêche le clic du métronome d'être pris pour une frappe; `unmute.py` gère la session audio iPhone.
- Tests visuels : scripts Playwright `shot_*.py` (serveur local : `python3 -m http.server 8790` dans le dossier de `main`).

## 1.17.0
- `fixes4.py` : tablature (lecture à vue, appliquée, solfège).
- `pianosmp.py` : piano échantillonné ; les sons sont dans `piano/` sur `main` (créés par `piano_enc.py` à partir des échantillons mf_RR1).

## 1.17.4
- Piano échantillonné retiré de la compilation (délai perçu sur les notes) : on garde le piano de synthèse. `pianosmp.py` reste ici pour mémoire, mais `build.sh` ne l'utilise plus. Ne pas le réactiver sans l'accord de l'utilisateur.
- 1.17.5 : `unmute.py` vérifie maintenant 'function qzUnmute' (avant, la simple mention de qzUnmute dans dg.js le faisait sauter). `build.sh` s'arrête si un patch répond « déjà appliqué ».
- 1.18.0 : `tools/rec_extra.js` + `rec_extra.css` (paroles qui défilent, mastering automatique), ajoutés après rec.js par integrate_tools.py.
- 1.18.1 : `betaTag()` (dans rec_extra.js) : étiquette « Bêta » à mettre sur toute nouvelle fonction. Classe CSS `.beta`.
- 1.18.2 : `tools/mst2.js` remplace mstProcess (mastering v2), ajouté après rec_extra.js.
- 1.19.0 : `about/` (module À propos ; about.py lit la version dans sw.js : augmenter sw.js AVANT build.sh). `about/mkpriv.py` régénère privacy.html (racine de main). Traductions dans about/tr.py.
- 1.19.3 : recLevel par phrase (gain constant dans une phrase, correction en racine carrée) ; post-traitement : compression une bande lente, expandeur max -6 dB. Test : tests/twave.py (wobble ≈ 0 dB, nuances gardées).
- App Windows sans installation : branche `telechargement` (un seul fichier MusiDev-Windows.zip, < 100 Mo : locales fr/en/es seulement, sans SwiftShader). Lien : https://github.com/tomtommusic/musicdev/raw/telechargement/MusiDev-Windows.zip — remplacer par un commit orphelin forcé à chaque version. Construction : /tmp/ea (Electron 33.2.1 win32-x64 + app3/main.js).
- 1.20.0 : `badges/` (badges.py après about.py ; compteurs dans localStorage 'atelier-badges' ; liste BADGES dans badges.js ; traductions badges/tr.py).
- Batterie et basse échantillonnées : `smp/` (MP3 tirés de la banque MS Basic de MuseScore, licence MIT, voir
  `smp/LICENSE-MS-Basic.md`; extraction : `take.py` avec `sf.py`/`ex.py`). `smp/smp.py` les insère en base64 après `v129.py`.
- `rel/rel.py` : version complète (plus de Bêta, Vocalises et Accompagnateur visibles dans l'app iOS/Mac).

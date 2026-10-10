# MusicDEV : sources de construction

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
   `quiz/integrate.py`, `method.py`, `tools/integrate_tools.py`, `unmute.py`, `micbleed.py`, `i18n/integrate_i18n.py`.
4. Publier : augmenter `VERSION` dans `sw.js` (actuellement `musicdev-1.12.7`), commit, push sur `main`
   (GitHub Pages se met à jour en ~30 s). Pousser aussi les sources modifiées sur cette branche.

## Repères
- Doigtés d'instruments : `dg/*.json` (flute, clarinet, altosax, brass) → `python3 dg/build_data.py && python3 dg/fixcom.py`
  → `dg/dg_data.js`; dessin : `cat dg/dg_head.js dg/dg_body.js > dg/dg.js`; styles `dg/dg.css`.
  Chartes copiées des tableaux fournis par l'utilisateur (clarinette mi3–sol6, flûte, saxo alto, trombone).
- Outils : `tools/` (métronome, accordeur, enregistreur `rec.js`).
- Traductions FR/EN/ES : moteur `i18n/i18n.js`; chaînes ajoutées dans `i18n/mkextra.py` → `python3 i18n/mkextra.py`.
- Micro : `micbleed.py` empêche le clic du métronome d'être pris pour une frappe; `unmute.py` gère la session audio iPhone.
- Tests visuels : scripts Playwright `shot_*.py` (serveur local : `python3 -m http.server 8790` dans le dossier de `main`).

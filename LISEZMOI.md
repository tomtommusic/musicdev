# Sources de construction de MusicDEV (sauvegarde)

Cette branche contient les scripts et données qui génèrent `index.html` sur la branche `main`.
Construire : `bash build.sh` (variable S = ce dossier) — copie `index-before-quiz.html`, puis applique
quiz/integrate.py, method.py, tools/integrate_tools.py, unmute.py, i18n/integrate_i18n.py.
Doigtés : `dg/*.json` → `dg/build_data.py` → `dg/dg_data.js`; `cat dg/dg_head.js dg/dg_body.js > dg/dg.js`.
Traductions : `i18n/mkextra.py` → `i18n/extra.json`.

#!/bin/bash
# Installe l'APK dans l'émulateur, ouvre quelques modules et prend des captures ; garde le journal de la page.
set -x
mkdir -p shots
P=ca.tomtommusic.musidev
adb install -r MusiDev-test.apk
adb shell pm grant $P android.permission.RECORD_AUDIO || true
adb logcat -c
shot(){ sleep "$2"; adb exec-out screencap -p > "shots/$1.png"; }
go(){ adb shell am start -n $P/.MainActivity --es js "\"$1\"" >/dev/null; }
adb shell am start -n $P/.MainActivity
shot 01-accueil 12
go "document.title+'|'+document.body.innerHTML.length+'|'+location.href"; sleep 3
go "openModule('ba')"; shot 02-accompagnateur 4
go "openModule('dm')"; shot 03-boite-a-rythmes 4
go "openModule('ac')"; shot 04-accordeur 5
go "openModule('vo')"; shot 05-vocalises 4
go "openModule('ap')"; shot 06-a-propos 4
# mode sombre
adb shell cmd uimode night yes; sleep 2
go "openModule('ho')"; shot 07-accueil-sombre 5
adb shell cmd uimode night no
# bouton Retour depuis un module
go "openModule('iv')"; sleep 3; adb shell input keyevent KEYCODE_BACK; shot 08-apres-retour 3
# rotation
adb shell settings put system accelerometer_rotation 0; adb shell settings put system user_rotation 1; shot 09-paysage 4
adb shell settings put system user_rotation 0
adb logcat -d -s MusiDev:* chromium:* > shots/journal.txt
grep -iE "error|uncaught|exception" shots/journal.txt | head -40 > shots/erreurs.txt || true
cat shots/erreurs.txt
exit 0

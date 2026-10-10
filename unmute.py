import sys
p=sys.argv[1];s=open(p).read()
if 'qzUnmute' in s: print('deja');sys.exit()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:60],s.count(a)); s=s.replace(a,b)
rep("""    if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;this.setup(new C());}
    if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx;},""",
"""    if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;this.setup(new C());}
    qzUnmute();if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx;},""")
rep("const P={sess:null};","""const P={sess:null};
/* iPhone/iPad : jouer le son même quand l'appareil est en mode silencieux ou vibration.
   Safari récent : navigator.audioSession ; plus ancien : un petit son muet en boucle fait passer la page en « lecture média ». */
const SILENT_WAV='data:audio/wav;base64,UklGRvQHAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YdAHAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';
let UNMUTE=null;
function qzUnmute(){
  try{if(navigator.audioSession){if(!MIC.on&&!(typeof TS!=='undefined'&&TS.on)&&!(typeof RS!=='undefined'&&(RS.stream||RS.on))&&navigator.audioSession.type!=='playback')navigator.audioSession.type='playback';return;}}catch(e){}
  if(UNMUTE||!/iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)||!('ontouchend' in document))return;
  try{UNMUTE=new Audio();UNMUTE.src=SILENT_WAV;UNMUTE.loop=true;UNMUTE.setAttribute('playsinline','');UNMUTE.setAttribute('x-webkit-airplay','deny');UNMUTE.preload='auto';
    const p=UNMUTE.play();if(p&&p.catch)p.catch(()=>{UNMUTE=null;});}catch(e){UNMUTE=null;}
}
function qzSessionForMic(on){try{if(navigator.audioSession)navigator.audioSession.type=on?'play-and-record':'playback';}catch(e){}}""")
rep("    const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:mode==='onset',noiseSuppression:false,autoGainControl:false}});",
    "    qzSessionForMic(true);const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:mode==='onset',noiseSuppression:false,autoGainControl:false}});")
rep("function micStop(){clearInterval(MIC.timer);","function micStop(){if(MIC.on)qzSessionForMic(false);clearInterval(MIC.timer);")
rep("    const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});\n    TS.stream=stream;",
    "    qzSessionForMic(true);const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});\n    TS.stream=stream;")
rep("function tunerStop(){clearInterval(TS.timer);","function tunerStop(){if(TS.on)qzSessionForMic(false);clearInterval(TS.timer);")
open(p,'w').write(s);print('ok',p)

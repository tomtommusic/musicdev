#!/usr/bin/env python3
"""Piano échantillonné (vrais enregistrements, un échantillon par tierce mineure, dossier piano/).
Le piano de synthèse reste en secours tant que les sons ne sont pas chargés. À lancer après fixes4.py."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,('introuvable',a[:80],s.count(a));s=s.replace(a,b)
rep("""    comp.connect(c.destination);
    const nb=""","""    comp.connect(c.destination);this.loadPiano();
    const nb=""")
rep("""  piano(m,t,d,v,dest){
    /* piano de synthèse""","""  smp:{buf:{},started:false},
  loadPiano(){
    if(this.smp.started||!window.fetch)return;this.smp.started=true;
    /* décodage sans attendre un geste de l'utilisateur : un contexte hors ligne suffit, les sons servent ensuite partout */
    const OC=window.OfflineAudioContext||window.webkitOfflineAudioContext;let c=this.ctx;try{if(!c&&OC)c=new OC(1,1,44100);}catch(e){}if(!c){this.smp.started=false;return;}
    for(let m=21;m<=108;m+=3)fetch('piano/'+m+'.mp3').then(r=>{if(!r.ok)throw new Error(r.status);return r.arrayBuffer();})
      .then(b=>new Promise((res,rej)=>c.decodeAudioData(b,res,rej)))
      .then(buf=>{/* début réel du son (le format mp3 ajoute un court silence au début) */
        const d=buf.getChannelData(0),n=Math.min(d.length,Math.floor(buf.sampleRate*.4));let pk=0;for(let i=0;i<n;i++){const a=Math.abs(d[i]);if(a>pk)pk=a;}
        let on=0;while(on<n&&Math.abs(d[on])<pk*.05)on++;this.smp.buf[m]={b:buf,off:Math.max(0,on/buf.sampleRate-.003)};})
      .catch(()=>{});
  },
  piano(m,t,d,v,dest){
    /* piano échantillonné : l'échantillon le plus proche, transposé d'au plus une note */
    const c=this.ctx,B=this.smp.buf;let best=null,bd=99;
    for(const k in B){const x=Math.abs(k-m);if(x<bd){bd=x;best=+k;}}
    if(best==null||bd>2)return this.pianoSynth(m,t,d,v,dest);
    const s=B[best],rate=2**((m-best)/12+14.5/1200),end=t+Math.max(d,.1),vel=Math.max(.1,Math.min(1,v/.45));
    const src=c.createBufferSource();src.buffer=s.b;src.playbackRate.value=rate;
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=Math.min(16000,1800+9000*vel**1.5);lp.Q.value=.5;
    const g=c.createGain(),pk=v*2.4;g.gain.setValueAtTime(pk,t);g.gain.setValueAtTime(pk,end);g.gain.setTargetAtTime(0,end,m>84?.06:.11);
    let node=g;if(c.createStereoPanner){const pn=c.createStereoPanner();pn.pan.value=Math.max(-.45,Math.min(.45,(m-64)/50));g.connect(pn);node=pn;}
    node.connect(dest||this.out);src.connect(lp);lp.connect(g);
    const st=Math.max(t,c.currentTime);src.start(st,s.off+(st-t)*rate);src.stop(Math.min(end+1,st+(s.b.duration-s.off)/rate));
  },
  pianoSynth(m,t,d,v,dest){
    /* piano de synthèse""")
s=s.replace("</body>","<script>window.addEventListener('load',()=>setTimeout(()=>{try{A.loadPiano()}catch(e){}},400));</script>\n</body>",1) if "</body>" in s else s
open(p,'w',encoding='utf-8').write(s)

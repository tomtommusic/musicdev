/* ========== sons échantillonnés : batterie acoustique et basse ==========
   Enregistrements tirés de la banque « MS Basic » de MuseScore (licence MIT, dérivée de FluidR3 de Frank Wen ;
   voir la page À propos). Décodés une fois au démarrage de l'audio ; tant qu'ils ne sont pas prêts,
   la synthèse d'avant prend le relais. */
const SMP={b:{},c:null,
  /* niveau relatif de chaque échantillon (ils sont tous normalisés à la même crête) */
  rel:{kick:1.4,kickj:1.3,snare:1.1,xs:.47,hh:.2,hhp:.14,hho:.4,ride:.42,bell:.36,crash:.45,ftom:1,mtom:1.1,htom:1,brush:.85},
  /* envoi vers la réverbération (prise sèche) */
  rv:{kick:.03,kickj:.03,snare:.16,xs:.12,hh:.05,hhp:.04,hho:.08,ride:.07,bell:.06,crash:.12,ftom:.18,mtom:.18,htom:.18,brush:.14},
  bass:{eb:[28,34,39,43,48],ab:[28,36,41,46]},
  load(c){if(SMP.c)return;SMP.c=c;
    for(const[k,b64]of Object.entries(SMP_D)){try{
      const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
      const ok=buf=>{SMP.b[k]=SMP.trim(c,buf);},ko=()=>{};
      const p=c.decodeAudioData(u.buffer,ok,ko);if(p&&p.catch)p.catch(ko);}catch(e){}}},
  /* le décodeur MP3 ajoute un petit silence au début : on le retire pour que la frappe tombe pile */
  trim(c,buf){const x=buf.getChannelData(0);let pk=0;for(let i=0;i<x.length;i++)pk=Math.max(pk,Math.abs(x[i]));
    let i0=0;while(i0<x.length&&Math.abs(x[i0])<pk*.02)i0++;i0=Math.max(0,i0-24);if(i0<8)return buf;
    const n=x.length-i0,b=c.createBuffer(1,n,buf.sampleRate);b.getChannelData(0).set(x.subarray(i0));return b;}
};
(function(){
  const setup0=A.setup;A.setup=function(c){setup0.call(this,c);try{SMP.load(c);}catch(e){}};
  /* ---- batterie ---- */
  const synth=drHit,open=new WeakMap();SMP.synth=synth;
  drHit=function(id,t,out,v=1){
    if(id==='sna'){id='snare';v=Math.min(1.35,v*1.3);}
    const buf=SMP.b[id];
    if(!buf){if(id==='bell')id='ride';if(id==='kickj')id='kick';if(id==='brush')id='snare';return synth(id,t,out,v);}
    try{const c=A.init();out=out||A.out||c.destination;
      if(drHit.c!==c)synth('-',t,out,0);   /* prépare la réverbération de pièce partagée */
      let rv=drHit.rv&&drHit.rv.get(out);if(!rv){synth('-',t,out,0);rv=drHit.rv&&drHit.rv.get(out);}
      v=Math.max(.02,Math.min(1.35,v));
      const s=c.createBufferSource(),g=c.createGain();s.buffer=buf;
      /* petites variations naturelles de hauteur d'un coup à l'autre */
      s.playbackRate.value=1+(Math.random()-.5)*(id==='kick'?.01:.02);
      g.gain.value=SMP.rel[id]*Math.pow(v,1.25);
      let node=s;
      /* frappe douce = son plus sombre (caisse claire, cymbales, toms) */
      if(id!=='kick'&&id!=='kickj'&&v<.95){const f=c.createBiquadFilter();f.type='lowpass';f.Q.value=.5;f.frequency.value=Math.min(20000,2200+19000*v*v);s.connect(f);node=f;}
      node.connect(g);g.connect(out);
      const r=SMP.rv[id];if(rv&&r){const sg=c.createGain();sg.gain.value=r;g.connect(sg);sg.connect(rv);}
      /* charleston : fermer la pédale étouffe le charleston ouvert */
      if(id==='hh'||id==='hhp'){const o=open.get(out);if(o&&o.t<t){try{o.g.gain.setTargetAtTime(0,t,.015);}catch(e){}open.delete(out);}}
      if(id==='hho')open.set(out,{g,t});
      s.start(t);
    }catch(e){}};
  /* ---- basse ---- */
  const bass0=A.bass;SMP.bass0=bass0;
  A.bass=function(m,t,d,v,dest,kind){
    const k=kind==='ab'?'ab':'eb',s=m-12,roots=SMP.bass[k];
    let r=roots[0];for(const x of roots)if(Math.abs(x-s)<Math.abs(r-s)||(Math.abs(x-s)===Math.abs(r-s)&&x<r))r=x;
    const buf=SMP.b[k+r];
    if(!buf){if(k==='ab'){const r2=SMP.bass.eb.reduce((a,x)=>Math.abs(x-s)<Math.abs(a-s)?x:a,28);if(SMP.b['eb'+r2])return A.bass(m,t,d,v,dest,'eb');}return bass0.call(this,m,t,d,v,dest);}
    try{const c=this.ctx,end=t+Math.max(d,.1),src=c.createBufferSource(),g=c.createGain(),lp=c.createBiquadFilter();
      src.buffer=buf;src.playbackRate.value=2**((s-r)/12);
      /* un peu de rondeur : les notes douces sont plus sombres */
      lp.type='lowpass';lp.Q.value=.4;lp.frequency.value=k==='ab'?2600+3000*v:1800+4000*v;
      const a=v*(k==='ab'?3.6:4.3);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a,t+.004);
      g.gain.setValueAtTime(a,end);g.gain.setTargetAtTime(0,end,.035);
      src.connect(lp);lp.connect(g);g.connect(dest||this.out);src.start(t);src.stop(end+.3);
    }catch(e){return bass0.call(this,m,t,d,v,dest);}};
})();

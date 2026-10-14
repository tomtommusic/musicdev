
/* ========== Mastering automatique, version 2 ==========
   1. analyse : volume réel (LUFS, norme BS.1770 avec pondération K) et spectre moyen de la prise
   2. nettoyage : passe-haut, atténuation du souffle entre les phrases (expandeur doux)
   3. égalisation adaptative : on compare le spectre de la prise à une courbe cible selon le style
      et on corrige seulement ce qui s'en écarte (comme les services en ligne)
   4. dé-esseur (sons « s » trop piquants)
   5. compression douce et lente (une bande)
   6. ambiance de salle facultative
   7. volume visé en LUFS, limiteur avec anticipation, plafond -1 dB */
const MS2={};
const mstYield=()=>new Promise(r=>setTimeout(r,0));
/* biquad (formules RBJ), appliqué sur place */
function bqC(type,f,sr,Q,dB){const A=Math.pow(10,(dB||0)/40),w=2*Math.PI*f/sr,cs=Math.cos(w),sn=Math.sin(w),al=sn/(2*(Q||.7071));let b0,b1,b2,a0,a1,a2;
  if(type==='lp'){b0=(1-cs)/2;b1=1-cs;b2=b0;a0=1+al;a1=-2*cs;a2=1-al;}
  else if(type==='hp'){b0=(1+cs)/2;b1=-(1+cs);b2=b0;a0=1+al;a1=-2*cs;a2=1-al;}
  else if(type==='pk'){b0=1+al*A;b1=-2*cs;b2=1-al*A;a0=1+al/A;a1=-2*cs;a2=1-al/A;}
  else if(type==='ls'){const s=2*Math.sqrt(A)*al;b0=A*((A+1)-(A-1)*cs+s);b1=2*A*((A-1)-(A+1)*cs);b2=A*((A+1)-(A-1)*cs-s);a0=(A+1)+(A-1)*cs+s;a1=-2*((A-1)+(A+1)*cs);a2=(A+1)+(A-1)*cs-s;}
  else{const s=2*Math.sqrt(A)*al;b0=A*((A+1)+(A-1)*cs+s);b1=-2*A*((A-1)+(A+1)*cs);b2=A*((A+1)+(A-1)*cs-s);a0=(A+1)-(A-1)*cs+s;a1=2*((A-1)-(A+1)*cs);a2=(A+1)-(A-1)*cs-s;}
  return[b0/a0,b1/a0,b2/a0,a1/a0,a2/a0];}
function bq(x,c,out){const[b0,b1,b2,a1,a2]=c,y=out||x;let z1=0,z2=0;for(let i=0;i<x.length;i++){const v=x[i],o=b0*v+z1;z1=b1*v-a1*o+z2;z2=b2*v-a2*o;y[i]=o;}return y;}
/* volume intégré BS.1770 (pondération K, blocs de 400 ms, portes -70 et -10) */
function mstLufs(chs,sr){
  const k1=bqC('hs',1681.97,sr,.7072,4),k2=bqC('hp',38.13,sr,.5003),n=chs[0].length,H=Math.round(sr*.1),nh=Math.floor(n/H),eh=new Float64Array(nh);
  /* énergie pondérée par tranches de 100 ms (filtrage en continu, sans copie du signal) */
  for(const d of chs){let z1=0,z2=0,y1=0,y2=0;const[a0,a1,a2,a3,a4]=k1,[b0,b1,b2,b3,b4]=k2;
    for(let h=0;h<nh;h++){let e=0;for(let i=h*H;i<(h+1)*H;i++){const v=d[i],o=a0*v+z1;z1=a1*v-a3*o+z2;z2=a2*v-a4*o;const q=b0*o+y1;y1=b1*o-b3*q+y2;y2=b2*o-b4*q;e+=q*q;}eh[h]+=e;}}
  const ms=[];for(let h=0;h+4<=nh;h++)ms.push((eh[h]+eh[h+1]+eh[h+2]+eh[h+3])/(4*H));
  const L=m=>-.691+10*Math.log10(m+1e-15);let g=ms.filter(m=>L(m)>-70);if(!g.length)return -70;
  const rel=L(g.reduce((a,b)=>a+b,0)/g.length)-10;g=g.filter(m=>L(m)>rel);return L(g.reduce((a,b)=>a+b,0)/g.length);
}
/* FFT radix 2 (réelle via complexe), pour le spectre moyen */
function mstFft(re,im){const n=re.length;for(let i=1,j=0;i<n;i++){let b=n>>1;for(;j&b;b>>=1)j^=b;j^=b;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]];}}
  for(let len=2;len<=n;len<<=1){const a=-2*Math.PI/len,wr=Math.cos(a),wi=Math.sin(a);for(let i=0;i<n;i+=len){let cr=1,ci=0;for(let j=0;j<len/2;j++){const ur=re[i+j],ui=im[i+j],k=i+j+len/2,vr=re[k]*cr-im[k]*ci,vi=re[k]*ci+im[k]*cr;re[i+j]=ur+vr;im[i+j]=ui+vi;re[k]=ur-vr;im[k]=ui-vi;const t=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=t;}}}}
const MST_BANDS=[63,125,250,500,1000,2000,4000,8000,12500];
function mstSpectrum(x,sr,act){
  const N=4096,win=new Float32Array(N);for(let i=0;i<N;i++)win[i]=.5-.5*Math.cos(2*Math.PI*i/(N-1));
  const P=new Float64Array(N/2);let frames=[];for(let s=0;s+N<=x.length;s+=N)if(act(s,N))frames.push(s);
  if(frames.length>240){const st=frames.length/240;frames=Array.from({length:240},(_,i)=>frames[Math.floor(i*st)]);}
  const re=new Float32Array(N),im=new Float32Array(N);
  for(const s of frames){for(let i=0;i<N;i++){re[i]=x[s+i]*win[i];im[i]=0;}mstFft(re,im);for(let k=0;k<N/2;k++)P[k]+=re[k]*re[k]+im[k]*im[k];}
  /* densité moyenne par bande d'octave, en dB */
  return MST_BANDS.map(fc=>{const lo=fc/Math.SQRT2,hi=Math.min(fc*Math.SQRT2,sr/2*.95);let e=0,m=0;for(let k=Math.ceil(lo*N/sr);k<=Math.floor(hi*N/sr);k++){e+=P[k];m++;}return m&&frames.length?10*Math.log10(e/m/frames.length+1e-20):null;});
}
/* compresseur (détecteur RMS, genou doux) ; renvoie le signal compressé */
function mstComp(x,sr,thrDb,ratio,attMs,relMs,knee,detMs){
  const at=Math.exp(-1/(sr*attMs/1000)),rl=Math.exp(-1/(sr*relMs/1000)),dt=Math.exp(-1/(sr*(detMs||5)/1000));let e=0,g=0;knee=knee||6;
  for(let i=0;i<x.length;i++){e=dt*e+(1-dt)*x[i]*x[i];const lv=10*Math.log10(e+1e-12),o=lv-thrDb;
    let gr=0;if(o>knee/2)gr=o*(1/ratio-1);else if(o>-knee/2){const t=o+knee/2;gr=(1/ratio-1)*t*t/(2*knee);}
    g=gr<g?at*g+(1-at)*gr:rl*g+(1-rl)*gr;x[i]*=Math.pow(10,g/20);}
  return x;
}
const mstRmsDb=(x,act)=>{let e=0,m=0;for(let s=0;s+1024<=x.length;s+=1024){if(act&&!act(s,1024))continue;for(let i=s;i<s+1024;i++)e+=x[i]*x[i];m+=1024;}if(!m&&act)return mstRmsDb(x,null);return 10*Math.log10(e/Math.max(1,m)+1e-12);};
async function mstProcess(blob,style,intensity,opt={}){
  const say=opt.onStep||(()=>{});
  const src=await mstDecode(blob),sr=src.sampleRate,n=src.length;if(!n)throw new Error('vide');
  const k={leger:.6,moyen:1,fort:1.35}[intensity]||1,target={leger:-16,moyen:-14,fort:-11.5}[intensity]||-14;
  /* on travaille en mono (micro de téléphone) ou en stéréo si la prise l'est vraiment */
  let ch=[];for(let c=0;c<Math.min(2,src.numberOfChannels);c++)ch.push(new Float32Array(src.getChannelData(c)));
  if(ch.length===2){let d=0,e=0;for(let i=0;i<n;i+=7){d+=Math.abs(ch[0][i]-ch[1][i]);e+=Math.abs(ch[0][i]);}if(d<e*.02)ch=[ch[0]];}
  const before=mstLufs(ch,sr);MS2.before=before;
  say('Analyse…');await mstYield();
  /* pré-niveau à -20 LUFS */
  {const g=Math.min(40,Math.pow(10,(-20-before)/20));for(const d of ch)for(let i=0;i<n;i++)d[i]*=g;}
  const mono=ch.length===1?ch[0]:(()=>{const m=new Float32Array(n);for(let i=0;i<n;i++)m[i]=(ch[0][i]+ch[1][i])/2;return m;})();
  /* niveau par trames de 10 ms : sert à repérer les passages joués et le bruit de fond */
  const F=Math.round(sr*.01),nf=Math.ceil(n/F),fr=new Float32Array(nf);
  for(let f=0;f<nf;f++){let e=0;const a=f*F,b=Math.min(n,a+F);for(let i=a;i<b;i++)e+=mono[i]*mono[i];fr[f]=10*Math.log10(e/Math.max(1,b-a)+1e-12);}
  const sorted=Array.from(fr).sort((a,b)=>a-b),floor=sorted[Math.floor(nf*.1)],body=sorted[Math.floor(nf*.7)];
  const actThr=Math.min(Math.max(floor+10,body-25),body-1),act=(s,len)=>{const a=Math.floor(s/F),b=Math.min(nf,Math.ceil((s+len)/F));let m=-200;for(let f=a;f<b;f++)if(fr[f]>m)m=fr[f];return m>actThr;};
  /* 1) passe-haut */
  const hp=bqC('hp',style==='brillant'?55:style==='chaud'?32:40,sr,.7071);for(const d of ch){bq(d,hp);bq(d,hp);}
  /* 2) souffle entre les phrases : expandeur doux (seulement si l'écart bruit/jeu est net) */
  say('Nettoyage…');await mstYield();
  /* très doux (max -6 dB) et lent : un expandeur trop actif fait « respirer » le fond, effet sous l'eau */
  if(body-floor>25){
    const thr=floor+(body-floor)*.25,gf=new Float32Array(nf);
    for(let f=0;f<nf;f++){const o=fr[f]-thr;gf[f]=o>=0?0:Math.max(-6*k,o*.5);}
    for(let f=1;f<nf;f++)gf[f]=Math.max(gf[f],gf[f-1]-.25);for(let f=nf-2;f>=0;f--)gf[f]=Math.max(gf[f],gf[f+1]-2); /* ouverture rapide, fermeture lente */
    for(const d of ch)for(let i=0;i<n;i++){const t=i/F-.5,a=Math.max(0,Math.min(nf-1,Math.floor(t))),b=Math.min(nf-1,a+1),u=Math.max(0,Math.min(1,t-a));d[i]*=Math.pow(10,(gf[a]*(1-u)+gf[b]*u)/20);}
  }
  /* 3) égalisation adaptative */
  say('Égalisation…');await mstYield();
  const spec=mstSpectrum(mono,sr,act),slope={chaud:-4.6,equilibre:-3.9,brillant:-3.2}[style]||-3.9;
  const idx=MST_BANDS.map((f,i)=>i).filter(i=>spec[i]!=null&&MST_BANDS[i]>=125&&MST_BANDS[i]<=8000);
  const tgt=i=>slope*Math.log2(MST_BANDS[i]/1000);
  const off=idx.reduce((s,i)=>s+spec[i]-tgt(i),0)/Math.max(1,idx.length);
  let corr=MST_BANDS.map((f,i)=>spec[i]==null?0:(off+tgt(i))-spec[i]);
  corr=corr.map((c,i)=>{const a=corr[i-1]??c,b=corr[i+1]??c;return(a+2*c+b)/4;}); /* lissage */
  const eq=[];MS2.eq=[];
  corr.forEach((c,i)=>{const f=MST_BANDS[i];if(f>sr*.45)return;let g=c*.35*k;
    if(f<=63)g=Math.min(g,1);                 /* jamais beaucoup de graves en plus : ça gronde */
    g=Math.max(-4,Math.min(f>=8000?2.5:3,g));if(Math.abs(g)<.4)return;eq.push(bqC('pk',f,sr,1.1,g));MS2.eq.push([f,+g.toFixed(1)]);});
  for(const c of({chaud:[bqC('ls',160,sr,.7,1.2*k)],equilibre:[],brillant:[bqC('hs',11000,sr,.7,1.5*k)]}[style]||[]))eq.push(c);
  for(const d of ch)for(const c of eq)bq(d,c);
  /* 4) dé-esseur : seulement la bande 5-10 kHz, quand elle domine */
  say('Compression…');await mstYield();
  if(sr>16000){const dsT=Math.pow(10,({chaud:-24,equilibre:-22,brillant:-20}[style]||-22)/20);
    for(const d of ch){const hb=bq(bq(d,bqC('hp',5500,sr,.7071),new Float32Array(n)),bqC('hp',5500,sr,.7071));
      const a=Math.exp(-1/(sr*.002)),r=Math.exp(-1/(sr*.06));let eh=0,ef=0,g=1;
      for(let i=0;i<n;i++){eh=Math.max(Math.abs(hb[i]),eh*r);ef=Math.max(Math.abs(d[i]),ef*r);
        const want=eh>dsT*ef&&eh>.02?Math.max(.6,dsT*ef/eh):1;g=want<g?a*g+(1-a)*want:r*g+(1-r)*want;d[i]-=hb[i]*(1-g);}}}
  /* 5) compression douce, une seule bande, lente : contrôle les écarts sans faire « pomper » le son */
  {const t=mstRmsDb(ch[0],act)+3;for(const d of ch){mstComp(d,sr,t,1.6+.5*k,25,350,10,30);await mstYield();}}
  /* 6) ambiance (salle courte), donne une sortie stéréo */
  if(opt.room){say('Ambiance…');await mstYield();
    const OC=window.OfflineAudioContext||window.webkitOfflineAudioContext,oc=new OC(2,n,sr),b=oc.createBuffer(ch.length,n,sr);ch.forEach((d,i)=>b.copyToChannel?b.copyToChannel(d,i):b.getChannelData(i).set(d));
    const s=oc.createBufferSource();s.buffer=b;const len=Math.floor(sr*.9),ir=oc.createBuffer(2,len,sr);
    for(let c=0;c<2;c++){const d=ir.getChannelData(c);let lp=0;for(let i=0;i<len;i++){const t=i/sr;lp+=((Math.random()*2-1)-lp)*(.55-.3*Math.min(1,t/.6));d[i]=lp*Math.exp(-t/.16)*(t<.012?0:1);}}
    const cv=oc.createConvolver();cv.buffer=ir;const wet=oc.createGain();wet.gain.value=.16*k;const dry=oc.createGain();dry.gain.value=1;
    s.connect(dry);dry.connect(oc.destination);s.connect(cv);cv.connect(wet);wet.connect(oc.destination);s.start(0);
    const r=await oc.startRendering();ch=[r.getChannelData(0),r.getChannelData(1)];}
  /* 7) volume visé + limiteur */
  say('Finition…');await mstYield();
  {const g=Math.pow(10,(target-mstLufs(ch,sr))/20);for(const d of ch)for(let i=0;i<n;i++)d[i]*=g;}
  mstLimit(ch,sr,Math.pow(10,-1.2/20));
  /* le limiteur retire un peu de volume : une 2e passe rapproche du volume visé */
  {const l=mstLufs(ch,sr);if(target-l>.3){const g=Math.pow(10,(target-l)/20);for(const d of ch)for(let i=0;i<n;i++)d[i]*=g;mstLimit(ch,sr,Math.pow(10,-1.2/20));}}
  MS2.after=mstLufs(ch,sr);
  return mstWav(ch,sr);
}
function mstLimit(ch,sr,ceil){
  const n=ch[0].length,LA=Math.max(1,Math.round(sr*.005)),rel=Math.exp(-1/(sr*.08));
  const need=new Float32Array(n);for(let i=0;i<n;i++){let p=0;for(const d of ch){const a=Math.abs(d[i]);if(a>p)p=a;}need[i]=p>ceil?ceil/p:1;}
  const gmin=new Float32Array(n),q=new Int32Array(n+LA+1);let qh=0,qt=0;
  for(let i=0;i<n+LA;i++){if(i<n){while(qt>qh&&need[q[qt-1]]>=need[i])qt--;q[qt++]=i;}const j=i-LA;if(j>=0){while(q[qh]<j-LA)qh++;gmin[j]=need[q[qh]];}}
  let gc=1,acc=LA;const hist=new Float32Array(LA).fill(1);
  for(let i=0;i<n;i++){acc+=gmin[i]-hist[i%LA];hist[i%LA]=gmin[i];const t=acc/LA;gc=t<gc?t:t+(gc-t)*rel;if(gc>1)gc=1;
    for(const d of ch){let v=d[i]*gc;if(v>ceil)v=ceil;else if(v<-ceil)v=-ceil;d[i]=v;}}
}

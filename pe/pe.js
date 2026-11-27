/* ========== MODULE : Pièces pour enfants ==========
   Des chansons connues en grosses notes, avec le nom de chaque note dans sa tête (option), à écouter,
   à jouer avec le métronome et à imprimer (PDF). Pièces à une voix et à 2, 3 ou 4 voix. Données : pe/songs.js. */
const PE_SZ={m:{t:'Normale',s:1.45,pdf:1.8},l:{t:'Grande',s:1.95,pdf:2.5},xl:{t:'Très grande',s:2.5,pdf:3.2}};
const PE_NM={fr:['Do','Ré','Mi','Fa','Sol','La','Si'],es:['Do','Re','Mi','Fa','Sol','La','Si'],en:['C','D','E','F','G','A','B']};
/* couleurs « arc-en-ciel » des cloches et des boomwhackers : do rouge, ré orange, mi jaune, fa vert, sol bleu clair, la bleu, si violet */
const PE_COL=['#E53935','#FB8C00','#FDD835','#43A047','#29B6F6','#3949AB','#8E24AA'],PE_COLTX=['#fff','#1a1a1a','#1a1a1a','#fff','#1a1a1a','#fff','#fff'];
const PE_SND=[['xylo','Xylophone'],['flute','Flûte à bec'],['piano','Piano']];
const PE={id:'hcb',names:'auto',size:'l',color:false,snd:'xylo',hear:'all',tempo:{}};
try{Object.assign(PE,JSON.parse(localStorage.getItem('atelier-pe')||'{}'));}catch(e){}
const peSave=()=>{try{localStorage.setItem('atelier-pe',JSON.stringify({id:PE.id,names:PE.names,size:PE.size,color:PE.color,snd:PE.snd,tempo:PE.tempo}));}catch(e){}};
const peSong=()=>PE_SONGS.find(s=>s.id===PE.id)||PE_SONGS[0];
const peTitle=s=>TL(s.t[0],s.t[1],s.t[2]);
const peNames=()=>{const n=PE.names==='auto'?(typeof I18N!=='undefined'&&I18N.lang==='en'?'en':'fr'):PE.names;return n==='none'?null:n==='en'?PE_NM.en:(typeof I18N!=='undefined'&&I18N.lang==='es'?PE_NM.es:PE_NM.fr);};
const peTempo=s=>PE.tempo[s.id]||s.q;
function peMeter(s){const[a,b]=s.m.split('/').map(Number);return b===8&&a%3===0?{beats:a/3,bu:1.5,label:s.m,bar:a/2}:{beats:a,bu:4/b,label:s.m,bar:a*4/b};}
function peLv(lv){const x=PE_LV.find(l=>l[0]===lv);return x?`${T('Niveau')} ${lv} · ${T(x[1])}`:'';}

/* ---------- partition ABC ---------- */
const peShort=n=>/\d$/.test(n)?n:n.length>5?n.slice(0,4)+'.':n;
/* coupe la musique en lignes de « per » mesures (abcjs coupe alors exactement là) */
function peLines(b,per,pick){const bars=(b.match(/[^|]*(?:\|\]|\|)/g)||[b]).map(x=>x.trim()).filter(Boolean),out=[];
  /* levée : elle reste sur la première ligne, et la dernière mesure (incomplète) finit la ligne d'avant */
  const first=pick?per+1:per;out.push(bars.slice(0,first).join(' '));
  for(let i=first;i<bars.length;i+=per)out.push(bars.slice(i,i+per).join(' '));
  if(pick&&out.length>1&&(out[out.length-1].match(/\|/g)||[]).length===1){const l=out.pop();out[out.length-1]+=' '+l;}
  return out;}
function peAbc(s,per=4){
  const h=`X:1\nM:${s.m}\nL:${s.L||'1/4'}\n`;
  if(!s.v)return h+`K:${s.k}\n${peLines(s.b,per,s.pick).join('\n')}\n`;
  const L=s.v.map(v=>peLines(v.b,per,s.pick)),n=Math.max(...L.map(x=>x.length));let body='';
  for(let j=0;j<n;j++)s.v.forEach((v,i)=>{body+=`V:${i+1}\n${L[i][j]||''}\n`;});
  return h+`%%score [${s.v.map((_,i)=>i+1).join(' ')}]\n`+s.v.map((v,i)=>`V:${i+1} name="${T(v.n)}" snm="${peShort(T(v.n))}"`).join('\n')+`\nK:${s.k}\n`+body;
}
/* dessine la partition, ajoute les grosses têtes de notes (avec le nom) et relève les notes pour l'écoute */
function peDraw(box,s,o){
  box.innerHTML='';
  if(!HAS_ABC()){box.append(el('div',{class:'nolib'},'La partition n\'a pas pu s\'afficher : la bibliothèque de notation ne s\'est pas chargée.'));return null;}
  const sw=Math.max(180,o.width/o.scale-24);
  const res=ABCJS.renderAbc(box,peAbc(s,o.per),{add_classes:true,staffwidth:sw,paddingleft:4,paddingright:4,paddingtop:6,paddingbottom:6,
    foregroundColor:o.print?'#000':'currentColor'});
  const vo=res&&res[0];if(!vo)return null;
  /* agrandissement vectoriel (l'option « scale » d'abcjs passe par une transformation CSS qui fausse la mise en page) */
  const svg0=box.querySelector('svg');box.removeAttribute('style');
  if(svg0){const w0=parseFloat(svg0.getAttribute('width'))||sw,h0=parseFloat(svg0.getAttribute('height'))||100;
    svg0.setAttribute('viewBox',`0 0 ${w0} ${h0}`);svg0.setAttribute('width',(w0*o.scale).toFixed(1));svg0.setAttribute('height',(h0*o.scale).toFixed(1));svg0.removeAttribute('style');}
  const NS='http://www.w3.org/2000/svg',nm=o.names,ink=o.print?'#000':'currentColor',PC=[0,2,4,5,7,9,11];
  const ACC={sharp:1,flat:-1,natural:0,dblsharp:2,dblflat:-2};
  const notes=[],tAt={},pend={},specs=[];
  vo.lines.forEach(line=>(line.staff||[]).forEach((st,si)=>{
    const keyAlt={};((st.key&&st.key.accidentals)||[]).forEach(a=>{keyAlt['cdefgab'.indexOf(String(a.note).toLowerCase())]=ACC[a.acc]||0;});
    (st.voices||[]).forEach((voice,vi)=>{
      const V=si+vi;let meas={};if(tAt[V]==null)tAt[V]=0;pend[V]=pend[V]||{};
      voice.forEach(e=>{
        if(e.el_type==='bar'){meas={};return;}
        if(e.el_type!=='note')return;
        const d=(e.duration||0)*4,t0=tAt[V];tAt[V]+=d;
        if(e.rest||!e.pitches||!e.pitches.length)return;
        const g=e.abselem&&e.abselem.elemset&&e.abselem.elemset[0];
        const ps=e.pitches.map(p=>{const L=((p.pitch%7)+7)%7,oct=4+Math.floor(p.pitch/7);
          if(p.accidental&&ACC[p.accidental]!=null)meas[p.pitch]=ACC[p.accidental];
          const alt=meas[p.pitch]!=null?meas[p.pitch]:(keyAlt[L]||0);
          return{L,alt,midi:12*(oct+1)+PC[L]+alt,tieS:!!p.startTie,tieE:!!p.endTie,pitch:p.pitch};});
        /* écoute : une note liée prolonge la précédente */
        const midis=[];ps.forEach(p=>{if(p.tieE&&pend[V][p.midi]){pend[V][p.midi].d+=d;if(!p.tieS)delete pend[V][p.midi];return;}midis.push(p.midi);});
        if(midis.length){const it={t:t0,d,midi:midis,g,v:V};notes.push(it);ps.forEach(p=>{if(p.tieS)pend[V][p.midi]=it;});}
        else ps.forEach(p=>{if(p.tieS&&pend[V][p.midi]==null)pend[V][p.midi]=notes[notes.length-1];});
        if(!g)return;
        g.dataset.midi=String(ps[0].midi);
        if(!nm&&!o.color)return;
        /* têtes : de la plus grave (en bas) à la plus aiguë */
        const heads=[...g.querySelectorAll('.abcjs-notehead')].map(h=>({h,b:h.getBBox()})).sort((a,b)=>b.b.y-a.b.y);
        const sorted=ps.slice().sort((a,b)=>a.pitch-b.pitch),open=(e.duration||0)>=.5;
        heads.forEach(({h,b},k)=>{const p=sorted[k]||sorted[sorted.length-1];if(!b.width)return;
          specs.push({g,h,b,p,open,txt:nm?nm[p.L]+(p.alt>0?'♯':p.alt<0?'♭':''):''});});
      });
    });
  }));
  /* même largeur de tête partout (sinon les ligatures ne suivent plus les hampes) */
  if(specs.length){
    const bw=Math.max(...specs.map(x=>x.b.width)),bh=Math.max(...specs.map(x=>x.b.height)),ml=Math.max(0,...specs.map(x=>[...x.txt].length));
    const RY=4.45,fs0=RY*1.48,R=ml>1?Math.max(bw*.62,Math.min(bw*1.02,.3*fs0*ml+.9)):bw*.62,moved=[];    /* tête haute d'un interligne (8) : elle touche les lignes comme une vraie note */
    specs.forEach(({g,h,b,p,open,txt})=>{
      const len=[...txt].length,fs=len?Math.min(fs0,(2*R-1.6)/(.6*len)):fs0;
      const cx=b.x+b.width/2,cy=b.y+b.height/2,G=document.createElementNS(NS,'g');G.setAttribute('class','pehd');
      const E=document.createElementNS(NS,'ellipse');E.setAttribute('cx',cx);E.setAttribute('cy',cy);E.setAttribute('rx',R);E.setAttribute('ry',RY);
      let fill,stroke,sw2,tcol;
      if(o.color){const c=PE_COL[p.L];if(open){fill=o.print?'#fff':null;stroke=c;sw2=2;tcol=ink;}else{fill=c;stroke=ink;sw2=.6;tcol=PE_COLTX[p.L];}}
      else if(open){fill=o.print?'#fff':null;stroke=ink;sw2=1.2;tcol=ink;}
      else{fill=ink;stroke=ink;sw2=.4;tcol=o.print?'#fff':null;}
      if(fill)E.setAttribute('fill',fill);else E.setAttribute('class','pepaper');
      E.setAttribute('stroke',stroke);E.setAttribute('stroke-width',sw2);G.append(E);
      if(txt){const X=document.createElementNS(NS,'text');X.setAttribute('x',cx);X.setAttribute('y',cy);X.setAttribute('dy','.36em');X.setAttribute('text-anchor','middle');
        X.setAttribute('font-size',fs.toFixed(2));X.setAttribute('font-weight','700');X.setAttribute('font-family','"Atkinson Hyperlegible","Helvetica Neue",Arial,sans-serif');
        if(tcol)X.setAttribute('fill',tcol);else X.setAttribute('class','pepapertx');X.textContent=txt;G.append(X);}
      h.style.opacity='0';
      /* la hampe, le crochet, le point et l'altération suivent le bord de la grosse tête */
      if(!g.dataset.pemv){g.dataset.pemv='1';const dl=R-b.width/2,st=g.querySelector('.abcjs-stem');let sdx=0;
        if(st){const sb=st.getBBox(),up=sb.y<cy-1;sdx=up?dl:-dl;st.setAttribute('transform',`translate(${sdx},0)`);moved.push({x:sb.x,y0:sb.y,y1:sb.y+sb.height,dx:sdx});}
        [...g.children].forEach(c=>{if(c.tagName!=='path'||c.classList.length)return;const q=c.getBBox();
          if(st&&q.width<9&&(q.y+q.height<cy-3||q.y>cy+3)&&Math.abs((q.x)-(st.getBBox().x))<2.5){c.setAttribute('transform',`translate(${sdx},0)`);return;}
          if(q.x>=b.x+b.width-.5)c.setAttribute('transform',`translate(${dl},0)`);
          else if(q.x+q.width<=b.x+.5)c.setAttribute('transform',`translate(${-dl},0)`);});
        g.querySelectorAll('.abcjs-ledger').forEach(l=>{const q=l.getBBox(),k=(2*R+4)/Math.max(1,q.width),lx=q.x+q.width/2;if(k>1)l.setAttribute('transform',`translate(${lx},0) scale(${k},1) translate(${-lx},0)`);});}
      g.append(G);});
    /* ligatures : décalées comme leurs hampes */
    box.querySelectorAll('.abcjs-beam-elem').forEach(bm=>{const q=bm.getBBox();
      const m=moved.find(s=>s.x>=q.x-1.5&&s.x<=q.x+q.width+1.5&&((s.y0>=q.y-4&&s.y0<=q.y+q.height+4)||(s.y1>=q.y-4&&s.y1<=q.y+q.height+4)));
      if(m)bm.setAttribute('transform',`translate(${m.dx},0)`);});
  }
  return{vo,notes,end:Math.max(0,...Object.values(tAt))};
}

/* ---------- son ---------- */
function peXylo(m,t,d,v,dest){
  const c=A.ctx,f=440*Math.pow(2,(m-69)/12),len=Math.min(1.4,.35+d*.6);
  [[1,1,len],[3.93,.22,len*.25],[9.2,.06,len*.1]].forEach(([k,a,l])=>{if(f*k>15000)return;
    const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f*k;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*a,t+.004);g.gain.exponentialRampToValueAtTime(.0008,t+l);
    o.connect(g);g.connect(dest);o.start(t);o.stop(t+l+.05);});
}
function peNote(m,t,d,dest){
  const sh=PE.snd==='piano'?0:12,v=PE.snd==='xylo'?.5:.42;
  if(PE.snd==='xylo')peXylo(m+sh,t,d,v,dest);else if(PE.snd==='flute'&&A.flute)A.flute(m+sh,t,d*.95,v,dest);else A.piano(m,t,d*.95,v,dest);
}
function pePlay(withClick){
  const M=MOD.pe,s=peSong(),r=M.r;if(!r)return;A.init();if(typeof qzUnmute==='function')qzUnmute();
  const mt=peMeter(s),ci=withClick?mt.bar:0;
  const off=withClick?ci-(s.pick||0):0;
  const items=r.notes.filter(n=>PE.hear==='all'||String(n.v)===PE.hear).map((n,i)=>({u:n.t+off,d:n.d,midi:n.midi[0],chord:n.midi,g:n.g,v:n.v,i}));
  const endU=r.end+off,clicks=[];
  if(withClick){for(let b=0;b<mt.beats;b++)clicks.push({u:b*mt.bu,strong:b===0,b,ci:true});
    for(let u=ci,k=0;u<endU-.01;u+=mt.bu,k++)clicks.push({u,strong:k%mt.beats===0,b:k%mt.beats});}
  const us=60/peTempo(s),plan={items,clicks,us,endU,ci,meter:{beats:mt.beats,label:mt.label}};
  const last={};
  const sess=run(plan,{sound:'none',onStep:it=>{const p=last[it.v];if(p)p.classList.remove('pe-now');if(it.g){it.g.classList.add('pe-now');last[it.v]=it.g;
      /* plein écran : la ligne jouée reste visible */
      const ln=(it.g.getAttribute('class').match(/abcjs-l(\d+)/)||[])[1];if(M.full&&ln!==last.ln){last.ln=ln;try{it.g.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}}}},
    onEnd:()=>{Object.values(last).forEach(g=>g&&g.classList&&g.classList.remove('pe-now'));}});
  if(sess)for(const it of items)for(const m of it.chord)peNote(m,sess.t0+it.u*us,it.d*us,sess.g);
}

/* ---------- PDF ---------- */
/* une partition dessinée hors écran, coupée en images ligne par ligne (les pages se coupent entre deux lignes) */
async function peRows(s,sc){
  const box=document.createElement('div');box.style.cssText=`position:fixed;left:-20000px;top:0;width:${PDF_CW}px;color:#000;background:#fff`;document.body.append(box);
  try{
    const fit=PDF_CW/(sc*(s.v?118:108)),per=fit>=4?4:fit>=2?2:1;
    const r=peDraw(box,s,{width:PDF_CW,scale:sc,per,names:peNames(),color:PE.color,print:true});
    const svg=box.querySelector('svg');if(!r||!svg)throw new Error('partition');
    const sr=svg.getBoundingClientRect(),W=sr.width,H=sr.height;
    const rows=[];for(let i=0;i<80;i++){const els=svg.querySelectorAll('.abcjs-l'+i);if(!els.length)break;let a=1e9,b=-1e9;
      els.forEach(x=>{const q=x.getBoundingClientRect();if(q.height||q.width){a=Math.min(a,q.top-sr.top);b=Math.max(b,q.bottom-sr.top);}});if(b>a)rows.push([a,b]);}
    if(!rows.length)rows.push([0,H]);
    const cuts=rows.map(([a,b],i)=>[i?Math.max(0,(rows[i-1][1]+a)/2):0,i<rows.length-1?(b+rows[i+1][0])/2:H]);
    const cl=svg.cloneNode(true);cl.setAttribute('xmlns','http://www.w3.org/2000/svg');cl.removeAttribute('style');
    cl.setAttribute('width',String(W*PDF_S));cl.setAttribute('height',String(H*PDF_S));
    const img=new Image();await new Promise((ok,ko)=>{img.onload=ok;img.onerror=()=>ko(new Error('image'));img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(cl));});
    return cuts.map(([a,b])=>{const h=b-a,c=document.createElement('canvas');c.width=Math.round(W*PDF_S);c.height=Math.max(1,Math.round(h*PDF_S));
      const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,a*PDF_S,W*PDF_S,h*PDF_S,0,0,c.width,c.height);return blkImg({img:c,w:W,h},{gap:4});});
  }finally{box.remove();}
}
const peSub=s=>[T(s.o),peLv(s.lv),s.v?(s.canon?TL(`Canon à ${s.v.length} voix`,`${s.v.length}-part round`,`Canon a ${s.v.length} voces`):TL(`${s.v.length} voix`,`${s.v.length} parts`,`${s.v.length} voces`)):''].filter(Boolean).join(' · ');
async function pePdf(){
  if(typeof pdfFonts==='function')await pdfFonts();
  const s=peSong(),sc=PE_SZ[PE.size].pdf,head=(t,sub)=>[blkText(t,{size:26,w:'700',fam:PFT,gap:2}),blkText(sub,{size:12,color:'#555',gap:14})];
  let blocks;
  if(!s.v){blocks=[...head(peTitle(s),peSub(s)),...await peRows(s,sc)];if(s.tip)blocks.push(blkText(T(s.tip),{size:12,color:'#333',gap:4}));}
  else{
    /* conducteur (toutes les voix), puis chaque partie séparée en grosses notes, sur sa propre page */
    blocks=[...head(peTitle(s),peSub(s)),...await peRows(s,1.15)];if(s.tip)blocks.push(blkText(T(s.tip),{size:12,color:'#333',gap:4}));
    const parts=s.canon?[{n:TL('Mélodie du canon','Round melody','Melodía del canon'),b:s.v[0].b.replace(/(\|\s*z\d*\s*)+\|\]\s*$/,'|]')}]:s.v.map((v,i)=>({n:`${T(v.n)} (${TL('voix','part','voz')} ${i+1})`,b:v.b}));
    for(const p of parts){blocks.push({pageBreak:true},...head(peTitle(s),p.n),...await peRows({k:s.k,m:s.m,L:s.L,b:p.b},sc));
      if(s.canon)blocks.push(blkText(T('Canon : chaque groupe commence 2 mesures après le précédent et joue la même mélodie.'),{size:12,color:'#333',gap:4}));}
  }
  return await pdfPages(blocks,{footer:'MusiDev · Pièces pour enfants'});
}

/* ---------- interface ---------- */
MOD.pe.mount=function(){
  const M=this;M.full=false;document.documentElement.classList.remove('pe-fs');$('#toolbar').replaceChildren();M.root=el('div',{class:'tl pe'});$('#answer').replaceChildren(M.root);
  if(!M.rz){M.rz=1;let tm;window.addEventListener('resize',()=>{clearTimeout(tm);tm=setTimeout(()=>{if(S.mod==='pe'&&MOD.pe.stand&&MOD.pe.stand.isConnected)MOD.pe.draw();},200);});}
};
/* plein écran : la partition seule, avec les boutons pour l'écouter, le métronome et le tempo */
function peFull(on){
  const M=MOD.pe;M.full=!!on;stop();
  const d=document,fe=d.fullscreenElement||d.webkitFullscreenElement;
  try{if(on&&!fe){const r=d.documentElement,f=r.requestFullscreen||r.webkitRequestFullscreen;if(f){const x=f.call(r);if(x&&x.catch)x.catch(()=>{});}}
    else if(!on&&fe){const f=d.exitFullscreen||d.webkitExitFullscreen;if(f){const x=f.call(d);if(x&&x.catch)x.catch(()=>{});}}}catch(e){}
  document.documentElement.classList.toggle('pe-fs',M.full);M.fresh();window.scrollTo({top:0});
}
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{const fe=document.fullscreenElement||document.webkitFullscreenElement;if(!fe&&MOD.pe&&MOD.pe.full&&S.mod==='pe')peFull(false);}));
MOD.pe.fresh=function(){
  const M=this,s=peSong();if(!PE_SONGS.some(x=>x.id===PE.id))PE.id=PE_SONGS[0].id;
  if(M.full){
    const tv=el('b',{class:'petv'},`♩ = ${peTempo(s)}`),setT=d=>{PE.tempo[s.id]=Math.max(40,Math.min(180,peTempo(s)+d));tv.textContent=`♩ = ${peTempo(s)}`;peSave();};
    M.stand=el('div',{class:'pestaff'});M.out=el('div');
    M.root.className='tl pe pefull';
    M.root.replaceChildren(el('div',{class:'pefbar'},
      el('b',{class:'peft'},peTitle(s)),
      btn('▶ Écouter',()=>pePlay(false),'primary'),btn('● Métronome',()=>pePlay(true)),stopBtn(),
      el('span',{class:'petempo'},btn('−',()=>setT(-4),'quiet sq'),tv,btn('+',()=>setT(4),'quiet sq')),
      btn('✕ Quitter',()=>peFull(false),'quiet')),M.stand);
    S.keyHandler=e=>{if(e.code==='Escape'){peFull(false);return true;}if(e.code==='Space'){if(P.sess)stop();else pePlay(false);return true;}return false;};
    M.draw();return;
  }
  M.root.className='tl pe';S.keyHandler=null;
  if(PE.hear!=='all'&&(!s.v||+PE.hear>=s.v.length))PE.hear='all';
  const redo=()=>{peSave();stop();M.fresh();};
  /* choix de la pièce, groupé par niveau, puis les pièces à plusieurs voix */
  const songSel=el('select',{id:'pe_song','aria-label':'Pièce'});
  PE_LV.forEach(([lv,n])=>{const g=el('optgroup',{label:`${T('Niveau')} ${lv} · ${T(n)}`});PE_SONGS.filter(x=>!x.v&&x.lv===lv).forEach(x=>{const o=el('option',{value:x.id},peTitle(x));if(x.id===s.id)o.selected=true;g.append(o);});songSel.append(g);});
  [2,3,4].forEach(n=>{const L=PE_SONGS.filter(x=>x.v&&x.v.length===n);if(!L.length)return;const g=el('optgroup',{label:TL(`À ${n} voix`,`${n} parts`,`A ${n} voces`)});
    L.slice().sort((a,b)=>a.lv-b.lv).forEach(x=>{const o=el('option',{value:x.id},peTitle(x)+' · '+T('niveau')+' '+x.lv);if(x.id===s.id)o.selected=true;g.append(o);});songSel.append(g);});
  songSel.addEventListener('change',()=>{PE.id=songSel.value;PE.hear='all';redo();});
  const names=sel('pe_names',[['auto',TL('Do, ré, mi… (selon la langue)','C, D, E… (by language)','Do, re, mi… (según el idioma)')],['fr','Do, ré, mi'],['en','C, D, E'],['none','Aucun']],PE.names,v=>{PE.names=v;peSave();M.draw();});
  const size=sel('pe_size',Object.entries(PE_SZ).map(([k,x])=>[k,x.t]),PE.size,v=>{PE.size=v;peSave();M.draw();});
  const snd=sel('pe_snd',PE_SND,PE.snd,v=>{PE.snd=v;peSave();});
  const col=el('input',{type:'checkbox',id:'pe_col'});col.checked=!!PE.color;col.addEventListener('change',()=>{PE.color=col.checked;peSave();M.draw();});
  const tl=el('b',{},`♩ = ${peTempo(s)}`),tr=el('input',{type:'range',min:40,max:180,step:2,value:peTempo(s),'aria-label':'Tempo'});
  tr.addEventListener('input',()=>{PE.tempo[s.id]=+tr.value;tl.textContent=`♩ = ${tr.value}`;peSave();});
  const hear=s.v?sel('pe_hear',[['all','Toutes les voix'],...s.v.map((v,i)=>[String(i),TL('Seulement : ','Only: ','Solo: ')+T(v.n)+(s.canon?'':` (${i+1})`)])],PE.hear,v=>{PE.hear=v;}):null;
  const rnd=()=>{const L=PE_SONGS.filter(x=>x.lv===s.lv&&!!x.v===!!s.v&&x.id!==s.id);if(L.length){PE.id=pick(L).id;PE.hear='all';redo();}};
  M.out=el('div',{class:'peout'});
  const pdfB=btn('📄 PDF / Imprimer',async ev=>{await qzMakePdf(ev.currentTarget,M.out,pePdf,`MusiDev-${peTitle(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'')}.pdf`);});
  M.stand=el('div',{class:'pestaff'});
  const sub=peSub(s);
  M.root.replaceChildren(
    el('div',{class:'qzbtns pebar'},btn('▶ Écouter',()=>pePlay(false),'primary'),btn('● Jouer avec le métronome',()=>pePlay(true)),btn('Une autre pièce du même niveau',rnd),stopBtn(),pdfB,btn('⛶ Plein écran',()=>peFull(true))),
    el('div',{class:'pectl'},
      el('label',{class:'qzfield pewide'},el('span',{class:'fl'},'Pièce'),songSel),
      el('label',{class:'qzfield'},el('span',{class:'fl'},'Noms dans les notes'),names),
      el('label',{class:'qzfield'},el('span',{class:'fl'},'Taille des notes'),size),
      el('label',{class:'qzfield'},el('span',{class:'fl'},'Son'),snd),
      ...(hear?[el('label',{class:'qzfield'},el('span',{class:'fl'},'Entendre'),hear)]:[]),
      el('label',{class:'qzfield'},el('span',{class:'fl'},'Tempo'),el('div',{class:'row2'},tr,tl)),
      el('label',{class:'pechk'},col,el('span',{},'Couleurs des notes (do rouge, ré orange, mi jaune…)'))),
    el('div',{class:'pehead'},el('h2',{},peTitle(s)),el('p',{class:'hint'},sub)),
    M.stand,...(s.tip?[el('p',{class:'petip'},s.tip)]:[]),M.out,
    el('p',{class:'hint pefoot'},'Toutes les pièces tiennent entre le do grave (do4) et le la aigu (la5) : xylophone soprano ou alto, flûte à bec soprano, clarion. Les pièces en sol utilisent le fa♯, celles en fa le si♭. Touche une note pour l\'entendre.'));
  M.draw();
};
MOD.pe.draw=function(){
  const M=this,s=peSong();if(!M.stand)return;stop();
  const w=M.stand.clientWidth||($('#answer').clientWidth-20)||640,sc=PE_SZ[PE.size].s*(w<480?.82:1)*(M.full&&w>700?1.25:1);
  const fit=w/(sc*(s.v?118:108)),per=fit>=3.6?4:fit>=1.6?2:1;
  M.r=peDraw(M.stand,s,{width:w,scale:sc,per,names:peNames(),color:PE.color});
  if(!M.r)return;
  M.stand.querySelectorAll('.abcjs-note').forEach(g=>{const m=+g.dataset.midi;if(!m)return;g.style.cursor='pointer';
    g.addEventListener('click',()=>{A.init();if(typeof qzUnmute==='function')qzUnmute();peNote(m,A.ctx.currentTime+.02,.6,A.out);g.classList.add('pe-now');setTimeout(()=>g.classList.remove('pe-now'),350);});});
};
MOD.pe.redraw=function(){this.draw();};
METHOD.pe='<p><b>Avant de jouer.</b> Écoute la pièce une fois en suivant les notes avec le doigt. Repère la plus grave et la plus aiguë, et prépare les lames (fa♯ ou si♭) au xylophone.</p><p><b>Lentement d\'abord.</b> Baisse le tempo, joue avec le métronome, puis accélère quand tout est juste.</p><p><b>À plusieurs.</b> Chaque groupe choisit sa voix dans « Entendre » pour l\'apprendre seul, puis on joue tous ensemble. Pour un canon, chaque groupe entre 2 mesures après le précédent.</p><p><b>Sur papier.</b> « PDF / Imprimer » crée la partition en grosses notes, avec les mêmes réglages (noms, taille, couleurs).</p>';

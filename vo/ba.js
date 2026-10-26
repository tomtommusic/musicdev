/* ========== MODULE : Accompagnateur ==========
   Une grille d'accords (lead sheet) jouée par un petit groupe : batterie, basse et piano, dans le style choisi.
   Le tempo, la tonalité et l'intensité se changent pendant que ça joue ; la grille tourne en boucle. */
const BA_STYLES={
  /* n : nom ; m : temps par mesure ; sub : pas par temps (4 = doubles croches, 3 = triolets / swing) ;
     dr : batterie {élément:[pas]} ; bs : basse [[pas, degré, durée en pas]] (degré : 'R' fondamentale, '5', '8', '3', 'A' approche, 'W' marche) ;
     cp : piano [[pas, durée en pas, vélocité]] ; ar : arpège (piano en notes séparées) */
  pop:{n:'Pop',m:4,sub:4,dr:{kick:[0,8,10],snare:[4,12],hh:[0,2,4,6,8,10,12,14]},bs:[[0,'R',3],[6,'R',2],[8,'R',3],[14,'5',2]],cp:[[0,4,.5],[6,2,.4],[8,4,.45],[14,2,.4]]},
  rock:{n:'Rock',m:4,sub:4,dr:{kick:[0,8,10],snare:[4,12],hh:[0,2,4,6,8,10,12,14]},bs:[[0,'R',2],[2,'R',2],[4,'R',2],[6,'R',2],[8,'R',2],[10,'R',2],[12,'R',2],[14,'5',2]],cp:[[0,6,.55],[8,6,.5]],pw:true},
  ballad:{n:'Ballade',m:4,sub:4,dr:{kick:[0,10],xs:[8],hh:[0,4,8,12]},bs:[[0,'R',8],[8,'5',6],[14,'8',2]],ar:[[0,'R'],[2,'5'],[4,'8'],[6,'3'],[8,'8'],[10,'5'],[12,'3'],[14,'5']]},
  funk:{n:'Funk',m:4,sub:4,dr:{kick:[0,3,10],snare:[4,12],ghost:[7,9,15],hh:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},bs:[[0,'R',2],[3,'8',1],[6,'R',1],[8,'R',2],[10,'5',1],[11,'8',1],[14,'A',2]],cp:[[2,1,.45],[6,1,.4],[11,1,.45],[14,1,.4]]},
  swing:{n:'Swing',m:4,sub:3,dr:{ride:[0,3,5,6,9,11],hhp:[3,9],kick:[0,3,6,9],kickv:.25},bs:[[0,'W',3],[3,'W',3],[6,'W',3],[9,'W',3]],cp:[[0,2,.4],[5,2,.42]],shell:true},
  shuffle:{n:'Blues shuffle',m:4,sub:3,dr:{hh:[0,2,3,5,6,8,9,11],kick:[0,6],snare:[3,9]},bs:[[0,'R',2],[2,'R',1],[3,'3',2],[5,'3',1],[6,'5',2],[8,'5',1],[9,'6',2],[11,'6',1]],cp:[[3,1,.4],[9,1,.4]],blues:true},
  bossa:{n:'Bossa-nova',m:4,sub:4,bars:2,dr:{kick:[0,6,8,14],xs:[[0,6,12],[4,10]],hh:[0,2,4,6,8,10,12,14]},bs:[[0,'R',5],[6,'5',2],[8,'5',5],[14,'R',2]],cp:[[0,2,.38],[4,2,.36],[6,3,.38],[10,2,.36],[12,2,.36]]},
  reggae:{n:'Reggae',m:4,sub:4,dr:{kick:[8],xs:[8],hh:[0,2,4,6,8,10,12,14]},bs:[[0,'R',3],[4,'5',2],[8,'R',3],[11,'3',2],[14,'5',2]],cp:[[4,1,.45],[12,1,.45]]},
  country:{n:'Country',m:4,sub:4,dr:{kick:[0,8],snare:[4,12],hh:[0,2,4,6,8,10,12,14]},bs:[[0,'R',4],[8,'5',4]],cp:[[4,2,.45],[12,2,.45]]},
  waltz:{n:'Valse',m:3,sub:4,dr:{kick:[0],hh:[4,8],snare:[4,8],snarev:.35},bs:[[0,'R',4]],cp:[[4,3,.4],[8,3,.4]]},
  latin:{n:'Latin (6/8 en 3/4)',m:3,sub:4,dr:{kick:[0,6],xs:[4,10],hh:[0,2,4,6,8,10]},bs:[[0,'R',3],[6,'5',3],[10,'8',2]],cp:[[0,2,.4],[4,2,.38],[8,2,.38]]}};
const BA_PRESETS=[
  ['Pop : I – V – vi – IV','C | G | Am | F','pop'],
  ['Doo-wop : I – vi – IV – V','C | Am | F | G','ballad'],
  ['Blues en 12 mesures','A7 | D7 | A7 | A7 | D7 | D7 | A7 | A7 | E7 | D7 | A7 | E7','shuffle'],
  ['Jazz : ii – V – I','Dm7 | G7 | Cmaj7 | Cmaj7','swing'],
  ['Jazz : anatole (I – vi – ii – V)','Cmaj7 Am7 | Dm7 G7 | Cmaj7 Am7 | Dm7 G7','swing'],
  ['Mineur : i – VI – III – VII','Am | F | C | G','rock'],
  ['Funk sur un accord','E7 | E7 | E7 | E7','funk'],
  ['Bossa : ii – V – I','Dm7 | G7 | Cmaj7 | Cmaj7','bossa'],
  ['Valse : I – IV – V – I','C | F | G7 | C','waltz'],
  ['Reggae : I – IV','G | C | G | C','reggae'],
  ['Country : I – IV – V','G | G | C | C | D | D | G | G','country'],
  ['Cadence andalouse','Am | G | F | E7','latin']];
const BA_S=tlLoad('atelier-ba',{grid:'C | G | Am | F',style:'pop',tempo:96,tr:0,dr:true,bs:true,pn:true,int:2,loop:true,ci:true});
const BA={sess:null};
const BA_LET={C:0,D:2,E:4,F:5,G:7,A:9,B:11},BA_FR=[['Do',0],['Ré',2],['Re',2],['Mi',4],['Fa',5],['Sol',7],['La',9],['Si',11]];
const BA_Q=[['maj9',[0,4,7,11,14]],['maj7',[0,4,7,11]],['M7',[0,4,7,11]],['Δ7',[0,4,7,11]],['Δ',[0,4,7,11]],['m7b5',[0,3,6,10]],['m7♭5',[0,3,6,10]],['ø7',[0,3,6,10]],['ø',[0,3,6,10]],
  ['dim7',[0,3,6,9]],['°7',[0,3,6,9]],['dim',[0,3,6]],['°',[0,3,6]],['7sus4',[0,5,7,10]],['sus4',[0,5,7]],['sus2',[0,2,7]],['sus',[0,5,7]],['add9',[0,4,7,14]],
  ['m9',[0,3,7,10,14]],['m7',[0,3,7,10]],['-7',[0,3,7,10]],['min7',[0,3,7,10]],['m6',[0,3,7,9]],['min',[0,3,7]],['m',[0,3,7]],['-',[0,3,7]],
  ['aug',[0,4,8]],['+',[0,4,8]],['13',[0,4,7,10,14,21]],['9',[0,4,7,10,14]],['7',[0,4,7,10]],['6',[0,4,7,9]],['5',[0,7]],['',[0,4,7]]];
const BA_NAMES_SH=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
/* lit un accord : « C », « F♯m7 », « B♭maj7 », « G7/B », « Rém », « Sol7 » */
function baParse(tok){
  let s=tok.trim();if(!s||s==='%'||s==='/')return null;let root=null,i=0;
  for(const[fr,pc]of BA_FR)if(s.startsWith(fr)){root=pc;i=fr.length;break;}
  if(root==null){const L=s[0].toUpperCase();if(!(L in BA_LET))return{bad:tok};root=BA_LET[L];i=1;}
  if(s[i]==='#'||s[i]==='♯'){root++;i++;}else if(s[i]==='b'||s[i]==='♭'){root--;i++;}
  let rest=s.slice(i),bass=null;const sl=rest.indexOf('/');
  if(sl>=0){const b=baParse(rest.slice(sl+1));rest=rest.slice(0,sl);if(b&&!b.bad)bass=b.root;}
  const q=BA_Q.find(([k])=>rest===k)||BA_Q.find(([k])=>k&&rest.startsWith(k));if(!q)return{bad:tok};
  return{root:((root%12)+12)%12,iv:q[1],q:q[0],bass,tok};
}
/* grille : mesures séparées par « | », 1 à 4 accords par mesure (espaces) ; « % » répète la mesure précédente */
function baGrid(txt){
  const bars=[],bad=[];let prev=null;
  for(const raw of txt.replace(/\n/g,'|').split('|')){const b=raw.trim();if(!b)continue;
    if(b==='%'&&prev){bars.push(prev);continue;}
    const ch=b.split(/\s+/).map(baParse).filter(x=>x);ch.filter(x=>x.bad).forEach(x=>bad.push(x.bad));
    const ok=ch.filter(x=>!x.bad);if(ok.length){bars.push(ok);prev=ok;}}
  return{bars,bad};
}
const baName=c=>BA_NAMES_SH[(c.root+BA_S.tr+120)%12]+(c.q==='m'||c.q==='-'||c.q==='min'?'m':c.q==='M7'||c.q==='Δ'||c.q==='Δ7'?'maj7':c.q)+(c.bass!=null?'/'+BA_NAMES_SH[(c.bass+BA_S.tr+120)%12]:'');
/* voicing du piano : chaque note de l'accord placée près de do4, sans la doubler */
function baVoice(c,prev){
  const pcs=c.iv.slice(0,4).map(x=>(c.root+BA_S.tr+x)%12);const out=[];
  for(const pc of pcs){let best=null;for(let m=52;m<=72;m++)if((m-pc)%12===0&&(best==null||Math.abs(m-62)<Math.abs(best-62)))best=m;out.push(best);}
  return[...new Set(out)].sort((a,b)=>a-b);
}
function baBassNote(c,deg,next){
  const r=((c.root+BA_S.tr)%12+12)%12;let base=r<5?r+40:r+28;   /* fondamentale entre mi1 (28) et ré♯2 */
  if(c.bass!=null&&deg==='R'){const b=((c.bass+BA_S.tr)%12+12)%12;base=b<5?b+40:b+28;}
  const third=c.iv.includes(3)?3:4,fifth=c.iv.includes(6)?6:c.iv.includes(8)?8:7;
  switch(deg){case'5':return base+fifth;case'8':return base+12;case'3':return base+third;case'6':return base+(c.iv.includes(10)&&c.iv.length>3&&c.iv[3]===10?10:9);
    case'A':{if(!next)return base+fifth;const n=((next.root+BA_S.tr)%12+12)%12,nb=n<5?n+40:n+28;return nb+(nb>base?-1:1);}
    default:return base;}
}
function baStop(){const s=BA.sess;if(!s)return;BA.sess=null;clearInterval(s.timer);s.timers.forEach(clearTimeout);
  try{s.g.gain.setTargetAtTime(0,A.ctx.currentTime,.05);setTimeout(()=>s.g.disconnect(),400);}catch(e){}
  MOD.ba.now(-1);MOD.ba.ui&&MOD.ba.ui();}
function baPlay(){
  baStop();const{bars}=baGrid(BA_S.grid);if(!bars.length){feedback('Écris au moins un accord dans la grille.','bad');return;}
  const c=A.init();if(typeof qzUnmute==='function')qzUnmute();if(typeof stop==='function')stop();
  const g=c.createGain();g.gain.value=1;g.connect(A.out);
  const s={g,timers:[],timer:0,bar:BA_S.ci?-1:0,step:0,next:c.currentTime+.12,pass:0,prevV:null,ending:false};BA.sess=s;
  const lag=typeof audioLag==='function'?audioLag():0;
  const tick=()=>{if(BA.sess!==s)return;if(S.mod!=='ba'){baStop();return;}const now=c.currentTime;
    while(s.next<now+.2){
      const st=BA_STYLES[BA_S.style]||BA_STYLES.pop,spb=st.m*st.sub,sd=60/BA_S.tempo/st.sub,t=s.next,I=BA_S.int;
      if(s.bar<0){ /* décompte : un clic par temps */
        if(s.step%st.sub===0){A.click(t,s.step===0,g);const b=s.step/st.sub;s.timers.push(setTimeout(()=>{if(BA.sess===s)MOD.ba.count(b+1);},Math.max(0,(t+lag-now)*1000)));}
      }else{
        const bars2=baGrid(BA_S.grid).bars;if(!bars2.length){baStop();return;}
        const bi=s.bar%bars2.length,bar=bars2[bi],n=bar.length,per=Math.max(1,Math.round(spb/n)),ci=Math.min(n-1,Math.floor(s.step/per)),ch=bar[ci];
        const nextCh=ci+1<n?bar[ci+1]:bars2[(bi+1)%bars2.length][0],chStart=s.step%per===0;
        if(s.step===0){const b=bi;s.timers.push(setTimeout(()=>{if(BA.sess===s)MOD.ba.now(b);},Math.max(0,(t+lag-now)*1000)));}
        const fill=BA_S.dr&&I>=2&&(bi===bars2.length-1||s.bar%4===3)&&s.step>=spb-st.sub;   /* petit roulement sur le dernier temps */
        const vel=[0,.55,.8,1][I];
        /* batterie */
        if(BA_S.dr){const D=st.dr;
          if(s.step===0&&(s.bar===0||(s.bar%4===0&&I>=2))&&!s.ending)drHit('crash',t,g,.6*vel);
          if(fill){const k=s.step-(spb-st.sub);drHit(k<st.sub/2?'snare':(k%2?'mtom':'ftom'),t,g,.75*vel);}
          else for(const[id,pos]of Object.entries(D)){if(id==='kickv'||id==='snarev')continue;
            const P=Array.isArray(pos[0])?pos[s.bar%pos.length]:pos;if(!P.includes(s.step))continue;
            let v=id==='ghost'?.22:id==='kick'?(D.kickv||.9):id==='snare'?(D.snarev||.85):id==='hh'?(s.step%st.sub===0?.55:.38):id==='ride'?.5:.7;
            let hid=id==='ghost'?'snare':id;if(I===3&&id==='hh'&&s.step%(st.sub*2)===st.sub)hid='hho';if(I===1&&id==='hh')v*=.7;
            if(I===1&&id==='kick'&&s.step%st.sub!==0)continue;
            drHit(hid,t,g,v*vel);}}
        /* basse */
        if(BA_S.bs)for(const[pos,deg,len]of st.bs){if(pos!==s.step)continue;
          let m;if(deg==='W'){ /* basse qui marche : fondamentale, 3ce ou 5te, 5te ou 6te, approche chromatique */
            const beat=Math.round(pos/st.sub);m=beat===0?baBassNote(ch,'R'):beat===1?baBassNote(ch,ch.iv.includes(3)?'3':'5'):beat===2?baBassNote(ch,'5'):baBassNote(ch,'A',nextCh);}
          else m=baBassNote(ch,deg,nextCh);
          A.bass(m,t,len*sd*.92,.75*vel+.1,g);}
        /* piano */
        if(BA_S.pn){
          if(st.ar){for(const[pos,deg]of st.ar){if(pos!==s.step)continue;const v=baVoice(ch);const r=v[0];
            const m=deg==='R'?baBassNote(ch,'R')+24:deg==='5'?r+(ch.iv.includes(6)?6:7):deg==='3'?r+(ch.iv.includes(3)?3:4)+12:baBassNote(ch,'R')+36;
            A.piano(Math.min(84,m),t,sd*4,.32*vel+.08,g);}}
          else for(const[pos,len,v]of st.cp){if(pos!==s.step)continue;
            let notes=baVoice(ch);if(st.shell){const r=((ch.root+BA_S.tr)%12+12)%12;const th=ch.iv.includes(3)?3:4,sv=ch.iv.includes(11)?11:ch.iv.includes(10)?10:ch.iv.includes(9)?9:7;notes=[52+((r+th)%12),52+((r+sv)%12)].map(x=>x<55?x+12:x).sort((a,b)=>a-b);}
            if(st.pw){const r=((ch.root+BA_S.tr)%12+12)%12;const b=48+r>=55?36+r:48+r;notes=[b,b+7,b+12];}
            notes.forEach(m=>A.piano(m,t,len*sd*.9,v*vel+.05,g));}
        }
      }
      s.next+=sd;s.step++;
      const st2=BA_STYLES[BA_S.style]||BA_STYLES.pop;
      if(s.step>=(s.bar<0?st2.m*st2.sub:st2.m*st2.sub)){s.step=0;s.bar++;
        const L=baGrid(BA_S.grid).bars.length;
        if(s.bar>0&&s.bar%L===0&&!BA_S.loop){ /* fin : accord final tenu */
          const bars2=baGrid(BA_S.grid).bars,last=bars2[0][0],t2=s.next;
          if(BA_S.pn)baVoice(last).forEach(m=>A.piano(m,t2,2.5,.5,g));if(BA_S.bs)A.bass(baBassNote(last,'R'),t2,2.5,.8,g);if(BA_S.dr){drHit('crash',t2,g,.7);drHit('kick',t2,g,.9);}
          s.timers.push(setTimeout(()=>{if(BA.sess===s)baStop();},Math.max(0,(t2+2.6-now)*1000)));s.next=1e12;break;}}
    }};
  tick();s.timer=setInterval(tick,25);MOD.ba.ui&&MOD.ba.ui();
}
MOD.ba.mount=function(){const M=this;M.root=el('div',{class:'tl baw'});$('#answer').replaceChildren(M.root);};
MOD.ba.fresh=function(){
  const M=this,save=()=>tlSave('atelier-ba',BA_S);
  const styleSel=sel('ba_style',Object.entries(BA_STYLES).map(([k,v])=>[k,T(v.n)]),BA_S.style,v=>{BA_S.style=v;save();M.paint();});
  const preSel=sel('ba_pre',[['',T('Choisir une grille…')],...BA_PRESETS.map((p,i)=>[i,T(p[0])])],'',v=>{if(v==='')return;const p=BA_PRESETS[+v];BA_S.grid=p[1];BA_S.style=p[2];styleSel.value=p[2];area.value=p[1];save();M.paint();preSel.value='';});
  const area=el('textarea',{id:'ba_grid',class:'qzin bagrid',rows:'3',spellcheck:'false',autocapitalize:'off',autocomplete:'off','aria-label':'Grille d\'accords'});area.value=BA_S.grid;
  area.addEventListener('input',()=>{BA_S.grid=area.value;save();M.paint();});
  const tl=el('b',{class:'batv'}),tr=el('input',{type:'range',min:40,max:240,step:1,'aria-label':'Tempo'});
  const setT=v=>{BA_S.tempo=Math.max(40,Math.min(240,Math.round(v)));tl.textContent=`♩ = ${BA_S.tempo}`;tr.value=BA_S.tempo;save();};
  tr.addEventListener('input',()=>setT(+tr.value));
  const taps=[];const tap=()=>{const n=performance.now();if(taps.length&&n-taps[taps.length-1]>2000)taps.length=0;taps.push(n);if(taps.length>6)taps.shift();if(taps.length>=2)setT(60000/((taps[taps.length-1]-taps[0])/(taps.length-1)));};
  const trLab=el('b',{class:'batr'});const setTr=d=>{BA_S.tr=((BA_S.tr+d+17)%12)-5;save();M.paint();};
  const tog=(k,lab)=>{const i=el('input',{type:'checkbox'});i.checked=!!BA_S[k];i.addEventListener('change',()=>{BA_S[k]=i.checked;save();});return el('label',{class:'chk'},i,lab);};
  const intSel=sel('ba_int',[[1,T('Doux')],[2,T('Normal')],[3,T('Intense')]],BA_S.int,v=>{BA_S.int=+v;save();});
  M.play=btn('▶ Jouer',()=>BA.sess?baStop():baPlay(),'primary');
  M.cnt=el('span',{class:'bacount','aria-live':'polite'});
  M.cells=el('div',{class:'bacells'});M.err=el('p',{class:'hint baerr',hidden:true});
  M.ui=()=>{M.play.textContent=BA.sess?T('■ Arrêter'):T('▶ Jouer');M.play.classList.toggle('on',!!BA.sess);};
  M.paint=()=>{const{bars,bad}=baGrid(BA_S.grid),st=BA_STYLES[BA_S.style]||BA_STYLES.pop;
    M.cells.style.setProperty('--per',st.m===3?3:4);
    M.cells.replaceChildren(...bars.map((b,i)=>el('div',{class:'bacell','data-i':i},el('small',{},String(i+1)),el('span',{},b.map(baName).join('  ')))));
    M.err.hidden=!bad.length;M.err.textContent=bad.length?T('Accords non reconnus : {0}').replace('{0}',bad.join(', ')):'';
    trLab.textContent=BA_S.tr?(BA_S.tr>0?'+':'')+BA_S.tr+' ½':'0';};
  M.root.replaceChildren(
    el('div',{class:'bahead'},el('h2',{},'Accompagnateur',typeof betaTag==='function'?betaTag():null),el('p',{class:'hint'},'Écris une grille d\'accords, choisis un style : batterie, basse et piano t\'accompagnent en boucle.')),
    el('div',{class:'bapanel'},
      el('div',{class:'babar'},M.play,M.cnt,el('button',{type:'button',class:'btn quiet sq','aria-label':'Plus lent',onclick:()=>setT(BA_S.tempo-4)},'−'),tl,el('button',{type:'button',class:'btn quiet sq','aria-label':'Plus rapide',onclick:()=>setT(BA_S.tempo+4)},'+'),btn('Tap',tap,'quiet')),
      tr,M.cells,M.err),
    el('section',{class:'mtsec'},el('h3',{},'Grille d\'accords'),
      el('label',{class:'qzfield'},el('span',{class:'fl'},'Grilles toutes prêtes'),preSel),
      area,
      el('p',{class:'hint'},'Sépare les mesures par « | » et les accords d\'une même mesure par une espace. Exemples : C, Am, F♯m7, B♭maj7, G7/B, Dsus4, Edim, ou en français : Do, Rém, Sol7. « % » répète la mesure précédente.')),
    el('section',{class:'mtsec'},el('h3',{},'Le groupe'),
      el('div',{class:'mtline'},el('label',{class:'qzfield'},el('span',{class:'fl'},'Style'),styleSel),el('label',{class:'qzfield'},el('span',{class:'fl'},'Intensité'),intSel),
        el('div',{class:'qzfield'},el('span',{class:'fl'},'Transposer'),el('div',{class:'row2'},el('button',{type:'button',class:'btn quiet sq','aria-label':'Un demi-ton plus bas',onclick:()=>setTr(-1)},'♭'),trLab,el('button',{type:'button',class:'btn quiet sq','aria-label':'Un demi-ton plus haut',onclick:()=>setTr(1)},'♯')))),
      el('div',{class:'mtline bachk'},tog('dr','Batterie'),tog('bs','Basse'),tog('pn','Piano'),tog('loop','En boucle'),tog('ci','Décompte d\'une mesure')),
      el('p',{class:'hint'},'Tout se change pendant que ça joue : tempo, style, grille, transposition et instruments. Coupe un instrument pour jouer sa partie toi-même.')));
  setT(BA_S.tempo);M.paint();M.ui();
  S.keyHandler=e=>{if(e.code==='Space'&&document.activeElement!==area){e.preventDefault();BA.sess?baStop():baPlay();return true;}};
};
MOD.ba.now=function(i){const M=this;if(!M.cells)return;M.cnt.textContent='';M.cells.querySelectorAll('.bacell').forEach(c=>c.classList.toggle('is-now',+c.dataset.i===i));};
MOD.ba.count=function(b){if(this.cnt)this.cnt.textContent=String(b);};

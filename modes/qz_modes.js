
/* ---------- Modes et improvisation (questions) ---------- */
const QM_N=['ionien','dorien','phrygien','lydien','mixolydien','éolien','locrien'];
const QM_F=['1 2 3 4 5 6 7','1 2 ♭3 4 5 6 ♭7','1 ♭2 ♭3 4 5 ♭6 ♭7','1 2 3 ♯4 5 6 7','1 2 3 4 5 6 ♭7','1 2 ♭3 4 5 ♭6 ♭7','1 ♭2 ♭3 4 ♭5 ♭6 ♭7'];
const QM_C=['—','6 (majeure)','♭2','♯4','♭7','♭6','♭5'];
const QM_CAP=s=>s[0].toUpperCase()+s.slice(1);
const qmModeNotes=(k,i)=>{const s=scaleOf(k);return Array.from({length:7},(_,d)=>s[(i+d)%7]);};   /* mode n° i de la gamme majeure k */
const qmTonics=lv=>{const out=[];for(const k of qkPool(lv))for(let i=1;i<7;i++){const t=scaleOf(k)[i];if(Math.abs(t.alt)<=1)out.push({k,i,t});}return out;};
QZG.m_for=(lv,fmts)=>{
  const fmt=qzFmt(['mc'],fmts);if(!fmt)return null;
  const v=pick(lv===1?['f2n','char']:['f2n','char','n2f','bright']),q={sub:'m_for',topic:'modes'};
  const pool=lv===1?[0,1,3,4,5]:[0,1,2,3,4,5,6];const i=pick(pool);
  if(v==='f2n'){Object.assign(q,{key:'m_for:f'+i,prompt:`Quel mode a cette formule : ${QM_F[i]} ?`});
    return mcQ(q,QM_CAP(QM_N[i]),pool.filter(x=>x!==i).map(x=>QM_CAP(QM_N[x])));}
  if(v==='n2f'){Object.assign(q,{key:'m_for:n'+i,prompt:`Quelle est la formule du mode ${QM_N[i]} ?`});
    return mcQ(q,QM_F[i],pool.filter(x=>x!==i).map(x=>QM_F[x]));}
  if(v==='char'){const j=pick(pool.filter(x=>x!==0));Object.assign(q,{key:'m_for:c'+j,prompt:`Quelle est la note caractéristique du mode ${QM_N[j]} (comparé à la gamme majeure ou mineure de même tonique) ?`});
    return mcQ(q,QM_C[j],[1,2,3,4,6].filter(x=>x!==j).map(x=>QM_C[x]));}
  const BR=[3,0,4,1,5,2,6],a=qzShuffle(BR).slice(0,3),best=a.slice().sort((x,y)=>BR.indexOf(x)-BR.indexOf(y))[0];
  Object.assign(q,{key:'m_for:b'+a.join(''),prompt:`Parmi ces modes, lequel est le plus lumineux (le plus « majeur ») ?`});
  return mcQ(q,QM_CAP(QM_N[best]),a.filter(x=>x!==best).map(x=>QM_CAP(QM_N[x])),3);
};
QZG.m_not=(lv,fmts)=>{
  const v=pick(lv===1?['parent','alt']:lv===2?['parent','alt','alt']:['parent','alt','write']);
  const fmt=v==='write'?qzFmt(['staff'],fmts):qzFmt(['mc','short'],fmts);if(!fmt)return null;
  const q={sub:'m_not',topic:'modes'};
  if(v==='parent'){const {k,i,t}=pick(qmTonics(lv));
    Object.assign(q,{key:`m_not:p${k.sig}.${i}`,prompt:`${QM_CAP(nn(t))} ${QM_N[i]} a les mêmes notes que quelle gamme majeure ?`});
    const ans=keyFr(k);if(fmt==='short')return shortQ(q,ans,[ans,nn(k),nn(k)+' majeur',...noteAcc(k)],{ph:'ex. : sol majeur'});
    return mcQ(q,ans,QK.filter(x=>x!==k&&Math.abs(x.sig-k.sig)<=3).map(x=>keyFr(x)));}
  if(v==='alt'){ /* lydien : 4te haussée ; mixolydien : 7e abaissée (par rapport au majeur) ; dorien : 6te haussée (par rapport au mineur naturel) */
    const kind=pick(['lyd','mix','dor']),i=kind==='lyd'?3:kind==='mix'?4:1;
    const c=qmTonics(lv).filter(x=>x.i===i&&Math.abs(x.k.sig)<=sigMax(lv));if(!c.length)return null;const {k,t}=pick(c);
    const notes=qmModeNotes(k,i),deg=kind==='lyd'?3:kind==='mix'?6:5,n=notes[deg];
    Object.assign(q,{key:`m_not:a${kind}${k.sig}`,prompt:kind==='dor'?`Dans ${nn(t)} dorien, quelle note est haussée par rapport à la gamme de ${nn(t)} mineur naturel ?`:
      kind==='lyd'?`Dans ${nn(t)} lydien, quelle note est haussée par rapport à la gamme de ${nn(t)} majeur ?`:`Dans ${nn(t)} mixolydien, quelle note est abaissée par rapport à la gamme de ${nn(t)} majeur ?`});
    if(fmt==='short')return shortQ(q,nn(n),noteAcc(n).concat(n.alt===0?[FRN[n.L]+' becarre',FRN[n.L]+'♮']:[]),{ph:'ex. : fa♯'});
    return mcQ(q,nn(n),[notes[(deg+1)%7],notes[(deg+6)%7],{L:n.L,alt:n.alt+(kind==='mix'?1:-1)},notes[(deg+2)%7]].map(nn));}
  const {k,i,t}=pick(qmTonics(lv).filter(x=>[1,3,4,5].includes(x.i)));const notes=qmModeNotes(k,i);
  const start=fromDia(28+t.L+(t.L>4?-7:0),t.alt);
  const ans=Array.from({length:8},(_,d)=>Object.assign(fromDia(dia(start)+d),{alt:notes[d%7].alt}));
  return padQ(Object.assign(q,{key:`m_not:w${k.sig}.${i}`,prompt:`Écris ${nn(t)} ${QM_N[i]} en montant, de la tonique à la tonique (8 notes). Ajoute les altérations devant les notes (pas d'armure).`}),
    {clef:'treble',mode:'seq',max:8,answer:ans,answerText:ans.map(nn).join(' – '),check:r=>r.length===8&&sameNote(r[0],t)&&r.every((n,d)=>d===0||dia(n)===dia(r[d-1])+1)&&r.every((n,d)=>n.alt===notes[d%7].alt)});
};
const QM_CH=['maj7','m7','m7','maj7','7','m7','m7♭5'];
QZG.m_acc=(lv,fmts)=>{
  const fmt=qzFmt(['mc'],fmts);if(!fmt)return null;
  const q={sub:'m_acc',topic:'modes-accords'};
  if(lv===3&&Math.random()<.3){const m=relMinor(pick(qkPool(2))),V=minorScale(m,'har')[4];
    Object.assign(q,{key:'m_acc:pd'+m.sig,prompt:`En ${keyFr(m,true)}, l'accord de dominante est ${NN(V)}7 (avec la sensible). Quel mode joue-t-on sur cet accord ?`});
    return mcQ(q,`${nn(V)} phrygien dominant`,[`${nn(V)} mixolydien`,`${nn(V)} phrygien`,`${nn(V)} éolien`]);}
  const k=pick(qkPool(Math.min(lv,2))),d=pick(lv===1?[0,1,4]:[0,1,2,3,4,5,6]),r=scaleOf(k)[d];
  Object.assign(q,{key:`m_acc:${k.sig}.${d}`,prompt:`En ${keyFr(k)}, quel mode correspond à l'accord ${NN(r)} ${QM_CH[d]} (degré ${ROMANS[d]}) ?`});
  return mcQ(q,`${nn(r)} ${QM_N[d]}`,qzShuffle([0,1,2,3,4,5,6].filter(x=>x!==d)).map(x=>`${nn(r)} ${QM_N[x]}`));
};
QZG.m_pen=(lv,fmts)=>{
  const v=pick(lv===1?['minp','rel']:['minp','majp','rel','blue']);
  const fmt=v==='blue'?qzFmt(['short','mc'],fmts):qzFmt(['mc'],fmts);if(!fmt)return null;
  const q={sub:'m_pen',topic:'impro-penta-blues'};const k=pick(qkPool(lv)),m=relMinor(k),ms=minorScale(m,'nat'),ks=scaleOf(k);
  const lst=a=>a.map(nn).join(', ');
  if(v==='minp'){const ans=[0,2,3,4,6].map(i=>ms[i]);Object.assign(q,{key:'m_pen:m'+k.sig,prompt:`Quelles sont les notes de la pentatonique mineure de ${nn(m)} ?`});
    return mcQ(q,lst(ans),[lst([0,2,4,5,6].map(i=>ms[i])),lst([0,1,2,4,6].map(i=>ms[i])),lst([0,2,3,4,5].map(i=>ms[i]))]);}
  if(v==='majp'){const ans=[0,1,2,4,5].map(i=>ks[i]);Object.assign(q,{key:'m_pen:M'+k.sig,prompt:`Quelles sont les notes de la pentatonique majeure de ${nn(k)} ?`});
    return mcQ(q,lst(ans),[lst([0,1,2,3,4].map(i=>ks[i])),lst([0,2,3,4,5].map(i=>ks[i])),lst([0,1,3,4,6].map(i=>ks[i]))]);}
  if(v==='rel'){Object.assign(q,{key:'m_pen:r'+k.sig,prompt:`La pentatonique mineure de ${nn(m)} a les mêmes notes que la pentatonique majeure de quelle note ?`});
    return mcQ(q,nn(k),[ks[4],ks[3],ms[4],{L:k.L,alt:k.alt?0:1}].map(nn));}
  const b={L:ms[4].L,alt:ms[4].alt-1};if(Math.abs(b.alt)>1)return null;
  Object.assign(q,{key:'m_pen:b'+k.sig,prompt:`Quelle est la « blue note » (♭5) de la gamme blues de ${nn(m)} ?`});
  /* on accepte aussi l'enharmonique (do♭ = si) */
  const L2=mod7(b.L-1),e={L:L2,alt:b.alt+((PC[b.L]-PC[L2])+12)%12},ok2=Math.abs(e.alt)<=1;
  if(fmt==='short')return shortQ(q,nn(b)+(ok2?` (${nn(e)})`:''),noteAcc(b).concat(ok2?noteAcc(e):[]),{ph:'ex. : mi♭'});
  return mcQ(q,nn(b),[ms[4],ms[3],{L:ms[2].L,alt:ms[2].alt+1},ms[6]].map(nn));
};
QZG.m_imp=(lv,fmts)=>{
  const fmt=qzFmt(['mc'],fmts);if(!fmt)return null;
  const v=pick(lv===1?['target','avoid','penta']:['target','avoid','guide','ii']),q={sub:'m_imp',topic:'impro-bases'};
  const k=pick(qkPool(Math.min(lv,2))),s=scaleOf(k);
  if(v==='target'){Object.assign(q,{key:'m_imp:t',prompt:'Pour que ton improvisation « colle » aux accords, quelles notes vises-tu sur les temps forts et à la fin des phrases ?'});
    return mcQ(q,'Les notes de l\'accord joué (fondamentale, 3ce, 5te)',['N\'importe quelle note de la gamme','Les notes juste à côté de l\'accord','Toujours la tonique de la tonalité']);}
  if(v==='penta'){Object.assign(q,{key:'m_imp:p',prompt:'Pourquoi commence-t-on souvent à improviser avec une gamme pentatonique ?'});
    return mcQ(q,'Elle n\'a pas de demi-ton : presque aucune note ne frotte avec les accords',['Elle a plus de notes que la gamme majeure','Elle ne marche qu\'en jazz','Elle contient toutes les notes chromatiques']);}
  if(v==='avoid'){Object.assign(q,{key:'m_imp:a'+k.sig,prompt:`Sur un accord de ${keyFr(k)}, quelle note de la gamme frotte si on la tient longtemps (note « à éviter ») ?`});
    return mcQ(q,`${nn(s[3])} (la 4te)`,[`${nn(s[2])} (la 3ce)`,`${nn(s[4])} (la 5te)`,`${nn(s[5])} (la 6te)`]);}
  if(v==='guide'){const V=s[4],t3=s[6],t7=s[3];Object.assign(q,{key:'m_imp:g'+k.sig,prompt:`Quelles sont les notes guides (3ce et 7e) de l'accord ${NN(V)}7 ?`});
    return mcQ(q,`${nn(t3)} et ${nn(t7)}`,[`${nn(s[1])} et ${nn(s[3])}`,`${nn(V)} et ${nn(s[1])}`,`${nn(t3)} et ${nn(s[1])}`]);}
  Object.assign(q,{key:'m_imp:i'+k.sig,prompt:`Dans un ii–V–I en ${keyFr(k)}, la 7e de l'accord ${NN(s[4])}7 (${nn(s[3])}) descend d'un demi-ton vers quelle note de l'accord ${NN(k)} ?`,topic:'impro-grille'});
  return mcQ(q,`${nn(s[2])} (la 3ce)`,[`${nn(k)} (la fondamentale)`,`${nn(s[4])} (la 5te)`,`${nn(s[6])} (la 7e)`]);
};
QZG.e_mde=(lv)=>{
  const fam=Math.random()<.5?[3,0,4]:[1,5,2],set=lv===1?fam:lv===2?(fam[0]===3?[3,0,4,1]:[1,5,2,4]):[0,1,2,3,4,5,6];
  const i=pick(set),r=qzRand(55,62),st=[0,2,4,5,7,9,11].map((x,_,a)=>x);const base=[0,2,4,5,7,9,11],rot=Array.from({length:8},(_,d)=>{const j=(i+d)%7;return(base[j]-base[i]+12)%12+(d===7?12:0);});
  const seq=rot.map(x=>r+x);void st;
  const q={sub:'e_mde',topic:'modes-couleurs',fmt:'listen',key:`e_mde:${i}${lv}`,prompt:'Écoute l\'accord de la tonique puis la gamme. Quel mode entends-tu ?',
    play:()=>{A.init();stop();const items=[{u:0,d:2,chord:[r-12,r-5,r]},...seq.map((m,k)=>({u:2.4+k,d:1,midi:m})),...seq.slice(0,-1).reverse().map((m,k)=>({u:10.4+k,d:1,midi:m})),{u:17.6,d:2,chord:[r-12,r-5,r]}];
      run({items,us:.42,endU:19.6});}};
  return mcQ(q,QM_CAP(QM_N[i]),set.filter(x=>x!==i).map(x=>QM_CAP(QM_N[x])),Math.min(4,set.length));
};

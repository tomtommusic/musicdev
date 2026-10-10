/* ========== MODULE : Tester mes connaissances — PDF (pages dessinées puis assemblées en PDF) ========== */
const PDF_W=816,PDF_H=1056,PDF_MX=60,PDF_MT=54,PDF_MB=64,PDF_S=2.4;      /* format lettre, en px CSS (96 ppp) */
const PDF_CW=PDF_W-2*PDF_MX;
const PF='"Atkinson Hyperlegible","Helvetica Neue",Arial,"Apple Symbols","Noto Music","Segoe UI Symbol",sans-serif';
const PFT='Lora,Georgia,"Times New Roman",serif';
async function pdfFonts(){try{await Promise.all(['400 14px "Atkinson Hyperlegible"','700 14px "Atkinson Hyperlegible"','700 22px Lora'].map(f=>document.fonts.load(f)));}catch(e){}}
/* partition ABC -> image nette (SVG agrandi) */
async function pdfStaff(abc,width,scale=.82){
  if(!HAS_ABC())return null;
  const box=document.createElement('div');box.style.cssText=`position:fixed;left:-20000px;top:0;width:${width}px;color:#000;background:#fff`;document.body.append(box);
  try{
    ABCJS.renderAbc(box,abc,{add_classes:false,staffwidth:Math.max(60,width/scale-16),scale,paddingleft:2,paddingright:2,paddingtop:4,paddingbottom:2,foregroundColor:'#000'});
    const svg=box.querySelector('svg');if(!svg)return null;
    const bb=svg.getBoundingClientRect();const w=parseFloat(svg.getAttribute('width'))||bb.width,h=parseFloat(svg.getAttribute('height'))||bb.height;
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');if(!svg.getAttribute('viewBox'))svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.removeAttribute('style');svg.setAttribute('width',String(w*PDF_S));svg.setAttribute('height',String(h*PDF_S));
    const xml=new XMLSerializer().serializeToString(svg);const img=new Image();
    await new Promise((res,rej)=>{img.onload=res;img.onerror=()=>rej(new Error('image de portée'));img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml);});
    return{img,w,h};
  }finally{box.remove();}
}
/* texte */
const pctx=(()=>{let c=null;return()=>c||(c=document.createElement('canvas').getContext('2d'));})();
function pfont(x,size,w='400',fam=PF){x.font=`${w} ${size}px ${fam}`;}
function pwrap(text,size,maxW,w='400',fam=PF){
  const x=pctx();pfont(x,size,w,fam);const out=[];
  for(const para of String(text).split('\n')){let line='';for(const word of para.split(/\s+/)){const t=line?line+' '+word:word;if(x.measureText(t).width>maxW&&line){out.push(line);line=word;}else line=t;}out.push(line);}
  return out;
}
/* bloc = {h, draw(x,y)} ; mise en page en deux temps (mesure puis dessin) pour numéroter les pages */
function blkText(text,{size=13,w='400',fam=PF,color='#111',indent=0,lh=1.38,gap=0,maxW=PDF_CW-indent}={}){
  const lines=pwrap(T(text),size,maxW,w,fam),L=size*lh;
  return{h:lines.length*L+gap,draw(x,y){pfont(x,size,w,fam);x.fillStyle=color;lines.forEach((s,i)=>x.fillText(s,PDF_MX+indent,y+size+i*L));}};
}
function blkImg(st,{indent=0,maxW=PDF_CW-indent,gap=4}={}){
  if(!st)return{h:0,draw(){}};const sc=Math.min(1,maxW/st.w),w=st.w*sc,h=st.h*sc;
  return{h:h+gap,draw(x,y){x.drawImage(st.img,PDF_MX+indent,y,w,h);}};
}
function blkGroup(parts,gap=0){return{h:parts.reduce((a,p)=>a+p.h,0)+gap,draw(x,y){let yy=y;for(const p of parts){p.draw(x,yy);yy+=p.h;}}};}
function blkRule(gap=10){return{h:gap*2,draw(x,y){x.strokeStyle='#bbb';x.lineWidth=1;x.beginPath();x.moveTo(PDF_MX,y+gap);x.lineTo(PDF_W-PDF_MX,y+gap);x.stroke();}};}
function blkLine(label,{indent=28,len=300,size=12.5}={}){
  return{h:size*2.4,draw(x,y){pfont(x,size);x.fillStyle='#111';const by=y+size*1.6;label=T(label);x.fillText(label,PDF_MX+indent,by);const lw=x.measureText(label).width;
    x.strokeStyle='#555';x.lineWidth=.8;x.beginPath();x.moveTo(PDF_MX+indent+lw+6,by+2);x.lineTo(PDF_MX+indent+lw+6+len,by+2);x.stroke();}};
}
function blkNum(n,mark){ /* numéro (et ✓ / ✗) dessiné dans la marge de la question */
  return{h:0,draw(x,y){pfont(x,13,'700');x.fillStyle='#111';x.fillText(n+'.',PDF_MX,y+13);
    if(mark!=null){pfont(x,16,'700');x.fillStyle=mark?'#1C7F4F':'#C2352E';x.fillText(mark?'✓':'✗',PDF_MX-22,y+14);}}};
}
async function pdfPages(blocks,{footer}){
  /* pagination */
  const pages=[[]];let y=PDF_MT;const maxY=PDF_H-PDF_MB;
  for(const b of blocks){
    if(b.pageBreak){if(pages[pages.length-1].length){pages.push([]);}y=PDF_MT;continue;}
    if(y+b.h>maxY&&pages[pages.length-1].length){pages.push([]);y=PDF_MT;}
    pages[pages.length-1].push([b,y]);y+=b.h;
  }
  const jpgs=[];
  for(let p=0;p<pages.length;p++){
    const c=document.createElement('canvas');c.width=Math.round(PDF_W*PDF_S);c.height=Math.round(PDF_H*PDF_S);
    const x=c.getContext('2d');x.scale(PDF_S,PDF_S);x.fillStyle='#fff';x.fillRect(0,0,PDF_W,PDF_H);x.textBaseline='alphabetic';
    for(const[b,yy]of pages[p])b.draw(x,yy);
    pfont(x,9.5);x.fillStyle='#777';x.fillText(T(footer),PDF_MX,PDF_H-30);const pg=TL(`Page ${p+1} de ${pages.length}`,`Page ${p+1} of ${pages.length}`,`Página ${p+1} de ${pages.length}`);x.fillText(pg,PDF_W-PDF_MX-x.measureText(pg).width,PDF_H-30);
    const blob=await new Promise(res=>c.toBlob(res,'image/jpeg',.9));c.width=c.height=0;
    jpgs.push({bytes:new Uint8Array(await blob.arrayBuffer()),w:Math.round(PDF_W*PDF_S),h:Math.round(PDF_H*PDF_S)});
  }
  return pdfAssemble(jpgs);
}
/* petit écrivain PDF : une image JPEG pleine page par page */
function pdfAssemble(pages,title='MusicDEV'){
  const enc=new TextEncoder(),parts=[],offs=[];let pos=0;
  const put=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);pos+=b.length;};
  const obj=(n,body)=>{offs[n]=pos;put(`${n} 0 obj\n`);body();put('\nendobj\n');};
  put('%PDF-1.4\n');put(new Uint8Array([37,226,227,207,211,10]));
  const n=pages.length,kids=pages.map((_,i)=>`${3+i*3} 0 R`).join(' ');
  obj(1,()=>put('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2,()=>put(`<< /Type /Pages /Kids [${kids}] /Count ${n} >>`));
  pages.forEach((pg,i)=>{
    const P=3+i*3,C=P+1,I=P+2,cs=`q 612 0 0 792 0 0 cm /Im0 Do Q`;
    obj(P,()=>put(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 ${I} 0 R >> >> /Contents ${C} 0 R >>`));
    obj(C,()=>put(`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`));
    obj(I,()=>{put(`<< /Type /XObject /Subtype /Image /Width ${pg.w} /Height ${pg.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pg.bytes.length} >>\nstream\n`);put(pg.bytes);put('\nendstream');});
  });
  const info=3+n*3;const esc=s=>s.replace(/[()\\]/g,'\\$&').replace(/[^\x20-\x7e]/g,'');
  obj(info,()=>put(`<< /Title (${esc(title)}) /Producer (MusicDEV) >>`));
  const xref=pos;let x=`xref\n0 ${info+1}\n0000000000 65535 f \n`;for(let k=1;k<=info;k++)x+=String(offs[k]).padStart(10,'0')+' 00000 n \n';
  put(x+`trailer\n<< /Size ${info+1} /Root 1 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts,{type:'application/pdf'});
}
/* ---------- contenu des questions ---------- */
const QW=PDF_CW-28;   /* largeur utile à droite du numéro */
async function pdfQuestion(q,k,{mode,resp}){
  /* mode : 'blank' (questionnaire vierge) ou 'result' (copie corrigée de l'élève) */
  const parts=[],res=mode==='result',ok=res?q.check(resp):null;
  parts.push(blkNum(k+1,res?ok:null));
  parts.push(blkText(T(q.prompt)+(q.fmt==='listen'?TL(' (question d\'écoute)',' (listening question)',' (pregunta de audición)'):''),{size:13,w:'700',indent:28,maxW:QW,gap:4}));
  if(q.abc&&!q.rhy)parts.push(blkImg(await pdfStaff(q.abc,q.small?220:Math.min(QW,520)),{indent:28}));
  if(!res){
    if(q.opts){
      if(q.opts.some(o=>o.abc)){
        const cols=Math.min(4,q.opts.length),cw=(QW-(cols-1)*12)/cols,imgs=await Promise.all(q.opts.map(o=>pdfStaff(o.abc,o.small?Math.min(cw,150):cw-20,.7)));
        let rowH=0;imgs.forEach(im=>{if(im)rowH=Math.max(rowH,im.h*Math.min(1,(cw-20)/im.w));});
        parts.push({h:rowH+16,draw(x,y){imgs.forEach((im,i)=>{const cx=PDF_MX+28+i*(cw+12);pfont(x,12.5,'700');x.fillStyle='#111';
          x.beginPath();x.arc(cx+6,y+9,5.5,0,Math.PI*2);x.strokeStyle='#333';x.lineWidth=1;x.stroke();x.fillText(QA[i],cx+16,y+13);
          if(im){const s=Math.min(1,(cw-20)/im.w);x.drawImage(im.img,cx+4,y+18,im.w*s,im.h*s);}});}});
      }else q.opts.forEach((o,i)=>{const t=blkText(`${QA[i]})  ${T(o.t)}`,{size:12.5,indent:48,maxW:QW-24,lh:1.35});
        parts.push({h:t.h+3,draw(x,y){x.beginPath();x.arc(PDF_MX+38,y+8.5,5.5,0,Math.PI*2);x.strokeStyle='#333';x.lineWidth=1;x.stroke();t.draw(x,y);}});});
    }else if(q.pad){parts.push(blkImg(await pdfStaff(q.paperAbc,q.pad.mode==='seq'?QW:Math.min(QW,340),.95),{indent:28}));parts.push(blkText('Écris ta réponse sur la portée.',{size:11,color:'#555',indent:28}));}
    else if(q.rhy){parts.push(blkImg(await pdfStaff(q.paperAbc,Math.min(QW,460),.95),{indent:28}));parts.push(blkText('Ajoute tes figures dans l\'espace vide de la mesure.',{size:11,color:'#555',indent:28}));}
    else if(q.fields)parts.push(blkLine(`${TL('Réponse','Answer','Respuesta')} (${q.fields.map(f=>T(f.label).toLowerCase()).join(TL(' et ',' and ',' y '))})${TL(' :',':',':')}`,{len:220}));
    else parts.push(blkLine('Réponse :',{len:260}));
  }else{
    if(q.rhy)parts.push(blkImg(await pdfStaff(q.paperAbc,Math.min(QW,460)),{indent:28}));
    const has=qzAnswered(q,resp);
    if((q.pad||q.rhy)&&has){parts.push(blkText('Ta réponse :',{size:12,indent:28,color:'#333'}));parts.push(blkImg(await pdfStaff(q.respAbc(resp),q.pad&&q.pad.mode==='seq'?QW:Math.min(QW,340)),{indent:28}));}
    else parts.push(blkText(TL('Ta réponse : ','Your answer: ','Tu respuesta: ')+(has?T(q.respText(resp)):TL('(aucune réponse)','(no answer)','(sin respuesta)')),{size:12.5,indent:28,color:'#222',maxW:QW}));
    if(!ok){parts.push(blkText(TL('Bonne réponse : ','Correct answer: ','Respuesta correcta: ')+T(q.answerText),{size:12.5,w:'700',indent:28,color:'#1C7F4F',maxW:QW}));
      if(q.answerAbc&&(q.pad||q.rhy))parts.push(blkImg(await pdfStaff(q.answerAbc,q.pad&&q.pad.mode==='seq'?QW:Math.min(QW,340)),{indent:28}));}
  }
  return blkGroup(parts,18);
}
const pdfSubjHead=id=>blkText(T(QZ_SUBJ.find(s=>s.id===id).t).toUpperCase(),{size:10.5,w:'700',color:'#2F5B53',gap:6});
function pdfHeader(title,lines){
  const parts=[blkText(title,{size:22,w:'700',fam:PFT,gap:6})];
  lines.forEach(l=>parts.push(typeof l==='string'?blkText(l,{size:11.5,color:'#444',gap:2}):l));
  parts.push(blkRule(8));return blkGroup(parts,4);
}
const qzSubjSummary=(cfg,paper)=>QZ_SUBJ.filter(s=>!(paper&&s.listen)).map(s=>{const on=s.subs.filter(([id])=>cfg.topics.includes(id));return !on.length?null:on.length===s.subs.length?T(s.t):`${T(s.t)} (${on.map(x=>T(x[1]).toLowerCase()).join(', ')})`;}).filter(Boolean).join(' · ');
async function qzPdfBlank(qs,cfg){
  await pdfFonts();
  const title=(QZ.title||'').trim()||'Évaluation de théorie musicale',lv=T(QZ_LEVELS[cfg.level-1][1]),NIV=TL('niveau','level','nivel');
  const nameLine={h:30,draw(x,y){pfont(x,12.5);x.fillStyle='#111';const by=y+20;let cx=PDF_MX;
    for(let[lab,len]of[['Nom :',250],['Groupe :',90],['Date :',120]]){lab=T(lab);x.fillText(lab,cx,by);const w=x.measureText(lab).width;x.strokeStyle='#555';x.lineWidth=.8;x.beginPath();x.moveTo(cx+w+6,by+2);x.lineTo(cx+w+6+len,by+2);x.stroke();cx+=w+len+26;}}};
  const blocks=[pdfHeader(title,[nameLine,`${qs.length} ${TL('questions','questions','preguntas')} · ${NIV} ${lv.toLowerCase()} · ${TL('Résultat :','Result:','Resultado:')} ______ / ${qs.length}`,TL('Sujets : ','Topics: ','Temas: ')+qzSubjSummary(cfg,true),TL('Pour les questions à choix, coche la bonne réponse. Pour les questions sur la portée, écris directement sur la portée.','For multiple-choice questions, tick the correct answer. For staff questions, write directly on the staff.','En las preguntas de opción múltiple, marca la respuesta correcta. En las preguntas con pentagrama, escribe directamente en el pentagrama.')])];
  let cur=null;
  for(let k=0;k<qs.length;k++){const q=qs[k],b=await pdfQuestion(q,k,{mode:'blank'});
    if(q.subj!==cur){cur=q.subj;blocks.push(blkGroup([pdfSubjHead(cur),b]));}else blocks.push(b);}
  blocks.push({pageBreak:true});
  blocks.push(pdfHeader(TL('Corrigé','Answer key','Solucionario'),[T(title)+` · ${qs.length} ${TL('questions','questions','preguntas')} · ${NIV} ${lv.toLowerCase()}`]));
  /* corrigé sur deux colonnes ; les réponses avec portée prennent toute la largeur */
  const half=PDF_CW/2-10;let pend=null;
  const flush=()=>{if(pend){blocks.push(pend.blk);pend=null;}};
  for(let k=0;k<qs.length;k++){const q=qs[k],staff=q.answerAbc&&(q.pad||q.rhy);
    if(staff){flush();const parts=[blkNum(k+1,null),blkText(q.answerText,{size:12,indent:28,maxW:QW})];
      parts.push(blkImg(await pdfStaff(q.answerAbc,q.pad&&q.pad.mode==='seq'?Math.min(QW,460):Math.min(QW,260),.75),{indent:28}));blocks.push(blkGroup(parts,8));continue;}
    const t=blkText(q.answerText,{size:12,indent:28,maxW:half-28});const cell={h:t.h,draw(x,y,dx=0){x.save();x.translate(dx,0);blkNum(k+1,null).draw(x,y);t.draw(x,y);x.restore();}};
    if(!pend){pend={a:cell,blk:{h:cell.h+8,draw(x,y){cell.draw(x,y);}}};}
    else{const a=pend.a;blocks.push({h:Math.max(a.h,cell.h)+8,draw(x,y){a.draw(x,y);cell.draw(x,y,PDF_CW/2+10);}});pend=null;}}
  flush();
  return pdfPages(blocks,{footer:`MusicDEV · ${T(title)}`});
}
async function qzPdfResult(t){
  await pdfFonts();
  const N=t.qs.length,sc=qzScore(t),pc=Math.round(100*sc/N),lv=T(QZ_LEVELS[t.cfg.level-1][1]);
  const by=QZ_SUBJ.map(s=>{const qs=t.qs.map((q,i)=>[q,i]).filter(([q])=>q.subj===s.id);if(!qs.length)return null;return `${T(s.t)}${TL(' : ',': ',': ')}${qs.filter(([q,i])=>q.check(t.resp[i])).length}/${qs.length}`;}).filter(Boolean).join(' · ');
  const scoreBox={h:58,draw(x,y){x.fillStyle='#EEF5F2';x.fillRect(PDF_MX,y+4,PDF_CW,48);pfont(x,24,'700',PFT);x.fillStyle='#2F5B53';x.fillText(TL(`Résultat : ${sc} / ${N}`,`Result: ${sc} / ${N}`,`Resultado: ${sc} / ${N}`),PDF_MX+16,y+37);
    pfont(x,18,'700');const s=`${pc} %`;x.fillText(s,PDF_W-PDF_MX-16-x.measureText(s).width,y+36);}};
  const blocks=[pdfHeader(TL('Tester mes connaissances : résultats','Test my knowledge: results','Pon a prueba tus conocimientos: resultados'),[(t.name?`${TL('Nom : ','Name: ','Nombre: ')}${t.name} · `:'')+`${TL('Date : ','Date: ','Fecha: ')}${qzDate(t.date)} · ${TL('niveau','level','nivel')} ${lv.toLowerCase()}`,scoreBox,by])];
  let cur=null;
  for(let k=0;k<N;k++){const q=t.qs[k],b=await pdfQuestion(q,k,{mode:'result',resp:t.resp[k]});
    if(q.subj!==cur){cur=q.subj;blocks.push(blkGroup([pdfSubjHead(cur),b]));}else blocks.push(b);}
  return pdfPages(blocks,{footer:`MusicDEV · ${TL('Tester mes connaissances','Test my knowledge','Pon a prueba tus conocimientos')}${t.name?' · '+t.name:''}`});
}

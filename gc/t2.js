const src=require('fs').readFileSync('gc.js','utf8');
global.localStorage={getItem:()=>null,setItem:()=>{}};global.MOD={gc:{}};global.T=x=>x;global.dgCap=s=>s;global.dgName=(m)=>m;global.dgBlack=m=>[1,3,6,8,10].includes(m%12);
eval(src.replace(/^const /gm,'var '));
const fmt=v=>v.fr.map(f=>f<0?'x':f).join('');
for(const id of ['gtr','uke','banjo','mando']){const I=GC_INSTS.find(i=>i.id===id);console.log('==',id);
for(const [r,t,n] of [[0,'maj','C'],[7,'maj','G'],[2,'maj','D'],[9,'m','Am'],[4,'m','Em'],[5,'maj','F'],[7,'7','G7'],[9,'7','A7'],[10,'maj','Bb'],[0,'9','C9'],[11,'dim7','B°7']])
  console.log(n.padEnd(6),gcVoicings(r,t,I).map(v=>fmt(v)+(v.barre?'(b'+v.barre.f+')':'')+':'+v.sc.toFixed(0)).join('  '));}
console.log(JSON.stringify(gcPianoVoicings(0,'maj')),JSON.stringify(gcPianoVoicings(11,'7')),JSON.stringify(gcPianoVoicings(0,'9')));

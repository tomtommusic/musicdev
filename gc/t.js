const src=require('fs').readFileSync('gc.js','utf8');
global.localStorage={getItem:()=>null,setItem:()=>{}};global.MOD={gc:{}};global.T=x=>x;global.dgCap=s=>s;global.dgName=(m)=>m;
eval(src.replace(/^const /gm,'var '));
const fmt=v=>v.fr.map(f=>f<0?'x':f).join('');
for(const [r,t,n] of [[0,'maj','C'],[7,'maj','G'],[2,'maj','D'],[9,'m','Am'],[4,'maj','E'],[4,'m','Em'],[5,'maj','F'],[11,'m','Bm'],[7,'7','G7'],[2,'7','D7'],[9,'m7','Am7'],[0,'maj7','Cmaj7'],[2,'sus4','Dsus4'],[11,'dim7','B°7'],[11,'m7b5','Bm7b5'],[0,'aug','C+'],[10,'maj','Bb'],[6,'m','F#m'],[0,'9','C9'],[0,'add9','Cadd9'],[3,'maj','Eb'],[8,'maj','Ab']])
  console.log(n.padEnd(7),gcVoicings(r,t).map(v=>fmt(v)+(v.barre?'(b'+v.barre.f+')':'')+':'+v.sc.toFixed(0)).join('  '));
for(const q of ['Am7','Sol7','F#m','Si♭maj7','Do dim','Ré','Bbm','Fadd9','Faug','C°7','Lam','ebm7b5','Do#m','sol sus4','xyz']) console.log(q,JSON.stringify(gcParse(q)));

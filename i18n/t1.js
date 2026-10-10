const fs=require('fs');const html=fs.readFileSync('/home/claude/musicdev/index.html','utf8');
const a=html.indexOf('/* ========== Langue');const b=html.indexOf('</script>',a);
global.MutationObserver=class{observe(){}};global.localStorage={getItem:()=>null,setItem(){}};
eval(html.slice(a,b)+';global.__I=I18N;global.__T=T;');
const cand=new Set(JSON.parse(fs.readFileSync('cand.json','utf8')));
__I.lang=process.argv[2]||'en';
for(const s of process.argv.slice(3))console.log(JSON.stringify(s),cand.has(s),'→',JSON.stringify(__T(s)));

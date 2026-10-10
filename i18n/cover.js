const fs=require('fs');const html=fs.readFileSync('/home/claude/musicdev/index.html','utf8');
const a=html.indexOf('/* ========== Langue');const b=html.indexOf('</script>',a);
global.MutationObserver=class{observe(){}};global.localStorage={getItem:()=>null,setItem(){}};
const code=html.slice(a,b)+';global.__I=I18N;global.__T=T;global.__core=tCore;';
eval(code);
const cand=JSON.parse(fs.readFileSync('cand.json','utf8'));
const FR=/[éèêàâçùûôîœÉÈÀÇ]|\b[ldjnqst]'[a-zà-ÿ]|\b(le|la|les|des|du|une?|est|et|pour|avec|sur|dans|ta|ton|tes|ou|pas|au|aux|qui|que|de|en|mesures?|croches?|doubles?|aucune?|tous|toutes|montant|descendant|rapide|lent|grave|aigu|suraigu|noires?|blanches?|rondes?|Partition|Réussites|Modules|tonique|accords?|gamme|degrés?|clé|joue|clique|choisis|écoute|silence|soupir|demi|temps|niveau|questions?|réponses?|voix|cordes?|corde|basse|accordage|aiguë?|Lent|Rapide|Modéré|Très)\b/i;
const res={en:[],es:[]};
for(const s of cand){
  if(!FR.test(s))continue;
  if(/^[\w.-]+$/.test(s)&&!/[À-ÿ]/.test(s)&&s===s.toLowerCase()&&!/^(montant|descendant|tous|toutes|aucune|aucun|rapide|lent|grave|aigu|harmonique|mesures|croches|doubles|noire|blanche|ronde|croche|double|silence|temps|accords|gamme)$/.test(s))continue;
  if(/X:1|\nK:|^<svg|^M[\d .-]|^[.#][\w-]+[ {,:]|^@media|\{[a-z-]+:[^}]*\}|^(var|const|let|function)\b|=>/.test(s))continue;
  for(const L of['en','es']){__I.lang=L;
    if(Object.prototype.hasOwnProperty.call(__I.dict[L],s))continue;
    const sm=s.replace(/\{\d\}/g,'1');const t=__T(sm);if(t!==sm)continue;
    res[L].push(s);}
}
fs.writeFileSync('uncov.json',JSON.stringify(res,null,0));
console.log(res.en.length,res.es.length);

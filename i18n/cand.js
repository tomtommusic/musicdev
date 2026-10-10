const fs=require('fs');const ts=require(require('child_process').execSync('npm root -g').toString().trim()+'/typescript');
let html=fs.readFileSync('/home/claude/musicdev/index.html','utf8');
html=html.replace(/<script>\n\/\* ========== Langue[\s\S]*?<\/script>/,'');
const out=new Set();
const re=/<script>([\s\S]*?)<\/script>/g;let m;
while((m=re.exec(html))){
  let code=m[1];
  const a=code.indexOf('const LIB1=[');const b=code.indexOf('const LIB=[...LIB1,...LIB2];');if(a>=0&&b>a)code=code.slice(0,a)+code.slice(b);
  const sf=ts.createSourceFile('x.js',code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  const visit=n=>{
    if(n.kind===ts.SyntaxKind.StringLiteral||n.kind===ts.SyntaxKind.NoSubstitutionTemplateLiteral)out.add(n.text);
    else if(n.kind===ts.SyntaxKind.TemplateExpression){let s=n.head.text;n.templateSpans.forEach((sp,i)=>{s+='{'+i+'}'+sp.literal.text;});out.add(s);}
    ts.forEachChild(n,visit);};
  visit(sf);
}
const body=html.replace(/<head>[\s\S]*?<\/head>/,'').replace(/<title>[\s\S]*?<\/title>/,'').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'');
const dec=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ');
for(const x of body.matchAll(/>([^<>]+)</g)){const t=dec(x[1]).replace(/\s+/g,' ').trim();if(t)out.add(t);}
for(const x of body.matchAll(/(?:title|aria-label|placeholder)="([^"]+)"/g))out.add(dec(x[1]));
for(const s of [...out]){if(/<[a-z]/i.test(s))for(const x of ('>'+s+'<').matchAll(/>([^<>]+)</g)){const t=x[1].trim();if(t)out.add(t);}}
const arr=[...out].map(s=>s.trim()).filter(s=>/[A-Za-zÀ-ÿ]{2}/.test(s));
fs.writeFileSync('cand.json',JSON.stringify([...new Set(arr)].sort()));console.log(arr.length);

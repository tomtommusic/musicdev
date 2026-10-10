import re,json,sys
src=open('/home/claude/musicdev/index.html').read()
# scripts only
scripts=re.findall(r'<script>(.*?)</script>',src,re.S)
code='\n'.join(scripts)
# drop library data region
a=code.find('const LIB1=[');b=code.find('const LIB=[...LIB1,...LIB2];')
code=code[:a]+code[b:]
out=[];i=0;n=len(code)
def read_str(i,q):
    j=i+1;buf='';parts=[];
    while j<n:
        c=code[j]
        if c=='\\':buf+=code[j:j+2];j+=2;continue
        if q=='`' and c=='$' and code[j+1:j+2]=='{':
            # skip nested expression
            depth=1;k=j+2
            while k<n and depth:
                if code[k]=='{':depth+=1
                elif code[k]=='}':depth-=1
                elif code[k] in '\'"`':
                    k=read_str(k,code[k])[1];continue
                k+=1
            parts.append(buf);buf='';j=k;continue
        if c==q:
            parts.append(buf);return parts,j+1
        buf+=c;j+=1
    return parts,j
prev=''
while i<n:
    c=code[i]
    if c=='/' and code[i+1:i+2]=='/':
        i=code.find('\n',i);i=n if i<0 else i;continue
    if c=='/' and code[i+1:i+2]=='*':
        i=code.find('*/',i)+2;continue
    if c in '\'"`':
        parts,j=read_str(i,c)
        out.append((c,parts));i=j;continue
    # regex literal heuristics skip
    if c=='/' and prev in '(,=:[!&|?{};':
        k=i+1
        while k<n and code[k]!='/' and code[k]!='\n':
            if code[k]=='\\':k+=1
            k+=1
        i=k+1;continue
    if not c.isspace():prev=c
    i+=1
FR=re.compile(r"[a-zA-ZÀ-ÿ]")
keys={}
def unesc(s):return s.replace("\\'","'").replace('\\"','"').replace('\\n','\n').replace('\\`','`')
for q,parts in out:
    if len(parts)==1:
        s=unesc(parts[0]).strip()
    else:
        s=''.join(unesc(p)+('{%d}'%k if k<len(parts)-1 else '') for k,p in enumerate(parts)).strip()
    if not s or not FR.search(s):continue
    if 'X:1' in s or '\nK:' in s or s.startswith('<svg') or s.startswith('M') and re.match(r'^M[\d .-]',s):continue
    if re.fullmatch(r'[a-z0-9_\-#.:\[\]()=>, ]*',s) and not re.search(r'\b(do|ré|mi|fa|sol|la|si|et|ou|de|le|un|une)\b',s): continue  # identifiants
    if re.fullmatch(r'[\w\-]+',s) and not re.search(r'[À-ÿ]',s) and s.lower()==s and len(s)>2 and s not in ('do','mi','fa','sol','la','si','ré','tous','aucune','montant','descendant','harmonique','sol','fa'): 
        # mot unique en minuscules sans accent : souvent un identifiant ; on le garde s'il ressemble à du français courant
        if s not in ('majeur','mineur','juste','majeure','mineure','augmentée','diminuée','augmenté','diminué','piano','guitare','voix','montant','descendant','harmonique','naturelle','mélodique','croches','noires','triolets','doubles','shuffle','aucune','tous','simple','composée'):continue
    if s.startswith('http') or s.startswith('atelier-') or s.startswith('data:'):continue
    if re.search(r'[{};]\s*$',s) and '=' in s and ':' in s and not re.search(r'[À-ÿ]',s):continue
    keys[s]=1
keys=sorted(keys)
json.dump(keys,open(sys.argv[1],'w'),ensure_ascii=False,indent=0)
print(len(keys))

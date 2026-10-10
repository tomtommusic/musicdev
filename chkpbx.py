import re,sys,json
s=open(sys.argv[1]).read()
s=re.sub(r'/\*.*?\*/','',s,flags=re.S); s=re.sub(r'^//.*$','',s,flags=re.M)
i=0
def ws():
    global i
    while i<len(s) and s[i].isspace(): i+=1
def val():
    global i
    ws(); c=s[i]
    if c=='{':
        i+=1; d={}
        while True:
            ws()
            if s[i]=='}': i+=1; return d
            k=val(); ws(); assert s[i]=='=',(i,s[i-30:i+30]); i+=1
            v=val(); ws(); assert s[i]==';',(i,s[i-30:i+30]); i+=1; d[k]=v
    if c=='(':
        i+=1; a=[]
        while True:
            ws()
            if s[i]==')': i+=1; return a
            a.append(val()); ws()
            if s[i]==',': i+=1
    if c=='"':
        i+=1; out=''
        while s[i]!='"':
            if s[i]=='\\': out+={'n':'\n','"':'"','\\':'\\','t':'\t'}[s[i+1]]; i+=2
            else: out+=s[i]; i+=1
        i+=1; return out
    m=re.match(r'[A-Za-z0-9_$./\-:@]+',s[i:]); assert m,(i,s[i:i+30]); i+=m.end(); return m.group()
root=val(); ws(); assert i==len(s)
o=root['objects']
def refs(x):
    if isinstance(x,dict):
        for v in x.values(): yield from refs(v)
    elif isinstance(x,list):
        for v in x: yield from refs(v)
    elif isinstance(x,str) and re.fullmatch(r'[0-9A-F]{24}',x): yield x
missing=[r for r in refs(o) if r not in o]+([root['rootObject']] if root['rootObject'] not in o else [])
print('objects',len(o),'missing refs',missing)
for k,v in o.items():
    if v['isa']=='PBXShellScriptBuildPhase': print(v['shellScript'])

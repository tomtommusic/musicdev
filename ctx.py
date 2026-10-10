import sys
s=open('/home/claude/musicdev/index.html').read()
for p in sys.argv[1:]:
    i=s.find(p); print('==',p)
    if i>=0: print(s[max(0,i-200):i+150].replace('\n',' '))

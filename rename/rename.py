import sys
# nom de l'app : MusiDev (affiché partout ; le dossier du projet iOS et l'identifiant restent « musicdev »)
p=sys.argv[1];s=open(p).read();s=s.replace('MusicDEV','MusiDev');open(p,'w').write(s)

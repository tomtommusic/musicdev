#!/usr/bin/env python3
"""Micro « frappes » : ne pas prendre le métronome pour une frappe (haut-parleurs d'ordinateur).
Chaque clic programmé est noté; pendant le décompte, on mesure à quel volume le micro entend le clic,
puis, autour de chaque clic, une frappe n'est retenue que si elle est nettement plus forte que ce clic."""
import sys
p=sys.argv[1];s=open(p,encoding='utf-8').read()
def sub(a,b):
    global s
    assert s.count(a)==1,'introuvable: '+a[:70]
    s=s.replace(a,b)
sub("  click(t,strong,dest){\n    const c=this.ctx,",
    "  click(t,strong,dest,ci){\n    if(typeof MIC!=='undefined'&&MIC.on){MIC.clk.push({t,ci:!!ci});if(MIC.clk.length>4000)MIC.clk.shift();}\n    const c=this.ctx,")
sub("A.click(t,k.strong,g);","A.click(t,k.strong,g,k.ci);")
sub("cand:null,stableN:0,emitted:null,peak:0,armed:true,floor:.003,lastOn:0,prevRms:0,samples:null};",
    "cand:null,stableN:0,emitted:null,peak:0,armed:true,floor:.003,lastOn:0,prevRms:0,samples:null,clk:[],bleed:0};")
sub("Object.assign(MIC,{on:true,stream,mode,onEvent,onLive,cand:null,stableN:0,emitted:null,peak:0,armed:true,floor:.003,lastOn:0,prevRms:0});",
    "Object.assign(MIC,{on:true,stream,mode,onEvent,onLive,cand:null,stableN:0,emitted:null,peak:0,armed:true,floor:.003,lastOn:0,prevRms:0,clk:[],bleed:0});")
sub("""    const now=c.currentTime;
    if(rms>Math.max(MIC.floor*5,.012)&&rms>MIC.prevRms*2.2&&now-MIC.lastOn>.09){MIC.lastOn=now;MIC.onEvent&&MIC.onEvent({t:now-.015});}""",
"""    const now=c.currentTime;
    /* fenêtre d'un clic du métronome : le son sort du haut-parleur puis revient au micro (latences comprises) */
    let win=null;for(const k of MIC.clk){const d=now-k.t;if(d>-.02&&d<.28){win=k;break;}}
    while(MIC.clk.length&&now-MIC.clk[0].t>1)MIC.clk.shift();
    if(win&&win.ci)MIC.bleed=Math.max(MIC.bleed,rms);                    // décompte : on apprend le volume du clic au micro
    const need=Math.max(MIC.floor*5,.012,win?MIC.bleed*1.8:0);
    if(rms>need&&rms>MIC.prevRms*2.2&&now-MIC.lastOn>.09&&!(win&&win.ci)){MIC.lastOn=now;MIC.onEvent&&MIC.onEvent({t:now-.015});}""")
open(p,'w',encoding='utf-8').write(s);print('micbleed ok')

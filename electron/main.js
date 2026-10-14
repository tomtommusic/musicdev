// MusicDEV : app de bureau (Electron). Tout fonctionne hors ligne.
const {app,BrowserWindow,Menu,session,systemPreferences,shell}=require('electron');
const path=require('path');
app.setName('MusicDEV');
const fs=require('fs');
/* Où ranger les réglages sauvegardés ?
   - Version « portable » : dans un dossier « MusicDEV-donnees » placé à côté de l'app (clé USB, dossier partagé…),
     pour que les sauvegardes suivent l'app d'un ordinateur à l'autre.
     Windows : toujours, si le dossier de l'app permet l'écriture. Mac : quand l'app est sur un disque externe (/Volumes/…).
   - Sinon : dans le dossier habituel de l'ordinateur (même dossier qu'avant le changement de nom). */
const oldData=path.join(app.getPath('appData'),"Atelier d'oreille");
function portableDir(){
  try{
    const exe=process.execPath;
    let base=null;
    if(process.platform==='win32')base=path.dirname(exe);
    else if(process.platform==='darwin'){const appDir=path.resolve(exe,'../../../..');if(appDir.startsWith('/Volumes/'))base=appDir;}
    if(!base)return null;
    const dir=path.join(base,'MusicDEV-donnees');
    if(!fs.existsSync(dir)){fs.mkdirSync(dir,{recursive:true});
      /* première fois : on reprend les réglages déjà sauvegardés sur cet ordinateur, s'il y en a */
      try{if(fs.existsSync(path.join(oldData,'Local Storage')))fs.cpSync(path.join(oldData,'Local Storage'),path.join(dir,'Local Storage'),{recursive:true});}catch(e){}}
    fs.accessSync(dir,fs.constants.W_OK);return dir;
  }catch(e){return null;}
}
app.setPath('userData',portableDir()||oldData);
if(!app.requestSingleInstanceLock()){app.quit();}

let win=null;
function createWindow(){
  win=new BrowserWindow({width:1340,height:900,minWidth:400,minHeight:520,title:'MusicDEV',show:false,icon:path.join(__dirname,'web','icons','icon-512.png'),
    webPreferences:{contextIsolation:true,sandbox:true,nodeIntegration:false,backgroundThrottling:false}});
  win.once('ready-to-show',()=>win.show());
  win.loadFile(path.join(__dirname,'web','index.html'));
  // Les liens externes s'ouvrent dans le navigateur, jamais dans l'app.
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:/i.test(url))shell.openExternal(url);return{action:'deny'};});
  win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('file:')){e.preventDefault();if(/^https?:/i.test(url))shell.openExternal(url);}});
  win.on('closed',()=>{win=null;});
}

async function micOK(){
  if(process.platform!=='darwin')return true;
  const st=systemPreferences.getMediaAccessStatus('microphone');
  if(st==='granted')return true;
  if(st==='denied'||st==='restricted')return false;
  try{return await systemPreferences.askForMediaAccess('microphone');}catch(e){return false;}
}

app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus();}});
app.whenReady().then(()=>{
  const ses=session.defaultSession;
  // Seul le micro est permis (pour la reconnaissance des notes).
  ses.setPermissionRequestHandler((wc,perm,cb,details)=>{
    const types=(details&&details.mediaTypes)||[];
    if(perm==='media'&&!types.includes('video'))micOK().then(cb);else cb(false);
  });
  ses.setPermissionCheckHandler((wc,perm)=>perm==='media');
  const isMac=process.platform==='darwin';
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac?[{label:app.name,submenu:[{role:'about',label:'À propos de MusicDEV'},{type:'separator'},{role:'hide',label:'Masquer'},{role:'hideOthers',label:'Masquer les autres'},{role:'unhide',label:'Tout afficher'},{type:'separator'},{role:'quit',label:'Quitter MusicDEV'}]}]:[]),
    {label:'Édition',submenu:[{role:'undo',label:'Annuler'},{role:'redo',label:'Rétablir'},{type:'separator'},{role:'cut',label:'Couper'},{role:'copy',label:'Copier'},{role:'paste',label:'Coller'},{role:'selectAll',label:'Tout sélectionner'}]},
    {label:'Présentation',submenu:[{role:'reload',label:'Recharger'},{type:'separator'},{role:'resetZoom',label:'Taille réelle'},{role:'zoomIn',label:'Agrandir'},{role:'zoomOut',label:'Réduire'},{type:'separator'},{role:'togglefullscreen',label:'Plein écran'}]},
    {label:'Fenêtre',submenu:[{role:'minimize',label:'Placer dans le Dock'},{role:'close',label:'Fermer'}]}
  ]));
  app.setAboutPanelOptions({applicationName:'MusicDEV',applicationVersion:'1.19.4',copyright:'Développement de l\'oreille musicale',credits:'Notation : abcjs (MIT). Polices : Atkinson Hyperlegible, Lora, Bricolage Grotesque, IBM Plex Mono (OFL).'});
  createWindow();
  app.on('activate',()=>{if(!win)createWindow();});
});
app.on('window-all-closed',()=>app.quit());

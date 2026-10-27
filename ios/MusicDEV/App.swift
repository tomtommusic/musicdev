// MusiDev — application iOS
// Enveloppe native (WKWebView) autour de la même app web que le site et les versions Mac/Windows.
// Les fichiers web sont copiés dans l'app au moment de la compilation (voir la phase « Copier l'app web »).

import UIKit
import WebKit
import AVFoundation
import UniformTypeIdentifiers

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Le son joue même quand l'iPhone est en mode silencieux (comme une app de musique),
        // et la session permet aussi le micro (accordeur, lecture au micro) : sortie sur le haut-parleur
        // ou des écouteurs Bluetooth, sans passer par l'écouteur du téléphone.
        try? AVAudioSession.sharedInstance().setCategory(.playAndRecord, mode: .default,
                                                         options: [.defaultToSpeaker, .allowBluetoothA2DP, .mixWithOthers])
        try? AVAudioSession.sharedInstance().setActive(true)

        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = WebViewController()
        window.makeKeyAndVisible()
        self.window = window
        return true
    }
}

/// Sert les fichiers de l'app web depuis le paquet de l'app, à l'adresse app://localhost/…
/// (« localhost » donne un contexte sécurisé : le micro et les sauvegardes fonctionnent normalement).
final class LocalFileHandler: NSObject, WKURLSchemeHandler {
    static let scheme = "app"
    private let root: URL

    init(root: URL) { self.root = root }

    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url else { return }
        var path = url.path
        if path.isEmpty || path == "/" { path = "/index.html" }
        let file = root.appendingPathComponent(String(path.dropFirst())).standardizedFileURL

        guard file.path.hasPrefix(root.standardizedFileURL.path),
              let data = try? Data(contentsOf: file) else {
            let resp = HTTPURLResponse(url: url, statusCode: 404, httpVersion: "HTTP/1.1", headerFields: nil)!
            task.didReceive(resp)
            task.didReceive(Data())
            task.didFinish()
            return
        }
        let mime = UTType(filenameExtension: file.pathExtension)?.preferredMIMEType ?? "application/octet-stream"
        let headers = ["Content-Type": mime,
                       "Content-Length": String(data.count),
                       "Cache-Control": "no-cache"]
        let resp = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: headers)!
        task.didReceive(resp)
        task.didReceive(data)
        task.didFinish()
    }

    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}

/// Comportement d'app plutôt que de page web : pas de zoom (double toucher, pincement), pas de sélection de texte
/// ni de menu « copier » sur les boutons, pas de reflet gris au toucher.
private let nativeFeelJS = """
(function(){
  var m=document.querySelector('meta[name=viewport]');
  if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}
  m.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
  var st=document.createElement('style');
  st.textContent='html{-webkit-text-size-adjust:100%;touch-action:manipulation}*{-webkit-tap-highlight-color:transparent}'+
    'body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}'+
    'input,textarea,select,[contenteditable],[contenteditable] *{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}';
  document.head.appendChild(st);
  document.documentElement.classList.add('native-app');
  document.addEventListener('gesturestart',function(e){e.preventDefault();},{passive:false});
})();
"""

/// Micro natif (surtout pour Mac) : dans la vue web de Mac Catalyst, navigator.mediaDevices n'existe pas.
/// L'app capte le son avec AVAudioEngine et l'envoie à la page, qui s'en sert comme d'un micro ordinaire (voir micBridgeJS).
final class NativeMic: NSObject, WKScriptMessageHandler {
    weak var webView: WKWebView?
    private let engine = AVAudioEngine()
    private var running = false
    private var rate: Double = 48000

    func userContentController(_ uc: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let cmd = message.body as? String else { return }
        if cmd == "start" { start() } else if cmd == "stop" { stop() }
    }
    private func js(_ code: String) {
        DispatchQueue.main.async { self.webView?.evaluateJavaScript(code, completionHandler: nil) }
    }
    private func fail(_ name: String) { js("window.__nativeMicReady&&__nativeMicReady(false,'\(name)')") }
    private func start() {
        switch AVCaptureDevice.authorizationStatus(for: .audio) {
        case .authorized: DispatchQueue.main.async { self.begin() }
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .audio) { ok in DispatchQueue.main.async { ok ? self.begin() : self.fail("NotAllowedError") } }
        default: fail("NotAllowedError")
        }
    }
    private func begin() {
        if running { js("window.__nativeMicReady&&__nativeMicReady(true,\(rate))"); return }
        let input = engine.inputNode
        let fmt = input.outputFormat(forBus: 0)
        guard fmt.sampleRate > 0, fmt.channelCount > 0 else { fail("NotFoundError"); return }
        rate = fmt.sampleRate
        input.removeTap(onBus: 0)
        input.installTap(onBus: 0, bufferSize: 2048, format: fmt) { [weak self] buf, _ in
            guard let self = self, let ch = buf.floatChannelData else { return }
            let n = Int(buf.frameLength)
            let b64 = Data(bytes: ch[0], count: n * MemoryLayout<Float>.size).base64EncodedString()
            self.js("window.__nativeMic&&__nativeMic('\(b64)')")
        }
        do { engine.prepare(); try engine.start(); running = true; js("window.__nativeMicReady&&__nativeMicReady(true,\(rate))") }
        catch { input.removeTap(onBus: 0); fail("NotReadableError") }
    }
    private func stop() {
        guard running else { return }
        engine.inputNode.removeTap(onBus: 0); engine.stop(); running = false
    }
}

/// Côté page : si navigator.mediaDevices manque (Mac), on le remplace par le micro natif.
/// getUserMedia rend un « flux » factice ; createMediaStreamSource le transforme en nœud audio qui joue les échantillons reçus.
private let micBridgeJS = """
(function(){
  if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)return;
  if(!(window.webkit&&webkit.messageHandlers&&webkit.messageHandlers.micbridge))return;
  var L=96000*2,R=new Float32Array(L),NM={sr:48000,wa:0,users:0,pending:null};
  window.__nativeMic=function(b64){var s=atob(b64),n=s.length,u=new Uint8Array(n);for(var i=0;i<n;i++)u[i]=s.charCodeAt(i);
    var f=new Float32Array(u.buffer,0,n>>2);for(var k=0;k<f.length;k++){R[NM.wa%L]=f[k];NM.wa++;}};
  window.__nativeMicReady=function(ok,x){var p=NM.pending;NM.pending=null;if(!p)return;
    if(ok){NM.sr=x||48000;NM.users++;p.res(mk());}else{var e=new Error('micro');e.name=x||'NotAllowedError';p.rej(e);}};
  function mk(){var tr={kind:'audio',enabled:true,muted:false,readyState:'live',
      stop:function(){if(tr.readyState==='ended')return;tr.readyState='ended';NM.users--;if(NM.users<=0){NM.users=0;webkit.messageHandlers.micbridge.postMessage('stop');}},
      getSettings:function(){return{sampleRate:NM.sr};},addEventListener:function(){},removeEventListener:function(){}};
    return{__native:true,getTracks:function(){return[tr];},getAudioTracks:function(){return[tr];}};}
  var md=navigator.mediaDevices||{};
  md.getUserMedia=function(){return new Promise(function(res,rej){NM.pending={res:res,rej:rej};webkit.messageHandlers.micbridge.postMessage('start');});};
  md.enumerateDevices=md.enumerateDevices||function(){return Promise.resolve([{kind:'audioinput',deviceId:'native',label:'Micro'}]);};
  try{Object.defineProperty(navigator,'mediaDevices',{value:md,configurable:true});}catch(e){navigator.mediaDevices=md;}
  var AC=window.AudioContext||window.webkitAudioContext,orig=AC.prototype.createMediaStreamSource;
  AC.prototype.createMediaStreamSource=function(st){
    if(!st||!st.__native)return orig.call(this,st);
    var ctx=this,sp=ctx.createScriptProcessor(1024,1,1),z=ctx.createGain(),ra=NM.wa;z.gain.value=0;sp.connect(z);z.connect(ctx.destination);
    sp.onaudioprocess=function(e){var out=e.outputBuffer.getChannelData(0),ratio=NM.sr/ctx.sampleRate;
      if(NM.wa-ra>NM.sr*0.25||ra>NM.wa)ra=NM.wa-NM.sr*0.03;
      for(var i=0;i<out.length;i++){if(ra+1>=NM.wa){out[i]=0;continue;}out[i]=R[Math.floor(ra)%L];ra+=ratio;}};
    return sp;};
})();
"""

final class WebViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {
    private let nativeMic = NativeMic()
    private var webView: WKWebView!
    private var latTimer: Timer?
    private let paper = UIColor(red: 244.0/255.0, green: 239.0/255.0, blue: 232.0/255.0, alpha: 1)

    override func loadView() {
        let webRoot = Bundle.main.resourceURL!.appendingPathComponent("web", isDirectory: true)

        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(LocalFileHandler(root: webRoot), forURLScheme: LocalFileHandler.scheme)
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.websiteDataStore = .default()   // sauvegardes (réglages, réussites) conservées
        config.userContentController.addUserScript(WKUserScript(source: nativeFeelJS, injectionTime: .atDocumentEnd, forMainFrameOnly: true))
        config.userContentController.add(nativeMic, name: "micbridge")
        config.userContentController.addUserScript(WKUserScript(source: micBridgeJS, injectionTime: .atDocumentStart, forMainFrameOnly: true))

        webView = WKWebView(frame: .zero, configuration: config)
        webView.uiDelegate = self
        nativeMic.webView = webView
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = paper
        webView.scrollView.backgroundColor = paper
        webView.allowsBackForwardNavigationGestures = false
        webView.allowsLinkPreview = false
        if #available(iOS 16.4, *) { webView.isInspectable = true }
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        webView.load(URLRequest(url: URL(string: "\(LocalFileHandler.scheme)://localhost/index.html")!))
        #if targetEnvironment(macCatalyst)
        // Sur Mac, on demande l'accès au micro dès le premier lancement (la fenêtre du système apparaît une seule fois).
        if AVCaptureDevice.authorizationStatus(for: .audio) == .notDetermined {
            AVCaptureDevice.requestAccess(for: .audio) { _ in }
        }
        #endif
        // Latence réelle de la sortie audio (haut-parleur, écouteurs Bluetooth…), transmise à l'app web
        // pour aligner l'affichage (curseur, métronome visuel) sur le son entendu.
        latTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in self?.pushLatency() }
        NotificationCenter.default.addObserver(forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main) { [weak self] _ in
            self?.pushLatency()
        }
        // Retour dans l'app : on réactive la session audio (le micro et le son reprennent).
        NotificationCenter.default.addObserver(forName: UIApplication.didBecomeActiveNotification, object: nil, queue: .main) { [weak self] _ in
            try? AVAudioSession.sharedInstance().setActive(true)
            self?.pushLatency()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                self?.webView?.evaluateJavaScript("window.dispatchEvent(new Event('nativeresume'))", completionHandler: nil)
            }
        }
        NotificationCenter.default.addObserver(forName: UIApplication.willResignActiveNotification, object: nil, queue: .main) { [weak self] _ in
            self?.webView?.evaluateJavaScript("window.dispatchEvent(new Event('nativepause'))", completionHandler: nil)
        }
        // Interruption audio (appel, Siri, autre app) terminée : on relance aussi.
        NotificationCenter.default.addObserver(forName: AVAudioSession.interruptionNotification, object: nil, queue: .main) { [weak self] n in
            guard let raw = n.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
                  AVAudioSession.InterruptionType(rawValue: raw) == .ended else { return }
            try? AVAudioSession.sharedInstance().setActive(true)
            self?.webView?.evaluateJavaScript("window.dispatchEvent(new Event('nativeresume'))", completionHandler: nil)
        }
    }

    private func pushLatency() {
        let s = AVAudioSession.sharedInstance()
        let lat = max(0, min(0.5, s.outputLatency + s.ioBufferDuration))
        webView?.evaluateJavaScript("window.NATIVE_LAT=\(lat);", completionHandler: nil)
    }

    override var preferredStatusBarStyle: UIStatusBarStyle { .darkContent }

    // Micro : iOS affiche sa propre demande d'autorisation la première fois ; l'app ne redemande pas ensuite.
    @available(iOS 15.0, *)
    func webView(_ webView: WKWebView,
                 requestMediaCapturePermissionFor origin: WKSecurityOrigin,
                 initiatedByFrame frame: WKFrameInfo,
                 type: WKMediaCaptureType,
                 decisionHandler: @escaping (WKPermissionDecision) -> Void) {
        guard origin.host == "localhost" else { decisionHandler(.prompt); return }
        // Le système doit d'abord autoriser l'app elle-même (indispensable sur Mac, utile sur iPhone).
        switch AVCaptureDevice.authorizationStatus(for: .audio) {
        case .authorized:
            decisionHandler(.grant)
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .audio) { ok in
                DispatchQueue.main.async { decisionHandler(ok ? .grant : .deny) }
            }
        default:
            decisionHandler(.deny)
            DispatchQueue.main.async { [weak self] in self?.micDeniedAlert() }
        }
    }

    /// Micro refusé dans les réglages : on explique où l'autoriser et on propose d'y aller.
    private func micDeniedAlert() {
        #if targetEnvironment(macCatalyst)
        let msg = "Pour utiliser l'accordeur et la lecture au micro, autorise MusiDev dans Réglages Système › Confidentialité et sécurité › Microphone, puis relance l'app."
        let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone")
        #else
        let msg = "Pour utiliser l'accordeur et la lecture au micro, autorise MusiDev dans Réglages › MusiDev › Micro."
        let url = URL(string: UIApplication.openSettingsURLString)
        #endif
        guard presentedViewController == nil else { return }
        let a = UIAlertController(title: "Micro désactivé", message: msg, preferredStyle: .alert)
        a.addAction(UIAlertAction(title: "Plus tard", style: .cancel))
        if let url = url { a.addAction(UIAlertAction(title: "Ouvrir les réglages", style: .default) { _ in UIApplication.shared.open(url) }) }
        present(a, animated: true)
    }

    // Les liens vers l'extérieur s'ouvrent dans Safari.
    func webView(_ webView: WKWebView,
                 decidePolicyFor action: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = action.request.url else { return decisionHandler(.cancel) }
        let s = url.scheme?.lowercased() ?? ""
        if s == LocalFileHandler.scheme || s == "about" || s == "blob" || s == "data" {
            decisionHandler(.allow)
        } else {
            if action.navigationType == .linkActivated || action.targetFrame == nil {
                UIApplication.shared.open(url)
            }
            decisionHandler(.cancel)
        }
    }

    // Liens target="_blank"
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                 for action: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = action.request.url { UIApplication.shared.open(url) }
        return nil
    }

    // alert()/confirm() de l'app web
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let a = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        present(a, animated: true)
    }

    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let a = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        a.addAction(UIAlertAction(title: "Annuler", style: .cancel) { _ in completionHandler(false) })
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
        present(a, animated: true)
    }

    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String,
                 defaultText: String?, initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping (String?) -> Void) {
        let a = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
        a.addTextField { $0.text = defaultText }
        a.addAction(UIAlertAction(title: "Annuler", style: .cancel) { _ in completionHandler(nil) })
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(a.textFields?.first?.text) })
        present(a, animated: true)
    }

    // Si le processus web est fermé par iOS (mémoire), on recharge.
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { webView.reload() }
}

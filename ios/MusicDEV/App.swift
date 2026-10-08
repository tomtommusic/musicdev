// MusicDEV — application iOS
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
        // Le son joue même quand l'iPhone est en mode silencieux (comme une app de musique).
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
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

final class WebViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {
    private var webView: WKWebView!
    private let paper = UIColor(red: 244.0/255.0, green: 239.0/255.0, blue: 232.0/255.0, alpha: 1)

    override func loadView() {
        let webRoot = Bundle.main.resourceURL!.appendingPathComponent("web", isDirectory: true)

        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(LocalFileHandler(root: webRoot), forURLScheme: LocalFileHandler.scheme)
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.websiteDataStore = .default()   // sauvegardes (réglages, réussites) conservées

        webView = WKWebView(frame: .zero, configuration: config)
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = paper
        webView.scrollView.backgroundColor = paper
        webView.allowsBackForwardNavigationGestures = false
        if #available(iOS 16.4, *) { webView.isInspectable = true }
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        webView.load(URLRequest(url: URL(string: "\(LocalFileHandler.scheme)://localhost/index.html")!))
    }

    override var preferredStatusBarStyle: UIStatusBarStyle { .darkContent }

    // Micro : iOS affiche sa propre demande d'autorisation la première fois ; l'app ne redemande pas ensuite.
    @available(iOS 15.0, *)
    func webView(_ webView: WKWebView,
                 requestMediaCapturePermissionFor origin: WKSecurityOrigin,
                 initiatedByFrame frame: WKFrameInfo,
                 type: WKMediaCaptureType,
                 decisionHandler: @escaping (WKPermissionDecision) -> Void) {
        decisionHandler(origin.host == "localhost" ? .grant : .prompt)
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

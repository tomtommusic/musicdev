// MusiDev — application Android
// Enveloppe native (WebView) autour de la même app web que le site et les versions iPhone/Mac.
// Les fichiers web sont copiés dans l'app à la compilation (voir app/build.gradle, tâche copyWeb).
// Leçons tirées de la version iPhone, appliquées ici dès le départ :
//  - fichiers servis en https (WebViewAssetLoader) : contexte sécurisé, donc micro et sauvegardes fonctionnent ;
//  - pas de zoom, pas de sélection de texte ni de menu sur les boutons ;
//  - autorisation du micro demandée par l'app, avec explication si elle a été refusée ;
//  - au retour dans l'app (ou après un appel), on prévient la page (« nativeresume ») pour relancer le micro ;
//  - le son peut jouer sans toucher l'écran d'abord (métronome, accompagnement) ;
//  - pas de « service worker » (il garderait une ancienne version en cache après une mise à jour) ;
//  - partage et enregistrement des fichiers (enregistreur) par la feuille de partage d'Android ;
//  - liens externes ouverts dans le navigateur ; bouton Retour = retour à l'accueil.
package ca.tomtommusic.musidev;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import androidx.activity.ComponentActivity;
import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;

public class MainActivity extends ComponentActivity {
    static final String TAG = "MusiDev";
    static final String HOST = "appassets.androidplatform.net";
    static final String START = "https://" + HOST + "/web/index.html";
    static final int REQ_MIC = 7;

    private WebView web;
    private FrameLayout root;
    private PermissionRequest pendingMic;
    private boolean resumedOnce = false;

    /** Comportement d'app plutôt que de page web (même chose que sur iPhone), couleur des barres du système,
     *  et partage des fichiers par Android (navigator.share n'existe pas dans la WebView). */
    static final String NATIVE_JS =
        "(function(){if(window.__musidevNative)return;window.__musidevNative=1;" +
        "var m=document.querySelector('meta[name=viewport]');if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}" +
        "m.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';" +
        "var st=document.createElement('style');st.textContent='html{-webkit-text-size-adjust:100%;touch-action:manipulation}*{-webkit-tap-highlight-color:transparent}'+" +
        "'body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}'+" +
        "'input,textarea,select,[contenteditable],[contenteditable] *{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}';" +
        "document.head.appendChild(st);document.documentElement.classList.add('native-app','android-app');" +
        // couleur du fond de la page -> barres d'état et de navigation
        "var last='';function bg(){try{var c=getComputedStyle(document.body).backgroundColor;if(!c||c==='rgba(0, 0, 0, 0)')c=getComputedStyle(document.documentElement).backgroundColor;if(c&&c!==last){last=c;MusiDevAndroid.setBg(c);}}catch(e){}}" +
        "bg();setTimeout(bg,300);setTimeout(bg,1500);" +
        "new MutationObserver(bg).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class','style']});" +
        "try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){setTimeout(bg,50);});}catch(e){}" +
        // partage de fichiers
        "function send(file,name){var r=new FileReader();r.onload=function(){var s=String(r.result),i=s.indexOf(',');" +
        "MusiDevAndroid.shareFile(s.slice(i+1),name||file.name||'fichier',file.type||'application/octet-stream');};r.readAsDataURL(file);}" +
        "navigator.canShare=function(d){return !!(d&&d.files&&d.files.length);};" +
        "navigator.share=function(d){return new Promise(function(res,rej){try{if(d&&d.files&&d.files.length){send(d.files[0],d.files[0].name);res();}" +
        "else if(d&&(d.url||d.text)){MusiDevAndroid.shareText((d.title?d.title+'\\n':'')+(d.text||'')+(d.url?' '+d.url:''));res();}else rej(new Error('rien'));}catch(e){rej(e);}});};" +
        // liens de téléchargement (blob:) -> partage
        "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[download]');if(!a)return;var h=a.href||'';" +
        "if(h.indexOf('blob:')===0||h.indexOf('data:')===0){e.preventDefault();fetch(h).then(function(r){return r.blob();}).then(function(b){send(b,a.getAttribute('download'));});}},true);" +
        "})();";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        setVolumeControlStream(AudioManager.STREAM_MUSIC);   // les boutons de volume règlent le son de l'app

        root = new FrameLayout(this);
        root.setBackgroundColor(getColor(R.color.paper));
        web = new WebView(this);
        root.addView(web, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        // Android 15 dessine l'app sous les barres du système : on décale la page (barres, encoche, clavier).
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets b = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout() | WindowInsetsCompat.Type.ime());
            v.setPadding(b.left, b.top, b.right, b.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
        setBars(getColor(R.color.paper));

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .setDomain(HOST)
            .addPathHandler("/web/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();

        // Pas de service worker dans l'app : les fichiers sont déjà dans l'app, et un cache garderait une vieille version.
        try {
            ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
                @Override public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) { return notFound(); }
            });
        } catch (Throwable ignored) {}

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);            // sauvegardes (réglages, réussites)
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setTextZoom(100);                       // la taille du texte du système ne déforme pas la mise en page
        web.setBackgroundColor(getColor(R.color.paper));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setLongClickable(false);
        web.setOnLongClickListener(v -> false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        web.addJavascriptInterface(new Bridge(), "MusiDevAndroid");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                if (HOST.equals(u.getHost()) && u.getPath() != null && u.getPath().endsWith("/sw.js")) return notFound();
                WebResourceResponse r = loader.shouldInterceptRequest(u);
                if (BuildConfig.DEBUG) Log.i(TAG, "req " + u + " -> " + (r == null ? "null" : r.getStatusCode() + " " + r.getMimeType()));
                return r;
            }
            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest req, WebResourceResponse resp) {
                Log.w(TAG, "http " + resp.getStatusCode() + " " + req.getUrl());
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                String sc = u.getScheme() == null ? "" : u.getScheme();
                if (HOST.equals(u.getHost()) || sc.equals("blob") || sc.equals("data") || sc.equals("about")) return false;
                openOutside(u);
                return true;
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                view.evaluateJavascript(NATIVE_JS, null);
                runTestJs();
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    boolean audio = false;
                    for (String r : request.getResources()) if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)) audio = true;
                    if (!audio || !HOST.equals(request.getOrigin().getHost())) { request.deny(); return; }
                    if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                        request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                    } else {
                        if (pendingMic != null) pendingMic.deny();
                        pendingMic = request;
                        requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
                    }
                });
            }
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                Log.i(TAG, "js " + m.messageLevel() + ": " + m.message() + " @" + m.lineNumber());
                return true;
            }
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, android.os.Message resultMsg) {
                // liens target="_blank" : on récupère l'adresse puis on l'ouvre dans le navigateur
                WebView tmp = new WebView(MainActivity.this);
                tmp.setWebViewClient(new WebViewClient() {
                    @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) { openOutside(r.getUrl()); return true; }
                });
                ((WebView.WebViewTransport) resultMsg.obj).setWebView(tmp);
                resultMsg.sendToTarget();
                return true;
            }
        });

        // Bouton Retour : revenir à l'accueil ; depuis l'accueil, quitter.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() {
                web.evaluateJavascript("(function(){try{var d=document.querySelector('dialog[open],.modal.open');if(d&&d.close){d.close();return true;}" +
                    "if(window.S&&S.mod&&S.mod!=='ho'&&typeof openModule==='function'){openModule('ho');scrollTo(0,0);return true;}}catch(e){}return false;})()",
                    r -> { if (!"true".equals(r)) { setEnabled(false); getOnBackPressedDispatcher().onBackPressed(); setEnabled(true); } });
            }
        });

        if (BuildConfig.DEBUG && getIntent() != null) testJs = getIntent().getStringExtra("js");
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(START);
    }

    /** Version de test seulement : « adb shell am start … --es js "openModule('ba')" » exécute du code dans la page
     *  (sert aux captures d'écran automatiques, puisqu'on n'a pas d'appareil Android sous la main). */
    private String testJs;
    void runTestJs() {
        if (!BuildConfig.DEBUG || testJs == null) return;
        final String js = testJs; testJs = null;
        web.postDelayed(() -> web.evaluateJavascript(js, r -> Log.i(TAG, "test: " + r)), 800);
    }
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (BuildConfig.DEBUG && intent.hasExtra("js")) { testJs = intent.getStringExtra("js"); runTestJs(); }
    }

    static WebResourceResponse notFound() {
        WebResourceResponse r = new WebResourceResponse("text/plain", "utf-8", new ByteArrayInputStream(new byte[0]));
        r.setStatusCodeAndReasonPhrase(404, "Not Found");
        return r;
    }

    void openOutside(Uri u) {
        try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (ActivityNotFoundException ignored) {}
    }

    /** Barres du système de la même couleur que la page, icônes claires ou foncées selon le fond. */
    void setBars(int color) {
        root.setBackgroundColor(color);
        Window w = getWindow();
        boolean light = (Color.red(color) * 299 + Color.green(color) * 587 + Color.blue(color) * 114) / 1000 > 140;
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(w, w.getDecorView());
        c.setAppearanceLightStatusBars(light);
        c.setAppearanceLightNavigationBars(light);
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] res) {
        super.onRequestPermissionsResult(code, perms, res);
        if (code != REQ_MIC || pendingMic == null) return;
        PermissionRequest p = pendingMic; pendingMic = null;
        if (res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED) {
            p.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        } else {
            p.deny();
            if (!shouldShowRequestPermissionRationale(Manifest.permission.RECORD_AUDIO)) micDeniedDialog();
        }
    }

    /** Micro refusé pour de bon : on explique où l'autoriser et on propose d'y aller. */
    void micDeniedDialog() {
        new AlertDialog.Builder(this)
            .setTitle("Micro désactivé")
            .setMessage("Pour utiliser l'accordeur et la lecture au micro, autorise le micro pour MusiDev dans Paramètres › Applications › MusiDev › Autorisations.")
            .setNegativeButton("Plus tard", null)
            .setPositiveButton("Ouvrir les paramètres", (d, w) -> {
                Intent i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.fromParts("package", getPackageName(), null));
                try { startActivity(i); } catch (ActivityNotFoundException ignored) {}
            })
            .show();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        web.resumeTimers();
        // Retour dans l'app : la page relance le micro et le son (même événement que sur iPhone).
        if (resumedOnce) web.postDelayed(() -> web.evaluateJavascript("window.dispatchEvent(new Event('nativeresume'))", null), 300);
        resumedOnce = true;
    }

    @Override
    protected void onPause() {
        web.evaluateJavascript("window.dispatchEvent(new Event('nativepause'))", null);
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    protected void onDestroy() {
        if (web != null) { web.destroy(); }
        super.onDestroy();
    }

    /** Fonctions appelées par la page. */
    final class Bridge {
        @JavascriptInterface
        public void setBg(String css) {
            final int c = parseCss(css);
            if (c != 0) runOnUiThread(() -> setBars(c));
        }

        @JavascriptInterface
        public void shareFile(String b64, String name, String mime) {
            try {
                File dir = new File(getCacheDir(), "partage");
                if (!dir.exists()) dir.mkdirs();
                File[] old = dir.listFiles();
                if (old != null) for (File f : old) f.delete();
                String safe = name.replaceAll("[\\\\/:*?\"<>|]", "_");
                File f = new File(dir, safe);
                try (FileOutputStream o = new FileOutputStream(f)) { o.write(Base64.decode(b64, Base64.DEFAULT)); }
                Uri uri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".fichiers", f);
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType(mime == null || mime.isEmpty() ? "application/octet-stream" : mime);
                send.putExtra(Intent.EXTRA_STREAM, uri);
                send.putExtra(Intent.EXTRA_TITLE, safe);
                send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                runOnUiThread(() -> startActivity(Intent.createChooser(send, safe)));
            } catch (Exception e) {
                Log.e(TAG, "partage", e);
            }
        }

        @JavascriptInterface
        public void shareText(String text) {
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("text/plain");
            send.putExtra(Intent.EXTRA_TEXT, text);
            runOnUiThread(() -> startActivity(Intent.createChooser(send, null)));
        }
    }

    /** « rgb(244, 239, 232) » ou « rgba(…) » -> couleur Android (0 si illisible). */
    static int parseCss(String css) {
        try {
            String in = css.substring(css.indexOf('(') + 1, css.indexOf(')'));
            String[] p = in.split("[,\\s/]+");
            int r = Math.round(Float.parseFloat(p[0])), g = Math.round(Float.parseFloat(p[1])), b = Math.round(Float.parseFloat(p[2]));
            return Color.rgb(r, g, b);
        } catch (Exception e) { return 0; }
    }
}

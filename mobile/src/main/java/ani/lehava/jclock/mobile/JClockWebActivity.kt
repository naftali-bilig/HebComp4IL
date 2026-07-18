package ani.lehava.jclock.mobile

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.net.http.SslError
import android.os.Build
import android.os.Bundle
import android.os.Message
import android.view.Gravity
import android.view.View
import android.webkit.CookieManager
import android.webkit.GeolocationPermissions
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.SafeBrowsingResponse
import android.webkit.SslErrorHandler
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import ani.lehava.jclock.mobile.music.MelodyPlaybackController
import ani.lehava.jclock.mobile.music.MelodyPlaybackService

class JClockWebActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private lateinit var progress: ProgressBar
    private lateinit var backButton: Button
    private lateinit var mobileUserAgent: String
    private var isSefariaDesktopPresentation = false
    private var pendingGeoOrigin: String? = null
    private var pendingGeoCallback: GeolocationPermissions.Callback? = null

    private val locationPermission = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions(),
    ) {
        val granted = hasLocationPermission()
        val origin = pendingGeoOrigin
        val callback = pendingGeoCallback
        pendingGeoOrigin = null
        pendingGeoCallback = null
        if (origin != null && callback != null) {
            callback.invoke(origin, granted, false)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        window.statusBarColor = Color.rgb(31, 52, 69)

        webView = WebView(this)
        progress = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            max = 100
            visibility = View.GONE
        }
        backButton = toolbarButton("חזרה") {
            goBackOrFinish()
        }

        configureWebView()
        webView.addJavascriptInterface(BackgroundAudioBridge(), "JClockAudio")
        setContentView(buildContent())

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                goBackOrFinish()
            }
        })

        val restored = state != null && webView.restoreState(state) != null
        if (!restored) loadRequestedUrl(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        loadRequestedUrl(intent)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        pendingGeoCallback?.let { callback ->
            pendingGeoOrigin?.let { origin -> callback.invoke(origin, false, false) }
        }
        pendingGeoCallback = null
        pendingGeoOrigin = null
        webView.stopLoading()
        webView.removeAllViews()
        webView.destroy()
        super.onDestroy()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val isDebuggable = applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0
        val versionName = packageManager.getPackageInfo(packageName, 0).versionName ?: "unknown"
        WebView.setWebContentsDebuggingEnabled(isDebuggable)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            WebView.startSafeBrowsing(this) { }
        }

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            setGeolocationEnabled(true)
            allowFileAccess = false
            allowContentAccess = false
            allowFileAccessFromFileURLs = false
            allowUniversalAccessFromFileURLs = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            safeBrowsingEnabled = true
            setSupportMultipleWindows(true)
            javaScriptCanOpenWindowsAutomatically = false
            mediaPlaybackRequiresUserGesture = true
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            mobileUserAgent = "$userAgentString JClockAndroid/$versionName"
            userAgentString = mobileUserAgent
            useWideViewPort = false
            loadWithOverviewMode = false
        }

        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(webView, false)
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean =
                handleNavigation(request.url)

            @Deprecated("Deprecated in Android")
            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean =
                handleNavigation(Uri.parse(url))

            override fun onPageStarted(view: WebView, url: String?, favicon: android.graphics.Bitmap?) {
                progress.visibility = View.VISIBLE
                updateNavigation()
            }

            override fun onPageFinished(view: WebView, url: String?) {
                progress.visibility = View.GONE
                updateNavigation()
                val pageUri = url?.let(Uri::parse)
                if (pageUri != null && isSefariaHost(pageUri.host)) {
                    installSefariaCopyMode(view)
                } else if (pageUri != null && isLegacyClockLearningPage(pageUri)) {
                    installLegacyClockMobileMode(view)
                }
            }

            override fun doUpdateVisitedHistory(view: WebView, url: String?, isReload: Boolean) {
                updateNavigation()
            }

            override fun onReceivedSslError(
                view: WebView?,
                handler: SslErrorHandler,
                error: SslError?,
            ) {
                handler.cancel()
                toast("החיבור נחסם כי אישור האבטחה אינו תקין")
            }

            override fun onSafeBrowsingHit(
                view: WebView,
                request: WebResourceRequest,
                threatType: Int,
                callback: SafeBrowsingResponse,
            ) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                    callback.backToSafety(true)
                } else {
                    view.stopLoading()
                }
                toast("העמוד נחסם על ידי הגנת הגלישה הבטוחה")
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView, newProgress: Int) {
                progress.progress = newProgress
                progress.visibility = if (newProgress >= 100) View.GONE else View.VISIBLE
            }

            override fun onGeolocationPermissionsShowPrompt(
                origin: String,
                callback: GeolocationPermissions.Callback,
            ) {
                if (!isSecureOrigin(origin)) {
                    callback.invoke(origin, false, false)
                    return
                }

                if (!isTrustedOrigin(origin)) {
                    callback.invoke(origin, false, false)
                    return
                }

                grantGeolocation(origin, callback)
            }

            override fun onGeolocationPermissionsHidePrompt() {
                pendingGeoCallback = null
                pendingGeoOrigin = null
            }

            override fun onPermissionRequest(request: PermissionRequest) {
                request.deny()
            }

            override fun onCreateWindow(
                view: WebView,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: Message,
            ): Boolean {
                if (!isUserGesture) return false
                val transport = resultMsg.obj as? WebView.WebViewTransport ?: return false
                val popup = WebView(this@JClockWebActivity)
                popup.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        view: WebView,
                        request: WebResourceRequest,
                    ): Boolean = redirectPopup(popup, request.url)

                    @Deprecated("Deprecated in Android")
                    override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean =
                        redirectPopup(popup, Uri.parse(url))
                }
                transport.webView = popup
                resultMsg.sendToTarget()
                return true
            }
        }
    }

    private fun grantGeolocation(
        origin: String,
        callback: GeolocationPermissions.Callback,
    ) {
        if (hasLocationPermission()) {
            callback.invoke(origin, true, false)
            return
        }

        pendingGeoCallback?.let { previous ->
            pendingGeoOrigin?.let { previousOrigin ->
                previous.invoke(previousOrigin, false, false)
            }
        }
        pendingGeoOrigin = origin
        pendingGeoCallback = callback
        locationPermission.launch(
            arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
            ),
        )
    }

    private fun redirectPopup(popup: WebView, uri: Uri): Boolean {
        if (uri.toString() == "about:blank") return false
        popup.stopLoading()
        popup.destroy()
        val target = allowedNavigationTarget(uri)
        if (target != null) {
            loadInWebView(target)
        } else {
            toast("הקישור נחסם משום שאינו ברשימת האתרים המאושרים באפליקציה")
        }
        return true
    }

    private fun buildContent(): View {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutDirection = View.LAYOUT_DIRECTION_RTL
            setBackgroundColor(Color.WHITE)
        }
        root.addView(
            progress,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(3)),
        )
        root.addView(
            webView,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f),
        )
        root.addView(buildToolbar())
        return root
    }

    private fun buildToolbar(): View = LinearLayout(this).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL
        setPadding(dp(6), dp(4), dp(6), dp(4))
        setBackgroundColor(Color.rgb(31, 52, 69))

        addView(backButton)
        addView(toolbarButton("בית") { loadInWebView(Uri.parse(HOME_URL)) })
        addView(toolbarButton("ChatGPT") { loadInWebView(Uri.parse(CHATGPT_URL)) })
        addView(ImageView(this@JClockWebActivity).apply {
            setImageResource(R.drawable.hebrew_clock_logo_big)
            contentDescription = "ThirdTempale"
            scaleType = ImageView.ScaleType.CENTER_CROP
        }, LinearLayout.LayoutParams(0, dp(48), 1f))
        addView(toolbarButton("רענן") { webView.reload() })
        addView(toolbarButton("הגדרות") {
            startActivity(Intent(this@JClockWebActivity, MainActivity::class.java))
        })
    }

    private fun toolbarButton(label: String, action: () -> Unit) = Button(this).apply {
        text = label
        textSize = 12f
        isAllCaps = false
        minWidth = 0
        minimumWidth = 0
        setPadding(dp(7), 0, dp(7), 0)
        setOnClickListener { action() }
    }

    private fun loadRequestedUrl(source: Intent) {
        val target = source.getStringExtra(EXTRA_URL)
            ?.let(Uri::parse)
            ?.let(::allowedNavigationTarget)
            ?: Uri.parse(HOME_URL)
        loadInWebView(target)
    }

    private fun handleNavigation(uri: Uri): Boolean {
        val target = allowedNavigationTarget(uri)?.let(::localizeLegacyLearningTarget)
        if (target != null) {
            val needsPresentationChange =
                isSefariaDesktopPresentation != isSefariaHost(target.host)
            if (target == uri && !needsPresentationChange) return false
            loadInWebView(target)
            return true
        }
        toast("הקישור נחסם משום שאינו ברשימת האתרים המאושרים באפליקציה")
        return true
    }

    private fun allowedNavigationTarget(uri: Uri): Uri? {
        if (uri.toString() == "about:blank") return uri
        val host = uri.host?.lowercase()
        val scheme = uri.scheme?.lowercase()

        if (host in LEGACY_RABBI_ELON_HOSTS && (scheme == "http" || scheme == "https")) {
            return Uri.parse(RABBI_ELON_URL)
        }
        if (!isAllowedHost(host)) return null
        return when (scheme) {
            "https" -> uri
            "http" -> uri.buildUpon().scheme("https").build()
            else -> null
        }
    }

    private fun isSecureOrigin(origin: String): Boolean {
        val uri = runCatching { Uri.parse(origin) }.getOrNull() ?: return false
        return uri.scheme.equals("https", ignoreCase = true) && !uri.host.isNullOrBlank()
    }

    private fun isTrustedOrigin(origin: String): Boolean {
        val uri = runCatching { Uri.parse(origin) }.getOrNull() ?: return false
        return uri.scheme.equals("https", ignoreCase = true) && isTrustedHost(uri.host)
    }

    private fun isTrustedHost(host: String?): Boolean = host?.lowercase() in TRUSTED_HOSTS

    private fun isAllowedHost(host: String?): Boolean = host?.lowercase() in ALLOWED_HOSTS

    private fun isSefariaHost(host: String?): Boolean = host?.lowercase() in SEFARIA_HOSTS

    private fun isLegacyClockHost(host: String?): Boolean =
        host.equals(LEGACY_CLOCK_HOST, ignoreCase = true)

    private fun isLegacyClockLearningPage(uri: Uri): Boolean =
        isLegacyClockHost(uri.host) && uri.path.orEmpty().lowercase().contains("/me/")

    private fun localizeLegacyLearningTarget(target: Uri): Uri {
        if (!isLegacyClockHost(target.host)) return target
        val sourcePath = webView.url
            ?.let(Uri::parse)
            ?.path
            .orEmpty()
            .lowercase()
        val targetPath = target.path.orEmpty()
        if (!sourcePath.contains("/simple/") || !targetPath.lowercase().contains("/me/en/")) {
            return target
        }
        return target.buildUpon()
            .path(targetPath.replace("/me/en/", "/me/he/", ignoreCase = true))
            .build()
    }

    private fun loadInWebView(uri: Uri) {
        configurePresentationFor(uri)
        webView.loadUrl(uri.toString())
    }

    private fun configurePresentationFor(uri: Uri) {
        val showDesktopSefaria = isSefariaHost(uri.host)
        if (showDesktopSefaria == isSefariaDesktopPresentation) return
        isSefariaDesktopPresentation = showDesktopSefaria
        webView.settings.apply {
            // Sefaria intentionally uses its desktop layout for multi-segment copying.
            // JClock and every other approved source return to the Android mobile layout.
            userAgentString = if (showDesktopSefaria) DESKTOP_USER_AGENT else mobileUserAgent
            useWideViewPort = showDesktopSefaria
            loadWithOverviewMode = showDesktopSefaria
        }
    }

    private fun goBackOrFinish() {
        if (!webView.canGoBack()) {
            finish()
            return
        }
        val history = webView.copyBackForwardList()
        val previous = history.getItemAtIndex(history.currentIndex - 1)?.url
        previous?.let(Uri::parse)?.let(::configurePresentationFor)
        webView.goBack()
    }

    private fun installLegacyClockMobileMode(view: WebView) {
        view.evaluateJavascript(
            """
            (() => {
                let viewport = document.querySelector('meta[name="viewport"]');
                if (!viewport) {
                    viewport = document.createElement('meta');
                    viewport.name = 'viewport';
                    document.head.appendChild(viewport);
                }
                viewport.content = 'width=device-width, initial-scale=1.0';

                let style = document.getElementById('thirdtempale-legacy-mobile');
                if (!style) {
                    style = document.createElement('style');
                    style.id = 'thirdtempale-legacy-mobile';
                    document.head.appendChild(style);
                }
                style.textContent = `
                    html, body, #container {
                        width: 100% !important;
                        max-width: 100% !important;
                        box-sizing: border-box !important;
                        overflow-x: hidden !important;
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                    }
                    #container > div, #container table {
                        max-width: 100% !important;
                        box-sizing: border-box !important;
                    }
                    #container table { width: 100% !important; }
                    .dropdown {
                        background-size: 100% 100% !important;
                        background-position: center !important;
                        background-repeat: no-repeat !important;
                    }
                    .day, .month, .year, .yovel {
                        width: 100% !important;
                        max-width: 100% !important;
                        box-sizing: border-box !important;
                        font-size: clamp(20px, 6.5vw, 34px) !important;
                    }
                    .clock {
                        font-size: clamp(32px, 12vw, 58px) !important;
                        box-sizing: border-box !important;
                    }
                    #Hour, #Second { width: 18% !important; }
                    #Text2, #Text4 { width: 8% !important; }
                    #Minute { width: 36% !important; }
                    #stop {
                        max-width: 60% !important;
                        font-size: clamp(32px, 12vw, 58px) !important;
                    }
                    .masechet-split {
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    img, iframe, video {
                        max-width: 100% !important;
                        height: auto;
                    }
                `;
            })();
            """.trimIndent(),
            null,
        )
    }

    private fun installSefariaCopyMode(view: WebView) {
        view.evaluateJavascript(
            """
            (() => {
                if (document.getElementById('jclock-copy-toggle')) return;
                const style = document.createElement('style');
                style.id = 'jclock-copy-style';
                style.textContent = `
                    #jclock-copy-toggle {
                        position: fixed; left: 16px; bottom: 16px; z-index: 2147483647;
                        border: 0; border-radius: 22px; padding: 10px 15px;
                        background: #1f3445; color: white; font: 600 14px Arial, sans-serif;
                        box-shadow: 0 2px 10px rgba(0,0,0,.3); direction: rtl;
                    }
                    html.jclock-copy-mode .segmentText {
                        outline: 2px solid rgba(31,52,69,.35); outline-offset: 3px;
                        cursor: copy; -webkit-user-select: text !important; user-select: text !important;
                    }
                    html.jclock-copy-mode .segmentText.jclock-copy-selected {
                        outline-color: #1f3445; background: rgba(94,190,210,.22) !important;
                    }
                `;
                document.head.appendChild(style);

                const button = document.createElement('button');
                button.id = 'jclock-copy-toggle';
                button.type = 'button';
                button.textContent = 'בחירת קטעים';
                button.setAttribute('aria-pressed', 'false');
                document.body.appendChild(button);

                let enabled = false;
                const selected = new Set();

                const setEnabled = value => {
                    enabled = value;
                    document.documentElement.classList.toggle('jclock-copy-mode', enabled);
                    button.setAttribute('aria-pressed', String(enabled));
                    button.textContent = enabled ? 'בחר קטעים (0)' : 'בחירת קטעים';
                };

                const copyText = async text => {
                    try {
                        await navigator.clipboard.writeText(text);
                    } catch (_) {
                        const area = document.createElement('textarea');
                        area.value = text;
                        area.style.position = 'fixed';
                        area.style.opacity = '0';
                        document.body.appendChild(area);
                        area.select();
                        document.execCommand('copy');
                        area.remove();
                    }
                };

                button.addEventListener('click', async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!enabled) {
                        setEnabled(true);
                        return;
                    }
                    if (selected.size === 0) {
                        setEnabled(false);
                        return;
                    }

                    const orderedSegments = Array.from(document.querySelectorAll('.segmentText'))
                        .filter(segment => selected.has(segment));
                    const text = orderedSegments
                        .map(segment => segment.innerText.trim())
                        .filter(Boolean)
                        .join('\n\n');
                    await copyText(text);
                    const copiedCount = orderedSegments.length;
                    selected.forEach(segment => segment.classList.remove('jclock-copy-selected'));
                    selected.clear();
                    setEnabled(false);
                    button.textContent = copiedCount + ' קטעים הועתקו';
                    setTimeout(() => {
                        if (!enabled) button.textContent = 'בחירת קטעים';
                    }, 1300);
                });

                document.addEventListener('click', event => {
                    if (!enabled) return;
                    const segment = event.target.closest('.segmentText');
                    if (!segment) return;
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    if (selected.has(segment)) {
                        selected.delete(segment);
                        segment.classList.remove('jclock-copy-selected');
                    } else {
                        selected.add(segment);
                        segment.classList.add('jclock-copy-selected');
                    }
                    button.textContent = 'העתק ' + selected.size + ' קטעים';
                }, true);
            })();
            """.trimIndent(),
            null,
        )
    }

    private fun hasLocationPermission(): Boolean =
        ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED

    private fun updateNavigation() {
        backButton.isEnabled = webView.canGoBack()
        backButton.alpha = if (backButton.isEnabled) 1f else 0.55f
    }

    private fun toast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    private inner class BackgroundAudioBridge {
        @JavascriptInterface
        fun startBackgroundAudio(sourceUrl: String, positionMillis: Int, volumePercent: Int) {
            val source = allowedYoumToveSource(sourceUrl)
            if (source == null) {
                runOnUiThread { toast("מקור הסרטון אינו מאושר ליום-טיוב") }
                return
            }
            runOnUiThread {
                MelodyPlaybackController.setVolume(
                    this@JClockWebActivity,
                    volumePercent.coerceIn(0, 100),
                )
                MelodyPlaybackController.playLocal(
                    this@JClockWebActivity,
                    source,
                    "יום-טיוב",
                    positionMillis.coerceAtLeast(0),
                )
            }
        }

        @JavascriptInterface
        fun backgroundPositionMillis(): Int = MelodyPlaybackService.currentLocalPositionMillis()

        @JavascriptInterface
        fun stopBackgroundAudio() {
            runOnUiThread { MelodyPlaybackController.stopLocal(this@JClockWebActivity) }
        }
    }

    private fun allowedYoumToveSource(value: String): Uri? {
        val uri = runCatching { Uri.parse(value) }.getOrNull() ?: return null
        if (!uri.scheme.equals("https", ignoreCase = true) || uri.userInfo != null) return null
        val host = uri.host?.lowercase() ?: return null
        val path = uri.path.orEmpty()
        val localMedia = host in TRUSTED_HOSTS && path.startsWith("/apps/youmtove/media/")
        val tuningLimud = host == TUNING_LIBRARY_HOST && path.startsWith("/TuningLimud/")
        if ((!localMedia && !tuningLimud) || !path.endsWith(".mp4", ignoreCase = true)) return null
        return uri
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    companion object {
        private const val HOME_URL = "https://jclock.net/"
        private const val CHATGPT_URL = "https://chatgpt.com/"
        private const val RABBI_ELON_URL = "https://haravelon.co.il/"
        private const val LEGACY_CLOCK_HOST = "jclock126.web.app"
        private const val TUNING_LIBRARY_HOST = "pub-71e18ce829fd428ea6d4aa9498a7e642.r2.dev"
        private const val DESKTOP_USER_AGENT =
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        private const val EXTRA_URL = "ani.lehava.jclock.extra.URL"
        private val TRUSTED_HOSTS = setOf(
            "jclock.net",
            "www.jclock.net",
            LEGACY_CLOCK_HOST,
        )
        private val SEFARIA_HOSTS = setOf(
            "sefaria.org",
            "www.sefaria.org",
            "sefaria.org.il",
            "www.sefaria.org.il",
        )
        private val ALLOWED_HOSTS = TRUSTED_HOSTS + SEFARIA_HOSTS + setOf(
            "929.org.il",
            "www.929.org.il",
            "haravelon.co.il",
            "www.haravelon.co.il",
            "ceves.net",
            "www.ceves.net",
            "tuning-mg.com",
            "www.tuning-mg.com",
            "counting-the-omer.wixsite.com",
            "play.google.com",
            "apps.apple.com",
            "world-coin.ai",
            "www.world-coin.ai",
            "shilat-medical.web.app",
            "chatgpt.com",
            "www.chatgpt.com",
            "chat.openai.com",
            "auth.openai.com",
            "auth0.openai.com",
            "login.openai.com",
        )
        private val LEGACY_RABBI_ELON_HOSTS = setOf(
            "ravoldsite.com",
            "www.ravoldsite.com",
        )

        fun intent(context: Context, url: String = HOME_URL): Intent =
            Intent(context, JClockWebActivity::class.java).putExtra(EXTRA_URL, url)
    }
}

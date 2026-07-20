package ani.lehava.jclock.mobile

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.res.ColorStateList
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
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.GeolocationPermissions
import android.webkit.PermissionRequest
import android.webkit.SafeBrowsingResponse
import android.webkit.SslErrorHandler
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

class JClockWebActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private lateinit var progress: ProgressBar
    private lateinit var backButton: Button
    private lateinit var contentRoot: LinearLayout
    private lateinit var toolbar: LinearLayout
    private lateinit var mobileUserAgent: String
    private var isDesktopPresentation = false
    private var activeAppHost: String? = null
    private var pendingGeoOrigin: String? = null
    private var pendingGeoCallback: GeolocationPermissions.Callback? = null
    private val registryExecutor = Executors.newSingleThreadExecutor()

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
        registryExecutor.shutdownNow()
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
                val pageUri = url?.let(Uri::parse)
                updateActiveAppMode(pageUri)
                applyNativePageTheme(pageUri)
                progress.visibility = View.VISIBLE
                updateNavigation()
            }

            override fun onPageFinished(view: WebView, url: String?) {
                progress.visibility = View.GONE
                updateNavigation()
                val pageUri = url?.let(Uri::parse)
                if (pageUri != null && isBirthCalculatorPage(pageUri)) {
                    installBirthCalculatorUmidTheme(view)
                } else if (pageUri != null && isSefariaHost(pageUri.host)) {
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
        contentRoot = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutDirection = View.LAYOUT_DIRECTION_RTL
            setBackgroundColor(Color.WHITE)
        }
        ViewCompat.setOnApplyWindowInsetsListener(contentRoot) { view, insets ->
            val statusBars = insets.getInsets(WindowInsetsCompat.Type.statusBars())
            view.setPadding(statusBars.left, statusBars.top + dp(8), statusBars.right, 0)
            insets
        }
        contentRoot.addView(
            progress,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(3)),
        )
        toolbar = buildToolbar()
        contentRoot.addView(toolbar)
        contentRoot.addView(
            webView,
            LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f),
        )
        return contentRoot
    }

    private fun buildToolbar(): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL
        setPadding(dp(6), dp(4), dp(6), dp(4))
        setBackgroundColor(Color.rgb(31, 52, 69))

        addView(backButton)
        addView(toolbarButton("בית") { loadInWebView(Uri.parse(HOME_URL)) })
        addView(toolbarButton("Apps") { showAppsMenu() })
        addView(buildDrawingShortcuts(), LinearLayout.LayoutParams(0, dp(48), 1f))
        addView(toolbarButton("רענן") { webView.reload() })
        addView(toolbarButton("ניגון מכוון") {
            startActivity(Intent(this@JClockWebActivity, MainActivity::class.java))
        })
    }

    /**
     * The drawing itself is the control: the three transparent hit areas follow
     * the sun, moon/blue center, and rainbow from left to right. No visual
     * buttons are added on top of the artwork.
     */
    private fun buildDrawingShortcuts(): View = FrameLayout(this).apply {
        addView(
            ImageView(this@JClockWebActivity).apply {
                setImageResource(R.drawable.hebrew_clock_logo_big)
                contentDescription = null
                importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_NO
                scaleType = ImageView.ScaleType.FIT_XY
            },
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
            ),
        )

        addView(
            LinearLayout(this@JClockWebActivity).apply {
                orientation = LinearLayout.HORIZONTAL
                layoutDirection = View.LAYOUT_DIRECTION_LTR
                addView(drawingHotspot("השמש") { openCustomYouTube("sun") }, hotspotLayout())
                addView(drawingHotspot("הירח") { openCustomYouTube("moon") }, hotspotLayout())
                addView(drawingHotspot("הקשת") { openCustomYouTube("rainbow") }, hotspotLayout())
            },
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
            ),
        )
    }

    private fun drawingHotspot(symbol: String, action: () -> Unit) = View(this).apply {
        contentDescription = "פתח את CustomYouTube דרך סמל $symbol"
        tooltipText = "CustomYouTube · $symbol"
        isClickable = true
        isFocusable = true
        setBackgroundColor(Color.TRANSPARENT)
        setOnClickListener { action() }
    }

    private fun hotspotLayout() = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.MATCH_PARENT, 1f)

    private fun openCustomYouTube(source: String) {
        startActivity(
            Intent(this, CustomYouTubeActivity::class.java)
                .putExtra(CustomYouTubeActivity.EXTRA_SHORTCUT_SOURCE, source),
        )
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

    private fun showAppsMenu() {
        val labels = APPS.map { it.label }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle("Apps")
            .setItems(labels) { _, index -> openApp(APPS[index]) }
            .setNegativeButton("ביטול", null)
            .show()
    }

    private fun openApp(app: AppDestination) {
        if (app.externalPackages.isNotEmpty()) {
            activeAppHost = null
            updateAppCookiePolicy()
            openExternalApp(app)
            return
        }
        if (app.host == NEED_ME_HOST) {
            authorizeNeedMe(app)
            return
        }
        openWebApp(app)
    }

    private fun openWebApp(app: AppDestination) {
        activeAppHost = app.host
        updateAppCookiePolicy()
        loadInWebView(Uri.parse(app.url))
    }

    private fun authorizeNeedMe(app: AppDestination) {
        val umid = getSharedPreferences(UMID_PREFERENCES, MODE_PRIVATE)
            .getString(UMID_KEY, "")
            ?.trim()
            ?.uppercase()
            .orEmpty()
        if (!UMID_PATTERN.matches(umid)) {
            toast("יש להזין תחילה UMID תקין באזור האישי")
            return
        }

        val preferences = getSharedPreferences(NEED_ME_PREFERENCES, MODE_PRIVATE)
        val storedFingerprint = preferences.getString(NEED_ME_FINGERPRINT_KEY, null)
        if (storedFingerprint != null) {
            validateNeedMeIdentifier(app, storedFingerprint, clearIfRejected = true)
            return
        }

        val input = EditText(this).apply {
            hint = "ID / eID"
            isSingleLine = true
            textDirection = View.TEXT_DIRECTION_LTR
        }
        AlertDialog.Builder(this)
            .setTitle("אימות גישה ל־Need-Me")
            .setMessage("ה־UMID תקין. כעת יש להזין מזהה הרשום במאגר Bind-Me.")
            .setView(input)
            .setNegativeButton("ביטול", null)
            .setPositiveButton("אימות") { _, _ ->
                val identifier = input.text.toString()
                if (NeedMeRegistry.normalize(identifier).isEmpty()) {
                    toast("לא הוזן מזהה")
                } else {
                    validateNeedMeIdentifier(
                        app,
                        NeedMeRegistry.fingerprint(identifier),
                        clearIfRejected = false,
                    )
                }
            }
            .show()
    }

    private fun validateNeedMeIdentifier(
        app: AppDestination,
        fingerprint: String,
        clearIfRejected: Boolean,
    ) {
        toast("בודק הרשאה…")
        registryExecutor.execute {
            val result = runCatching {
                val identifiers = NeedMeRegistry.identifiers(downloadMarriageDatabase())
                check(identifiers.isNotEmpty()) { "Empty identifier registry" }
                identifiers.any { NeedMeRegistry.fingerprint(it) == fingerprint }
            }
            runOnUiThread {
                result.fold(
                    onSuccess = { allowed ->
                        if (allowed) {
                            getSharedPreferences(NEED_ME_PREFERENCES, MODE_PRIVATE)
                                .edit()
                                .putString(NEED_ME_FINGERPRINT_KEY, fingerprint)
                                .apply()
                            openWebApp(app)
                        } else {
                            if (clearIfRejected) {
                                getSharedPreferences(NEED_ME_PREFERENCES, MODE_PRIVATE)
                                    .edit()
                                    .remove(NEED_ME_FINGERPRINT_KEY)
                                    .apply()
                            }
                            toast("המזהה אינו רשום במאגר")
                        }
                    },
                    onFailure = { toast("לא ניתן לאמת כעת מול Bind-Me") },
                )
            }
        }
    }

    private fun downloadMarriageDatabase(): String {
        val connection = URL(MARRIAGE_DB_URL).openConnection() as HttpURLConnection
        connection.connectTimeout = 10_000
        connection.readTimeout = 10_000
        connection.instanceFollowRedirects = false
        connection.setRequestProperty("Accept", "application/javascript,text/javascript")
        connection.setRequestProperty("User-Agent", mobileUserAgent)
        return try {
            check(connection.responseCode == HttpURLConnection.HTTP_OK) {
                "HTTP ${connection.responseCode}"
            }
            check(connection.contentLengthLong in -1..MAX_REGISTRY_BYTES) { "Registry too large" }
            connection.inputStream.bufferedReader(Charsets.UTF_8).use { reader ->
                val text = reader.readText()
                check(text.toByteArray(Charsets.UTF_8).size <= MAX_REGISTRY_BYTES) {
                    "Registry too large"
                }
                text
            }
        } finally {
            connection.disconnect()
        }
    }

    private fun openExternalApp(app: AppDestination) {
        val launchIntent = app.externalPackages.firstNotNullOfOrNull { packageName ->
            packageManager.getLaunchIntentForPackage(packageName)
        }
        if (launchIntent != null) {
            startActivity(launchIntent)
            return
        }

        val storePackage = app.externalPackages.first()
        val marketIntent = Intent(
            Intent.ACTION_VIEW,
            Uri.parse("market://details?id=$storePackage"),
        ).setPackage("com.android.vending")
        runCatching { startActivity(marketIntent) }.getOrElse {
            startActivity(
                Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse("https://play.google.com/store/apps/details?id=$storePackage"),
                ),
            )
        }
    }

    private fun loadRequestedUrl(source: Intent) {
        val requested = source.getStringExtra(EXTRA_URL)?.let(Uri::parse)
        if (requested?.host.equals(NEED_ME_HOST, ignoreCase = true) ||
            requested?.host.equals("www.$NEED_ME_HOST", ignoreCase = true)
        ) {
            authorizeNeedMe(NEED_ME_APP)
            return
        }
        val target = requested?.let(::allowedNavigationTarget) ?: Uri.parse(HOME_URL)
        loadInWebView(target)
    }

    private fun handleNavigation(uri: Uri): Boolean {
        if (uri.host.equals(NEED_ME_HOST, ignoreCase = true) ||
            uri.host.equals("www.$NEED_ME_HOST", ignoreCase = true)
        ) {
            if (activeAppHost != NEED_ME_HOST) authorizeNeedMe(NEED_ME_APP)
            return activeAppHost != NEED_ME_HOST
        }
        val target = allowedNavigationTarget(uri)?.let(::localizeLegacyLearningTarget)
        if (target != null) {
            val needsPresentationChange =
                isDesktopPresentation != shouldUseDesktopPresentation(target)
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

        activeAppHost?.let { appHost ->
            val app = APPS.firstOrNull { it.host == appHost } ?: return null
            if (scheme != "https" || host !in app.navigationHosts) return null
            return uri
        }

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

    private fun isBirthCalculatorPage(uri: Uri): Boolean {
        val host = uri.host.orEmpty().lowercase()
        val path = uri.path.orEmpty().lowercase()
        return host.contains("birthcalculator") || path.contains("/birthcalculator/")
    }

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
        updateActiveAppMode(uri)
        configurePresentationFor(uri)
        webView.loadUrl(uri.toString())
    }

    private fun updateActiveAppMode(uri: Uri?) {
        val host = uri?.host?.lowercase()
        val selectedApp = APPS.firstOrNull { it.host == host }
        val currentApp = APPS.firstOrNull { it.host == activeAppHost }
        activeAppHost = when {
            selectedApp != null -> selectedApp.host
            currentApp != null && host in currentApp.navigationHosts -> currentApp.host
            else -> null
        }
        updateAppCookiePolicy()
    }

    private fun updateAppCookiePolicy() {
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false)
    }

    private fun configurePresentationFor(uri: Uri) {
        val showDesktop = shouldUseDesktopPresentation(uri)
        if (showDesktop == isDesktopPresentation) return
        isDesktopPresentation = showDesktop
        webView.settings.apply {
            // Sefaria needs its desktop layout for multi-segment copying.
            userAgentString = if (showDesktop) DESKTOP_USER_AGENT else mobileUserAgent
            useWideViewPort = showDesktop
            loadWithOverviewMode = showDesktop
        }
    }

    private fun shouldUseDesktopPresentation(uri: Uri): Boolean =
        isSefariaHost(uri.host)

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

    private fun currentUmid(): String? =
        getSharedPreferences(UMID_PREFERENCES, MODE_PRIVATE)
            .getString(UMID_KEY, "")
            ?.trim()
            ?.uppercase()
            ?.takeIf(UMID_PATTERN::matches)

    private fun applyNativePageTheme(uri: Uri?) {
        val umid = currentUmid()
        if (uri == null || !isBirthCalculatorPage(uri) || umid == null) {
            contentRoot.setBackgroundColor(Color.WHITE)
            webView.setBackgroundColor(Color.WHITE)
            toolbar.setBackgroundColor(DEFAULT_TOOLBAR_COLOR)
            styleToolbarButtons(DEFAULT_BUTTON_BACKGROUND, Color.BLACK)
            window.statusBarColor = DEFAULT_TOOLBAR_COLOR
            window.navigationBarColor = Color.BLACK
            return
        }

        val generalBackground = Color.parseColor("#${umid.substring(6, 12)}")
        val buttonText = Color.parseColor("#${umid.substring(12, 18)}")
        val buttonBackground = Color.parseColor("#${umid.substring(18, 24)}")
        contentRoot.setBackgroundColor(generalBackground)
        webView.setBackgroundColor(generalBackground)
        toolbar.setBackgroundColor(generalBackground)
        styleToolbarButtons(buttonBackground, buttonText)
        window.statusBarColor = generalBackground
        window.navigationBarColor = generalBackground
    }

    private fun styleToolbarButtons(background: Int, text: Int) {
        fun style(view: View) {
            if (view is Button) {
                view.backgroundTintList = ColorStateList.valueOf(background)
                view.setTextColor(text)
            }
            if (view is ViewGroup) {
                for (index in 0 until view.childCount) style(view.getChildAt(index))
            }
        }
        style(toolbar)
    }

    private fun installBirthCalculatorUmidTheme(view: WebView) {
        val umid = currentUmid() ?: return
        val generalText = "#${umid.substring(0, 6)}"
        val generalBackground = "#${umid.substring(6, 12)}"
        val buttonText = "#${umid.substring(12, 18)}"
        val buttonBackground = "#${umid.substring(18, 24)}"
        view.evaluateJavascript(
            """
            (() => {
                let style = document.getElementById('jclock-umid-full-theme');
                if (!style) {
                    style = document.createElement('style');
                    style.id = 'jclock-umid-full-theme';
                    document.head.appendChild(style);
                }
                style.textContent = `
                    html, body, .container, .container-fluid,
                    .modal-content, .modal-header, .modal-body, .modal-footer,
                    .timezone-preview, .color-preview, .umid-panel, .db-share {
                        background-color: $generalBackground !important;
                        color: $generalText !important;
                    }
                    body, body p, body span, body label, body h1, body h2,
                    body h3, body h4, body h5, body h6,
                    body .timezone-hint, body .privacy-note, body .color-preview-value {
                        color: $generalText !important;
                    }
                    body input, body select, body textarea {
                        background-color: $generalBackground !important;
                        border-color: $generalText !important;
                        color: $generalText !important;
                    }
                    body button, body .btn, body input[type='button'],
                    body input[type='submit'] {
                        background-color: $buttonBackground !important;
                        border-color: $buttonText !important;
                        color: $buttonText !important;
                    }
                    body a, body a:visited { color: $generalText !important; }
                    body hr { border-color: $generalText !important; opacity: .45; }
                `;
                document.documentElement.style.backgroundColor = '$generalBackground';
                document.documentElement.style.color = '$generalText';
                document.body.style.backgroundColor = '$generalBackground';
                document.body.style.color = '$generalText';
            })();
            """.trimIndent(),
            null,
        )
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

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    companion object {
        private data class AppDestination(
            val label: String,
            val url: String,
            val host: String,
            val navigationHosts: Set<String> = setOf(host),
            val externalPackages: List<String> = emptyList(),
        )

        private const val HOME_URL = "https://jclock.net/"
        private const val NEED_ME_HOST = "need-me.net"
        private const val MARRIAGE_DB_URL = "https://bind-me.net/MarrigeDB.js"
        private const val NEED_ME_PREFERENCES = "need-me-access"
        private const val NEED_ME_FINGERPRINT_KEY = "approved-identifier-sha256"
        private const val MAX_REGISTRY_BYTES = 2_000_000L
        private const val WHATSAPP_WEB_HOST = "web.whatsapp.com"
        private const val RABBI_ELON_URL = "https://haravelon.co.il/"
        private const val LEGACY_CLOCK_HOST = "jclock126.web.app"
        private const val DESKTOP_USER_AGENT =
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        private const val EXTRA_URL = "ani.lehava.jclock.extra.URL"
        private const val UMID_PREFERENCES = "jclock-personal"
        private const val UMID_KEY = "umid"
        private val UMID_PATTERN = Regex("[0-9A-F]{24}")
        private val DEFAULT_TOOLBAR_COLOR = Color.rgb(31, 52, 69)
        private val DEFAULT_BUTTON_BACKGROUND = Color.rgb(238, 238, 238)
        private val NEED_ME_APP = AppDestination(
            "Need-Me",
            "https://need-me.net/",
            NEED_ME_HOST,
            navigationHosts = setOf(NEED_ME_HOST, "www.need-me.net"),
        )
        private val APPS = listOf(
            NEED_ME_APP,
            AppDestination("התבודדות", "https://chatgpt.com/", "chatgpt.com"),
            AppDestination("נקדן", "https://nakdan.dicta.org.il/", "nakdan.dicta.org.il"),
            AppDestination(
                "תפילה",
                "https://suno.com/me",
                "suno.com",
                externalPackages = listOf("com.suno.android"),
            ),
            AppDestination(
                "חברים",
                "https://web.whatsapp.com/",
                WHATSAPP_WEB_HOST,
                externalPackages = listOf("com.whatsapp", "com.whatsapp.w4b"),
            ),
            AppDestination(
                "ריקודים",
                "https://kling.ai/",
                "kling.ai",
                externalPackages = listOf("kling.ai.video.chat"),
            ),
            AppDestination(
                "תורה",
                "https://notebooklm.google.com/",
                "notebooklm.google.com",
                externalPackages = listOf("com.google.android.apps.labs.language.tailwind"),
            ),
            AppDestination(
                "מחברת אישית",
                "https://keep.google.com/",
                "keep.google.com",
                externalPackages = listOf("com.google.android.keep"),
            ),
        )
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
            "birthcalculator.web.app",
            "www.birthcalculator.web.app",
            "world-coin.ai",
            "www.world-coin.ai",
            "shilat-medical.web.app",
            "chatgpt.com",
            "www.chatgpt.com",
            "chat.openai.com",
            "auth.openai.com",
            "auth0.openai.com",
            "login.openai.com",
            "nakdan.dicta.org.il",
        )
        private val LEGACY_RABBI_ELON_HOSTS = setOf(
            "ravoldsite.com",
            "www.ravoldsite.com",
        )
        fun intent(context: Context, url: String = HOME_URL): Intent =
            Intent(context, JClockWebActivity::class.java).putExtra(EXTRA_URL, url)
    }
}

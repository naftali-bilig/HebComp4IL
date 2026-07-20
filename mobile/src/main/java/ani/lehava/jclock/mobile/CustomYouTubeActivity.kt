package ani.lehava.jclock.mobile

import android.annotation.SuppressLint
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import org.json.JSONArray
import org.json.JSONObject
import org.json.JSONTokener
import java.io.ByteArrayOutputStream
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

/** The allow-listed CustomYouTube player, hosted inside the JClock application. */
class CustomYouTubeActivity : ComponentActivity() {
    private lateinit var root: FrameLayout
    private lateinit var webView: WebView
    private val allowedVideoIds = linkedSetOf<String>()
    private var fullScreenView: View? = null
    private var fullScreenCallback: WebChromeClient.CustomViewCallback? = null
    private val pickLinksFile = registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) importGeneralLinks(uri)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val scheduledJson = assets.open("customyoutube/allowed-videos.json")
            .bufferedReader()
            .use { it.readText() }
        val entries = JSONArray(scheduledJson)
        repeat(entries.length()) { index ->
            val id = entries.getJSONObject(index).optString("id").trim()
            if (VIDEO_ID.matches(id)) allowedVideoIds += id
        }
        val generalJson = generalVideosJson()
        repeat(generalJson.length()) { index ->
            allowedVideoIds += generalJson.getJSONObject(index).getString("id")
        }

        root = FrameLayout(this).apply { setBackgroundColor(Color.BLACK) }
        webView = WebView(this).apply { setBackgroundColor(Color.rgb(11, 16, 32)) }
        root.addView(
            webView,
            FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            ),
        )
        setContentView(root)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = true
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            allowFileAccess = false
            allowContentAccess = false
            setSupportMultipleWindows(false)
            javaScriptCanOpenWindowsAutomatically = false
            userAgentString = "$userAgentString JClockCustomYouTube/1.0"
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) safeBrowsingEnabled = true
        }
        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(webView, true)
        }
        webView.addJavascriptInterface(TabletControl(), "TabletControl")
        webView.webViewClient = RestrictedWebViewClient()
        webView.webChromeClient = RestrictedChromeClient()

        loadPlayerPage(scheduledJson, generalJson)
        refreshR2GeneralLinks(scheduledJson)
    }

    private fun loadPlayerPage(scheduledJson: String, generalJson: JSONArray = generalVideosJson()) {
        val template = assets.open("customyoutube/index.html")
            .bufferedReader()
            .use { it.readText() }
        val html = template
            .replace("__SCHEDULED_VIDEOS__", scheduledJson)
            .replace("__GENERAL_VIDEOS__", generalJson.toString())
        webView.loadDataWithBaseURL(APP_ORIGIN, html, "text/html", "UTF-8", APP_ORIGIN)
    }

    private fun importGeneralLinks(uri: Uri) {
        val lines = runCatching {
            contentResolver.openInputStream(uri)?.bufferedReader(Charsets.UTF_8)?.use { reader ->
                reader.lineSequence().take(MAX_IMPORTED_LINES + 1).toList()
            } ?: error("Could not open selected file")
        }.getOrElse {
            Toast.makeText(this, "לא ניתן לקרוא את הקובץ שנבחר", Toast.LENGTH_LONG).show()
            return
        }

        if (lines.size > MAX_IMPORTED_LINES) {
            Toast.makeText(this, "הקובץ מכיל יותר מדי שורות", Toast.LENGTH_LONG).show()
            return
        }

        val validLinks = linkedMapOf<String, String>()
        if (generalLinksFile().isFile) {
            generalLinksFile().readLines(Charsets.UTF_8).forEach { existing ->
                videoIdFromLink(existing.trim())?.let { id -> validLinks[id] = existing.trim() }
            }
        }
        var invalidCount = 0
        lines.map(String::trim).filter(String::isNotEmpty).forEach { link ->
            val id = videoIdFromLink(link)
            if (id == null) invalidCount++ else validLinks[id] = link
        }

        if (validLinks.isEmpty()) {
            Toast.makeText(this, "לא נמצאו בקובץ קישורי YouTube תקינים", Toast.LENGTH_LONG).show()
            return
        }

        generalLinksFile().writeText(validLinks.values.joinToString("\n"), Charsets.UTF_8)
        allowedVideoIds.clear()
        val scheduledJson = assets.open("customyoutube/allowed-videos.json")
            .bufferedReader()
            .use { it.readText() }
        val scheduledEntries = JSONArray(scheduledJson)
        repeat(scheduledEntries.length()) { index ->
            scheduledEntries.getJSONObject(index).optString("id").trim()
                .takeIf(VIDEO_ID::matches)
                ?.let(allowedVideoIds::add)
        }
        allowedVideoIds += validLinks.keys
        loadPlayerPage(scheduledJson)

        val message = buildString {
            append("נשמרו ${validLinks.size} סרטונים באזור כללי")
            if (invalidCount > 0) append("; $invalidCount שורות לא תקינות לא נוספו")
        }
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    private fun generalVideosJson(): JSONArray {
        val result = JSONArray()
        val unique = linkedMapOf<String, String>()
        listOf(generalLinksFile(), r2GeneralLinksFile()).filter(File::isFile).forEach { file ->
            file.readLines(Charsets.UTF_8).forEach { link ->
                videoIdFromLink(link.trim())?.let { id -> unique[id] = link.trim() }
            }
        }
        unique.forEach { (id, link) ->
            result.put(
                JSONObject()
                    .put("id", id)
                    .put("url", link)
                    .put("title", "סרטון כללי ${result.length() + 1}"),
            )
        }
        return result
    }

    private fun generalLinksFile(): File = File(filesDir, GENERAL_LINKS_FILE)

    private fun r2GeneralLinksFile(): File = File(filesDir, R2_GENERAL_LINKS_FILE)

    private fun refreshR2GeneralLinks(scheduledJson: String) {
        Thread {
            val links = fetchR2GeneralLinks() ?: return@Thread
            val valid = linkedMapOf<String, String>()
            links.forEach { link -> videoIdFromLink(link)?.let { id -> valid[id] = link.trim() } }
            r2GeneralLinksFile().writeText(valid.values.joinToString("\n"), Charsets.UTF_8)
            val refreshedGeneral = generalVideosJson()
            val scheduledEntries = JSONArray(scheduledJson)
            val refreshedIds = linkedSetOf<String>()
            repeat(scheduledEntries.length()) { index ->
                scheduledEntries.getJSONObject(index).optString("id").trim()
                    .takeIf(VIDEO_ID::matches)
                    ?.let(refreshedIds::add)
            }
            repeat(refreshedGeneral.length()) { index ->
                refreshedIds += refreshedGeneral.getJSONObject(index).getString("id")
            }
            runOnUiThread {
                if (isFinishing || isDestroyed) return@runOnUiThread
                allowedVideoIds.clear()
                allowedVideoIds += refreshedIds
                loadPlayerPage(scheduledJson, refreshedGeneral)
            }
        }.apply {
            name = "CustomYouTube-R2-G"
            isDaemon = true
            start()
        }
    }

    private fun fetchR2GeneralLinks(): List<String>? {
        fetchText(URL(R2_G_LINKS_URL))?.let { return it.lineSequence().toList() }

        fetchText(URL(R2_G_MANIFEST_URL))?.let { manifest ->
            linksFromManifest(manifest)?.let { return it }
        }

        fetchText(URL(R2_ROOT_MANIFEST_URL))?.let { manifest ->
            linksFromManifest(manifest, "G")?.let { return it }
        }
        return null
    }

    private fun linksFromManifest(content: String, folder: String? = null): List<String>? {
        val root = runCatching { JSONTokener(content).nextValue() }.getOrNull() ?: return null
        val array = when (root) {
            is JSONArray -> root
            is JSONObject -> {
                if (folder != null) {
                    root.optJSONArray(folder)
                        ?: root.optJSONObject("folders")?.optJSONArray(folder)
                } else {
                    root.optJSONArray("links")
                        ?: root.optJSONArray("videos")
                        ?: root.optJSONArray("files")
                }
            }
            else -> null
        } ?: return null

        return buildList {
            repeat(array.length()) { index ->
                val value = array.opt(index)
                val link = when (value) {
                    is JSONObject -> value.optString("url").ifBlank { value.optString("link") }
                    else -> value?.toString().orEmpty()
                }.trim()
                if (link.isNotEmpty()) add(link)
            }
        }
    }

    private fun fetchText(url: URL): String? {
        val connection = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            instanceFollowRedirects = true
            connectTimeout = 10_000
            readTimeout = 20_000
            useCaches = false
            setRequestProperty("Accept", "text/plain, application/json")
        }
        return try {
            if (connection.responseCode !in 200..299) return null
            val output = ByteArrayOutputStream()
            connection.inputStream.use { input ->
                val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                var total = 0
                while (true) {
                    val count = input.read(buffer)
                    if (count < 0) break
                    total += count
                    if (total > MAX_REMOTE_LINK_BYTES) return null
                    output.write(buffer, 0, count)
                }
            }
            output.toString(Charsets.UTF_8.name())
        } catch (_: Exception) {
            null
        } finally {
            connection.disconnect()
        }
    }

    private fun videoIdFromLink(link: String): String? {
        val uri = runCatching { Uri.parse(link) }.getOrNull() ?: return null
        if (uri.scheme?.lowercase() !in setOf("http", "https")) return null
        val host = uri.host?.lowercase() ?: return null
        val segments = uri.pathSegments
        val candidate = when {
            host == "youtu.be" -> segments.firstOrNull()
            host == "youtube.com" || host.endsWith(".youtube.com") -> when {
                uri.path == "/watch" -> uri.getQueryParameter("v")
                segments.firstOrNull() in setOf("shorts", "embed", "live", "v") ->
                    segments.getOrNull(1)
                else -> null
            }
            else -> null
        }?.trim()
        return candidate?.takeIf(VIDEO_ID::matches)
    }

    override fun onBackPressed() {
        if (fullScreenView != null) {
            (webView.webChromeClient as? RestrictedChromeClient)?.hideFullScreen()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        fullScreenCallback?.onCustomViewHidden()
        fullScreenCallback = null
        fullScreenView = null
        webView.stopLoading()
        webView.removeAllViews()
        webView.destroy()
        super.onDestroy()
    }

    private inner class RestrictedWebViewClient : WebViewClient() {
        override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
            val uri = request.url
            if (request.isForMainFrame && uri.toString().startsWith(APP_ORIGIN)) return false

            val host = uri.host.orEmpty().lowercase()
            if (host == "youtu.be" || host.endsWith(".youtube.com") || host == "youtube.com") {
                val embeddedId = embeddedVideoId(uri)
                if (embeddedId != null) {
                    if (embeddedId in allowedVideoIds) return false
                    showBlockedMessage()
                    return true
                }

                if (isViewerNavigation(uri) || request.isForMainFrame) {
                    showBlockedMessage()
                    return true
                }
            }

            if (request.isForMainFrame) {
                showBlockedMessage()
                return true
            }
            return false
        }
    }

    private inner class RestrictedChromeClient : WebChromeClient() {
        override fun onPermissionRequest(request: PermissionRequest) {
            request.deny()
        }

        override fun onCreateWindow(
            view: WebView,
            isDialog: Boolean,
            isUserGesture: Boolean,
            resultMsg: android.os.Message,
        ): Boolean {
            showBlockedMessage()
            return false
        }

        override fun onShowCustomView(view: View, callback: CustomViewCallback) {
            if (fullScreenView != null) {
                callback.onCustomViewHidden()
                return
            }
            fullScreenView = view
            fullScreenCallback = callback
            webView.visibility = View.GONE
            root.addView(
                view,
                FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                ),
            )
            window.decorView.systemUiVisibility = IMMERSIVE_FLAGS
        }

        override fun onHideCustomView() = hideFullScreen()

        fun hideFullScreen() {
            val view = fullScreenView ?: return
            root.removeView(view)
            fullScreenView = null
            webView.visibility = View.VISIBLE
            window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
            fullScreenCallback?.onCustomViewHidden()
            fullScreenCallback = null
        }
    }

    private inner class TabletControl {
        @JavascriptInterface
        fun showBlocked() = runOnUiThread { showBlockedMessage() }

        @JavascriptInterface
        fun importLinks() = runOnUiThread {
            pickLinksFile.launch(arrayOf("text/plain", "text/*"))
        }

        @JavascriptInterface
        fun startPinning() = runOnUiThread {
            try {
                startLockTask()
                Toast.makeText(
                    this@CustomYouTubeActivity,
                    "האפליקציה ננעלה למסך. במכשיר לא מנוהל ניתן לצאת באמצעות מחוות המערכת.",
                    Toast.LENGTH_LONG,
                ).show()
            } catch (_: IllegalStateException) {
                Toast.makeText(
                    this@CustomYouTubeActivity,
                    "יש להפעיל תחילה הצמדת אפליקציות בהגדרות הטאבלט.",
                    Toast.LENGTH_LONG,
                ).show()
            }
        }
    }

    private fun embeddedVideoId(uri: Uri): String? {
        val segments = uri.pathSegments
        val embedIndex = segments.indexOf("embed")
        if (embedIndex >= 0 && embedIndex + 1 < segments.size) {
            return segments[embedIndex + 1].takeIf(VIDEO_ID::matches)
        }
        return null
    }

    private fun isViewerNavigation(uri: Uri): Boolean {
        val path = uri.path.orEmpty()
        return uri.host.equals("youtu.be", ignoreCase = true) ||
            path == "/watch" ||
            path.startsWith("/shorts/") ||
            path.startsWith("/channel/") ||
            path.startsWith("/@") ||
            path.startsWith("/results")
    }

    private fun showBlockedMessage() {
        Toast.makeText(this, "הקישור נחסם: הסרטון אינו ברשימה המאושרת", Toast.LENGTH_SHORT).show()
    }

    companion object {
        const val EXTRA_SHORTCUT_SOURCE = "ani.lehava.jclock.extra.CUSTOM_YOUTUBE_SOURCE"
        private const val APP_ORIGIN = "https://player.jclock.local/"
        private const val GENERAL_LINKS_FILE = "customyoutube-general-links.txt"
        private const val R2_GENERAL_LINKS_FILE = "customyoutube-r2-g-links.txt"
        private const val MAX_IMPORTED_LINES = 1_000
        private const val MAX_REMOTE_LINK_BYTES = 512 * 1024
        private const val R2_ROOT_URL =
            "https://pub-71e18ce829fd428ea6d4aa9498a7e642.r2.dev/"
        private const val R2_G_LINKS_URL = "${R2_ROOT_URL}G/links.txt"
        private const val R2_G_MANIFEST_URL = "${R2_ROOT_URL}G/manifest.json"
        private const val R2_ROOT_MANIFEST_URL = "${R2_ROOT_URL}manifest.json"
        private val VIDEO_ID = Regex("^[A-Za-z0-9_-]{11}$")
        private const val IMMERSIVE_FLAGS =
            View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
    }
}

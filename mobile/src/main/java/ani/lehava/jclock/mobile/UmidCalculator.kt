package ani.lehava.jclock.mobile

import android.annotation.SuppressLint
import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONObject
import org.json.JSONTokener

/** Runs the authoritative BirthCalculator color engine locally, without network access. */
class UmidCalculator(context: Context) : AutoCloseable {
    data class Result(val umid: String, val colors: List<String>)

    private val pending = mutableListOf<() -> Unit>()
    private var ready = false
    private var closed = false
    private val webView = createWebView(context)

    @SuppressLint("SetJavaScriptEnabled")
    private fun createWebView(context: Context): WebView = WebView(context).apply {
        settings.javaScriptEnabled = true
        settings.blockNetworkLoads = true
        settings.allowContentAccess = false
        settings.allowFileAccess = true
        settings.domStorageEnabled = false
        webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String?) {
                ready = true
                val work = pending.toList()
                pending.clear()
                work.forEach { it() }
            }
        }
        loadDataWithBaseURL(
            "file:///android_asset/",
            "<html><head><script src=\"hebrew-clock-preview.js\"></script></head><body></body></html>",
            "text/html",
            Charsets.UTF_8.name(),
            null,
        )
    }

    fun calculate(event: WatchEventRepository.Event, callback: (Result?) -> Unit) {
        val task = {
            if (closed) {
                callback(null)
            } else {
                val local = event.date.atTime(event.time)
                val gmt = local.atZone(event.timeZone).offset.totalSeconds / 3600.0
                val input = JSONObject()
                    .put("year", event.date.year)
                    .put("month", event.date.monthValue)
                    .put("day", event.date.dayOfMonth)
                    .put("hour", event.time.hour)
                    .put("minute", event.time.minute)
                    .put("second", event.time.second)
                    .put("millisecond", event.time.nano / 1_000_000)
                    .put("latitude", WatchEventRepository.JERUSALEM_LATITUDE)
                    .put("longitude", WatchEventRepository.JERUSALEM_LONGITUDE)
                    .put("gmt", gmt)
                val script = """
                    (function() {
                      var prediction = BirthCalculatorHebrewPreview.predict(${input});
                      var colors = [
                        prediction.moon.color,
                        prediction.moon.dayColor,
                        prediction.sun.color,
                        prediction.sun.dayColor
                      ];
                      return JSON.stringify({
                        umid: colors.map(function(color) {
                          return String(color || '').replace('#', '').toUpperCase();
                        }).join(''),
                        colors: colors
                      });
                    })();
                """.trimIndent()
                webView.evaluateJavascript(script) { encoded ->
                    val result = runCatching {
                        val value = JSONTokener(encoded).nextValue()
                        val json = when (value) {
                            is JSONObject -> value
                            is String -> JSONObject(value)
                            else -> throw IllegalStateException("Unexpected UMID result")
                        }
                        val colors = json.getJSONArray("colors")
                        Result(
                            umid = json.getString("umid"),
                            colors = (0 until colors.length()).map { colors.getString(it) },
                        )
                    }.getOrNull()
                    callback(result)
                }
            }
        }
        if (ready) task() else pending += task
    }

    override fun close() {
        if (closed) return
        closed = true
        pending.clear()
        webView.stopLoading()
        webView.destroy()
    }
}

package ani.lehava.jclock.mobile.music

import android.content.Context
import android.provider.Settings
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.time.Instant
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

/** Enforces UMID access and a server-timed monthly trial without trusting the phone clock. */
class MelodyAccessGate(
    context: Context,
    private val schedule: HebrewMelodySchedule,
    private val client: MelodyAccessClient = MelodyAccessClient(),
) {
    sealed interface Decision {
        data object FullAccess : Decision
        data class MonthlyTrial(val periodKey: String) : Decision
        data object TrialAlreadyUsed : Decision
        data object AutomaticTimeRequired : Decision
    }

    private val applicationContext = context.applicationContext
    private val trialPreferences = applicationContext.getSharedPreferences(
        TRIAL_PREFERENCES,
        Context.MODE_PRIVATE,
    )

    /** Performs network I/O and must run away from the main thread. */
    fun decide(): Decision {
        val snapshot = client.fetchSnapshot()
        val enteredMid = savedMid()
        if (
            MID_PATTERN.matches(enteredMid) &&
            snapshot.authorizedMids.any { constantTimeEquals(enteredMid, it) }
        ) {
            return Decision.FullAccess
        }

        if (!automaticTimeEnabled()) return Decision.AutomaticTimeRequired

        val periodKey = schedule.trialPeriodKey(snapshot.serverTime)
        return if (trialPreferences.getString(KEY_USED_TRIAL_PERIOD, null) == periodKey) {
            Decision.TrialAlreadyUsed
        } else {
            Decision.MonthlyTrial(periodKey)
        }
    }

    fun markTrialUsed(periodKey: String) {
        trialPreferences.edit().putString(KEY_USED_TRIAL_PERIOD, periodKey).commit()
    }

    fun savedMid(): String = applicationContext
        .getSharedPreferences(PERSONAL_PREFERENCES, Context.MODE_PRIVATE)
        .getString(KEY_UMID, "")
        ?.trim()
        ?.uppercase()
        .orEmpty()

    private fun automaticTimeEnabled(): Boolean =
        Settings.Global.getInt(
            applicationContext.contentResolver,
            Settings.Global.AUTO_TIME,
            0,
        ) == 1

    private fun constantTimeEquals(first: String, second: String): Boolean =
        MessageDigest.isEqual(
            first.toByteArray(Charsets.US_ASCII),
            second.toByteArray(Charsets.US_ASCII),
        )

    companion object {
        private const val PERSONAL_PREFERENCES = "jclock-personal"
        private const val KEY_UMID = "umid"
        private const val TRIAL_PREFERENCES = "jclock-melody-access"
        private const val KEY_USED_TRIAL_PERIOD = "used_trial_period"
        private val MID_PATTERN = Regex("[0-9A-F]{24}")
    }
}

/** Reads the authorized UMID list and trusted HTTP time from Cloudflare R2. */
class MelodyAccessClient(
    rootUrl: String = MelodyCatalogClient.DEFAULT_ROOT_URL,
    private val connectTimeoutMillis: Int = 10_000,
    private val readTimeoutMillis: Int = 20_000,
) {
    data class Snapshot(
        val serverTime: Instant,
        val authorizedMids: List<String>,
    )

    private val root = URL(if (rootUrl.endsWith('/')) rootUrl else "$rootUrl/")

    fun fetchSnapshot(): Snapshot {
        val url = URL(root, "UMID?nonce=${UUID.randomUUID()}")
        val connection = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            instanceFollowRedirects = true
            connectTimeout = connectTimeoutMillis
            readTimeout = readTimeoutMillis
            useCaches = false
            setRequestProperty("Accept", "text/plain, application/octet-stream")
            setRequestProperty("Cache-Control", "no-cache, no-store")
        }

        try {
            val status = connection.responseCode
            if (status !in 200..299) throw IOException("UMID authorization HTTP $status")

            val serverTime = connection.getHeaderField("Date")
                ?.trim()
                ?.takeIf { it.isNotEmpty() }
                ?.let { ZonedDateTime.parse(it, DateTimeFormatter.RFC_1123_DATE_TIME).toInstant() }
                ?: throw IOException("Cloudflare did not provide trusted time")

            val output = ByteArrayOutputStream()
            connection.inputStream.use { input ->
                val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                var total = 0
                while (true) {
                    val count = input.read(buffer)
                    if (count < 0) break
                    total += count
                    if (total > MAX_MID_FILE_BYTES) throw IOException("UMID authorization file is too large")
                    output.write(buffer, 0, count)
                }
            }

            val authorized = output.toString(Charsets.UTF_8.name())
                .uppercase()
                .split(NON_HEX_SEPARATOR)
                .filter { MID_PATTERN.matches(it) }
                .distinct()
            if (authorized.isEmpty()) throw IOException("UMID authorization file is empty")
            return Snapshot(serverTime, authorized)
        } finally {
            connection.disconnect()
        }
    }

    companion object {
        private const val MAX_MID_FILE_BYTES = 16 * 1024
        private val MID_PATTERN = Regex("[0-9A-F]{24}")
        private val NON_HEX_SEPARATOR = Regex("[^0-9A-F]+")
    }
}

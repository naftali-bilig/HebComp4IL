package ani.lehava.jclock.mobile

import android.content.Context
import ani.lehava.jclock.mobile.music.HebrewMelodySchedule
import org.json.JSONArray
import org.json.JSONObject
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

object WatchEventRepository {
    data class Event(
        val rawJson: String,
        val date: LocalDate,
        val time: LocalTime,
        val timeZone: ZoneId,
        val sourceTimeZone: String?,
        val sourceLabel: String,
        val receivedAt: Long,
        val body: JSONObject,
    )

    fun save(context: Context, body: JSONObject): Event {
        val receivedAt = System.currentTimeMillis()
        val event = decode(body, receivedAt)
        val preferences = preferences(context)
        val periodKey = HebrewMelodySchedule().trialPeriodKey(Instant.ofEpochMilli(receivedAt))
        val storedPeriod = preferences.getString(KEY_MONTHLY_PERIOD, null)
        val history = if (storedPeriod != null && storedPeriod != periodKey) {
            mutableListOf()
        } else {
            retainedEntries(preferences.getString(KEY_HISTORY, null), receivedAt).toMutableList()
        }
        val eventId = body.optString("eventId").trim()
        if (eventId.isNotEmpty()) history.removeAll { it.body.optString("eventId").trim() == eventId }
        history += event
        val limited = history.sortedByDescending(Event::receivedAt).take(MAX_EVENTS)
        preferences.edit()
            .putString(KEY_BODY, body.toString())
            .putLong(KEY_RECEIVED_AT, receivedAt)
            .putString(KEY_HISTORY, encodeHistory(limited).toString())
            .putString(KEY_MONTHLY_PERIOD, periodKey)
            .apply()
        return event
    }

    fun read(context: Context): Event? {
        return readAll(context).firstOrNull()
    }

    fun readAll(context: Context): List<Event> {
        val now = System.currentTimeMillis()
        val preferences = preferences(context)
        val currentPeriod = HebrewMelodySchedule().trialPeriodKey(Instant.ofEpochMilli(now))
        val storedPeriod = preferences.getString(KEY_MONTHLY_PERIOD, null)
        if (storedPeriod != null && storedPeriod != currentPeriod) {
            clear(context)
            preferences.edit().putString(KEY_MONTHLY_PERIOD, currentPeriod).apply()
            return emptyList()
        }

        val history = retainedEntries(preferences.getString(KEY_HISTORY, null), now).toMutableList()
        if (history.isEmpty()) {
            val raw = preferences.getString(KEY_BODY, null)
            val receivedAt = preferences.getLong(KEY_RECEIVED_AT, 0L)
            if (raw != null) runCatching { decode(JSONObject(raw), receivedAt) }.getOrNull()?.let(history::add)
        }
        val limited = history.sortedByDescending(Event::receivedAt).take(MAX_EVENTS)
        preferences.edit()
            .putString(KEY_HISTORY, encodeHistory(limited).toString())
            .putString(KEY_MONTHLY_PERIOD, currentPeriod)
            .apply()
        return limited
    }

    fun clear(context: Context) {
        preferences(context).edit()
            .remove(KEY_BODY)
            .remove(KEY_RECEIVED_AT)
            .remove(KEY_HISTORY)
            .remove(KEY_MONTHLY_PERIOD)
            .apply()
    }

    fun updateName(context: Context, receivedAt: Long, name: String): Event? {
        val normalized = name.trim().take(MAX_NAME_LENGTH)
        return updateBody(context, receivedAt) { body ->
            if (normalized.isEmpty()) body.remove("stopName") else body.put("stopName", normalized)
        }
    }

    fun updateCalculatedUmid(context: Context, receivedAt: Long, umid: String): Event? {
        val normalized = umid.trim().uppercase()
        if (!UMID_PATTERN.matches(normalized)) return null
        return updateBody(context, receivedAt) { body -> body.put("calculatedUmid", normalized) }
    }

    private fun updateBody(
        context: Context,
        receivedAt: Long,
        update: (JSONObject) -> Unit,
    ): Event? {
        val events = readAll(context).toMutableList()
        val index = events.indexOfFirst { it.receivedAt == receivedAt }
        if (index < 0) return null
        val body = JSONObject(events[index].body.toString())
        update(body)
        val updated = decode(body, receivedAt)
        events[index] = updated

        val preferences = preferences(context)
        val editor = preferences.edit().putString(KEY_HISTORY, encodeHistory(events).toString())
        if (events.firstOrNull()?.receivedAt == receivedAt) editor.putString(KEY_BODY, body.toString())
        editor.apply()
        return updated
    }

    fun sample(): JSONObject = JSONObject()
        .put("source", "demo")
        .put("date", "2026-07-17")
        .put("time", "22:18")
        .put("timeZone", JERUSALEM_ZONE)
        .put("sourceTimeZone", JERUSALEM_ZONE)
        .put("location", "Jerusalem")
        .put("latitude", JERUSALEM_LATITUDE)
        .put("longitude", JERUSALEM_LONGITUDE)

    private fun decode(body: JSONObject, receivedAt: Long): Event {
        val zone = runCatching {
            ZoneId.of(body.optString("timeZone").ifBlank { JERUSALEM_ZONE })
        }.getOrElse { ZoneId.of(JERUSALEM_ZONE) }

        val suppliedDate = body.optString("date").trim()
        val suppliedTime = body.optString("time").trim()
        val dateTime = if (suppliedDate.isNotEmpty() && suppliedTime.isNotEmpty()) {
            LocalDate.parse(suppliedDate) to parseTime(suppliedTime)
        } else {
            val epoch = epochMillis(body) ?: throw IllegalArgumentException("Missing watch event date/time")
            val zoned = Instant.ofEpochMilli(epoch).atZone(zone)
            zoned.toLocalDate() to zoned.toLocalTime()
        }

        val source = when {
            body.optString("source") == "demo" -> "הדמיה מקומית"
            body.optString("source").equals("garmin", ignoreCase = true) ||
                body.optString("protocol") == "jclock.garmin.snapshot.v1" -> "שעון Garmin"
            body.optString("source").equals("wear", ignoreCase = true) -> "שעון Wear OS"
            body.optString("protocol") == "jclock.snapshot.v1" -> "שעון Zepp / Amazfit"
            else -> "שעון Wear OS"
        }
        return Event(
            rawJson = body.toString(2),
            date = dateTime.first,
            time = dateTime.second,
            timeZone = zone,
            sourceTimeZone = body.optString("sourceTimeZone").takeIf { it.isNotBlank() },
            sourceLabel = source,
            receivedAt = receivedAt,
            body = JSONObject(body.toString()),
        )
    }

    private fun parseTime(value: String): LocalTime =
        runCatching { LocalTime.parse(value, DateTimeFormatter.ISO_LOCAL_TIME) }
            .recoverCatching { LocalTime.parse(value, DateTimeFormatter.ofPattern("HH:mm")) }
            .getOrThrow()

    private fun epochMillis(body: JSONObject): Long? {
        for (name in arrayOf("epochMs", "epochMillis", "epoch")) {
            if (!body.has(name) || body.isNull(name)) continue
            val value = when (val raw = body.opt(name)) {
                is Number -> raw.toLong()
                is String -> raw.toLongOrNull()
                else -> null
            } ?: return null
            return if (name == "epoch" && value in -99_999_999_999L..99_999_999_999L) {
                value * 1_000L
            } else {
                value
            }
        }
        return null
    }

    private fun preferences(context: Context) =
        context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)

    private fun retainedEntries(raw: String?, now: Long): List<Event> {
        if (raw.isNullOrBlank()) return emptyList()
        val cutoff = now - RETENTION_MILLIS
        return runCatching {
            val array = JSONArray(raw)
            buildList {
                for (index in 0 until array.length()) {
                    val item = array.optJSONObject(index) ?: continue
                    val receivedAt = item.optLong("receivedAt", 0L)
                    val body = item.optJSONObject("body") ?: continue
                    if (receivedAt >= cutoff) runCatching { decode(body, receivedAt) }.getOrNull()?.let(::add)
                }
            }
        }.getOrDefault(emptyList())
    }

    private fun encodeHistory(events: List<Event>): JSONArray = JSONArray().apply {
        events.forEach { event ->
            put(JSONObject().put("receivedAt", event.receivedAt).put("body", event.body))
        }
    }

    const val JERUSALEM_LATITUDE = 31.7768514
    const val JERUSALEM_LONGITUDE = 35.2331664
    private const val JERUSALEM_ZONE = "Asia/Jerusalem"
    private const val PREFERENCES = "jclock-watch-event"
    private const val KEY_BODY = "body"
    private const val KEY_RECEIVED_AT = "received-at"
    private const val KEY_HISTORY = "history"
    private const val KEY_MONTHLY_PERIOD = "monthly-period"
    private const val MAX_EVENTS = 18
    private const val MAX_NAME_LENGTH = 80
    private val UMID_PATTERN = Regex("[0-9A-F]{24}")
    private const val RETENTION_MILLIS = 30L * 24L * 60L * 60L * 1_000L
}

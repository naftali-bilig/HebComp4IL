package ani.lehava.jclock.mobile

import android.content.Context
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
        preferences(context).edit()
            .putString(KEY_BODY, body.toString())
            .putLong(KEY_RECEIVED_AT, receivedAt)
            .apply()
        return event
    }

    fun read(context: Context): Event? {
        val preferences = preferences(context)
        val raw = preferences.getString(KEY_BODY, null) ?: return null
        val receivedAt = preferences.getLong(KEY_RECEIVED_AT, 0L)
        return runCatching { decode(JSONObject(raw), receivedAt) }.getOrNull()
    }

    fun clear(context: Context) {
        preferences(context).edit().remove(KEY_BODY).remove(KEY_RECEIVED_AT).apply()
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

    const val JERUSALEM_LATITUDE = 31.7768514
    const val JERUSALEM_LONGITUDE = 35.2331664
    private const val JERUSALEM_ZONE = "Asia/Jerusalem"
    private const val PREFERENCES = "jclock-watch-event"
    private const val KEY_BODY = "body"
    private const val KEY_RECEIVED_AT = "received-at"
}

package ani.lehava.jclock.mobile

import android.content.Context

/** Last successful application-level contact with watches that cannot be queried by Android. */
object WatchConnectionRepository {
    private const val PREFERENCES = "jclock-watch-connection"
    private const val KEY_CHEETAH_LAST_SEEN = "cheetah-last-seen"
    private const val CHEETAH_CONNECTED_WINDOW_MILLIS = 20_000L

    fun markCheetahSeen(context: Context, now: Long = System.currentTimeMillis()) {
        context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
            .edit()
            .putLong(KEY_CHEETAH_LAST_SEEN, now)
            .apply()
    }

    fun cheetahLastSeen(context: Context): Long =
        context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
            .getLong(KEY_CHEETAH_LAST_SEEN, 0L)

    fun isCheetahConnected(context: Context, now: Long = System.currentTimeMillis()): Boolean {
        val lastSeen = cheetahLastSeen(context)
        return lastSeen > 0L && now - lastSeen in 0..CHEETAH_CONNECTED_WINDOW_MILLIS
    }
}

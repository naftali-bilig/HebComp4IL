package ani.lehava.jclock.mobile

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.garmin.android.connectiq.ConnectIQ
import com.garmin.android.connectiq.IQApp
import com.garmin.android.connectiq.IQDevice
import org.json.JSONArray
import org.json.JSONObject

/** Owns the wireless Garmin Connect IQ registration used by the phone companion. */
object GarminConnectManager {
    private const val TAG = "JClockGarmin"
    private const val GARMIN_APP_ID = "acf799e7-2da7-40e8-ac5a-1f4e98d44f8e"
    private const val NOTIFICATION_CHANNEL = "jclock_garmin_updates"
    private const val NOTIFICATION_ID = 43_780
    private const val REFRESH_MILLIS = 15_000L

    private val mainHandler = Handler(Looper.getMainLooper())
    private val registeredDeviceIds = mutableSetOf<Long>()
    private var applicationContext: Context? = null
    private var connectIQ: ConnectIQ? = null
    private var sdkReady = false

    private val refreshRunnable = object : Runnable {
        override fun run() {
            refresh()
            if (connectIQ != null) mainHandler.postDelayed(this, REFRESH_MILLIS)
        }
    }

    @Volatile
    private var connectionLine = "Garmin: מתחבר דרך Garmin Connect…"

    @Volatile
    private var connected = false

    private val app = IQApp(GARMIN_APP_ID)

    private val applicationListener = object : ConnectIQ.IQApplicationEventListener {
        override fun onMessageReceived(
            device: IQDevice,
            app: IQApp,
            messageData: MutableList<Any>,
            status: ConnectIQ.IQMessageStatus,
        ) {
            if (status != ConnectIQ.IQMessageStatus.SUCCESS) {
                Log.w(TAG, "Garmin message failed: $status")
                return
            }
            updateConnectionLine()
            val context = applicationContext ?: return
            messageData.mapNotNull(::messageObject).forEach { body ->
                if (body.optString("protocol") != "jclock.garmin.snapshot.v1") return@forEach
                mainHandler.post {
                    runCatching { LearningLinkDispatcher.forward(context, body) }
                        .onFailure { Log.e(TAG, "Could not store Garmin stop point", it) }
                    runCatching { showNotification(context, device, body) }
                        .onFailure { Log.e(TAG, "Could not show Garmin notification", it) }
                }
            }
        }
    }

    private val deviceListener = object : ConnectIQ.IQDeviceEventListener {
        override fun onDeviceStatusChanged(
            device: IQDevice,
            newStatus: IQDevice.IQDeviceStatus,
        ) {
            updateConnectionLine()
        }
    }

    @Synchronized
    fun start(context: Context) {
        if (connectIQ != null) return
        applicationContext = context.applicationContext
        connectionLine = "Garmin: מתחבר דרך Garmin Connect…"
        connected = false
        runCatching {
            ConnectIQ.getInstance(context.applicationContext, ConnectIQ.IQConnectType.WIRELESS)
        }.onSuccess { instance ->
            connectIQ = instance
            instance.initialize(
                context.applicationContext,
                false,
                object : ConnectIQ.ConnectIQListener {
                    override fun onSdkReady() {
                        sdkReady = true
                        refresh()
                        mainHandler.removeCallbacks(refreshRunnable)
                        mainHandler.postDelayed(refreshRunnable, REFRESH_MILLIS)
                    }

                    override fun onInitializeError(status: ConnectIQ.IQSdkErrorStatus) {
                        sdkReady = false
                        connected = false
                        connectionLine = "Garmin: Garmin Connect אינו זמין · $status"
                    }

                    override fun onSdkShutDown() {
                        sdkReady = false
                        connected = false
                        connectionLine = "Garmin: שירות Connect IQ נעצר"
                    }
                },
            )
        }.onFailure { error ->
            connectionLine = "Garmin: לא ניתן להפעיל את Connect IQ"
            Log.e(TAG, "Could not initialize Garmin Connect IQ", error)
        }
    }

    @Synchronized
    fun refresh() {
        val instance = connectIQ ?: return
        if (!sdkReady) return
        runCatching {
            instance.knownDevices.orEmpty().forEach { device ->
                if (device.deviceIdentifier !in registeredDeviceIds) {
                    instance.registerForDeviceEvents(device, deviceListener)
                    instance.registerForAppEvents(device, app, applicationListener)
                    registeredDeviceIds.add(device.deviceIdentifier)
                }
            }
            updateConnectionLine()
        }.onFailure { error ->
            connectionLine = "Garmin: שגיאה בבדיקת החיבור"
            Log.e(TAG, "Could not refresh Garmin devices", error)
        }
    }

    fun statusLine(): String = connectionLine

    fun isConnected(): Boolean = connected

    @Synchronized
    fun stop(context: Context) {
        val instance = connectIQ ?: return
        mainHandler.removeCallbacks(refreshRunnable)
        runCatching { instance.unregisterAllForEvents() }
        runCatching { instance.shutdown(context.applicationContext) }
        registeredDeviceIds.clear()
        connectIQ = null
        sdkReady = false
        connected = false
        connectionLine = "Garmin: שירות Connect IQ נעצר"
    }

    private fun updateConnectionLine() {
        val instance = connectIQ ?: return
        if (!sdkReady) return
        runCatching {
            val known = instance.knownDevices.orEmpty()
            val connected = known.filter {
                instance.getDeviceStatus(it) == IQDevice.IQDeviceStatus.CONNECTED
            }
            this.connected = connected.isNotEmpty()
            connectionLine = when {
                connected.isNotEmpty() ->
                    "Garmin: מחובר · ${connected.joinToString { it.friendlyName }}"
                known.isNotEmpty() -> "Garmin: מזוהה ב־Garmin Connect אך לא מחובר"
                else -> "Garmin: לא נמצא שעון משויך ב־Garmin Connect"
            }
        }.onFailure { error ->
            Log.w(TAG, "Could not read Garmin device status", error)
        }
    }

    private fun messageObject(value: Any?): JSONObject? = when (value) {
        is Map<*, *> -> mapObject(value)
        is JSONObject -> JSONObject(value.toString())
        else -> null
    }

    private fun mapObject(source: Map<*, *>): JSONObject = JSONObject().apply {
        source.forEach { (key, value) ->
            if (key != null) put(key.toString(), jsonValue(value))
        }
    }

    private fun jsonValue(value: Any?): Any = when (value) {
        null -> JSONObject.NULL
        is Map<*, *> -> mapObject(value)
        is Iterable<*> -> JSONArray().apply { value.forEach { put(jsonValue(it)) } }
        is Array<*> -> JSONArray().apply { value.forEach { put(jsonValue(it)) } }
        else -> value
    }

    private fun showNotification(context: Context, device: IQDevice, body: JSONObject) {
        val manager = context.getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(
            NotificationChannel(
                NOTIFICATION_CHANNEL,
                "JClock Garmin updates",
                NotificationManager.IMPORTANCE_DEFAULT,
            ),
        )
        val pendingIntent = PendingIntent.getActivity(
            context,
            NOTIFICATION_ID,
            Intent(context, MainActivity::class.java).addFlags(
                Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP,
            ),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        manager.notify(
            NOTIFICATION_ID,
            Notification.Builder(context, NOTIFICATION_CHANNEL)
                .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setContentTitle("התקבלה נקודת עצירה מ־Garmin")
                .setContentText("${device.friendlyName} · ${body.optString("time", "--:--")}")
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .build(),
        )
    }
}

package ani.lehava.jclock.mobile.music

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.media.AudioFocusRequest
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.net.Uri
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import ani.lehava.jclock.mobile.MainActivity
import java.io.File
import java.util.concurrent.Executors

class MelodyPlaybackService : Service() {
    private lateinit var player: MelodyPlayer
    private var localPlayer: MediaPlayer? = null
    private var foregroundStarted = false
    private lateinit var audioManager: AudioManager
    private lateinit var focusRequest: AudioFocusRequest
    private lateinit var schedule: HebrewMelodySchedule
    private lateinit var accessGate: MelodyAccessGate
    private val mainHandler = Handler(Looper.getMainLooper())
    private val accessExecutor = Executors.newSingleThreadExecutor()
    private var accessRequestToken = 0L
    private var accessCheckInFlight = false
    private var trialPlaybackActive = false
    private var trialStarted = false
    private var activeTrialPeriod: String? = null

    override fun onCreate() {
        super.onCreate()
        activeService = this
        createNotificationChannel()
        audioManager = getSystemService(AudioManager::class.java)
        focusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
            .setAudioAttributes(mediaAttributes())
            .setAcceptsDelayedFocusGain(false)
            .setOnAudioFocusChangeListener { change ->
                if (
                    change == AudioManager.AUDIOFOCUS_LOSS ||
                    change == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT
                ) {
                    mainHandler.post { stopPlayback() }
                }
            }
            .build()
        val catalogClient = MelodyCatalogClient()
        schedule = HebrewMelodySchedule()
        accessGate = MelodyAccessGate(this, schedule)
        player = MelodyPlayer(
            schedule = schedule,
            catalogClient = catalogClient,
            cache = MelodyCache(File(filesDir, "monthly-melodies"), catalogClient),
            onStateChanged = ::onPlayerState,
        ).also {
            it.setVolume(MelodyPlaybackController.savedVolume(this) / 100f)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        ensureForeground(MelodyPlayer.State.LoadingCatalog)
        handleIntent(intent)
        return START_STICKY
    }

    private fun handleIntent(intent: Intent?) {
        when (intent?.action) {
            ACTION_PAUSE -> stopPlayback()
            ACTION_SKIP -> {
                val wasPlayingLocalFile = localPlayer != null
                stopLocalPlayer()
                if (MelodyPlaybackController.isPlaybackRequested && !wasPlayingLocalFile) {
                    player.skip()
                } else {
                    startCatalogPlayback()
                }
            }
            ACTION_SET_VOLUME -> setVolume(intent.getIntExtra(EXTRA_VOLUME, 28))
            ACTION_PLAY_LOCAL -> authorizeLocalPlayback(
                intent.data,
                intent.getStringExtra(EXTRA_LOCAL_NAME),
            )
            ACTION_PLAY -> startCatalogPlayback()
            ACTION_PREPARE, null -> updateNotification(MelodyPlaybackController.state)
            ACTION_TOGGLE -> {
                if (MelodyPlaybackController.isPlaybackRequested) stopPlayback() else startCatalogPlayback()
            }
            else -> Unit
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        accessRequestToken++
        accessCheckInFlight = false
        accessExecutor.shutdownNow()
        stopLocalPlayer()
        player.close()
        runCatching { audioManager.abandonAudioFocusRequest(focusRequest) }
        MelodyPlaybackController.isPlaybackRequested = false
        foregroundStarted = false
        if (activeService === this) activeService = null
        super.onDestroy()
    }

    private fun startCatalogPlayback() {
        stopLocalPlayer()
        if (trialPlaybackActive) {
            beginCatalogPlayback(MelodyPlayer.MonthlyAccess.SINGLE)
            return
        }

        authorize(
            allowTrial = true,
            onFullAccess = {
                clearTrialSession()
                beginCatalogPlayback(MelodyPlayer.MonthlyAccess.FULL)
            },
            onMonthlyTrial = { periodKey ->
                trialPlaybackActive = true
                trialStarted = false
                activeTrialPeriod = periodKey
                beginCatalogPlayback(MelodyPlayer.MonthlyAccess.SINGLE)
            },
            onRestrictedAccess = {
                clearTrialSession()
                beginCatalogPlayback(MelodyPlayer.MonthlyAccess.NONE)
            },
        )
    }

    private fun stopPlayback() {
        cancelAccessCheck()
        MelodyPlaybackController.isPlaybackRequested = false
        stopLocalPlayer()
        player.pause()
        runCatching { audioManager.abandonAudioFocusRequest(focusRequest) }
        if (foregroundStarted) updateNotification(MelodyPlayer.State.Paused)
    }

    private fun beginCatalogPlayback(monthlyAccess: MelodyPlayer.MonthlyAccess) {
        if (!requestAudioFocus()) {
            if (!trialStarted) clearTrialSession()
            return
        }
        MelodyPlaybackController.isPlaybackRequested = true
        player.start(monthlyAccess = monthlyAccess)
    }

    private fun authorizeLocalPlayback(uri: Uri?, displayName: String?) {
        if (uri == null) {
            onPlayerState(MelodyPlayer.State.Error("לא נבחר קובץ שמע"))
            return
        }
        authorize(
            allowTrial = false,
            onFullAccess = { playLocal(uri, displayName) },
            onMonthlyTrial = { _ -> },
        )
    }

    private fun authorize(
        allowTrial: Boolean,
        onFullAccess: () -> Unit,
        onMonthlyTrial: (String) -> Unit,
        onRestrictedAccess: () -> Unit = {},
    ) {
        if (accessCheckInFlight) return
        accessCheckInFlight = true
        val token = ++accessRequestToken
        onPlayerState(MelodyPlayer.State.LoadingCatalog)

        accessExecutor.execute {
            val result = runCatching { accessGate.decide() }
            mainHandler.post {
                if (token != accessRequestToken) return@post
                accessCheckInFlight = false
                result.fold(
                    onSuccess = { decision ->
                        when (decision) {
                            MelodyAccessGate.Decision.FullAccess -> onFullAccess()
                            is MelodyAccessGate.Decision.MonthlyTrial -> {
                                if (allowTrial) onMonthlyTrial(decision.periodKey)
                                else denyAccess(MID_REQUIRED_MESSAGE)
                            }
                            MelodyAccessGate.Decision.TrialAlreadyUsed -> onRestrictedAccess()
                            MelodyAccessGate.Decision.AutomaticTimeRequired -> onRestrictedAccess()
                        }
                    },
                    onFailure = {
                        onRestrictedAccess()
                    },
                )
            }
        }
    }

    private fun cancelAccessCheck() {
        if (!accessCheckInFlight) return
        accessRequestToken++
        accessCheckInFlight = false
    }

    private fun denyAccess(message: String) {
        MelodyPlaybackController.isPlaybackRequested = false
        onPlayerState(MelodyPlayer.State.Error(message))
    }

    private fun clearTrialSession() {
        trialPlaybackActive = false
        trialStarted = false
        activeTrialPeriod = null
    }

    private fun playLocal(uri: Uri?, displayName: String?) {
        if (uri == null) {
            onPlayerState(MelodyPlayer.State.Error("לא נבחר קובץ שמע"))
            return
        }
        player.pause()
        stopLocalPlayer()
        if (!requestAudioFocus()) return
        MelodyPlaybackController.isPlaybackRequested = true
        val local = MediaPlayer()
        localPlayer = local
        runCatching {
            local.setAudioAttributes(mediaAttributes())
            local.setDataSource(this, uri)
            val volume = MelodyPlaybackController.savedVolume(this) / 100f
            local.setVolume(volume, volume)
            local.setOnPreparedListener {
                it.start()
                onPlayerState(MelodyPlayer.State.Playing(displayName ?: "קובץ מקומי", "מקומי"))
            }
            local.setOnCompletionListener {
                if (localPlayer === it) localPlayer = null
                it.release()
                stopPlayback()
            }
            local.setOnErrorListener { failed, what, extra ->
                if (localPlayer === failed) localPlayer = null
                failed.release()
                onPlayerState(MelodyPlayer.State.Error("שגיאת שמע $what/$extra"))
                stopPlayback()
                true
            }
            onPlayerState(MelodyPlayer.State.Downloading(displayName ?: "קובץ מקומי"))
            local.prepareAsync()
        }.onFailure {
            stopLocalPlayer()
            onPlayerState(MelodyPlayer.State.Error(it.message ?: "לא ניתן לפתוח את קובץ השמע"))
            stopPlayback()
        }
    }

    private fun setVolume(percent: Int) {
        val volume = percent.coerceIn(0, 100) / 100f
        player.setVolume(volume)
        localPlayer?.setVolume(volume, volume)
        updateNotification(MelodyPlaybackController.state)
    }

    private fun requestAudioFocus(): Boolean {
        val granted = audioManager.requestAudioFocus(focusRequest) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
        if (!granted) {
            MelodyPlaybackController.isPlaybackRequested = false
            onPlayerState(MelodyPlayer.State.Error("אפליקציה אחרת משתמשת כעת בשמע"))
        }
        return granted
    }

    private fun mediaAttributes(): AudioAttributes = AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_MEDIA)
        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
        .build()

    private fun stopLocalPlayer() {
        val local = localPlayer ?: return
        localPlayer = null
        runCatching { local.reset() }
        runCatching { local.release() }
    }

    private fun onPlayerState(state: MelodyPlayer.State) {
        if (state is MelodyPlayer.State.Playing &&
            state.folder != MelodyPlayer.GENERAL_FOLDER &&
            trialPlaybackActive && !trialStarted
        ) {
            activeTrialPeriod?.let(accessGate::markTrialUsed)
            trialStarted = true
        }

        if (state is MelodyPlayer.State.TrialFinished) {
            MelodyPlaybackController.isPlaybackRequested = false
            clearTrialSession()
            runCatching { audioManager.abandonAudioFocusRequest(focusRequest) }
        } else if (state is MelodyPlayer.State.Error && trialPlaybackActive && trialStarted) {
            MelodyPlaybackController.isPlaybackRequested = false
            clearTrialSession()
            player.pause()
            runCatching { audioManager.abandonAudioFocusRequest(focusRequest) }
        }

        MelodyPlaybackController.publish(state)
        if (foregroundStarted && state !is MelodyPlayer.State.Closed) updateNotification(state)
    }

    private fun ensureForeground(state: MelodyPlayer.State) {
        if (foregroundStarted) return
        startForeground(NOTIFICATION_ID, notification(state))
        foregroundStarted = true
    }

    private fun updateNotification(state: MelodyPlayer.State) {
        getSystemService(NotificationManager::class.java).notify(NOTIFICATION_ID, notification(state))
    }

    private fun notification(state: MelodyPlayer.State): Notification {
        val openApp = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val pause = PendingIntent.getService(
            this,
            1,
            Intent(this, MelodyPlaybackService::class.java).setAction(ACTION_PAUSE),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        return Notification.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle("ThirdTempale · מנגינות")
            .setContentText(statusText(state))
            .setContentIntent(openApp)
            .setOngoing(MelodyPlaybackController.isPlaybackRequested)
            .addAction(Notification.Action.Builder(null, "עצור", pause).build())
            .build()
    }

    private fun statusText(state: MelodyPlayer.State): String = when (state) {
        MelodyPlayer.State.Idle -> "מוכן"
        MelodyPlayer.State.LoadingCatalog -> "טוען את מנגינות החודש…"
        is MelodyPlayer.State.Downloading -> "מתחבר לניגון: ${state.name}"
        is MelodyPlayer.State.Playing -> "${state.name} · ${state.folder}"
        MelodyPlayer.State.Paused -> "מושהה"
        MelodyPlayer.State.TrialFinished -> TRIAL_USED_MESSAGE
        is MelodyPlayer.State.Error -> "מנסה שוב: ${state.message}"
        MelodyPlayer.State.Closed -> "הופסק"
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "מנגינות ThirdTempale",
            NotificationManager.IMPORTANCE_LOW,
        ).apply { description = "נגינת מנגינות החודש מן השעון ומהטלפון" }
        getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }

    companion object {
        const val ACTION_TOGGLE = "ani.lehava.jclock.music.TOGGLE"
        const val ACTION_PLAY = "ani.lehava.jclock.music.PLAY"
        const val ACTION_PAUSE = "ani.lehava.jclock.music.PAUSE"
        const val ACTION_SKIP = "ani.lehava.jclock.music.SKIP"
        const val ACTION_SET_VOLUME = "ani.lehava.jclock.music.SET_VOLUME"
        const val ACTION_PLAY_LOCAL = "ani.lehava.jclock.music.PLAY_LOCAL"
        const val ACTION_PREPARE = "ani.lehava.jclock.music.PREPARE"
        const val EXTRA_VOLUME = "volume"
        const val EXTRA_LOCAL_NAME = "localName"
        private const val TRIAL_USED_MESSAGE =
            "מנגינת הניסיון כבר הושמעה. ניתן להמתין לחצות שאחרי כ״ט בחודש העברי הבא או ליצור איתי קשר."
        private const val AUTOMATIC_TIME_MESSAGE =
            "כדי לקבל מנגינת ניסיון חודשית יש להפעיל תאריך ושעה אוטומטיים במכשיר."
        private const val MID_REQUIRED_MESSAGE =
            "ניגון קובץ מקומי זמין לאחר הזנת UMID מורשה."
        private const val CHANNEL_ID = "jclock-melodies"
        private const val NOTIFICATION_ID = 42_317

        @Volatile
        private var activeService: MelodyPlaybackService? = null

        fun dispatchIfRunning(intent: Intent): Boolean {
            val service = activeService ?: return false
            Handler(Looper.getMainLooper()).post { service.handleIntent(intent) }
            return true
        }
    }
}

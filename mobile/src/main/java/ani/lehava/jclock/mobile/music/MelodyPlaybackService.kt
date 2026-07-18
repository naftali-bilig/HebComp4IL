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
import android.os.SystemClock
import ani.lehava.jclock.mobile.MainActivity
import java.io.File

class MelodyPlaybackService : Service() {
    private lateinit var player: MelodyPlayer
    private var localPlayer: MediaPlayer? = null
    private var localDisplayName: String? = null
    private var localPrepared = false
    private var localStartPositionMillis = 0
    private var localStartedAtElapsedMillis = 0L
    private var foregroundStarted = false
    private lateinit var audioManager: AudioManager
    private lateinit var focusRequest: AudioFocusRequest

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
                    Handler(Looper.getMainLooper()).post { stopPlayback() }
                }
            }
            .build()
        val catalogClient = MelodyCatalogClient()
        player = MelodyPlayer(
            schedule = HebrewMelodySchedule(),
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
            ACTION_PAUSE -> pausePlayback()
            ACTION_STOP_LOCAL -> stopLocalAndService()
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
            ACTION_PLAY_LOCAL -> playLocal(
                intent.data,
                intent.getStringExtra(EXTRA_LOCAL_NAME),
                intent.getIntExtra(EXTRA_START_POSITION, 0),
            )
            ACTION_PLAY -> if (localPlayer != null) resumeLocalPlayback() else startCatalogPlayback()
            ACTION_PREPARE, null -> updateNotification(MelodyPlaybackController.state)
            ACTION_TOGGLE -> if (localPlayer != null) {
                toggleLocalPlayback()
            } else if (MelodyPlaybackController.isPlaybackRequested) {
                stopPlayback()
            } else {
                startCatalogPlayback()
            }
            else -> Unit
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
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
        if (!requestAudioFocus()) return
        MelodyPlaybackController.isPlaybackRequested = true
        player.start()
    }

    private fun stopPlayback() {
        MelodyPlaybackController.isPlaybackRequested = false
        stopLocalPlayer()
        player.pause()
        runCatching { audioManager.abandonAudioFocusRequest(focusRequest) }
        if (foregroundStarted) updateNotification(MelodyPlayer.State.Paused)
    }

    private fun pausePlayback() {
        if (localPlayer != null) pauseLocalPlayback() else stopPlayback()
    }

    private fun toggleLocalPlayback() {
        val local = localPlayer ?: return
        if (!localPrepared) return
        if (local.isPlaying) pauseLocalPlayback() else resumeLocalPlayback()
    }

    private fun pauseLocalPlayback() {
        val local = localPlayer ?: return
        if (!localPrepared) return
        localStartPositionMillis = estimatedLocalPositionMillis()
        runCatching { local.pause() }
        localStartedAtElapsedMillis = 0L
        MelodyPlaybackController.isPlaybackRequested = false
        runCatching { audioManager.abandonAudioFocusRequest(focusRequest) }
        onPlayerState(MelodyPlayer.State.Paused)
    }

    private fun resumeLocalPlayback() {
        val local = localPlayer ?: return
        if (!localPrepared) return
        if (!requestAudioFocus()) return
        runCatching {
            local.start()
            localStartedAtElapsedMillis = SystemClock.elapsedRealtime()
            MelodyPlaybackController.isPlaybackRequested = true
            onPlayerState(MelodyPlayer.State.Playing(localDisplayName ?: "קובץ מקומי", "מקומי"))
        }.onFailure {
            onPlayerState(MelodyPlayer.State.Error(it.message ?: "לא ניתן להמשיך את השמע"))
        }
    }

    private fun stopLocalAndService() {
        MelodyPlaybackController.isPlaybackRequested = false
        stopLocalPlayer()
        player.pause()
        runCatching { audioManager.abandonAudioFocusRequest(focusRequest) }
        MelodyPlaybackController.publish(MelodyPlayer.State.Paused)
        if (foregroundStarted) {
            stopForeground(STOP_FOREGROUND_REMOVE)
            foregroundStarted = false
        }
        stopSelf()
    }

    private fun playLocal(uri: Uri?, displayName: String?, startPositionMillis: Int) {
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
        localDisplayName = displayName ?: "קובץ מקומי"
        localPrepared = false
        runCatching {
            local.setAudioAttributes(mediaAttributes())
            local.setDataSource(this, uri)
            val volume = MelodyPlaybackController.savedVolume(this) / 100f
            local.setVolume(volume, volume)
            local.setOnPreparedListener {
                localPrepared = true
                localStartPositionMillis = startPositionMillis.coerceIn(0, it.duration.coerceAtLeast(0))
                if (localStartPositionMillis > 0) it.seekTo(localStartPositionMillis)
                localStartedAtElapsedMillis = SystemClock.elapsedRealtime()
                it.start()
                onPlayerState(MelodyPlayer.State.Playing(localDisplayName ?: "קובץ מקומי", "מקומי"))
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
        localDisplayName = null
        localPrepared = false
        localStartPositionMillis = 0
        localStartedAtElapsedMillis = 0L
    }

    private fun estimatedLocalPositionMillis(): Int {
        if (localPlayer == null) return 0
        if (localStartedAtElapsedMillis == 0L) return localStartPositionMillis
        val elapsed = (SystemClock.elapsedRealtime() - localStartedAtElapsedMillis).coerceAtLeast(0L)
        return (localStartPositionMillis + elapsed).coerceAtMost(Int.MAX_VALUE.toLong()).toInt()
    }

    private fun onPlayerState(state: MelodyPlayer.State) {
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
        val toggle = PendingIntent.getService(
            this,
            1,
            Intent(this, MelodyPlaybackService::class.java).setAction(ACTION_TOGGLE),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val localPlayback = localPlayer != null
        val playing = if (localPlayback && localPrepared) {
            runCatching { localPlayer?.isPlaying }.getOrNull() ?: false
        } else {
            MelodyPlaybackController.isPlaybackRequested
        }
        return Notification.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle(
                if (localPlayback) {
                    localDisplayName ?: "YoumTove"
                } else {
                    "ThirdTempale · מנגינות"
                },
            )
            .setContentText(
                if (localPlayback) {
                    if (playing) "מתנגן ברקע" else "מושהה"
                } else {
                    statusText(state)
                },
            )
            .setContentIntent(openApp)
            .setOngoing(playing)
            .addAction(
                Notification.Action.Builder(
                    if (playing) android.R.drawable.ic_media_pause else android.R.drawable.ic_media_play,
                    if (playing) "Pause" else "Play",
                    toggle,
                ).build(),
            )
            .build()
    }

    private fun statusText(state: MelodyPlayer.State): String = when (state) {
        MelodyPlayer.State.Idle -> "מוכן"
        MelodyPlayer.State.LoadingCatalog -> "טוען את מנגינות החודש…"
        is MelodyPlayer.State.Downloading -> "מתחבר לניגון: ${state.name}"
        is MelodyPlayer.State.Playing -> "${state.name} · ${state.folder}"
        MelodyPlayer.State.Paused -> "מושהה"
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
        const val ACTION_STOP_LOCAL = "ani.lehava.jclock.music.STOP_LOCAL"
        const val ACTION_SKIP = "ani.lehava.jclock.music.SKIP"
        const val ACTION_SET_VOLUME = "ani.lehava.jclock.music.SET_VOLUME"
        const val ACTION_PLAY_LOCAL = "ani.lehava.jclock.music.PLAY_LOCAL"
        const val ACTION_PREPARE = "ani.lehava.jclock.music.PREPARE"
        const val EXTRA_VOLUME = "volume"
        const val EXTRA_LOCAL_NAME = "localName"
        const val EXTRA_START_POSITION = "startPosition"
        private const val CHANNEL_ID = "jclock-melodies"
        private const val NOTIFICATION_ID = 42_317

        @Volatile
        private var activeService: MelodyPlaybackService? = null

        fun dispatchIfRunning(intent: Intent): Boolean {
            val service = activeService ?: return false
            Handler(Looper.getMainLooper()).post { service.handleIntent(intent) }
            return true
        }

        fun currentLocalPositionMillis(): Int =
            activeService?.estimatedLocalPositionMillis() ?: 0
    }
}

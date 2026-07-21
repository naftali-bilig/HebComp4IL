package ani.lehava.jclock.mobile.music

import android.media.AudioAttributes
import android.media.MediaPlayer
import android.os.Handler
import android.os.Looper
import java.io.Closeable
import java.time.Instant
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicLong
import kotlin.random.Random

/** Native Android melody playback. It never creates or communicates with a WebView. */
class MelodyPlayer(
    private val schedule: HebrewMelodySchedule,
    private val catalogClient: MelodyCatalogClient,
    private val cache: MelodyCache,
    private val trackGapMillis: Long = 6_000L,
    private val worker: ExecutorService = Executors.newSingleThreadExecutor(),
    private val mainHandler: Handler = Handler(Looper.getMainLooper()),
    private val onStateChanged: (State) -> Unit = {},
) : Closeable {
    enum class MonthlyAccess { NONE, SINGLE, FULL }

    sealed class State {
        data object Idle : State()
        data object LoadingCatalog : State()
        data class Downloading(val name: String) : State()
        data class Playing(val name: String, val folder: String) : State()
        data object Paused : State()
        data object TrialFinished : State()
        data class Error(val message: String) : State()
        data object Closed : State()
    }

    private val generation = AtomicLong(0L)
    private var mediaPlayer: MediaPlayer? = null
    private var monthlyCatalog: MelodyCatalogClient.Catalog? = null
    private var monthlyCatalogExpiry: Instant? = null
    private var generalCatalog: MelodyCatalogClient.Catalog? = null
    private var lastTrackName: String? = null
    private var playRequested = false
    private var monthlyAccess = MonthlyAccess.NONE
    private var singleMonthlyTrackPlayed = false
    private var activeFolder: String? = null
    private var closed = false
    private var volume = 0.28f

    fun start(monthlyAccess: MonthlyAccess = MonthlyAccess.NONE) {
        runOnMain {
            if (closed) return@runOnMain
            if (this.monthlyAccess != monthlyAccess) {
                this.monthlyAccess = monthlyAccess
                singleMonthlyTrackPlayed = false
            }
            playRequested = true
            val current = mediaPlayer
            if (current != null) {
                runCatching { current.start() }
                    .onSuccess { publish(State.Playing(lastTrackName.orEmpty(), activeFolder.orEmpty())) }
                    .onFailure { prepareNext(0L) }
            } else {
                prepareNext(0L)
            }
        }
    }

    fun pause() {
        runOnMain {
            if (closed) return@runOnMain
            playRequested = false
            generation.incrementAndGet()
            mainHandler.removeCallbacksAndMessages(this)
            runCatching { mediaPlayer?.pause() }
            publish(State.Paused)
        }
    }

    fun setVolume(value: Float) {
        runOnMain {
            volume = value.coerceIn(0f, 1f)
            mediaPlayer?.setVolume(volume, volume)
        }
    }

    fun skip() {
        runOnMain {
            if (closed || !playRequested) return@runOnMain
            releasePlayer()
            prepareNext(0L)
        }
    }

    /** Forces a fresh no-store manifest read on the next track. */
    fun refreshCatalog() {
        runOnMain {
            monthlyCatalog = null
            monthlyCatalogExpiry = null
            generalCatalog = null
            if (playRequested && mediaPlayer == null) prepareNext(0L)
        }
    }

    override fun close() {
        runOnMain {
            if (closed) return@runOnMain
            closed = true
            playRequested = false
            monthlyAccess = MonthlyAccess.NONE
            singleMonthlyTrackPlayed = false
            generation.incrementAndGet()
            mainHandler.removeCallbacksAndMessages(this)
            releasePlayer()
            worker.shutdownNow()
            publish(State.Closed)
        }
    }

    private fun prepareNext(delayMillis: Long) {
        check(Looper.myLooper() == Looper.getMainLooper())
        if (!playRequested || closed) return
        val token = generation.incrementAndGet()
        mainHandler.postAtTime({ loadNext(token) }, this, android.os.SystemClock.uptimeMillis() + delayMillis)
    }

    private fun loadNext(token: Long) {
        if (!isCurrent(token)) return
        publish(State.LoadingCatalog)
        worker.execute {
            try {
                val now = Instant.now()
                val window = schedule.window(now)
                cache.cleanExpired(now)
                val tracks = ArrayList<Track>()
                val general = generalCatalog ?: catalogClient.fetchMonth(GENERAL_FOLDER).also { generalCatalog = it }
                general.entries.forEach { tracks += Track(GENERAL_FOLDER, it, GENERAL_CACHE_EXPIRY) }

                if (monthlyAccess == MonthlyAccess.FULL ||
                    (monthlyAccess == MonthlyAccess.SINGLE && !singleMonthlyTrackPlayed)
                ) {
                    var monthly = monthlyCatalog
                    if (monthly == null || monthly.folder != window.folder || monthlyCatalogExpiry != window.expiresAt) {
                        monthly = catalogClient.fetchForWindow(window)
                        monthlyCatalog = monthly
                        monthlyCatalogExpiry = window.expiresAt
                    }
                    monthly.entries.forEach { tracks += Track(window.folder, it, window.expiresAt) }
                }
                if (tracks.isEmpty()) error("No melodies are available")
                val track = selectTrack(tracks)
                postIfCurrent(token) { publish(State.Downloading(track.entry.name)) }
                val cached = if (track.folder == GENERAL_FOLDER) {
                    cache.getOrDownload(track.folder, track.entry, track.expiresAt, now)
                } else {
                    cache.find(track.folder, track.entry, track.expiresAt, now)
                }
                if (cached != null) {
                    postIfCurrent(token) { playFile(token, track.folder, cached) }
                } else {
                    val source = catalogClient.trackUrl(track.folder, track.entry, track.expiresAt)
                    postIfCurrent(token) {
                        playSource(token, track.entry.name, track.folder, source.toString())
                    }
                }
            } catch (error: Throwable) {
                postIfCurrent(token) {
                    publish(State.Error(error.message ?: "Could not play melody"))
                    if (playRequested) prepareNext(RETRY_DELAY_MILLIS)
                }
            }
        }
    }

    private fun selectTrack(entries: List<Track>): Track {
        val eligible = if (monthlyAccess == MonthlyAccess.SINGLE && !singleMonthlyTrackPlayed) {
            entries.filterNot { it.folder == GENERAL_FOLDER }.ifEmpty { entries }
        } else {
            entries
        }
        if (eligible.size == 1) return eligible.first()
        val candidates = eligible.filterNot { it.entry.name == lastTrackName }.ifEmpty { eligible }
        return candidates[Random.Default.nextInt(candidates.size)]
    }

    private fun playFile(token: Long, folder: String, melody: MelodyCache.CachedMelody) {
        playSource(token, melody.entry.name, folder, melody.file.absolutePath)
    }

    /**
     * MediaPlayer progressively reads HTTPS sources, so a 25-45 MB WAV starts
     * after buffering instead of blocking until the entire file is downloaded.
     */
    private fun playSource(token: Long, name: String, folder: String, source: String) {
        if (!isCurrent(token)) return
        releasePlayer()
        val player = MediaPlayer()
        mediaPlayer = player
        try {
            player.setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build(),
            )
            player.setDataSource(source)
            player.setVolume(volume, volume)
            player.setOnPreparedListener { prepared ->
                if (!isCurrent(token) || !playRequested) return@setOnPreparedListener
                lastTrackName = name
                activeFolder = folder
                prepared.start()
                publish(State.Playing(name, folder))
            }
            player.setOnCompletionListener {
                if (mediaPlayer === it) mediaPlayer = null
                it.release()
                if (folder != GENERAL_FOLDER && monthlyAccess == MonthlyAccess.SINGLE) {
                    singleMonthlyTrackPlayed = true
                }
                if (playRequested && !closed) {
                    prepareNext(trackGapMillis)
                }
            }
            player.setOnErrorListener { failed, what, extra ->
                if (mediaPlayer === failed) mediaPlayer = null
                failed.release()
                publish(State.Error("MediaPlayer error $what/$extra"))
                if (playRequested && !closed) prepareNext(RETRY_DELAY_MILLIS)
                true
            }
            player.prepareAsync()
        } catch (error: Throwable) {
            releasePlayer()
            publish(State.Error(error.message ?: "Could not prepare melody"))
            if (playRequested) prepareNext(RETRY_DELAY_MILLIS)
        }
    }

    private fun releasePlayer() {
        val player = mediaPlayer ?: return
        mediaPlayer = null
        runCatching { player.reset() }
        runCatching { player.release() }
    }

    private fun isCurrent(token: Long): Boolean = !closed && playRequested && generation.get() == token

    private fun postIfCurrent(token: Long, action: () -> Unit) {
        mainHandler.post {
            if (isCurrent(token)) action()
        }
    }

    private fun publish(state: State) {
        if (Looper.myLooper() == Looper.getMainLooper()) onStateChanged(state)
        else mainHandler.post { onStateChanged(state) }
    }

    private fun runOnMain(action: () -> Unit) {
        if (Looper.myLooper() == Looper.getMainLooper()) action() else mainHandler.post(action)
    }

    companion object {
        private const val RETRY_DELAY_MILLIS = 1_500L
        const val GENERAL_FOLDER = "G"
        private val GENERAL_CACHE_EXPIRY = Instant.ofEpochMilli(Long.MAX_VALUE)
    }

    private data class Track(
        val folder: String,
        val entry: MelodyCatalogClient.Entry,
        val expiresAt: Instant,
    )
}

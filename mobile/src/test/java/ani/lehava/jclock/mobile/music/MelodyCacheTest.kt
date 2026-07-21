package ani.lehava.jclock.mobile.music

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import java.io.File
import java.time.Instant
import java.util.Properties

class MelodyCacheTest {
    @get:Rule
    val temporaryFolder = TemporaryFolder()

    @Test
    fun cleanExpiredNeverDeletesGeneralFolderMelodies() {
        val directory = temporaryFolder.newFolder("melodies")
        val audio = File(directory, "general.mp3").apply { writeBytes(byteArrayOf(1, 2, 3)) }
        File(directory, "general.properties").outputStream().use { output ->
            Properties().apply {
                setProperty("folder", "G")
                setProperty("retainForever", "true")
                setProperty("expiresAt", "0")
                setProperty("sourceUrl", "https://example.test/G/song.mp3")
            }.store(output, null)
        }

        val removed = MelodyCache(directory, MelodyCatalogClient("https://example.test/"))
            .cleanExpired(Instant.ofEpochMilli(1))

        assertEquals(0, removed)
        assertTrue(audio.exists())
        assertTrue(File(directory, "general.properties").exists())
    }

    @Test
    fun cleanExpiredStillDeletesExpiredMonthlyMelodies() {
        val directory = temporaryFolder.newFolder("melodies")
        File(directory, "monthly.mp3").writeBytes(byteArrayOf(1, 2, 3))
        File(directory, "monthly.properties").outputStream().use { output ->
            Properties().apply {
                setProperty("folder", "Nissan")
                setProperty("expiresAt", "0")
                setProperty("sourceUrl", "https://example.test/Nissan/song.mp3")
            }.store(output, null)
        }

        val removed = MelodyCache(directory, MelodyCatalogClient("https://example.test/"))
            .cleanExpired(Instant.ofEpochMilli(1))

        assertEquals(2, removed)
    }
}

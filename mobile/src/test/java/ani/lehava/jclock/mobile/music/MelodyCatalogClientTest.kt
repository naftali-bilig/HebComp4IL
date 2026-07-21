package ani.lehava.jclock.mobile.music

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Test

class MelodyCatalogClientTest {
    @Test
    fun readsGeneralFolderWithNestedAudioPaths() {
        val manifest = JSONObject(
            """{"months":{"G":["plain.mp3","sub/folder/tune.wav","../escape.ogg"]}}""",
        )

        val entries = MelodyCatalogClient().entriesFromManifest(manifest, "G")

        assertEquals(listOf("plain.mp3", "sub/folder/tune.wav"), entries.map { it.name })
    }
}

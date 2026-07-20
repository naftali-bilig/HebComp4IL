package ani.lehava.jclock.mobile

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class NeedMeRegistryTest {
    @Test
    fun readsIdAndEidFromMarriageDatabaseScript() {
        val script = """
            var marrigeDB = [
              { ID: "משתמש א", eID: 'User A', hebrewDay: 2 },
              {ID:"משתמש ב", eID:"User B"}
            ];
        """.trimIndent()
        assertEquals(
            setOf("משתמש א", "user a", "משתמש ב", "user b"),
            NeedMeRegistry.identifiers(script),
        )
    }

    @Test
    fun fingerprintUsesNormalizedIdentifier() {
        assertEquals(
            NeedMeRegistry.fingerprint("  User   A "),
            NeedMeRegistry.fingerprint("user a"),
        )
        assertTrue(NeedMeRegistry.fingerprint("user a").matches(Regex("[0-9a-f]{64}")))
    }
}

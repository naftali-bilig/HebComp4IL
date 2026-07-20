package ani.lehava.jclock.mobile

import java.security.MessageDigest

internal object NeedMeRegistry {
    private val identifierPattern = Regex(
        """(?:^|[,{\s])(ID|eID)\s*:\s*(["'])(.*?)\2""",
        setOf(RegexOption.IGNORE_CASE, RegexOption.DOT_MATCHES_ALL),
    )

    fun identifiers(script: String): Set<String> = identifierPattern.findAll(script)
        .map { normalize(it.groupValues[3]) }
        .filter { it.isNotEmpty() }
        .toSet()

    fun normalize(value: String): String = value
        .trim()
        .lowercase()
        .replace(Regex("\\s+"), " ")

    fun fingerprint(value: String): String = MessageDigest.getInstance("SHA-256")
        .digest(normalize(value).toByteArray(Charsets.UTF_8))
        .joinToString("") { byte -> "%02x".format(byte) }
}

package ani.lehava.jclock.mobile.music

import java.time.LocalDate
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test

class HebrewMelodyTrialPeriodTest {
    private val schedule = HebrewMelodySchedule()

    @Test
    fun trialPeriodChangesAtJClockHour23OnDay29() {
        val day29 = firstCivilDateWithHebrewDay(29)
        val resetAt = requireNotNull(schedule.roshChodeshEveResetAt(day29))
        val immediatelyBefore = resetAt.minusMillis(1)

        assertNotEquals(
            schedule.trialPeriodKey(immediatelyBefore),
            schedule.trialPeriodKey(resetAt),
        )
    }

    @Test
    fun day29DoesNotResetBeforeFinalDaytimeHour() {
        val day29 = firstCivilDateWithHebrewDay(29)
        val startOfDay29 = day29.atStartOfDay(schedule.zoneId).toInstant()
        val immediatelyBefore = requireNotNull(schedule.roshChodeshEveResetAt(day29)).minusMillis(1)

        assertEquals(
            schedule.trialPeriodKey(startOfDay29),
            schedule.trialPeriodKey(immediatelyBefore),
        )
    }

    @Test
    fun twoDayRoshChodeshDoesNotResetTwice() {
        val day30 = firstCivilDateWithHebrewDay(30)
        val startOfDay30 = day30.atStartOfDay(schedule.zoneId).toInstant()
        val startOfDay1 = day30.plusDays(1).atStartOfDay(schedule.zoneId).toInstant()

        assertEquals(
            schedule.trialPeriodKey(startOfDay30),
            schedule.trialPeriodKey(startOfDay1),
        )
    }

    private fun firstCivilDateWithHebrewDay(day: Int): LocalDate {
        var date = LocalDate.of(2026, 1, 1)
        repeat(800) {
            if (schedule.hebrewDateForCivilDate(date).day == day) return date
            date = date.plusDays(1)
        }
        error("No Hebrew day $day found in test range")
    }
}

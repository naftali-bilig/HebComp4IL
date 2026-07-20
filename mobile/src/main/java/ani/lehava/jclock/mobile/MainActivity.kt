package ani.lehava.jclock.mobile

import android.Manifest
import android.app.AlertDialog
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.OpenableColumns
import android.text.Editable
import android.text.InputFilter
import android.text.TextWatcher
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.ScrollView
import android.widget.SeekBar
import android.widget.Switch
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import ani.lehava.jclock.mobile.music.MelodyPlaybackController
import ani.lehava.jclock.mobile.music.MelodyPlayer
import com.google.android.gms.wearable.Wearable
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

class MainActivity : ComponentActivity() {
    private var selectedStopReceivedAt: Long? = null
    private var umidCalculator: UmidCalculator? = null
    private var umidCalculationEvent: Long? = null
    private var watchConnectionStatusView: TextView? = null
    private val connectionHandler = Handler(Looper.getMainLooper())
    private val connectionRefresh = object : Runnable {
        override fun run() {
            updateWatchConnectionStatus()
            connectionHandler.postDelayed(this, CONNECTION_REFRESH_MILLIS)
        }
    }
    private var enableMobileAfterPermission = false
    private val permission = registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) {
        val allowed = PhoneLocationRepository.hasLocationPermission(this)
        val shouldEnable = enableMobileAfterPermission
        enableMobileAfterPermission = false
        if (shouldEnable && allowed) {
            PhoneLocationRepository.setMobileLocationEnabled(this, true)
            MobileLocationService.start(this)
        } else if (!allowed && PhoneLocationRepository.isMobileLocationEnabled(this)) {
            PhoneLocationRepository.setMobileLocationEnabled(this, false)
            MobileLocationService.stop(this)
        } else if (allowed && PhoneLocationRepository.isMobileLocationEnabled(this)) {
            MobileLocationService.start(this)
        }
        render()
    }
    private val pickAudio = registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri == null) return@registerForActivityResult
        runCatching {
            contentResolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        MelodyPlaybackController.playLocal(this, uri, displayName(uri))
    }

    private var musicStatusView: TextView? = null
    private var musicToggleButton: Button? = null
    private val musicListener = MelodyPlaybackController.Listener { state ->
        runOnUiThread { showMusicState(state) }
    }

    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        title = "JClock · ניגון מכוון"
        val requested = mutableListOf<String>()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requested += Manifest.permission.POST_NOTIFICATIONS
        }
        if (requested.isNotEmpty()) permission.launch(requested.toTypedArray())
        ContextCompat.startForegroundService(this, Intent(this, ZeppLoopbackService::class.java))
        GarminConnectManager.start(applicationContext)
        MelodyPlaybackController.prepare(this)
        render()
        handleStoppedWatchTime()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleStoppedWatchTime()
    }

    override fun onStart() {
        super.onStart()
        if (
            PhoneLocationRepository.isMobileLocationEnabled(this) &&
            PhoneLocationRepository.hasLocationPermission(this)
        ) {
            MobileLocationService.start(this)
        }
        MelodyPlaybackController.addListener(musicListener)
        connectionHandler.removeCallbacks(connectionRefresh)
        connectionHandler.post(connectionRefresh)
    }

    override fun onStop() {
        connectionHandler.removeCallbacks(connectionRefresh)
        MelodyPlaybackController.removeListener(musicListener)
        super.onStop()
    }

    override fun onDestroy() {
        umidCalculator?.close()
        umidCalculator = null
        umidCalculationEvent = null
        super.onDestroy()
    }

    /** Selects a newly received frozen watch time without changing the authorized UMID. */
    private fun handleStoppedWatchTime() {
        val event = WatchEventRepository.read(this) ?: return
        val preferences = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
        if (preferences.getLong(KEY_HANDLED_WATCH_EVENT, 0L) == event.receivedAt) return
        val selectionChanged = selectedStopReceivedAt != event.receivedAt
        selectedStopReceivedAt = event.receivedAt
        preferences.edit()
            .putLong(KEY_HANDLED_WATCH_EVENT, event.receivedAt)
            .apply()
        if (selectionChanged) render()
    }

    private fun birthUrl(): String {
        val now = ZonedDateTime.now()
        return Uri.parse("https://jclock.net/BirthCalculator/public/he/index.html").buildUpon()
            .appendQueryParameter("date", now.format(DateTimeFormatter.ISO_LOCAL_DATE))
            .appendQueryParameter("time", now.format(DateTimeFormatter.ofPattern("HH:mm")))
            .appendQueryParameter("timeZone", now.zone.id)
            .appendQueryParameter("auto", "1")
            .build().toString()
    }

    private fun render() {
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutDirection = View.LAYOUT_DIRECTION_RTL
            setPadding(dp(28), dp(12), dp(28), dp(36))
        }
        layout.addView(sectionTitle("ניגון מכוון"))
        addMusicSection(layout)
        addWatchConnectionSection(layout)
        addWatchHistorySection(layout)
        addCurrentLearningSection(layout)
        addUmidSection(layout)
        addLegalSection(layout)

        layout.addView(Button(this).apply {
            text = "פתח יחידת לימוד"
            isAllCaps = false
            setOnClickListener {
                startActivity(JClockWebActivity.intent(this@MainActivity, birthUrl()))
            }
        })
        layout.addView(Button(this).apply {
            text = "שתף קישור ב־WhatsApp"
            isAllCaps = false
            setOnClickListener {
                val share = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_TEXT, birthUrl())
                    setPackage("com.whatsapp")
                }
                runCatching { startActivity(share) }.getOrElse {
                    startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_TEXT, birthUrl())
                    }, "שיתוף הקישור"))
                }
            }
        })
        val scroll = ScrollView(this).apply {
            isFillViewport = true
            addView(layout)
        }
        selectedCalculatedUmid()?.let { applyUmidTheme(scroll, it) }
        setContentView(scroll)
        showMusicState(MelodyPlaybackController.state)
    }

    private fun addCurrentLearningSection(parent: LinearLayout) {
        val event = WatchEventRepository.read(this) ?: return
        val links = LearningLinkDispatcher.links(event.body)
        parent.addView(sectionTitle("יחידת הלימוד הנוכחית"))

        val actions = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        actions.addView(Button(this).apply {
            text = "לימוד חמה"
            isAllCaps = false
            setOnClickListener {
                startActivity(JClockWebActivity.intent(this@MainActivity, links.sun.toString()))
            }
        }, weighted())
        actions.addView(Button(this).apply {
            text = "לימוד לבנה"
            isAllCaps = false
            setOnClickListener {
                startActivity(JClockWebActivity.intent(this@MainActivity, links.moon.toString()))
            }
        }, weighted())
        parent.addView(actions)
        parent.addView(Button(this).apply {
            text = "פתח לימוד אישי נוכחי"
            isAllCaps = false
            setOnClickListener {
                startActivity(
                    JClockWebActivity.intent(
                        this@MainActivity,
                        LearningLinkDispatcher.personalLearning(event.body).toString(),
                    ),
                )
            }
        })
    }

    private fun addWatchHistorySection(parent: LinearLayout) {
        val events = WatchEventRepository.readAll(this)
        parent.addView(sectionTitle("נקודות עצירה (${events.size}/18)"))
        if (events.isEmpty()) {
            selectedStopReceivedAt = null
            parent.addView(TextView(this).apply {
                text =
                "עדיין לא נשמרו נקודות עצירה. נקודה שתתקבל מהשעון תופיע כאן."
                textSize = 14f
                gravity = Gravity.CENTER
                setPadding(0, dp(4), 0, dp(8))
            })
            return
        }

        val selectedAt = selectedStopReceivedAt
            ?.takeIf { selected -> events.any { it.receivedAt == selected } }
            ?: events.first().receivedAt
        selectedStopReceivedAt = selectedAt

        val nameInput = EditText(this).apply {
            hint = "שם נקודת העצירה"
            filters = arrayOf(InputFilter.LengthFilter(80))
            setSingleLine(true)
            textDirection = View.TEXT_DIRECTION_RTL
        }
        val choices = RadioGroup(this).apply { orientation = RadioGroup.VERTICAL }
        events.forEachIndexed { index, event ->
            choices.addView(RadioButton(this).apply {
                id = View.generateViewId()
                tag = event.receivedAt
                val savedName = event.body.optString("stopName").trim()
                val prefix = if (savedName.isEmpty()) "נקודה ${index + 1}" else savedName
                text = "$prefix · ${event.date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))} · " +
                    event.time.format(DateTimeFormatter.ofPattern("HH:mm:ss"))
                isChecked = event.receivedAt == selectedAt
                textSize = 15f
            })
        }
        parent.addView(choices)

        fun selectedEvent(): WatchEventRepository.Event = events.first { event ->
            event.receivedAt == selectedStopReceivedAt
        }
        fun showSelectedName() {
            val savedName = selectedEvent().body.optString("stopName").trim()
            nameInput.setText(savedName)
            nameInput.setSelection(nameInput.text.length)
        }
        choices.setOnCheckedChangeListener { group, checkedId ->
            selectedStopReceivedAt = group.findViewById<RadioButton>(checkedId).tag as Long
            render()
        }
        showSelectedName()

        val calculatedUmid = selectedEvent().body.optString("calculatedUmid").trim().uppercase()
        parent.addView(TextView(this).apply {
            text = "UMID מחושב לנקודת העצירה שנבחרה"
            textSize = 14f
            gravity = Gravity.CENTER
            setPadding(0, dp(8), 0, dp(3))
        })
        parent.addView(EditText(this).apply {
            hint = "מחשב את ערך ה־UMID…"
            isSingleLine = true
            isFocusable = false
            isClickable = false
            keyListener = null
            textDirection = View.TEXT_DIRECTION_LTR
            setText(calculatedUmid.takeIf(UMID_PATTERN::matches).orEmpty())
            setTextIsSelectable(true)
        })
        parent.addView(TextView(this).apply {
            text = if (UMID_PATTERN.matches(calculatedUmid)) {
                "הערך מחושב מזמן העצירה ומשמש לצבעי עמוד ניגון מכוון בלבד"
            } else {
                "החישוב מתבצע כעת…"
            }
            textSize = 13f
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, dp(5))
        })
        calculateUmidIfNeeded(selectedEvent())

        parent.addView(nameInput)

        parent.addView(Button(this).apply {
            text = "שמור שם לנקודת העצירה"
            isAllCaps = false
            setOnClickListener {
                val receivedAt = selectedStopReceivedAt ?: return@setOnClickListener
                WatchEventRepository.updateName(this@MainActivity, receivedAt, nameInput.text.toString())
                render()
            }
        })

        val actions = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        actions.addView(Button(this).apply {
            text = "פתח חישוב"
            isAllCaps = false
            setOnClickListener {
                val event = saveSelectedStopName(selectedEvent(), nameInput.text.toString())
                startActivity(Intent(Intent.ACTION_VIEW, stopCalculatorUrl(event)))
            }
        }, weighted())
        actions.addView(Button(this).apply {
            text = "שלח ל־WhatsApp"
            isAllCaps = false
            setOnClickListener {
                val event = saveSelectedStopName(selectedEvent(), nameInput.text.toString())
                shareStopOnWhatsApp(event)
            }
        }, weighted())
        parent.addView(actions)
    }

    private fun saveSelectedStopName(
        event: WatchEventRepository.Event,
        name: String,
    ): WatchEventRepository.Event =
        WatchEventRepository.updateName(this, event.receivedAt, name) ?: event

    private fun calculateUmidIfNeeded(event: WatchEventRepository.Event) {
        val saved = event.body.optString("calculatedUmid").trim().uppercase()
        if (UMID_PATTERN.matches(saved)) {
            if (umidCalculationEvent != null && umidCalculationEvent != event.receivedAt) {
                umidCalculator?.close()
                umidCalculator = null
                umidCalculationEvent = null
            }
            return
        }
        if (umidCalculationEvent == event.receivedAt && umidCalculator != null) return

        umidCalculator?.close()
        umidCalculationEvent = event.receivedAt
        umidCalculator = UmidCalculator(this).also { calculator ->
            calculator.calculate(event) { result ->
                calculator.close()
                if (umidCalculator === calculator) umidCalculator = null
                if (umidCalculationEvent == event.receivedAt) umidCalculationEvent = null
                if (isFinishing || isDestroyed) return@calculate
                if (result == null || !UMID_PATTERN.matches(result.umid)) return@calculate

                WatchEventRepository.updateCalculatedUmid(this, event.receivedAt, result.umid)
                if (selectedStopReceivedAt == event.receivedAt) render()
            }
        }
    }

    private fun selectedCalculatedUmid(): String? {
        val selectedAt = selectedStopReceivedAt ?: return null
        return WatchEventRepository.readAll(this)
            .firstOrNull { it.receivedAt == selectedAt }
            ?.body
            ?.optString("calculatedUmid")
            ?.trim()
            ?.uppercase()
            ?.takeIf(UMID_PATTERN::matches)
    }

    private fun stopCalculatorUrl(event: WatchEventRepository.Event): Uri =
        Uri.parse("https://birthcalculator.web.app/").buildUpon()
            .appendQueryParameter("date", event.date.format(DateTimeFormatter.ISO_LOCAL_DATE))
            .appendQueryParameter("time", event.time.format(DateTimeFormatter.ISO_LOCAL_TIME))
            .appendQueryParameter("timeZone", event.timeZone.id)
            .appendQueryParameter("auto", "1")
            .apply {
                event.body.optString("stopName").trim().takeIf { it.isNotEmpty() }
                    ?.let { appendQueryParameter("name", it) }
            }
            .build()

    private fun shareStopOnWhatsApp(event: WatchEventRepository.Event) {
        val name = event.body.optString("stopName").trim().ifEmpty { "נקודת עצירה" }
        val url = stopCalculatorUrl(event)
        val message = buildString {
            append(name)
            append("\nתאריך: ")
            append(event.date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
            append("\nשעה: ")
            append(event.time.format(DateTimeFormatter.ofPattern("HH:mm:ss")))
            append("\nאזור זמן: ")
            append(event.timeZone.id)
            append("\n\nפתיחת החישוב ב־Birth Calculator:\n")
            append(url)
        }
        val share = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, message)
            setPackage("com.whatsapp")
        }
        runCatching { startActivity(share) }.getOrElse {
            startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_TEXT, message)
            }, "שיתוף נקודת העצירה"))
        }
    }

    private fun addWatchConnectionSection(parent: LinearLayout) {
        parent.addView(sectionTitle("חיבור לשעון"))
        watchConnectionStatusView = TextView(this).apply {
            text = "בודק את חיבורי השעונים…"
            textSize = 16f
            gravity = Gravity.CENTER
            setPadding(0, dp(5), 0, dp(8))
        }.also { parent.addView(it) }

        val preferences = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
        parent.addView(Switch(this).apply {
            text = "השאר את השעון דולק · CHEETAH / Galaxy"
            textSize = 16f
            isChecked = preferences.getBoolean(KEY_KEEP_WATCH_SCREEN_ON, false)
            setOnCheckedChangeListener { _, enabled ->
                preferences.edit().putBoolean(KEY_KEEP_WATCH_SCREEN_ON, enabled).apply()
                sendGalaxyDisplayPreference(enabled)
            }
        })
        parent.addView(TextView(this).apply {
            text = "ב־CHEETAH ההגדרה נקלטת בבדיקת החיבור הבאה; ב־Galaxy היא נשלחת מיד."
            textSize = 13f
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, dp(8))
        })

        val event = WatchEventRepository.read(this)
        if (event == null) {
            parent.addView(TextView(this).apply {
                text = "עדיין לא התקבלה נקודת עצירה. העצירה נשלחת מיד ואינה ממתינה לתשובה מהטלפון."
                textSize = 15f
                gravity = Gravity.CENTER
                setPadding(0, dp(5), 0, dp(10))
            })
            updateWatchConnectionStatus()
            return
        }

        val stoppedAt = "${event.date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))} · " +
            event.time.format(DateTimeFormatter.ofPattern("HH:mm:ss"))
        parent.addView(TextView(this).apply {
            text = "✓ הזמן התקבל מהשעון\n${event.sourceLabel}\nשעת העצירה: $stoppedAt"
            textSize = 17f
            gravity = Gravity.CENTER
            setTextColor(Color.rgb(29, 116, 62))
            setPadding(0, dp(5), 0, dp(7))
        })
        val links = LearningLinkDispatcher.links(event.body)
        val actions = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        actions.addView(Button(this).apply {
            text = "שעון חמה"
            isAllCaps = false
            setOnClickListener {
                startActivity(JClockWebActivity.intent(this@MainActivity, links.sun.toString()))
            }
        }, weighted())
        actions.addView(Button(this).apply {
            text = "שעון לבנה"
            isAllCaps = false
            setOnClickListener {
                startActivity(JClockWebActivity.intent(this@MainActivity, links.moon.toString()))
            }
        }, weighted())
        parent.addView(actions)
        parent.addView(Button(this).apply {
            text = "פתח לימוד אישי לפי שעת העצירה"
            isAllCaps = false
            setOnClickListener {
                startActivity(
                    JClockWebActivity.intent(
                        this@MainActivity,
                        LearningLinkDispatcher.personalLearning(event.body).toString(),
                    ),
                )
            }
        })
        updateWatchConnectionStatus()
    }

    private fun updateWatchConnectionStatus() {
        val target = watchConnectionStatusView ?: return
        GarminConnectManager.refresh()
        val cheetahConnected = WatchConnectionRepository.isCheetahConnected(this)
        val cheetahLine = if (cheetahConnected) {
            "CHEETAH: מחובר ל־JClock"
        } else {
            "CHEETAH: לא התקבלה תקשורת פעילה"
        }

        Wearable.getNodeClient(this).connectedNodes
            .addOnSuccessListener { nodes ->
                if (isFinishing || isDestroyed || watchConnectionStatusView !== target) return@addOnSuccessListener
                val galaxyLine = if (nodes.isEmpty()) {
                    "Galaxy / Wear OS: לא מחובר"
                } else {
                    "Galaxy / Wear OS: מחובר · ${nodes.joinToString { it.displayName }}"
                }
                val garminLine = GarminConnectManager.statusLine()
                target.text = "$cheetahLine\n$galaxyLine\n$garminLine"
                target.setTextColor(
                    if (cheetahConnected || nodes.isNotEmpty() || GarminConnectManager.isConnected()) {
                        Color.rgb(29, 116, 62)
                    }
                    else Color.rgb(180, 42, 42),
                )
            }
            .addOnFailureListener {
                if (watchConnectionStatusView === target) {
                    target.text = "$cheetahLine\nGalaxy / Wear OS: לא ניתן לבדוק כרגע\n${GarminConnectManager.statusLine()}"
                }
            }
    }

    private fun sendGalaxyDisplayPreference(enabled: Boolean) {
        val body = org.json.JSONObject().put("keepScreenOn", enabled).toString()
            .toByteArray(Charsets.UTF_8)
        Wearable.getNodeClient(this).connectedNodes.addOnSuccessListener { nodes ->
            nodes.forEach { node ->
                Wearable.getMessageClient(this).sendMessage(
                    node.id,
                    PhoneLocationService.DISPLAY_PREFERENCE_RESPONSE_PATH,
                    body,
                )
            }
        }
    }

    private fun addLocationSection(parent: LinearLayout) {
        parent.addView(sectionTitle("מיקום השעון"))
        val mobileEnabled = PhoneLocationRepository.isMobileLocationEnabled(this)
        val locationAllowed = PhoneLocationRepository.hasLocationPermission(this)
        parent.addView(Switch(this).apply {
            text = "מיקום נייד"
            textSize = 17f
            isChecked = mobileEnabled
            setOnCheckedChangeListener { _, enabled ->
                if (!enabled) {
                    enableMobileAfterPermission = false
                    PhoneLocationRepository.setMobileLocationEnabled(this@MainActivity, false)
                    MobileLocationService.stop(this@MainActivity)
                    render()
                } else if (PhoneLocationRepository.hasLocationPermission(this@MainActivity)) {
                    PhoneLocationRepository.setMobileLocationEnabled(this@MainActivity, true)
                    MobileLocationService.start(this@MainActivity)
                    render()
                } else {
                    enableMobileAfterPermission = true
                    permission.launch(locationPermissions())
                }
            }
        })
        parent.addView(TextView(this).apply {
            text = "במיקום קבוע, לחיצה על „מקומי” בשעון שומרת את מיקום הטלפון. " +
                "מיקום נייד מעדכן את החישוב לפי הטלפון כל 6 שניות."
            textSize = 14f
            gravity = Gravity.CENTER
            setPadding(0, dp(4), 0, dp(6))
        })
        parent.addView(TextView(this).apply {
            text = when {
                mobileEnabled && locationAllowed -> "מיקום נייד פעיל"
                mobileEnabled -> "יש לאשר הרשאת מיקום כדי להפעיל מיקום נייד"
                else -> "מיקום קבוע · המיקום נקלט רק בלחיצה על „מקומי” בשעון"
            }
            textSize = 13f
            gravity = Gravity.CENTER
        })
    }

    private fun addMusicSection(parent: LinearLayout) {
        parent.addView(sectionTitle("מנגינות החודש"))
        parent.addView(TextView(this).apply {
            text = "UMID מורשה מאפשר לנגן את כל מנגינות החודש. ללא UMID מורשה ניתן לשמוע מנגינת ניסיון אחת בכל חודש. האיפוס מתבצע ביום כ״ט בתחילת השעה הזמנית האחרונה לפני השקיעה (23:0000 לפי JClock). יש להפעיל תאריך ושעה אוטומטיים."
            textSize = 13f
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, dp(6))
        })
        musicStatusView = TextView(this).apply {
            textSize = 15f
            gravity = Gravity.CENTER
            setPadding(0, dp(4), 0, dp(8))
        }.also { parent.addView(it) }

        val controls = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        musicToggleButton = Button(this).apply {
            isAllCaps = false
            setOnClickListener { MelodyPlaybackController.toggle(this@MainActivity) }
        }.also { controls.addView(it, weighted()) }
        controls.addView(Button(this).apply {
            text = "דלג"
            isAllCaps = false
            setOnClickListener { MelodyPlaybackController.skip(this@MainActivity) }
        }, weighted())
        controls.addView(Button(this).apply {
            text = "קובץ מקומי"
            isAllCaps = false
            setOnClickListener { pickAudio.launch(arrayOf("audio/*")) }
        }, weighted())
        parent.addView(controls)

        parent.addView(TextView(this).apply {
            text = "עוצמה"
            textSize = 13f
        })
        parent.addView(SeekBar(this).apply {
            max = 100
            progress = MelodyPlaybackController.savedVolume(this@MainActivity)
            setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) = Unit
                override fun onStartTrackingTouch(seekBar: SeekBar?) = Unit
                override fun onStopTrackingTouch(seekBar: SeekBar?) {
                    MelodyPlaybackController.setVolume(this@MainActivity, seekBar?.progress ?: 70)
                }
            })
        })
    }

    private fun addUmidSection(parent: LinearLayout) {
        parent.addView(sectionTitle("האזור האישי · UMID"))
        parent.addView(TextView(this).apply {
            text = "UMID הוא מזהה של ארבעת צבעי הזמן האישיים — לא מזהה מכשיר. המבנה: שעת לבנה, יום לבנה, שעת חמה, יום חמה."
            textSize = 14f
            gravity = Gravity.CENTER
        })

        val preferences = getSharedPreferences(PREFERENCES, MODE_PRIVATE)
        val input = EditText(this).apply {
            hint = "24 תווי HEX, לדוגמה A1B2C3…"
            isSingleLine = true
            textDirection = View.TEXT_DIRECTION_LTR
            filters = arrayOf(InputFilter.AllCaps(), InputFilter.LengthFilter(24))
            setText(preferences.getString(KEY_UMID, ""))
        }
        parent.addView(input)
        val validation = TextView(this).apply {
            gravity = Gravity.CENTER
            textSize = 13f
        }
        parent.addView(validation)

        val swatchRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutDirection = View.LAYOUT_DIRECTION_RTL
        }
        val labels = listOf("שעת לבנה", "יום לבנה", "שעת חמה", "יום חמה")
        val swatches = labels.map { label ->
            TextView(this).apply {
                tag = UMID_SWATCH_TAG
                text = label
                gravity = Gravity.CENTER
                setPadding(dp(3), dp(12), dp(3), dp(12))
                swatchRow.addView(this, weighted())
            }
        }
        parent.addView(swatchRow)

        fun updateUmid(raw: String) {
            val normalized = raw.trim().uppercase()
            preferences.edit().putString(KEY_UMID, normalized).apply()
            val valid = UMID_PATTERN.matches(normalized)
            validation.text = if (valid) {
                "מבנה UMID תקין · ההרשאה תיבדק בעת הניגון"
            } else {
                "נדרשים בדיוק 24 תווי HEX ‏(0–9, A–F)"
            }
            validation.setTextColor(if (valid) Color.rgb(29, 116, 62) else Color.rgb(180, 42, 42))
            swatches.forEachIndexed { index, view ->
                val hex = if (valid) normalized.substring(index * 6, index * 6 + 6) else "D4D4D4"
                val color = Color.parseColor("#$hex")
                val label = labels[index]
                view.text = if (valid) "$label\n#$hex" else label
                view.setBackgroundColor(color)
                view.setTextColor(contrastColor(color))
            }
        }
        input.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(text: CharSequence?, start: Int, count: Int, after: Int) = Unit
            override fun onTextChanged(text: CharSequence?, start: Int, before: Int, count: Int) {
                updateUmid(text?.toString().orEmpty())
            }
            override fun afterTextChanged(text: Editable?) = Unit
        })
        updateUmid(input.text.toString())

        parent.addView(Button(this).apply {
            text = "חשב והעתק UMID ב־BirthCalculator"
            isAllCaps = false
            setOnClickListener {
                startActivity(
                    JClockWebActivity.intent(
                        this@MainActivity,
                        "https://jclock.net/BirthCalculator/public/he/index.html",
                    ),
                )
            }
        })
    }

    private fun addLegalSection(parent: LinearLayout) {
        parent.addView(sectionTitle("רישיון וזכויות"))
        parent.addView(TextView(this).apply {
            text = "המחבר והמפתח המתועד של JClock הוא נפתלי ביליג. " +
                "זכויות יוצרים בקוד נפרדות משאלת הפטנט; הודעות צד שלישי נשמרות במלואן."
            textSize = 14f
            gravity = Gravity.CENTER
            setPadding(0, dp(4), 0, dp(7))
        })
        parent.addView(Button(this).apply {
            text = "הצג רישיון והודעת זכויות"
            isAllCaps = false
            setOnClickListener { showLegalNotice() }
        })
    }

    private fun showLegalNotice() {
        val notice = runCatching {
            assets.open("legal/legal_notice_he.txt").bufferedReader(Charsets.UTF_8).use { it.readText() }
        }.getOrElse {
            "הודעת הרישיון אינה זמינה בחבילה זו."
        }
        val content = TextView(this).apply {
            text = notice
            textSize = 14f
            textDirection = View.TEXT_DIRECTION_RTL
            gravity = Gravity.START
            setTextIsSelectable(true)
            setPadding(dp(22), dp(12), dp(22), dp(12))
        }
        AlertDialog.Builder(this)
            .setTitle("ThirdTempale · רישיון וזכויות")
            .setView(ScrollView(this).apply { addView(content) })
            .setPositiveButton("סגור", null)
            .show()
    }

    private fun showMusicState(state: MelodyPlayer.State) {
        musicToggleButton?.text = if (MelodyPlaybackController.isPlaybackRequested) "השהה" else "נגן"
        musicStatusView?.text = when (state) {
            MelodyPlayer.State.Idle -> "מוכן"
            MelodyPlayer.State.LoadingCatalog -> "בודק את מנגינות החודש…"
            is MelodyPlayer.State.Downloading -> "מתחבר לניגון: ${state.name}"
            is MelodyPlayer.State.Playing -> "${state.name} · ${state.folder}"
            MelodyPlayer.State.Paused -> "מושהה"
            MelodyPlayer.State.TrialFinished ->
                "מנגינת הניסיון הסתיימה. ניתן להמתין לחצות שאחרי כ״ט בחודש העברי הבא או ליצור איתי קשר."
            is MelodyPlayer.State.Error -> "שגיאה: ${state.message}"
            MelodyPlayer.State.Closed -> "הופסק"
        }
    }

    private fun displayName(uri: Uri): String =
        contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use { cursor ->
            if (cursor.moveToFirst()) cursor.getString(0) else null
        } ?: uri.lastPathSegment ?: "קובץ מקומי"

    private fun sectionTitle(text: String) = TextView(this).apply {
        this.text = text
        textSize = 20f
        gravity = Gravity.CENTER
        setPadding(0, dp(18), 0, dp(7))
    }

    private fun weighted() = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)

    private fun contrastColor(color: Int): Int {
        val brightness = (Color.red(color) * 299 + Color.green(color) * 587 + Color.blue(color) * 114) / 1000
        return if (brightness >= 145) Color.BLACK else Color.WHITE
    }

    private fun applyUmidTheme(root: View, umid: String) {
        if (!UMID_PATTERN.matches(umid)) return

        val generalText = Color.parseColor("#${umid.substring(0, 6)}")
        val generalBackground = Color.parseColor("#${umid.substring(6, 12)}")
        val buttonText = Color.parseColor("#${umid.substring(12, 18)}")
        val buttonBackground = Color.parseColor("#${umid.substring(18, 24)}")

        fun style(view: View) {
            if (view.tag == UMID_SWATCH_TAG) return
            view.setBackgroundColor(generalBackground)
            when (view) {
                is Button -> {
                    view.setBackgroundColor(buttonBackground)
                    view.setTextColor(buttonText)
                }
                is TextView -> view.setTextColor(generalText)
            }
            if (view is android.view.ViewGroup) {
                for (index in 0 until view.childCount) style(view.getChildAt(index))
            }
        }
        style(root)
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    private fun locationPermissions(): Array<String> = arrayOf(
        Manifest.permission.ACCESS_FINE_LOCATION,
        Manifest.permission.ACCESS_COARSE_LOCATION,
    )

    companion object {
        private const val PREFERENCES = "jclock-personal"
        private const val KEY_UMID = "umid"
        private const val KEY_HANDLED_WATCH_EVENT = "handled_watch_event"
        private const val KEY_KEEP_WATCH_SCREEN_ON = "keep_watch_screen_on"
        private const val CONNECTION_REFRESH_MILLIS = 5_000L
        private val UMID_PATTERN = Regex("[0-9A-F]{24}")
        private const val UMID_SWATCH_TAG = "umid-swatch"
    }
}

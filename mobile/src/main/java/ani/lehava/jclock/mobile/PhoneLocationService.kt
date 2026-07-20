package ani.lehava.jclock.mobile

import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import ani.lehava.jclock.mobile.music.MelodyPlaybackController
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.Wearable
import com.google.android.gms.wearable.WearableListenerService
import org.json.JSONObject
import java.util.TimeZone

class PhoneLocationService : WearableListenerService() {
    override fun onMessageReceived(event: MessageEvent) {
        if (event.path == DISPLAY_PREFERENCE_REQUEST_PATH) {
            respond(
                event.sourceNodeId,
                JSONObject().put("keepScreenOn", keepWatchScreenOn()),
                DISPLAY_PREFERENCE_RESPONSE_PATH,
            )
            return
        }

        if (event.path == "/jclock/music/toggle") {
            MelodyPlaybackController.toggle(this)
            return
        }

        if (event.path == "/jclock/learning/open") {
            val body = runCatching {
                JSONObject(String(event.data, Charsets.UTF_8))
            }.getOrNull() ?: return
            LearningLinkDispatcher.forward(this, body)
            return
        }

        if (event.path != "/jclock/location/request") return
        val allowed =
            ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        if (!allowed) {
            respond(event.sourceNodeId, JSONObject().put("error", "יש לאפשר מיקום בטלפון"))
            return
        }

        LocationServices.getFusedLocationProviderClient(this)
            .getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, null)
            .addOnSuccessListener { location ->
                if (location == null) {
                    respond(event.sourceNodeId, JSONObject().put("error", "המיקום בטלפון אינו זמין"))
                } else {
                    respond(
                        event.sourceNodeId,
                        JSONObject()
                            .put("latitude", location.latitude)
                            .put("longitude", location.longitude)
                            .put("accuracy", location.accuracy)
                            .put("timeZone", TimeZone.getDefault().id)
                            .put("keepScreenOn", keepWatchScreenOn()),
                    )
                }
            }
            .addOnFailureListener {
                respond(event.sourceNodeId, JSONObject().put("error", "המיקום בטלפון אינו זמין"))
            }
    }

    private fun keepWatchScreenOn(): Boolean =
        getSharedPreferences("jclock-personal", MODE_PRIVATE)
            .getBoolean("keep_watch_screen_on", false)

    private fun respond(
        node: String,
        body: JSONObject,
        path: String = "/jclock/location/response",
    ) {
        Wearable.getMessageClient(this).sendMessage(
            node,
            path,
            body.toString().toByteArray(),
        )
    }

    companion object {
        const val DISPLAY_PREFERENCE_REQUEST_PATH = "/jclock/display/preference/request"
        const val DISPLAY_PREFERENCE_RESPONSE_PATH = "/jclock/display/preference/response"
    }
}

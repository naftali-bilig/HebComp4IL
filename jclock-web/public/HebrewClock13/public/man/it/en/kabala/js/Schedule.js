function isScheduleMode() {
    var url = new URL(document.location.href);
    return url.searchParams.get("isSchedule") === "true";
}

function scheduleFunction() {
    if (!isScheduleMode()) {
        return;
    }

    document.body.className += " schedule-mode";
    ensureScheduleMessage();
}

function ensureScheduleMessage() {
    if (document.getElementById("schedule_mode_message")) {
        return;
    }

    var message = document.createElement("div");
    message.id = "schedule_mode_message";
    message.style.textAlign = "center";
    message.style.marginBottom = "10px";
    message.style.fontFamily = "Arial, Helvetica, sans-serif";
    message.innerHTML = "Schedule mode";

    var container = document.getElementById("container");
    var clockRow = document.getElementById("Hour");
    if (container && clockRow && clockRow.parentNode) {
        container.insertBefore(message, clockRow.parentNode.parentNode);
    }
}

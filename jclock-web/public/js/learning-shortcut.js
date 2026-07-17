(function () {
    "use strict";

    var periods = {
        "חצות": "dovid",
        "בוקר": "month",
        "צהריים": "year",
        "ערב": "yovel"
    };

    var pathParts = decodeURIComponent(window.location.pathname)
        .split("/")
        .filter(Boolean);
    var gender = pathParts[0];
    var period = periods[pathParts[1]];
    var isNow = pathParts[1] === "now";

    if ((gender !== "man" && gender !== "woman") || (!period && !isNow)) {
        window.location.replace("/");
        return;
    }

    var destination = new URL(
        "/HebrewClock13/public/" + gender + "/me/he/index.html",
        window.location.origin
    );

    if (!isNow) {
        var mazal = getCurrentMazal(period);
        destination.searchParams.set("period", period);
        destination.searchParams.set("hebrewDay", mazal[0]);
        destination.searchParams.set("hebrewHour", mazal[1]);
        destination.searchParams.set("hebrewChelek", mazal[2]);
    } else {
        destination.searchParams.set("shortcut", "now");
    }

    ["longitude", "latitude"].forEach(function (name) {
        var value = new URL(window.location.href).searchParams.get(name);
        if (value !== null) {
            destination.searchParams.set(name, value);
        }
    });

    window.location.replace(destination.href);
}());

(function(root) {
    var JERUSALEM_TIME_ZONE = "Asia/Jerusalem";
    var JERUSALEM_LATITUDE = 31.7768514;
    var JERUSALEM_LONGITUDE = 35.2331664;

    function getBrowserTimeZone() {
        try {
            if(root.Intl && Intl.DateTimeFormat) {
                var options = Intl.DateTimeFormat().resolvedOptions();
                if(options && options.timeZone)
                    return options.timeZone;
            }
        }
        catch(error) {
            console.warn("Could not read browser time zone", error);
        }

        return JERUSALEM_TIME_ZONE;
    }

    function initializeJerusalemKabalaTime() {
        var url = new URL(root.document.location.href);
        root.clockTimeZone = JERUSALEM_TIME_ZONE;
        root.displayTimeZone = getBrowserTimeZone() || url.searchParams.get("displayTimeZone") || JERUSALEM_TIME_ZONE;
        root.displayLatitude = JERUSALEM_LATITUDE;
        root.displayLongitude = JERUSALEM_LONGITUDE;

        if(root.BirthCalculatorTime && typeof BirthCalculatorTime.getTimeZoneOffsetHours == "function")
            root.tz = BirthCalculatorTime.getTimeZoneOffsetHours(new Date(), JERUSALEM_TIME_ZONE);
    }

    function formatScheduleTimeForDisplay(clockHour, baseDate, useAmPm) {
        if(!root.displayTimeZone || root.displayTimeZone == JERUSALEM_TIME_ZONE ||
            !root.BirthCalculatorTime ||
            typeof BirthCalculatorTime.zonedLocalTimeToUtc != "function" ||
            typeof BirthCalculatorTime.getZonedParts != "function")
        {
            return root.timeadj(clockHour, useAmPm);
        }

        var sourceParts = getScheduleWallParts(clockHour, baseDate);
        var utcDate = BirthCalculatorTime.zonedLocalTimeToUtc(
            sourceParts.year,
            sourceParts.month,
            sourceParts.day,
            sourceParts.hour,
            sourceParts.minute,
            JERUSALEM_TIME_ZONE
        );
        var displayParts = BirthCalculatorTime.getZonedParts(utcDate, root.displayTimeZone);

        return formatRegularTime(displayParts.hour, displayParts.minute, useAmPm);
    }

    function getScheduleWallParts(clockHour, baseDate) {
        var totalMinutes = Math.round(clockHour * 60);
        var wallDate = new Date(Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()));
        wallDate = new Date(wallDate.getTime() + (totalMinutes * 60 * 1000));

        return {
            year: wallDate.getUTCFullYear(),
            month: wallDate.getUTCMonth() + 1,
            day: wallDate.getUTCDate(),
            hour: wallDate.getUTCHours(),
            minute: wallDate.getUTCMinutes()
        };
    }

    function formatRegularTime(hour, minute, useAmPm) {
        var ampmString = "";
        if(useAmPm)
        {
            ampmString = hour > 11 ? " PM" : " AM";
            hour %= 12;
            hour = hour < 1 ? 12 : hour;
        }

        return hour + ":" + (minute < 10 ? "0" : "") + minute + ampmString;
    }

    function forceJerusalemLearningParams(url) {
        url.searchParams.set("latitude", String(JERUSALEM_LATITUDE));
        url.searchParams.set("longitude", String(JERUSALEM_LONGITUDE));
        url.searchParams.set("timeZone", JERUSALEM_TIME_ZONE);
        if(root.displayTimeZone)
            url.searchParams.set("displayTimeZone", root.displayTimeZone);
    }

    root.initializeJerusalemKabalaTime = initializeJerusalemKabalaTime;
    root.formatScheduleTimeForDisplay = formatScheduleTimeForDisplay;
    root.forceJerusalemLearningParams = forceJerusalemLearningParams;
    initializeJerusalemKabalaTime();
})(window);

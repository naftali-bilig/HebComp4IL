(function(root) {
    var JERUSALEM_TIME_ZONE = "Asia/Jerusalem";
    var JERUSALEM_LATITUDE = 31.7768514;
    var JERUSALEM_LONGITUDE = 35.2331664;
    var JERUSALEM_TIME_API_URL = "https://timeapi.io/api/TimeZone/zone?timeZone=Asia/Jerusalem";
    var JERUSALEM_TIME_FALLBACK_API_URL = "https://worldtimeapi.org/api/timezone/Asia/Jerusalem";
    var JERUSALEM_TIME_TIMEOUT_MS = 4000;
    var JERUSALEM_TIME_RETRY_MS = 15000;
    var LOCAL_CLOCK_DRIFT_WARNING_MS = 60 * 1000;
    var JERUSALEM_TIME_MAX_DRIFT_MS = 15 * 1000;
    var ASTRONOMY_DAY_MS = 1000 * 60 * 60 * 24;
    var J1970 = 2440588;
    var J2000 = 2451545;
    var RAD = Math.PI / 180;
    var jerusalemWomanTimeRetryTimer = null;
    var CURRENT_LOCATION_STORAGE_KEY = "JClock.Simple.CurrentLocation";
    var TZIET_ALTERNATE_MS = 6000;
    var CURRENT_LOCATION_REFRESH_MS = 10 * 60 * 1000;
    var JERUSALEM_LOCATION_TOLERANCE_DEGREES = 0.25;
    var tzietJerusalemDisplayValue = "";
    var tzietCurrentLocationDisplayValue = "";
    var tzietAlternateShowCurrent = false;
    var tzietAlternateTimer = null;
    var tzietCurrentLocationRequestStarted = false;
    var tzietCurrentLocationDenied = false;
    var tzietCurrentLocationRefreshRequested = false;
    var tzietCurrentLocationCacheKey = "";
    var tzietLastBaseDate = null;
    var tzietLastUseAmPm = false;
    var tzietLastElementId = "tziet";
    var JERUSALEM_TIME_SERVICES = [
        { name: "timeapi.io", url: JERUSALEM_TIME_API_URL, apply: applyTimeApiJerusalemTime },
        { name: "worldtimeapi.org", url: JERUSALEM_TIME_FALLBACK_API_URL, apply: applyWorldTimeApiJerusalemTime }
    ];

    function initializeJerusalemWomanKabalaTime() {
        var url = new URL(root.document.location.href);

        root.JERUSALEM_TIME_ZONE = JERUSALEM_TIME_ZONE;
        root.JERUSALEM_LATITUDE = JERUSALEM_LATITUDE;
        root.JERUSALEM_LONGITUDE = JERUSALEM_LONGITUDE;
        root.TEMPLE_MOUNT_LATITUDE = JERUSALEM_LATITUDE;
        root.TEMPLE_MOUNT_LONGITUDE = JERUSALEM_LONGITUDE;
        root.clockTimeZone = JERUSALEM_TIME_ZONE;
        root.displayTimeZone = getLocalDisplayTimeZone() || url.searchParams.get("displayTimeZone") || JERUSALEM_TIME_ZONE;
        root.latitude = JERUSALEM_LATITUDE;
        root.longitude = JERUSALEM_LONGITUDE;

        readClockParams(url);

        if(root.BirthCalculatorTime && typeof BirthCalculatorTime.getTimeZoneOffsetHours == "function")
            root.tz = BirthCalculatorTime.getTimeZoneOffsetHours(new Date(), JERUSALEM_TIME_ZONE);
        else if(typeof root.tz == "undefined")
            root.tz = 2;

    }

    function readClockParams(url) {
        root.birthYear = url.searchParams.get("year");
        root.birthMonth = url.searchParams.get("month");
        root.birthDay = url.searchParams.get("day");
        root.birthHour = url.searchParams.get("hour");
        root.birthMin = url.searchParams.get("min") || url.searchParams.get("minute");
        root.birthSec = url.searchParams.get("sec");
        root.birthMs = url.searchParams.get("ms");
        root.birthGMT = url.searchParams.get("gmt");
        root.clockLive = url.searchParams.get("live");
        root.clockLiveStart = url.searchParams.get("liveStart");
    }

    function getLocalDisplayTimeZone() {
        try {
            if(root.Intl && typeof Intl.DateTimeFormat == "function") {
                var options = Intl.DateTimeFormat().resolvedOptions();
                if(options && options.timeZone)
                    return options.timeZone;
            }
        }
        catch(error) {
            console.warn("Could not read browser display time zone", error);
        }

        return "";
    }

    function verifyJerusalemTimeSafely(callback) {
        if(typeof root.fetch != "function") {
            showJerusalemTimeSyncError();
            scheduleJerusalemTimeRetry(callback);
            return;
        }

        fetchJerusalemTimeService(0, callback);
    }

    function fetchJerusalemTimeService(serviceIndex, callback) {
        if(serviceIndex >= JERUSALEM_TIME_SERVICES.length) {
            showJerusalemTimeSyncError();
            scheduleJerusalemTimeRetry(callback);
            return;
        }

        var service = JERUSALEM_TIME_SERVICES[serviceIndex];
        var timeoutId = null;
        var requestStartedAt = getSteadyNowMilliseconds();
        var fetchOptions = { cache: "no-store" };
        if(typeof root.AbortController == "function") {
            var controller = new AbortController();
            fetchOptions.signal = controller.signal;
            timeoutId = setTimeout(function() {
                controller.abort();
            }, JERUSALEM_TIME_TIMEOUT_MS);
        }

        root.fetch(service.url, fetchOptions)
            .then(function(response) {
                if(!response.ok)
                    throw new Error(service.name + " Jerusalem time request failed: " + response.status);
                return response.json();
            })
            .then(function(data) {
                if(timeoutId)
                    clearTimeout(timeoutId);
                if(!service.apply(data, requestStartedAt))
                    console.warn("Ignoring stale Jerusalem time from " + service.name);
                if(jerusalemWomanTimeRetryTimer)
                    clearTimeout(jerusalemWomanTimeRetryTimer);
                callback();
            })
            .catch(function(error) {
                if(timeoutId)
                    clearTimeout(timeoutId);
                console.warn("Could not verify Jerusalem time from " + service.name, error);
                fetchJerusalemTimeService(serviceIndex + 1, callback);
            });
    }

    function applyTimeApiJerusalemTime(data, requestStartedAt) {
        var offsetSeconds = Number(data && data.currentUtcOffset && data.currentUtcOffset.seconds);
        var localMilliseconds = parseLocalDateTimeAsUtcMilliseconds(data && data.currentLocalTime);
        if(!Number.isFinite(offsetSeconds) || !Number.isFinite(localMilliseconds))
            throw new Error("Invalid Jerusalem time response.");

        return storeVerifiedJerusalemTime(localMilliseconds - (offsetSeconds * 1000), offsetSeconds, requestStartedAt);
    }

    function applyWorldTimeApiJerusalemTime(data, requestStartedAt) {
        var utcMilliseconds = Date.parse(data && data.utc_datetime);
        var offsetSeconds = Number(data && data.raw_offset) + Number(data && data.dst_offset);

        if(!Number.isFinite(offsetSeconds))
            offsetSeconds = parseOffsetSecondsFromDateTime(data && data.datetime);
        if(!Number.isFinite(utcMilliseconds) || !Number.isFinite(offsetSeconds))
            throw new Error("Invalid Jerusalem fallback time response.");

        return storeVerifiedJerusalemTime(utcMilliseconds, offsetSeconds, requestStartedAt);
    }

    function storeVerifiedJerusalemTime(serviceUtcMilliseconds, offsetSeconds, requestStartedAt) {
        var receivedAt = getSteadyNowMilliseconds();
        var roundTripMilliseconds = Math.max(0, receivedAt - requestStartedAt);
        var adjustedServiceUtcMilliseconds = serviceUtcMilliseconds + Math.round(roundTripMilliseconds / 2);
        var localClockDriftMilliseconds = adjustedServiceUtcMilliseconds - Date.now();

        root.tz = offsetSeconds / 3600;
        if(Math.abs(localClockDriftMilliseconds) > JERUSALEM_TIME_MAX_DRIFT_MS) {
            root.verifiedJerusalemTime = null;
            console.warn("Ignoring stale Jerusalem time; drift is " + localClockDriftMilliseconds + "ms");
            return false;
        }

        root.verifiedJerusalemTime = {
            utcMilliseconds: adjustedServiceUtcMilliseconds,
            offsetSeconds: offsetSeconds,
            receivedAtMilliseconds: receivedAt,
            localClockDriftMilliseconds: localClockDriftMilliseconds
        };

        if(Math.abs(root.verifiedJerusalemTime.localClockDriftMilliseconds) > LOCAL_CLOCK_DRIFT_WARNING_MS)
            console.warn("Local clock differs from verified Jerusalem time by " + root.verifiedJerusalemTime.localClockDriftMilliseconds + "ms");
        return true;
    }

    function parseOffsetSecondsFromDateTime(value) {
        var match = /([+-])(\d{2}):(\d{2})$/.exec(value || "");
        if(!match)
            return NaN;

        var sign = match[1] == "-" ? -1 : 1;
        return sign * ((Number(match[2]) * 60 * 60) + (Number(match[3]) * 60));
    }

    function showJerusalemTimeSyncError() {
        var target = root.document && root.document.getElementById ? root.document.getElementById("Mazal") : null;
        if(target)
            target.innerText = "\u05de\u05de\u05ea\u05d9\u05df \u05dc\u05e1\u05e0\u05db\u05e8\u05d5\u05df \u05d6\u05de\u05df \u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd";
    }

    function scheduleJerusalemTimeRetry(callback) {
        if(jerusalemWomanTimeRetryTimer)
            clearTimeout(jerusalemWomanTimeRetryTimer);

        jerusalemWomanTimeRetryTimer = setTimeout(function() {
            verifyJerusalemTimeSafely(callback);
        }, JERUSALEM_TIME_RETRY_MS);
    }

    function parseLocalDateTimeAsUtcMilliseconds(value) {
        if(!value)
            return NaN;

        var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?/.exec(value);
        if(!match)
            return NaN;

        var milliseconds = 0;
        if(match[7])
            milliseconds = Number((match[7] + "000").slice(0, 3));

        return Date.UTC(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3]),
            Number(match[4]),
            Number(match[5]),
            Number(match[6]),
            milliseconds
        );
    }

    function getSteadyNowMilliseconds() {
        if(root.performance && typeof root.performance.now == "function")
            return root.performance.now();

        return Date.now();
    }

    function getVerifiedUtcNow() {
        if(!root.verifiedJerusalemTime)
            return new Date();

        return new Date(root.verifiedJerusalemTime.utcMilliseconds + (getSteadyNowMilliseconds() - root.verifiedJerusalemTime.receivedAtMilliseconds));
    }

    function getCurrentClockDate() {
        return new Date(getCurrentClockUtcDate().getTime());
    }

    function getCurrentClockUtcDate() {
        if(isLiveClock() && hasExplicitClockDateTime())
            return getLiveClockUtcDate();

        if(hasExplicitClockDateTime())
            return getExplicitClockUtcDate();

        return getVerifiedUtcNow();
    }

    function getCurrentClockWallDate() {
        return getClockWallDate(getCurrentClockUtcDate(), JERUSALEM_TIME_ZONE);
    }

    function getCurrentMoonCalculationDate() {
        var wallDate = getCurrentClockWallDate();
        return new Date(wallDate.getFullYear(), wallDate.getMonth(), wallDate.getDate(), 12, 0, 0, 0);
    }

    function isLiveClock() {
        return root.clockLive != null && root.clockLive != "0" && root.clockLive != "false";
    }

    function hasExplicitClockDateTime() {
        return root.birthYear != null && root.birthMonth != null && root.birthDay != null && root.birthHour != null;
    }

    function getExplicitClockUtcDate() {
        if(root.BirthCalculatorTime && typeof BirthCalculatorTime.zonedLocalTimeToUtc == "function") {
            var utcDate = BirthCalculatorTime.zonedLocalTimeToUtc(
                Number(root.birthYear),
                Number(root.birthMonth),
                Number(root.birthDay),
                Number(root.birthHour),
                Number(root.birthMin || 0),
                JERUSALEM_TIME_ZONE
            );
            return new Date(utcDate.getTime() + (Number(root.birthSec || 0) * 1000) + Number(root.birthMs || 0));
        }

        return new Date(
            Number(root.birthYear),
            Number(root.birthMonth) - 1,
            Number(root.birthDay),
            Number(root.birthHour),
            Number(root.birthMin || 0),
            Number(root.birthSec || 0),
            Number(root.birthMs || 0)
        );
    }

    function getLiveClockUtcDate() {
        var liveStartMilliseconds = Number(root.clockLiveStart);
        var elapsedMilliseconds = Number.isFinite(liveStartMilliseconds) ? getVerifiedUtcNow().getTime() - liveStartMilliseconds : 0;
        return new Date(getExplicitClockUtcDate().getTime() + elapsedMilliseconds);
    }

    function getClockWallDate(utcDate, timeZone) {
        if(root.BirthCalculatorTime && typeof BirthCalculatorTime.getZonedParts == "function") {
            var parts = getClockZonedParts(utcDate, timeZone);
            return new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second || 0, utcDate.getMilliseconds());
        }

        return utcDate;
    }

    function getClockZonedParts(date, timeZone) {
        if(root.BirthCalculatorTime && typeof BirthCalculatorTime.getZonedParts == "function") {
            var parts = BirthCalculatorTime.getZonedParts(date, timeZone || JERUSALEM_TIME_ZONE);
            parts.millisecond = date.getMilliseconds();
            return parts;
        }

        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            millisecond: date.getMilliseconds()
        };
    }

    function getZonedPartsForClock(date) {
        return getClockZonedParts(date, JERUSALEM_TIME_ZONE);
    }

    function formatDateTimeForDisplay(date, useAmPm) {
        if(!date || !Number.isFinite(date.getTime()))
            return "";

        var parts = getClockZonedParts(date, root.displayTimeZone || JERUSALEM_TIME_ZONE);
        return formatRegularTime(parts.hour, parts.minute, useAmPm);
    }

    function formatScheduleTimeForDisplay(clockHour, baseDate, useAmPm) {
        if(!baseDate || !Number.isFinite(clockHour))
            return root.timeadj(clockHour, useAmPm);

        if(!root.BirthCalculatorTime ||
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

        return formatDateTimeForDisplay(utcDate, useAmPm);
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
        if(useAmPm) {
            ampmString = hour > 11 ? " PM" : " AM";
            hour %= 12;
            hour = hour < 1 ? 12 : hour;
        }

        return hour + ":" + (minute < 10 ? "0" : "") + minute + ampmString;
    }

    function setSolarTzietDisplay(elementId, baseDate, useAmPm) {
        var calculationDate = normalizeTzietBaseDate(baseDate);
        var clockHour = getSolarTzietClockHourForLocation(
            calculationDate,
            JERUSALEM_LATITUDE,
            JERUSALEM_LONGITUDE,
            JERUSALEM_TIME_ZONE
        );

        if(!Number.isFinite(clockHour))
            return false;

        var displayValue = formatTzietClockHour(clockHour, useAmPm);
        setTzietAlternatingValues(elementId || "tziet", displayValue, clockHour, calculationDate, useAmPm);
        return true;
    }

    function normalizeTzietBaseDate(baseDate) {
        if(baseDate && Number.isFinite(baseDate.getTime()))
            return baseDate;

        return getCurrentClockWallDate();
    }

    function getSolarTzietClockHourForLocation(baseDate, locationLatitude, locationLongitude, timeZone) {
        if(typeof root.suntime != "function")
            return NaN;

        var offsetHours = getOffsetHoursForTzietDate(baseDate, timeZone || JERUSALEM_TIME_ZONE);
        var locationParts = getSuntimeLocationParts(locationLatitude, locationLongitude);
        var time = root.suntime(
            baseDate.getDate(),
            baseDate.getMonth() + 1,
            baseDate.getYear(),
            96,
            0,
            locationParts.lngd,
            locationParts.lngm,
            locationParts.ewi,
            locationParts.latd,
            locationParts.latm,
            locationParts.nsi,
            -(12 - offsetHours)
        );

        if(time && time[1] == 0)
            return time[3];

        return NaN;
    }

    function setTzietAlternatingValues(elementId, jerusalemValue, clockHour, baseDate, useAmPm) {
        tzietLastElementId = elementId || "tziet";
        tzietJerusalemDisplayValue = jerusalemValue;
        tzietLastBaseDate = new Date(baseDate.getTime());
        tzietLastUseAmPm = !!useAmPm;
        updateCurrentLocationTzietValue(clockHour, baseDate, useAmPm);
        ensureTzietAlternatingDisplay();
        renderTzietAlternatingDisplay();
    }

    function updateCurrentLocationTzietValue(clockHour, baseDate, useAmPm) {
        var storedLocation = getStoredCurrentLocationForTziet();
        if(!storedLocation) {
            requestCurrentLocationForTziet();
            return;
        }

        var locationTimeZone = getTimeZoneForTzietLocation(storedLocation);
        if(shouldIgnoreStoredLocationForTziet(storedLocation, locationTimeZone)) {
            tzietCurrentLocationDisplayValue = "";
            requestCurrentLocationForTziet();
            return;
        }

        if(shouldRefreshStoredCurrentLocation(storedLocation))
            requestCurrentLocationForTziet();

        var cacheKey = [
            storedLocation.latitude,
            storedLocation.longitude,
            root.displayTimeZone,
            locationTimeZone,
            getTzietDateKey(baseDate),
            useAmPm ? "1" : "0"
        ].join("|");

        if(cacheKey == tzietCurrentLocationCacheKey)
            return;

        tzietCurrentLocationCacheKey = cacheKey;
        tzietCurrentLocationDisplayValue = calculateCurrentLocationTzietDisplay(storedLocation, baseDate, locationTimeZone, useAmPm);
    }

    function getStoredCurrentLocationForTziet() {
        try {
            if(!root.localStorage)
                return null;

            var storedValue = root.localStorage.getItem(CURRENT_LOCATION_STORAGE_KEY);
            if(!storedValue)
                return null;

            var storedLocation = JSON.parse(storedValue);
            var storedLatitude = Number(storedLocation.latitude);
            var storedLongitude = Number(storedLocation.longitude);
            if(!Number.isFinite(storedLatitude) || !Number.isFinite(storedLongitude))
                return null;

            return {
                latitude: storedLatitude,
                longitude: storedLongitude,
                accuracy: Number(storedLocation.accuracy) || null,
                savedAt: Number(storedLocation.savedAt) || null,
                timeZone: storedLocation.timeZone || ""
            };
        }
        catch(error) {
            console.warn("Could not read saved current location for tzeit", error);
            return null;
        }
    }

    function requestCurrentLocationForTziet() {
        if(tzietCurrentLocationRequestStarted || tzietCurrentLocationDenied || tzietCurrentLocationRefreshRequested ||
            typeof root.navigator == "undefined" || !root.navigator.geolocation)
            return;

        tzietCurrentLocationRefreshRequested = true;
        tzietCurrentLocationRequestStarted = true;
        root.navigator.geolocation.getCurrentPosition(function(position) {
            saveCurrentLocationForTziet(position);
            tzietCurrentLocationRequestStarted = false;
            tzietCurrentLocationDenied = false;
            tzietCurrentLocationCacheKey = "";
            if(tzietLastBaseDate) {
                updateCurrentLocationTzietValue(null, tzietLastBaseDate, tzietLastUseAmPm);
                renderTzietAlternatingDisplay();
            }
        }, function(error) {
            tzietCurrentLocationRequestStarted = false;
            tzietCurrentLocationDenied = true;
            console.warn("Could not get current location for tzeit", error);
            renderTzietAlternatingDisplay();
        });
    }

    function saveCurrentLocationForTziet(position) {
        if(!position || !position.coords)
            return;

        var currentLatitude = Number(position.coords.latitude);
        var currentLongitude = Number(position.coords.longitude);
        if(!Number.isFinite(currentLatitude) || !Number.isFinite(currentLongitude))
            return;

        var currentTimeZone = "";
        try {
            if(root.BirthCalculatorTime && typeof BirthCalculatorTime.getSelectedTimeZone == "function")
                currentTimeZone = BirthCalculatorTime.getSelectedTimeZone(currentLatitude, currentLongitude);
        }
        catch(error) {
            currentTimeZone = getLocalDisplayTimeZone() || "";
        }

        try {
            if(root.localStorage) {
                root.localStorage.setItem(CURRENT_LOCATION_STORAGE_KEY, JSON.stringify({
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                    accuracy: Number(position.coords.accuracy) || null,
                    savedAt: Date.now(),
                    timeZone: currentTimeZone
                }));
            }
        }
        catch(error) {
            console.warn("Could not save current location for tzeit", error);
        }
    }

    function calculateCurrentLocationTzietDisplay(storedLocation, baseDate, locationTimeZone, useAmPm) {
        var clockHour = getSolarTzietClockHourForLocation(
            baseDate,
            storedLocation.latitude,
            storedLocation.longitude,
            locationTimeZone
        );

        if(!Number.isFinite(clockHour))
            return "";

        return formatTzietClockHour(clockHour, useAmPm);
    }

    function getTimeZoneForTzietLocation(storedLocation) {
        if(storedLocation && storedLocation.timeZone)
            return storedLocation.timeZone;

        try {
            if(root.BirthCalculatorTime && typeof BirthCalculatorTime.getSelectedTimeZone == "function")
                return BirthCalculatorTime.getSelectedTimeZone(storedLocation.latitude, storedLocation.longitude);
        }
        catch(error) {
            console.warn("Could not resolve current location time zone for tzeit", error);
        }

        return root.displayTimeZone || JERUSALEM_TIME_ZONE;
    }

    function shouldIgnoreStoredLocationForTziet(storedLocation, locationTimeZone) {
        var browserTimeZone = getLocalDisplayTimeZone();
        if(!browserTimeZone || browserTimeZone == JERUSALEM_TIME_ZONE)
            return false;

        return locationTimeZone == JERUSALEM_TIME_ZONE && isNearJerusalem(storedLocation);
    }

    function shouldRefreshStoredCurrentLocation(storedLocation) {
        if(tzietCurrentLocationRefreshRequested)
            return false;

        if(!storedLocation.savedAt)
            return true;

        return Date.now() - storedLocation.savedAt > CURRENT_LOCATION_REFRESH_MS;
    }

    function isNearJerusalem(location) {
        return Math.abs(Number(location.latitude) - JERUSALEM_LATITUDE) < JERUSALEM_LOCATION_TOLERANCE_DEGREES &&
            Math.abs(Number(location.longitude) - JERUSALEM_LONGITUDE) < JERUSALEM_LOCATION_TOLERANCE_DEGREES;
    }

    function getOffsetHoursForTzietDate(baseDate, timeZone) {
        if(root.BirthCalculatorTime && typeof BirthCalculatorTime.getTimeZoneOffsetHours == "function") {
            var noon = new Date(Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 12, 0, 0));
            return BirthCalculatorTime.getTimeZoneOffsetHours(noon, timeZone || JERUSALEM_TIME_ZONE);
        }

        return getJerusalemOffsetHoursForCivilDate(getCivilDatePartsFromWallDate(baseDate));
    }

    function getSuntimeLocationParts(locationLatitude, locationLongitude) {
        var absoluteLatitude = Math.abs(locationLatitude);
        var absoluteLongitude = Math.abs(locationLongitude);
        var locationLatd = Math.floor(absoluteLatitude);
        var locationLngd = Math.floor(absoluteLongitude);

        return {
            latd: locationLatd,
            latm: (absoluteLatitude - locationLatd) * 60,
            nsi: locationLatitude >= 0 ? 0 : 1,
            lngd: locationLngd,
            lngm: (absoluteLongitude - locationLngd) * 60,
            ewi: locationLongitude >= 0 ? 1 : 0
        };
    }

    function getTzietDateKey(baseDate) {
        return baseDate.getFullYear() + "-" + (baseDate.getMonth() + 1) + "-" + baseDate.getDate();
    }

    function formatTzietClockHour(clockHour, useAmPm) {
        if(typeof root.timeadj == "function")
            return root.timeadj(clockHour, useAmPm);

        var hour = Math.floor(clockHour);
        var minute = Math.floor((clockHour - hour) * 60.0 + 0.5);
        if(minute >= 60) {
            hour += 1;
            minute -= 60;
        }
        if(hour < 0)
            hour += 24;
        if(hour > 23)
            hour -= 24;

        return formatRegularTime(hour, minute, useAmPm);
    }

    function ensureTzietAlternatingDisplay() {
        if(tzietAlternateTimer)
            return;

        tzietAlternateTimer = setInterval(function() {
            tzietAlternateShowCurrent = !tzietAlternateShowCurrent;
            renderTzietAlternatingDisplay();
        }, TZIET_ALTERNATE_MS);
    }

    function renderTzietAlternatingDisplay() {
        var element = root.document.getElementById(tzietLastElementId || "tziet");
        if(!element)
            return;

        element.style.width = "";
        element.style.fontSize = "";
        element.title = isHebrewPage() ?
            "\u05e6\u05d0\u05ea \u05d4\u05db\u05d5\u05db\u05d1\u05d9\u05dd \u05d9\u05e8\u05d5\u05e9\u05dc\u05d9\u05dd / \u05de\u05d9\u05e7\u05d5\u05dd \u05e0\u05d5\u05db\u05d7\u05d9" :
            "Tzeit Hacochavim: Jerusalem / Current location";

        if(tzietAlternateShowCurrent && tzietCurrentLocationDisplayValue)
            element.value = getCurrentLocationTzietPrefix() + tzietCurrentLocationDisplayValue;
        else
            element.value = getJerusalemTzietPrefix() + tzietJerusalemDisplayValue;
    }

    function getJerusalemTzietPrefix() {
        return isHebrewPage() ? "\u05d9-\u05dd " : "JLM ";
    }

    function getCurrentLocationTzietPrefix() {
        return isHebrewPage() ? "\u05de\u05e7 " : "Loc ";
    }

    function isHebrewPage() {
        return /\/he\//.test(root.location.pathname.replace(/\\/g, "/"));
    }

    function getJerusalemMoonTimesForDate(date, locationLatitude, locationLongitude, timeZone) {
        var calculationLatitude = Number(locationLatitude);
        var calculationLongitude = Number(locationLongitude);
        if(!Number.isFinite(calculationLatitude))
            calculationLatitude = JERUSALEM_LATITUDE;
        if(!Number.isFinite(calculationLongitude))
            calculationLongitude = JERUSALEM_LONGITUDE;

        var calculationTimeZone = timeZone || root.clockTimeZone || JERUSALEM_TIME_ZONE;
        var civilDate = getCivilDatePartsFromWallDate(date);
        var offsetHours = getOffsetHoursForCivilDate(civilDate, calculationTimeZone);
        var start = julianFromLocalMidnight(civilDate, offsetHours);
        var hc = 0.133 * RAD;
        var h0 = moonAltitude(start, calculationLatitude, calculationLongitude) - hc;
        var result = {
            hasRise: false,
            hasSet: false
        };

        for(var i = 1; i <= 25; i += 2) {
            var h1 = moonAltitude(hoursLaterJulian(start, i), calculationLatitude, calculationLongitude) - hc;
            var h2 = moonAltitude(hoursLaterJulian(start, i + 1), calculationLatitude, calculationLongitude) - hc;
            var a = (h0 + h2) / 2 - h1;
            var b = (h2 - h0) / 2;
            if(a == 0) {
                h0 = h2;
                continue;
            }

            var xe = -b / (2 * a);
            var ye = (a * xe + b) * xe + h1;
            var discriminant = b * b - 4 * a * h1;
            var roots = 0;
            var x1 = 0;
            var x2 = 0;

            if(discriminant >= 0) {
                var dx = Math.sqrt(discriminant) / (Math.abs(a) * 2);
                x1 = xe - dx;
                x2 = xe + dx;
                if(Math.abs(x1) <= 1)
                    roots++;
                if(Math.abs(x2) <= 1)
                    roots++;
                if(x1 < -1)
                    x1 = x2;
            }

            if(roots == 1) {
                if(h0 < 0) {
                    result.riseClockHour = i + x1;
                    result.hasRise = true;
                }
                else {
                    result.setClockHour = i + x1;
                    result.hasSet = true;
                }
            }
            else if(roots == 2) {
                result.riseClockHour = i + (ye < 0 ? x2 : x1);
                result.setClockHour = i + (ye < 0 ? x1 : x2);
                result.hasRise = true;
                result.hasSet = true;
            }

            if(result.hasRise && result.hasSet)
                break;

            h0 = h2;
        }

        if(result.hasRise)
            result.rise = clockHourToUtcDate(civilDate, result.riseClockHour, offsetHours);
        if(result.hasSet)
            result.set = clockHourToUtcDate(civilDate, result.setClockHour, offsetHours);
        if(!result.hasRise && !result.hasSet)
            result.alwaysDown = true;

        result.timeZone = calculationTimeZone;
        result.latitude = calculationLatitude;
        result.longitude = calculationLongitude;
        result.utcOffsetHours = offsetHours;
        return result;
    }

    function getMoonEventClockHour(moonTimes, eventType) {
        if(!moonTimes)
            return NaN;

        var clockHourKey = eventType + "ClockHour";
        var clockHour = Number(moonTimes[clockHourKey]);
        if(Number.isFinite(clockHour))
            return clockHour;

        var eventDate = moonTimes[eventType];
        if(typeof root.convertDateTimeToFloat == "function")
            return root.convertDateTimeToFloat(eventDate);

        return NaN;
    }

    function getCivilDatePartsFromWallDate(date) {
        if(date && Number.isFinite(date.getTime())) {
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
        }

        var now = getCurrentClockWallDate();
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
    }

    function getJerusalemOffsetHoursForCivilDate(civilDate) {
        return getOffsetHoursForCivilDate(civilDate, JERUSALEM_TIME_ZONE);
    }

    function getOffsetHoursForCivilDate(civilDate, timeZone) {
        timeZone = timeZone || JERUSALEM_TIME_ZONE;
        if(root.BirthCalculatorTime &&
            typeof BirthCalculatorTime.zonedLocalTimeToUtc == "function" &&
            typeof BirthCalculatorTime.getTimeZoneOffsetHours == "function")
        {
            var noonUtc = BirthCalculatorTime.zonedLocalTimeToUtc(civilDate.year, civilDate.month, civilDate.day, 12, 0, timeZone);
            return BirthCalculatorTime.getTimeZoneOffsetHours(noonUtc, timeZone);
        }

        if(timeZone == JERUSALEM_TIME_ZONE && root.verifiedJerusalemTime && Number.isFinite(Number(root.verifiedJerusalemTime.offsetSeconds)))
            return Number(root.verifiedJerusalemTime.offsetSeconds) / 3600;

        if(timeZone == root.clockTimeZone && Number.isFinite(Number(root.clockGmt)))
            return Number(root.clockGmt);

        if(Number.isFinite(Number(root.tz)))
            return Number(root.tz);

        return 2;
    }

    function julianFromLocalMidnight(civilDate, offsetHours) {
        return daysFromCivil(civilDate.year, civilDate.month, civilDate.day) + J1970 - 0.5 - offsetHours / 24;
    }

    function daysFromCivil(year, month, day) {
        return Math.floor(Date.UTC(year, month - 1, day) / ASTRONOMY_DAY_MS);
    }

    function hoursLaterJulian(julian, hours) {
        return julian + hours / 24;
    }

    function clockHourToUtcDate(civilDate, clockHour, offsetHours) {
        var utcMidnightMilliseconds = Date.UTC(civilDate.year, civilDate.month - 1, civilDate.day) - Math.round(offsetHours * 60 * 60 * 1000);
        return new Date(utcMidnightMilliseconds + Math.round(clockHour * 60 * 60 * 1000));
    }

    function moonAltitude(julian, lat, lng) {
        var lw = RAD * -lng;
        var phi = RAD * lat;
        var d = julian - J2000;
        var coords = moonCoordsForDay(d);
        var h = siderealTime(d, lw) - coords.ra;
        var altitude = astronomicalAltitude(h, phi, coords.dec);
        altitude += astroRefraction(altitude);
        return altitude;
    }

    function moonCoordsForDay(d) {
        var l0 = RAD * (218.316 + 13.176396 * d);
        var m = RAD * (134.963 + 13.064993 * d);
        var f = RAD * (93.272 + 13.229350 * d);
        var l = l0 + RAD * 6.289 * Math.sin(m);
        var b = RAD * 5.128 * Math.sin(f);

        return {
            ra: rightAscension(l, b),
            dec: declination(l, b)
        };
    }

    function rightAscension(l, b) {
        var e = RAD * 23.4397;
        return Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
    }

    function declination(l, b) {
        var e = RAD * 23.4397;
        return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
    }

    function astronomicalAltitude(h, phi, dec) {
        return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(h));
    }

    function siderealTime(d, lw) {
        return RAD * (280.16 + 360.9856235 * d) - lw;
    }

    function astroRefraction(h) {
        if(h < 0)
            h = 0;

        return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
    }

    function startJerusalemWomanKabalaClock() {
        root.longitude = JERUSALEM_LONGITUDE;
        root.latitude = JERUSALEM_LATITUDE;

        if(typeof root.set_dst == "function")
            root.set_dst();
        if(typeof root.set_default_date == "function")
            root.set_default_date();
        if(typeof root.list_pos == "function")
            root.list_pos();
        if(typeof root.hebrewclock == "function")
            root.hebrewclock();
        if(typeof root.oTimerclock == "function")
            root.oTimerclock();
        if(typeof root.genderInitFunction == "function")
            root.genderInitFunction();
        if(typeof root.setmazal == "function")
            root.setmazal();
        if(typeof root.setShevet == "function")
            root.setShevet();
        if(typeof root.commercialFunction == "function")
            root.commercialFunction();
    }

    function startVerifiedJerusalemWomanKabalaClock() {
        initializeJerusalemWomanKabalaTime();
        verifyJerusalemTimeSafely(startJerusalemWomanKabalaClock);
    }

    root.initializeJerusalemWomanKabalaTime = initializeJerusalemWomanKabalaTime;
    root.verifyJerusalemTimeSafely = verifyJerusalemTimeSafely;
    root.getCurrentClockDate = getCurrentClockDate;
    root.getCurrentClockWallDate = getCurrentClockWallDate;
    root.getCurrentMoonCalculationDate = getCurrentMoonCalculationDate;
    root.getClockZonedParts = getClockZonedParts;
    root.getZonedPartsForClock = getZonedPartsForClock;
    root.formatDateTimeForDisplay = formatDateTimeForDisplay;
    root.formatScheduleTimeForDisplay = formatScheduleTimeForDisplay;
    root.setSolarTzietDisplay = setSolarTzietDisplay;
    root.getSolarTzietClockHourForLocation = getSolarTzietClockHourForLocation;
    root.getJerusalemMoonTimesForDate = getJerusalemMoonTimesForDate;
    root.getClockMoonTimes = getJerusalemMoonTimesForDate;
    root.getMoonEventClockHour = getMoonEventClockHour;
    root.startJerusalemWomanKabalaClock = startJerusalemWomanKabalaClock;
    root.startVerifiedJerusalemWomanKabalaClock = startVerifiedJerusalemWomanKabalaClock;
})(window);

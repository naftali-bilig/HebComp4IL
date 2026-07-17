//set the moonset and moonrise
function doit() {
    var now = typeof getCurrentClockWallDate == "function" ? getCurrentClockWallDate() : new Date();
    var today = typeof getCurrentMoonCalculationDate == "function" ? getCurrentMoonCalculationDate() : new Date(now.getTime());
    var scheduleToday = getSelectedScheduleDate(now);
    var hour = getCurrentMoonHours(today);

    var mazal_ordered = ["Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury"];
    var mazal_night_01 = [6, 2, 5, 1, 4, 7, 3];
    var mazal_day_01 = [4, 7, 3, 6, 2, 5, 1];
    var baseDate = new Date(today.getTime());
    baseDate.setHours(0, 0, 0, 0);
    var currentHour = hoursFromBase(scheduleToday, baseDate);
    var scheduleSegments = getScheduleSegments(today, baseDate, currentHour);

    ensureScheduleHourRows(36);
    clearScheduleHighlights(36);

    for (var segmentIndex = 0; segmentIndex < scheduleSegments.length; segmentIndex++) {
        renderScheduleSegment(
            (segmentIndex * 12) + 1,
            scheduleSegments[segmentIndex],
            mazal_ordered,
            mazal_day_01,
            mazal_night_01,
            currentHour
        );
    }

    return hour;
}

function getCurrentMoonHours(today) {
    var yasterday, clockToday, tomorrow;

    if (birthYear == null || clockLive == "1") {
        yasterday = new Date(today.getTime());
        clockToday = new Date(today.getTime());
        tomorrow = new Date(today.getTime());
    }
    else {
        yasterday = new Date(birthYear, birthMonth - 1, birthDay);
        clockToday = new Date(birthYear, birthMonth - 1, birthDay);
        tomorrow = new Date(birthYear, birthMonth - 1, birthDay);
    }

    yasterday.setDate(clockToday.getDate() - 1);
    tomorrow.setDate(clockToday.getDate() + 1);

    var moonTimesYesterday = SunCalc.getMoonTimes(yasterday, latitude, longitude);
    var time_yasterday = [0, 0, 0, 0];
    time_yasterday[2] = getMoonTimeHour(moonTimesYesterday, "rise");
    time_yasterday[3] = getMoonTimeHour(moonTimesYesterday, "set");

    var moonTimesToday = SunCalc.getMoonTimes(clockToday, latitude, longitude);
    var time_today = [0, 0, 0, 0];
    time_today[2] = getMoonTimeHour(moonTimesToday, "rise");
    time_today[3] = getMoonTimeHour(moonTimesToday, "set");

    var moonTimesTomorrow = SunCalc.getMoonTimes(tomorrow, latitude, longitude);
    var time_tommorow = [0, 0, 0, 0];
    time_tommorow[2] = getMoonTimeHour(moonTimesTomorrow, "rise");
    time_tommorow[3] = getMoonTimeHour(moonTimesTomorrow, "set");

    var sunrise_yasterday = time_yasterday[2];
    var sunrise = time_today[2];
    var sunrise_tommorow = time_tommorow[2];
    var sunset_yasterday = time_yasterday[3];
    var sunset = time_today[3];
    var sunset_tommorow = time_tommorow[3];

    var hour = [];
    hour[0] = sunrise_yasterday;
    hour[1] = sunrise;
    hour[2] = sunrise_tommorow;
    hour[3] = sunset_yasterday;
    hour[4] = sunset;
    hour[5] = sunset_tommorow;

    setMoonsetGlobals(sunset);

    return hour;
}

function setMoonsetGlobals(moonsetHour) {
    var moonsetArray = timeadj1(moonsetHour).split(":");
    sunsetH = moonsetArray[0];
    sunsetM = moonsetArray[1];
    sunsetS = moonsetArray[2];
    sunsetMili = moonsetArray[3];
}

function getMoonTimeHour(moonTimes, eventType) {
    if (typeof getMoonEventClockHour == "function") {
        return getMoonEventClockHour(moonTimes, eventType);
    }

    return convertDateTimeToFloat(moonTimes && moonTimes[eventType]);
}

function moonEvents(type, centerDate) {
    var events = [];

    for (var offset = -2; offset <= 3; offset++) {
        var moonDate = addDays(centerDate, offset);
        var moonTimes = SunCalc.getMoonTimes(moonDate, latitude, longitude);
        if (moonTimes[type]) {
            events.push(moonTimes[type]);
        }
    }

    events.sort(function (a, b) {
        return a.getTime() - b.getTime();
    });
    return events;
}

function previousEvent(events, date) {
    var previous = null;

    for (var index = 0; index < events.length; index++) {
        if (events[index].getTime() <= date.getTime()) {
            previous = events[index];
        }
        else {
            break;
        }
    }

    return previous;
}

function nextEvent(events, date) {
    for (var index = 0; index < events.length; index++) {
        if (events[index].getTime() > date.getTime()) {
            return events[index];
        }
    }

    return null;
}

function getScheduleSegments(today, baseDate, currentHour) {
    var events = [];

    for (var offset = -3; offset <= 4; offset++) {
        var moonDate = addDays(today, offset);
        var moonTimes = SunCalc.getMoonTimes(moonDate, latitude, longitude);
        var dayHourOffset = offset * 24;

        if (moonTimes.rise) {
            var riseHour = getMoonTimeHour(moonTimes, "rise");
            events.push({
                type: "rise",
                hour: Number.isFinite(riseHour) ? dayHourOffset + riseHour : hoursFromBase(moonTimes.rise, baseDate),
                date: moonTimes.rise
            });
        }

        if (moonTimes.set) {
            var setHour = getMoonTimeHour(moonTimes, "set");
            events.push({
                type: "set",
                hour: Number.isFinite(setHour) ? dayHourOffset + setHour : hoursFromBase(moonTimes.set, baseDate),
                date: moonTimes.set
            });
        }
    }

    events.sort(function (a, b) {
        return a.hour - b.hour;
    });

    var intervals = [];
    for (var i = 0; i < events.length - 1; i++) {
        if (events[i].type === events[i + 1].type) {
            continue;
        }

        var isDay = events[i].type === "rise";
        var titleDate = isDay ? events[i].date : events[i + 1].date;
        intervals.push({
            start: events[i].hour,
            end: events[i + 1].hour,
            hourLength: (events[i + 1].hour - events[i].hour) / 12,
            isDay: isDay,
            hebrewDay: normalizeHebrewDay(getClockWeekday(titleDate) + 1),
            startDate: events[i].date,
            date: titleDate
        });
    }

    var currentIndex = 0;
    for (var j = 0; j < intervals.length; j++) {
        if (currentHour >= intervals[j].start && currentHour < intervals[j].end) {
            currentIndex = j;
            break;
        }

        if (intervals[j].start <= currentHour) {
            currentIndex = j;
        }
    }

    var firstIndex = Math.max(0, currentIndex - 1);
    var selected = intervals.slice(firstIndex, firstIndex + 3);
    while (selected.length < 3 && firstIndex > 0) {
        firstIndex--;
        selected = intervals.slice(firstIndex, firstIndex + 3);
    }

    return selected;
}

function hoursFromBase(date, baseDate) {
    return (date.getTime() - baseDate.getTime()) / (60 * 60 * 1000);
}

function normalizeDisplayHour(hourValue) {
    return ((hourValue % 24) + 24) % 24;
}

function getClockWeekday(date) {
    var clockDate = getClockCalendarDate(date);
    return new Date(Date.UTC(clockDate.getFullYear(), clockDate.getMonth(), clockDate.getDate())).getUTCDay();
}

function getClockCalendarDate(date) {
    if (typeof getZonedPartsForClock == "function") {
        var parts = getZonedPartsForClock(date);
        if (parts) {
            return new Date(parts.year, parts.month - 1, parts.day);
        }
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function ensureScheduleHourRows(totalHours) {
    for (var i = 13; i <= totalHours; i++) {
        if (document.getElementById("hour_" + i + "__value")) {
            continue;
        }

        var previousIndex = document.getElementById("hour_" + (i - 1) + "_idx");
        if (!previousIndex || !previousIndex.parentNode) {
            return;
        }

        var row = document.createElement("div");
        row.style.textAlign = "center";

        var indexInput = document.createElement("input");
        indexInput.id = "hour_" + i + "_idx";
        indexInput.className = "zmanim_index";
        indexInput.type = "text";

        var labelInput = document.createElement("input");
        labelInput.id = "hour_" + i + "__label";
        labelInput.className = "zmanim_text";
        labelInput.type = "text";

        var valueInput = document.createElement("input");
        valueInput.id = "hour_" + i + "__value";
        valueInput.className = "zmanim_hour";
        valueInput.type = "text";

        row.appendChild(indexInput);
        row.appendChild(labelInput);
        row.appendChild(valueInput);
        previousIndex.parentNode.insertAdjacentElement("afterend", row);
    }
}

function renderScheduleSegment(startRow, segment, mazalOrdered, mazalDay, mazalNight, selectedHour) {
    var mazalStart = segment.isDay ? mazalDay[segment.hebrewDay - 1] : mazalNight[segment.hebrewDay - 1];
    renderHebrewDateTitle(startRow, segment);

    for (var i = 0; i < 12; i++) {
        var rowNumber = startRow + i;
        var hourLabel = document.getElementById("hour_" + rowNumber + "__label");
        var hourValue = document.getElementById("hour_" + rowNumber + "__value");
        var hourIndex = document.getElementById("hour_" + rowNumber + "_idx");

        if (!hourLabel || !hourValue) {
            continue;
        }

        var rowStart = segment.start + (segment.hourLength * i);
        var rowDate = getScheduleRowDate(segment, i + 1);
        hourLabel.value = mazalOrdered[(mazalStart + i) % 7] + " prayer";
        hourValue.value = typeof formatDateTimeForDisplay == "function" ?
            formatDateTimeForDisplay(rowDate, ampm) :
            timeadj(normalizeDisplayHour(rowStart), ampm);
        if (hourIndex) {
            hourIndex.value = "(" + (i + 1) + ")";
        }

        setScheduleRowLearningLink(rowNumber, segment, i + 1);

        if (isHourInScheduleRow(selectedHour, rowStart, segment.hourLength)) {
            highlightScheduleRow(rowNumber);
        }
    }
}

function clearScheduleHighlights(totalHours) {
    for (var i = 1; i <= totalHours; i++) {
        setScheduleRowHighlight(i, false);
    }
}

function highlightScheduleRow(rowNumber) {
    setScheduleRowHighlight(rowNumber, true);
}

function setScheduleRowHighlight(rowNumber, isHighlighted) {
    var row = document.getElementById("hour_" + rowNumber + "__value");
    if (!row || !row.parentNode) {
        return;
    }

    var inputs = row.parentNode.getElementsByTagName("input");
    row.parentNode.style.backgroundColor = isHighlighted ? "#fff3a6" : "";
    row.parentNode.style.padding = isHighlighted ? "4px 0" : "";
    row.parentNode.style.borderRadius = isHighlighted ? "6px" : "";

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.backgroundColor = isHighlighted ? "#fff3a6" : "";
        inputs[i].style.borderColor = isHighlighted ? "#b7791f" : "";
        inputs[i].style.fontWeight = isHighlighted ? "bold" : "";
    }
}

function isHourInScheduleRow(selectedHour, rowStart, rowLength) {
    return selectedHour >= rowStart && selectedHour < rowStart + rowLength;
}

function renderHebrewDateTitle(startRow, segment) {
    var firstHour = document.getElementById("hour_" + startRow + "__value");
    if (!firstHour || !firstHour.parentNode) {
        return;
    }

    var titleId = "hebrew_date_title_" + startRow;
    var title = document.getElementById(titleId);

    if (!title) {
        var row = document.createElement("div");
        row.style.textAlign = "center";

        title = document.createElement("input");
        title.id = titleId;
        title.className = "zmanim_text";
        title.type = "text";
        title.readOnly = true;
        title.style.width = "650px";

        row.appendChild(title);
        firstHour.parentNode.insertAdjacentElement("beforebegin", row);
    }

    var segmentTitle = segment.isDay ? getEnglishWeekdayName(segment.hebrewDay) : getEnglishWeeknightName(segment.hebrewDay);
    title.value = segmentTitle + " - " + getHebrewDateTitle(segment.date);
}

function getHebrewDateTitle(date) {
    var clockDate = getClockCalendarDate(date);

    if (typeof hebrewDate === "function") {
        if (typeof tzeit === "undefined") {
            tzeit = 25;
        }

        var originalTzeit = tzeit;
        tzeit = 25;
        var hebrew = hebrewDate(clockDate.getFullYear(), clockDate.getMonth() + 1, clockDate.getDate(), "English");
        tzeit = originalTzeit;
        return hebrew["date"] + " " + hebrew["month_name"];
    }

    return clockDate.getFullYear() + "-" + (clockDate.getMonth() + 1) + "-" + clockDate.getDate();
}

function getEnglishWeeknightName(hebrewDay) {
    var weekdays = ["Saturday night", "Sunday night", "Monday night", "Tuesday night", "Wednesday night", "Thursday night", "Friday night"];
    return weekdays[normalizeHebrewDay(hebrewDay) - 1];
}

function getEnglishWeekdayName(hebrewDay) {
    var weekdays = ["Sunday day", "Monday day", "Tuesday day", "Wednesday day", "Thursday day", "Friday day", "Saturday day"];
    return weekdays[normalizeHebrewDay(hebrewDay) - 1];
}

function addDays(date, days) {
    var result = new Date(date.getTime());
    result.setDate(result.getDate() + days);
    return result;
}

function normalizeHebrewDay(day) {
    return ((day - 1) % 7 + 7) % 7 + 1;
}

function setScheduleRowLearningLink(rowNumber, segment, hebrewHour) {
    var hourValue = document.getElementById("hour_" + rowNumber + "__value");
    var hourIndex = document.getElementById("hour_" + rowNumber + "_idx");
    if (!hourValue || !hourValue.parentNode) {
        return;
    }

    var row = hourValue.parentNode;
    var rowDate = getScheduleRowDate(segment, hebrewHour);
    var generalLearningUrl = buildScheduleLearningUrl(segment.hebrewDay, hebrewHour, rowDate, true);
    var personalLearningUrl = buildScheduleLearningUrl(segment.hebrewDay, hebrewHour, rowDate, false);

    row.onclick = null;
    row.onkeydown = null;
    row.style.cursor = "";
    row.removeAttribute("role");
    row.removeAttribute("tabindex");
    row.removeAttribute("title");

    configureScheduleLearningLink(hourIndex, generalLearningUrl, "Open learning with general ad");
    configureScheduleLearningLink(hourValue, personalLearningUrl, "Open learning with personal ad");
}

function configureScheduleLearningLink(element, learningUrl, title) {
    if (!element) {
        return;
    }

    element.dataset.learningUrl = learningUrl;
    element.style.cursor = "pointer";
    element.title = title;
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");

    element.onclick = function(event) {
        event.stopPropagation();
        window.location.href = this.dataset.learningUrl;
    };

    element.onkeydown = function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            window.location.href = this.dataset.learningUrl;
        }
    };
}

function getScheduleRowDate(segment, hebrewHour) {
    var rowDate = new Date((segment.startDate || segment.date).getTime());
    var rowStart = segment.start + (segment.hourLength * (hebrewHour - 1));
    rowDate.setTime(rowDate.getTime() + Math.round((rowStart - segment.start) * 60 * 60 * 1000));
    return rowDate;
}

function buildScheduleLearningUrl(hebrewDay, hebrewHour, rowDate, isGeneral) {
    var currentUrl = new URL(document.location.href);
    var learningUrl = new URL("../../../me/en/index.html", document.location.href);
    var latitudeParam = typeof JERUSALEM_LATITUDE != "undefined" ? String(JERUSALEM_LATITUDE) : "31.7768514";
    var longitudeParam = typeof JERUSALEM_LONGITUDE != "undefined" ? String(JERUSALEM_LONGITUDE) : "35.2331664";
    var timeZoneParam = typeof JERUSALEM_TIME_ZONE != "undefined" ? JERUSALEM_TIME_ZONE : "Asia/Jerusalem";

    learningUrl.searchParams.set("hebrewDay", hebrewDay);
    learningUrl.searchParams.set("hebrewHour", hebrewHour);
    learningUrl.searchParams.set("latitude", latitudeParam);
    learningUrl.searchParams.set("longitude", longitudeParam);
    learningUrl.searchParams.set("timeZone", timeZoneParam);
    if (typeof displayTimeZone != "undefined" && displayTimeZone) {
        learningUrl.searchParams.set("displayTimeZone", displayTimeZone);
    }
    if (isGeneral) {
        learningUrl.searchParams.set("general", "1");
    }
    var religion = currentUrl.searchParams.get("religion");
    if (religion) {
        learningUrl.searchParams.set("religion", religion);
    }

    return learningUrl.href;
}

function getSelectedScheduleDate(fallbackDate) {
    if (typeof getCurrentClockDate == "function") {
        return new Date(fallbackDate.getTime());
    }

    var url = new URL(document.location.href);
    var yearParam = parseInt(url.searchParams.get("year"), 10);
    var monthParam = parseInt(url.searchParams.get("month"), 10);
    var dayParam = parseInt(url.searchParams.get("day"), 10);
    var hourParam = parseInt(url.searchParams.get("hour"), 10);
    var minuteParam = parseInt(url.searchParams.get("minute") || url.searchParams.get("min"), 10);
    var selectedHour = !isNaN(hourParam) ? hourParam : fallbackDate.getHours();
    var selectedMinute = !isNaN(minuteParam) ? minuteParam : fallbackDate.getMinutes();

    if (!isNaN(yearParam) && !isNaN(monthParam) && !isNaN(dayParam)) {
        return new Date(yearParam, monthParam - 1, dayParam, selectedHour, selectedMinute, fallbackDate.getSeconds(), fallbackDate.getMilliseconds());
    }

    return new Date(fallbackDate.getTime());
}

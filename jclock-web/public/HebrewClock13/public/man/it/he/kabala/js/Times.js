//set the sunset and sunrise
function doit() {

    var nsi, ewi;
    var i;


    if (ns != "N")
        nsi = 1;
    else
        nsi = 0;

    if (ns != "W")
        ewi = 1;
    else
        ewi = 0;

    var adj = -(12 - tz);
    adj += dst;

    var sunrise = 0, sunset, sunrise_tommorow, sunset_yasterdate;
    var shaa_zmanit = 0;
    var hour = []; //29

    var date = getSelectedScheduleDate(typeof getCurrentClockDate == "function" ? getCurrentClockDate() : new Date());
    var today = new Date(date.getTime());
    var yasterday = new Date(today.getTime());
    var tomorrow = new Date(today.getTime());
    var scheduleToday = new Date(date.getTime());
    yasterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);


    //the time of yasterday
    var time_yasterday = [0, 0, 0, 0];
    time_yasterday = suntime(yasterday.getDate(), yasterday.getMonth() +1, yasterday.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

    //the time of the current day
    var time_today = [0, 0, 0, 0];
    time_today = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

    //the time of the next day
    var time_tommorow = [0, 0, 0, 0];
    time_tommorow = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

    if (time_today[1] == 0) {
        //sunrise_yasterdate = time_yasterday[2];
        sunrise = time_today[2];
        sunrise_tommorow = time_tommorow[2];
        sunset_yasterdate = time_yasterday[3];
        sunset = time_today[3];
        sunset_tommorow = time_tommorow[3];

        shaa_zmanit = (sunset - sunrise) / 12;

		hour[0] = sunset_yasterdate;
		hour[1] = sunrise;
		hour[2] = sunset;
		hour[3] = sunrise_tommorow;


        //using current time in the computer to adjust the right secdule...
        //get the time right now

        var h = date.getHours();
        var minute = date.getMinutes();
        var s = date.getSeconds();
		var m = date.getMilliseconds();
        var curr_hour = m + (s*1000) + (minute*60*1000) + (h*60*60*1000); 

        var str = timeadj1(sunset);
        var sunsetArray = str.split(":");
        sunsetH = sunsetArray[0];
        sunsetM = sunsetArray[1];
        sunsetS = sunsetArray[2];
		sunsetMili = sunsetArray[3];
        var sunset_hour =  parseInt(sunsetMili) + parseInt((sunsetS*1000)) + parseInt((sunsetM*60*1000)) + parseInt((sunsetH*60*60*1000));

        str = timeadj1(sunrise); //need to check which sunrise should i count here...
        var sunriseArray = str.split(":");
        sunriseH = sunriseArray[0];
        sunriseM = sunriseArray[1];
        sunriseS = sunriseArray[2];
		sunriseMili = sunriseArray[3];
        var sunrise_hour =  parseInt(sunriseMili) + parseInt((sunriseS*1000)) + parseInt((sunriseM*60*1000)) + parseInt((sunriseH*60*60*1000));

        //-----------------------------------------------------------------

        //document.getElementById("Masechet").value = shaa_zmanit_night;
        var state_of_day = 0; // 0 == curr_hour < sunset_hour 
        //legnth of the shaa zmanit - night
        //if (h > sunsetH || (h == sunsetH && minute > sunsetM) || (h == sunsetH && minute == sunsetM && s > sunsetS))
	    if(curr_hour > sunset_hour)
			state_of_day = 1;
		
		if(curr_hour > sunset_hour)
			shaa_zmanit_night = Math.abs((sunrise_tommorow + (24 - sunset)) / 12);
        else
            shaa_zmanit_night = Math.abs((sunrise + (24 - sunset_yasterdate)) / 12);
//        hour[25] = shaa_zmanit_night;

        //legnth of the shaa zmanit - day
        if(curr_hour > sunset_hour)
			shaa_zmanit_day = Math.abs((sunset_tommorow - sunrise_tommorow) / 12);
        else
			shaa_zmanit_day = Math.abs((sunset - sunrise) / 12);
//		hour[26] = shaa_zmanit_day;


        //seconds of shaa zmanit
//        hour[27] = Math.floor(shaa_zmanit_night * 3600.0 + 0.5);   //night
//        hour[28] = Math.floor(shaa_zmanit_day * 3600.0 + 0.5);      //day
        //----------------------
		
		//mili seconds of shaa zmanit
//		hour[29] = Math.floor(shaa_zmanit_night * 3600.0 * 1000);   //night
//		hour[30] = Math.floor(shaa_zmanit_day * 3600.0 * 1000);      //day

        var scheduleYasterday = new Date(scheduleToday.getTime());
        var scheduleTomorrow = new Date(scheduleToday.getTime());
        scheduleYasterday.setDate(scheduleToday.getDate() - 1);
        scheduleTomorrow.setDate(scheduleToday.getDate() + 1);

        time_yasterday = suntime(scheduleYasterday.getDate(), scheduleYasterday.getMonth() + 1, scheduleYasterday.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);
        time_today = suntime(scheduleToday.getDate(), scheduleToday.getMonth() + 1, scheduleToday.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);
        time_tommorow = suntime(scheduleTomorrow.getDate(), scheduleTomorrow.getMonth() + 1, scheduleTomorrow.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

        if (time_today[1] == 0) {
            sunrise = time_today[2];
            sunrise_tommorow = time_tommorow[2];
            sunset_yasterdate = time_yasterday[3];
            sunset = time_today[3];
            sunset_tommorow = time_tommorow[3];
            sunset_hour = timeStringToMilliseconds(timeadj1(sunset));
            sunrise_hour = timeStringToMilliseconds(timeadj1(sunrise));

            if(curr_hour > sunset_hour)
                shaa_zmanit_night = (sunrise_tommorow + (24 - sunset)) / 12;
            else
                shaa_zmanit_night = (sunrise + (24 - sunset_yasterdate)) / 12;

            if(curr_hour > sunset_hour)
                shaa_zmanit_day = (sunset_tommorow - sunrise_tommorow) / 12;
            else
                shaa_zmanit_day = (sunset - sunrise) / 12;
        }
        //insert an array of shaot_zmaniot
        var s1, s2,s3,s4;
        //var isNight = false;
        if (curr_hour > sunset_hour) {
            s1 = sunset;
            s2 = sunrise_tommorow;
			s3 = sunset_tommorow;
        }
        else {
            s1 = sunset_yasterdate;
            s2 = sunrise;
			s3 = sunset
        }

/*
        for (i = 0,s4=s1; i <= 11; i++, s4 += shaa_zmanit_night) 
		{
            hour[i] = timeadj1(s4);
        }
		
		for (i = 12,s4=s2; i <= 23; i++, s4 += shaa_zmanit_day) 
		{

            hour[i] = timeadj1(s4);
        }
        //------------------------------
*/

        //console.log("curr_hour: " + curr_hour);
        //console.log("sunset_hour " + sunset_hour);

        var mazal_ordered = ["לבנה","שבתאי","צדק","מאדים","חמה","נגה","כוכב"];
        var mazal_night_01 = [6,2,5,1,4,7,3];
        var mazal_day_01 = [4,7,3,6,2,5,1];

        //var 


        var isNight = curr_hour > sunset_hour || curr_hour < sunrise_hour;
        var isDay = !isNight;

        ensureScheduleHourRows(36);
        clearScheduleHighlights(36);

        var currentHebrewDay = normalizeHebrewDay(scheduleToday.getDay() + 1);
        var sunrise_yasterdate = time_yasterday[2];
        var scheduleSegments;

        if (isDay) {
            scheduleSegments = [
                { start: sunset_yasterdate, hourLength: shaa_zmanit_night, isDay: false, hebrewDay: currentHebrewDay, date: scheduleYasterday },
                { start: sunrise, hourLength: shaa_zmanit_day, isDay: true, hebrewDay: currentHebrewDay, date: scheduleToday },
                { start: sunset, hourLength: Math.abs((sunrise_tommorow + (24 - sunset)) / 12), isDay: false, hebrewDay: normalizeHebrewDay(currentHebrewDay + 1), date: scheduleToday }
            ];
        }
        else if (curr_hour > sunset_hour) {
            scheduleSegments = [
                { start: sunrise, hourLength: Math.abs((sunset - sunrise) / 12), isDay: true, hebrewDay: currentHebrewDay, date: scheduleToday },
                { start: sunset, hourLength: shaa_zmanit_night, isDay: false, hebrewDay: normalizeHebrewDay(currentHebrewDay + 1), date: scheduleToday },
                { start: sunrise_tommorow, hourLength: shaa_zmanit_day, isDay: true, hebrewDay: normalizeHebrewDay(currentHebrewDay + 1), date: scheduleTomorrow }
            ];
        }
        else {
            scheduleSegments = [
                { start: sunrise_yasterdate, hourLength: Math.abs((sunset_yasterdate - sunrise_yasterdate) / 12), isDay: true, hebrewDay: normalizeHebrewDay(currentHebrewDay - 1), date: scheduleYasterday },
                { start: sunset_yasterdate, hourLength: shaa_zmanit_night, isDay: false, hebrewDay: currentHebrewDay, date: scheduleYasterday },
                { start: sunrise, hourLength: shaa_zmanit_day, isDay: true, hebrewDay: currentHebrewDay, date: scheduleToday }
            ];
        }

        for (var segmentIndex = 0; segmentIndex < scheduleSegments.length; segmentIndex++) {
            renderScheduleSegment(
                (segmentIndex * 12) + 1,
                scheduleSegments[segmentIndex],
                mazal_ordered,
                mazal_day_01,
                mazal_night_01,
                curr_hour / (60 * 60 * 1000)
            );
        }


		// document.getElementById("dawn").value = timeadj(s2 - (72/60), ampm);
		// document.getElementById("misheyakir").value = timeadj(s2 - (50/60), ampm);
		// document.getElementById("sunrise").value = timeadj(s2, ampm);
        // document.getElementById("shema").value = timeadj(s2 + shaa_zmanit_day * 3, ampm);
        // document.getElementById("tefila").value = timeadj(s2 + shaa_zmanit_day * 4, ampm);
        // document.getElementById("chatzot_yom").value = timeadj(s2 + shaa_zmanit_day*6 , ampm);
        // document.getElementById("mincha_gedola").value = timeadj(s2 + shaa_zmanit_day*6.5 , ampm);
        // document.getElementById("mincha_ketana").value = timeadj(s2 + shaa_zmanit_day*9.5 , ampm);
		// document.getElementById("plag_mincha").value = timeadj(s2 + shaa_zmanit_day*10.75 , ampm);
		// document.getElementById("sunset").value = timeadj(s3, ampm);
		// document.getElementById("tziet").value = timeadj(s3 + (18/60), ampm);
		// document.getElementById("tziet_tam").value = timeadj(s3 + (72/60), ampm);
		// document.getElementById("chatzot_layla").value = timeadj(s3 + shaa_zmanit_night*6, ampm);		


		// var time;
		
		// //עלות השחר
		// if( curr_hour > sunset_hour )
		// 	time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 106, 6, lngd, lngm, ewi, latd, latm, nsi, adj);
		// else
		// 	time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 106, 6, lngd, lngm, ewi, latd, latm, nsi, adj);
        
        // if (time[1] == 0)
		// 	document.getElementById("dawn").value = timeadj(time[2], ampm);

		// //משיכיר
		// if( curr_hour > sunset_hour )
		// 	time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 101, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
        // else
		// 	time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 101, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
		
		// if (time[1] == 0)
		// 	document.getElementById("misheyakir").value = timeadj(time[2], ampm);

		// //צאת הכוכבים
		// if( curr_hour > sunset_hour )
		// 	time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 96, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
        // else
		// 	time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 96, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
		
		// if (time[1] == 0)
        //     document.getElementById("tziet").value = timeadj(time[3], ampm);
        
    }



    return hour;

}

function ensureScheduleHourRows(totalHours) {
    for (var i = 13; i <= totalHours; i++) {
        if (document.getElementById("hour_" + i + "__value")) {
            continue;
        }

        var previousIndex = document.getElementById("hour_" + (i - 1) + "_idx");
        if (!previousIndex) {
            return;
        }

        var row = document.createElement("div");
        row.style.textAlign = "center";

        var valueInput = document.createElement("input");
        valueInput.id = "hour_" + i + "__value";
        valueInput.className = "zmanim_hour";
        valueInput.type = "text";

        var labelInput = document.createElement("input");
        labelInput.id = "hour_" + i + "__label";
        labelInput.className = "zmanim_text";
        labelInput.type = "text";

        var indexInput = document.createElement("input");
        indexInput.id = "hour_" + i + "_idx";
        indexInput.className = "zmanim_index";
        indexInput.type = "text";
        indexInput.value = "(" + i + ")";

        row.appendChild(valueInput);
        row.appendChild(labelInput);
        row.appendChild(indexInput);

        previousIndex.parentNode.insertAdjacentElement("afterend", row);
    }
}

function renderScheduleSegment(startRow, segment, mazalOrdered, mazalDay, mazalNight, selectedHour) {
    var mazalStart = segment.isDay ? mazalDay[segment.hebrewDay - 1] : mazalNight[segment.hebrewDay - 1];

    renderScheduleSegmentTitle(startRow, segment);

    for (var i = 0; i < 12; i++) {
        var rowNumber = startRow + i;
        var hourLabel = document.getElementById("hour_" + rowNumber + "__label");
        var hourValue = document.getElementById("hour_" + rowNumber + "__value");
        var hourIndex = document.getElementById("hour_" + rowNumber + "_idx");

        if (!hourLabel || !hourValue) {
            continue;
        }

        var rowStart = segment.start + (segment.hourLength * i);
        hourLabel.value = "תפילת " + mazalOrdered[(mazalStart + i) % 7];
        hourValue.value = typeof formatScheduleTimeForDisplay == "function" ?
            formatScheduleTimeForDisplay(rowStart, segment.date, ampm) :
            timeadj(rowStart, ampm);
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
    var normalizedSelectedHour = selectedHour;

    while (normalizedSelectedHour < rowStart) {
        normalizedSelectedHour += 24;
    }

    return normalizedSelectedHour >= rowStart && normalizedSelectedHour < rowStart + rowLength;
}

function renderScheduleSegmentTitle(startRow, segment) {
    var firstHour = document.getElementById("hour_" + startRow + "__value");
    if (!firstHour || !firstHour.parentNode) {
        return;
    }

    var separatorId = "schedule_segment_title_" + startRow;
    var separator = document.getElementById(separatorId);

    if (!separator) {
        var row = document.createElement("div");
        row.style.textAlign = "center";

        separator = document.createElement("input");
        separator.id = separatorId;
        separator.className = "zmanim_text";
        separator.type = "text";
        separator.readOnly = true;
        separator.style.width = "650px";

        row.appendChild(separator);
        firstHour.parentNode.insertAdjacentElement("beforebegin", row);
    }

    separator.value = segment.isDay ? getHebrewDayName(segment.hebrewDay) : getHebrewWeeknightName(segment.hebrewDay);
}

function getHebrewWeeknightName(hebrewDay) {
    var weekdays = ["ליל ראשון", "ליל שני", "ליל שלישי", "ליל רביעי", "ליל חמישי", "ליל שישי", "ליל שבת"];
    return weekdays[normalizeHebrewDay(hebrewDay) - 1];
}

function getHebrewDayName(hebrewDay) {
    var weekdays = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"];
    return weekdays[normalizeHebrewDay(hebrewDay) - 1];
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
    var rowStart = segment.start + (segment.hourLength * (hebrewHour - 1));
    var rowDate = getScheduleRowDate(segment.date, rowStart);
    var generalLearningUrl = buildScheduleLearningUrl(segment.hebrewDay, hebrewHour, rowDate, true);
    var personalLearningUrl = buildScheduleLearningUrl(segment.hebrewDay, hebrewHour, rowDate, false);

    row.onclick = null;
    row.onkeydown = null;
    row.style.cursor = "";
    row.removeAttribute("role");
    row.removeAttribute("tabindex");
    row.removeAttribute("title");

    configureScheduleLearningLink(hourIndex, generalLearningUrl, "פתח לימוד עם פרסום כללי");
    configureScheduleLearningLink(hourValue, personalLearningUrl, "פתח לימוד עם פרסום אישי");
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

function getScheduleRowDate(baseDate, rowStart) {
    var rowDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    rowDate.setTime(rowDate.getTime() + Math.round(rowStart * 60 * 60 * 1000));
    return rowDate;
}

function buildScheduleLearningUrl(hebrewDay, hebrewHour, rowDate, isGeneral) {
    var currentUrl = new URL(document.location.href);
    var learningUrl = new URL("../../../me/he/index.html", document.location.href);

    learningUrl.searchParams.set("hebrewDay", hebrewDay);
    learningUrl.searchParams.set("hebrewHour", hebrewHour);
    learningUrl.searchParams.set("latitude", "31.7768514");
    learningUrl.searchParams.set("longitude", "35.2331664");
    learningUrl.searchParams.set("timeZone", "Asia/Jerusalem");
    var displayTimeZoneParam = typeof displayTimeZone != "undefined" && displayTimeZone ?
        displayTimeZone :
        currentUrl.searchParams.get("displayTimeZone");
    if (displayTimeZoneParam) {
        learningUrl.searchParams.set("displayTimeZone", displayTimeZoneParam);
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
        return getCurrentClockDate();
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

function timeStringToMilliseconds(value) {
    var parts = value.split(":");
    return parseInt(parts[3]) + parseInt(parts[2] * 1000) + parseInt(parts[1] * 60 * 1000) + parseInt(parts[0] * 60 * 60 * 1000);
}

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

    var date = typeof getCurrentClockDate == "function" ? getCurrentClockDate() : new Date();
    var yasterday = new Date(date.getTime());
    var today = new Date(date.getTime());
    var tomorrow = new Date(date.getTime());

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
		//-----------------------------------------------------------------

        //document.getElementById("Masechet").value = shaa_zmanit_night;
        var state_of_day = 0; // 0 == curr_hour < sunset_hour 
        //legnth of the shaa zmanit - night
        //if (h > sunsetH || (h == sunsetH && minute > sunsetM) || (h == sunsetH && minute == sunsetM && s > sunsetS))
	    if(curr_hour > sunset_hour)
			state_of_day = 1;
		
		if(curr_hour > sunset_hour)
			shaa_zmanit_night = (sunrise_tommorow + (24 - sunset)) / 12;
        else
            shaa_zmanit_night = (sunrise + (24 - sunset_yasterdate)) / 12;
//        hour[25] = shaa_zmanit_night;

        //legnth of the shaa zmanit - day
        if(curr_hour > sunset_hour)
			shaa_zmanit_day = (sunset_tommorow - sunrise_tommorow) / 12;
        else
			shaa_zmanit_day = (sunset - sunrise) / 12;
//		hour[26] = shaa_zmanit_day;


        //seconds of shaa zmanit
//        hour[27] = Math.floor(shaa_zmanit_night * 3600.0 + 0.5);   //night
//        hour[28] = Math.floor(shaa_zmanit_day * 3600.0 + 0.5);      //day
        //----------------------
		
		//mili seconds of shaa zmanit
//		hour[29] = Math.floor(shaa_zmanit_night * 3600.0 * 1000);   //night
//		hour[30] = Math.floor(shaa_zmanit_day * 3600.0 * 1000);      //day

        //insert an array of shaot_zmaniot
        var s1, s2,s3,s4,scheduleDate;
        if (curr_hour > sunset_hour) {
            s1 = sunset;
            s2 = sunrise_tommorow;
			s3 = sunset_tommorow;
            scheduleDate = tomorrow;
        }
        else {
            s1 = sunset_yasterdate;
            s2 = sunrise;
			s3 = sunset
            scheduleDate = today;
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

		setScheduleDisplayTime("dawn", s2 - (72/60), scheduleDate);
		//document.getElementById("misheyakir").value = timeadj(s2 - (50/60), ampm);
		setScheduleDisplayTime("sunrise", s2, scheduleDate);
        //document.getElementById("shema").value = timeadj(s2 + shaa_zmanit_day * 3, ampm);
        //document.getElementById("tefila").value = timeadj(s2 + shaa_zmanit_day * 4, ampm);
        setScheduleDisplayTime("chatzot_yom", s2 + shaa_zmanit_day*6, scheduleDate);
        //document.getElementById("mincha_gedola").value = timeadj(s2 + shaa_zmanit_day*6.5 , ampm);
        //document.getElementById("mincha_ketana").value = timeadj(s2 + shaa_zmanit_day*9.5 , ampm);
		//document.getElementById("plag_mincha").value = timeadj(s2 + shaa_zmanit_day*10.75 , ampm);
		setScheduleDisplayTime("sunset", s3, scheduleDate);
		//document.getElementById("tziet").value = timeadj(s3 + (18/60), ampm);
		//document.getElementById("tziet_tam").value = timeadj(s3 + (72/60), ampm);
		//document.getElementById("chatzot_layla").value = timeadj(s3 + shaa_zmanit_night*6, ampm);		


		var time;
		var timeDate;
		
		//עלות השחר
		if( curr_hour > sunset_hour ) {
			timeDate = tomorrow;
			time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 108, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
        }
		else {
			timeDate = today;
			time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 108, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
        }
        
        if (time[1] == 0)
			setScheduleDisplayTime("dawn", time[2], timeDate);

		//משיכיר
		if( curr_hour > sunset_hour ) {
			timeDate = tomorrow;
			time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 48, 35, lngd, lngm, ewi, latd, latm, nsi, adj);
        }
        else {
			timeDate = today;
			time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 48, 35, lngd, lngm, ewi, latd, latm, nsi, adj);
        }
		
		if (time[1] == 0)
			setScheduleDisplayTime("mincha_ketana", time[3], timeDate);

		//צאת הכוכבים
		if( curr_hour > sunset_hour ) {
			timeDate = tomorrow;
			time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 106, 40, lngd, lngm, ewi, latd, latm, nsi, adj);
        }
        else {
			timeDate = today;
			time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 106, 40, lngd, lngm, ewi, latd, latm, nsi, adj);
        }
		
		if (time[1] == 0)
            setScheduleDisplayTime("tziet_tam", time[3], timeDate);
		
		// הגדר את המיקום שלך
		const coordinates = new adhan.Coordinates(latitude, longitude);

		// בחר שיטת חישוב לפי אסכולה אסלאמית (לדוגמה: מוסלמי עולמי ליג או מוסלמי הצפוני)
		const params = adhan.CalculationMethod.MuslimWorldLeague();
		params.madhab = adhan.Madhab.Shafi; // או adhan.Madhab.Hanafi עבור האסכולה החנפית

		// תאריך שבו אתה רוצה לחשב את זמני התפילה
		//const date = new Date(today.getYear(), today.getMonth(), today.getDate()); // זכור שחודש הוא בין 0 ל-11 בג'אווה סקריפט

		// חישוב זמני התפילה
		const prayerTimes = new adhan.PrayerTimes(coordinates, today, params);

		// הדפסת זמני התפילה
		//console.log("Fajr: " + prayerTimes.fajr);
		document.getElementById("dawn").value = formatTime(prayerTimes.fajr);;		
		//console.log("Sunrise: " + prayerTimes.sunrise);
		document.getElementById("sunrise").value = formatTime(prayerTimes.sunrise);
		//console.log("Dhuhr: " + prayerTimes.dhuhr);
		document.getElementById("chatzot_yom").value = formatTime(prayerTimes.dhuhr);
		//console.log("Asr: " + prayerTimes.asr);
		document.getElementById("mincha_ketana").value = formatTime(prayerTimes.asr);
		//console.log("Maghrib: " + prayerTimes.maghrib);
		document.getElementById("sunset").value = formatTime(prayerTimes.maghrib);
		//console.log("Isha: " + prayerTimes.isha);
		document.getElementById("tziet_tam").value = formatTime(prayerTimes.isha);
    }



    return hour;

}

function setScheduleDisplayTime(elementId, clockHour, baseDate) {
    var element = document.getElementById(elementId);
    if (!element) {
        return;
    }

    element.value = typeof formatScheduleTimeForDisplay == "function" ?
        formatScheduleTimeForDisplay(clockHour, baseDate, ampm) :
        timeadj(clockHour, ampm);
}

// Function to format Date object to "HH:MM" format
function formatTime(date) {
    if (window.BirthCalculatorTime && typeof BirthCalculatorTime.getZonedParts == "function") {
        var parts = BirthCalculatorTime.getZonedParts(date, displayTimeZone || clockTimeZone || "Asia/Jerusalem");
        return `${parts.hour.toString().padStart(2, '0')}:${parts.minute.toString().padStart(2, '0')}`;
    }

    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

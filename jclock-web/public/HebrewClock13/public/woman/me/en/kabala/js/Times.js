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

    var date = typeof getCurrentMoonCalculationDate == "function" ? getCurrentMoonCalculationDate() : new Date();
    var yasterday = new Date(date.getTime());
    var today = new Date(date.getTime());
    var tomorrow = new Date(date.getTime());

    yasterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);


    function hours(date) {
        return convertDateTimeToFloat(date);
    }

    function hoursBetween(start, end) {
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    function moonEvents(type, centerDate) {
        var events = [];

        for (var offset = -2; offset <= 3; offset++) {
            var moonDate = new Date(centerDate.getTime());
            moonDate.setDate(centerDate.getDate() + offset);

            var moonTimes = SunCalc.getMoonTimes(moonDate, latitude, longitude);
            if (moonTimes[type])
                events.push(moonTimes[type]);
        }

        events.sort(function(a, b) { return a.getTime() - b.getTime(); });
        return events;
    }

    function previousEvent(events, date) {
        var previous = null;

        for (var index = 0; index < events.length; index++) {
            if (events[index].getTime() <= date.getTime())
                previous = events[index];
            else
                break;
        }

        return previous;
    }

    function nextEvent(events, date) {
        for (var index = 0; index < events.length; index++) {
            if (events[index].getTime() > date.getTime())
                return events[index];
        }

        return null;
    }

    function setTime(id, value) {
        var element = document.getElementById(id);
        if (element)
            element.value = value;
    }

    function setMoonTime(id, start, offsetHours) {
        var date = new Date(start.getTime() + offsetHours * 60 * 60 * 1000);
        setTime(id, typeof formatDateTimeForDisplay == "function" ?
            formatDateTimeForDisplay(date, ampm) :
            timeadj(hours(date), ampm));
    }

    function setSolarTzietTime(id, baseDate) {
        if (typeof setSolarTzietDisplay == "function" && setSolarTzietDisplay(id, baseDate, ampm))
            return;

        if (typeof suntime != "function")
            return;

        var time = suntime(baseDate.getDate(), baseDate.getMonth() + 1, baseDate.getYear(), 96, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
        if (time[1] == 0)
            setTime(id, timeadj(time[3], ampm));
    }

    var moonRises = moonEvents("rise", today);
    var moonSets = moonEvents("set", today);
    var now = typeof getCurrentClockDate == "function" ? getCurrentClockDate() : new Date();

    var lastMoonrise = previousEvent(moonRises, now);
    var nextMoonrise = nextEvent(moonRises, now);
    var lastMoonset = previousEvent(moonSets, now);
    var setAfterLastMoonrise = lastMoonrise ? nextEvent(moonSets, lastMoonrise) : null;
    var isMoonDay = lastMoonrise && setAfterLastMoonrise &&
        lastMoonrise.getTime() <= now.getTime() &&
        now.getTime() < setAfterLastMoonrise.getTime();

    var scheduleMoonrise = isMoonDay ? lastMoonrise : nextMoonrise;
    var scheduleMoonset = scheduleMoonrise ? nextEvent(moonSets, scheduleMoonrise) : null;
    var nextScheduleMoonrise = scheduleMoonset ? nextEvent(moonRises, scheduleMoonset) : null;

    if (scheduleMoonrise && scheduleMoonset && lastMoonset) {
        var displaySunrise = hours(scheduleMoonrise);
        var displaySunset = hours(scheduleMoonset);
        var displayNextSunrise = nextScheduleMoonrise ? hours(nextScheduleMoonrise) : displaySunrise;
        var lastMoonsetHour = hours(lastMoonset);
        var nowHour = hours(now);
        var nightBeforeMidnight = !isMoonDay && nowHour > lastMoonsetHour;

        sunrise = nightBeforeMidnight && lastMoonrise ? hours(lastMoonrise) : displaySunrise;
        sunrise_tommorow = nightBeforeMidnight ? displaySunrise : displayNextSunrise;
        sunset_yasterdate = lastMoonsetHour;
        sunset = nightBeforeMidnight ? lastMoonsetHour : displaySunset;
        sunset_tommorow = displaySunset;

        shaa_zmanit = hoursBetween(scheduleMoonrise, scheduleMoonset) / 12;

		hour[0] = sunset_yasterdate;
		hour[1] = sunrise;
		hour[2] = sunset;
		hour[3] = sunrise_tommorow;


        //using current time in the computer to adjust the right secdule...
        //get the time right now
        var date = typeof getCurrentClockWallDate == "function" ? getCurrentClockWallDate() : new Date();

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
			shaa_zmanit_night = Math.abs(hoursBetween(lastMoonset, scheduleMoonrise) / 12);
        else
            shaa_zmanit_night = Math.abs(hoursBetween(lastMoonset, scheduleMoonrise) / 12);
//        hour[25] = shaa_zmanit_night;

        //legnth of the shaa zmanit - day
        if(curr_hour > sunset_hour)
			shaa_zmanit_day = Math.abs(hoursBetween(scheduleMoonrise, scheduleMoonset) / 12);
        else
			shaa_zmanit_day = Math.abs(hoursBetween(scheduleMoonrise, scheduleMoonset) / 12);
//		hour[26] = shaa_zmanit_day;


        //seconds of shaa zmanit
//        hour[27] = Math.floor(shaa_zmanit_night * 3600.0 + 0.5);   //night
//        hour[28] = Math.floor(shaa_zmanit_day * 3600.0 + 0.5);      //day
        //----------------------
		
		//mili seconds of shaa zmanit
//		hour[29] = Math.floor(shaa_zmanit_night * 3600.0 * 1000);   //night
//		hour[30] = Math.floor(shaa_zmanit_day * 3600.0 * 1000);      //day

        //insert an array of shaot_zmaniot
        var s1, s2,s3,s4;
        s1 = sunset_yasterdate;
        s2 = displaySunrise;
		s3 = displaySunset;

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

		setMoonTime("dawn", scheduleMoonrise, -72/60);
		setMoonTime("misheyakir", scheduleMoonrise, -50/60);
		setMoonTime("sunrise", scheduleMoonrise, 0);
        setMoonTime("shema", scheduleMoonrise, shaa_zmanit_day * 3);
        setMoonTime("tefila", scheduleMoonrise, shaa_zmanit_day * 4);
        setMoonTime("chatzot_yom", scheduleMoonrise, shaa_zmanit_day*6);
        setMoonTime("mincha_gedola", scheduleMoonrise, shaa_zmanit_day*6.5);
		setMoonTime("mincha_ketana", scheduleMoonrise, shaa_zmanit_day*9.5);
		setMoonTime("plag_mincha", scheduleMoonrise, shaa_zmanit_day*10.75);
		setMoonTime("sunset", scheduleMoonset, 0);
		setSolarTzietTime("tziet", today);
		setMoonTime("tziet_tam", scheduleMoonset, 72/60);
		setMoonTime("chatzot_layla", scheduleMoonset, shaa_zmanit_night*6);

    }



    return hour;

}

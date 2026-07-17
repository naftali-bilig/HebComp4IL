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


    //the time of yasterday
    var time_yasterday = [0, 0, 0, 0];
    var moonTimesYesterday = SunCalc.getMoonTimes(yasterday, latitude, longitude);
	
	time_yasterday[2] = getMoonTimeHour(moonTimesYesterday, "rise");
	time_yasterday[3] = getMoonTimeHour(moonTimesYesterday, "set");
    //time_yasterday = suntime(yasterday.getDate(), yasterday.getMonth() +1, yasterday.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);

    //the time of the current day
    var time_today = [0, 0, 0, 0];
    var moonTimesToday = SunCalc.getMoonTimes(today, latitude, longitude);
    //time_today = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);
	time_today[2] = getMoonTimeHour(moonTimesToday, "rise");
	time_today[3] = getMoonTimeHour(moonTimesToday, "set");

    //the time of the next day
    var time_tommorow = [0, 0, 0, 0];
    var moonTimesTomorrow = SunCalc.getMoonTimes(tomorrow, latitude, longitude);
    //time_tommorow = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 90, 50, lngd, lngm, ewi, latd, latm, nsi, adj);
	time_tommorow[2] = getMoonTimeHour(moonTimesTomorrow, "rise");
	time_tommorow[3] = getMoonTimeHour(moonTimesTomorrow, "set");



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
		
		//document.getElementById("Sefer").value = sunrise_tommorow; 
		if(curr_hour > sunset_hour)
			shaa_zmanit_night = Math.abs((sunrise_tommorow + (24 - sunset)) / 12);
        else
            shaa_zmanit_night = Math.abs((sunrise + (24 - sunset_yasterdate)) / 12);
//        hour[25] = shaa_zmanit_night;

		shaa_zmanit_next_night = Math.abs((sunrise_tommorow + (24 - sunset)) / 12);
		
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

        //insert an array of shaot_zmaniot
        var s1, s2,s3,s4,shaa_zmanit;
        if (curr_hour > sunset_hour) 
				{
            s1 = sunset;
            s2 = sunrise_tommorow;
						s3 = sunset_tommorow;
						s4 = sunset;
						shaa_zmanit = shaa_zmanit_night;
        }
        else 
				{
            s1 = sunset_yasterdate;
            s2 = sunrise;
						s3 = sunset;
						s4 = sunset; 
						shaa_zmanit = shaa_zmanit_day;
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
//		if(gender == genders.MALE)
//		{
			var scheduleDate = curr_hour > sunset_hour ? tomorrow : today;
			setScheduleDisplayTime("hour_10_idx", s2 - shaa_zmanit_night*2, scheduleDate);
			setScheduleDisplayTime("hour_11_idx", s2 - shaa_zmanit_night*1, scheduleDate);
			
			setScheduleDisplayTime("hour_12_idx", s2, scheduleDate);
			setScheduleDisplayTime("hour_13_idx", s2 + shaa_zmanit_day, scheduleDate);
			setScheduleDisplayTime("hour_14_idx", s2 + 2*shaa_zmanit_day, scheduleDate);
			
			setScheduleDisplayTime("hour_15_idx", s2 + 3*shaa_zmanit_day, scheduleDate);
			setScheduleDisplayTime("hour_16_idx", s2 + 4*shaa_zmanit_day, scheduleDate);
			setScheduleDisplayTime("hour_17_idx", s2 + 5*shaa_zmanit_day, scheduleDate);
			
			setScheduleDisplayTime("hour_18_idx", s2 + 6*shaa_zmanit_day, scheduleDate);
			setScheduleDisplayTime("hour_18-30_idx", s2 + 6*shaa_zmanit_day + 0.5, scheduleDate);
			setScheduleDisplayTime("hour_19_idx", s2 + 7*shaa_zmanit_day, scheduleDate);
			setScheduleDisplayTime("hour_20_idx", s2 + 8*shaa_zmanit_day, scheduleDate);
			
			setScheduleDisplayTime("hour_21_idx", s2 + 9*shaa_zmanit_day, scheduleDate);
			setScheduleDisplayTime("hour_22_idx", s2 + 10*shaa_zmanit_day, scheduleDate);
			setScheduleDisplayTime("hour_23_idx", s2 + 11*shaa_zmanit_day, scheduleDate);
			
			setScheduleDisplayTime("hour_00_idx", s3, scheduleDate);
			document.getElementById("hour_together").value = "Together";
			var time;
            var timeDate;
		
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

		 //צאת הכוכבים
		 if( curr_hour > sunset_hour ) {
            timeDate = tomorrow;
		 	time = suntime(tomorrow.getDate(), tomorrow.getMonth() +1, tomorrow.getYear(), 96, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
         }
         else {
            timeDate = today;
		 	time = suntime(today.getDate(), today.getMonth() +1, today.getYear(), 96, 0, lngd, lngm, ewi, latd, latm, nsi, adj);
         }
		
		 if (time[1] == 0)
            setScheduleDisplayTime("tziet", time[3], timeDate);
        
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

function getMoonTimeHour(moonTimes, eventType) {
    if (typeof getMoonEventClockHour == "function") {
        return getMoonEventClockHour(moonTimes, eventType);
    }

    return convertDateTimeToFloat(moonTimes && moonTimes[eventType]);
}

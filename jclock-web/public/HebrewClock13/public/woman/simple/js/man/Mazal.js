//mazal of the hour
function setmazal_man() {
    var date = typeof getClockDate == "function" ? getClockDate() : null;
	if(!date)
	{
		if(birthYear == null)
			date = new Date();
		else
			date = new Date(Number(birthYear), Number(birthMonth) - 1, Number(birthDay));
	}

	var timeParts = typeof getClockTimeParts == "function" ? getClockTimeParts() : null;
    var h, m, s;
	if(timeParts)
	{
		h = timeParts.hour;
		m = timeParts.minute;
		s = timeParts.second;
	}
	else if(birthHour == null)
	{
		h = date.getHours();
		m = date.getMinutes();
		s = date.getSeconds();
	}
	else
	{
		h = Number(birthHour);
		m = Number(birthMin);
		s = 0;
	}



    var day = (typeof getClockDayOfWeek == "function" ? getClockDayOfWeek() : date.getDay()) + 1;
    var clockHour = lbHour;
    if (clockHour == 24)
        clockHour = 0;

    if (isAfterSunset(h, m, s, sunsetH_man, sunsetM_man, sunsetS_man))
        day = day + 1;


    //document.getElementById("test").value = h > sunsetH;

    if (day == 8)
        day = 1;

    hebrewday_man = day;
}

function isAfterSunset(h, m, s, sunsetHour, sunsetMinute, sunsetSecond)
{
    h = Number(h);
    m = Number(m);
    s = Number(s);
    sunsetHour = Number(sunsetHour);
    sunsetMinute = Number(sunsetMinute);
    sunsetSecond = Number(sunsetSecond);

    return (h == sunsetHour && m == sunsetMinute && s >= sunsetSecond) ||
        (h == sunsetHour && m > sunsetMinute) ||
        (h > sunsetHour);
}

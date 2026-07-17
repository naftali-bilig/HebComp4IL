var preLbMin = 0;
function hebrewclock()
{

    var zmanit_hour = doit();       //get the 24 shaaotzmaniot
    
	var sunrise_yasterday = zmanit_hour[0];
	var sunrise = zmanit_hour[1];
	var sunrise_tommorow = zmanit_hour[2];
	var sunset_yasterday = zmanit_hour[3];
	sunset = zmanit_hour[4];
	var sunset_tommorow = zmanit_hour[5];
	
	var shaa_zmanit_night, shaa_zmanit_day;
    
    var date = new Date();

    var h = birthHour == null ? date.getHours() : Number(birthHour);
    var m = birthHour == null ? date.getMinutes() : Number(birthMin || 0);
    var s = birthHour == null ? date.getSeconds() : Number(birthSec || 0);
	var milisec = birthHour == null ? date.getMilliseconds() : Number(birthMs || 0);

	curr_hour = milisec + (s*1000) + (m*60*1000) + ((h)*60*60*1000);
	
	curr_hour = curr_hour/(1000 * 3600);

	
	if(sunset > sunrise && curr_hour < sunset)
	{
		var length = sunset - sunrise;
		var curr_hour_offset = curr_hour - sunrise;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour = hour+12;
		document.getElementById("Hour").value = hour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
	}
	//case 2:
	//moonrise at 06:57 and moonset at 17:17
	//curr_hour earlier.
	if(sunset > sunrise && curr_hour < sunrise)
	{
		var length = sunrise + 24-sunset_yasterday;
		var curr_hour_offset = curr_hour + 24-sunset_yasterday;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour = hour;
		document.getElementById("Hour").value = hour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
	}
	//case 3:
	//moonrise at 06:57 and moonset at 17:17
	//curr_hour after moonset.
	if(sunset > sunrise && curr_hour > sunset)
	{
		var length = sunrise_tommorow + 24-sunset;
		var curr_hour_offset = curr_hour - sunset;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour = hour;
		document.getElementById("Hour").value = hour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
	}
	//month days 07-23	
	//moonrise at 13:05 and moonset at 00:00
	//curr_hour between them.
	if(sunset < sunrise  && curr_hour < sunrise)
	{
		var length = sunrise - sunset;
		var curr_hour_offset = curr_hour - sunset;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour = hour;
		document.getElementById("Hour").value = hour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
	}
	//case 2:
	//moonrise at 13:05 and moonset at 00:00
	//curr_hour earlier.
	if(sunset < sunrise && curr_hour < sunset)
	{
		var length = sunset + 24-sunrise_yasterday;
		var curr_hour_offset = curr_hour + 24-sunrise_yasterday;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour = hour + 12;
		document.getElementById("Hour").value = hour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
	}
	//case 3:
	//moonrise at 13:05 and moonset at 00:00
	//curr_hour after moonset.
	if(sunset < sunrise && curr_hour > sunrise)
	{
		var length = sunset_tommorow + 24-sunrise;
		var curr_hour_offset = curr_hour - sunrise;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	    
		lbHour = hour +12 ;
		document.getElementById("Hour").value = hour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;		
	}

	ReCalcCommercialToPeriod(true);
	display_time();
	markTime();
	
	var url = document.location.href;
	if(url.includes("jewish") || url.includes("cristian") || url.includes("islam"))
		sederLimud();

	if(lbMinute == 0)
	{
        doit();
		//setmazal();
        //setMasechet();
        //setSefer();
        //setParasha();
		//var url = document.location.href;
		//if(url.includes("jewish") || url.includes("cristian") || url.includes("islam"))
		//	sederLimud();
		//setmazal();
        //commercialFunction();
    }

	if(preLbMin != lbMinute)
	{		
		//console.log(lbMinute);
		//doit();
        setmazal();
		
		commercialFunction();
		preLbMin = lbMinute;
	}   
    //if(lbMinute == 0)
    //    sederLimud();
}


//---clock timer---
function oTimerclock() {
//    if (lbHour < 12)
        oTimer = setInterval(hebrewclock, 10);
//    else
//        oTimer = setInterval(hebrewclock, (shaa_zmanit_day) * 60 * 60 * 1000 / (1080*76));
}

function clock() {
    //adding one second
    lbSecond++;
    if (lbSecond == 76)
    {
        lbSecond = 0;
        lbMinute++;
        if(lbMinute == 270 || lbMinute == 540 || lbMinute == 720)
            sederLimud();
    }
    if (lbMinute == 1080)
    {
        lbMinute = 0;
        lbHour++;
        setmazal();
        setMasechet();
        setSefer();
        setParasha();
        sederLimud();

        clearInterval(oTimer);
        oTimerclock();
        //clearInterval(oTimer);
        //getLocation();
        //return;
    }
    else if (lbMinute > 1079)
    {
        lbMinute -= 1080;
        lbHour++;
        setmazal();
        setMasechet();
        setSefer();
        setParasha();

        clearInterval(oTimer);
        oTimerclock();
    }

    if (lbHour == 24)
        lbHour = 0;
    else if (lbHour > 23)
    {
        lbHour -= 24;
    }
}

function display_time()
{
	    //---dispaying the clock---
    if (lbSecond < 10)
        document.getElementById("Second").value = "0" + lbSecond;
    else
        document.getElementById("Second").value = lbSecond;

    //minute
    if (lbMinute < 10)
        document.getElementById("Minute").value = "000" + lbMinute;
    else if (lbMinute < 100)
        document.getElementById("Minute").value = "00" + lbMinute;
    else if (lbMinute < 1000)
        document.getElementById("Minute").value = "0" + lbMinute;
    else
        document.getElementById("Minute").value = lbMinute;

    //hour
//    if (lbHour < 12)
        lbHourClock = lbHour;
//    else
//        lbHourClock = lbHour - 12;
	
	//offset();

    if (document.getElementById("Hour").value < 10)
        document.getElementById("Hour").value = "0" + document.getElementById("Hour").value;
    else
        document.getElementById("Hour").value = document.getElementById("Hour").value;

}

function offset()
{
	if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
       lbHourClock = lbHour + 2;
    else // 22 ==> 0, 23==> 1, 24==>2
       lbHourClock = lbHour + 2 - 24;		
}

function markTime()
{	
	//console.log("curr_hour: " + curr_hour);
	//console.log("sunset: " + sunset);
	//console.log("misheyakir: " + misheyakir);
	
	if(curr_hour > tzeit  || 
	   curr_hour < misheyakir)
	{
		document.getElementById("Hour").style.color = "#878787";
		document.getElementById("Text2").style.color = "#878787";
		document.getElementById("Minute").style.color = "#878787";
		document.getElementById("Text4").style.color = "#878787";
		document.getElementById("Second").style.color = "#878787";
	}
	else if(curr_hour < sunset && 
			curr_hour > misheyakir/*curr_hour.toDouble() > sunrise_hour.toDouble()*/ )
	{
		document.getElementById("Hour").style.color = "#5DBCD2";
		document.getElementById("Text2").style.color = "#5DBCD2";
		document.getElementById("Minute").style.color = "#5DBCD2";
		document.getElementById("Text4").style.color = "#5DBCD2";
		document.getElementById("Second").style.color = "#5DBCD2";	
	}
}

function ReCalcCommercialToPeriod(intialize)
{
	var urlPeriod = getCommercialPeriodFromUrl();
	if(urlPeriod)
	{
		ReCalcCommercial(urlPeriod);
		return;
	}

	var commercialHour = getCommercialPeriodHour();
	var commercialMinute = getCommercialPeriodMinute();

	if(intialize)
	{
	//תחילת הלילה לדעת ר' יהודה
	if((commercialHour >= 22 && commercialMinute >= 810) ||
	   (commercialHour >= 23) ||
	   (commercialHour >= 0 && commercialHour < 6))
		ReCalcCommercial("yovel");
	//חצות הלילה
	else if(commercialHour >= 6 && commercialHour < 12)
		ReCalcCommercial("Dovid");
	// זריחה
	else if(commercialHour >= 12 && commercialHour < 18)
		ReCalcCommercial("month");
	// חצות היום
	else if(commercialHour >= 18)
		ReCalcCommercial("year");		
	}
	
	//תחילת הלילה לדעת ר' יהודה
	if(commercialHour == 22 && commercialMinute == 810)
		ReCalcCommercial("yovel");
	//חצות הלילה
	else if(commercialHour == 6 && commercialMinute == 0)
		ReCalcCommercial("Dovid");
	// זריחה
	else if(commercialHour == 12 && commercialMinute == 0)
		ReCalcCommercial("month");
	// חצות היום
	else if(commercialHour == 18 && commercialMinute == 0)
		ReCalcCommercial("year");
}

function getCommercialPeriodHour()
{
	return Number(lbHour);
}

function getCommercialPeriodFromUrl()
{
	if(typeof document === 'undefined' || !document.location)
		return null;

	var url = new URL(document.location.href);
	return url.searchParams.get('period');
}

function getCommercialPeriodMinute()
{
	return Number(lbMinute);
}

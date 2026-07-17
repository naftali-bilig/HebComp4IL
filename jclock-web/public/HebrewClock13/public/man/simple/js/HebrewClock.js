var isStartPray = false;
var curr_hour;
var isPressLink = false;
function hebrewclock()
{

    var zmanit_hour = doit();       //get the 24 shaaotzmaniot
    
	var sunrise_yasterday = zmanit_hour[0];
	sunrise = zmanit_hour[1];
	var sunrise_tommorow = zmanit_hour[2];
	var sunset_yasterday = zmanit_hour[3];
	sunset = zmanit_hour[4];
	var sunset_tommorow = zmanit_hour[5];
	
	var shaa_zmanit_night, shaa_zmanit_day;
    
    if (typeof getClockTimeAsHours == "function")
		curr_hour = getClockTimeAsHours();
	else {
		var date = new Date();
		curr_hour = (date.getMilliseconds() + (date.getSeconds()*1000) + (date.getMinutes()*60*1000) + (date.getHours()*60*60*1000))/(1000 * 3600);
	}


	//console.log(curr_hour);
	var hour;// = Math.floor(12* (curr_hour_offset/length));
	var minute;// = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
	var second;// = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	
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
	
	display_time();
	setmazal();	
	markTime();
	
	
	if(lbMinute == 0)
    {
		//document.getElementsByClassName("tefilaTool").display = "none";
		//document.getElementById("tefilaTool").style.display = "none";
		doit();
		setmazal();	
	}
	
	if(curr_hour >= sunrise-1 &&  curr_hour < sunrise && !isPressLink)
	{
		isPressLink = true;
		window.location.href = "./digitalChazan/index.html?longitude=" + longitude + "&latitude=" + latitude;
	}	
	
	//else if(parseInt(document.getElementById("Hour").value) == 11)
	//{
		/*
		if(Math.random()*10>5)
			lbHour = 13;
		else
			lbHour = 11;
		document.getElementById("Hour").value = lbHour;
		lbMinute = 1080 - minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = 76 - second;
		document.getElementById("Second").value = lbSecond;
		display_time();
		*/
	//	if(!isStartPray && (curr_hour > birkutHashahar)  && Math.abs(curr_hour - birkutHashahar) < 0.1)
	//	{
	//		Tefila();
	//		isStartPray = true;			
	//	}
	//		
	//}
		
	//if(lbHour == 6)
	//	isStartPray = false;
	
	//Tefila();
	//sunalert(curr_hour,lbHour,lbMinute,lbSecond);
    //if(lbMinute == 0)
		//PlayNigun();
		//PlayMusic();
}

//---clock timer---
function oTimerclock() 
{
	oTimer = setInterval(hebrewclock, 10);
}


function display_time()
{
	//---displaying the clock---
	//second
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
    if (document.getElementById("Hour").value < 10)
        document.getElementById("Hour").value = "0" + document.getElementById("Hour").value;
    else
        document.getElementById("Hour").value = document.getElementById("Hour").value;

	
	var timeParts = typeof getDisplayTimeParts == "function" ? getDisplayTimeParts() : null;
	var h,m,s
	if(timeParts)
	{
		h = timeParts.hour;
		m = timeParts.minute;
		s = timeParts.second;
	}
	else
    {
		var date = new Date();
		h = date.getHours();
		m = date.getMinutes();
		s = date.getSeconds();
	}
	document.getElementById("ChirstianHour").value = h<10? "0" + h : h;
	document.getElementById("ChirstianMinute").value = m<10? "0" + m : m ;
	document.getElementById("ChirstianSecond").value = s<10? "0" + s : s;

	
}

function markTime()
{	
	//console.log("curr_hour: " + curr_hour);
	//console.log("tzeit: " + tzeit);
	//console.log("misheyakir: " + misheyakir);
	//console.log("sunset: " + 	sunset);
	//document.getElementById("Minute").style.color = "#FF0000";

	if(curr_hour > tzeit  || 
	   curr_hour < misheyakir)
	{
		document.getElementById("Hour").style.color = "#878787";
		document.getElementById("HebrewText2").style.color = "#878787";
		document.getElementById("Minute").style.color = "#878787";
		document.getElementById("HebrewText4").style.color = "#878787";
		document.getElementById("Second").style.color = "#878787";
	}
	else if(curr_hour < sunset && 
			curr_hour > misheyakir/*curr_hour.toDouble() > sunrise_hour.toDouble()*/ )
	{
		document.getElementById("Hour").style.color = "#5DBCD2";
		document.getElementById("HebrewText2").style.color = "#5DBCD2";
		document.getElementById("Minute").style.color = "#5DBCD2";
		document.getElementById("HebrewText4").style.color = "#5DBCD2";
		document.getElementById("Second").style.color = "#5DBCD2";


		//if(curr_hour.toDouble() < sunrise_hour.toDouble() || lbHour.toNumber() < 6)
		//{ 
			//viewMazal.setText("Shacharit");			
			//viewMazal.setText("שחרית - " + text);
		//}
		//else if(lbHour.toNumber() > 6 || (lbHour.toNumber() == 6 && lbMinute.toNumber() >= 540)) 
		//{
			//viewMazal.setText("Mincha");
			//viewMazal.setText("מנחה - " + text);
		//}			
	}
	//return;
	document.getElementById("HebrewText2").style.color = "#878787";
	document.getElementById("HebrewText4").style.color = "#878787";


	if(curr_hour > sunset  || 
	   curr_hour < sunrise)
	{
		document.getElementById("Minute").style.color = "#878787";
	}
	else if(curr_hour < sunset && 
			curr_hour > sunrise/*curr_hour.toDouble() > sunrise_hour.toDouble()*/ )
	{
		document.getElementById("Minute").style.color = "#A6230E";
	}


	if(curr_hour > shaa  || 
	   curr_hour < fajar)
	{
		//document.getElementById("Hour").style.color = "#878787";
		//document.getElementById("HebrewText2").style.color = "#878787";
		//document.getElementById("Minute").style.color = "#878787";
		//document.getElementById("HebrewText4").style.color = "#878787";
		document.getElementById("Second").style.color = "#878787";
	}
	else if(curr_hour < asr && 
			curr_hour > fajar/*curr_hour.toDouble() > sunrise_hour.toDouble()*/ )
	{
		//document.getElementById("Hour").style.color = "#5DBCD2";
		//document.getElementById("HebrewText2").style.color = "#5DBCD2";
		//document.getElementById("Minute").style.color = "#5DBCD2";
		//document.getElementById("HebrewText4").style.color = "#00FF00";
		document.getElementById("Second").style.color = "#84C45E";
	}
	else if(curr_hour > asr )
	{
		//document.getElementById("Hour").style.color = "#5DBCD2";
		//document.getElementById("HebrewText2").style.color = "#5DBCD2";
		//document.getElementById("Minute").style.color = "#5DBCD2";
		//document.getElementById("HebrewText4").style.color = "#00FF00";
		document.getElementById("Second").style.color = "#BA8D1A";
	}
		//if(curr_hour.toDouble() < sunrise_hour.toDouble() || lbHour.toNumber() < 6)
		//{ 
			//viewMazal.setText("Shacharit");			
			//viewMazal.setText("שחרית - " + text);
		//}
		//else if(lbHour.toNumber() > 6 || (lbHour.toNumber() == 6 && lbMinute.toNumber() >= 540)) 
		//{
			//viewMazal.setText("Mincha");
			//viewMazal.setText("מנחה - " + text);
		//}			
	
	
	
}


var isStartPray = false;
var curr_hour;
function hebrewclock()
{

    var zmanit_hour = doit();       //get the 24 shaaotzmaniot
    
	var sunset_yasterdate = zmanit_hour[0];
	var sunrise = zmanit_hour[1];
	var sunset = zmanit_hour[2];
	var sunrise_tommorow = zmanit_hour[3];
	
	var shaa_zmanit_night, shaa_zmanit_day;
    
    var date = new Date();

	var h,m,s,milisec;
	if(birthHour == null)
    {
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var milisec = date.getMilliseconds();
	}
	else
	{
		var h = birthHour;
		var m = birthMin;
		var s = 0;
		var milisec = 0;		
	}
	curr_hour = milisec + (s*1000) + (m*60*1000) + ((h)*60*60*1000);
	
	curr_hour = curr_hour/(1000 * 3600);

	if(h == 0 && m == 0 && s == 0)
	{
		window.location.href = "../index.html";
	}


	var hour;// = Math.floor(12* (curr_hour_offset/length));
	var minute;// = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
	var second;// = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
	
	//day
	if(curr_hour > sunrise && curr_hour < sunset)
	{
		var length = sunset - sunrise;
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
	//night before 00:00
	else if( curr_hour > sunset)
	{
		length = sunrise_tommorow + 24 - sunset;
		curr_hour_offset = curr_hour - sunset;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);

		lbHour = hour;
		document.getElementById("Hour").value = lbHour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
	}
	//night after 00:00
	else if(curr_hour < sunrise)
	{
		var length = sunrise + 24 - sunset_yasterdate;
		var curr_hour_offset = curr_hour + 24 - sunset_yasterdate;
		
		hour = Math.floor(12* (curr_hour_offset/length));
		minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour*1080;
		second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);
		
		lbHour = hour;
		document.getElementById("Hour").value = lbHour;
		lbMinute = minute;
		document.getElementById("Minute").value = lbMinute;
		lbSecond = second;
		document.getElementById("Second").value = lbSecond;
	}
	
	//display_time();
	//setmazal();	
	Tefila(true);
	markTime();
	
	if(lbMinute == 0)
    {
		//document.getElementsByClassName("tefilaTool").display = "none";
		//document.getElementById("tefilaTool").style.display = "none";
		doit();
		//setmazal();	
	}else if(parseInt(document.getElementById("Hour").value) == 11)
	{
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
		//console.log("22");
		//console.log("curr_hour: " + curr_hour );
		//console.log("birkutHashahar: " + birkutHashahar);
		if(!isStartPray && (curr_hour > birkutHashahar)  && Math.abs(curr_hour - birkutHashahar) < 0.1)
		{
			Tefila(true);
			isStartPray = true;			
		}
		
	}//counter dawn to the netz begining of the tefila
	if(tefilaNetz && parseInt(document.getElementById("Hour").value) >= 9 && birkutHashahar > curr_hour)
	{
		//console.log("what");
		var counterDawn =  timeadj1(birkutHashahar-curr_hour).split(':');
		//document.getElementById("ChirstianHour").value = counterDawn[0];
		//document.getElementById("ChirstianMinute").value = counterDawn[1];
		//document.getElementById("ChirstianSecond").value = counterDawn[2];
		//document.getElementById("ChirstianHour").style.display = "unset";
		var Christianclock = document.getElementsByClassName("ChirstianClock");
		for (var i = 0; i < Christianclock.length; i++) 
		{
			Christianclock.item(i).style.display = "unset";
		}
	}//counter dawn to the netz
	if(tefilaNetz && curr_hour > birkutHashahar && curr_hour < publicSunrise)
	{
		var counterDawn =  timeadj1(publicSunrise-curr_hour).split(':');
		//document.getElementById("ChirstianHour").value = counterDawn[0];
		//document.getElementById("ChirstianMinute").value = counterDawn[1];
		//document.getElementById("ChirstianSecond").value = counterDawn[2];
		//document.getElementById("ChirstianHour").style.display = "unset";
		var Christianclock = document.getElementsByClassName("ChirstianClock");
		for (var i = 0; i < Christianclock.length; i++) 
		{
			Christianclock.item(i).style.display = "unset";
		}
	}
	if(tefilaNetz == false && curr_hour > birkutHashahar && curr_hour < publicSunrise)
	{
		tefilaNetz = true;
		Tefila(true);
	}
	
	if(lbHour == 6)
		isStartPray = false;
	
	//Tefila();
	sunalert(curr_hour,lbHour,lbMinute,lbSecond);
    //if(lbMinute == 0 || lbMinute == 360 || lbMinute == 720)
    //    tick_sound();
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

	
	var date = new Date();

	var h,m,s
	if(birthHour == null)
    {
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
	}
	else
	{
		var h = birthHour;
		var m = birthMin;
		var s = 0;
	}
	//document.getElementById("ChirstianHour").value = h<10? "0" + h : h;
	//document.getElementById("ChirstianMinute").value = m<10? "0" + m : m ;
	//document.getElementById("ChirstianSecond").value = s<10? "0" + s : s;

	
}

function markTime()
{

	if(curr_hour > tzeit  || 
	   curr_hour < misheyakir)
	{
		document.getElementById("ChirstianHour").style.color = "#878787";
		document.getElementById("ChirstianDots1").style.color = "#878787";
		document.getElementById("ChirstianMinute").style.color = "#878787";
		document.getElementById("ChirstianDots2").style.color = "#878787";
		document.getElementById("ChirstianSecond").style.color = "#878787";
	}
	else if(curr_hour > misheyakir )
	{
		document.getElementById("ChirstianHour").style.color = "#CA2C92";
		document.getElementById("ChirstianDots1").style.color = "#CA2C92";
		document.getElementById("ChirstianMinute").style.color = "#CA2C92";
		document.getElementById("ChirstianDots2").style.color = "#CA2C92";
		document.getElementById("ChirstianSecond").style.color = "#CA2C92";
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
}

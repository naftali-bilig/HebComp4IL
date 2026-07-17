function hebrewclock()
{

    var zmanit_hour = doit();       //get the 24 shaaotzmaniot
    var shaa_zmanit_night, shaa_zmanit_day;
    
    var date = new Date();

    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
	var milisec = date.getMilliseconds();

	var curr_hour = milisec + (s*1000) + (m*60*1000) + ((h)*60*60*1000);
	var flag = 0;
	
    for (var i = 0; i <= 22; i++) {
        
        str = zmanit_hour[i];
        var sunsetArray = str.split(":");
        var h_z = sunsetArray[0];
        var m_z = sunsetArray[1];
        var s_z = sunsetArray[2];
        var mili_z = sunsetArray[3];
        
		var curr_z = (mili_z*1) + (s_z*1000) + (m_z*60*1000) + (h_z*60*60*1000);
	
        str = zmanit_hour[i + 1];
        sunsetArray = str.split(":");
        //document.getElementById("stop").innerHTML = i;
        var h_o = sunsetArray[0];
        var m_o = sunsetArray[1];
        var s_o = sunsetArray[2];
		var mili_c = sunsetArray[3];
		
		var curr_c = (mili_c*1) + (s_o*1000) + (m_o*60*1000) + (h_o*60*60*1000);
		
		
		//milisec_shaa_zmanit_night = zmanit_hour[29];
        //milisec_shaa_zmanit_day = zmanit_hour[30];
		
        shaa_zmanit_night = zmanit_hour[25];
        shaa_zmanit_day = zmanit_hour[26];

        

        //document.getElementById("stop").innerHTML = i + " : " +  h_z + ":" + m_z;
        //if(i==22)
		//document.getElementById("Sefer").value = zmanit_hour[23];
		//break;
		
		
        //fix
		//default
        if ((curr_hour >= curr_z && curr_hour < curr_c ) )
        {
			flag=1;
            
			//hours
            lbHour = i;
            document.getElementById("Hour").value = i;        

            //minutes
            if (i > 11)
               lbMinute = Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[30]) * 1080);
            else
               lbMinute = Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[29]) * 1080);
			document.getElementById("Minute").value = lbMinute;
			//break;
			
			
            //seconds
            //lbSecond = 0;
            if (i > 11)
               lbSecond = Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[30]) * 76);
            else
               lbSecond = Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[29]) * 76);
			document.getElementById("Second").value = lbSecond;

			
			//debug
			//document.getElementById("Sefer").value =  Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[30]) * 76);
			//break; 
			 
            //document.getElementById("stop").innerHTML = 1;
            oTimerclock();
            break;
        }		

    }
	
	//i==23
    for (var i = 23; i <= 23 && flag==0; i++) {
        
        str = zmanit_hour[i];
        var sunsetArray = str.split(":");
        var h_z = sunsetArray[0];
        var m_z = sunsetArray[1];
        var s_z = sunsetArray[2];
        var mili_z = sunsetArray[3];
        
		var curr_z = (mili_z*1) + (s_z*1000) + (m_z*60*1000) + (h_z*60*60*1000);
	
	
        //str = zmanit_hour[i + 1];
        //sunsetArray = str.split(":");
        //document.getElementById("stop").innerHTML = i;
        //var h_o = sunsetArray[0];
        //var m_o = sunsetArray[1];
        //var s_o = sunsetArray[2];
		//var mili_c = sunsetArray[3];
		
		//var curr_c = (mili_c*1) + (s_o*1000) + (m_o*60*1000) + (h_o*60*60*1000);
		
		
		//milisec_shaa_zmanit_night = zmanit_hour[29];
        //milisec_shaa_zmanit_day = zmanit_hour[30];
		
        shaa_zmanit_night = zmanit_hour[25];
        shaa_zmanit_day = zmanit_hour[26];

        

        //document.getElementById("stop").innerHTML = i + " : " +  h_z + ":" + m_z;
        //if(i==22)
		//document.getElementById("Sefer").value = h_z;
		//break;
		
		
        //fix
		//default
        if ((curr_hour >= curr_z && curr_hour < 999999999999 ) )
        {
			flag=1;
			
            //hours
            lbHour = i;
            document.getElementById("Hour").value = i;        

            //minutes
            if (i > 11)
               lbMinute = Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[30]) * 1080);
            else
               lbMinute = Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[29]) * 1080);
			document.getElementById("Minute").value = lbMinute;
			//break;
			
			
            //seconds
            //lbSecond = 0;
            if (i > 11)
               lbSecond = Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[30]) * 76);
            else
               lbSecond = Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[29]) * 76);
			document.getElementById("Second").value = lbSecond;

			
			//debug
			//document.getElementById("Sefer").value =  Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[30]) * 76);
			//break; 
			 
            //document.getElementById("stop").innerHTML = 1;
            oTimerclock();
            break;
        }		

    }
	
	//i==6
    for (var i = 6; i <= 6 && flag==0; i++) {
        
        str = zmanit_hour[i];
        var sunsetArray = str.split(":");
        var h_z = sunsetArray[0];
        var m_z = sunsetArray[1];
        var s_z = sunsetArray[2];
        var mili_z = sunsetArray[3];
        
		var curr_z = (mili_z*1) + (s_z*1000) + (m_z*60*1000) + (h_z*60*60*1000);
	
	
        str = zmanit_hour[i + 1];
        sunsetArray = str.split(":");
        //document.getElementById("stop").innerHTML = i;
        var h_o = sunsetArray[0];
        var m_o = sunsetArray[1];
        var s_o = sunsetArray[2];
		var mili_c = sunsetArray[3];
		
		var curr_c = (mili_c*1) + (s_o*1000) + (m_o*60*1000) + (h_o*60*60*1000);
		
		
		//milisec_shaa_zmanit_night = zmanit_hour[29];
        //milisec_shaa_zmanit_day = zmanit_hour[30];
		
        shaa_zmanit_night = zmanit_hour[25];
        shaa_zmanit_day = zmanit_hour[26];

        

        //document.getElementById("stop").innerHTML = i + " : " +  h_z + ":" + m_z;
        //if(i==22)
		//document.getElementById("Sefer").value = h_z;
		//break;
		
		
        //fix
		//default
        if ((curr_hour >= 0 && curr_hour < curr_c ) )
        {
			flag=1;
			
            //hours
            lbHour = i;
            document.getElementById("Hour").value = i;        

            //minutes
            if (i > 11)
               lbMinute = Math.floor( (parseInt(curr_hour) - parseInt(0))/parseInt(zmanit_hour[30]) * 1080);
            else
               lbMinute = Math.floor( (parseInt(curr_hour) - parseInt(0))/parseInt(zmanit_hour[29]) * 1080);
			document.getElementById("Minute").value = lbMinute;
			//break;
			
			
            //seconds
            //lbSecond = 0;
            if (i > 11)
               lbSecond = Math.floor( (parseInt(curr_hour) - parseInt(0))/parseInt(zmanit_hour[30]) * 76);
            else
               lbSecond = Math.floor( (parseInt(curr_hour) - parseInt(0))/parseInt(zmanit_hour[29]) * 76);
			document.getElementById("Second").value = lbSecond;

			
			//debug
			//document.getElementById("Sefer").value =  Math.floor( (parseInt(curr_hour) - parseInt(curr_z))/parseInt(zmanit_hour[30]) * 76);
			//break; 
			 
            //document.getElementById("stop").innerHTML = 1;
            oTimerclock();
            break;
        }		

    }
	

	
}

//---clock timer---
function oTimerclock() {
    if (lbHour < 12)
        oTimer = setInterval(clock, (shaa_zmanit_night) * 60 * 60 * 1000 / (1080*76));
    else
        oTimer = setInterval(clock, (shaa_zmanit_day) * 60 * 60 * 1000 / (1080*76));
}

function clock() {
    //adding one second
    lbSecond++;
    if (lbSecond == 76)
    {
        lbSecond = 0;
        lbMinute++;
    }
    if (lbMinute == 1080)
    {
        lbMinute = 0;
        lbHour++;
        setmazal();
        setMasechet();
        setSefer();
        setParasha();

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

    if (lbHourClock < 10)
        document.getElementById("Hour").value = "0" + lbHourClock;
    else
        document.getElementById("Hour").value = lbHourClock;
}

function offset()
{
	if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
       lbHourClock = lbHour + 2;
    else // 22 ==> 0, 23==> 1, 24==>2
       lbHourClock = lbHour + 2 - 24;		
}

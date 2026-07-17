function mazal_offset(day)
{
    var real_day;

	if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
			real_day = day;
	else // 10 ==> 0, 11==> 1, 12==>2
			real_day = day + 1;		
	
	if (real_day == 8)
        real_day = 1;
	
	return real_day;
}

//mazal of the hour
function setmazal() {
    var date = new Date();

    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();



    var day = date.getDay() + 1;
    var clockHour = lbHour;
    if (clockHour == 24)
        clockHour = 0;

    if ((h == sunsetH && m == sunsetM && s >= sunsetS) ||    // אחרי שקיעה
        (h == sunsetH && m > sunsetM) ||
        (h > sunsetH)
       )
        if ((h == 23 && m == 23 && s <= 59) ||    // לפני חצות
            (h == 23 && m < 59) ||
            (h < 23)
           )
            day = day + 1;

    

    //document.getElementById("test").value = h > sunsetH;

    if (day == 8)
        day = 1;

	//day = mazal_offset(day);
	
    var url = new URL(document.location.href);
    var marrigeHour = url.searchParams.get("hebrewHour");
    var marrigeDay = url.searchParams.get("hebrewDay");

    hebrewday = marrigeDay ? parseInt(marrigeDay) : day;
	gender = marrigeDay ? genders.MARRIED : gender;
	day = hebrewday;


    //hebrewday	
    //lbHourClock
    var Hour; // = masechet_offset();
    if (lbHour < 12)
		Hour = lbHour + 1;
	else
		Hour = lbHour - 12 + 1;
    Hour = marrigeHour ? (parseInt(marrigeHour)-1) : Hour; // = sefer_offset();
	clockHour = Hour;

	//var url = new URL(document.location.href);
    //var marrigeDay = url.searchParams.get("hebrewday");

    //hebrewday = marrigeDay ? marrigeDay : day;
 
    var day_mida = [ "חסד", "גבורה", "תפארת","נצח", "הוד", "יסוד", "מלכות"];
    var x = 0;
    if (day == 1)
        x = (5 + clockHour) % 7;
    if (day == 2)
        x = (1 + clockHour) % 7;
    if (day == 3)
        x = (4 + clockHour) % 7;
    if (day == 4)
        x = (0 + clockHour) % 7;
    if (day == 5)
        x = (3 + clockHour) % 7;
    if (day == 6)
        x = (6 + clockHour) % 7;
    if (day == 7)
        x = (2 + clockHour) % 7;

    resetShevetHour();
	gender= genders.MARRIED;
	
	//{מזל_יום,מזל_שעה}
    if(gender == genders.MALE)
    {
		var hour = clockHour % 12;

        var alufHour = hour+1;
        alufHour_str = alufHour;
        if(alufHour < 10)
            alufHour_str= "0" + alufHour;
        
		var aluf__mida1 = ["בינה", "נצח", "הוד", "אמונה", "רצון", "גבורה", "יסוד משפיע","יסוד מקבל","מלכות","דעת","תפארת","חסד-חכמה"];
        var aluf__mida2 = ["אמונה","רצון","חכמה","בינה","דעת","חסד","גבורה","תפארת","נצח","הוד","יסוד","מלכות"];
		var aluf1 = ["קנז", "שמה", "מזה", "תימן", "אומר", "נחת", "קרח","קרח","יעלם","געתם","זרח","עמלק"];
		var aluf2 = ["תימן", "אומר", "צפו", "קנז","געתם","עמלק","נחת","זרח","שמה","מזה","יעוש","יעלם"];

        //document.getElementById("Aluf_" + alufHour_str).value = aluf1[hour] + " שב" + aluf2[hour];
        //document.getElementById("Aluf_" + alufHour_str).style.display = "unset";
		//document.getElementById("Aluf__mida_" + alufHour_str).value = aluf__mida1[hour] + " שב" + aluf__mida2[hour];
        //document.getElementById("Aluf__mida_" + alufHour_str).style.display = "unset"
        
		document.getElementById("Mazal").style.display = "unset";
		
        switch (x) {
            case (0):
                document.getElementById("Mazal").value = day_mida[day - 1] + " שב" + "חסד";
                document.body.style.backgroundImage = "url('pic/" + day  + ".jpg";
                omer = (0 * 7) + day;
                break;
            case (1):
                document.getElementById("Mazal").value = day_mida[day - 1] + " שב" + "גבורה";
                document.body.style.backgroundImage = "url('pic/" + day  + ".jpg";
                omer = (1 * 7) + day;
                break;
            case (2):
                document.getElementById("Mazal").value = day_mida[day - 1] + " שב" + "תפארת";
                document.body.style.backgroundImage = "url('pic/" + day  + ".jpg";
                omer = (2 * 7) + day;
                break;
            case (3):
                document.getElementById("Mazal").value = day_mida[day - 1] + " שב" + "נצח";
                document.body.style.backgroundImage = "url('pic/" + day  + ".jpg";
                omer = (3 * 7) + day;
                break;
            case (4):
                document.getElementById("Mazal").value = day_mida[day - 1] + " שב" + "הוד";
                document.body.style.backgroundImage = "url('pic/" + day  + ".jpg";
                omer = (4 * 7) + day;
                break;
            case (5):
                document.getElementById("Mazal").value = day_mida[day - 1] + " שב" + "יסוד";
                document.body.style.backgroundImage = "url('pic/" + day  + ".jpg";
                omer = (5 * 7) + day;
                break;
            case (6):
                document.getElementById("Mazal").value = day_mida[day - 1] + " שב" + "מלכות";
                document.body.style.backgroundImage = "url('pic/" + day  + ".jpg";
                omer = (6 * 7) + day;
                break;
            default:
                break;
        }
    }
	//{מזל_שעה,מזל_יום}
    if(gender ^ genders.FEMALE)
    { 
		document.getElementById("Mazal").style.display = "unset";
		switch (x) 
		{
			case (0):
				document.getElementById("Mazal").value = "נצח" + " שב" + day_mida[day - 1];
				document.body.style.backgroundImage = "url('pic/4.jpg')";
				omer = ((day - 1) * 7) + 4;
				break;
			case (1):
				document.getElementById("Mazal").value = "חסד" + " שב" + day_mida[day - 1];
				document.body.style.backgroundImage = "url('pic/1.jpg')";
				omer = ((day - 1) * 7) + 1;
				break;
			case (2):
				document.getElementById("Mazal").value = "גבורה" + " שב" + day_mida[day - 1];
				document.body.style.backgroundImage = "url('pic/2.jpg')";
				omer = ((day - 1) * 7) + 2;
				break;
			case (3):
				document.getElementById("Mazal").value = "תפארת" + " שב" + day_mida[day - 1];
				document.body.style.backgroundImage = "url('pic/3.jpg')";
				omer = ((day - 1) * 7) + 3;
				break;
			case (4):
				document.getElementById("Mazal").value = "הוד" + " שב" + day_mida[day - 1];
				document.body.style.backgroundImage = "url('pic/5.jpg')";
				omer = ((day - 1) * 7) + 5;
				break;
			case (5):
				document.getElementById("Mazal").value = "יסוד" + " שב" + day_mida[day - 1];
				document.body.style.backgroundImage = "url('pic/6.jpg')";
				omer = ((day - 1) * 7) + 6;
				break;
			case (6):
				document.getElementById("Mazal").value = "מלכות" + " שב" + day_mida[day - 1];
				document.body.style.backgroundImage = "url('pic/7.jpg')";
				omer = ((day - 1) * 7) + 7;
				break;
			default:
				break;
		}
    }
    //{נושא השעה - שבט}
    if(gender == genders.MARRIED)
    {				
        x = (birthHour % 12);
		if(birthHour == 12 || birthHour == 24)
			x = 12;
		
        var shevetHour = Number(x);
		if(shevetHour == 0)
			shevetHour = 12;

		//Offset is Real - 5785-09-13
		//not feel real - 5785-10-08
		//Conclustion - offset is Real - 5785-11-03
		//shevetHour = shevetHour + 2;
		//if(shevetHour>=13)
		//	shevetHour-=12;
		//final -> offset doesn't needed. 5786-01-25

        shevetHour_str = shevetHour;
        if(shevetHour < 10)
            shevetHour_str= "0" + shevetHour;

        var shevet__mida1 = ["Dummy","בינה", "נצח", "הוד", "אמונה", "רצון", "גבורה", "יסוד משפיע","יסוד מקבל","מלכות","דעת","תפארת","חסד-חכמה"];
        var shevet__mida2 = ["Dummy","אמונה","רצון","חכמה","בינה","דעת","חסד","גבורה","תפארת","נצח","הוד","יסוד","מלכות"];
		var shevet2 = ["Dummy","יהודה", "יששכר", "זבולון", "ראובן", "שמעון", "גד", "אפרים","מנשה","בנימין","דן","אשר","נפתלי-לוי"];
		var shevet1 = ["Dummy","ראובן", "שמעון", "לוי", "יהודה","דן","נפתלי","גד","אשר","יששכר","זבולון","יוסף","בנימין"];



		document.getElementById("Shevet_" + shevetHour_str).value = shevet1[shevetHour] + " שב" + shevet2[shevetHour];
		document.getElementById("Shevet_" + shevetHour_str).style.display = "unset";

 
        //document.getElementById("Shevet_" + shevetHour_str).value = shevet1[x] + " שב" + shevet2[x];
        //document.getElementById("Shevet_" + shevetHour_str).style.display = "unset";
		document.getElementById("Shevet__mida_" + shevetHour_str).value = shevet__mida1[x] + " שב" + shevet__mida2[x];
        //document.getElementById("Shevet__mida_" + shevetHour_str).style.display = "unset"
		//document.body.style.backgroundImage = "url('pic/7.jpg')";
				

    }

    set_mazal_url();
	set_mida_url();

	//music_offset();
}

function setMazal()
{
	x = (birthHour % 12);
	document.getElementById("Mazal").style.display = "unset";
	switch (x) 
	{
		case (0):
			document.getElementById("Mazal").value = "חסד" + " שב" + day_mida[day - 1];
			document.body.style.backgroundImage = "url('pic/1.jpg";
			omer = ((day - 1) * 7) + 1;
			break;
		case (1):
			document.getElementById("Mazal").value = "גבורה" + " שב" + day_mida[day - 1];
			document.body.style.backgroundImage = "url('pic/2.jpg";
			omer = ((day - 1) * 7) + 2;
			break;
		case (2):
			document.getElementById("Mazal").value = "תפארת" + " שב" + day_mida[day - 1];
			document.body.style.backgroundImage = "url('pic/3.jpg";
			omer = ((day - 1) * 7) + 3;
			break;
		case (3):
			document.getElementById("Mazal").value = "נצח" + " שב" + day_mida[day - 1];
			document.body.style.backgroundImage = "url('pic/4.jpg";
			omer = ((day - 1) * 7) + 4;
			break;
		case (4):
			document.getElementById("Mazal").value = "הוד" + " שב" + day_mida[day - 1];
			document.body.style.backgroundImage = "url('pic/5.jpg";
			omer = ((day - 1) * 7) + 5;
			break;
		case (5):
			document.getElementById("Mazal").value = "יסוד" + " שב" + day_mida[day - 1];
			document.body.style.backgroundImage = "url('pic/6.jpg";
			omer = ((day - 1) * 7) + 6;
			break;
		case (6):
			document.getElementById("Mazal").value = "מלכות" + " שב" + day_mida[day - 1];
			document.body.style.backgroundImage = "url('pic/7.jpg";
			omer = ((day - 1) * 7) + 7;
			break;
		default:
			break;
	}

}

function resetShevetHour()
{
    document.getElementById("Mazal").style.display = "none";
    for(var x=1 ; x<=12 ; x++)
    {
        var x_str = x;
        if(x<10)
            x_str = "0" + x;
        document.getElementById("Shevet_" + x_str).style.display = "none";
		document.getElementById("Shevet__mida_" + x_str).style.display = "none";
		document.getElementById("Aluf_" + x_str).style.display = "none";
        document.getElementById("Aluf__mida_" + x_str).style.display = "none";
    }
}

function music_offset()
{
	if (lbHour < 12)
	{
		if (lbHour < 10) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
			audio = new Audio('music/' + (parseInt(lbHour) + 1 + 2) + '.mp3');
		else // 10 ==> 0, 11==> 1, 12==>2
			audio = new Audio('music/' + (parseInt(lbHour) + 1 + 2 - 12) + '.mp3');
	}
	else
	{
		if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
			audio = new Audio('music/' + (parseInt(lbHour) + 1 + 2 - 12) + '.mp3');
		else // 10 ==> 0, 11==> 1, 12==>2
			audio = new Audio('music/' + (parseInt(lbHour) + 1 + 2 - 12 - 12) + '.mp3');		
	}		
	
    //audio.play();
}

function set_mida_url()
{
        var url = new URL(document.location.href);
    var marrigeHour = url.searchParams.get("hebrewHour");
    var marrigeDay = url.searchParams.get("hebrewDay");

    hebrewday = marrigeDay ? parseInt(marrigeDay) : day;
	day = hebrewday;

    //hebrewday
    //lbHourClock
    var Hour; // = masechet_offset();
    if (lbHour < 12)
		clockHour = lbHour + 1;
	else
		Hour = lbHour - 12 + 1;
    Hour = marrigeHour ? ((parseInt(marrigeHour)-1)%12) : Hour; // = sefer_offset();
	clockHour = Hour;
		
    //var clockHour = lbHour;
    if (clockHour == 24)
        clockHour = 0;
	var x = clockHour % 12;

	var shevetHour = x+1;
	shevetHour_str = shevetHour;
	
	
	if(shevetHour < 10)
		shevetHour_str= "0" + shevetHour;
	else
		shevetHour_str = "" + shevetHour;

	switch(shevetHour_str)
	{
		case "01":
			mida_url = "https://www.youtube.com/watch?v=0Qs3OJUCAxQ&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=8";
			break;
		case "02":
			mida_url = "https://www.youtube.com/watch?v=EVRhc2xD9zo&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=9";
			break;
		case "03":
			mida_url = "https://www.youtube.com/watch?v=GElRmNCTGqU&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=10";
			break;
		case "04":
			mida_url = "https://www.youtube.com/watch?v=_cw3SMmOhQY&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=11";
			break;
		case "05":
			mida_url = "https://www.youtube.com/watch?v=X2dIIZY0cLI&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=12";
			break;
		case "06":
			mida_url = "https://www.youtube.com/watch?v=ejkUvqgF9s8&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=13";
			break;
		case "07":
			mida_url = "https://www.youtube.com/watch?v=q2h2E-Dic64&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=14";
			break;
		case "08":
			mida_url = "https://www.youtube.com/watch?v=r70bC8BWyfI&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=15";
			break;
		case "09":
			mida_url = "https://www.youtube.com/watch?v=pBjTYt-M8zk&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=16";
			break;
		case "10":
			mida_url = "https://www.youtube.com/watch?v=frLdkZ125Ko&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=17";
			break;
		case "11":
			mida_url = "https://www.youtube.com/watch?v=wkB61TCz5lo&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=18";
			break;
		case "12":
			mida_url = "https://www.youtube.com/watch?v=tPxGwFKVneA&list=PLFtAIQdzOs6SLU01c1II5RZpBFUv76WSk&index=19";
			break;
	}	
		
}


function set_mazal_url() 
{	
    switch (omer) 
	{
        case (1):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cdzy";
            mida_url = "";
            break;
        case (2):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c12x1";
            mida_url = "";
            break;
        case (3):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cga1";
            mida_url = "";
            break;
        case (4):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cvfa";
            mida_url = "";
            break;
        case (5):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1a6r";
            mida_url = "";
            break;
        case (6):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1f83";
            mida_url = "";
            break;
        case (7):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--ccpi";
            mida_url = "";
            break;
        case (8):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1jda";
            mida_url = "";
            break;
        case (9):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1zn9";
            mida_url = "";
            break;
        case (10):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--ch5i";
            mida_url = "";
            break;
        case (11):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--ckks";
            mida_url = "";
            break;
        case (12):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cukx";
            mida_url = "";
            break;
        case (13):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c15uv";
            mida_url = "";
            break;
        case (14):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cxjn";
            mida_url = "";
            break;
        case (15):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1hh3";
            mida_url = "";
            break;
        case (16):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c4c8";
            mida_url = "";
            break;
        case (17):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1me0";
            mida_url = "";
            break;
        case (18):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1p75";
            mida_url = "";
            break;
        case (19):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cmg3";
            mida_url = "";
            break;
        case (20):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c5z5";
            mida_url = "";
            break;
        case (21):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cwwz";
            mida_url = "";
            break;
        case (22):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1z0";
            mida_url = "";
            break;
        case (23):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c6qv";
            mida_url = "";
            break;
        case (24):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1lrs";
            mida_url = "";
            break;
        case (25):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1vcc";
            mida_url = "";
            break;
        case (26):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--chph";
            mida_url = "";
            break;
        case (27):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cpy6";
            mida_url = "";
            break;
        case (28):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1vpl";
            mida_url = "";
            break;
        case (29):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1z2h";
            mida_url = "";
            break;
        case (30):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1477";
            mida_url = "";
            break;
        case (31):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cuop";
            mida_url = "";
            break;
        case (32):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cfxo";
            mida_url = "";
            break;
        case (33):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1usu";
            mida_url = "";
            break;
        case (34):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c78y";
            mida_url = "";
            break;
        case (35):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cbn6";
            mida_url = "";
            break;
        case (36):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c85a";
            mida_url = "";
            break;
        case (37):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c2098";
            mida_url = "";
            break;
        case (38):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c995";
            mida_url = "";
            break;
        case (39):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c1qvx";
            mida_url = "";
            break;
        case (40):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c16lz";
            mida_url = "";
            break;
        case (41):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cdv1";
            mida_url = "";
            break;
        case (42):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c34f";
            mida_url = "";
            break;
        case (43):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--cl0m";
            mida_url = "";
            break;
        case (44):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c9j6";
            mida_url = "";
            break;
        case (45):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--chto";
            mida_url = "";
            break;
        case (46):
            mazal_url = "http://counting-the-omer.wixsite.com/50days/--c23fn";
            mida_url = "";
            break;
        case (47):
            mazal_url = "https://counting-the-omer.wixsite.com/50days/--cojf";
            mida_url = "";
            break;
        case (48):
            mazal_url = "https://counting-the-omer.wixsite.com/50days/--conn";
            mida_url = "";
            break;
        case (49):
            mazal_url = "https://counting-the-omer.wixsite.com/50days/--c20id";
            mida_url = "";
            break;
        default:
            mazal_url = "http://counting-the-omer.wixsite.com/50days";
            mida_url = "";
            break;
    }
}

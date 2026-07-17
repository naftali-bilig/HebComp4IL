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
    
    //crisitian calendar
    //day = day - 1;  
    //if (day == 0)
    //    day = 7;

    hebrewday = day;

    var day_mida = ["Netzach", "Chesed", "Gvura", "Tife'ret", "Hod", "Yesod", "Malcut"];
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

	//manual mazal
	x=0;
	
    switch (x) {
        case (0):
            //document.getElementById("Mazal").value = "Chesed" + " in " + day_mida[day - 1];
            document.body.style.backgroundImage = "url('../pic/1.jpg')";
            //omer = ((day - 1) * 7) + 1;
            break;
        case (1):
            //document.getElementById("Mazal").value = "Gevurah" + " in " + day_mida[day - 1];
            document.body.style.backgroundImage = "url('../pic/2.jpg')";
            //omer = ((day - 1) * 7) + 2;
            break;
        case (2):
            //document.getElementById("Mazal").value = "Tipheret" + " in " + day_mida[day - 1];
            document.body.style.backgroundImage = "url('../pic/3.jpg')";
            //omer = ((day - 1) * 7) + 3;
            break;
        case (3):
            //document.getElementById("Mazal").value = "Netzach" + " in " + day_mida[day - 1];
            document.body.style.backgroundImage = "url('../pic/4.jpg')";
            //omer = ((day - 1) * 7) + 4;
            break;
        case (4):
            //document.getElementById("Mazal").value = "Hod" + " in " + day_mida[day - 1];
            document.body.style.backgroundImage = "url('../pic/5.jpg')";
            //omer = ((day - 1) * 7) + 5;
            break;
        case (5):
            //document.getElementById("Mazal").value = "Yesod" + " in " + day_mida[day - 1];
            document.body.style.backgroundImage = "url('../pic/6.jpg')";
            //omer = ((day - 1) * 7) + 6;
            break;
        case (6):
            //document.getElementById("Mazal").value = "Malchut" + " in " + day_mida[day - 1];
            document.body.style.backgroundImage = "url('../pic/7.jpg')";
            //omer = ((day - 1) * 7) + 7;
            break;
        default:
            break;
    }
    set_mazal_url();

    music_offset();
}

function music_offset()
{
	if (lbHour < 12)
	{
		if (lbHour < 10) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
			audio = new Audio('../music/' + (parseInt(lbHour) + 1 + 2) + '.mp3');
		else // 10 ==> 0, 11==> 1, 12==>2
			audio = new Audio('../music/' + (parseInt(lbHour) + 1 + 2 - 12) + '.mp3');
	}
	else
	{
		if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
			audio = new Audio('../music/' + (parseInt(lbHour) + 1 + 2 - 12) + '.mp3');
		else // 10 ==> 0, 11==> 1, 12==>2
			audio = new Audio('../music/' + (parseInt(lbHour) + 1 + 2 - 12 - 12) + '.mp3');		
	}		
	
    //audio.play();
}

function set_mazal_url() {
    omer = 17;
    switch (omer) {
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
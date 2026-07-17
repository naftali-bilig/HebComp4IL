//mazal of the hour
function setmazal() {
	
	var date;
	if(birthYear == null)
		date = new Date();
	else
		date = new Date(birthYear,birthMonth-1,birthDay);
	
	var h,m,s,day;
	if(birthHour == null)
	{
		h = date.getHours();
		m = date.getMinutes();
		s = date.getSeconds();
	}
	else
	{
		h = birthHour;
		m = birthMin;
		s = 0;
	}

    var day = date.getDay() + 1;
    var clockHour = lbHour;

	// switch ((clockHour%12)+1) 
	// {

	// 	case (1):
	// 		document.getElementById("Mazal").innerText = "יהודה - בינה";
	// 		break;
	// 	case (2):
	// 		document.getElementById("Mazal").innerText = "יששכר - נצח";
	// 		break;
	// 	case (3):
	// 		document.getElementById("Mazal").innerText = "זבולון - הוד";
	// 		break;
	// 	case (4):
	// 		document.getElementById("Mazal").innerText = "ראובן - אמונה";
	// 		break;
	// 	case (5):
	// 		document.getElementById("Mazal").innerText = "שמעון - רצון";
	// 		break;
	// 	case (6):
	// 		document.getElementById("Mazal").innerText = "גד - גבורה";
	// 		break;
	// 	case (7):
	// 		document.getElementById("Mazal").innerText = "אפרים - יסוד נותן";
	// 		break;
	// 	case (8):
	// 		document.getElementById("Mazal").innerText = "מנשה - יסוד מקבל";
	// 		break;
	// 	case (9):
	// 		document.getElementById("Mazal").innerText = "בנימין - מלכות";
	// 		break;
	// 	case (10):
	// 		document.getElementById("Mazal").innerText = "דן - דעת";
	// 		break;
	// 	case (11):
	// 		document.getElementById("Mazal").innerText = "אשר - תפארת";
	// 		break;
	// 	case (12):
	// 		document.getElementById("Mazal").innerText = "נפתלי(לוי) - חסד";
	// 		break;
	// 	default:
	// 		break;
	// }

	// document.body.style.backgroundImage = "url('pic/7.jpg')";
	// return;


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
	
    hebrewday = day;

	var day_mida; 
	
	var userLang = navigator.language || navigator.userLanguage; 
	//console.log("userLang: " + userLang);
	if (userLang.includes("he")) 
		day_mida = ["שבתאי", "צדק", "מאדים", "חמה", "נוגה", "כוכב", "לבנה"];
	else
	{
		day_mida = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
	}
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

	if(birthDay == null)
		document.getElementById("Mazal").innerText = day_mida[x];
	else 
	{
		if (userLang.includes("he"))
			document.getElementById("Mazal").innerText = day_mida[x] + " שב" + day_mida[hebrewday-1];		
		else
			document.getElementById("Mazal").innerText = day_mida[x] + " in " + day_mida[hebrewday-1];		
	}
	document.body.style.backgroundImage = "url('pic/7.jpg')";
	
	switch (x) 
	{
		case (0):
			//document.getElementById("Mazal").setAttribute("ondblclick" ,"window.open('tel:+972527401735')");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#2D8DA1");
			//document.body.style.backgroundImage = "url('pic/1.jpg')";
			omer = ((day - 1) * 7) + 1;
			break;
		case (1):
			//document.getElementById("Mazal").setAttribute("href","tel:+972587401735");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#A6230E");
			//document.body.style.backgroundImage = "url('pic/2.jpg')";
			omer = ((day - 1) * 7) + 2;
			break;
		case (2):
		document.getElementById("Mazal").setAttribute("ondblclick" ,"window.open('tel:+972527401735')");
			//document.getElementById("Mazal").setAttribute("href","tel:+972548887390");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#815AA8")
			//document.body.style.backgroundImage = "url('pic/3.jpg')";
			omer = ((day - 1) * 7) + 3;
			break;
		case (3):
			//document.getElementById("Mazal").setAttribute("href","tel:+972587401735");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#84C45E");
			//document.body.style.backgroundImage = "url('pic/4.jpg')";
			omer = ((day - 1) * 7) + 4;
			break;
		case (4):
			//document.getElementById("Mazal").setAttribute("href","tel:+972524295486");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#BA8D1A");
			//document.body.style.backgroundImage = "url('pic/5.jpg')";
			omer = ((day - 1) * 7) + 5;
			break;
		case (5):
			//document.getElementById("Mazal").setAttribute("href","tel:+972587401735");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#B45D02");
			//document.body.style.backgroundImage = "url('pic/6.jpg')";
			omer = ((day - 1) * 7) + 6;
			break;
		case (6):
			//document.getElementById("Mazal").setAttribute("href","tel:+972526071874");
			//document.getElementById("Mazal").innerText = day_mida[day - 1];
			paintText("#808080");
			//document.body.style.backgroundImage = "url('pic/7.jpg')";
			omer = ((day - 1) * 7) + 7;
			break;
		default:
			break;
	}
	paintText("#5dbcd2");
}

function paintText(p_color)
{
	var clockInputs = document.getElementsByClassName("clock");
	for(var i=0 ; i< clockInputs.length ; i++)
		clockInputs[i].style.color = p_color;
}



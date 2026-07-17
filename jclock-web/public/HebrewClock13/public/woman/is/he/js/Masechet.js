function masechet_offset()
{
	var Hour;
    if (lbHour < 12)
	{
		if (lbHour < 10) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
			Hour = parseInt(lbHour) + 1 + 2;
		else // 10 ==> 0, 11==> 1, 12==>2
			Hour = parseInt(lbHour) + 1 + 2 - 12;
	}
	else
	{
		if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
			Hour = parseInt(lbHour) + 1 + 2 - 12;
		else // 10 ==> 0, 11==> 1, 12==>2
			Hour = parseInt(lbHour) + 1 + 2 - 12 - 12;		
	}
	return Hour;
}


//mazal of the hour
function setMasechet()
{
    //hebrewday
    //lbHourClock
    var Hour; //= masechet_offset();
    if (lbHour < 12)
		Hour = lbHour + 1;
	else
		Hour = lbHour - 12 + 1;

	var ShabatHour = lbHour + 1;
	//if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
	//	ShabatHour = parseInt(lbHour) + 1 + 2;
	//else // 10 ==> 0, 11==> 1, 12==>2
	//	ShabatHour = parseInt(lbHour) + 1 + 2 - 12 - 12;		
	
	
 //   var day = hebrewday;
	//ויהי ערב
//	if (lbHour >= 22)
//		day = day+1;
	
//	if (day == 8)
//		day = 1;
	
    switch(hebrewday)
    {
        case (1):
            switch(Hour)
            {
                case (1):
                    document.getElementById("Masechet").value = "ברכות";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "פאה";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "דמאי";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "כלאים";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "שביעית";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "תרומות";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "מעשרות";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "מעשר שני";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "חלה";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "ערלה";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "ביכורים";
                    break;
                default:
                    document.getElementById("Masechet").value = "חופש";
                    break;
            }
            break;
        case (2):
            switch (Hour)
            {
                case (1):
                    document.getElementById("Masechet").value = "שבת";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "עירובין";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "פסחים";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "שקלים";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "יומא";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "סוכה";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "ביצה";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "ראש השנה";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "תענית";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "מגילה";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "מועד קטן";
                    break;
                case (12):
                    document.getElementById("Masechet").value = "חגיגה";
                    break;
                default:
                    break;
            }
            break;
        case (3):
            switch (Hour)
            {
                case (1):
                    document.getElementById("Masechet").value = "יבמות";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "כתובות";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "נדרים";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "נזיר";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "סוטה";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "גיטין";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "קידושין";
                    break;
                default:
                    document.getElementById("Masechet").value = "חופש";
                    break;
            }
            break;
        case (4):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Masechet").value = "בבא קמא";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "בבא מציעא";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "בבא בתרא";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "סנהדרין";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "מכות";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "שבועות";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "עדיות";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "עבודה זרה";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "אבות";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "הוריות";
                    break;
                default:
                    document.getElementById("Masechet").value = "חופש";
                    break;
            }
            break;
        case (5):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Masechet").value = "זבחים";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "מנחות";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "חולין";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "בכורות";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "ערכין";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "תמורה";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "כריתות";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "מעילה";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "תמיד";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "מדות";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "קנים";
                    break;
                default:
                    document.getElementById("Masechet").value = "חופש";
                    break;
            }
            break;
        case (6):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Masechet").value = "כלים";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "אהלות";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "נגעים";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "פרה";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "טהרות";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "מקואות";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "נדה";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "מכשירין";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "זבים";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "טבול יום";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "ידים";
                    break;
                case (12):
                    document.getElementById("Masechet").value = "עוקצין";
                    break;
                default:
                    break;
            }
            break;
        case (7):
            switch (ShabatHour) 
			{
                case (1):
					document.getElementById("Masechet").value = "1 - יציאות השבת";
                    break;
                case (2):
					document.getElementById("Masechet").value = "2 - במה מדליקין";
                    break;
                case (3):
					document.getElementById("Masechet").value = "3 - כירה";
                    break;
                case (4):
					document.getElementById("Masechet").value = "4 - במה טומנין";
                    break;
                case (5):
					document.getElementById("Masechet").value = "5 - במה בהמה";
                    break;
                case (6):
					document.getElementById("Masechet").value = "6 - במה אשה";
                    break;
                case (7):
					document.getElementById("Masechet").value = "7 - כלל גדול";
                    break;
                case (8):
					document.getElementById("Masechet").value = "8 - המוציא יין";
                    break;
                case (9):
					document.getElementById("Masechet").value = "9 - אמר רבי עקיבא";
                    break;
                case (10):
					document.getElementById("Masechet").value = "10 - המצניע";
                    break;
                case (11):
					document.getElementById("Masechet").value = "11 - הזורק";
                    break;
                case (12):
					document.getElementById("Masechet").value = "12 - הבונה";
                    break;
                case (13):
					document.getElementById("Masechet").value = "13 - האורג";
                    break;
                case (14):
					document.getElementById("Masechet").value = "14 - שמנה שרצים";
                    break;
                case (15):
					document.getElementById("Masechet").value = "15 - ואלו קשרים";
                    break;
                case (16):
					document.getElementById("Masechet").value = "16 - כל כתבי";
                    break;
                case (17):
					document.getElementById("Masechet").value = "17 - כל הכלים";
                    break;
                case (18):
					document.getElementById("Masechet").value = "18 - מפנין";
                    break;
                case (19):
					document.getElementById("Masechet").value = "רבי אליעזר דמילה19 - ";
                    break;
                case (20):
					document.getElementById("Masechet").value = "20 - תולין";
                    break;
                case (21):
					document.getElementById("Masechet").value = "21 - נוטל";
                    break;
                case (22):
					document.getElementById("Masechet").value = "22 - חבית";
                    break;
                case (23):
					document.getElementById("Masechet").value = "23 - שואל";
                    break;
                case (24):
					document.getElementById("Masechet").value = "24 - מי שהחשיך";
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}
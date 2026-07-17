function parasha_offset()
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

//parasha of the hour
function setParasha()
{
    //hebrewday
    //lbHourClock

	var Hour; // = parasha_offset()
    if (lbHour < 12)
		Hour = lbHour + 1;
	else
		Hour = lbHour - 12 + 1;
	
//	var day = hebrewday;
	
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
                    document.getElementById("Parasha").value = "בראשית";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%A8%D7%90%D7%A9%D7%99%D7%AA/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "נח";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A0%D7%97/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "לך לך";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9C%D7%9A-%D7%9C%D7%9A/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "וירא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A8%D7%90/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "חיי שרה";
                    parasha_url = "https://haravelon.co.il/tag/%D7%97%D7%99%D7%99-%D7%A9%D7%A8%D7%94/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "תולדות";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%95%D7%9C%D7%93%D7%95%D7%AA/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "ויצא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A6%D7%90/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "וישלח";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A9%D7%9C%D7%97/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "וישב";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A9%D7%91/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "מקץ";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%A7%D7%A5/";
                    break;
                case (11):
                    document.getElementById("Parasha").value = "ויגש";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%92%D7%A9/";
                    break;
                default:
                    document.getElementById("Parasha").value = "ויחי";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%97%D7%99/";
                    break;
            }
            break;
        case (2):
            switch (Hour)
            {
                case (1):
                    document.getElementById("Parasha").value = "שמות";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%95%D7%AA/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "וארא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%90%D7%A8%D7%90/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "בא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%90/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "בשלח";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%A9%D7%9C%D7%97/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "יתרו";
                    parasha_url = "https://haravelon.co.il/tag/%D7%99%D7%AA%D7%A8%D7%95/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "משפטים";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "תרומה";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%A8%D7%95%D7%9E%D7%94/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "תצווה";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%A6%D7%95%D7%94/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "כי תשא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9B%D7%99-%D7%AA%D7%A9%D7%90/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "ויקהל";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A7%D7%94%D7%9C/";
                    break;
                case (11):
                    document.getElementById("Parasha").value = "פקודי";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A4%D7%A7%D7%95%D7%93%D7%99/";
                    break;
                case (12):
                    document.getElementById("Parasha").value = "חופש";
                    break;
                default:
                    break;
            }
            break;
        case (3):
            switch (Hour)
            {
                case (1):
                    document.getElementById("Parasha").value = "ויקרא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A7%D7%A8%D7%90/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "צו";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A6%D7%95/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "שמיני";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%99%D7%A0%D7%99/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "תזריע";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%96%D7%A8%D7%99%D7%A2/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "מצורע";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%A6%D7%95%D7%A8%D7%A2/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "אחרי מות";
                    parasha_url = "https://haravelon.co.il/tag/%D7%90%D7%97%D7%A8%D7%99-%D7%9E%D7%95%D7%AA/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "קדושים";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A7%D7%93%D7%95%D7%A9%D7%99%D7%9D/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "אמר";
                    parasha_url = "https://haravelon.co.il/tag/%D7%90%D7%9E%D7%95%D7%A8/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "בהר";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%94%D7%A8/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "בחוקותי";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%97%D7%95%D7%A7%D7%95%D7%AA%D7%99/";
                    break;
                default:
                    document.getElementById("Parasha").value = "חופש";
                    break;
            }
            break;
        case (4):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Parasha").value = "במדבר";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%9E%D7%93%D7%91%D7%A8/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "נשא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A0%D7%A9%D7%90/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "בהעלותך";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%94%D7%A2%D7%9C%D7%95%D7%AA%D7%9A/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "שלח";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9C%D7%97/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "קורח";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A7%D7%95%D7%A8%D7%97/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "חוקת";
                    parasha_url = "https://haravelon.co.il/tag/%D7%97%D7%95%D7%A7%D7%AA/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "בלק";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%9C%D7%A7/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "פינחס";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A4%D7%A0%D7%97%D7%A1/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "מטות";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%98%D7%95%D7%AA/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "מסעי";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%A1%D7%A2%D7%99/";
                    break;
                default:
                    document.getElementById("Parasha").value = "חופש";
                    break;
            }
            break;
        case (5):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Parasha").value = "דברים";
                    parasha_url = "https://haravelon.co.il/tag/%D7%93%D7%91%D7%A8%D7%99%D7%9D/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "ואתחנן";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%90%D7%AA%D7%97%D7%A0%D7%9F/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "עקב";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A2%D7%A7%D7%91/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "ראה";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A8%D7%90%D7%94/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "שופטים";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%95%D7%A4%D7%98%D7%99%D7%9D/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "כי תצא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9B%D7%99-%D7%AA%D7%A6%D7%90/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "כי תבוא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9B%D7%99-%D7%AA%D7%91%D7%95%D7%90/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "נצבים";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A0%D7%99%D7%A6%D7%91%D7%99%D7%9D/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "וילך";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%9C%D7%9A/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "האזינו";
                    parasha_url = "https://haravelon.co.il/tag/%D7%94%D7%90%D7%96%D7%99%D7%A0%D7%95/";
                    break;
                case (11):
                    document.getElementById("Parasha").value = "וזאת הברכה";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%96%D7%90%D7%AA-%D7%94%D7%91%D7%A8%D7%9B%D7%94/";
                    break;
                default:
                    document.getElementById("Parasha").value = "חופש";
                    break;
            }
            break;
        case (6):
            switch (Hour) 
			{
                default:
                    document.getElementById("Parasha").value = "חופש";
                    break;
            }
            break;
        case (7):
            switch (Hour) 
			{
                default:
                    document.getElementById("Parasha").value = "חופש";
                    break;
            }
            break;
        default:
            break;
    }
}
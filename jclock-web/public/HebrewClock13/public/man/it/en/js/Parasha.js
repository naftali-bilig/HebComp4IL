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

	var Hour;// = parasha_offset()
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
                    document.getElementById("Parasha").value = "Bereshit";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%A8%D7%90%D7%A9%D7%99%D7%AA/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "Noach";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A0%D7%97/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "Lech lecha";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9C%D7%9A-%D7%9C%D7%9A/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "Vayeira";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A8%D7%90/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "Chayei sarah";
                    parasha_url = "https://haravelon.co.il/tag/%D7%97%D7%99%D7%99-%D7%A9%D7%A8%D7%94/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "Toldot";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%95%D7%9C%D7%93%D7%95%D7%AA/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "Vayeitzei";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A6%D7%90/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "Vayishlach";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A9%D7%9C%D7%97/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "Vayeishev";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A9%D7%91/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "Mikeitz";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%A7%D7%A5/";
                    break;
                case (11):
                    document.getElementById("Parasha").value = "Vayigash";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%92%D7%A9/";
                    break;
                default:
                    document.getElementById("Parasha").value = "Vayechi";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%97%D7%99/";
                    break;
            }
            break;
        case (2):
            switch (Hour)
            {
                case (1):
                    document.getElementById("Parasha").value = "Shemot";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%95%D7%AA/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "Va'eira";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%90%D7%A8%D7%90/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "Bo";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%90/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "Beshalach";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%A9%D7%9C%D7%97/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "Yitro";
                    parasha_url = "https://haravelon.co.il/tag/%D7%99%D7%AA%D7%A8%D7%95/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "Mishpatim";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "Terumah";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%A8%D7%95%D7%9E%D7%94/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "Tetzaveh";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%A6%D7%95%D7%94/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "Ki tisa";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9B%D7%99-%D7%AA%D7%A9%D7%90/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "Vayakhel";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A7%D7%94%D7%9C/";
                    break;
                case (11):
                    document.getElementById("Parasha").value = "Pekudei";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A4%D7%A7%D7%95%D7%93%D7%99/";
                    break;
                case (12):
                    document.getElementById("Parasha").value = "Freedom";
                    break;
                default:
                    break;
            }
            break;
        case (3):
            switch (Hour)
            {
                case (1):
                    document.getElementById("Parasha").value = "Vayikra";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A7%D7%A8%D7%90/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "Tzav";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A6%D7%95/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "Shemini";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%99%D7%A0%D7%99/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "Tazria";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%96%D7%A8%D7%99%D7%A2/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "Metzora";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%A6%D7%95%D7%A8%D7%A2/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "Acharei mot";
                    parasha_url = "https://haravelon.co.il/tag/%D7%90%D7%97%D7%A8%D7%99-%D7%9E%D7%95%D7%AA/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "Kedoshim";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A7%D7%93%D7%95%D7%A9%D7%99%D7%9D/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "Emor";
                    parasha_url = "https://haravelon.co.il/tag/%D7%90%D7%9E%D7%95%D7%A8/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "Behar";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%94%D7%A8/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "Bechukotai";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%97%D7%95%D7%A7%D7%95%D7%AA%D7%99/";
                    break;
                default:
                    document.getElementById("Parasha").value = "Freedom";
                    break;
            }
            break;
        case (4):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Parasha").value = "Bamidbar";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%9E%D7%93%D7%91%D7%A8/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "Nasso";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A0%D7%A9%D7%90/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "Beha'alotcha";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%94%D7%A2%D7%9C%D7%95%D7%AA%D7%9A/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "Shelach";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9C%D7%97/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "Korach";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A7%D7%95%D7%A8%D7%97/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "Chukat";
                    parasha_url = "https://haravelon.co.il/tag/%D7%97%D7%95%D7%A7%D7%AA/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "Balak";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%9C%D7%A7/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "Pinchas";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A4%D7%A0%D7%97%D7%A1/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "Mattot";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%98%D7%95%D7%AA/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "Masei";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9E%D7%A1%D7%A2%D7%99/";
                    break;
                default:
                    document.getElementById("Parasha").value = "Freedom";
                    break;
            }
            break;
        case (5):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Parasha").value = "Devarim";
                    parasha_url = "https://haravelon.co.il/tag/%D7%93%D7%91%D7%A8%D7%99%D7%9D/";
                    break;
                case (2):
                    document.getElementById("Parasha").value = "Va'etchanan";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%90%D7%AA%D7%97%D7%A0%D7%9F/";
                    break;
                case (3):
                    document.getElementById("Parasha").value = "Eikev";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A2%D7%A7%D7%91/";
                    break;
                case (4):
                    document.getElementById("Parasha").value = "Re'eh";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A8%D7%90%D7%94/";
                    break;
                case (5):
                    document.getElementById("Parasha").value = "Shoftim";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%95%D7%A4%D7%98%D7%99%D7%9D/";
                    break;
                case (6):
                    document.getElementById("Parasha").value = "Ki teitzei";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9B%D7%99-%D7%AA%D7%A6%D7%90/";
                    break;
                case (7):
                    document.getElementById("Parasha").value = "Ki tavo";
                    parasha_url = "https://haravelon.co.il/tag/%D7%9B%D7%99-%D7%AA%D7%91%D7%95%D7%90/";
                    break;
                case (8):
                    document.getElementById("Parasha").value = "Nitzavim";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A0%D7%99%D7%A6%D7%91%D7%99%D7%9D/";
                    break;
                case (9):
                    document.getElementById("Parasha").value = "Vayeilech";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%9C%D7%9A/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "Haazinu";
                    parasha_url = "https://haravelon.co.il/tag/%D7%94%D7%90%D7%96%D7%99%D7%A0%D7%95/";
                    break;
                case (11):
                    document.getElementById("Parasha").value = "Vezot haberachah";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%96%D7%90%D7%AA-%D7%94%D7%91%D7%A8%D7%9B%D7%94/";
                    break;
                default:
                    document.getElementById("Parasha").value = "Freedom";
                    break;
            }
            break;
        case (6):
            switch (Hour) 
			{
                default:
                    document.getElementById("Parasha").value = "Freedom";
                    break;
            }
            break;
        case (7):
            switch (Hour) 
			{
                default:
                    document.getElementById("Parasha").value = "Freedom";
                    break;
            }
            break;
        default:
            break;
    }
}
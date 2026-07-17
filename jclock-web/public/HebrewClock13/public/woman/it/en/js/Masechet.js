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
    var Hour; // = masechet_offset();
    if (lbHour < 12)
		Hour = lbHour + 1;
	else
		Hour = lbHour - 12 + 1;

	var ShabatHour = lbHour + 1;
	//if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
	//	ShabatHour = parseInt(lbHour) + 1 + 2;
	//else // 10 ==> 0, 11==> 1, 12==>2
	//	ShabatHour = parseInt(lbHour) + 1 + 2 - 12 - 12;		

	
	//var day = hebrewday;
	
	//ויהי ערב
	//if (lbHour >= 22)
	//	day = day+1;
	
	//if (day == 8)
	//	day = 1;
	
	
    switch(hebrewday)
    {
        case (1):
            switch(Hour)
            {
                case (1):
                    document.getElementById("Masechet").value = "Brachot";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "Pe'ah";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "D'mai";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "Kila'im";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "Shvi'it";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "Terumot";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "Ma'asrot";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "Ma'aser sheni";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "Chala";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "Orla";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "Bikurim";
                    break;
                default:
                    document.getElementById("Masechet").value = "Freedom";
                    break;
            }
            break;
        case (2):
            switch (Hour)
            {
                case (1):
                    document.getElementById("Masechet").value = "Shabbat";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "Eiruvin";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "P'sachim";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "Shk'alim";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "Yoma";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "Sukkah";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "Beitzah";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "Rosh hashanah";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "Ta'anit";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "Megilah";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "Moed ka'atan";
                    break;
                case (12):
                    document.getElementById("Masechet").value = "Chagigah";
                    break;
                default:
                    break;
            }
            break;
        case (3):
            switch (Hour)
            {
                case (1):
                    document.getElementById("Masechet").value = "Yevamot";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "K'tuvot";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "Nedarim";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "Nazir";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "Sotah";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "Gittin";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "Kidushin";
                    break;
                default:
                    document.getElementById("Masechet").value = "Freedom";
                    break;
            }
            break;
        case (4):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Masechet").value = "Baba kama";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "Baba metzia";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "Baba batra";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "Sanhedrin";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "Makkot";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "Shavuot";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "Eduyot";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "Avodah zara";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "Avot";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "Horayot";
                    break;
                default:
                    document.getElementById("Masechet").value = "Freedom";
                    break;
            }
            break;
        case (5):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Masechet").value = "Zevachim";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "Menachot";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "Chulin";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "B'chorot";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "arachin";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "T'murah";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "Kritut";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "Me'ila";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "Tamid";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "Middot";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "Kinnim";
                    break;
                default:
                    document.getElementById("Masechet").value = "Freedom";
                    break;
            }
            break;
        case (6):
            switch (Hour) 
			{
                case (1):
                    document.getElementById("Masechet").value = "Kelim";
                    break;
                case (2):
                    document.getElementById("Masechet").value = "O'halot";
                    break;
                case (3):
                    document.getElementById("Masechet").value = "Nega'im";
                    break;
                case (4):
                    document.getElementById("Masechet").value = "Parah";
                    break;
                case (5):
                    document.getElementById("Masechet").value = "T'harot";
                    break;
                case (6):
                    document.getElementById("Masechet").value = "Mikva'ot";
                    break;
                case (7):
                    document.getElementById("Masechet").value = "Niddah";
                    break;
                case (8):
                    document.getElementById("Masechet").value = "Machshirin";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "Zavim";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "T'vul yom";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "Yadayim";
                    break;
                case (12):
                    document.getElementById("Masechet").value = "Oktzin";
                    break;
                default:
                    break;
            }
            break;
        case (7):
            switch (ShabatHour) 
			{
                case (1):
					document.getElementById("Masechet").value = "Yetzi'ot ha'shabat - 1";
                    break;
                case (2):
					document.getElementById("Masechet").value = "Ba'me madlikin - 2";
                    break;
                case (3):
					document.getElementById("Masechet").value = "Kira - 3";
                    break;
                case (4):
					document.getElementById("Masechet").value = "Ba'me tomnim - 4";
                    break;
                case (5):
					document.getElementById("Masechet").value = "Ba'me Be'e'ma - 5";
                    break;
                case (6):
					document.getElementById("Masechet").value = "Ba'me Isha - 6";
                    break;
                case (7):
					document.getElementById("Masechet").value = "Klal gadol - 7";
                    break;
                case (8):
					document.getElementById("Masechet").value = "Ha'motzie ya'in - 8";
                    break;
                case (9):
					document.getElementById("Masechet").value = "Amar Rabi Akiva - 9";
                    break;
                case (10):
					document.getElementById("Masechet").value = "Ha'matznia - 10";
                    break;
                case (11):
					document.getElementById("Masechet").value = "Ha'zorek - 11";
                    break;
                case (12):
					document.getElementById("Masechet").value = "Ha'bona - 12";
                    break;
                case (13):
					document.getElementById("Masechet").value = "Ha'oreg - 13";
                    break;
                case (14):
					document.getElementById("Masechet").value = "Shmone' shratzim - 14";
                    break;
                case (15):
					document.getElementById("Masechet").value = "Ve'elo ksharim - 15";
                    break;
                case (16):
					document.getElementById("Masechet").value = "Kol Kitvei - 16";
                    break;
                case (17):
					document.getElementById("Masechet").value = "Kol hakelim - 17";
                    break;
                case (18):
					document.getElementById("Masechet").value = "Me'fanin - 18";
                    break;
                case (19):
					document.getElementById("Masechet").value = "Rabi Eliezer de'mila - 19";
                    break;
                case (20):
					document.getElementById("Masechet").value = "Tolin - 20";
                    break;
                case (21):
					document.getElementById("Masechet").value = "Notel - 21";
                    break;
                case (22):
					document.getElementById("Masechet").value = "Chavit - 22";
                    break;
                case (23):
					document.getElementById("Masechet").value = "Sho'el - 23";
                    break;
                case (24):
					document.getElementById("Masechet").value = "Mi she'echshich - 24";
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}
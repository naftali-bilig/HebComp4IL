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

function getSefariaMishnahUrl(ref)
{
	return "https://www.sefaria.org/" + ref + "?lang=bi";
}

function setMasechetUrl()
{
	var masechetName = document.getElementById("Masechet").value;
	var masechtot = {
		"Brachot": "Mishnah_Berakhot.1",
		"Pe'ah": "Mishnah_Peah.1",
		"D'mai": "Mishnah_Demai.1",
		"Kila'im": "Mishnah_Kilayim.1",
		"Shvi'it": "Mishnah_Sheviit.1",
		"Terumot": "Mishnah_Terumot.1",
		"Ma'asrot": "Mishnah_Maasrot.1",
		"Ma'aser sheni": "Mishnah_Maaser_Sheni.1",
		"Chala": "Mishnah_Challah.1",
		"Orla": "Mishnah_Orlah.1",
		"Bikurim": "Mishnah_Bikkurim.1",
		"Shabbat": "Mishnah_Shabbat.1",
		"Eiruvin": "Mishnah_Eruvin.1",
		"P'sachim": "Mishnah_Pesachim.1",
		"Shk'alim": "Mishnah_Shekalim.1",
		"Yoma": "Mishnah_Yoma.1",
		"Sukkah": "Mishnah_Sukkah.1",
		"Beitzah": "Mishnah_Beitzah.1",
		"Rosh hashanah": "Mishnah_Rosh_Hashanah.1",
		"Ta'anit": "Mishnah_Taanit.1",
		"Megilah": "Mishnah_Megillah.1",
		"Moed ka'atan": "Mishnah_Moed_Katan.1",
		"Chagigah": "Mishnah_Chagigah.1",
		"Yevamot": "Mishnah_Yevamot.1",
		"K'tuvot": "Mishnah_Ketubot.1",
		"Nedarim": "Mishnah_Nedarim.1",
		"Nazir": "Mishnah_Nazir.1",
		"Sotah": "Mishnah_Sotah.1",
		"Gittin": "Mishnah_Gittin.1",
		"Kidushin": "Mishnah_Kiddushin.1",
		"Baba kama": "Mishnah_Bava_Kamma.1",
		"Baba metzia": "Mishnah_Bava_Metzia.1",
		"Baba batra": "Mishnah_Bava_Batra.1",
		"Sanhedrin": "Mishnah_Sanhedrin.1",
		"Makkot": "Mishnah_Makkot.1",
		"Shavuot": "Mishnah_Shevuot.1",
		"Eduyot": "Mishnah_Eduyot.1",
		"Avodah zara": "Mishnah_Avodah_Zarah.1",
		"Avot": "Mishnah_Avot.1",
		"Horayot": "Mishnah_Horayot.1",
		"Zevachim": "Mishnah_Zevachim.1",
		"Menachot": "Mishnah_Menachot.1",
		"Chulin": "Mishnah_Chullin.1",
		"B'chorot": "Mishnah_Bekhorot.1",
		"arachin": "Mishnah_Arakhin.1",
		"T'murah": "Mishnah_Temurah.1",
		"Kritut": "Mishnah_Keritot.1",
		"Me'ila": "Mishnah_Meilah.1",
		"Tamid": "Mishnah_Tamid.1",
		"Middot": "Mishnah_Middot.1",
		"Kinnim": "Mishnah_Kinnim.1",
		"Kelim": "Mishnah_Kelim.1",
		"O'halot": "Mishnah_Oholot.1",
		"Nega'im": "Mishnah_Negaim.1",
		"Parah": "Mishnah_Parah.1",
		"T'harot": "Mishnah_Tahorot.1",
		"Mikva'ot": "Mishnah_Mikvaot.1",
		"Niddah": "Mishnah_Niddah.1",
		"Machshirin": "Mishnah_Makhshirin.1",
		"Zavim": "Mishnah_Zavim.1",
		"T'vul yom": "Mishnah_Tevul_Yom.1",
		"Yadayim": "Mishnah_Yadayim.1",
		"Oktzin": "Mishnah_Oktzin.1",
		"Yetzi'ot ha'shabat - 1": "Mishnah_Shabbat.1",
		"Ba'me madlikin - 2": "Mishnah_Shabbat.2",
		"Kira - 3": "Mishnah_Shabbat.3",
		"Ba'me tomnim - 4": "Mishnah_Shabbat.4",
		"Ba'me Be'e'ma - 5": "Mishnah_Shabbat.5",
		"Ba'me Isha - 6": "Mishnah_Shabbat.6",
		"Klal gadol - 7": "Mishnah_Shabbat.7",
		"Ha'motzie ya'in - 8": "Mishnah_Shabbat.8",
		"Amar Rabi Akiva - 9": "Mishnah_Shabbat.9",
		"Ha'matznia - 10": "Mishnah_Shabbat.10",
		"Ha'zorek - 11": "Mishnah_Shabbat.11",
		"Ha'bona - 12": "Mishnah_Shabbat.12",
		"Ha'oreg - 13": "Mishnah_Shabbat.13",
		"Shmone' shratzim - 14": "Mishnah_Shabbat.14",
		"Ve'elo ksharim - 15": "Mishnah_Shabbat.15",
		"Kol Kitvei - 16": "Mishnah_Shabbat.16",
		"Kol hakelim - 17": "Mishnah_Shabbat.17",
		"Me'fanin - 18": "Mishnah_Shabbat.18",
		"Rabi Eliezer de'mila - 19": "Mishnah_Shabbat.19",
		"Tolin - 20": "Mishnah_Shabbat.20",
		"Notel - 21": "Mishnah_Shabbat.21",
		"Chavit - 22": "Mishnah_Shabbat.22",
		"Sho'el - 23": "Mishnah_Shabbat.23",
		"Mi she'echshich - 24": "Mishnah_Shabbat.24"
	};

	masechet_url = getSefariaMishnahUrl(masechtot[masechetName] || "Mishnah_Berakhot.1");
}


//mazal of the hour
function setMasechet()
{
    var url = new URL(document.location.href);
    var marrigeHour = url.searchParams.get("hebrewHour");
    var marrigeDay = url.searchParams.get("hebrewDay");

    hebrewday = marrigeDay ? parseInt(marrigeDay) : hebrewday;

    //hebrewday
    //lbHourClock
    var Hour; // = masechet_offset();
    if (lbHour < 12)
		Hour = lbHour + 1;
	else
		Hour = lbHour - 12 + 1;
    
	if(marrigeHour)
		if(marrigeHour == 12)
			Hour = 12;
		else
			Hour = (parseInt(marrigeHour)%12);

	if(Hour == 0)
		Hour+=1;

	var ShabatHour = lbHour + 1;
    ShabatHour = marrigeHour ? (parseInt(marrigeHour)) : ShabatHour; // = sefer_offset();



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
                case (12):
                    document.getElementById("Masechet").value = "Brachot";
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
                case (8):
                    document.getElementById("Masechet").value = "Yevamot";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "K'tuvot";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "Nedarim";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "Nazir";
                    break;
                case (12):
                    document.getElementById("Masechet").value = "Sotah";
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
                case (11):
                    document.getElementById("Masechet").value = "Baba kama";
                    break;
                case (12):
                    document.getElementById("Masechet").value = "Baba metzia";
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
                case (12):
                    document.getElementById("Masechet").value = "Zevachim";
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
	setMasechetUrl();
}

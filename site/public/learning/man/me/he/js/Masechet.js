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
	return "https://www.sefaria.org/" + ref + "?lang=he";
}

var masechetRefs = {
	"ברכות": "Mishnah_Berakhot",
	"פאה": "Mishnah_Peah",
	"דמאי": "Mishnah_Demai",
	"כלאים": "Mishnah_Kilayim",
	"שביעית": "Mishnah_Sheviit",
	"תרומות": "Mishnah_Terumot",
	"מעשרות": "Mishnah_Maasrot",
	"מעשר שני": "Mishnah_Maaser_Sheni",
	"חלה": "Mishnah_Challah",
	"ערלה": "Mishnah_Orlah",
	"ביכורים": "Mishnah_Bikkurim",
	"שבת": "Mishnah_Shabbat",
	"עירובין": "Mishnah_Eruvin",
	"פסחים": "Mishnah_Pesachim",
	"שקלים": "Mishnah_Shekalim",
	"יומא": "Mishnah_Yoma",
	"סוכה": "Mishnah_Sukkah",
	"ביצה": "Mishnah_Beitzah",
	"ראש השנה": "Mishnah_Rosh_Hashanah",
	"תענית": "Mishnah_Taanit",
	"מגילה": "Mishnah_Megillah",
	"מועד קטן": "Mishnah_Moed_Katan",
	"חגיגה": "Mishnah_Chagigah",
	"יבמות": "Mishnah_Yevamot",
	"כתובות": "Mishnah_Ketubot",
	"נדרים": "Mishnah_Nedarim",
	"נזיר": "Mishnah_Nazir",
	"סוטה": "Mishnah_Sotah",
	"גיטין": "Mishnah_Gittin",
	"קידושין": "Mishnah_Kiddushin",
	"בבא קמא": "Mishnah_Bava_Kamma",
	"בבא מציעא": "Mishnah_Bava_Metzia",
	"בבא בתרא": "Mishnah_Bava_Batra",
	"סנהדרין": "Mishnah_Sanhedrin",
	"מכות": "Mishnah_Makkot",
	"שבועות": "Mishnah_Shevuot",
	"עדיות": "Mishnah_Eduyot",
	"עבודה זרה": "Mishnah_Avodah_Zarah",
	"אבות": "Mishnah_Avot",
	"הוריות": "Mishnah_Horayot",
	"זבחים": "Mishnah_Zevachim",
	"מנחות": "Mishnah_Menachot",
	"חולין": "Mishnah_Chullin",
	"בכורות": "Mishnah_Bekhorot",
	"ערכין": "Mishnah_Arakhin",
	"תמורה": "Mishnah_Temurah",
	"כריתות": "Mishnah_Keritot",
	"מעילה": "Mishnah_Meilah",
	"תמיד": "Mishnah_Tamid",
	"מדות": "Mishnah_Middot",
	"מידות": "Mishnah_Middot",
	"קנים": "Mishnah_Kinnim",
	"כלים": "Mishnah_Kelim",
	"אהלות": "Mishnah_Oholot",
	"אוהלות": "Mishnah_Oholot",
	"נגעים": "Mishnah_Negaim",
	"פרה": "Mishnah_Parah",
	"טהרות": "Mishnah_Tahorot",
	"מקואות": "Mishnah_Mikvaot",
	"נדה": "Mishnah_Niddah",
	"נידה": "Mishnah_Niddah",
	"מכשירין": "Mishnah_Makhshirin",
	"זבים": "Mishnah_Zavim",
	"טבול יום": "Mishnah_Tevul_Yom",
	"ידים": "Mishnah_Yadayim",
	"ידיים": "Mishnah_Yadayim",
	"עוקצין": "Mishnah_Oktzin",
	"1 - יציאות השבת": "Mishnah_Shabbat.1",
	"2 - במה מדליקין": "Mishnah_Shabbat.2",
	"3 - כירה": "Mishnah_Shabbat.3",
	"4 - במה טומנין": "Mishnah_Shabbat.4",
	"5 - במה בהמה": "Mishnah_Shabbat.5",
	"6 - במה אשה": "Mishnah_Shabbat.6",
	"7 - כלל גדול": "Mishnah_Shabbat.7",
	"8 - המוציא יין": "Mishnah_Shabbat.8",
	"9 - אמר רבי עקיבא": "Mishnah_Shabbat.9",
	"10 - המצניע": "Mishnah_Shabbat.10",
	"11 - הזורק": "Mishnah_Shabbat.11",
	"12 - הבונה": "Mishnah_Shabbat.12",
	"13 - האורג": "Mishnah_Shabbat.13",
	"14 - שמנה שרצים": "Mishnah_Shabbat.14",
	"15 - ואלו קשרים": "Mishnah_Shabbat.15",
	"16 - כל כתבי": "Mishnah_Shabbat.16",
	"17 - כל הכלים": "Mishnah_Shabbat.17",
	"18 - מפנין": "Mishnah_Shabbat.18",
	"רבי אליעזר דמילה19 - ": "Mishnah_Shabbat.19",
	"20 - תולין": "Mishnah_Shabbat.20",
	"21 - נוטל": "Mishnah_Shabbat.21",
	"22 - חבית": "Mishnah_Shabbat.22",
	"23 - שואל": "Mishnah_Shabbat.23",
	"24 - מי שהחשיך": "Mishnah_Shabbat.24"
};

var masechetChapterCounts = {
	"ברכות": 9,
	"פאה": 8,
	"דמאי": 7,
	"כלאים": 9,
	"שביעית": 10,
	"תרומות": 11,
	"מעשרות": 5,
	"מעשר שני": 5,
	"חלה": 4,
	"ערלה": 3,
	"ביכורים": 4,
	"שבת": 24,
	"עירובין": 10,
	"פסחים": 10,
	"שקלים": 8,
	"יומא": 8,
	"סוכה": 5,
	"ביצה": 5,
	"ראש השנה": 4,
	"תענית": 4,
	"מגילה": 4,
	"מועד קטן": 3,
	"חגיגה": 3,
	"יבמות": 16,
	"כתובות": 13,
	"נדרים": 11,
	"נזיר": 9,
	"סוטה": 9,
	"גיטין": 9,
	"קידושין": 4,
	"בבא קמא": 10,
	"בבא מציעא": 10,
	"בבא בתרא": 10,
	"סנהדרין": 11,
	"מכות": 3,
	"שבועות": 8,
	"עדיות": 8,
	"עבודה זרה": 5,
	"אבות": 6,
	"הוריות": 3,
	"זבחים": 14,
	"מנחות": 13,
	"חולין": 12,
	"בכורות": 9,
	"ערכין": 9,
	"תמורה": 7,
	"כריתות": 6,
	"מעילה": 6,
	"תמיד": 7,
	"מדות": 5,
	"מידות": 5,
	"קנים": 3,
	"כלים": 30,
	"אהלות": 18,
	"אוהלות": 18,
	"נגעים": 14,
	"פרה": 12,
	"טהרות": 10,
	"מקואות": 10,
	"נדה": 10,
	"נידה": 10,
	"מכשירין": 6,
	"זבים": 5,
	"טבול יום": 4,
	"ידים": 4,
	"ידיים": 4,
	"עוקצין": 3
};

var shabbatChapterMishnahCounts = {
	1: 11,
	2: 7,
	3: 6,
	4: 2,
	5: 4,
	6: 10,
	7: 4,
	8: 7,
	9: 7,
	10: 6,
	11: 6,
	12: 6,
	13: 7,
	14: 4,
	15: 3,
	16: 8,
	17: 8,
	18: 3,
	19: 6,
	20: 5,
	21: 3,
	22: 6,
	23: 5,
	24: 5
};

function isAfterSunsetForMasechet(date)
{
	if (typeof sunsetH === "undefined" || typeof sunsetM === "undefined" || typeof sunsetS === "undefined")
		return false;

	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();

	return (hour > sunsetH) ||
		(hour == sunsetH && minute > sunsetM) ||
		(hour == sunsetH && minute == sunsetM && second >= sunsetS);
}

function getHebrewDayInMonthForMasechet()
{
	var date = typeof getSelectedLearningDate == "function" ? getSelectedLearningDate(new Date()) : new Date();

	if (isAfterSunsetForMasechet(date))
	{
		date = new Date(date.getTime());
		date.setDate(date.getDate() + 1);
	}

	var hebrew = typeof hebrewDate == "function" ? hebrewDate(date, null, null, "English") : null;
	var dayInMonth = hebrew ? parseInt(hebrew.date, 10) : NaN;

	return isNaN(dayInMonth) ? 1 : dayInMonth;
}

function getMasechetChapterByHebrewDay(chapterCount)
{
	var dayInMonth = getHebrewDayInMonthForMasechet();
	var chapter = dayInMonth % chapterCount;

	return chapter == 0 ? chapterCount : chapter;
}

function getShabbatMishnahRefByHebrewDay(ref)
{
	var match = ref.match(/^Mishnah_Shabbat\.(\d+)$/);
	if (!match)
		return ref;

	var chapter = parseInt(match[1], 10);
	var mishnahCount = shabbatChapterMishnahCounts[chapter];
	if (!mishnahCount)
		return ref;

	return ref + "." + getMasechetChapterByHebrewDay(mishnahCount);
}

function setMasechetUrl()
{
	var masechetName = document.getElementById("Masechet").value;
	var ref = masechetRefs[masechetName] || "Mishnah_Berakhot";
	var chapterCount = masechetChapterCounts[masechetName] || masechetChapterCounts["ברכות"];

	if (ref.indexOf(".") == -1)
		ref = ref + "." + getMasechetChapterByHebrewDay(chapterCount);

	ref = getShabbatMishnahRefByHebrewDay(ref);

	masechet_url = getSefariaMishnahUrl(ref);
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
	
	//console.log(Hour);
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
                case (12):
                    document.getElementById("Masechet").value = "ברכות";
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
                case (8):
                    document.getElementById("Masechet").value = "יבמות";
                    break;
                case (9):
                    document.getElementById("Masechet").value = "כתובות";
                    break;
                case (10):
                    document.getElementById("Masechet").value = "נדרים";
                    break;
                case (11):
                    document.getElementById("Masechet").value = "נזיר";
                    break;
                case (12):
                    document.getElementById("Masechet").value = "סוטה";
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
                case (11):
                    document.getElementById("Masechet").value = "בבא קמא";
                    break;
                case (12):
                    document.getElementById("Masechet").value = "בבא מציעא";
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
                case (12):
                    document.getElementById("Masechet").value = "זבחים";
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
	setMasechetUrl();
}

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

var shabbatChapterMishnahCounts = {
	1: 11, 2: 7, 3: 6, 4: 2, 5: 4, 6: 10,
	7: 4, 8: 7, 9: 7, 10: 6, 11: 6, 12: 6,
	13: 7, 14: 4, 15: 3, 16: 8, 17: 8, 18: 3,
	19: 6, 20: 5, 21: 3, 22: 6, 23: 5, 24: 5
};

var masechetChapterCounts = {
	"ברכות": 9, "פאה": 8, "דמאי": 7, "כלאים": 9, "שביעית": 10,
	"תרומות": 11, "מעשרות": 5, "מעשר שני": 5, "חלה": 4, "ערלה": 3,
	"ביכורים": 4, "שבת": 24, "עירובין": 10, "פסחים": 10, "שקלים": 8,
	"יומא": 8, "סוכה": 5, "ביצה": 5, "ראש השנה": 4, "תענית": 4,
	"מגילה": 4, "מועד קטן": 3, "חגיגה": 3, "יבמות": 16, "כתובות": 13,
	"נדרים": 11, "נזיר": 9, "סוטה": 9, "גיטין": 9, "קידושין": 4,
	"בבא קמא": 10, "בבא מציעא": 10, "בבא בתרא": 10, "סנהדרין": 11,
	"מכות": 3, "שבועות": 8, "עדיות": 8, "עבודה זרה": 5, "אבות": 6,
	"הוריות": 3, "זבחים": 14, "מנחות": 13, "חולין": 12, "בכורות": 9,
	"ערכין": 9, "תמורה": 7, "כריתות": 6, "מעילה": 6, "תמיד": 7,
	"מדות": 5, "מידות": 5, "קנים": 3, "כלים": 30, "אהלות": 18,
	"אוהלות": 18, "נגעים": 14, "פרה": 12, "טהרות": 10, "מקואות": 10,
	"נדה": 10, "נידה": 10, "מכשירין": 6, "זבים": 5, "טבול יום": 4,
	"ידים": 4, "ידיים": 4, "עוקצין": 3
};

function getHebrewDayInMonthForMasechet()
{
	var fallbackDate = typeof getCurrentClockDate == "function" ? getCurrentClockDate() : new Date();
	var date = typeof getSelectedLearningDate == "function" ? getSelectedLearningDate(fallbackDate) : fallbackDate;
	if (typeof sunsetH !== "undefined" && typeof sunsetM !== "undefined" && typeof sunsetS !== "undefined" &&
		(date.getHours() > sunsetH ||
		(date.getHours() == sunsetH && date.getMinutes() > sunsetM) ||
		(date.getHours() == sunsetH && date.getMinutes() == sunsetM && date.getSeconds() >= sunsetS)))
	{
		date = new Date(date.getTime());
		date.setDate(date.getDate() + 1);
	}
	var hebrew = typeof hebrewDate == "function" ? hebrewDate(date, null, null, "English") : null;
	var dayInMonth = hebrew ? parseInt(hebrew.date, 10) : NaN;

	return isNaN(dayInMonth) ? 1 : dayInMonth;
}

function getShabbatMishnahRefByHebrewDay(ref)
{
	var match = ref.match(/^Mishnah_Shabbat\.(\d+)$/);
	if (!match)
		return ref;

	var mishnahCount = shabbatChapterMishnahCounts[parseInt(match[1], 10)];
	if (!mishnahCount)
		return ref;

	var dayInMonth = getHebrewDayInMonthForMasechet();
	var mishnah = dayInMonth % mishnahCount;
	return ref + "." + (mishnah == 0 ? mishnahCount : mishnah);
}

function getMasechetChapterByHebrewDay(chapterCount)
{
	var dayInMonth = getHebrewDayInMonthForMasechet();
	var chapter = dayInMonth % chapterCount;
	return chapter == 0 ? chapterCount : chapter;
}

function setMasechetUrl()
{
	var masechetName = document.getElementById("Masechet").value;
	var masechtot = {
		"ברכות": "Mishnah_Berakhot.1",
		"פאה": "Mishnah_Peah.1",
		"דמאי": "Mishnah_Demai.1",
		"כלאים": "Mishnah_Kilayim.1",
		"שביעית": "Mishnah_Sheviit.1",
		"תרומות": "Mishnah_Terumot.1",
		"מעשרות": "Mishnah_Maasrot.1",
		"מעשר שני": "Mishnah_Maaser_Sheni.1",
		"חלה": "Mishnah_Challah.1",
		"ערלה": "Mishnah_Orlah.1",
		"ביכורים": "Mishnah_Bikkurim.1",
		"שבת": "Mishnah_Shabbat.1",
		"עירובין": "Mishnah_Eruvin.1",
		"פסחים": "Mishnah_Pesachim.1",
		"שקלים": "Mishnah_Shekalim.1",
		"יומא": "Mishnah_Yoma.1",
		"סוכה": "Mishnah_Sukkah.1",
		"ביצה": "Mishnah_Beitzah.1",
		"ראש השנה": "Mishnah_Rosh_Hashanah.1",
		"תענית": "Mishnah_Taanit.1",
		"מגילה": "Mishnah_Megillah.1",
		"מועד קטן": "Mishnah_Moed_Katan.1",
		"חגיגה": "Mishnah_Chagigah.1",
		"יבמות": "Mishnah_Yevamot.1",
		"כתובות": "Mishnah_Ketubot.1",
		"נדרים": "Mishnah_Nedarim.1",
		"נזיר": "Mishnah_Nazir.1",
		"סוטה": "Mishnah_Sotah.1",
		"גיטין": "Mishnah_Gittin.1",
		"קידושין": "Mishnah_Kiddushin.1",
		"בבא קמא": "Mishnah_Bava_Kamma.1",
		"בבא מציעא": "Mishnah_Bava_Metzia.1",
		"בבא בתרא": "Mishnah_Bava_Batra.1",
		"סנהדרין": "Mishnah_Sanhedrin.1",
		"מכות": "Mishnah_Makkot.1",
		"שבועות": "Mishnah_Shevuot.1",
		"עדיות": "Mishnah_Eduyot.1",
		"עבודה זרה": "Mishnah_Avodah_Zarah.1",
		"אבות": "Mishnah_Avot.1",
		"הוריות": "Mishnah_Horayot.1",
		"זבחים": "Mishnah_Zevachim.1",
		"מנחות": "Mishnah_Menachot.1",
		"חולין": "Mishnah_Chullin.1",
		"בכורות": "Mishnah_Bekhorot.1",
		"ערכין": "Mishnah_Arakhin.1",
		"תמורה": "Mishnah_Temurah.1",
		"כריתות": "Mishnah_Keritot.1",
		"מעילה": "Mishnah_Meilah.1",
		"תמיד": "Mishnah_Tamid.1",
		"מדות": "Mishnah_Middot.1",
		"קנים": "Mishnah_Kinnim.1",
		"כלים": "Mishnah_Kelim.1",
		"אהלות": "Mishnah_Oholot.1",
		"נגעים": "Mishnah_Negaim.1",
		"פרה": "Mishnah_Parah.1",
		"טהרות": "Mishnah_Tahorot.1",
		"מקואות": "Mishnah_Mikvaot.1",
		"נדה": "Mishnah_Niddah.1",
		"מכשירין": "Mishnah_Makhshirin.1",
		"זבים": "Mishnah_Zavim.1",
		"טבול יום": "Mishnah_Tevul_Yom.1",
		"ידים": "Mishnah_Yadayim.1",
		"עוקצין": "Mishnah_Oktzin.1",
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

	var ref = masechtot[masechetName] || "Mishnah_Berakhot.1";
	var isSpecificShabbatChapter = /^\d+\s*-/.test(masechetName) || masechetName == "רבי אליעזר דמילה19 - ";

	if (isSpecificShabbatChapter)
	{
		ref = getShabbatMishnahRefByHebrewDay(ref);
	}
	else
	{
		var chapterCount = masechetChapterCounts[masechetName] || masechetChapterCounts["ברכות"];
		ref = ref.replace(/\.\d+$/, "") + "." + getMasechetChapterByHebrewDay(chapterCount);
	}
	masechet_url = getSefariaMishnahUrl(ref);
}


//mazal of the hour
function setMasechet()
{
    var url = new URL(document.location.href);
    var marrigeHour = url.searchParams.get("hebrewHour");
    var marrigeDay = url.searchParams.get("hebrewDay");
	var personalLimudUnit = getPersonalLimudMoladUnit(new Date());

    hebrewday = marrigeDay ? parseInt(marrigeDay) : personalLimudUnit.day;

    //hebrewday
    //lbHourClock
    var Hour = ((personalLimudUnit.hour - 1) % 12) + 1; // = masechet_offset();
    
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

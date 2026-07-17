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

function getSefariaParashaUrl(ref)
{
	return "https://www.sefaria.org/" + ref + "?lang=he";
}

function getSefariaZoharUrl(ref)
{
	return "https://www.sefaria.org/" + ref.replace(/ /g, "_") + "?vhe=Hebrew_Translation&lang=he";
}

var zoharParashaRefs = {
	"בראשית": "Zohar, Bereshit",
	"נח": "Zohar, Noach",
	"לך לך": "Zohar, Lech Lecha",
	"וירא": "Zohar, Vayera",
	"חיי שרה": "Zohar, Chayei Sara",
	"תולדות": "Zohar, Toldot",
	"ויצא": "Zohar, Vayetzei",
	"וישלח": "Zohar, Vayishlach",
	"וישב": "Zohar, Vayeshev",
	"מקץ": "Zohar, Miketz",
	"ויגש": "Zohar, Vayigash",
	"ויחי": "Zohar, Vayechi",
	"שמות": "Zohar, Shemot",
	"וארא": "Zohar, Vaera",
	"בא": "Zohar, Bo",
	"בשלח": "Zohar, Beshalach",
	"יתרו": "Zohar, Yitro",
	"משפטים": "Zohar, Mishpatim",
	"תרומה": "Zohar, Terumah",
	"תצווה": "Zohar, Tetzaveh",
	"תצוה": "Zohar, Tetzaveh",
	"כי תשא": "Zohar, Ki Tisa",
	"ויקהל": "Zohar, Vayakhel",
	"פקודי": "Zohar, Pekudei",
	"ויקרא": "Zohar, Vayikra",
	"צו": "Zohar, Tzav",
	"שמיני": "Zohar, Shmini",
	"תזריע": "Zohar, Tazria",
	"מצורע": "Zohar, Metzora",
	"אחרי מות": "Zohar, Achrei Mot",
	"אחרי": "Zohar, Achrei Mot",
	"קדושים": "Zohar, Kedoshim",
	"אמר": "Zohar, Emor",
	"אמור": "Zohar, Emor",
	"בהר": "Zohar, Behar",
	"בחוקותי": "Zohar, Bechukotai",
	"בחקותי": "Zohar, Bechukotai",
	"במדבר": "Zohar, Bamidbar",
	"נשא": "Zohar, Nasso",
	"בהעלותך": "Zohar, Beha'alotcha",
	"שלח": "Zohar, Sh'lach",
	"שלח לך": "Zohar, Sh'lach",
	"קורח": "Zohar, Korach",
	"קרח": "Zohar, Korach",
	"חוקת": "Zohar, Chukat",
	"חקת": "Zohar, Chukat",
	"בלק": "Zohar, Balak",
	"פינחס": "Zohar, Pinchas",
	"פנחס": "Zohar, Pinchas",
	"מטות": "Zohar, Matot",
	"מסעי": null,
	"דברים": null,
	"ואתחנן": "Zohar, Vaetchanan",
	"עקב": "Zohar, Eikev",
	"ראה": null,
	"שופטים": "Zohar, Shoftim",
	"כי תצא": "Zohar, Ki Teitzei",
	"כי תבוא": null,
	"כי תבא": null,
	"נצבים": null,
	"ניצבים": null,
	"וילך": "Zohar, Vayeilech",
	"האזינו": "Zohar, Ha'Azinu",
	"וזאת הברכה": null
};

function getSefariaZoharParashaUrl(parashaName)
{
	var zoharRef = zoharParashaRefs[parashaName];

	if (zoharRef)
		return getSefariaZoharUrl(zoharRef);

	return "https://www.sefaria.org/Zohar?vhe=Hebrew_Translation&lang=he";
}

function setParashaSefariaUrl()
{
	var parashaName = document.getElementById("Parasha").value;
	var parashot = {
		"בראשית": "Genesis.1.1",
		"נח": "Genesis.6.9",
		"לך לך": "Genesis.12.1",
		"וירא": "Genesis.18.1",
		"חיי שרה": "Genesis.23.1",
		"תולדות": "Genesis.25.19",
		"ויצא": "Genesis.28.10",
		"וישלח": "Genesis.32.4",
		"וישב": "Genesis.37.1",
		"מקץ": "Genesis.41.1",
		"ויגש": "Genesis.44.18",
		"ויחי": "Genesis.47.28",
		"שמות": "Exodus.1.1",
		"וארא": "Exodus.6.2",
		"בא": "Exodus.10.1",
		"בשלח": "Exodus.13.17",
		"יתרו": "Exodus.18.1",
		"משפטים": "Exodus.21.1",
		"תרומה": "Exodus.25.1",
		"תצווה": "Exodus.27.20",
		"כי תשא": "Exodus.30.11",
		"ויקהל": "Exodus.35.1",
		"פקודי": "Exodus.38.21",
		"ויקרא": "Leviticus.1.1",
		"צו": "Leviticus.6.1",
		"שמיני": "Leviticus.9.1",
		"תזריע": "Leviticus.12.1",
		"מצורע": "Leviticus.14.1",
		"אחרי מות": "Leviticus.16.1",
		"קדושים": "Leviticus.19.1",
		"אמר": "Leviticus.21.1",
		"בהר": "Leviticus.25.1",
		"בחוקותי": "Leviticus.26.3",
		"במדבר": "Numbers.1.1",
		"נשא": "Numbers.4.21",
		"בהעלותך": "Numbers.8.1",
		"שלח": "Numbers.13.1",
		"קורח": "Numbers.16.1",
		"חוקת": "Numbers.19.1",
		"בלק": "Numbers.22.2",
		"פינחס": "Numbers.25.10",
		"מטות": "Numbers.30.2",
		"מסעי": "Numbers.33.1",
		"דברים": "Deuteronomy.1.1",
		"ואתחנן": "Deuteronomy.3.23",
		"עקב": "Deuteronomy.7.12",
		"ראה": "Deuteronomy.11.26",
		"שופטים": "Deuteronomy.16.18",
		"כי תצא": "Deuteronomy.21.10",
		"כי תבוא": "Deuteronomy.26.1",
		"נצבים": "Deuteronomy.29.9",
		"וילך": "Deuteronomy.31.1",
		"האזינו": "Deuteronomy.32.1",
		"וזאת הברכה": "Deuteronomy.33.1"
	};

	parasha_url = getSefariaParashaUrl(parashot[parashaName] || "Genesis.1.1");
}
//parasha of the hour
function setParasha()
{
    var url = new URL(document.location.href);
    var marrigeHour = url.searchParams.get("hebrewHour");
    var marrigeDay = url.searchParams.get("hebrewDay");
	parasha_url = "http://ravoldsite.com/archives/archives_h.html";

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
                case (12):
                    document.getElementById("Parasha").value = "ויחי";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%97%D7%99/";
                    break;
                default:
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
                    document.getElementById("Parasha").value = "שמות";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%95%D7%AA/";
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
                case (9):
                    document.getElementById("Parasha").value = "ויקרא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A7%D7%A8%D7%90/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "צו";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A6%D7%95/";
                    break;
                case (11):
                    document.getElementById("Parasha").value = "שמיני";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%99%D7%A0%D7%99/";
                    break;
                case (12):
                    document.getElementById("Parasha").value = "תזריע";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%96%D7%A8%D7%99%D7%A2/";
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
                case (11):
                    document.getElementById("Parasha").value = "במדבר";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%9E%D7%93%D7%91%D7%A8/";
                    break;
                case (12):
                    document.getElementById("Parasha").value = "נשא";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A0%D7%A9%D7%90/";
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
                case (12):
                    document.getElementById("Parasha").value = "דברים";
                    parasha_url = "https://haravelon.co.il/tag/%D7%93%D7%91%D7%A8%D7%99%D7%9D/";
                    break;
                default:
                    document.getElementById("Parasha").value = "ואתחנן";
                    break;
            }
            break;
        case (6):
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
                case (12):
                    document.getElementById("Parasha").value = "ויחי";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%97%D7%99/";
                    break;
                default:
                    break;
            }
            break;
        case (7):
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
                    document.getElementById("Parasha").value = "שמות";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%95%D7%AA/";
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
	parasha_elon_url = parasha_url;
	setParashaSefariaUrl();
}

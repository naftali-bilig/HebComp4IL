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
	return "https://www.sefaria.org/" + ref + "?lang=bi";
}

function setParashaSefariaUrl()
{
	var parashaName = document.getElementById("Parasha").value;
	var parashot = {
		"Bereshit": "Genesis.1.1",
		"Noach": "Genesis.6.9",
		"Lech lecha": "Genesis.12.1",
		"Vayeira": "Genesis.18.1",
		"Chayei sarah": "Genesis.23.1",
		"Toldot": "Genesis.25.19",
		"Vayeitzei": "Genesis.28.10",
		"Vayishlach": "Genesis.32.4",
		"Vayeishev": "Genesis.37.1",
		"Mikeitz": "Genesis.41.1",
		"Vayigash": "Genesis.44.18",
		"Vayechi": "Genesis.47.28",
		"Shemot": "Exodus.1.1",
		"Va'eira": "Exodus.6.2",
		"Bo": "Exodus.10.1",
		"Beshalach": "Exodus.13.17",
		"Yitro": "Exodus.18.1",
		"Mishpatim": "Exodus.21.1",
		"Terumah": "Exodus.25.1",
		"Tetzaveh": "Exodus.27.20",
		"Ki tisa": "Exodus.30.11",
		"Vayakhel": "Exodus.35.1",
		"Pekudei": "Exodus.38.21",
		"Vayikra": "Leviticus.1.1",
		"Tzav": "Leviticus.6.1",
		"Shemini": "Leviticus.9.1",
		"Tazria": "Leviticus.12.1",
		"Metzora": "Leviticus.14.1",
		"Acharei mot": "Leviticus.16.1",
		"Kedoshim": "Leviticus.19.1",
		"Emor": "Leviticus.21.1",
		"Behar": "Leviticus.25.1",
		"Bechukotai": "Leviticus.26.3",
		"Bamidbar": "Numbers.1.1",
		"Nasso": "Numbers.4.21",
		"Beha'alotcha": "Numbers.8.1",
		"Shelach": "Numbers.13.1",
		"Korach": "Numbers.16.1",
		"Chukat": "Numbers.19.1",
		"Balak": "Numbers.22.2",
		"Pinchas": "Numbers.25.10",
		"Mattot": "Numbers.30.2",
		"Masei": "Numbers.33.1",
		"Devarim": "Deuteronomy.1.1",
		"Va'etchanan": "Deuteronomy.3.23",
		"Eikev": "Deuteronomy.7.12",
		"Re'eh": "Deuteronomy.11.26",
		"Shoftim": "Deuteronomy.16.18",
		"Ki teitzei": "Deuteronomy.21.10",
		"Ki tavo": "Deuteronomy.26.1",
		"Nitzavim": "Deuteronomy.29.9",
		"Vayeilech": "Deuteronomy.31.1",
		"Haazinu": "Deuteronomy.32.1",
		"Vezot haberachah": "Deuteronomy.33.1"
	};

	parasha_url = getSefariaParashaUrl(parashot[parashaName] || "Genesis.1.1");
}
//parasha of the hour
function setParasha()
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
                case (12):
                    document.getElementById("Parasha").value = "Vayechi";
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
                    document.getElementById("Parasha").value = "Shemot";
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
                case (9):
                    document.getElementById("Parasha").value = "Vayikra";
                    parasha_url = "https://haravelon.co.il/tag/%D7%95%D7%99%D7%A7%D7%A8%D7%90/";
                    break;
                case (10):
                    document.getElementById("Parasha").value = "Tzav";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A6%D7%95/";
                    break;
                case (11):
                    document.getElementById("Parasha").value = "Shemini";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%99%D7%A0%D7%99/";
                    break;
                case (12):
                    document.getElementById("Parasha").value = "Tazria";
                    parasha_url = "https://haravelon.co.il/tag/%D7%AA%D7%96%D7%A8%D7%99%D7%A2/";
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
                case (11):
                    document.getElementById("Parasha").value = "Bamidbar";
                    parasha_url = "https://haravelon.co.il/tag/%D7%91%D7%9E%D7%93%D7%91%D7%A8/";
                    break;
                case (12):
                    document.getElementById("Parasha").value = "Nasso";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A0%D7%A9%D7%90/";
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
                case (12):
                    document.getElementById("Parasha").value = "Devarim";
                    parasha_url = "https://haravelon.co.il/tag/%D7%93%D7%91%D7%A8%D7%99%D7%9D/";
                    break;
                default:
                    document.getElementById("Parasha").value = "Freedom";
                    break;
            }
            break;
        case (6):
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
                case (12):
                    document.getElementById("Parasha").value = "Vayechi";
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
                    document.getElementById("Parasha").value = "Shemot";
                    parasha_url = "https://haravelon.co.il/tag/%D7%A9%D7%9E%D7%95%D7%AA/";
                    break;
                default:
                    break;
            }
            break;    
	}
	setParashaSefariaUrl();
}
function sefer_offset()
{
	var Hour;
	if (lbHour < 22)
		Hour = parseInt(lbHour) + 1 + 2;
	else
		Hour = parseInt(lbHour) + 1 + 2 - 12 - 12;

	return Hour;
}

function getSefariaUrl(ref)
{
	return "https://www.sefaria.org/" + ref + "?lang=he";
}


function get929Url(sefer)
{
	return sefer.link929;
}
const sefarim = [
	{ label: "בראשית", ref: "Genesis.1", link929: "https://www.929.org.il/page/1" },
	{ label: "שמות", ref: "Exodus.1", link929: "https://www.929.org.il/page/51" },
	{ label: "ויקרא", ref: "Leviticus.1", link929: "https://www.929.org.il/page/91" },
	{ label: "במדבר", ref: "Numbers.1", link929: "https://www.929.org.il/page/118" },
	{ label: "דברים", ref: "Deuteronomy.1", link929: "https://www.929.org.il/page/154" },
	{ label: "יהושע", ref: "Joshua.1", link929: "https://www.929.org.il/page/188" },
	{ label: "שופטים", ref: "Judges.1", link929: "https://www.929.org.il/page/212" },
	{ label: "שמואל", ref: "I_Samuel.1", link929: "https://www.929.org.il/page/233" },
	{ label: "מלכים", ref: "I_Kings.1", link929: "https://www.929.org.il/page/288" },
	{ label: "ישעיהו", ref: "Isaiah.1", link929: "https://www.929.org.il/page/335" },
	{ label: "ירמיהו", ref: "Jeremiah.1", link929: "https://www.929.org.il/page/401" },
	{ label: "יחזקאל", ref: "Ezekiel.1", link929: "https://www.929.org.il/page/453" },
	{ label: "תרי עשר", ref: "Hosea.1", link929: "https://www.929.org.il/page/501" },
	{ label: "תהילים", ref: "Psalms.1", link929: "https://www.929.org.il/page/568" },
	{ label: "משלי", ref: "Proverbs.1", link929: "https://www.929.org.il/page/718" },
	{ label: "איוב", ref: "Job.1", link929: "https://www.929.org.il/page/749" },
	{ label: "שיר השירים", ref: "Song_of_Songs.1", link929: "https://www.929.org.il/page/791" },
	{ label: "רות", ref: "Ruth.1", link929: "https://www.929.org.il/page/799" },
	{ label: "איכה", ref: "Lamentations.1", link929: "https://www.929.org.il/page/803" },
	{ label: "קהלת", ref: "Ecclesiastes.1", link929: "https://www.929.org.il/page/808" },
	{ label: "אסתר", ref: "Esther.1", link929: "https://www.929.org.il/page/820" },
	{ label: "דניאל", ref: "Daniel.1", link929: "https://www.929.org.il/page/830" },
	{ label: "עזרא ונחמיה", ref: "Ezra.1", link929: "https://www.929.org.il/page/842" },
	{ label: "דברי הימים", ref: "I_Chronicles.1", link929: "https://www.929.org.il/page/865" }
];

function setSefer()
{
	var url = new URL(document.location.href);
	var marrigeHour = url.searchParams.get("hebrewHour");
	var personalLimudUnit = getPersonalLimudMoladUnit(new Date());
	var Hour = personalLimudUnit.hour;
	Hour = marrigeHour ? parseInt(marrigeHour) : Hour;

	var sefer = sefarim[Hour - 1];
	if(!sefer)
		return;

	document.getElementById("Sefer").value = sefer.label;
	sefer_929_url = get929Url(sefer);
	sefer_url = getSefariaUrl(sefer.ref);
}

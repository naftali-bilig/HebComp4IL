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
	return "https://www.sefaria.org/" + ref + "?lang=bi";
}


function get929Url(sefer)
{
	return sefer.link929;
}
const sefarim = [
	{ label: "Bereshit", ref: "Genesis.1", link929: "https://www.929.org.il/lang/en/page/1" },
	{ label: "Shemot", ref: "Exodus.1", link929: "https://www.929.org.il/lang/en/page/51" },
	{ label: "Vayikra", ref: "Leviticus.1", link929: "https://www.929.org.il/lang/en/page/91" },
	{ label: "Bamidbar", ref: "Numbers.1", link929: "https://www.929.org.il/lang/en/page/118" },
	{ label: "Devarim", ref: "Deuteronomy.1", link929: "https://www.929.org.il/lang/en/page/154" },
	{ label: "Yo'ho'sho'a", ref: "Joshua.1", link929: "https://www.929.org.il/lang/en/page/188" },
	{ label: "Shoftim", ref: "Judges.1", link929: "https://www.929.org.il/lang/en/page/212" },
	{ label: "Shmo'el", ref: "I_Samuel.1", link929: "https://www.929.org.il/lang/en/page/233" },
	{ label: "Melachim", ref: "I_Kings.1", link929: "https://www.929.org.il/lang/en/page/288" },
	{ label: "Yisha'ayaou", ref: "Isaiah.1", link929: "https://www.929.org.il/lang/en/page/335" },
	{ label: "Yirmi'yaou", ref: "Jeremiah.1", link929: "https://www.929.org.il/lang/en/page/401" },
	{ label: "Yechezkel", ref: "Ezekiel.1", link929: "https://www.929.org.il/lang/en/page/453" },
	{ label: "Tri asar", ref: "Hosea.1", link929: "https://www.929.org.il/lang/en/page/501" },
	{ label: "Tehilim", ref: "Psalms.1", link929: "https://www.929.org.il/lang/en/page/568" },
	{ label: "Mishlei", ref: "Proverbs.1", link929: "https://www.929.org.il/lang/en/page/718" },
	{ label: "Eiyov", ref: "Job.1", link929: "https://www.929.org.il/lang/en/page/749" },
	{ label: "Shir hashirim", ref: "Song_of_Songs.1", link929: "https://www.929.org.il/lang/en/page/791" },
	{ label: "Rut", ref: "Ruth.1", link929: "https://www.929.org.il/lang/en/page/799" },
	{ label: "Eicha", ref: "Lamentations.1", link929: "https://www.929.org.il/lang/en/page/803" },
	{ label: "Ko'helet", ref: "Ecclesiastes.1", link929: "https://www.929.org.il/lang/en/page/808" },
	{ label: "Ester", ref: "Esther.1", link929: "https://www.929.org.il/lang/en/page/820" },
	{ label: "Daniel", ref: "Daniel.1", link929: "https://www.929.org.il/lang/en/page/830" },
	{ label: "Ezra veNechamiah", ref: "Ezra.1", link929: "https://www.929.org.il/lang/en/page/842" },
	{ label: "Divrei hayamim", ref: "I_Chronicles.1", link929: "https://www.929.org.il/lang/en/page/865" }
];

function setSefer()
{
	var url = new URL(document.location.href);
	var marrigeHour = url.searchParams.get("hebrewHour");
	var Hour = lbHour + 1;
	Hour = marrigeHour ? parseInt(marrigeHour) : Hour;

	var sefer = sefarim[Hour - 1];
	if(!sefer)
		return;

	document.getElementById("Sefer").value = sefer.label;
	sefer_929_url = get929Url(sefer);
	sefer_url = getSefariaUrl(sefer.ref);
}

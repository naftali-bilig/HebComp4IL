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
	return "https://www.sefaria.org/" + ref.replace(/ ([0-9])/g, ".$1").replace(/ /g, "_").replace(/:/g, ".") + "?lang=he";
}


function get929Url(sefer)
{
	return sefer.link929;
}

function getSeferMidrashUrl(sefer)
{
	var midrashRabbahRefs = {
		"בראשית": "Bereshit Rabbah",
		"שמות": "Shemot Rabbah",
		"ויקרא": "Vayikra Rabbah",
		"במדבר": "Bamidbar Rabbah",
		"דברים": "Devarim Rabbah"
	};
	var yalkutShimoniRefs = {
		"יהושע": "Yalkut Shimoni on Nach 1:1-37:2",
		"שופטים": "Yalkut Shimoni on Nach 37:3-76:7",
		"שמואל": "Yalkut Shimoni on Nach 76:8-165:24",
		"מלכים": "Yalkut Shimoni on Nach 166:1-252:4",
		"ישעיהו": "Yalkut Shimoni on Nach 385:1-514:3",
		"ירמיהו": "Yalkut Shimoni on Nach 253:1-335:7",
		"יחזקאל": "Yalkut Shimoni on Nach 336:1-384:2",
		"תרי עשר": "Yalkut Shimoni on Nach 515:1-595:3",
		"תהילים": "Yalkut Shimoni on Nach 610:1-890:1",
		"משלי": "Yalkut Shimoni on Nach 929:1-964:25",
		"איוב": "Yalkut Shimoni on Nach 891:1-928:6",
		"שיר השירים": "Yalkut Shimoni on Nach 980:1-994:11",
		"רות": "Yalkut Shimoni on Nach 596:1-609:1",
		"איכה": "Yalkut Shimoni on Nach 995:1-1043:4",
		"קהלת": "Yalkut Shimoni on Nach 965:1-979:78",
		"אסתר": "Yalkut Shimoni on Nach 1044:1-1059:19",
		"דניאל": "Yalkut Shimoni on Nach 1059:20-1066:25",
		"עזרא ונחמיה": "Yalkut Shimoni on Nach 1067:1-1071:18",
		"דברי הימים": "Yalkut Shimoni on Nach 1072:1-1085:30"
	};
	var ref = midrashRabbahRefs[sefer.label] || yalkutShimoniRefs[sefer.label];

	return getSefariaUrl(ref || "Yalkut Shimoni on Nach");
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
	var Hour = lbHour + 1;
	Hour = marrigeHour ? parseInt(marrigeHour) : Hour;

	var sefer = sefarim[Hour - 1];
	if(!sefer)
		return;

	document.getElementById("Sefer").value = sefer.label;
	sefer_929_url = get929Url(sefer);
	sefer_url = getSefariaUrl(sefer.ref);
	sefer_midrash_url = getSeferMidrashUrl(sefer);
}

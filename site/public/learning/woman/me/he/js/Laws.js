function getLawHebrewDay()
{
	var url = new URL(document.location.href);
	var day = url.searchParams.get("hebrewDay");
	if(day)
		return parseInt(day);

	if(typeof getPersonalLimudMoladUnit == "function")
		return getPersonalLimudMoladUnit(new Date()).day;

	if(typeof birthDay != "undefined" && birthDay)
		return parseInt(birthDay);

	if(typeof hebrewday != "undefined" && hebrewday)
		return parseInt(hebrewday);

	return null;
}

function getLawHebrewHour()
{
	var url = new URL(document.location.href);
	var hour = url.searchParams.get("hebrewHour");
	if(hour)
		return parseInt(hour);

	if(typeof getPersonalLimudMoladUnit == "function")
		return getPersonalLimudMoladUnit(new Date()).hour;

	if(typeof birthHour != "undefined" && birthHour)
		return parseInt(birthHour);

	if(typeof lbHour != "undefined")
		return parseInt(lbHour) + 1;

	return null;
}

function getMatchingLaws(day, hour)
{
	var laws = window.HEBREW_CLOCK_LAWS || [];
	return laws.filter(function(law) {
		return Number(law.hebrewDay) == Number(day) &&
			   Number(law.hebrewHour) == Number(hour);
	});
}

function shuffleLaws(laws)
{
	var shuffled = laws.slice();
	for(var i = shuffled.length - 1; i > 0; i--)
	{
		var j = Math.floor(Math.random() * (i + 1));
		var temp = shuffled[i];
		shuffled[i] = shuffled[j];
		shuffled[j] = temp;
	}

	return shuffled;
}

function getLawWikisourceUrl(law)
{
	return "https://he.wikisource.org/wiki/" + encodeURIComponent(getLawWikisourceTitle(law));
}

function getLawWikisourceTitle(law)
{
	var title = law.name || "";
	title = title.replace(/\s*,\s*התש[^,]+?\s*[-–]\s*\d{4}\s*$/, "");
	title = title.replace(/\s+/g, "_");

	return title;
}

function getLawSource(law)
{
	var fallbackUrl = law.knessetPdfUrl || law.olawPdfUrl || law.officialUrl || "";

	return {
		url: law.wikisourceUrl || fallbackUrl || getLawWikisourceUrl(law),
		fallbackUrl: fallbackUrl || getLawWikisourceUrl(law)
	};
}

function updateLawSourceLink(law, link)
{
	if(law.wikisourceUrl)
	{
		link.href = law.wikisourceUrl;
		return;
	}
	if(law.knessetPdfUrl || law.olawPdfUrl || law.officialUrl)
		return;

	var title = getLawWikisourceTitle(law);
	var apiUrl = "https://he.wikisource.org/w/api.php?action=query&format=json&origin=*&titles=" + encodeURIComponent(title);

	fetch(apiUrl)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			var pages = data && data.query && data.query.pages;
			var pageIds = pages ? Object.keys(pages) : [];
			var exists = pageIds.some(function(pageId) {
				return pageId != "-1" && !pages[pageId].missing;
			});

			if(!exists)
				link.href = law.knessetPdfUrl || law.olawPdfUrl || law.officialUrl || getLawWikisourceUrl(law);
		})
		.catch(function() {
			if(law.knessetPdfUrl || law.olawPdfUrl || law.officialUrl)
				link.href = law.knessetPdfUrl || law.olawPdfUrl || law.officialUrl;
		});
}

function setLaws()
{
	var lawsInput = document.getElementById("Laws");
	if(!lawsInput)
		return;

	var day = getLawHebrewDay();
	var hour = getLawHebrewHour();
	var laws = getMatchingLaws(day, hour);

	lawsInput.value = laws.length ? "חוקים (" + laws.length + ")" : "חוקים";
}

function openLawsInNewTab()
{
	var day = getLawHebrewDay();
	var hour = getLawHebrewHour();
	var url = new URL(document.location.href);
	var period = url.searchParams.get("period");
	var params = new URLSearchParams();

	if(day)
		params.set("hebrewDay", day);
	if(hour)
		params.set("hebrewHour", hour);
	if(period)
		params.set("period", period);

	var win = window.open("laws/index.html?" + params.toString(), "_blank");
	win.focus();
}

function renderLawsPage()
{
	var day = getLawHebrewDay();
	var hour = getLawHebrewHour();
	var laws = getMatchingLaws(day, hour);
	var title = document.getElementById("lawsTitle");
	var meta = document.getElementById("lawsMeta");
	var list = document.getElementById("lawsList");

	if(title)
		title.innerText = "חוקים";
	if(meta)
		meta.innerText = "יום עברי " + (day || "-") + ", שעה עברית " + (hour || "-") + " - " + laws.length + " חוקים";
	if(!list)
		return;

	list.innerHTML = "";
	laws = shuffleLaws(laws);

	if(!laws.length)
	{
		var empty = document.createElement("div");
		empty.className = "law-empty";
		empty.innerText = "לא נמצאו חוקים שנולדו ביום ובשעה האלה.";
		list.appendChild(empty);
		return;
	}

	laws.forEach(function(law) {
		var item = document.createElement("article");
		item.className = "law-card";

		var name = document.createElement("h2");
		name.innerText = law.name;
		item.appendChild(name);

		var details = document.createElement("div");
		details.className = "law-details";
		details.innerText = law.date + " " + law.time +
			" | יום " + law.hebrewDay +
			" | שעה " + law.hebrewHour +
			" | " + law.mazal +
			" | GMT+" + law.gmt;
		item.appendChild(details);

		var actions = document.createElement("div");
		actions.className = "law-actions";

		var source = getLawSource(law);
		var sourceLink = document.createElement("a");
		sourceLink.href = source.url;
		sourceLink.target = "_blank";
		sourceLink.rel = "noopener";
		sourceLink.innerText = "פתח חוק";
		updateLawSourceLink(law, sourceLink);
		actions.appendChild(sourceLink);

		if(law.clockUrl)
		{
			var link = document.createElement("a");
			link.href = law.clockUrl;
			link.target = "_blank";
			link.rel = "noopener";
			link.innerText = "פתח בשעון";
			actions.appendChild(link);
		}

		item.appendChild(actions);

		list.appendChild(item);
	});
}

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const preview = require("../public/shared/hebrew-clock-preview.js");
const tzlookup = require("../public/shared/tz-lookup.js");
const time = require("../public/shared/timezone-converter.js");
const ROOT = path.resolve(__dirname, "..");

test("New York birth time on 1987-03-04 13:45 is 20:45 in Jerusalem", () => {
  const result = time.convertLocalTimeToJerusalem({
    latitude: 40.7128,
    longitude: -74.006,
    year: 1987,
    month: 3,
    day: 4,
    hour: 13,
    minute: 45,
    lookupTimeZone: tzlookup
  });

  assert.equal(result.timeZone, "America/New_York");
  assert.equal(result.sourceGmt, -5);
  assert.equal(result.jerusalemGmt, 2);
  assert.deepEqual(result.jerusalem, {
    year: 1987,
    month: 3,
    day: 4,
    hour: 20,
    minute: 45,
    second: 0
  });
  assert.equal(time.formatJerusalemDateTime(result.jerusalem), "1987-03-04 20:45");
});

test("New York schedule time on 2026-07-07 19:00 is 02:00 next day in Jerusalem", () => {
  const result = time.convertLocalTimeToJerusalem({
    latitude: 40.7128,
    longitude: -74.006,
    year: 2026,
    month: 7,
    day: 7,
    hour: 19,
    minute: 0,
    lookupTimeZone: tzlookup
  });

  assert.equal(result.timeZone, "America/New_York");
  assert.equal(result.sourceGmt, -4);
  assert.equal(result.jerusalemGmt, 3);
  assert.deepEqual(result.jerusalem, {
    year: 2026,
    month: 7,
    day: 8,
    hour: 2,
    minute: 0,
    second: 0
  });
  assert.equal(time.formatJerusalemDateTime(result.jerusalem), "2026-07-08 02:00");
});

test("Jerusalem summer date keeps Israeli daylight saving GMT", () => {
  const result = time.convertLocalTimeToJerusalem({
    latitude: 31.7768514,
    longitude: 35.2331664,
    year: 1990,
    month: 7,
    day: 1,
    hour: 12,
    minute: 0,
    lookupTimeZone: tzlookup
  });

  assert.equal(result.timeZone, "Asia/Jerusalem");
  assert.equal(result.jerusalemGmt, 3);
  assert.equal(time.formatGmtOffset(result.jerusalemGmt), "GMT+03:00");
});

test("London winter birth time keeps winter GMT and moon day context", () => {
  const timeInfo = time.convertLocalTimeToJerusalem({
    latitude: 51.5074,
    longitude: -0.1278,
    year: 1985,
    month: 12,
    day: 20,
    hour: 4,
    minute: 20,
    lookupTimeZone: tzlookup
  });

  assert.equal(timeInfo.timeZone, "Europe/London");
  assert.equal(timeInfo.sourceGmt, 0);
  assert.equal(timeInfo.jerusalemGmt, 2);
  assert.deepEqual(timeInfo.jerusalem, {
    year: 1985,
    month: 12,
    day: 20,
    hour: 6,
    minute: 20,
    second: 0
  });

  const result = preview.predict({
    latitude: 31.7768514,
    longitude: 35.2331664,
    year: timeInfo.jerusalem.year,
    month: timeInfo.jerusalem.month,
    day: timeInfo.jerusalem.day,
    hour: timeInfo.jerusalem.hour,
    minute: timeInfo.jerusalem.minute,
    gmt: timeInfo.jerusalemGmt
  });

  assert.equal(result.sun.hebrewDay, 6);
  assert.equal(result.moon.hebrewDay, 6);
  assert.equal(result.moon.hebrewHour, 6);
  assert.equal(result.moon.clockHour, 5);
  assert.equal(result.moon.parts, 1058);
  assert.equal(result.moon.mazalHour, 5);
  assert.equal(result.moon.mazalTextEn, "Venus in Mercury");
  assert.equal(result.moon.dayTextEn, "Mercury");
});

test("color preview uses inverse sun brightness and direct moon brightness", () => {
  const result = preview.predict({
    latitude: 31.7768514,
    longitude: 35.2331664,
    year: 1987,
    month: 3,
    day: 4,
    hour: 20,
    minute: 45,
    gmt: 2
  });

  assert.equal(result.sun.hebrewDay, 5);
  assert.equal(result.sun.hebrewHour, 4);
  assert.equal(result.sun.mazalHour, 7);
  assert.equal(result.sun.baseColor, "#808080");
  assert.equal(result.sun.color, "#FFFFFF");
  assert.equal(result.sun.brightness, 0);
  assert.equal(result.sun.dayTextEn, "Venus");
  assert.equal(result.sun.dayMazalHour, 5);
  assert.equal(result.sun.dayBaseColor, "#BA8D1A");
  assert.equal(result.sun.dayColor, "#F7EAC7");
  assert.equal(result.sun.dayBrightness, 0.125);
  assert.equal(result.moon.hebrewDay, 4);
  assert.equal(result.moon.hebrewHour, 23);
  assert.equal(result.moon.mazalHour, 1);
  assert.equal(result.moon.mazalTextEn, "Jupiter in Saturn");
  assert.equal(result.moon.parts, 645);
  assert.equal(result.moon.baseColor, "#2D8DA1");
  assert.equal(result.moon.color, "#5EBED2");
  assert.equal(result.moon.brightness, 645 / 1080);
  assert.equal(result.moon.dayTextEn, "Saturn");
  assert.equal(result.moon.dayMazalHour, 4);
  assert.equal(result.moon.dayBaseColor, "#84C45E");
  assert.equal(result.moon.dayColor, "#E7F4E0");
  assert.equal(result.moon.dayBrightness, 22 / 24);
});

test("moon day moves back when its proportional hour is later than the sun hour", () => {
  const result = preview.predict({
    latitude: 31.7768514,
    longitude: 35.2331664,
    year: 2020,
    month: 12,
    day: 9,
    hour: 10,
    minute: 27,
    gmt: 2
  });

  assert.equal(result.sun.hebrewDay, 4);
  assert.equal(result.sun.clockHour, 16);
  assert.equal(result.moon.clockHour, 21);
  assert.equal(result.moon.hebrewDay, 3);
});

test("Jerusalem moon clock keeps 4 March 1987 at 20:45 on Wednesday", () => {
  const result = preview.predict({
    latitude: 31.7768514,
    longitude: 35.2331664,
    year: 1987,
    month: 3,
    day: 4,
    hour: 20,
    minute: 45,
    gmt: 2
  });

  assert.equal(result.sun.hebrewDay, 5);
  assert.equal(result.moon.hebrewDay, 4);
});

test("the base weekday changes at sunset, before nightfall", () => {
  const input = {
    latitude: 31.7768514,
    longitude: 35.2331664,
    year: 2020,
    month: 12,
    day: 9,
    gmt: 2
  };
  const beforeSunset = preview.predict({ ...input, hour: 16, minute: 20 });
  const afterSunset = preview.predict({ ...input, hour: 16, minute: 40 });

  assert.equal(beforeSunset.sun.hebrewDay, 4);
  assert.equal(afterSunset.sun.hebrewDay, 5);
});

test("calculator sends Jerusalem coordinates onward to JClock", () => {
  ["he", "en"].forEach((language) => {
    const html = fs.readFileSync(path.join(ROOT, "public", language, "index.html"), "utf8");

    assert.match(html, /var JERUSALEM_LATITUDE = 31\.7768514;/);
    assert.match(html, /var JERUSALEM_LONGITUDE = 35\.2331664;/);
    assert.match(html, /var clockLatitude = JERUSALEM_LATITUDE;/);
    assert.match(html, /var clockLongitude = JERUSALEM_LONGITUDE;/);
	assert.match(html, /var clockUrl = "https:\/\/jclock126\.web\.app\/HebrewClock13\/public\/" \+ gender \+ "\/simple\/index\.html";/);
    assert.match(html, /\?latitude=" \+ clockLatitude/);
    assert.match(html, /"&longitude=" \+ clockLongitude/);
    assert.doesNotMatch(html, /\?latitude=" \+ latitude/);
    assert.doesNotMatch(html, /"&longitude=" \+ longitude/);
    assert.match(html, /jclock126\.web\.app\/HebrewClock13\/public\/woman\/simple\/js\/suncalc\.js\?v=20260707-final-hebrew-day/);
    assert.match(html, /shared\/hebrew-clock-preview\.js\?v=20260714-inverse-sun-brightness/);
    assert.match(html, /id="color-preview"/);
    assert.match(html, /id="sun-color-swatch"/);
    assert.match(html, /id="sun-day-color-swatch"/);
    assert.match(html, /id="moon-color-swatch"/);
    assert.match(html, /id="moon-day-color-swatch"/);
    assert.match(html, /id="umid-value"/);
    assert.match(html, /id="copy-umid-button"/);
    assert.match(html, /UniqueMeaningfulID \(UMID\)/);
    assert.match(html, /prediction\.moon\.color,[\s\S]*prediction\.moon\.dayColor,[\s\S]*prediction\.sun\.color,[\s\S]*prediction\.sun\.dayColor/);
    assert.match(html, /return \[/);
    assert.match(html, /\.join\(''\);/);
    assert.doesNotMatch(html, /return 'UMID-' \+ \[/);
    assert.doesNotMatch(html, /\.join\('-'\) \+ '-00'/);
    assert.match(html, /navigator\.clipboard\.writeText\(input\.value\)/);
    assert.match(html, /id="whatsapp-db-button"/);
    assert.match(html, /id="child-name-he"/);
    assert.match(html, /id="child-name-en"/);
    assert.match(html, /document\.getElementById\('child-name-he'\)/);
    assert.match(html, /document\.getElementById\('child-name-en'\)/);
    assert.doesNotMatch(html, /id="db-name-he"/);
    assert.doesNotMatch(html, /id="db-name-en"/);
    assert.match(html, /id="db-phone"/);
    assert.match(html, /href="\.\/privacy\.html"/);
    assert.match(html, /privacy-link/);
    assert.match(html, /placeholder="\+972587401735"/);
    assert.match(html, /whatsappPhone = phone\.replace/);
    assert.match(html, /\\u2066-\\u2069/);
    assert.match(html, /\^\\\+\\d\{7,15\}\$/);
    assert.match(html, /!displayHeName \|\| !displayEnName \|\| !phone\.trim\(\)/);
    assert.match(html, /phone: normalizeDbPhone\(phone\)/);
    assert.match(html, /phoneNumber: ' \+ person\.phone/);
    assert.doesNotMatch(html, /phone: phone\.trim\(\) \? normalizeDbPhone\(phone\) : null/);
    assert.doesNotMatch(html, /phoneNumber: ' \+ \(person\.phone \|\| 'null'\)/);
    assert.doesNotMatch(html, /phone\.charAt\(0\) !== '\+'/);
    assert.doesNotMatch(html, /\+972' \+ phone\.slice/);
    assert.match(html, /WHATSAPP_DB_PHONE = "972587401735"/);
    assert.match(html, /buildWhatsappDbMessage/);
    assert.match(html, /buildWhatsappIntro/);
    assert.match(html, /formatBrightness/);
    assert.match(html, /formatDbBrightness/);
    assert.match(html, /moonDayColor/);
    assert.match(html, /moonHourColor/);
    assert.match(html, /sunDayColor/);
    assert.match(html, /sunHourColor/);
    assert.match(html, /moonHourBrightness/);
    assert.match(html, /sunHourBrightness/);
    assert.match(html, /שמי /);
    assert.match(html, /I would like you to add me to the website/);
    assert.doesNotMatch(html, /add me to the site/);
    assert.match(html, /wa\.me/);
    assert.match(html, /updateColorPreview\(timeInfo\)/);

    if (language === "he") {
      assert.match(html, /שליחה להוספה לאתר/);
      assert.match(html, /שלח וואטסאפ להוספה לאתר/);
      assert.doesNotMatch(html, /להוספה ל-DB/);
    } else {
      assert.match(html, /Send to add to website/);
      assert.match(html, /Send WhatsApp to add to website/);
      assert.doesNotMatch(html, /add to site/);
      assert.doesNotMatch(html, /add to DB/);
    }
  });
});

test("simple moon clock moves the Hebrew day back when its proportional hour is later than the sun hour", () => {
  const offsetJs = fs.readFileSync(path.join(ROOT, "..", "HebrewClock13", "public", "woman", "simple", "js", "HebrewDayOffset.js"), "utf8");
  const simpleHtml = fs.readFileSync(path.join(ROOT, "..", "HebrewClock13", "public", "woman", "simple", "index.html"), "utf8");

  assert.match(offsetJs, /womanMoonTime > manSunTime \? -1 : 0/);
  assert.match(simpleHtml, /js\/HebrewDayOffset\.js\?v=20260713-moon-day-offset/);
});

test("simple moon clock uses selected current location for local mode", () => {
  const familyHtml = fs.readFileSync(path.join(ROOT, "..", "HebrewClock13", "public", "family", "index.html"), "utf8");
  const simpleHtml = fs.readFileSync(path.join(ROOT, "..", "HebrewClock13", "public", "woman", "simple", "index.html"), "utf8");
  const locationJs = fs.readFileSync(path.join(ROOT, "..", "HebrewClock13", "public", "woman", "simple", "js", "Location.js"), "utf8");
  const sharedMoonJs = fs.readFileSync(path.join(ROOT, "..", "HebrewClock13", "public", "shared", "js", "jerusalem-woman-kabala-time.js"), "utf8");

  assert.match(familyHtml, /ClockLocation=Local&LocalClock=1/);
  assert.match(familyHtml, /v=20260708-local-moon-/);
  assert.match(simpleHtml, /jerusalem-woman-kabala-time\.js\?v=20260708-local-moon/);
  assert.match(simpleHtml, /js\/Location\.js\?v=20260708-local-moon/);
  assert.doesNotMatch(simpleHtml, /forceJerusalemClock/);
  assert.match(simpleHtml, /useProvidedLocationAsClock = true;/);
  assert.match(simpleHtml, /clockTimeZone = useProvidedLocationAsClock \? displayTimeZone : DEFAULT_TIME_ZONE;/);
  assert.doesNotMatch(locationJs, /function list_pos\(\) \{\s*latitude = 31\.7768514;/);
  assert.match(locationJs, /if \(!Number\.isFinite\(latitude\)\)/);
  assert.match(sharedMoonJs, /function getJerusalemMoonTimesForDate\(date, locationLatitude, locationLongitude, timeZone\)/);
  assert.match(sharedMoonJs, /moonAltitude\(start, calculationLatitude, calculationLongitude\)/);
});

test("schedule converts source time before sending Jerusalem coordinates onward", () => {
  const html = fs.readFileSync(path.join(ROOT, "..", "HebrewSchedule13", "public", "index.html"), "utf8");

  assert.match(html, /src="\.\.\/\.\.\/BirthCalculator\/public\/shared\/tz-lookup\.js"/);
  assert.match(html, /src="\.\.\/\.\.\/BirthCalculator\/public\/shared\/timezone-converter\.js"/);
  assert.match(html, /BirthCalculatorTime\.convertLocalTimeToJerusalem/);
  assert.match(html, /const jerusalemTime = timeInfo\.jerusalem/);
  assert.match(html, /longitude: JERUSALEM\.longitude/);
  assert.match(html, /latitude: JERUSALEM\.latitude/);
  assert.match(html, /year: String\(jerusalemTime\.year\)/);
  assert.match(html, /month: String\(jerusalemTime\.month\)/);
  assert.match(html, /day: String\(jerusalemTime\.day\)/);
  assert.match(html, /hour: String\(jerusalemTime\.hour\)/);
  assert.match(html, /minute: String\(jerusalemTime\.minute\)/);
  assert.match(html, /gmt: String\(timeInfo\.jerusalemGmt\)/);
  assert.match(html, /id="jerusalem-time"/);
  assert.match(html, /id="timezone-preview"/);
  assert.doesNotMatch(html, /id="current-location"/);
  assert.doesNotMatch(html, /navigator\.geolocation/);
  assert.doesNotMatch(html, /longitude: longitudeInput\.value/);
  assert.doesNotMatch(html, /latitude: latitudeInput\.value/);
});

test("privacy policy explains the required phone number purpose", () => {
  const hePrivacy = fs.readFileSync(path.join(ROOT, "public", "he", "privacy.html"), "utf8");
  const enPrivacy = fs.readFileSync(path.join(ROOT, "public", "en", "privacy.html"), "utf8");

  assert.match(hePrivacy, /מספר הטלפון נדרש/);
  assert.match(hePrivacy, /ספר טלפונים עבור כל העולם/);
  assert.match(hePrivacy, /גלוי לציבור/);
  assert.match(hePrivacy, /ללא פגיעה בכבוד האדם/);
  assert.match(hePrivacy, /ללא ניצול, שידול/);
  assert.match(hePrivacy, /צפוי להיענש לפי חוקי מדינת ישראל/);
  assert.match(hePrivacy, /ייאסר עליו להגיע לישראל כל חייו/);
  assert.match(hePrivacy, /בדעת ובהסכמת כל מי שפגע בהם\/ן/);
  assert.doesNotMatch(hePrivacy, /אופציונלי/);
  assert.doesNotMatch(hePrivacy, /בלי מספר/);
  assert.match(hePrivacy, /Simple English Translation/);
  assert.match(hePrivacy, /The database of phone numbers and all information published on the website/);
  assert.match(hePrivacy, /forbidden from entering Israel for life/);
  assert.match(enPrivacy, /A phone number is required/);
  assert.match(enPrivacy, /phone book for the whole world/);
  assert.match(enPrivacy, /publicly visible/);
  assert.match(enPrivacy, /without harming human dignity/);
  assert.match(enPrivacy, /without exploitation, solicitation/);
  assert.match(enPrivacy, /punished under the laws of the State of Israel/);
  assert.match(enPrivacy, /forbidden from entering Israel for life/);
  assert.match(enPrivacy, /knowledge and consent of every person they harmed/);
  assert.doesNotMatch(enPrivacy, /optional/);
  assert.doesNotMatch(enPrivacy, /without a number/);
});

test("WhatsApp submission does not trigger the unit clock download", () => {
  const heHtml = fs.readFileSync(path.join(ROOT, "public", "he", "index.html"), "utf8");
  const enHtml = fs.readFileSync(path.join(ROOT, "public", "en", "index.html"), "utf8");

  assert.match(heHtml, /id="unit-clock-download"[^>]+href="https:\/\/Tuning-Mg\.com\/d"/);
  assert.doesNotMatch(heHtml, /id="unit-clock-download"[^>]+hidden/);
  assert.match(heHtml, /הורד את שעון היחידה בעברית/);
  assert.match(enHtml, /id="unit-clock-download"[^>]+href="https:\/\/Tuning-Mg\.com\/d"[^>]+hidden/);

  for (const html of [heHtml, enHtml]) {
    assert.match(html, /var message = buildWhatsappDbMessage\(\);[\s\S]*window\.open\(url, '_blank'\);/);
    assert.doesNotMatch(html, /downloadButton\.hidden = false;/);
    assert.doesNotMatch(html, /downloadButton\.click\(\);/);
    assert.doesNotMatch(html, /document\.getElementById\('whatsapp-db-button'\)\.addEventListener\('click',\s*function[^}]*downloadButton/);
  }
});

test("place search offers Google autocomplete and keeps the selected address visible", () => {
  const heHtml = fs.readFileSync(path.join(ROOT, "public", "he", "index.html"), "utf8");
  const enHtml = fs.readFileSync(path.join(ROOT, "public", "en", "index.html"), "utf8");

  for (const html of [heHtml, enHtml]) {
    assert.match(html, /id="place-search"[^>]+autocomplete="off"/);
    assert.match(html, /new google\.maps\.places\.Autocomplete\(placeSearchInput/);
    assert.match(html, /if \(label\) placeSearchInput\.value = label;/);
    assert.match(html, /geocoder\.geocode\(\{ location: location \}/);
    assert.match(html, /libraries=places[^\"]+callback=initMap/);
  }

  assert.match(heHtml, /libraries=places&language=he&region=IL&callback=initMap/);
  assert.match(enHtml, /libraries=places&language=en&region=IL&callback=initMap/);
});

test("calculator refreshes bypass browser and Firebase caches", () => {
  const pages = ["index.html", path.join("he", "index.html"), path.join("en", "index.html")];

  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, "public", page), "utf8");
    assert.match(html, /http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/);
    assert.match(html, /http-equiv="Pragma" content="no-cache"/);
  }

  const firebase = fs.readFileSync(path.join(ROOT, "firebase.json"), "utf8");
  assert.match(firebase, /"Cache-Control"[\s\S]*"no-cache, no-store, must-revalidate"/);
});

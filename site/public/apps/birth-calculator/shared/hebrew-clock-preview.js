(function(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(root);
  } else {
    root.BirthCalculatorHebrewPreview = factory(root);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function(root) {
  "use strict";

  var MON_COUNT = [13, 1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
  var HALAKIM_PER_HOUR = 1080;
  var ASTRONOMY_DAY_MS = 1000 * 60 * 60 * 24;
  var J1970 = 2440588;
  var J2000 = 2451545;
  var RAD = Math.PI / 180;
  var HOUR_MIDA_HE = ["שבתאי", "צדק", "מאדים", "חמה", "נוגה", "כוכב", "לבנה"];
  var DAY_MIDA_HE = ["צדק", "מאדים", "חמה", "שבתאי", "נוגה", "כוכב", "לבנה"];
  var HOUR_MIDA_EN = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
  var DAY_MIDA_EN = ["Jupiter", "Mars", "Sun", "Saturn", "Venus", "Mercury", "Moon"];

  var WOMAN_SIMPLE_COLORS_BY_INDEX = [
    "#84C45E",
    "#2D8DA1",
    "#A6230E",
    "#815AA8",
    "#BA8D1A",
    "#B45D02",
    "#808080"
  ];
  var COMMERCIAL_MAZAL_BY_INDEX = [4, 1, 2, 3, 5, 6, 7];
  var DAY_MAZAL_INDEX_BY_HEBREW_DAY = [null, 1, 2, 3, 0, 4, 5, 6];

  function normalizeHebrewDay(dayNumber) {
    while (dayNumber < 1) {
      dayNumber += 7;
    }

    while (dayNumber > 7) {
      dayNumber -= 7;
    }

    return dayNumber;
  }

  function getDateParts(input) {
    return {
      year: Number(input.year),
      month: Number(input.month),
      day: Number(input.day),
      hour: Number(input.hour),
      minute: Number(input.minute || 0),
      second: Number(input.second || 0),
      millisecond: Number(input.millisecond || 0)
    };
  }

  function validateDateParts(parts) {
    if (![parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond].every(Number.isFinite)) {
      throw new TypeError("Invalid Jerusalem date or time.");
    }
  }

  function makeLocalDate(parts, dayOffset) {
    return new Date(parts.year, parts.month - 1, parts.day + (dayOffset || 0));
  }

  function getDayOfWeekNumber(parts) {
    return makeLocalDate(parts, 0).getDay() + 1;
  }

  function getLocation(latitude, longitude) {
    latitude = Number(latitude);
    longitude = Number(longitude);
    if (![latitude, longitude].every(Number.isFinite)) {
      throw new TypeError("Invalid clock location.");
    }

    var ns = latitude > 0 ? "N" : "S";
    var latd = Math.floor(latitude);
    var latm = (latitude - latd) * 60;
    var lngd = Math.floor(longitude);
    var lngm = (longitude - lngd) * 60;

    return {
      latd: latd,
      latm: latm,
      lngd: lngd,
      lngm: lngm,
      nsi: ns !== "N" ? 1 : 0,
      ewi: ns !== "W" ? 1 : 0
    };
  }

  function leap(year) {
    return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
  }

  function doy(day, month, year) {
    var num = (month > 2 && leap(year)) ? 1 : 0;
    return MON_COUNT[month] + day + num;
  }

  function suntime(day, month, yearMinus1900, sundeg, sunmin, londeg, lonmin, ew, latdeg, latmin, ns, timezone) {
    var year = yearMinus1900 - 100 + 2000;
    var ret = [0, 0, 0, 0];
    var invalid = 0;
    var longitude = (londeg + lonmin / 60.0) * ((ew === 0) ? -1 : 1);
    var latitude = (latdeg + latmin / 60.0) * ((ns === 0) ? 1 : -1);
    var yday = doy(day, month, year);
    var A = 1.5708;
    var B = 3.14159;
    var C = 4.71239;
    var D = 6.28319;
    var E = 0.0174533 * latitude;
    var F = 0.0174533 * longitude;
    var G = 0.261799 * timezone;
    var R = Math.cos(0.01745 * (sundeg + sunmin / 60.0));
    var sr = 0;
    var ss = 0;

    for (var i = 0; i < 2; i += 1) {
      var J = i === 0 ? A : C;
      var K = yday + ((J - F) / D);
      var L = (K * 0.017202) - 0.0574039;
      var M = L + 0.0334405 * Math.sin(L);
      M += 4.93289 + (3.49066E-04) * Math.sin(2 * L);

      if (D === 0) {
        return ret;
      }

      while (M < 0) {
        M += D;
      }

      while (M >= D) {
        M -= D;
      }

      if ((M / A) - Math.floor(M / A) === 0) {
        M += 4.84814E-06;
      }

      var P = Math.atan2(0.91746 * (Math.sin(M) / Math.cos(M)), 1);
      if (M > C) {
        P += D;
      } else if (M > A) {
        P += B;
      }

      var Q = 0.39782 * Math.sin(M);
      Q = Q / Math.sqrt(-Q * Q + 1);
      Q = Math.atan2(Q, 1);

      var S = R - (Math.sin(Q) * Math.sin(E));
      S = S / (Math.cos(Q) * Math.cos(E));
      if (Math.abs(S) > 1) {
        invalid = 1;
      }

      S = S / Math.sqrt(-S * S + 1);
      S = A - Math.atan2(S, 1);
      if (i === 0) {
        S = D - S;
      }

      var T = S + P - 0.0172028 * K - 1.73364;
      var U = T - F;
      var V = U + G;

      while (V < 0) {
        V += D;
      }

      while (V >= D) {
        V -= D;
      }

      V = V * 3.81972;
      if (i === 0) {
        sr = V;
      } else {
        ss = V;
      }
    }

    ret[1] = invalid;
    ret[2] = sr;
    ret[3] = ss;
    return ret;
  }

  function getSolarTimes(parts, latitude, longitude, gmt) {
    var location = getLocation(latitude, longitude);
    var yesterday = makeLocalDate(parts, -1);
    var today = makeLocalDate(parts, 0);
    var tomorrow = makeLocalDate(parts, 1);
    var timezone = Number(gmt);
    if (!Number.isFinite(timezone)) {
      throw new TypeError("Invalid Jerusalem GMT offset.");
    }

    var yesterdayTime = suntime(yesterday.getDate(), yesterday.getMonth() + 1, yesterday.getYear(), 90, 50, location.lngd, location.lngm, location.ewi, location.latd, location.latm, location.nsi, timezone);
    var todayTime = suntime(today.getDate(), today.getMonth() + 1, today.getYear(), 90, 50, location.lngd, location.lngm, location.ewi, location.latd, location.latm, location.nsi, timezone);
    var tomorrowTime = suntime(tomorrow.getDate(), tomorrow.getMonth() + 1, tomorrow.getYear(), 90, 50, location.lngd, location.lngm, location.ewi, location.latd, location.latm, location.nsi, timezone);

    return {
      sunriseYesterday: yesterdayTime[2],
      sunrise: todayTime[2],
      sunriseTomorrow: tomorrowTime[2],
      sunsetYesterday: yesterdayTime[3],
      sunset: todayTime[3],
      sunsetTomorrow: tomorrowTime[3]
    };
  }

  function getCurrentHour(parts) {
    return ((parts.millisecond || 0) + ((parts.second || 0) * 1000) + (parts.minute * 60 * 1000) + (parts.hour * 60 * 60 * 1000)) / (1000 * 3600);
  }

  function getClockSegment(length, offset, hourOffset) {
    var rawHour = 12 * (offset / length);
    var boundedHour = Math.max(0, Math.min(rawHour, 11.999999999));
    var hour = Math.floor(boundedHour);
    var parts = Math.floor((boundedHour - hour) * HALAKIM_PER_HOUR);

    if (parts >= HALAKIM_PER_HOUR) {
      hour += 1;
      parts = 0;
    }

    return {
      clockHour: hour + (hourOffset || 0),
      parts: Math.max(0, Math.min(parts, HALAKIM_PER_HOUR - 1))
    };
  }

  function getSunClockHour(parts, latitude, longitude, gmt) {
    var times = getSolarTimes(parts, latitude, longitude, gmt);
    var currHour = getCurrentHour(parts);
    var clock = null;

    if (times.sunset > times.sunrise && currHour < times.sunset) {
      clock = getClockSegment(times.sunset - times.sunrise, currHour - times.sunrise, 12);
    }

    if (times.sunset > times.sunrise && currHour < times.sunrise) {
      clock = getClockSegment(times.sunrise + 24 - times.sunsetYesterday, currHour + 24 - times.sunsetYesterday, 0);
    }

    if (times.sunset > times.sunrise && currHour > times.sunset) {
      clock = getClockSegment(times.sunriseTomorrow + 24 - times.sunset, currHour - times.sunset, 0);
    }

    if (times.sunset < times.sunrise && currHour < times.sunrise) {
      clock = getClockSegment(times.sunrise - times.sunset, currHour - times.sunset, 0);
    }

    if (times.sunset < times.sunrise && currHour < times.sunset) {
      clock = getClockSegment(times.sunset + 24 - times.sunriseYesterday, currHour + 24 - times.sunriseYesterday, 12);
    }

    if (times.sunset < times.sunrise && currHour > times.sunrise) {
      clock = getClockSegment(times.sunsetTomorrow + 24 - times.sunrise, currHour - times.sunrise, 12);
    }

    if (!clock || !Number.isFinite(clock.clockHour)) {
      clock = {
        clockHour: 0,
        parts: 0
      };
    }

    return {
      clockHour: clock.clockHour,
      parts: clock.parts,
      sunset: times.sunset
    };
  }

  function getTimeParts(time) {
    var hour = Math.floor(time);
    var minute = Math.floor((time - hour) * 60.0);
    var second = Math.floor((((time - hour) * 60.0) - minute) * 60.0);

    if (second >= 60) {
      minute += 1;
      second -= 60;
    }

    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }

    if (hour < 0) {
      hour += 24;
    }

    if (hour > 23) {
      hour -= 24;
    }

    return {
      hour: hour,
      minute: minute,
      second: second
    };
  }

  function isAfterSunset(parts, sunset) {
    var sunsetParts = getTimeParts(sunset);
    return (parts.hour === sunsetParts.hour && parts.minute === sunsetParts.minute && parts.second >= sunsetParts.second) ||
      (parts.hour === sunsetParts.hour && parts.minute > sunsetParts.minute) ||
      (parts.hour > sunsetParts.hour);
  }

  function getSunHebrewDay(parts, solarClock) {
    // Zodiac-day convention only: the next weekday starts at sunset. This must not
    // be used for the Hebrew date, nightfall, or Shabbat times; those follow the
    // relevant halachic boundary calculated for the local clock and location.
    var day = getDayOfWeekNumber(parts);
    if (isAfterSunset(parts, solarClock.sunset)) {
      day += 1;
    }

    return normalizeHebrewDay(day);
  }

  function daysFromCivil(year, month, day) {
    return Math.floor(Date.UTC(year, month - 1, day) / ASTRONOMY_DAY_MS);
  }

  function julianFromLocalMidnight(civilDate, offsetHours) {
    return daysFromCivil(civilDate.year, civilDate.month, civilDate.day) + J1970 - 0.5 - offsetHours / 24;
  }

  function hoursLaterJulian(julian, hours) {
    return julian + hours / 24;
  }

  function rightAscension(l, b) {
    var e = RAD * 23.4397;
    return Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l));
  }

  function declination(l, b) {
    var e = RAD * 23.4397;
    return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
  }

  function siderealTime(d, lw) {
    return RAD * (280.16 + 360.9856235 * d) - lw;
  }

  function astronomicalAltitude(h, phi, dec) {
    return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(h));
  }

  function astroRefraction(h) {
    if (h < 0) {
      h = 0;
    }

    return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
  }

  function moonCoordsForDay(d) {
    var l0 = RAD * (218.316 + 13.176396 * d);
    var m = RAD * (134.963 + 13.064993 * d);
    var f = RAD * (93.272 + 13.229350 * d);
    var l = l0 + RAD * 6.289 * Math.sin(m);
    var b = RAD * 5.128 * Math.sin(f);

    return {
      ra: rightAscension(l, b),
      dec: declination(l, b)
    };
  }

  function moonAltitude(julian, latitude, longitude) {
    var lw = RAD * -longitude;
    var phi = RAD * latitude;
    var d = julian - J2000;
    var coords = moonCoordsForDay(d);
    var h = siderealTime(d, lw) - coords.ra;
    var altitude = astronomicalAltitude(h, phi, coords.dec);
    return altitude + astroRefraction(altitude);
  }

  function getCivilDate(parts, dayOffset) {
    var date = makeLocalDate(parts, dayOffset || 0);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  function getMoonTimesForCivilDate(civilDate, latitude, longitude, gmt) {
    var offsetHours = Number(gmt);
    if (!Number.isFinite(offsetHours)) {
      throw new TypeError("Invalid Jerusalem GMT offset.");
    }

    var start = julianFromLocalMidnight(civilDate, offsetHours);
    var hc = 0.133 * RAD;
    var h0 = moonAltitude(start, latitude, longitude) - hc;
    var result = {};

    for (var i = 1; i <= 25; i += 2) {
      var h1 = moonAltitude(hoursLaterJulian(start, i), latitude, longitude) - hc;
      var h2 = moonAltitude(hoursLaterJulian(start, i + 1), latitude, longitude) - hc;
      var a = (h0 + h2) / 2 - h1;
      var b = (h2 - h0) / 2;
      var xe;
      var ye;
      var discriminant;
      var roots = 0;
      var x1 = 0;
      var x2 = 0;

      if (a === 0) {
        h0 = h2;
        continue;
      }

      xe = -b / (2 * a);
      ye = (a * xe + b) * xe + h1;
      discriminant = b * b - 4 * a * h1;

      if (discriminant >= 0) {
        var dx = Math.sqrt(discriminant) / (Math.abs(a) * 2);
        x1 = xe - dx;
        x2 = xe + dx;
        if (Math.abs(x1) <= 1) {
          roots += 1;
        }
        if (Math.abs(x2) <= 1) {
          roots += 1;
        }
        if (x1 < -1) {
          x1 = x2;
        }
      }

      if (roots === 1) {
        if (h0 < 0) {
          result.rise = i + x1;
        } else {
          result.set = i + x1;
        }
      } else if (roots === 2) {
        result.rise = i + (ye < 0 ? x2 : x1);
        result.set = i + (ye < 0 ? x1 : x2);
      }

      if (Number.isFinite(result.rise) && Number.isFinite(result.set)) {
        break;
      }

      h0 = h2;
    }

    return result;
  }

  function getMoonTimes(parts, latitude, longitude, gmt) {
    var yesterdayMoon = getMoonTimesForCivilDate(getCivilDate(parts, -1), latitude, longitude, gmt);
    var todayMoon = getMoonTimesForCivilDate(getCivilDate(parts, 0), latitude, longitude, gmt);
    var tomorrowMoon = getMoonTimesForCivilDate(getCivilDate(parts, 1), latitude, longitude, gmt);

    return {
      riseYesterday: yesterdayMoon.rise,
      rise: todayMoon.rise,
      riseTomorrow: tomorrowMoon.rise,
      setYesterday: yesterdayMoon.set,
      set: todayMoon.set,
      setTomorrow: tomorrowMoon.set
    };
  }

  function getMoonClockHour(parts, latitude, longitude, gmt) {
    var times = getMoonTimes(parts, latitude, longitude, gmt);
    var currHour = getCurrentHour(parts);
    var clock = null;

    if (times.set > times.rise && currHour < times.set) {
      clock = getClockSegment(times.set - times.rise, currHour - times.rise, 12);
    }

    if (times.set > times.rise && currHour < times.rise) {
      clock = getClockSegment(times.rise + 24 - times.setYesterday, currHour + 24 - times.setYesterday, 0);
    }

    if (times.set > times.rise && currHour > times.set) {
      clock = getClockSegment(times.riseTomorrow + 24 - times.set, currHour - times.set, 0);
    }

    if (times.set < times.rise && currHour < times.rise) {
      clock = getClockSegment(times.rise - times.set, currHour - times.set, 0);
    }

    if (times.set < times.rise && currHour < times.set) {
      clock = getClockSegment(times.set + 24 - times.riseYesterday, currHour + 24 - times.riseYesterday, 12);
    }

    if (times.set < times.rise && currHour > times.rise) {
      clock = getClockSegment(times.setTomorrow + 24 - times.rise, currHour - times.rise, 12);
    }

    if (!clock || !Number.isFinite(clock.clockHour)) {
      clock = {
        clockHour: 0,
        parts: 0
      };
    }

    return clock;
  }

  function getMazalIndex(hebrewDay, clockHour) {
    if (clockHour === 24) {
      clockHour = 0;
    }

    var offsetsByDay = [0, 5, 1, 4, 0, 3, 6, 2];
    return (offsetsByDay[hebrewDay] + clockHour) % 7;
  }

  function getDayMazalIndex(hebrewDay) {
    return DAY_MAZAL_INDEX_BY_HEBREW_DAY[normalizeHebrewDay(hebrewDay)];
  }

  function getMoonDayOffset(solarClock, moonClock) {
    var sunTime = (Number(solarClock.clockHour) * HALAKIM_PER_HOUR) + Number(solarClock.parts || 0);
    var moonTime = (Number(moonClock.clockHour) * HALAKIM_PER_HOUR) + Number(moonClock.parts || 0);
    return moonTime > sunTime ? -1 : 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hexToRgb(hex) {
    var normalized = String(hex || "").replace("#", "");
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function rgbToHex(rgb) {
    return "#" + [rgb.r, rgb.g, rgb.b].map(function(part) {
      return String(part.toString(16)).padStart(2, "0");
    }).join("").toUpperCase();
  }

  function rgbToHsl(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    var d;

    if (max !== min) {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / d + 2;
      } else {
        h = (r - g) / d + 4;
      }

      h /= 6;
    }

    return {
      h: h,
      s: s,
      l: l
    };
  }

  function hueToRgb(p, q, t) {
    var value = t;

    if (value < 0) {
      value += 1;
    }

    if (value > 1) {
      value -= 1;
    }

    if (value < 1 / 6) {
      return p + (q - p) * 6 * value;
    }

    if (value < 1 / 2) {
      return q;
    }

    if (value < 2 / 3) {
      return p + (q - p) * (2 / 3 - value) * 6;
    }

    return p;
  }

  function hslToRgb(hsl) {
    var h = hsl.h;
    var s = clamp(hsl.s, 0, 1);
    var l = clamp(hsl.l, 0, 1);
    var r;
    var g;
    var b;
    var q;
    var p;

    if (s === 0) {
      r = l;
      g = l;
      b = l;
    } else {
      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  function applyBrightnessToHex(baseHex, brightness) {
    var hsl = rgbToHsl(hexToRgb(baseHex));
    hsl.l = clamp(brightness, 0, 1);
    return rgbToHex(hslToRgb(hsl));
  }

  function getResult(kind, hebrewDay, clockSegment) {
    var clockHour = typeof clockSegment === "number" ? clockSegment : clockSegment.clockHour;
    var parts = typeof clockSegment === "number" ? 0 : Number(clockSegment.parts || 0);
    var index = getMazalIndex(hebrewDay, clockHour);
    var dayIndex = getDayMazalIndex(hebrewDay);
    var hourBrightness = clamp(parts / HALAKIM_PER_HOUR, 0, 1);
    var dayBrightness = clamp(clockHour / 24, 0, 1);
    // The sun clock uses an inverse light model: the start of the range (0)
    // is brightest and the end of the range (1) is darkest. The moon keeps
    // its existing direct light model.
    var hourColorBrightness = kind === "sun" ? 1 - hourBrightness : hourBrightness;
    var dayColorBrightness = kind === "sun" ? 1 - dayBrightness : dayBrightness;
    var hourBaseColor = WOMAN_SIMPLE_COLORS_BY_INDEX[index];
    var dayBaseColor = WOMAN_SIMPLE_COLORS_BY_INDEX[dayIndex];

    return {
      kind: kind,
      hebrewDay: hebrewDay,
      hebrewHour: clockHour + 1,
      clockHour: clockHour,
      parts: parts,
      mazalIndex: index,
      mazalHour: COMMERCIAL_MAZAL_BY_INDEX[index],
      baseColor: hourBaseColor,
      color: applyBrightnessToHex(hourBaseColor, hourColorBrightness),
      brightness: hourBrightness,
      dayMazalIndex: dayIndex,
      dayMazalHour: COMMERCIAL_MAZAL_BY_INDEX[dayIndex],
      dayBaseColor: dayBaseColor,
      dayColor: applyBrightnessToHex(dayBaseColor, dayColorBrightness),
      dayBrightness: dayBrightness,
      dayTextHe: DAY_MIDA_HE[hebrewDay - 1],
      dayTextEn: DAY_MIDA_EN[hebrewDay - 1],
      mazalTextHe: HOUR_MIDA_HE[index] + " שב" + DAY_MIDA_HE[hebrewDay - 1],
      mazalTextEn: HOUR_MIDA_EN[index] + " in " + DAY_MIDA_EN[hebrewDay - 1]
    };
  }

  function predict(input, options) {
    options = options || {};
    var parts = getDateParts(input);
    validateDateParts(parts);

    var latitude = Number(input.latitude);
    var longitude = Number(input.longitude);
    var gmt = Number(input.gmt);
    var solarClock = getSunClockHour(parts, latitude, longitude, gmt);
    var sunDay = getSunHebrewDay(parts, solarClock);
    var moonClock = getMoonClockHour(parts, latitude, longitude, gmt);
    var moonDay = normalizeHebrewDay(sunDay + getMoonDayOffset(solarClock, moonClock));

    return {
      sun: getResult("sun", sunDay, solarClock),
      moon: getResult("moon", moonDay, moonClock)
    };
  }

  return {
    COMMERCIAL_MAZAL_BY_INDEX: COMMERCIAL_MAZAL_BY_INDEX,
    WOMAN_SIMPLE_COLORS_BY_INDEX: WOMAN_SIMPLE_COLORS_BY_INDEX,
    getMazalIndex: getMazalIndex,
    normalizeHebrewDay: normalizeHebrewDay,
    predict: predict
  };
});

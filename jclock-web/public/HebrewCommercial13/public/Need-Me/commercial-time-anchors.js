(function () {
  "use strict";

  var JERUSALEM_LATITUDE = 31.7768514;
  var JERUSALEM_LONGITUDE = 35.2331664;
  var JERUSALEM_TIME_ZONE = "Asia/Jerusalem";
  var MON_COUNT = [13, 1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
  var anchorCache = {};

  function getJerusalemAnchors(date, model) {
    var cacheKey = model + ":" + toDateKey(getZonedParts(date, JERUSALEM_TIME_ZONE));
    if (anchorCache[cacheKey]) {
      return anchorCache[cacheKey];
    }

    var anchors;

    if (model === "moon") {
      anchors = getMoonAnchors(date);
    } else if (model === "combined") {
      anchors = {
        sun: getSunAnchors(date),
        moon: getMoonAnchors(date)
      };
    } else {
      anchors = getSunAnchors(date);
    }

    anchorCache[cacheKey] = anchors;
    return anchors;
  }

  function getSunAnchors(date) {
    var parts = getZonedParts(date, JERUSALEM_TIME_ZONE);
    var timezone = getTimeZoneOffsetHours(date, JERUSALEM_TIME_ZONE);
    var sun = suntime(
      parts.day,
      parts.month,
      parts.year,
      90,
      50,
      Math.floor(JERUSALEM_LONGITUDE),
      (JERUSALEM_LONGITUDE - Math.floor(JERUSALEM_LONGITUDE)) * 60,
      1,
      Math.floor(JERUSALEM_LATITUDE),
      (JERUSALEM_LATITUDE - Math.floor(JERUSALEM_LATITUDE)) * 60,
      0,
      timezone
    );

    return buildAnchorsFromLocalHours(parts, sun[2], sun[3], "sun");
  }

  function getMoonAnchors(date) {
    if (!window.SunCalc || typeof window.SunCalc.getMoonTimes !== "function") {
      return getSunAnchors(date);
    }

    var parts = getZonedParts(date, JERUSALEM_TIME_ZONE);
    var noon = zonedLocalToUtc(toDateKey(parts), "12:00", JERUSALEM_TIME_ZONE);
    var moonTimes = window.SunCalc.getMoonTimes(noon, JERUSALEM_LATITUDE, JERUSALEM_LONGITUDE);
    var riseHour = moonTimes.rise ? dateToLocalFloatHour(moonTimes.rise, JERUSALEM_TIME_ZONE) : null;
    var setHour = moonTimes.set ? dateToLocalFloatHour(moonTimes.set, JERUSALEM_TIME_ZONE) : null;

    if (riseHour === null || setHour === null) {
      return getSunAnchors(date);
    }

    return buildAnchorsFromLocalHours(parts, riseHour, setHour, "moon");
  }

  function buildAnchorsFromLocalHours(parts, riseHour, setHour, source) {
    var dateKey = toDateKey(parts);
    var rise = localFloatHourToUtc(dateKey, riseHour);
    var set = localFloatHourToUtc(dateKey, setHour);

    if (set <= rise) {
      set = localFloatHourToUtc(addDaysToDateKey(dateKey, 1), setHour);
    }

    return {
      source: source,
      sunrise: rise,
      noon: new Date(rise.getTime() + (set.getTime() - rise.getTime()) / 2),
      sunset: set,
      midnight: new Date(set.getTime() + (rise.getTime() + 86400000 - set.getTime()) / 2)
    };
  }

  function localFloatHourToUtc(dateKey, hourValue) {
    var hours = Math.floor(hourValue);
    var minutesFloat = (hourValue - hours) * 60;
    var minutes = Math.floor(minutesFloat);
    var seconds = Math.round((minutesFloat - minutes) * 60);

    if (seconds >= 60) {
      seconds -= 60;
      minutes += 1;
    }

    if (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }

    return zonedLocalToUtc(dateKey, pad2(hours) + ":" + pad2(minutes) + ":" + pad2(seconds), JERUSALEM_TIME_ZONE);
  }

  function dateToLocalFloatHour(date, timeZone) {
    var parts = getZonedParts(date, timeZone);
    return parts.hour + parts.minute / 60 + parts.second / 3600;
  }

  function suntime(dy, mn, yr, sundeg, sunmin, londeg, lonmin, ew, latdeg, latmin, ns, timezone) {
    var ret = [0, 0, 0, 0];
    var invalid = 0;
    var longitude = (londeg + lonmin / 60.0) * ((ew === 0) ? -1 : 1);
    var latitude = (latdeg + latmin / 60.0) * ((ns === 0) ? 1 : -1);
    var yday = doy(dy, mn, yr);
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
      Q = Math.atan2(Q / Math.sqrt(-Q * Q + 1), 1);

      var S = (R - (Math.sin(Q) * Math.sin(E))) / (Math.cos(Q) * Math.cos(E));
      if (Math.abs(S) > 1) {
        invalid = 1;
      }

      S = A - Math.atan2(S / Math.sqrt(-S * S + 1), 1);

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

      V *= 3.81972;

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

  function doy(day, month, year) {
    var num = (month > 2 && isLeapGregorianYear(year)) ? 1 : 0;
    return MON_COUNT[month] + day + num;
  }

  function isLeapGregorianYear(year) {
    return ((year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0));
  }

  function getTimeZoneOffsetHours(date, timeZone) {
    var parts = getZonedParts(date, timeZone);
    var utcMinutes = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) / 60000;
    return (utcMinutes - date.getTime() / 60000) / 60;
  }

  function getZonedParts(date, timeZone) {
    var formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    var parts = formatter.formatToParts(date).reduce(function (acc, part) {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return {
      year: Number(parts.year),
      month: Number(parts.month),
      day: Number(parts.day),
      hour: Number(parts.hour === "24" ? 0 : parts.hour),
      minute: Number(parts.minute),
      second: Number(parts.second)
    };
  }

  function zonedLocalToUtc(dateKey, timeValue, timeZone) {
    var dateParts = dateKey.split("-").map(Number);
    var timeParts = timeValue.split(":").map(Number);
    var guess = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1] || 0, timeParts[2] || 0));

    for (var i = 0; i < 3; i += 1) {
      var zoned = getZonedParts(guess, timeZone);
      var wantedMinutes = Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1] || 0, timeParts[2] || 0) / 60000;
      var actualMinutes = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute, zoned.second) / 60000;
      guess = new Date(guess.getTime() + (wantedMinutes - actualMinutes) * 60000);
    }

    return guess;
  }

  function toDateKey(parts) {
    return [parts.year, pad2(parts.month), pad2(parts.day)].join("-");
  }

  function addDaysToDateKey(dateKey, days) {
    var parts = dateKey.split("-").map(Number);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + days, 0, 0, 0));
    return [date.getUTCFullYear(), pad2(date.getUTCMonth() + 1), pad2(date.getUTCDate())].join("-");
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  window.NeedMeCommercialTime = {
    getJerusalemAnchors: getJerusalemAnchors
  };
}());

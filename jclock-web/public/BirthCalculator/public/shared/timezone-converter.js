(function(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BirthCalculatorTime = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function() {
  "use strict";

  var JERUSALEM_TIME_ZONE = "Asia/Jerusalem";

  function resolveLookup(lookupTimeZone) {
    if (typeof lookupTimeZone === "function") {
      return lookupTimeZone;
    }
    if (typeof tzlookup === "function") {
      return tzlookup;
    }
    throw new Error("Time zone lookup is unavailable.");
  }

  function getSelectedTimeZone(latitude, longitude, lookupTimeZone) {
    return resolveLookup(lookupTimeZone)(Number(latitude), Number(longitude));
  }

  function getZonedParts(date, timeZone) {
    var formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });
    var values = {};
    formatter.formatToParts(date).forEach(function(part) {
      if (part.type !== "literal") {
        values[part.type] = part.value;
      }
    });

    var hour = Number(values.hour);
    return {
      year: Number(values.year),
      month: Number(values.month),
      day: Number(values.day),
      hour: hour === 24 ? 0 : hour,
      minute: Number(values.minute),
      second: Number(values.second)
    };
  }

  function wallTimeToTimestamp(parts) {
    return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second || 0);
  }

  function zonedLocalTimeToUtc(year, month, day, hour, minute, timeZone) {
    var target = { year: year, month: month, day: day, hour: hour, minute: minute, second: 0 };
    var targetTimestamp = wallTimeToTimestamp(target);
    var utcDate = new Date(targetTimestamp);

    for (var i = 0; i < 6; i += 1) {
      var zonedParts = getZonedParts(utcDate, timeZone);
      var zonedTimestamp = wallTimeToTimestamp(zonedParts);
      var diff = targetTimestamp - zonedTimestamp;
      if (Math.abs(diff) < 1000) {
        return utcDate;
      }
      utcDate = new Date(utcDate.getTime() + diff);
    }

    return utcDate;
  }

  function getTimeZoneOffsetHours(date, timeZone) {
    var zonedTimestamp = wallTimeToTimestamp(getZonedParts(date, timeZone));
    return Math.round(((zonedTimestamp - date.getTime()) / 3600000) * 60) / 60;
  }

  function convertLocalTimeToJerusalem(input) {
    var latitude = Number(input.latitude);
    var longitude = Number(input.longitude);
    var year = Number(input.year);
    var month = Number(input.month);
    var day = Number(input.day);
    var hour = Number(input.hour);
    var minute = Number(input.minute);
    var explicitTimeZone = typeof input.timeZone === "string" ? input.timeZone.trim() : "";
    if (![year, month, day, hour, minute].every(Number.isFinite)) {
      throw new TypeError("Invalid date or time.");
    }

    var timeZone = explicitTimeZone || getSelectedTimeZone(latitude, longitude, input.lookupTimeZone);
    var utcDate = zonedLocalTimeToUtc(year, month, day, hour, minute, timeZone);
    var sourceGmt = getTimeZoneOffsetHours(utcDate, timeZone);
    var jerusalem = getZonedParts(utcDate, JERUSALEM_TIME_ZONE);
    var jerusalemGmt = getTimeZoneOffsetHours(utcDate, JERUSALEM_TIME_ZONE);

    return {
      gmt: sourceGmt,
      sourceGmt: sourceGmt,
      timeZone: timeZone,
      utcDate: utcDate,
      jerusalem: jerusalem,
      jerusalemGmt: jerusalemGmt
    };
  }

  function formatGmtOffset(hours) {
    var totalMinutes = Math.round(hours * 60);
    var sign = totalMinutes >= 0 ? "+" : "-";
    var absoluteMinutes = Math.abs(totalMinutes);
    var wholeHours = Math.floor(absoluteMinutes / 60);
    var minutes = absoluteMinutes % 60;
    return "GMT" + sign + String(wholeHours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  }

  function padTimePart(value) {
    return String(value).padStart(2, "0");
  }

  function formatJerusalemDateTime(parts) {
    if (!parts) {
      return "";
    }

    return parts.year + "-" + padTimePart(parts.month) + "-" + padTimePart(parts.day) + " " + padTimePart(parts.hour) + ":" + padTimePart(parts.minute);
  }

  return {
    JERUSALEM_TIME_ZONE: JERUSALEM_TIME_ZONE,
    convertLocalTimeToJerusalem: convertLocalTimeToJerusalem,
    formatGmtOffset: formatGmtOffset,
    formatJerusalemDateTime: formatJerusalemDateTime,
    getSelectedTimeZone: getSelectedTimeZone,
    getTimeZoneOffsetHours: getTimeZoneOffsetHours,
    getZonedParts: getZonedParts,
    zonedLocalTimeToUtc: zonedLocalTimeToUtc
  };
});

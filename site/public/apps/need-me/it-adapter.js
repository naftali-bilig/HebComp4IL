(function () {
  "use strict";

  var GREG_SDN_OFFSET = 32045;
  var DAYS_PER_5_MONTHS = 153;
  var DAYS_PER_4_YEARS = 1461;
  var DAYS_PER_400_YEARS = 146097;
  var HEB_SDN_OFFSET = 347997;
  var HALAKIM_PER_HOUR = 1080;
  var HALAKIM_PER_DAY = 25920;
  var HALAKIM_PER_LUNAR_CYCLE = (29 * HALAKIM_PER_DAY) + 13753;
  var NEW_MOON_OF_CREATION = 31524;
  var UNIX_EPOCH_SDN = gregorianToSdn(1970, 1, 1);

  function getZonedParts(date, timeZone) {
    var formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      weekday: "short"
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
      second: Number(parts.second),
      weekdayName: parts.weekday
    };
  }

  function weekdayIndex(date, timeZone) {
    var shortName = getZonedParts(date, timeZone).weekdayName;
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(shortName);
  }

  function getMoladStartsBetween(start, end, timeZone) {
    var cursorHebrew = getHebrewParts(start, timeZone);
    var totalHalakim = getMoladTotalHalakim(cursorHebrew);
    var results = [];
    var guard = 0;

    while (guard < 800) {
      var moladInfo = buildMoladInfoFromTotalHalakim(totalHalakim);
      var moladDate = hebrewAbsoluteHourToUtc(moladInfo.civilAbsoluteDay, moladInfo.hour, timeZone);

      if (moladDate >= end) {
        break;
      }

      if (moladDate >= start) {
        results.push({
          date: moladDate,
          info: buildMoladTimeInfo(moladDate, timeZone, cursorHebrew, moladInfo)
        });
      }

      cursorHebrew = getNextHebrewMonth(cursorHebrew);
      totalHalakim += HALAKIM_PER_LUNAR_CYCLE;
      guard += 1;
    }

    return results;
  }

  function computeItTimeInfo(options) {
    var date = options.date;
    var timeZone = options.timeZone;
    var parts = getZonedParts(date, timeZone);
    var hebrew = getHebrewParts(date, timeZone);
    var hebrewHour = Math.floor(parts.hour / 2) + 1;
    var period = getPeriodInfo(parts, hebrew);

    return {
      source: "need-me-adapter",
      gregorian: parts,
      hebrew: hebrew,
      weekday: weekdayIndex(date, timeZone),
      hebrewHour: hebrewHour,
      timeCode: "H" + String(hebrewHour).padStart(2, "0"),
      period: period,
      confidence: 0.75
    };
  }

  function getHebrewParts(date, timeZone) {
    var gregorian = getZonedParts(date, timeZone);
    var hebrewDateConverter = window.hebrewDate || (typeof globalThis !== "undefined" && globalThis.hebrewDate);
    var converted = typeof hebrewDateConverter === "function"
      ? hebrewDateConverter(gregorian.year, gregorian.month, gregorian.day, "English")
      : null;

    if (!converted) {
      return getIntlHebrewParts(date, timeZone);
    }

    return {
      year: Number(converted.year),
      month: Number(converted.month),
      monthName: converted.month_name,
      monthKey: normalizeHebrewMonth(converted.month_name),
      day: Number(converted.date)
    };
  }

  function getIntlHebrewParts(date, timeZone) {
    var formatter = new Intl.DateTimeFormat("en-u-ca-hebrew", {
      timeZone: timeZone,
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    var parts = formatter.formatToParts(date).reduce(function (acc, part) {
      acc[part.type] = part.value;
      return acc;
    }, {});

    return {
      year: Number(parts.year),
      month: getHebrewMonthNumber(parts.month, Number(parts.year)),
      monthName: parts.month,
      monthKey: normalizeHebrewMonth(parts.month),
      day: Number(parts.day)
    };
  }

  function normalizeHebrewMonth(monthName) {
    return String(monthName || "").toLowerCase().replace(/\s+/g, "");
  }

  function getHebrewMonthNumber(monthName, hebrewYear) {
    var key = normalizeHebrewMonth(monthName);
    var leap = isHebrewLeapYear(hebrewYear);
    var aliases = {
      tishri: 1,
      tishrei: 1,
      heshvan: 2,
      cheshvan: 2,
      kislev: 3,
      tevet: 4,
      shevat: 5,
      adar: leap ? 7 : 6,
      adari: 6,
      adar1: 6,
      adarii: 7,
      adar2: 7,
      nisan: leap ? 8 : 7,
      nissan: leap ? 8 : 7,
      iyyar: leap ? 9 : 8,
      iyar: leap ? 9 : 8,
      sivan: leap ? 10 : 9,
      tammuz: leap ? 11 : 10,
      tamuz: leap ? 11 : 10,
      av: leap ? 12 : 11,
      elul: leap ? 13 : 12
    };

    return aliases[key] || null;
  }

  function getPeriodInfo(parts, hebrew) {
    var nextHebrew = getNextHebrewMonth(hebrew);
    var nextMolad = getMoladInfo(parts, nextHebrew);

    if (nextMolad.isHour) {
      return buildPeriodInfo(nextHebrew, nextMolad);
    }

    return buildPeriodInfo(hebrew, getMoladInfo(parts, hebrew));
  }

  function buildMoladTimeInfo(date, timeZone, hebrew, moladInfo) {
    var parts = getZonedParts(date, timeZone);
    var hebrewHour = Math.floor(parts.hour / 2) + 1;

    return {
      source: "need-me-adapter",
      gregorian: parts,
      hebrew: hebrew,
      weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekdayName),
      hebrewHour: hebrewHour,
      timeCode: "H" + String(hebrewHour).padStart(2, "0"),
      period: buildPeriodInfo(hebrew, moladInfo),
      confidence: 0.75
    };
  }

  function buildPeriodInfo(hebrew, molad) {
    var monthType = getHebrewMonthType(hebrew);
    var tags = getPeriodTags(monthType, hebrew);

    return {
      key: String(hebrew.year) + "-" + hebrew.monthKey,
      type: monthType,
      isStart: molad.isHour,
      hebrewYear: hebrew.year,
      hebrewMonth: hebrew.monthName,
      yovel: getYovelInfo(hebrew.year),
      molad: molad,
      tags: tags
    };
  }

  function getNextHebrewMonth(hebrew) {
    var monthsInYear = isHebrewLeapYear(hebrew.year) ? 13 : 12;
    var nextMonth = hebrew.month + 1;
    var nextYear = hebrew.year;

    if (nextMonth > monthsInYear) {
      nextMonth = 1;
      nextYear += 1;
    }

    var monthName = getHebrewMonthName(nextYear, nextMonth);

    return {
      year: nextYear,
      month: nextMonth,
      monthName: monthName,
      monthKey: normalizeHebrewMonth(monthName),
      day: 1
    };
  }

  function getHebrewMonthName(hebrewYear, monthNumber) {
    var leap = isHebrewLeapYear(hebrewYear);
    var months = leap
      ? ["Tishri", "Heshvan", "Kislev", "Tevet", "Shevat", "AdarI", "AdarII", "Nisan", "Iyyar", "Sivan", "Tammuz", "Av", "Elul"]
      : ["Tishri", "Heshvan", "Kislev", "Tevet", "Shevat", "Adar", "Nisan", "Iyyar", "Sivan", "Tammuz", "Av", "Elul"];

    return months[monthNumber - 1] || "";
  }

  function getHebrewMonthType(hebrew) {
    if (hebrew.monthKey === "nisan") {
      return "nissan";
    }

    if (hebrew.monthKey === "tishri" || hebrew.monthKey === "tishrei") {
      return "tishrei";
    }

    return "regularMonth";
  }

  function getYovelInfo(hebrewYear) {
    var yovelRemainder = positiveModulo(hebrewYear, 49);
    var isYovelStart = yovelRemainder === 1;
    return {
      isYovelStart: isYovelStart,
      cycle: Math.floor((hebrewYear - 1) / 49) + 1,
      remainder: yovelRemainder
    };
  }

  function getMoladInfo(parts, hebrew) {
    var moladInfo = buildMoladInfoForMonth(hebrew);
    var currentHebrewDay = gregorianToSdn(parts.year, parts.month, parts.day) - HEB_SDN_OFFSET;

    moladInfo.isHour = currentHebrewDay === moladInfo.civilAbsoluteDay && parts.hour === moladInfo.hour;
    return moladInfo;
  }

  function buildMoladInfoForMonth(hebrew) {
    return buildMoladInfoFromTotalHalakim(getMoladTotalHalakim(hebrew));
  }

  function getMoladTotalHalakim(hebrew) {
    var monthOffset = getMonthOffsetFromTishrei(hebrew.year, hebrew.monthKey);
    var monthsElapsed = monthsBeforeTishrei(hebrew.year) + monthOffset;
    return NEW_MOON_OF_CREATION + monthsElapsed * HALAKIM_PER_LUNAR_CYCLE;
  }

  function buildMoladInfoFromTotalHalakim(totalHalakim) {
    var molad = totalHalakimToMolad(totalHalakim);
    var civilMolad = moladToCivilHour(molad);

    return {
      source: "hebrewDate-reference",
      absoluteDay: molad.absoluteDay,
      hour: civilMolad.hour,
      jewishHour: molad.hour,
      jewishHourOrdinal: molad.hour + 1,
      jewishDay: getJewishDayNumber(molad.absoluteDay),
      jewishDayName: getJewishDayName(molad.absoluteDay),
      jewishDayPart: molad.hour < 12 ? "night" : "day",
      parts: molad.parts,
      civilAbsoluteDay: civilMolad.absoluteDay,
      isHour: true
    };
  }

  function totalHalakimToMolad(totalHalakim) {
    var moladDay = Math.floor(totalHalakim / HALAKIM_PER_DAY);
    var halakimOfDay = positiveModulo(totalHalakim, HALAKIM_PER_DAY);

    return {
      absoluteDay: moladDay,
      hour: Math.floor(halakimOfDay / HALAKIM_PER_HOUR),
      parts: positiveModulo(halakimOfDay, HALAKIM_PER_HOUR)
    };
  }

  function moladToCivilHour(molad) {
    var civilHour = positiveModulo(molad.hour + 18, 24);
    var civilAbsoluteDay = molad.absoluteDay;

    if (civilHour >= 18) {
      civilAbsoluteDay -= 1;
    }

    return {
      absoluteDay: civilAbsoluteDay,
      hour: civilHour
    };
  }

  function getJewishDayName(absoluteDay) {
    var names = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return names[positiveModulo(absoluteDay, 7)];
  }

  function getJewishDayNumber(absoluteDay) {
    return positiveModulo(absoluteDay, 7) + 1;
  }

  function computeCalendarMolad(hebrewYear, monthKey) {
    return totalHalakimToMolad(getMoladTotalHalakim({
      year: hebrewYear,
      monthKey: monthKey
    }));
  }

  function gregorianToSdn(inputYear, inputMonth, inputDay) {
    var year;
    var month;
    var sdn;

    if (inputYear < 0) {
      year = inputYear + 4801;
    } else {
      year = inputYear + 4800;
    }

    if (inputMonth > 2) {
      month = inputMonth - 3;
    } else {
      month = inputMonth + 9;
      year -= 1;
    }

    sdn = Math.floor((Math.floor(year / 100) * DAYS_PER_400_YEARS) / 4);
    sdn += Math.floor(((year % 100) * DAYS_PER_4_YEARS) / 4);
    sdn += Math.floor((month * DAYS_PER_5_MONTHS + 2) / 5);
    sdn += inputDay - GREG_SDN_OFFSET;

    return sdn;
  }

  function sdnToGregorian(sdn) {
    var date = new Date((sdn - UNIX_EPOCH_SDN) * 86400000);
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate()
    };
  }

  function hebrewAbsoluteHourToUtc(civilAbsoluteDay, hour, timeZone) {
    var gregorian = sdnToGregorian(civilAbsoluteDay + HEB_SDN_OFFSET);
    var dateKey = [
      String(gregorian.year).padStart(4, "0"),
      String(gregorian.month).padStart(2, "0"),
      String(gregorian.day).padStart(2, "0")
    ].join("-");

    return zonedLocalToUtc(dateKey, String(hour).padStart(2, "0") + ":00", timeZone);
  }

  function zonedLocalToUtc(dateKey, timeValue, timeZone) {
    var dateParts = dateKey.split("-").map(Number);
    var timeParts = timeValue.split(":").map(Number);
    var guess = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1] || 0, 0));

    for (var i = 0; i < 3; i += 1) {
      var zoned = getZonedParts(guess, timeZone);
      var wantedMinutes = Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1] || 0, 0) / 60000;
      var actualMinutes = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute, 0) / 60000;
      guess = new Date(guess.getTime() + (wantedMinutes - actualMinutes) * 60000);
    }

    return guess;
  }

  function monthsBeforeTishrei(hebrewYear) {
    var completedYears = hebrewYear - 1;
    var cycles = Math.floor(completedYears / 19);
    var yearInCycle = completedYears % 19;

    return 235 * cycles + 12 * yearInCycle + Math.floor((7 * yearInCycle + 1) / 19);
  }

  function getMonthOffsetFromTishrei(hebrewYear, monthKey) {
    var leap = isHebrewLeapYear(hebrewYear);
    var months = leap
      ? ["tishri", "heshvan", "kislev", "tevet", "shevat", "adar i", "adar ii", "nisan", "iyyar", "sivan", "tammuz", "av", "elul"]
      : ["tishri", "heshvan", "kislev", "tevet", "shevat", "adar", "nisan", "iyyar", "sivan", "tammuz", "av", "elul"];
    var normalizedMonths = months.map(normalizeHebrewMonth);
    var index = normalizedMonths.indexOf(monthKey);

    return index === -1 ? 0 : index;
  }

  function isHebrewLeapYear(hebrewYear) {
    return positiveModulo(7 * hebrewYear + 1, 19) < 7;
  }

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function getPeriodTags(monthType, hebrew) {
    var tags = ["molad"];

    if (monthType === "nissan" || monthType === "tishrei") {
      tags.push("feast", "gathering", "season-start");
    } else {
      tags.push("daily-routine");
    }

    if (monthType === "tishrei" && getYovelInfo(hebrew.year).isYovelStart) {
      tags.push("yovel");
    }

    return tags;
  }

  window.NeedMeItAdapter = {
    computeItTimeInfo: computeItTimeInfo,
    getZonedParts: getZonedParts,
    getMoladStartsBetween: getMoladStartsBetween
  };
}());

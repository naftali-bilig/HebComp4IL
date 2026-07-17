(function () {
  "use strict";

  var GOOGLE_CLIENT_ID = "PASTE_GOOGLE_OAUTH_CLIENT_ID_HERE";
  var CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
  var REMINDER_MINUTES = [10080, 1440, 120, 20];
  var MAX_RENDERED_RESULTS = 120;
  var JERUSALEM_TIME_ZONE = "Asia/Jerusalem";
  var TEMPORARY_CLOCK_REFERENCE = {
    moladHour: 8,
    dayParts: ["day", "night"],
    tractate: "מסכת ראש השנה"
  };
  var moladRangeCache = {};
  var translations = {
    he: {
      brandName: "Need-Me",
      documentTitle: "Need-Me",
      pageTitle: "שיבוץ פרסום לפי זמן",
      connectGoogle: "התחבר לגוגל",
      productGroup: "מה המוצר שאני מחפש למכור",
      productLabel: "מוצר",
      timeZone: "אזור זמן",
      region: "יבשת / אזור",
      regionMiddleEast: "המזרח התיכון - שעון חמה ולבנה",
      regionIreland: "אירלנד - שעון חמה ולבנה",
      regionEurope: "אירופה - שעון לבנה",
      regionAfrica: "אפריקה - שעון לבנה",
      regionAsia: "אסיה - שעון חמה",
      regionNorthAmerica: "צפון אמריקה - שעון חמה",
      regionSouthAmerica: "דרום אמריקה - שעון חמה",
      regionAustralia: "אוסטרליה - שעון חמה",
      regionItaly: "איטליה - שעון חמה",
      regionItalyAustralia: "איטליה - שעון חמה",
      audience: "מוכר ל",
      boys: "בנים",
      girls: "בנות",
      rangeMode: "טווח בדיקה",
      rangeDays: "ימים ושעות שנבחרו",
      rangeMonths: "חודשים קדימה",
      rangeShmita: "מחזור שמיטה נוכחי",
      rangeYovel: "יובל נוכחי",
      duration: "משך פרסום",
      oneHour: "שעה",
      halfHour: "חצי שעה",
      twoHours: "שעתיים",
      periodStartOnly: "רק תחילת תקופה",
      storeGroup: "מתי אני עומד בחנות",
      startDate: "תאריך לעמידה בחנות",
      daysToCheck: "ימים לבדיקה",
      monthsAhead: "חודשים קדימה",
      workStart: "עובד משעה",
      workEnd: "עובד עד שעה",
      calculate: "חשב תחילת זמן פרסום",
      createCalendar: "צור אירועים ביומן",
      found: "נמצאו",
      range: "טווח",
      calendar: "יומן",
      notConnected: "לא מחובר",
      resultsTitle: "חלונות פרסום",
      downloadJson: "הורד JSON",
      languageToggle: "English",
      productNotFound: "המוצר לא נמצא במאגר המקומי.",
      productSourceCheckRequired: "המוצר \"{product}\" עדיין לא קיים במאגר. נדרש לבדוק היכן מופיע המוצר בספרי מסורת ישראל.",
      noSlots: "לא נמצאו חלונות פרסום בטווח שנבחר.",
      signaturesOutsideWorkHours: "נמצאו {count} חתימות זמן, אבל כולן מחוץ לשעות העבודה שנבחרו.",
      renderedLimit: "מוצגות {shown} תוצאות ראשונות מתוך {total}.",
      daysSuffix: "ימים",
      monthsSuffix: "חודשים",
      yovelRange: "יובל {cycle} · {start}-{end} · שנה 50: {fiftieth}",
      shmitaRange: "שבוע {week} בתוך יובל {cycle} · {start}-{end}",
      periodStartTime: "תחילת תקופה: {time}",
      periodTime: "תקופה: {start} - {end}",
      entryPoint: "נקודת כניסה לשימוש",
      consecutiveHours: "{count} שעות רצופות",
      relevancePeriodStart: "תחילת תקופה",
      relevanceFull: "לעמוד בחנות: כל החלון",
      relevancePartial: "לעמוד בחנות: {start}-{end}",
      relevanceNo: "לא מתאים",
      missingClientId: "חסר Client ID",
      googleLoading: "Google עדיין נטען",
      connected: "מחובר",
      creatingEvents: "יוצר אירועים...",
      createdEvents: "נוצרו {created}/{total}",
      eventsCreated: "האירועים נוצרו",
      eventError: "שגיאה ביצירת אירוע",
      publish: "לפרסם: {product}",
      periodDescription: "Need-Me · {period}. {molad}. פעולה נקודתית סביב המולד. חתימת זמן: {tags}.",
      eventDescription: "Need-Me · להעלות פרסום בתחילת האירוע ולהוריד בסוף.",
      source: "מקור: {source}"
    },
    en: {
      brandName: "COIN · Commercial Only If Needed",
      documentTitle: "COIN · Commercial Only If Needed",
      pageTitle: "Time-Based Advertising Scheduler",
      connectGoogle: "Connect Google",
      productGroup: "Product to sell",
      productLabel: "Product",
      timeZone: "Time zone",
      region: "Continent / region",
      regionMiddleEast: "Middle East - sun and moon clocks",
      regionIreland: "Ireland - sun and moon clocks",
      regionEurope: "Europe - moon clock",
      regionAfrica: "Africa - moon clock",
      regionAsia: "Asia - sun clock",
      regionNorthAmerica: "North America - sun clock",
      regionSouthAmerica: "South America - sun clock",
      regionAustralia: "Australia - sun clock",
      regionItaly: "Italy - sun clock",
      regionItalyAustralia: "Italy - sun clock",
      audience: "Selling to",
      boys: "Boys",
      girls: "Girls",
      rangeMode: "Check range",
      rangeDays: "Selected days and hours",
      rangeMonths: "Months ahead",
      rangeShmita: "Current Shmita cycle",
      rangeYovel: "Current Jubilee",
      duration: "Ad duration",
      oneHour: "One hour",
      halfHour: "Half hour",
      twoHours: "Two hours",
      periodStartOnly: "Period start only",
      storeGroup: "When I am in the store",
      startDate: "Store date",
      daysToCheck: "Days to check",
      monthsAhead: "Months ahead",
      workStart: "Working from",
      workEnd: "Working until",
      calculate: "Calculate Ad Start Time",
      createCalendar: "Create calendar events",
      found: "Found",
      range: "Range",
      calendar: "Calendar",
      notConnected: "Not connected",
      resultsTitle: "Advertising windows",
      downloadJson: "Download JSON",
      languageToggle: "עברית",
      productNotFound: "The product was not found in the local catalog.",
      productSourceCheckRequired: "The product \"{product}\" is not in the catalog yet. Its appearance in the books of Jewish tradition needs to be checked.",
      noSlots: "No advertising windows were found in the selected range.",
      signaturesOutsideWorkHours: "{count} time signatures were found, but all are outside the selected working hours.",
      renderedLimit: "Showing the first {shown} results out of {total}.",
      daysSuffix: "days",
      monthsSuffix: "months",
      yovelRange: "Jubilee {cycle} · {start}-{end} · 50th year: {fiftieth}",
      shmitaRange: "Week {week} within Jubilee {cycle} · {start}-{end}",
      periodStartTime: "Period start: {time}",
      periodTime: "Period: {start} - {end}",
      entryPoint: "Entry point for use",
      consecutiveHours: "{count} consecutive hours",
      relevancePeriodStart: "Period start",
      relevanceFull: "Stand in store: full window",
      relevancePartial: "Stand in store: {start}-{end}",
      relevanceNo: "Not suitable",
      missingClientId: "Missing Client ID",
      googleLoading: "Google is still loading",
      connected: "Connected",
      creatingEvents: "Creating events...",
      createdEvents: "Created {created}/{total}",
      eventsCreated: "Events created",
      eventError: "Error creating event",
      publish: "Advertise: {product}",
      periodDescription: "COIN · Commercial Only If Needed · {period}. {molad}. Point action around the molad. Time signature: {tags}.",
      eventDescription: "COIN · Commercial Only If Needed · publish the ad at the start of the event and remove it at the end.",
      source: "Source: {source}"
    }
  };

  var state = {
    accessToken: "",
    slots: [],
    selectedProduct: null,
    message: "",
    language: getInitialLanguage()
  };

  var form = document.getElementById("plannerForm");
  var productInput = document.getElementById("productInput");
  var timeZoneInput = document.getElementById("timeZoneInput");
  var regionInput = document.getElementById("regionInput");
  var audienceInput = document.getElementById("audienceInput");
  var audienceField = document.getElementById("audienceField");
  var startDateInput = document.getElementById("startDateInput");
  var rangeModeInput = document.getElementById("rangeModeInput");
  var daysInput = document.getElementById("daysInput");
  var monthsInput = document.getElementById("monthsInput");
  var durationInput = document.getElementById("durationInput");
  var periodStartOnlyInput = document.getElementById("periodStartOnlyInput");
  var workStartField = document.getElementById("workStartField");
  var workEndField = document.getElementById("workEndField");
  var workStartInput = document.getElementById("workStartInput");
  var workEndInput = document.getElementById("workEndInput");
  var slotCount = document.getElementById("slotCount");
  var rangeText = document.getElementById("rangeText");
  var calendarStatus = document.getElementById("calendarStatus");
  var resultsList = document.getElementById("resultsList");
  var languageToggleButton = document.getElementById("languageToggleButton");
  var googleConnectButton = document.getElementById("googleConnectButton");
  var createCalendarButton = document.getElementById("createCalendarButton");
  var downloadJsonButton = document.getElementById("downloadJsonButton");

  function getInitialLanguage() {
    var requestedLanguage = new URLSearchParams(window.location.search).get("lang");

    if (requestedLanguage && requestedLanguage.toLowerCase().indexOf("en") === 0) {
      return "en";
    }

    if (requestedLanguage && requestedLanguage.toLowerCase().indexOf("he") === 0) {
      return "he";
    }

    return "he";
  }

  function init() {
    startDateInput.value = toInputDate(new Date());
    applyEmbeddingMode();
    applyLanguage();
    renderProductSuggestions();
    applyRequestedProduct();
    rangeModeInput.addEventListener("change", syncRangeControls);
    regionInput.addEventListener("change", syncAudienceControls);
    periodStartOnlyInput.addEventListener("change", syncPeriodStartOnlyControls);
    form.addEventListener("submit", handlePlanSubmit);
    languageToggleButton.addEventListener("click", toggleLanguage);
    googleConnectButton.addEventListener("click", connectGoogle);
    createCalendarButton.addEventListener("click", createCalendarEvents);
    downloadJsonButton.addEventListener("click", downloadJson);
    syncRangeControls();
    syncAudienceControls();
    syncPeriodStartOnlyControls();
    refreshActions();
  }

  function applyEmbeddingMode() {
    var params = new URLSearchParams(window.location.search);
    var isEmbedded = params.get("embedded") === "1";

    try {
      isEmbedded = isEmbedded || window.self !== window.top;
    } catch (error) {
      isEmbedded = true;
    }

    document.body.classList.toggle("is-embedded", isEmbedded);
  }

  function renderProductSuggestions() {
    if (!window.NeedMeProducts || !window.NeedMeProducts.length) {
      return;
    }

    var selectedProductId = state.selectedProduct ? state.selectedProduct.id : productInput.value;
    productInput.innerHTML = "";

    window.NeedMeProducts.forEach(function (product) {
      var option = document.createElement("option");
      option.value = product.id;
      option.textContent = getProductLabel(product);
      productInput.appendChild(option);
    });

    if (selectedProductId && window.NeedMeProducts.some(function (product) {
      return product.id === selectedProductId;
    })) {
      productInput.value = selectedProductId;
    }
  }

  function applyRequestedProduct() {
    var requestedProduct = getRequestedProduct();

    if (!requestedProduct) {
      return;
    }

    var product = findProduct(requestedProduct);

    if (product) {
      state.selectedProduct = product;
      state.message = "";
      productInput.value = product.id;
      return;
    }

    state.selectedProduct = null;
    state.slots = [];
    state.message = t("productSourceCheckRequired", { product: requestedProduct });
    renderResults(state.message);
    refreshActions();
  }

  function getRequestedProduct() {
    var params = new URLSearchParams(window.location.search);
    return params.get("product") || params.get("p") || "";
  }

  function toggleLanguage() {
    state.language = state.language === "he" ? "en" : "he";
    applyLanguage();
    renderProductSuggestions();
    if (state.selectedProduct) {
      productInput.value = state.selectedProduct.id;
    }

    if (state.message) {
      state.message = t("productSourceCheckRequired", { product: getRequestedProduct() });
      renderResults(state.message);
      return;
    }

    if (state.rangeLabel || state.slots.length || state.diagnostics) {
      renderResults("");
    }
  }

  function applyLanguage() {
    var dictionary = translations[state.language] || translations.he;
    document.documentElement.lang = state.language;
    document.documentElement.dir = state.language === "he" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = dictionary[element.getAttribute("data-i18n")] || element.textContent;
    });

    document.querySelectorAll("[data-placeholder-he]").forEach(function (element) {
      element.placeholder = state.language === "he" ? element.getAttribute("data-placeholder-he") : element.getAttribute("data-placeholder-en");
    });

    document.title = t("documentTitle");
    languageToggleButton.textContent = t("languageToggle");
    calendarStatus.textContent = state.accessToken ? t("connected") : t("notConnected");
  }

  function t(key, values) {
    var dictionary = translations[state.language] || translations.he;
    var template = dictionary[key] || translations.he[key] || key;
    return template.replace(/\{([^}]+)\}/g, function (_, name) {
      return values && Object.prototype.hasOwnProperty.call(values, name) ? values[name] : "";
    });
  }

  function getProductLabel(product) {
    if (state.language === "en" && product.labelEn) {
      return product.labelEn;
    }

    return product.label;
  }

  function getSlotProductLabel(slot) {
    var product = window.NeedMeProducts.find(function (item) {
      return item.id === slot.productId;
    });
    return product ? getProductLabel(product) : slot.productLabel;
  }

  function handlePlanSubmit(event) {
    event.preventDefault();
    forceCurrentYovelRange();
    var product = findProduct(productInput.value);
    state.selectedProduct = product;

    if (!product) {
      state.slots = [];
      state.message = t("productNotFound");
      renderResults(state.message);
      refreshActions();
      return;
    }

    var durationMinutes = getDurationMinutes(product);
    var requestedStart = startOfSelectedDate(startDateInput.value);
    var range = getSelectedRange(requestedStart, timeZoneInput.value);
    var clockModel = getSelectedClockModel();
    state.diagnostics = createDiagnostics();
    state.rangeLabel = range.label;
    state.message = "";

    state.slots = buildSchedule({
      product: product,
      start: range.start,
      end: range.end,
      rangeLabel: range.label,
      timeZone: timeZoneInput.value,
      durationMinutes: durationMinutes,
      workStart: workStartInput.value,
      workEnd: workEndInput.value,
      periodStartOnly: periodStartOnlyInput.checked,
      clockModel: clockModel,
      region: regionInput.value,
      audience: audienceInput.value,
      diagnostics: state.diagnostics
    });

    renderResults("");
    refreshActions();
  }

  function findProduct(rawName) {
    var name = normalizeText(rawName);
    return window.NeedMeProducts.find(function (product) {
      if (normalizeText(product.id) === name || normalizeText(product.label) === name || normalizeText(product.labelEn) === name) {
        return true;
      }

      return product.aliases.some(function (alias) {
        return normalizeText(alias) === name;
      });
    });
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function createDiagnostics() {
    return {
      candidateCount: 0,
      filteredByWorkHours: 0
    };
  }

  function getDurationMinutes(product) {
    if (getSchedulingMode(product) === "period-start" || getSchedulingMode(product) === "temporary-clock") {
      return Number(product.actionDurationMinutes || 60);
    }

    return Number(durationInput.value || 60);
  }

  function getSelectedRange(requestedStart, timeZone) {
    if (rangeModeInput.value === "days") {
      var days = Math.min(Number(daysInput.value || 1), 31);
      return {
        start: requestedStart,
        end: addDays(requestedStart, days),
        label: toInputDate(requestedStart) + " + " + days + " " + t("daysSuffix")
      };
    }

    if (rangeModeInput.value === "shmita") {
      return getShmitaRange(requestedStart, timeZone);
    }

    if (rangeModeInput.value === "yovel") {
      return getYovelRange(requestedStart, timeZone);
    }

    var months = Math.min(Number(monthsInput.value || 6), 588);
    return {
      start: requestedStart,
      end: addMonths(requestedStart, months),
      label: toInputDate(requestedStart) + " + " + months + " " + t("monthsSuffix")
    };
  }

  function getYovelRange(requestedStart, timeZone) {
    var hebrew = getHebrewDateForDate(requestedStart, timeZone);
    var yovelStartYear = hebrew.year - positiveModulo(hebrew.year - 1, 49);
    var yovelEndYear = yovelStartYear + 50;
    var rangeStart = findHebrewDateBoundary(yovelStartYear, 1, requestedStart, -1, timeZone);
    var rangeEnd = findHebrewDateBoundary(yovelEndYear, 1, requestedStart, 1, timeZone);
    var yovelCycle = Math.floor((yovelStartYear - 1) / 49) + 1;
    var yovelFiftiethYear = yovelEndYear - 1;

    return {
      start: rangeStart,
      end: rangeEnd,
      label: t("yovelRange", {
        cycle: state.language === "he" ? hebrewNumber(yovelCycle) : yovelCycle,
        start: yovelStartYear,
        end: yovelFiftiethYear,
        fiftieth: yovelFiftiethYear
      })
    };
  }

  function getShmitaRange(requestedStart, timeZone) {
    var hebrew = getHebrewDateForDate(requestedStart, timeZone);
    var shmitaStartYear = hebrew.year - positiveModulo(hebrew.year - 1, 7);
    var shmitaEndYear = shmitaStartYear + 7;
    var rangeStart = findHebrewDateBoundary(shmitaStartYear, 1, requestedStart, -1, timeZone);
    var rangeEnd = findHebrewDateBoundary(shmitaEndYear, 1, requestedStart, 1, timeZone);
    var yovelStartYear = shmitaStartYear - positiveModulo(shmitaStartYear - 1, 49);
    var yovelCycle = Math.floor((yovelStartYear - 1) / 49) + 1;
    var weekInYovel = Math.floor((shmitaStartYear - yovelStartYear) / 7) + 1;

    return {
      start: rangeStart,
      end: rangeEnd,
      label: t("shmitaRange", {
        week: state.language === "he" ? hebrewWeekLetter(weekInYovel) : weekInYovel,
        cycle: state.language === "he" ? hebrewNumber(yovelCycle) : yovelCycle,
        start: shmitaStartYear,
        end: shmitaEndYear - 1
      })
    };
  }

  function findHebrewDateBoundary(hebrewYear, hebrewMonth, anchorDate, direction, timeZone) {
    var cursor = getEstimatedHebrewYearBoundarySearchStart(hebrewYear, hebrewMonth, anchorDate, direction);
    var maxDays = 80;
    var step = hebrewMonth === 1 ? 1 : direction;

    for (var day = 0; day < maxDays; day += 1) {
      var hebrew = getHebrewDateForDate(cursor, timeZone);
      if (hebrew.year === hebrewYear && hebrew.month === hebrewMonth && hebrew.date === 1) {
        return cursor;
      }

      cursor = addDays(cursor, step);
    }

    return direction < 0 ? addMonths(anchorDate, -588) : addMonths(anchorDate, 588);
  }

  function getEstimatedHebrewYearBoundarySearchStart(hebrewYear, hebrewMonth, anchorDate, direction) {
    if (hebrewMonth === 1) {
      return new Date(Date.UTC(hebrewYear - 3761, 8, 1, 0, 0, 0));
    }

    return new Date(anchorDate.getTime());
  }

  function getHebrewDateForDate(date, timeZone) {
    var parts = window.NeedMeItAdapter.getZonedParts(date, timeZone);
    if (typeof window.hebrewDate === "function") {
      return window.hebrewDate(parts.year, parts.month, parts.day, "English");
    }

    var info = window.NeedMeItAdapter.computeItTimeInfo({ date: date, timeZone: timeZone });
    return {
      year: info.hebrew.year,
      month: info.hebrew.month,
      date: info.hebrew.day
    };
  }

  function buildSchedule(options) {
    if (getSchedulingMode(options.product) === "period-start") {
      return buildPeriodStartSchedule(options);
    }

    if (getSchedulingMode(options.product) === "temporary-clock") {
      return buildTemporaryClockSchedule(options);
    }

    var cursor = new Date(options.start.getTime());
    var slots = [];

    while (cursor < options.end) {
      var info = window.NeedMeItAdapter.computeItTimeInfo({
        date: cursor,
        timeZone: options.timeZone
      });

      var allowedHour = isAllowedHour(options.product, info);
      var allowedDay = isAllowedDay(options.product, info);
      var allowedPeriod = isAllowedActivationSignal(options.product, info.period);
      var allowedTemporaryClock = isAllowedTemporaryClock(options.product, info);
      var confident = info.confidence >= options.product.minConfidence;

      if (allowedHour && allowedDay && allowedPeriod && allowedTemporaryClock && confident) {
        var slot = toSlot(options.product, cursor, options.timeZone, options.durationMinutes, info, options);
        if (slot.relevance !== "none") {
          slots.push(slot);
        }
      }

      cursor = addMinutes(cursor, 60);
    }

    return mergeConsecutiveSlots(slots);
  }

  function buildPeriodStartSchedule(options) {
    var molads = getCachedMoladStartsBetween(options.start, options.end, options.timeZone);
    var slots = [];

    molads.forEach(function (molad) {
      var info = molad.info;

      if (!isAllowedActivationSignal(options.product, info.period) || info.confidence < options.product.minConfidence) {
        return;
      }

      var slot = toSlot(options.product, molad.date, options.timeZone, options.durationMinutes, info, options);
      if (slot.relevance !== "none") {
        slots.push(slot);
      }
    });

    return selectPeriodStartSlots(slots);
  }

  function buildTemporaryClockSchedule(options) {
    var reference = options.product.temporaryClock || TEMPORARY_CLOCK_REFERENCE;
    var molads = getCachedMoladStartsBetween(options.start, options.end, options.timeZone);
    var slots = [];

    molads.forEach(function (molad) {
      var info = molad.info;

      if (isAllowedTemporaryClock(options.product, info) && info.confidence >= options.product.minConfidence) {
        options.diagnostics.candidateCount += 1;
        var slot = toSlot(options.product, molad.date, options.timeZone, options.durationMinutes, info, options);
        if (slot.relevance !== "none") {
          slots.push(slot);
        } else {
          options.diagnostics.filteredByWorkHours += 1;
        }
      }
    });

    return mergeConsecutiveSlots(slots);
  }

  function getCachedMoladStartsBetween(start, end, timeZone) {
    var cacheKey = [start.getTime(), end.getTime(), timeZone].join("|");

    if (!moladRangeCache[cacheKey]) {
      moladRangeCache[cacheKey] = window.NeedMeItAdapter.getMoladStartsBetween(start, end, timeZone);
    }

    return moladRangeCache[cacheKey];
  }

  function getFirstTemporaryClockDate(start, timeZone, reference) {
    var parts = window.NeedMeItAdapter.getZonedParts(start, timeZone);
    var dateKey = [
      String(parts.year).padStart(4, "0"),
      String(parts.month).padStart(2, "0"),
      String(parts.day).padStart(2, "0")
    ].join("-");
    var civilTarget = getCivilClockFromHebrewClock(reference);
    var candidate = zonedLocalToUtc(dateKey, String(civilTarget.hour).padStart(2, "0") + ":00", timeZone);

    while (candidate < start || !isMatchingTemporaryClockDate(candidate, timeZone, reference)) {
      candidate = moveTemporaryClockDate(candidate, timeZone, reference, 1);
    }

    return candidate;
  }

  function moveTemporaryClockDate(date, timeZone, reference, days) {
    var parts = window.NeedMeItAdapter.getZonedParts(date, timeZone);
    var dateKey = [
      String(parts.year).padStart(4, "0"),
      String(parts.month).padStart(2, "0"),
      String(parts.day).padStart(2, "0")
    ].join("-");
    var nextDateKey = addDaysToDateKey(dateKey, days);
    var civilTarget = getCivilClockFromHebrewClock(reference);

    return zonedLocalToUtc(nextDateKey, String(civilTarget.hour).padStart(2, "0") + ":00", timeZone);
  }

  function toSlot(product, start, timeZone, durationMinutes, info, options) {
    var window = getAdvertisingWindow(product, start, timeZone, durationMinutes, info, options);
    var relevance = window.periodStartOnly
      ? { type: "period-start-only" }
      : getWorkWindowRelevance(window, timeZone, options.workStart, options.workEnd);

    return {
      productId: product.id,
      productLabel: getProductLabel(product),
      startEpoch: window.start.getTime(),
      endEpoch: window.end.getTime(),
      startDateTime: toCalendarDateTime(window.start, timeZone),
      endDateTime: toCalendarDateTime(window.end, timeZone),
      timeZone: timeZone,
      durationMinutes: Math.round((window.end.getTime() - window.start.getTime()) / 60000),
      it: info,
      slotCount: 1,
      schedulingMode: getSchedulingMode(product),
      period: info.period,
      relevance: relevance.type,
      overlapStartDateTime: relevance.overlapStart ? toCalendarDateTime(relevance.overlapStart, timeZone) : "",
      overlapEndDateTime: relevance.overlapEnd ? toCalendarDateTime(relevance.overlapEnd, timeZone) : "",
      windowKind: window.kind,
      anchorSource: window.anchorSource || "",
      periodStartOnly: Boolean(window.periodStartOnly),
      region: options.region || "",
      audience: options.audience || "",
      temporaryClock: getTemporaryClockReference(product),
      reminders: REMINDER_MINUTES.slice()
    };
  }

  function getAdvertisingWindow(product, moladDate, timeZone, durationMinutes, info, options) {
    if (getSchedulingMode(product) === "temporary-clock") {
      if (options.periodStartOnly) {
        return {
          start: moladDate,
          end: addMinutes(moladDate, durationMinutes),
          kind: "temporary-clock",
          anchorSource: "molad",
          periodStartOnly: true
        };
      }

      return {
        start: moladDate,
        end: addMinutes(moladDate, durationMinutes),
        kind: "temporary-clock"
      };
    }

    if (getSchedulingMode(product) !== "period-start") {
      return {
        start: moladDate,
        end: addMinutes(moladDate, durationMinutes),
        kind: "hourly"
      };
    }

    if (options.periodStartOnly) {
      return {
        start: moladDate,
        end: addMinutes(moladDate, durationMinutes),
        kind: "period-start-only",
        userTimeZone: timeZone,
        anchorSource: "molad",
        periodStartOnly: true
      };
    }

    return getMoladAdvertisingWindow(moladDate, timeZone, info.period, options.clockModel);
  }

  function getMoladAdvertisingWindow(moladDate, userTimeZone, period, clockModel) {
    var kind = getMoladWindowKind(period);
    var anchors = getJerusalemAnchorsForWindow(moladDate, clockModel);
    var range = getAnchorRange(kind, anchors);

    return {
      start: range.start,
      end: range.end,
      kind: kind,
      userTimeZone: userTimeZone,
      anchorSource: anchors.source
    };
  }

  function getJerusalemAnchorsForWindow(date, clockModel) {
    if (window.NeedMeCommercialTime && typeof window.NeedMeCommercialTime.getJerusalemAnchors === "function") {
      return window.NeedMeCommercialTime.getJerusalemAnchors(date, clockModel || "sun");
    }

    throw new Error("Need-Me commercial time anchors are not loaded");
  }

  function getSelectedClockModel() {
    var region = regionInput.value;

    if (region === "south-america" || region === "australia" || region === "italy" || region === "italy-australia") {
      return "sun";
    }

    if (region === "europe" || region === "africa") {
      return "moon";
    }

    if (isAudienceSpecificRegion(region)) {
      return audienceInput.value === "girls" ? "moon" : "sun";
    }

    return "sun";
  }

  function isAudienceSpecificRegion(region) {
    return region === "middle-east" || region === "ireland";
  }

  function getAnchorRange(kind, anchors) {
    if (kind === "tishrei") {
      return { start: anchors.noon, end: anchors.sunset };
    }

    if (kind === "yovel") {
      return { start: anchors.sunset, end: anchors.midnight };
    }

    if (kind === "nissan") {
      return { start: anchors.midnight, end: addDays(anchors.sunrise, anchors.sunrise < anchors.midnight ? 1 : 0) };
    }

    return { start: anchors.sunrise, end: anchors.noon };
  }

  function getMoladWindowKind(period) {
    if (period && period.type === "tishrei" && period.yovel && period.yovel.isYovelStart) {
      return "yovel";
    }

    if (period && period.type === "tishrei") {
      return "tishrei";
    }

    if (period && period.type === "nissan") {
      return "nissan";
    }

    return "month";
  }

  function getWorkWindowRelevance(slotWindow, timeZone, workStart, workEnd) {
    return getOverlapRelevance(slotWindow.start, slotWindow.end, timeZone, workStart, workEnd);
  }

  function getOverlapRelevance(start, end, timeZone, workStart, workEnd) {
    var localStart = window.NeedMeItAdapter.getZonedParts(start, timeZone);
    var dateKey = [
      localStart.year,
      String(localStart.month).padStart(2, "0"),
      String(localStart.day).padStart(2, "0")
    ].join("-");
    var workWindowStart = zonedLocalToUtc(dateKey, workStart, timeZone);
    var workWindowEnd = zonedLocalToUtc(dateKey, workEnd, timeZone);

    if (workWindowEnd <= workWindowStart) {
      workWindowEnd = addDays(workWindowEnd, 1);
    }

    var overlapStart = new Date(Math.max(start.getTime(), workWindowStart.getTime()));
    var overlapEnd = new Date(Math.min(end.getTime(), workWindowEnd.getTime()));

    if (overlapEnd <= overlapStart) {
      return { type: "none" };
    }

    if (overlapStart.getTime() === start.getTime() && overlapEnd.getTime() === end.getTime()) {
      return { type: "full", overlapStart: overlapStart, overlapEnd: overlapEnd };
    }

    return { type: "partial", overlapStart: overlapStart, overlapEnd: overlapEnd };
  }

  function isAllowedActivationSignal(product, period) {
    if (getSchedulingMode(product) !== "period-start") {
      return true;
    }

    if (!period || !period.isStart) {
      return false;
    }

    if (hasMoladSignatureRules(product)) {
      return isAllowedMoladSignature(product, period);
    }

    if (!product.allowedTimeTags || !product.allowedTimeTags.length) {
      return true;
    }

    var allowedTag = period.tags && period.tags.some(function (tag) {
      return product.allowedTimeTags.indexOf(tag) !== -1;
    });

    return allowedTag;
  }

  function hasMoladSignatureRules(product) {
    return Boolean((product.allowedMoladJewishDays && product.allowedMoladJewishDays.length) ||
      (product.allowedMoladPlanets && product.allowedMoladPlanets.length));
  }

  function isAllowedMoladSignature(product, period) {
    var allowedDays = product.allowedMoladJewishDays || [];
    var allowedPlanets = product.allowedMoladPlanets || [];

    if (!allowedDays.length && !allowedPlanets.length) {
      return true;
    }

    if (!period || !period.molad) {
      return false;
    }

    if (allowedDays.indexOf(period.molad.jewishDay) !== -1) {
      return true;
    }

    return allowedPlanets.indexOf(getMoladPlanet(period.molad)) !== -1;
  }

  function getMoladPlanet(molad) {
    var planetsByDay = {
      1: "sun",
      2: "moon",
      3: "mars",
      4: "mercury",
      5: "jupiter",
      6: "venus",
      7: "saturn"
    };

    return planetsByDay[molad.jewishDay] || "";
  }

  function isAllowedTemporaryClock(product, info) {
    if (getSchedulingMode(product) !== "temporary-clock") {
      return true;
    }

    var reference = product.temporaryClock || TEMPORARY_CLOCK_REFERENCE;
    var molad = info.period && info.period.molad;

    if (!molad) {
      return false;
    }

    var allowedParts = reference.dayParts || ["day", "night"];
    var allowedHours = reference.moladHours && reference.moladHours.length
      ? reference.moladHours
      : [reference.moladHour || reference.hebrewHour];
    var allowedDays = reference.hebrewDay ? [Number(reference.hebrewDay)] : [];

    return allowedHours.map(Number).indexOf(Number(molad.jewishHourOrdinal)) !== -1 &&
      (!allowedDays.length || allowedDays.indexOf(Number(molad.jewishDay)) !== -1) &&
      allowedParts.indexOf(molad.jewishDayPart) !== -1;
  }

  function getTemporaryClockSignature(info) {
    return getHebrewClockSignatureFromZonedParts(info.gregorian);
  }

  function getTemporaryClockSignatureFromDate(date, timeZone) {
    var parts = window.NeedMeItAdapter.getZonedParts(date, timeZone);
    return getHebrewClockSignatureFromZonedParts(parts);
  }

  function getHebrewClockSignatureFromZonedParts(parts) {
    var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekdayName);
    var hebrewDay = weekday + 1;

    if (parts.hour >= 18) {
      hebrewDay = positiveModulo(hebrewDay, 7) + 1;
    }

    return {
      hebrewDay: hebrewDay,
      hebrewHour: positiveModulo(parts.hour + 6, 24) + 1
    };
  }

  function getCivilClockFromHebrewClock(reference) {
    var hebrewHour = positiveModulo(Number(reference.hebrewHour) - 1, 24);

    return {
      hour: positiveModulo(hebrewHour + 18, 24)
    };
  }

  function isMatchingTemporaryClockDate(date, timeZone, reference) {
    var signature = getTemporaryClockSignatureFromDate(date, timeZone);
    return signature.hebrewDay === Number(reference.hebrewDay) &&
      signature.hebrewHour === Number(reference.hebrewHour);
  }

  function isAllowedHour(product, info) {
    if (getSchedulingMode(product) === "period-start" || getSchedulingMode(product) === "temporary-clock") {
      return true;
    }

    return product.allowedHebrewHours.indexOf(info.hebrewHour) !== -1;
  }

  function isAllowedDay(product, info) {
    if (getSchedulingMode(product) === "period-start" || getSchedulingMode(product) === "temporary-clock") {
      return true;
    }

    return product.allowedWeekdays.indexOf(info.weekday) !== -1;
  }

  function getSchedulingMode(product) {
    return product.schedulingMode || "hourly";
  }

  function selectPeriodStartSlots(slots) {
    var selectedByPeriod = {};

    slots.forEach(function (slot) {
      var period = slot.period || { key: "unknown" };

      if (period.isStart && (!selectedByPeriod[period.key] || isBetterPeriodStart(slot, selectedByPeriod[period.key]))) {
        selectedByPeriod[period.key] = clonePeriodStartSlot(slot);
      }
    });

    return Object.keys(selectedByPeriod).sort().map(function (periodKey) {
      return selectedByPeriod[periodKey];
    });
  }

  function isBetterPeriodStart(candidate, current) {
    if (candidate.period && candidate.period.isStart && !(current.period && current.period.isStart)) {
      return true;
    }

    if (!(candidate.period && candidate.period.isStart) && current.period && current.period.isStart) {
      return false;
    }

    return candidate.startEpoch < current.startEpoch;
  }

  function clonePeriodStartSlot(slot) {
    var cloned = cloneSlot(slot);
    cloned.slotCount = 1;
    cloned.durationMinutes = slot.durationMinutes;
    return cloned;
  }

  function mergeConsecutiveSlots(slots) {
    if (!slots.length) {
      return [];
    }

    return slots.reduce(function (merged, slot) {
      var previous = merged[merged.length - 1];

      if (previous && canMergeSlots(previous, slot)) {
        previous.endEpoch = slot.endEpoch;
        previous.endDateTime = slot.endDateTime;
        previous.durationMinutes += slot.durationMinutes;
        previous.slotCount += 1;
        previous.it = {
          source: previous.it.source,
          gregorian: previous.it.gregorian,
          weekday: previous.it.weekday,
          hebrewHour: previous.it.hebrewHour,
          timeCode: previous.it.timeCode + "-" + slot.it.timeCode,
          confidence: Math.min(previous.it.confidence, slot.it.confidence)
        };
        return merged;
      }

      merged.push(cloneSlot(slot));
      return merged;
    }, []);
  }

  function canMergeSlots(previous, slot) {
    return previous.productId === slot.productId &&
      previous.timeZone === slot.timeZone &&
      previous.endEpoch === slot.startEpoch;
  }

  function cloneSlot(slot) {
    return {
      productId: slot.productId,
      productLabel: slot.productLabel,
      startEpoch: slot.startEpoch,
      endEpoch: slot.endEpoch,
      startDateTime: slot.startDateTime,
      endDateTime: slot.endDateTime,
      timeZone: slot.timeZone,
      durationMinutes: slot.durationMinutes,
      it: slot.it,
      slotCount: slot.slotCount,
      schedulingMode: slot.schedulingMode,
      period: slot.period,
      relevance: slot.relevance,
      overlapStartDateTime: slot.overlapStartDateTime,
      overlapEndDateTime: slot.overlapEndDateTime,
      windowKind: slot.windowKind,
      anchorSource: slot.anchorSource,
      periodStartOnly: slot.periodStartOnly,
      region: slot.region,
      audience: slot.audience,
      temporaryClock: slot.temporaryClock,
      reminders: slot.reminders.slice()
    };
  }

  function toCalendarDateTime(date, timeZone) {
    var parts = window.NeedMeItAdapter.getZonedParts(date, timeZone);
    return [
      String(parts.year).padStart(4, "0"),
      "-",
      String(parts.month).padStart(2, "0"),
      "-",
      String(parts.day).padStart(2, "0"),
      "T",
      String(parts.hour).padStart(2, "0"),
      ":",
      String(parts.minute).padStart(2, "0"),
      ":00"
    ].join("");
  }

  function renderResults(message) {
    slotCount.textContent = String(state.slots.length);
    rangeText.textContent = state.rangeLabel || "-";
    resultsList.innerHTML = "";

    if (message) {
      appendMessage(message, "slot-warning");
      return;
    }

    if (!state.slots.length) {
      if (state.diagnostics && state.diagnostics.filteredByWorkHours > 0) {
        appendMessage(t("signaturesOutsideWorkHours", { count: state.diagnostics.filteredByWorkHours }), "slot-warning");
        return;
      }

      appendMessage(t("noSlots"), "slot-warning");
      return;
    }

    state.slots.slice(0, MAX_RENDERED_RESULTS).forEach(function (slot) {
      var item = document.createElement("li");
      item.className = "result-item";
      item.innerHTML =
        "<span class=\"slot-time\">" + escapeHtml(formatSlotTime(slot)) + "</span>" +
        "<span class=\"slot-detail\">" + escapeHtml(formatSlotDetail(slot)) + "</span>" +
        "<span class=\"slot-ok\">" + escapeHtml(formatRelevance(slot)) + "</span>";
      resultsList.appendChild(item);
    });

    if (state.slots.length > MAX_RENDERED_RESULTS) {
      appendMessage(t("renderedLimit", { shown: MAX_RENDERED_RESULTS, total: state.slots.length }), "slot-detail");
    }
  }

  function appendMessage(text, className) {
    var item = document.createElement("li");
    item.className = "result-item";
    item.innerHTML = "<span class=\"" + className + "\">" + escapeHtml(text) + "</span>";
    resultsList.appendChild(item);
  }

  function formatSlotTime(slot) {
    if (slot.periodStartOnly) {
      return t("periodStartTime", { time: slot.startDateTime.replace("T", " ") });
    }

    return t("periodTime", { start: slot.startDateTime.replace("T", " "), end: slot.endDateTime.slice(11, 16) });
  }

  function formatSlotDetail(slot) {
    var parts = [getSlotProductLabel(slot), slot.timeZone];
    if (slot.schedulingMode === "temporary-clock") {
      parts.push(formatTemporaryClock(slot.temporaryClock));
      parts.push(formatMolad(slot.period));
      parts.push(formatRoshChodesh(slot.period));
      var temporarySourceMaterial = formatSourceMaterial(slot.productId);
      if (temporarySourceMaterial) {
        parts.push(temporarySourceMaterial);
      }
      parts.push(formatWindowKind(slot.windowKind));
      parts.push(formatAudienceContext(slot.region, slot.audience));
      return parts.join(" · ");
    }

    if (slot.schedulingMode === "period-start") {
      parts.push(formatPeriodContext(slot.period));
      parts.push(formatMolad(slot.period));
      parts.push(formatRoshChodesh(slot.period));
      var sourceMaterial = formatSourceMaterial(slot.productId);
      if (sourceMaterial) {
        parts.push(sourceMaterial);
      }
      parts.push(formatWindowKind(slot.windowKind));
      parts.push(formatAnchorSource(slot.anchorSource));
      parts.push(formatAudienceContext(slot.region, slot.audience));
      parts.push(formatTemporaryClock(slot.temporaryClock));
      parts.push(formatTimeTags(slot.period));
      parts.push(t("entryPoint"));
      return parts.join(" · ");
    }

    if (slot.slotCount > 1) {
      parts.push(t("consecutiveHours", { count: slot.slotCount }));
    }
    return parts.join(" · ");
  }

  function formatRelevance(slot) {
    if (slot.periodStartOnly) {
      return t("relevancePeriodStart");
    }

    if (slot.relevance === "full") {
      return t("relevanceFull");
    }

    if (slot.relevance === "partial") {
      return t("relevancePartial", { start: slot.overlapStartDateTime.slice(11, 16), end: slot.overlapEndDateTime.slice(11, 16) });
    }

    return t("relevanceNo");
  }

  function formatWindowKind(kind) {
    var names = state.language === "en" ? {
      month: "Monthly molad: sunrise to noon",
      tishrei: "Tishrei molad window: noon to sunset",
      yovel: "Jubilee Tishrei molad window: sunset to midnight",
      nissan: "Nissan molad: midnight to sunrise",
      "period-start-only": "Period start only",
      "temporary-clock": "Temporary-clock window",
      hourly: "Hourly window"
    } : {
      month: "מולד חודש: זריחה עד חצות",
      tishrei: "חלון מולד תשרי: חצות עד שקיעה",
      yovel: "חלון מולד תשרי של יובל: שקיעה עד חצות לילה",
      nissan: "מולד ניסן: חצות לילה עד זריחה",
      "period-start-only": "תחילת תקופה בלבד",
      "temporary-clock": "חלון שעון זמני",
      hourly: "חלון שעתי"
    };
    return names[kind] || (state.language === "en" ? "Sales window" : "חלון מכירה");
  }

  function formatAnchorSource(source) {
    if (source === "molad") {
      return state.language === "en" ? "Molad point" : "נקודת המולד";
    }

    if (source === "moon") {
      return state.language === "en" ? "Jerusalem moon clock" : "שעון לבנה ירושלים";
    }

    if (source === "sun") {
      return state.language === "en" ? "Jerusalem sun clock" : "שעון חמה ירושלים";
    }

    return state.language === "en" ? "Jerusalem clock" : "שעון ירושלים";
  }

  function formatAudienceContext(region, audience) {
    if (isAudienceSpecificRegion(region)) {
      if (state.language === "en") {
        return audience === "girls" ? "Audience: girls" : "Audience: boys";
      }

      return audience === "girls" ? "קהל: בנות" : "קהל: בנים";
    }

    return formatRegion(region);
  }

  function getTemporaryClockReference(product) {
    var productReference = product && product.temporaryClock ? product.temporaryClock : {};
    var reference = {
      moladHour: productReference.moladHour || productReference.hebrewHour || TEMPORARY_CLOCK_REFERENCE.moladHour,
      hebrewDay: productReference.hebrewDay,
      moladHours: productReference.moladHours,
      dayParts: productReference.dayParts || TEMPORARY_CLOCK_REFERENCE.dayParts,
      tractate: productReference.tractate || TEMPORARY_CLOCK_REFERENCE.tractate,
      chapter: productReference.chapter || "",
      book: productReference.book || "",
      parasha: productReference.parasha || ""
    };

    return reference;
  }

  function formatTemporaryClock(reference) {
    if (!reference) {
      return state.language === "en" ? "Temporary clock" : "שעון זמני";
    }

    var hours = reference.moladHours && reference.moladHours.length
      ? reference.moladHours.join(", ")
      : (reference.moladHour || reference.hebrewHour);
    var parts = [
      state.language === "en" ? "Temporary clock" : "שעון זמני",
      (state.language === "en" ? "molad hour " : "מולד שעה ") + hours,
      formatTemporaryClockDayParts(reference.dayParts),
      formatSourceName(reference.tractate)
    ];

    if (reference.chapter) {
      parts.push(formatSourceName(reference.chapter));
    }

    if (reference.book) {
      parts.push(formatSourceName(reference.book));
    }

    if (reference.parasha) {
      parts.push(formatSourceName(reference.parasha));
    }

    if (reference.hebrewDay) {
      parts.splice(2, 0, (state.language === "en" ? "day " : "יום ") + getHebrewDayName(reference.hebrewDay));
    }

    return parts.join(" / ");
  }

  function formatTemporaryClockDayParts(dayParts) {
    var parts = dayParts || ["day", "night"];

    if (parts.length === 1 && parts[0] === "night") {
      return state.language === "en" ? "night" : "לילה";
    }

    if (parts.length === 1 && parts[0] === "day") {
      return state.language === "en" ? "day" : "יום";
    }

    return state.language === "en" ? "day or night" : "יום או לילה";
  }

  function getHebrewDayName(day) {
    var names = state.language === "en" ? {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Shabbat"
    } : {
      1: "ראשון",
      2: "שני",
      3: "שלישי",
      4: "רביעי",
      5: "חמישי",
      6: "שישי",
      7: "שבת"
    };

    return names[day] || String(day);
  }

  function formatRegion(region) {
    var names = state.language === "en" ? {
      "north-america": "North America - sun clock",
      asia: "Asia - sun clock",
      europe: "Europe - moon clock",
      "south-america": "South America - sun clock",
      australia: "Australia - sun clock",
      italy: "Italy - sun clock",
      "italy-australia": "Italy - sun clock",
      africa: "Africa - moon clock",
      "middle-east": "Middle East - sun and moon clocks",
      ireland: "Ireland - sun and moon clocks"
    } : {
      "north-america": "צפון אמריקה - שעון חמה",
      asia: "אסיה - שעון חמה",
      europe: "אירופה - שעון לבנה",
      "south-america": "דרום אמריקה - שעון חמה",
      australia: "אוסטרליה - שעון חמה",
      italy: "איטליה - שעון חמה",
      "italy-australia": "איטליה - שעון חמה",
      africa: "אפריקה - שעון לבנה",
      "middle-east": "המזרח התיכון - שעון חמה ולבנה",
      ireland: "אירלנד - שעון חמה ולבנה"
    };

    return names[region] || (state.language === "en" ? "Region" : "אזור");
  }

  function formatPeriod(period) {
    if (!period) {
      return state.language === "en" ? "period" : "תקופה";
    }

    var names = state.language === "en" ? {
      nissan: "Nissan",
      tishrei: "Tishrei",
      regularMonth: "regular month"
    } : {
      nissan: "ניסן",
      tishrei: "תשרי",
      regularMonth: "חודש רגיל"
    };
    return names[period.type] || period.type || (state.language === "en" ? "period" : "תקופה");
  }

  function formatPeriodContext(period) {
    if (!period) {
      return state.language === "en" ? "monthly advertising" : "פרסום חודשי";
    }

    if (period.type === "tishrei" && period.yovel && period.yovel.isYovelStart) {
      return state.language === "en" ? "Tishrei molad of Jubilee " + period.yovel.cycle : "מולד תשרי של יובל " + period.yovel.cycle;
    }

    if (period.type === "tishrei") {
      return state.language === "en" ? "Annual molad: Tishrei" : "מולד שנתי: תשרי";
    }

    if (period.type === "nissan") {
      return state.language === "en" ? "Nissan molad" : "מולד ניסן";
    }

    return state.language === "en" ? "Monthly molad" : "מולד חודשי";
  }

  function formatMolad(period) {
    if (!period || !period.molad) {
      return state.language === "en" ? "molad" : "מולד";
    }

    if (state.language === "en") {
      var englishPartName = period.molad.jewishDayPart === "night" ? "night" : "day";
      return "Molad: hour " + period.molad.jewishHourOrdinal + " of " + englishPartName + " " + translateJewishDayName(period.molad.jewishDayName);
    }

    var partName = period.molad.jewishDayPart === "night" ? "ליל" : "יום";
    return "מולד: שעה " + numberToHebrewOrdinal(period.molad.jewishHourOrdinal) + " של " + partName + " " + period.molad.jewishDayName;
  }

  function formatRoshChodesh(period) {
    if (!period || !period.hebrewMonth) {
      return state.language === "en" ? "Rosh Chodesh" : "ראש חודש";
    }

    var monthName = formatHebrewMonthName(period.hebrewMonth);
    var year = period.hebrewYear ? " " + (state.language === "en" ? period.hebrewYear : formatHebrewYear(period.hebrewYear)) : "";

    return (state.language === "en" ? "Rosh Chodesh " : "ראש חודש ") + monthName + year;
  }

  function formatHebrewMonthName(monthName) {
    var names = state.language === "en" ? {
      tishri: "Tishrei",
      tishrei: "Tishrei",
      heshvan: "Cheshvan",
      cheshvan: "Cheshvan",
      kislev: "Kislev",
      tevet: "Tevet",
      shevat: "Shevat",
      adar: "Adar",
      adari: "Adar I",
      adar1: "Adar I",
      adarii: "Adar II",
      adar2: "Adar II",
      nisan: "Nissan",
      nissan: "Nissan",
      iyyar: "Iyar",
      iyar: "Iyar",
      sivan: "Sivan",
      tammuz: "Tammuz",
      tamuz: "Tammuz",
      av: "Av",
      elul: "Elul"
    } : {
      tishri: "תשרי",
      tishrei: "תשרי",
      heshvan: "חשוון",
      cheshvan: "חשוון",
      kislev: "כסלו",
      tevet: "טבת",
      shevat: "שבט",
      adar: "אדר",
      adari: "אדר א'",
      adar1: "אדר א'",
      adarii: "אדר ב'",
      adar2: "אדר ב'",
      nisan: "ניסן",
      nissan: "ניסן",
      iyyar: "אייר",
      iyar: "אייר",
      sivan: "סיון",
      tammuz: "תמוז",
      tamuz: "תמוז",
      av: "אב",
      elul: "אלול"
    };
    var key = String(monthName || "").toLowerCase().replace(/\s+/g, "");

    return names[key] || monthName;
  }

  function formatHebrewYear(year) {
    var shortYear = positiveModulo(Number(year), 1000);
    return "ה'" + hebrewNumber(shortYear);
  }

  function formatSourceMaterial(productId) {
    var product = window.NeedMeProducts.find(function (item) {
      return item.id === productId;
    });

    if (!product) {
      return "";
    }

    var sourceMaterial = getSourceMaterial(product);

    if (!sourceMaterial) {
      return "";
    }

    return t("source", { source: sourceMaterial });
  }

  function getSourceMaterial(product) {
    var temporaryClockSource = getTemporaryClockSourceMaterial(product);

    if (temporaryClockSource) {
      return temporaryClockSource;
    }

    if (state.language === "en" && product.sourceMaterialEn) {
      return product.sourceMaterialEn;
    }

    return product.sourceMaterial;
  }

  function getTemporaryClockSourceMaterial(product) {
    var reference = product && product.temporaryClock;

    if (!reference) {
      return "";
    }

    return ["tractate", "chapter", "book", "parasha"].map(function (key) {
      return reference[key] ? formatSourceName(reference[key]) : "";
    }).filter(Boolean).join(", ");
  }

  function formatSourceName(value) {
    if (state.language !== "en") {
      return value;
    }

    var names = {
      "מסכת ראש השנה": "Tractate Rosh Hashanah",
      "מסכת גיטין": "Tractate Gittin",
      "מסכת שבת": "Tractate Shabbat",
      "פרק ראשון": "Chapter One",
      "מסכת נגעים": "Tractate Negaim",
      "ספר משלי": "Book of Proverbs",
      "פרשת לך לך": "Parashat Lech Lecha",
      "מסכת אבות": "Tractate Avot",
      "ספר מלכים": "Book of Kings",
      "פרשת מטות": "Parashat Matot"
    };

    return names[value] || value;
  }

  function translateJewishDayName(value) {
    var names = {
      "ראשון": "Sunday",
      "שני": "Monday",
      "שלישי": "Tuesday",
      "רביעי": "Wednesday",
      "חמישי": "Thursday",
      "שישי": "Friday",
      "שבת": "Shabbat"
    };

    return names[value] || value;
  }

  function numberToHebrewOrdinal(value) {
    var names = {
      1: "ראשונה",
      2: "שניה",
      3: "שלישית",
      4: "רביעית",
      5: "חמישית",
      6: "שישית",
      7: "שביעית",
      8: "שמינית",
      9: "תשיעית",
      10: "עשירית",
      11: "אחת עשרה",
      12: "שתים עשרה",
      13: "שלוש עשרה",
      14: "ארבע עשרה",
      15: "חמש עשרה",
      16: "שש עשרה",
      17: "שבע עשרה",
      18: "שמונה עשרה",
      19: "תשע עשרה",
      20: "עשרים",
      21: "עשרים ואחת",
      22: "עשרים ושתיים",
      23: "עשרים ושלוש",
      24: "עשרים וארבע"
    };
    return names[value] || String(value);
  }

  function formatTimeTags(period) {
    if (!period || !period.tags || !period.tags.length) {
      return state.language === "en" ? "time signature" : "חתימת זמן";
    }

    var names = state.language === "en" ? {
      "daily-routine": "routine",
      feast: "meal",
      gathering: "gathering",
      "season-start": "period opening"
    } : {
      "daily-routine": "שגרה",
      feast: "סעודה",
      gathering: "התכנסות",
      "season-start": "פתיחת תקופה"
    };

    return period.tags.map(function (tag) {
      return names[tag] || tag;
    }).join(", ");
  }

  function connectGoogle() {
    if (GOOGLE_CLIENT_ID.indexOf("PASTE_") === 0) {
      calendarStatus.textContent = t("missingClientId");
      return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      calendarStatus.textContent = t("googleLoading");
      return;
    }

    var tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: CALENDAR_SCOPE,
      callback: function (response) {
        if (response && response.access_token) {
          state.accessToken = response.access_token;
          calendarStatus.textContent = t("connected");
          refreshActions();
        }
      }
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  }

  function createCalendarEvents() {
    if (!state.accessToken || !state.slots.length) {
      refreshActions();
      return;
    }

    createCalendarButton.disabled = true;
    createCalendarButton.textContent = t("creatingEvents");

    var queue = state.slots.slice();
    var created = 0;

    runSequentially(queue, function (slot) {
      return insertCalendarEvent(slot).then(function () {
        created += 1;
        calendarStatus.textContent = t("createdEvents", { created: created, total: state.slots.length });
      });
    }).then(function () {
      calendarStatus.textContent = t("eventsCreated");
    }).catch(function () {
      calendarStatus.textContent = t("eventError");
    }).finally(function () {
      createCalendarButton.textContent = t("createCalendar");
      refreshActions();
    });
  }

  function insertCalendarEvent(slot) {
    var event = {
      summary: t("publish", { product: getSlotProductLabel(slot) }),
      description: buildEventDescription(slot),
      start: {
        dateTime: slot.startDateTime,
        timeZone: slot.timeZone
      },
      end: {
        dateTime: slot.endDateTime,
        timeZone: slot.timeZone
      },
      reminders: {
        useDefault: false,
        overrides: slot.reminders.map(function (minutes) {
          return { method: "popup", minutes: minutes };
        })
      }
    };

    return fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + state.accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Calendar insert failed");
      }
      return response.json();
    });
  }

  function buildEventDescription(slot) {
    var sourceMaterial = formatSourceMaterial(slot.productId);
    var description;

    if (slot.schedulingMode === "period-start") {
      description = t("periodDescription", {
        period: formatPeriodContext(slot.period),
        molad: formatMolad(slot.period),
        tags: formatTimeTags(slot.period)
      });
      return appendSourceToDescription(description, sourceMaterial);
    }

    description = t("eventDescription");
    return appendSourceToDescription(description, sourceMaterial);
  }

  function appendSourceToDescription(description, sourceMaterial) {
    if (!sourceMaterial) {
      return description;
    }

    return description + "\n" + sourceMaterial;
  }

  function runSequentially(items, worker) {
    return items.reduce(function (promise, item) {
      return promise.then(function () {
        return worker(item);
      });
    }, Promise.resolve());
  }

  function downloadJson() {
    var payload = JSON.stringify(state.slots, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "need-me-schedule.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function refreshActions() {
    createCalendarButton.disabled = !state.accessToken || !state.slots.length;
    downloadJsonButton.disabled = !state.slots.length;
  }

  function syncRangeControls() {
    forceCurrentYovelRange();
    var isFixedCycle = rangeModeInput.value === "shmita" || rangeModeInput.value === "yovel";
    var isDaysRange = rangeModeInput.value === "days";
    rangeModeInput.disabled = true;
    daysInput.disabled = !isDaysRange;
    monthsInput.disabled = isFixedCycle || isDaysRange;
  }

  function forceCurrentYovelRange() {
    rangeModeInput.value = "yovel";
  }

  function syncAudienceControls() {
    var needsAudience = isAudienceSpecificRegion(regionInput.value);
    audienceInput.disabled = !needsAudience;
    audienceField.classList.toggle("is-muted", !needsAudience);
  }

  function syncPeriodStartOnlyControls() {
    var hideWorkHours = periodStartOnlyInput.checked;
    workStartField.hidden = hideWorkHours;
    workEndField.hidden = hideWorkHours;
    workStartInput.required = !hideWorkHours;
    workEndInput.required = !hideWorkHours;
  }

  function startOfSelectedDate(value) {
    var parts = String(value).split("-").map(Number);
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0));
  }

  function toInputDate(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function addMonths(date, months) {
    var next = new Date(date.getTime());
    next.setUTCMonth(next.getUTCMonth() + months);
    return next;
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * 86400000);
  }

  function addDaysToDateKey(dateKey, days) {
    var parts = dateKey.split("-").map(Number);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0));
    return toInputDate(addDays(date, days));
  }

  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  function zonedLocalToUtc(dateKey, timeValue, timeZone) {
    var dateParts = dateKey.split("-").map(Number);
    var timeParts = timeValue.split(":").map(Number);
    var guess = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1] || 0, 0));

    for (var i = 0; i < 3; i += 1) {
      var zoned = window.NeedMeItAdapter.getZonedParts(guess, timeZone);
      var wantedMinutes = Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1] || 0, 0) / 60000;
      var actualMinutes = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute, 0) / 60000;
      guess = new Date(guess.getTime() + (wantedMinutes - actualMinutes) * 60000);
    }

    return guess;
  }

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function hebrewWeekLetter(value) {
    var letters = ["א", "ב", "ג", "ד", "ה", "ו", "ז"];
    return letters[value - 1] || String(value);
  }

  function hebrewNumber(value) {
    var hundreds = ["", "ק", "ר", "ש", "ת"];
    var tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
    var ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    var remaining = Number(value);
    var result = "";

    while (remaining >= 400) {
      result += "ת";
      remaining -= 400;
    }

    result += hundreds[Math.floor(remaining / 100)] || "";
    remaining %= 100;

    if (remaining === 15) {
      result += "טו";
    } else if (remaining === 16) {
      result += "טז";
    } else {
      result += tens[Math.floor(remaining / 10)] || "";
      result += ones[remaining % 10] || "";
    }

    return addHebrewNumberPunctuation(result);
  }

  function addHebrewNumberPunctuation(value) {
    if (value.length <= 1) {
      return value + "'";
    }

    return value.slice(0, -1) + "\"" + value.slice(-1);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  init();
}());

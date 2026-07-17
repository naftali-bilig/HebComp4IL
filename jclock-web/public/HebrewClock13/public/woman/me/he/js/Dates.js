//---get Date---
function set_default_date() {
    var date = getSelectedLearningDate(typeof getCurrentClockWallDate == "function" ? getCurrentClockWallDate() : new Date());

    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    month = m;
    day = d - 1;
    year = y;
    set_date_vars();
}

function set_date_vars() {
    m = month;
    d = day;
    y = year;

    var len = civMonthLength(m + 1, y);
    if (d >= len) {
        d = len - 1;
        day = d;
    }
}

function civMonthLength(month, year) {
    var fullYear = year < 1900 ? year + 1900 : year;

    if (month == 2)
        return isLeapYear(fullYear) ? 29 : 28;
    else if (month == 4 || month == 6 || month == 9 || month == 11)
        return 30;
    else
        return 31;
}

function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function getSelectedLearningDate(fallbackDate) {
    var url = new URL(document.location.href);
    var yearParam = parseInt(url.searchParams.get("year"), 10);
    var monthParam = parseInt(url.searchParams.get("month"), 10);
    var dayParam = parseInt(url.searchParams.get("day"), 10);
    var hourParam = parseInt(url.searchParams.get("hour"), 10);
    var minuteParam = parseInt(url.searchParams.get("minute") || url.searchParams.get("min"), 10);
    var secondParam = parseInt(url.searchParams.get("sec"), 10);
    var millisecondParam = parseInt(url.searchParams.get("ms"), 10);

    if (!isNaN(yearParam) && !isNaN(monthParam) && !isNaN(dayParam)) {
        return new Date(
            yearParam,
            monthParam - 1,
            dayParam,
            !isNaN(hourParam) ? hourParam : fallbackDate.getHours(),
            !isNaN(minuteParam) ? minuteParam : fallbackDate.getMinutes(),
            !isNaN(secondParam) ? secondParam : fallbackDate.getSeconds(),
            !isNaN(millisecondParam) ? millisecondParam : fallbackDate.getMilliseconds()
        );
    }

    return new Date(fallbackDate.getTime());
}

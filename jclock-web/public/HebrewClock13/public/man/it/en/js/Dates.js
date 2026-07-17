//---get Date---
function set_default_date()
{
    var date = typeof getCurrentClockDate == "function" ? getCurrentClockDate() : new Date();

    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDate() - 1;

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

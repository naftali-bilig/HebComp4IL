//---get Date---
function set_default_date() {
    var parts = typeof getClockDateParts == "function" ? getClockDateParts() : null;

    if (!parts) {
        var date = new Date();
        parts = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    month = parts.month - 1;
    day = parts.day - 1;
    year = parts.year - 1900;
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
    if (month == 2)
        return (28 + year);
    else if (month == 4 || month == 6 || month == 9 || month == 11)
        return 30;
    else
        return 31;
}

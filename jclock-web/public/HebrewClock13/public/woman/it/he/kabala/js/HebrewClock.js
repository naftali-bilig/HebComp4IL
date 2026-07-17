var isNight = false;
var preLbMin = 0;

function hebrewclock()
{
    var zmanit_hour = doit();

    var sunrise_yasterday = zmanit_hour[0];
    var sunrise = zmanit_hour[1];
    var sunrise_tommorow = zmanit_hour[2];
    var sunset_yasterday = zmanit_hour[3];
    var sunset = zmanit_hour[4];
    var sunset_tommorow = zmanit_hour[5];

    var date = typeof getCurrentClockWallDate == "function" ? getCurrentClockWallDate() : new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var milisec = date.getMilliseconds();

    var curr_hour = milisec + (s * 1000) + (m * 60 * 1000) + (h * 60 * 60 * 1000);
    curr_hour = curr_hour / (1000 * 3600);

    if (sunset == null || sunrise == null || sunrise_yasterday == null || sunrise_tommorow == null ||
        sunset_yasterday == null || sunset_tommorow == null) {
        display_time();
        return;
    }

    isNight = true;

    if (sunset > sunrise && curr_hour < sunset) {
        setClockFromOffset(curr_hour - sunrise, sunset - sunrise, 12, false);
    }
    if (sunset > sunrise && curr_hour < sunrise) {
        setClockFromOffset(curr_hour + 24 - sunset_yasterday, sunrise + 24 - sunset_yasterday, 0, true);
    }
    if (sunset > sunrise && curr_hour > sunset) {
        setClockFromOffset(curr_hour - sunset, sunrise_tommorow + 24 - sunset, 0, true);
    }
    if (sunset < sunrise && curr_hour < sunrise) {
        setClockFromOffset(curr_hour - sunset, sunrise - sunset, 0, true);
    }
    if (sunset < sunrise && curr_hour < sunset) {
        setClockFromOffset(curr_hour + 24 - sunrise_yasterday, sunset + 24 - sunrise_yasterday, 12, false);
    }
    if (sunset < sunrise && curr_hour > sunrise) {
        setClockFromOffset(curr_hour - sunrise, sunset_tommorow + 24 - sunrise, 12, false);
    }

    display_time();
    markWomanTime(isNight);

    if (lbMinute == 0) {
        doit();
    }

    if (preLbMin != lbMinute) {
        setmazal();
        commercialFunction();
        preLbMin = lbMinute;
    }
}

function setClockFromOffset(curr_hour_offset, length, hourOffset, moonSleep)
{
    var hour = Math.floor(12 * (curr_hour_offset / length));
    var minute = Math.floor(12 * 1080 * (curr_hour_offset / length)) - hour * 1080;
    var second = Math.floor(12 * 1080 * 76 * (curr_hour_offset / length)) - (hour * 1080 * 76) - (minute * 76);

    lbHour = hour + hourOffset;
    document.getElementById("Hour").value = hour;
    lbMinute = minute;
    document.getElementById("Minute").value = lbMinute;
    lbSecond = second;
    document.getElementById("Second").value = lbSecond;
    isNight = moonSleep;
}

function oTimerclock() {
    oTimer = setInterval(hebrewclock, 10);
}

function clock() {
    lbSecond++;
    if (lbSecond == 76)
    {
        lbSecond = 0;
        lbMinute++;
    }
    if (lbMinute == 1080)
    {
        lbMinute = 0;
        lbHour++;
        setmazal();
        setMasechet();
        setSefer();
        setParasha();

        clearInterval(oTimer);
        oTimerclock();
    }
    else if (lbMinute > 1079)
    {
        lbMinute -= 1080;
        lbHour++;
        setmazal();
        setMasechet();
        setSefer();
        setParasha();

        clearInterval(oTimer);
        oTimerclock();
    }

    if (lbHour == 24)
        lbHour = 0;
    else if (lbHour > 23)
        lbHour -= 24;
}

function display_time()
{
    if (lbSecond < 10)
        document.getElementById("Second").value = "0" + lbSecond;
    else
        document.getElementById("Second").value = lbSecond;

    if (lbMinute < 10)
        document.getElementById("Minute").value = "000" + lbMinute;
    else if (lbMinute < 100)
        document.getElementById("Minute").value = "00" + lbMinute;
    else if (lbMinute < 1000)
        document.getElementById("Minute").value = "0" + lbMinute;
    else
        document.getElementById("Minute").value = lbMinute;

    lbHourClock = lbHour;

    if (document.getElementById("Hour").value < 10)
        document.getElementById("Hour").value = "0" + document.getElementById("Hour").value;
    else
        document.getElementById("Hour").value = document.getElementById("Hour").value;
}

function offset()
{
    if (lbHour < 22)
       lbHourClock = lbHour + 2;
    else
       lbHourClock = lbHour + 2 - 24;
}

function markWomanTime(moonSleep)
{
    var color = moonSleep ? "#878787" : "#CA2C92";
    var clockInputs = document.getElementsByClassName("clock");
    for (var i = 0; i < clockInputs.length; i++)
        clockInputs[i].style.color = color;
}

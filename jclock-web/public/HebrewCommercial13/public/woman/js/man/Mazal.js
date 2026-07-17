//mazal of the hour
function setmazal_man() {
    var date = new Date();

    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();



    var day = date.getDay() + 1;
    var clockHour = lbHour;
    if (clockHour == 24)
        clockHour = 0;

    if ((h == sunsetH_man && m == sunsetM_man && s >= sunsetS_man) ||    // אחרי שקיעה
        (h == sunsetH_man && m > sunsetM_man) ||
        (h > sunsetH_man)
       )
        if ((h == 23 && m == 23 && s <= 59) ||    // לפני חצות
            (h == 23 && m < 59) ||
            (h < 23)
           )
            day = day + 1;


    //document.getElementById("test").value = h > sunsetH;

    if (day == 8)
        day = 1;

    hebrewday_man = day;
}
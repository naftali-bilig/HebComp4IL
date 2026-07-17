//set the latitude and longtiude minutes and time zone for calculations
function list_pos() {
    latitude = Number(latitude);
    longitude = Number(longitude);

    if (!Number.isFinite(latitude))
        latitude = 31.7768514;
    if (!Number.isFinite(longitude))
        longitude = 35.2331664;

    if (latitude > 0)
        ns = "N";
    else
        ns = "S";
    latd = Math.floor(latitude);
    latm = ((latitude - latd) * 60);
    if (longitude > 0)
        ew = "E";
    else
        ew = "W";
    lngd = Math.floor(longitude);
    lngm = ((longitude - lngd) * 60);
    var _tz = tz;


    /*if ((latd != -1) && (lngd != -1)) {*/
        tz = 12 + _tz;
        //doit();
    //}
}

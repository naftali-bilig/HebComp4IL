function showError(error) 
{
    var x;
    switch(error.code) 
    {
        case error.PERMISSION_DENIED:
            x = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x = "An unknown error occurred."
            break;
    }
    alert(x);
}

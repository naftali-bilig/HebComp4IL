function showError(error) 
{
    var x;
    switch(error.code) 
    {
        case error.PERMISSION_DENIED:
            x = "Please allow recive location. (only needed for show time based on your location)"
        break;
        case error.POSITION_UNAVAILABLE:
            x = "Open Location"
            break;
        case error.TIMEOUT:
            x = "Location request got timed out"
            break;
        case error.UNKNOWN_ERROR:
            x = "UNKNOWN_ERROR"
            break;
    }
    alert(x + "\n" + "for the meanwhile set jerusalem times");
	
	
	//var gmt = 3;
	//var date = new Date();
	//if(date > new Date("10/30/" + date.getFullYear()) || date < new Date("03/25/" + date.getFullYear()))
	//	gmt = 2;
		
	window.location.href = "./index.html?latitude=31.7768514&longitude=35.2331664";
	//window.location.href = "https://hebrewclock13.web.app/man/simple/index.html?latitude=31.656466&longitude=35.228143";//&birthGMT=" + gmt;
}

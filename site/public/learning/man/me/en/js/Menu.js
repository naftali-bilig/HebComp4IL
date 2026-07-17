/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }		
    }
}

function englishFunction(x=1)
{
    var url = new URL(document.location.href);
    var marrigeHour = url.searchParams.get("hebrewHour");
    var marrigeDay = url.searchParams.get("hebrewDay");
	var period = url.searchParams.get("period");

	var url_obj = new URL(document.location.href);
	var lon = url_obj.searchParams.get("longitude");        
	var lat = url_obj.searchParams.get("latitude");

	var religion = url_obj.searchParams.get("religion");
	var religionAndParm = "";
	var religionOnlyParm = "";
	if(!religion)
		religion = "";
	else
	{
		religionAndParm = "&religion=" + religion;
		religionOnlyParm = "?religion=" + religion;
	}

	var location = "";
	if(lon)
		var location = "&longitude=" + lon + "&latitude=" + lat; 


    if(x==1)
        if(marrigeDay)
        {
            window.location.href= "../he/index.html?hebrewDay=" + marrigeDay + "&hebrewHour=" + marrigeHour + "&period=" + period + location + religionAndParm;
        }
        else
            window.location.href= "../he/index.html?" + location + religionAndParm;

	else
		window.location.href= "../he/guide.html";
}
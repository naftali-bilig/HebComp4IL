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
	var url_obj = new URL(document.location.href);
	var lon = url_obj.searchParams.get("longitude");        
	var lat = url_obj.searchParams.get("latitude");

	var location = "";
	if(lon)
		var location = "?longitude=" + lon + "&latitude=" + lat;

	if(x==1)
		window.location.href= "../en/index.html" + location;
	else
		window.location.href= "../en/guide.html" + location;
}


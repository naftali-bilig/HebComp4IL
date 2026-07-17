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

function englishFunction()
{
	var url_obj = new URL(document.location.href);
	var lon = url_obj.searchParams.get("longitude");        
	var lat = url_obj.searchParams.get("latitude");

	var location = "";
	if(lon)
		var location = "?longitude=" + lon + "&latitude=" + lat; 

	window.location.href= "../../en/year/index.html" + location;
}
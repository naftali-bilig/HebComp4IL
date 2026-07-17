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
	if(x==1)
		window.location.href= "../../en/kabala/index.html" + getCurrentQueryString();
	else
		window.location.href= "../../en/kabala/guide.html" + getCurrentQueryString();
}

function getCurrentQueryString()
{
	var url_obj = new URL(document.location.href);
	return url_obj.search + url_obj.hash;
}

function englishScheduleFunction()
{
	window.location.href= "../../en/kabala/schedule.html" + getCurrentQueryString();
}

function englishInternalSportFunction()
{
	window.location.href= "../../en/kabala/internal_sport.html" + getCurrentQueryString();
}

function englishExternalSportFunction()
{
	window.location.href= "../../en/kabala/external_sport.html" + getCurrentQueryString();
}

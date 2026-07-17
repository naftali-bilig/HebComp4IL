const commercials = {
    Soteria: 0,
    Breslev: 1
}

var commercial = commercials.Breslev;
commercialFunction();

function commercialFunction()
{
    var randomNumber = Math.floor(Math.random() * 2);    ; // 0 or 1
    switch(randomNumber)
	{
		case 0:
            commercial = commercials.Breslev;
            break;
        case 1:
            commercial = commercials.Soteria;
            break;
	}

    commercialInitFunction();
}

function commercialInitFunction()
{
    switch(commercial)
	{
		case commercials.Soteria:
            document.getElementById("commercial").querySelector("img").setAttribute("id","Soteria");
            document.getElementById("commercial").addEventListener("click",openSoteriaInNewTab);
            break;
        case commercials.Breslev:
            document.getElementById("commercial").querySelector("img").setAttribute("id","Breslev");
            document.getElementById("commercial").addEventListener("click",openBreslevInNewTab);
            break;
	} 
}

function openSoteriaInNewTab() {
    var win = window.open("http://soteria.org.il/", '_blank');
    win.focus();
}

function openBreslevInNewTab() {
    var win = window.open("http://www.emuniyim.com/", '_blank');
    win.focus();
}
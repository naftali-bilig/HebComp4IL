const limudBooks = 
{
    MASECHET: "01",
    SEFER: "10",
    PARASHA: "11"
}

var limudBook = limudBooks.MASECHET;

// Function to populate the dropdown with options
function populateLawsDropdown(laws) {
	const lawsDropdown = document.getElementById('lawsDropdown');

	// Iterate over the laws array and create options
	laws.forEach(law => {
		const option = document.createElement('option');
		option.value = law.openLawBookUrl; // Store the URL in the option's value
		option.textContent = law.officialName; // Use the official name as the option text
		lawsDropdown.appendChild(option);
	});

	// Add an event listener to redirect to the URL when an option is selected
	lawsDropdown.addEventListener('change', function() {
		const selectedUrl = lawsDropdown.value;
		if (selectedUrl) {
			window.open(selectedUrl, '_blank'); // Open the URL in a new tab
		}
	});
}


function sederLimudIsraelLeg()
{
    // Use fetch to read the text file
    fetch('./js/SederLimud.txt')
        .then(response => response.text())
        .then(data => {
            // Split the data into lines
            const lines = data.trim().split('\n');
            
            // Iterate over each line
            lines.forEach(line => {
                // Split the line into parts: unit, official name, and URL
                const parts = line.split('\t');
                
                // Create an object with the extracted data
                const lawItem = {
                    unit: parseInt(parts[0], 10),
                    officialName: parts[1],
                    openLawBookUrl: parts[2]
                };
				
                // Add the object to the array
				if(lawItem.unit == omer)
					israelLeg.push(lawItem);
            });

            // Display the array to verify the data
            //console.log(israelLeg);
			// Call the function to populate the dropdown
			populateLawsDropdown(israelLeg);
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });	
}

function sederLimud(learningMethod)
{
	
	//sederLimudIsraelLeg();
	var url = document.location.href; 
	if(url.includes("personal"))
		learningMethod = "Dummy";

	if(url.includes("jewish") || url.includes("christian") || url.includes("islam"))
		learningMethod = "Dummy";
	//var isAlreadyLearning = url.includes("yovel") || url.includes("year") || url.includes("month") || url.includes("personal");
	//isAlreadyLearning = !isAlreadyLearning || freeLimud;
	

	var url_obj = new URL(document.location.href);
	var lon = url_obj.searchParams.get("longitude");        
	var lat = url_obj.searchParams.get("latitude");

	var period = url_obj.searchParams.get("period");
	if(!period)
		period = "";
	
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
	/*
	if(url.includes("jewish") || url.includes("cristian") || url.includes("islam"))
	{
		if(lbHour == 12)//jewish
		{
			if(!url.includes("jewish"))
				document.location.href = "../jewish/index.html";		
		}	
		if(lbHour == 13)//christian
		{
			if(!url.includes("cristian"))
				document.location.href = "../cristian/index.html";
		}
		if(lbHour == 14)//muslim
		{
			if(!url.includes("islam"))
				document.location.href = "../islam/index.html";		
		}		
	}	
	*/
    limudBook = limudBooks.MASECHET;
	var showMasechet = true;
    var showSefer = true;
    var showParasha = true;


	//var showMazal = true;
    var showMasechet = true;
    var showSefer = false;
    var showParasha = false;


	if(learningMethod == 'Automate')
	{
		if(lbHour >= 10 && lbHour < 11)
		{
			if(!url.includes("personal"))
			{
				document.location.href = "../../marrige/he/index.html" + religionOnlyParm;
			}				
		}
		else if(lbHour >= 11 && lbHour < 12)
		{
			if(!url.includes("personal"))
			{
				document.location.href = "../../marrige/he/index.html" + religionOnlyParm;
			}				
		}
		else if(lbHour >= 12 && lbHour < 13)
		{
			if(!url.includes("yovel"))
			{
				let yovelMazal = getCurrentMazal("yovel");
				document.location.href = "./index.html?period=yovel&hebrewDay=" + yovelMazal[0] + "&hebrewHour=" + yovelMazal[1] + "&hebrewChelek=" + yovelMazal[2] + location + religionAndParm;			
			}
		}
		if(lbHour >= 13 && lbHour < 14)
		{
			if(!url.includes("year"))
			{
				let yearlMazal = getCurrentMazal("year");
				document.location.href = "./index.html?period=year&hebrewDay=" + yearlMazal[0] + "&hebrewHour=" + yearlMazal[1] + "&hebrewChelek=" + yearlMazal[2] + location + religionAndParm;	
			}
		}
		if(lbHour >= 14 && lbHour < 15)
		{
			if(!url.includes("month"))
			{
				let monthMazal = getCurrentMazal("month");
				document.location.href = "./index.html?period=month&hebrewDay=" + monthMazal[0] + "&hebrewHour=" + monthMazal[1] + "&hebrewChelek=" + monthMazal[2] + location + religionAndParm;		
			}			
		}
	}
	
	if(learningMethod != 'Automate')
	{
		if(learningMethod == "Woman" || period.includes("Woman"))
		{
			document.location.href = "../../marrige/he/index.html" + religionOnlyParm;
		}				
		else if(learningMethod == "Man" || period.includes("Man"))
		{
			document.location.href = "../../marrige/he/index.html" + religionOnlyParm;
		}				
		else if(learningMethod == "Jubilee" || period.includes("Jubilee"))
		{
			let yovelMazal = getCurrentMazal("yovel");
			document.location.href = "./index.html?period=yovel&hebrewDay=" + yovelMazal[0] + "&hebrewHour=" + yovelMazal[1] + "&hebrewChelek=" + yovelMazal[2] + location + religionAndParm;			
		}
		else if(learningMethod == "Year" || period.includes("Year"))
		{
			let yearlMazal = getCurrentMazal("year");
			document.location.href = "./index.html?period=year&hebrewDay=" + yearlMazal[0] + "&hebrewHour=" + yearlMazal[1] + "&hebrewChelek=" + yearlMazal[2] + location + religionAndParm;	
		}
		else if(learningMethod == "Month" || period.includes("Month"))
		{
			let monthMazal = getCurrentMazal("month");
			document.location.href = "./index.html?period=month&hebrewDay=" + monthMazal[0] + "&hebrewHour=" + monthMazal[1] + "&hebrewChelek=" + monthMazal[2] + location + religionAndParm;		
		}				
	}
	
	showMasechet = true;
	showSefer = true;
	showParasha = true;

	switch((lbHour+1)%3)
	{
		case 1:
			limudBook = limudBooks.MASECHET;
			break;
		case 2:
			limudBook = limudBooks.SEFER;
			break;
		case 0: 
			limudBook = limudBooks.PARASHA;
			break;
	}

	if(lbMinute >= 0 && lbMinute < 360)
		limudBook = limudBooks.MASECHET;
	else if(lbMinute >= 360 && lbMinute < 720)
		limudBook = limudBooks.SEFER;
	else 
		limudBook = limudBooks.PARASHA;
		

    document.querySelector('[id*="Masechet"]').style.display = true;//showMasechet ? "unset" : "none";
    document.querySelector('[id*="Sefer"]').style.display = true;//showSefer ? "unset" : "none";
    document.querySelector('[id*="Parasha"]').style.display = true;//showParasha ? "unset" : "none";

    document.querySelector('[id*="Mazal"]').style.fontWeight = /*(limudBook == limudBooks.MAZAL) ?*/ "bold" /*: "unset"*/;
    document.querySelector('[id*="Masechet"]').style.fontWeight = (limudBook == limudBooks.MASECHET) ? "bold" : "unset";
    document.querySelector('[id*="Sefer"]').style.fontWeight = (limudBook == limudBooks.SEFER) ? "bold" : "unset";
    document.querySelector('[id*="Parasha"]').style.fontWeight = (limudBook == limudBooks.PARASHA) ? "bold" : "unset";
}


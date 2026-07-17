var isPressLink = false;
function Tefila()
{
	//document.getElementById("btn").style.display = "none";
	//document.getElementById("btn2").style.display = "none";

	
	var date = new Date();

	var h,m,s,milisec;
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	var milisec = date.getMilliseconds();
	curr_hour = milisec + (s*1000) + (m*60*1000) + ((h)*60*60*1000);	
	curr_hour = curr_hour/(1000 * 3600);
	
	
	if(curr_hour < birkutHashahar)
	{
		var secLeft = SecLeft(curr_hour,birkutHashahar);
		document.querySelector("#Mazal").innerText = "Waiting for Pray";
		//console.log(1);
		//BirkutHashahar(secLeft);
	}
	else if(curr_hour >= birkutHashahar && curr_hour < patachEliyaou)
	{
		var secLeft = SecLeft(curr_hour,patachEliyaou);
		document.querySelector("#Mazal").innerText = "Birkot Ha'sha'char";
		//console.log(1);
		//BirkutHashahar(secLeft);
	}
	else if(curr_hour >= patachEliyaou && curr_hour < korbanot)
	{
		//console.log(2);
		var secLeft = SecLeft(curr_hour,korbanot);
		document.querySelector("#Mazal").innerText = "Patach Eliyau";
		//PatachEliyaou(secLeft);
	}
	else if(curr_hour >= korbanot && curr_hour < psokeiDzimra)
	{
		//console.log(3);
		var secLeft = SecLeft(curr_hour,psokeiDzimra);
		document.querySelector("#Mazal").innerText = "Korbanot";
		//Korbanot(secLeft);
	}
	else if(curr_hour >= psokeiDzimra && curr_hour < yozerOr)
	{
		//console.log(4);
		var secLeft = SecLeft(curr_hour,yozerOr);
		document.querySelector("#Mazal").innerText = "Psokei de'zimra";
		//PsokeiDzimra(secLeft);
	}
	else if(curr_hour >= yozerOr && curr_hour < kriyahtShema)
	{
		//console.log(5);
		var secLeft = SecLeft(curr_hour,kriyahtShema);
		document.querySelector("#Mazal").innerText = "YotzerOr";
		//YozerOr(secLeft);
	}
	else if(curr_hour >= kriyahtShema && curr_hour < publicSunrise)
	{
		//console.log(6);
		var secLeft = SecLeft(curr_hour,publicSunrise);
		document.querySelector("#Mazal").innerText = "Kri'at Shema";		
		//KriyahtShema(secLeft);
	}
	else if(curr_hour >= publicSunrise && !isPressLink )
	{
		isPressLink = true;
		window.location.href = "../../../index.html?longitude=" + longitude + "&latitude=" + latitude;
	}
}

function BirkutHashahar(secLeft)
{
	document.querySelector(".circular").style.display = "unset";
	setTimeout(function() 
	{
		PatachEliyaou(60*3);		
	}, 1000 * secLeft); //wait maximum 4 minutes for the birkutHashahar will ends
}

function PatachEliyaou(secLeft)
{
	//break between birkutHashahar & patachEliyaou
	document.querySelector(".circular").style.display = "none";

	//patachEliyaou
	setTimeout(function() 
	{
		document.querySelector(".circular").style.display = "none";
		
		//3m
		document.querySelector(".circle .left .progress").style.animation = "left " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animation = "right " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animationDelay = "" + Number((secLeft/2)-1) + "s";			
		document.querySelector(".number").innerText = "פתח אליהו";

		document.querySelector(".circular").style.display = "unset";
		
	}, 2000); //wait 4 minutes + 10s for the birkutHashahar will ends

	setTimeout(function() 
	{
		Korbanot(60*13);
	}, /*1000*60*4 +*/ 1000*secLeft); //wait maximum 3 minutes for the patachEliyaou will ends
}

function Korbanot(secLeft)
{
	//break between patachEliyaou & korbanot
	document.querySelector(".circular").style.display = "none";

	//korbanot
	setTimeout(function() 
	{
		//13m
		document.querySelector(".circle .left .progress").style.animation = "left " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animation = "right " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animationDelay = "" + Number((secLeft/2)-1) + "s";			
		document.querySelector(".number").innerText = "קורבנות";

		document.querySelector(".circular").style.display = "unset";
	}, /*1000*60*4 + 1000*60*3*/2000); //wait 4+3 minutes + 10s for the patachEliyaou will ends

	setTimeout(function()
	{
		PsokeiDzimra(60*14);
	}, /*1000*60*4 + 1000*60*3 +*/ 1000*secLeft); //wait 4+3+13 minutes for the korbanot will ends
	
}

function PsokeiDzimra(secLeft)
{
	//console.log(secLeft);
	//break between korbanot & psokeiDzimra
	document.querySelector(".circular").style.display = "none";

	//psokeiDzimra
	setTimeout(function()
	{
		//14m
		document.querySelector(".circle .left .progress").style.animation = "left " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animation = "right " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animationDelay = "" + Number((secLeft/2)-1) + "s";			
		document.querySelector(".number").innerText = "פסוקי דזמרה";

		document.querySelector(".circular").style.display = "unset";
	}, /*1000*60*4 + 1000*60*3 + 1000*60*13 +*/2000); //wait 4+3+13 minutes + 10s for the korbanot will ends

	setTimeout(function() 
	{		
		YozerOr(60*4);		
	}, /*1000*60*4 + 1000*60*3 + 1000*60*13 +*/ 1000*secLeft); //wait 4+3+13+14 minutes for the psokeiDzimra will ends
	
}

function YozerOr(secLeft)
{
	//break between psokeiDzimra & YozerOr 
	document.querySelector(".circular").style.display = "none";		

	//YozerOr
	setTimeout(function() 
	{		
		//4m
		document.querySelector(".circle .left .progress").style.animation = "left " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animation = "right " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animationDelay = "" + Number((secLeft/2)-1) + "s";			
		document.querySelector(".number").innerText = "יוצר אור";

		document.querySelector(".circular").style.display = "unset";
	}, /*1000*60*4 + 1000*60*3 + 1000*60*13 + 1000*60*14 +*/ 2000); //wait 4+3+13+14 minutes + 10s for the psokeiDzimra will ends

	setTimeout(function() 
	{
		KriyahtShema(60*4);
	}, /*1000*60*4 + 1000*60*3 + 1000*60*13 + 1000*60*14 +*/ 1000*secLeft); //wait 4+3+13+14+4 minutes for the YozerOr will ends

}

function KriyahtShema(secLeft)
{
	//break between YozerOr & kriyahtShema
	document.querySelector(".circular").style.display = "none";

	//kriyahtShema
	setTimeout(function() 
	{
		document.querySelector(".circular").style.display = "none";

		//4m
		document.querySelector(".circle .left .progress").style.animation = "left " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animation = "right " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animationDelay = "" + Number((secLeft/2)-1) + "s";			
		document.querySelector(".number").innerText = "קריאת שמע";

		document.querySelector(".circular").style.display = "unset";		
	}, /*1000*60*4 + 1000*60*3 + 1000*60*13 + 1000*60*14 + 1000*60*4 +*/ 2000); //wait 4+3+13+14+4 minutes + 10s for the YozerOr will ends

	setTimeout(function() 
	{
		Netz(60*6);
	}, /*1000*60*4 + 1000*60*3 + 1000*60*13 + 1000*60*14 + 1000*60*4 +*/ 1000*secLeft); //wait 4+3+13+14+4+4 minutes for the kriyahtShema will ends
}

function Netz(secLeft)
{
	window.location.href = "https://hebrewclock13.web.app/man/simple/index.html";
	//break between kriyahtShema & netz
	document.querySelector(".circular").style.display = "none";		

	//netz
	setTimeout(function() 
	{
		//6m
		document.querySelector(".circle .left .progress").style.animation = "left " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animation = "right " + Number((secLeft/2)-1) + "s linear both";
		document.querySelector(".circle .right .progress").style.animationDelay = "" + Number((secLeft/2)-1) + "s";			
		document.querySelector(".number").innerText = "תפילת שמונה עשרה";

		document.querySelector(".circular").style.display = "unset";
		
	}, /*1000*60*4 + 1000*60*3 + 1000*60*13 + 1000*60*14 + 1000*60*4 + 1000*60*4 +*/ 2000); //wait 4+3+13+14+4+4 minutes + 10s for the kriyahtShema will ends

	//end of netz
	setTimeout(function() 
	{
		window.location.href = "https://hebrewclock13.web.app/man/simple/index.html";
		//document.querySelector(".circular").style.display = "none";		
	}, /*1000*60*4 + 1000*60*3 + 1000*60*13 + 1000*60*14 + 1000*60*4 + 1000*60*4 +*/1000*secLeft); //wait 4+3+13+14+4+4+6 minutes for the netz will ends
}

function TefilaNetz()
{
	//document.getElementById("btn").style.display = "none";
	//document.getElementById("btn2").style.display = "none";
	//tefilaNetz	 = true;
	//Tefila(true);
}

//return the seconds left until the next action need to begin
function SecLeft(curr_hour,nextAction_hour)
{
	var counterDawn =  timeadj1(nextAction_hour-curr_hour).split(':');

	//var minuteLeft = Number(counterDawn[1]);
	//var secondLeft = Number(counterDawn[2]);
	
	document.getElementById("ChirstianHour").value = "00";
	document.getElementById("ChirstianMinute").value = counterDawn[1];
	document.getElementById("ChirstianSecond").value = counterDawn[2];

	
	//var secLeft = (minuteLeft*60)+secondLeft; 
	
	//console.log(minuteLeft);
	//console.log(secondLeft);
	
	//return secLeft;
}
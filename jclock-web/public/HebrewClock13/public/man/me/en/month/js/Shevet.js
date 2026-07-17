var shevetLocation = "12";
function setShevetLocation()
{
	if(latitude>= 29 && latitude<=34)
	{
		var gad = 29;
		var gad_shimon = 29 + (25/60);  
		var shimon_reuven = 29 + (50/60);
	    var reuven_zevulun = 30 + (15/60);
		var zevulun_yissachar = 30 + (40/60);
		var yissachar_yeuda = 31 + (5/60);
		var yehuda_naftali = 31 + (30/60);
		var naftali_asher = 31 + (55/60);
		var asher_dan = 32 + (20/60);
		var dan_benjamin = 32 + (45/60);
		var benjamin_menashe = 33 + (10/60);
		var menashe_ephraim = 33 + (35/60);
		var ephraim = 34;
		
		if(gad <= latitude && latitude < gad_shimon)
			shevetLocation = "06";
		if(gad_shimon <= latitude && latitude < shimon_reuven)
			shevetLocation = "05";
		if(shimon_reuven <= latitude && latitude < reuven_zevulun)
			shevetLocation = "04";
		if(reuven_zevulun <= latitude && latitude < zevulun_yissachar)
			shevetLocation = "03";
		if(zevulun_yissachar <= latitude && latitude < yissachar_yeuda)
			shevetLocation = "02";
		if(yissachar_yeuda <= latitude && latitude < yehuda_naftali)
			shevetLocation = "01";
		else if( yehuda_naftali <= latitude && latitude < naftali_asher)
			shevetLocation = "12";
		else if( naftali_asher <= latitude && latitude < asher_dan)
			shevetLocation = "11";
		else if( asher_dan <= latitude && latitude < dan_benjamin)
			shevetLocation = "10";
		else if( dan_benjamin <= latitude && latitude < benjamin_menashe)
			shevetLocation = "09";
		else if( benjamin_menashe <= latitude && latitude < menashe_ephraim)
			shevetLocation = "08";
		else if( menashe_ephraim <= latitude && latitude < ephraim)
			shevetLocation = "07";
	}

	else  //חוץ לארץ
	{
		shevetLocation = "12";
	}	

} 



function shevetFunction()
{	
    var win;
	if(latitude>= 29 && latitude<=34)
	{		
		var gad = 29;
		var gad_shimon = 29 + (25/60);  
		var shimon_reuven = 29 + (50/60);
	    var reuven_zevulun = 30 + (15/60);
		var zevulun_yissachar = 30 + (40/60);
		var yissachar_yeuda = 31 + (5/60);
		var yehuda_naftali = 31 + (30/60);
		var naftali_asher = 31 + (55/60);
		var asher_dan = 32 + (20/60);
		var dan_benjamin = 32 + (45/60);
		var benjamin_menashe = 33 + (10/60);
		var menashe_ephraim = 33 + (35/60);
		var ephraim = 34;
		
		if(gad <= latitude && latitude < gad_shimon)
			win = window.open('https://en.wikipedia.org/wiki/Gad_(son_of_Jacob)', '_blank');		
		if(gad_shimon <= latitude && latitude < shimon_reuven)
			win = window.open('https://en.wikipedia.org/wiki/Simeon_(son_of_Jacob)', '_blank');
		if(shimon_reuven <= latitude && latitude < reuven_zevulun)
			win = window.open('https://en.wikipedia.org/wiki/Reuben_(son_of_Jacob)', '_blank');	
		if(reuven_zevulun <= latitude && latitude < zevulun_yissachar)
			win = window.open('https://en.wikipedia.org/wiki/Zebulun', '_blank');	
		if(zevulun_yissachar <= latitude && latitude < yissachar_yeuda)
			win = window.open('https://en.wikipedia.org/wiki/Issachar', '_blank');	
	    if(yissachar_yeuda <= latitude && latitude < yehuda_naftali)
			win = window.open('https://en.wikipedia.org/wiki/Tribe_of_Judah', '_blank');			
		else if( yehuda_naftali <= latitude && latitude < naftali_asher)
			win = window.open('https://en.wikipedia.org/wiki/Naphtali', '_blank');	
		else if( naftali_asher <= latitude && latitude < asher_dan)
			win = window.open('https://en.wikipedia.org/wiki/Asher', '_blank');	
		else if( asher_dan <= latitude && latitude < dan_benjamin)
			win = window.open('https://en.wikipedia.org/wiki/Dan_(son_of_Jacob)', '_blank');	
		else if( dan_benjamin <= latitude && latitude < benjamin_menashe)
			win = window.open('https://en.wikipedia.org/wiki/Benjamin', '_blank');	
		else if( benjamin_menashe <= latitude && latitude < menashe_ephraim)
			win = window.open('https://en.wikipedia.org/wiki/Manasseh_(tribal_patriarch)', '_blank');	
		else if( menashe_ephraim <= latitude && latitude < ephraim)
			win = window.open('https://en.wikipedia.org/wiki/Ephraim', '_blank');	
		
	}	
	else //חוץ לארץ
	{
		win = window.open('https://en.wikipedia.org/wiki/Naphtali', '_blank');	
	}
	win.focus();
}

function setShevet() 
{
	setShevetLocation();
    var x = document.getElementsByClassName("dropdown");
	var i = x[0];
	//longitude
	
	if(latitude>= 29 && latitude<=34)
	{
		i.style.backgroundColor = "#00b050"; //green
		i.style.backgroundImage = "url('../pic/menu_text.png')";
		
		var gad = 29;
		var gad_shimon = 29 + (25/60);  
		var shimon_reuven = 29 + (50/60);
	    var reuven_zevulun = 30 + (15/60);
		var zevulun_yissachar = 30 + (40/60);
		var yissachar_yeuda = 31 + (5/60);
		var yehuda_naftali = 31 + (30/60);
		var naftali_asher = 31 + (55/60);
		var asher_dan = 32 + (20/60);
		var dan_benjamin = 32 + (45/60);
		var benjamin_menashe = 33 + (10/60);
		var menashe_ephraim = 33 + (35/60);
		var ephraim = 34;
		
		if(gad <= latitude && latitude < gad_shimon)
			i.style.backgroundImage = "url('../pic/shevet/03/06.png')";	
		if(gad_shimon <= latitude && latitude < shimon_reuven)
			i.style.backgroundImage = "url('../pic/shevet/03/05.png')";
		if(shimon_reuven <= latitude && latitude < reuven_zevulun)
			i.style.backgroundImage = "url('../pic/shevet/03/04.png')";
		if(reuven_zevulun <= latitude && latitude < zevulun_yissachar)
			i.style.backgroundImage = "url('../pic/shevet/03/03.png')";
		if(zevulun_yissachar <= latitude && latitude < yissachar_yeuda)
			i.style.backgroundImage = "url('../pic/shevet/03/02.png')";
		if(yissachar_yeuda <= latitude && latitude < yehuda_naftali)
			i.style.backgroundImage = "url('../pic/shevet/03/01.png')";		
		else if( yehuda_naftali <= latitude && latitude < naftali_asher)
			i.style.backgroundImage = "url('../pic/shevet/03/13.png')";
		else if( naftali_asher <= latitude && latitude < asher_dan)
			i.style.backgroundImage = "url('../pic/shevet/03/11.png')";
		else if( asher_dan <= latitude && latitude < dan_benjamin)
			i.style.backgroundImage = "url('../pic/shevet/03/10.png')";
		else if( dan_benjamin <= latitude && latitude < benjamin_menashe)
			i.style.backgroundImage = "url('../pic/shevet/03/09.png')";
		else if( benjamin_menashe <= latitude && latitude < menashe_ephraim)
			i.style.backgroundImage = "url('../pic/shevet/03/08.png')";
		else if( menashe_ephraim <= latitude && latitude < ephraim)
			i.style.backgroundImage = "url('../pic/shevet/03/07.png')";
	}

	else  //חוץ לארץ
	{
		i.style.backgroundColor = "#00b050"; //green
		i.style.backgroundImage = "url('../pic/shevet/03/13.png')";
	}	

}
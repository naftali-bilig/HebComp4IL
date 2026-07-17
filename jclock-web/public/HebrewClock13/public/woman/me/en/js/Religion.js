const religions = 
{
    JEWISH: 11,
    CRISTIANITY: 10,
    MUSLIM: 01
}

religion = religions.JEWISH;

function religionFunction()
{
	var url_obj = new URL(document.location.href);
	var religionParm = url_obj.searchParams.get("religion");
	
	switch(religionParm)
	{
		case "christian":
            religion = religions.CRISTIANITY;
			//document.location.href = document.location.href.replace("/it/","/is/") 
			break;
		case "muslim":
			religion = religions.MUSLIM;
            //document.location.href = document.location.href.replace("/is/","/me/") 
			break;
		//case "jewish":
		//	religions = religions.JEWISH:
            //document.location.href = document.location.href.replace("/me/","/it/") 
        //    break;
	}
}

function eternityFunction()
{
	//switch(religion)
	//{
		//case religions.JEWISH:
            document.location.href = document.location.href.replace("/me/","/naftali/") 
     //       break;
	//}
}
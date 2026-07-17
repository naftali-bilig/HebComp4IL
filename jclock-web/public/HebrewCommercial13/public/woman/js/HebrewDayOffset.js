function hebrewDayOffset()
{
	//doit_man();
	hebrewclock_man();
	setmazal_man();

	
	//console.log(lbHour);
	//console.log(lbHour_man);
		
	
	
	//Man is leading
	if((hebrewday > hebrewday_man) || (hebrewday == 1 && hebrewday_man == 7))
		return -1;
	
	if((hebrewday == hebrewday_man) &&
	   ((lbHour > lbHour4Man) || (lbHour == lbHour4Man && lbMinute > lbMinute4Man)))
		return -1;
	
	return 0;
}
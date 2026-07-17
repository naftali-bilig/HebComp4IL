function hebrewDayOffset()
{
	hebrewclock_man();
	setmazal_man();

	var womanMoonTime = (Number(lbHour) * 1080) + Number(lbMinute);
	var manSunTime = (Number(lbHour4Man) * 1080) + Number(lbMinute4Man);

	return womanMoonTime > manSunTime ? -1 : 0;
}

function hasFullBirthCalculationParams()
{
	return birthYear != null && birthYear !== "" &&
		birthMonth != null && birthMonth !== "" &&
		birthDay != null && birthDay !== "" &&
		birthHour != null && birthHour !== "" &&
		birthMin != null && birthMin !== "" &&
		birthGMT != null && birthGMT !== "";
}

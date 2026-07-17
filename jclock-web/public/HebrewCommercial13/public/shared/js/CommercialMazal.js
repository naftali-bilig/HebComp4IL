function getCommercialHourMazal(hebrewDay, hebrewHour)
{
	var dayOffsets = {
		1: 6,
		2: 2,
		3: 5,
		4: 1,
		5: 4,
		6: 7,
		7: 3
	};

	var mazalMap = {
		1: 4,
		2: 1,
		3: 2,
		4: 3,
		5: 5,
		6: 6,
		7: 7
	};

	// The hour is the molad hour inside the full 24-hour day.
	// Add the weekday offset, reduce by modulo 7, and treat 0 as 7.
	var mazalIndex = (dayOffsets[Number(hebrewDay)] + Number(hebrewHour)) % 7;
	if(mazalIndex == 0)
		mazalIndex = 7;

	// Convert the modulo index into the Eat/Drink/Meet mazal number.
	return mazalMap[mazalIndex];
}

var commercials = createEmptyCommercials();

//period <==> {dovid,month,year,yovel}
function ReCalcCommercial(period)
{
	commercials = createEmptyCommercials();

	var normalizedPeriod = String(period).toLowerCase();
	var mazal = getCommercialMazal(normalizedPeriod);
	var hebrewDay = Number(mazal[0]);
	var hourMazal = getCommercialHourMazal(hebrewDay, mazal[1]);
	var nextCommercials = buildCommercialsByMolad(hebrewDay, hourMazal);

	applyCommercials(nextCommercials);
	initCommercials();

	return commercials;
}

function addCurrentMonthCommercials(nextCommercials)
{
	var monthMazal = getCurrentMazal('month');
	var monthDay = Number(monthMazal[0]);

	addMazalCommercials(nextCommercials, monthDay);
}

function getCommercialMazal(period)
{
	var urlMazal = getCommercialMazalFromUrl();
	return urlMazal ? urlMazal : getCurrentMazal(period);
}

function getCommercialMazalFromUrl()
{
	if(typeof document === 'undefined' || !document.location)
		return null;

	var url = new URL(document.location.href);
	var hebrewDayParam = url.searchParams.get('hebrewDay');
	var hebrewHourParam = url.searchParams.get('hebrewHour');
	var hebrewChelekParam = url.searchParams.get('hebrewChelek');

	if(hebrewDayParam == null || hebrewHourParam == null)
		return null;

	return [
		Number(hebrewDayParam),
		Number(hebrewHourParam),
		hebrewChelekParam == null ? 0 : Number(hebrewChelekParam)
	];
}

function buildCommercialsByMolad(hebrewDay, hourMazal)
{
	var nextCommercials = createEmptyCommercials();

	nextCommercials.Drink_07 = createCommercialSlots(getAllHours(), '0360');
	nextCommercials.Eat_01 = createCommercialSlots(getEatHours(), '0360');

	addMazalCommercials(nextCommercials, hebrewDay);
	addMazalCommercials(nextCommercials, hourMazal);

	return nextCommercials;
}

function createEmptyCommercials()
{
	return {
		Drink_01: '',
		Drink_02: '',
		Drink_03: '',
		Drink_04: '',
		Drink_05: '',
		Drink_06: '',
		Drink_07: '',
		Eat_01: '',
		Eat_02: '',
		Eat_03: '',
		Eat_04: '',
		Eat_05: '',
		Eat_06: '',
		Eat_07: '',
		Meet_02: '',
		Meet_04: '',
		Meet_05: '',
		Meet_07: ''
	};
}

function addMazalCommercials(nextCommercials, mazalNumber, options)
{
	options = options || {};
	var includeDrink = options.includeDrink !== false;
	var includeEat = options.includeEat !== false;
	var includeMeet = options.includeMeet !== false;
	var suffix = twoDigits(mazalNumber);
	var drinkKey = 'Drink_' + suffix;
	var eatKey = 'Eat_' + suffix;
	var meetKey = 'Meet_' + suffix;

	if(includeDrink && drinkKey != 'Drink_02' && nextCommercials.hasOwnProperty(drinkKey) && nextCommercials[drinkKey] === '')
		nextCommercials[drinkKey] = createCommercialSlots(getDrinkHours(), '0720');

	if(includeEat && nextCommercials.hasOwnProperty(eatKey) && nextCommercials[eatKey] === '')
		nextCommercials[eatKey] = createCommercialSlots(getEatHours(), '0720');

	if(includeMeet && nextCommercials.hasOwnProperty(meetKey) && nextCommercials[meetKey] === '')
		nextCommercials[meetKey] = createCommercialSlots(getMeetHours(), '0720');
}

function applyCommercials(nextCommercials)
{
	for(var commercialName in nextCommercials)
	{
		if(nextCommercials.hasOwnProperty(commercialName))
			commercials[commercialName] = nextCommercials[commercialName];
	}
}

function createCommercialSlots(hours, priority)
{
	var slots = '';
	var days = ['xx', '07'];

	for(var hourIdx = 0; hourIdx < hours.length; hourIdx++)
	{
		for(var dayIdx = 0; dayIdx < days.length; dayIdx++)
		{
			slots += 's_xx#d_' + days[dayIdx] +
				'__h_' + twoDigits(hours[hourIdx]) +
				'__p_' + priority + '+';
		}
	}

	return slots;
}

function getAllHours()
{
	return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
}

function getEatHours()
{
	return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 18, 19, 20, 21, 22, 23, 24];
}

function getDrinkHours()
{
	return getAllHours();
}

function getMeetHours()
{
	return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24];
}

function twoDigits(value)
{
	value = Number(value);
	return value <= 9 ? '0' + value : String(value);
}


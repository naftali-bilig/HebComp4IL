function genderInitFunction()
{
	var genderElement = document.getElementsByClassName("gender")[0];
	var boy_friend__learning__Element = document.getElementById("yearly__learning");
	var girl_friend__learning__Element = document.getElementById("monthly__learning");
	var married__learning__Element = document.getElementById("Jubilee__learning");

	if(gender == genders.MALE)
	{
		genderElement.classList.remove("female","married");
		genderElement.classList.add("male");
		
		boy_friend__learning__Element.removeAttribute("style");
		girl_friend__learning__Element.style.display = "none";
		married__learning__Element.style.display = "none";
	}
	if(gender == genders.FEMALE)
	{
		genderElement.classList.remove("male","married");
		genderElement.classList.add("female");

		boy_friend__learning__Element.style.display = "none";
		girl_friend__learning__Element.removeAttribute("style");
		married__learning__Element.style.display = "none";
	}
	if(gender == genders.MARRIED)
	{
		genderElement.classList.remove("male","female");
		genderElement.classList.add("married");

		boy_friend__learning__Element.style.display = "none";
		girl_friend__learning__Element.style.display = "none";
		married__learning__Element.removeAttribute("style");
	}
}



function genderFunction()
{
	switch(gender)
	{
		case genders.MALE:
			gender = genders.FEMALE;
			localStorage["gender"] = genders.FEMALE;			
			break;
		case genders.FEMALE:
			gender = genders.MARRIED;
			localStorage["gender"] = genders.MARRIED;			
			break;
		case genders.MARRIED:
			gender = genders.MALE;
			localStorage["gender"] = genders.MALE;			
			break;
	}
	genderInitFunction();
	setmazal();
}


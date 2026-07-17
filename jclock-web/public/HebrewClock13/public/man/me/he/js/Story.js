storyInit()
{
    switch(gender)
	{
		case genders.MALE:
            document.getElementById("story").setAttribute("href","cristian/chosen_story.html");
        break;
		case genders.FEMALE:
            document.getElementById("story").setAttribute("href","islam/chosen_story.html");
            break;
		case genders.MARRIED:
            document.getElementById("story").setAttribute("href","jewish/chosen_story.html");        
			break;
	}
}
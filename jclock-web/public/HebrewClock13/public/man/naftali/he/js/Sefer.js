function sefer_offset()
{
	var Hour;
	if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
			Hour = parseInt(lbHour) + 1 + 2;
	else // 10 ==> 0, 11==> 1, 12==>2
			Hour = parseInt(lbHour) + 1 + 2 - 12 - 12;		
	
	return Hour;
}

function setSefer()
{
	var Hour = lbHour + 1; // = sefer_offset();
	
	
    switch(Hour)
    {
        case (1):
            document.getElementById("Sefer").value = "בראשית";
            sefer_url = "http://www.929.org.il/page/1";
            break;
        case (2):
            document.getElementById("Sefer").value = "שמות";
            sefer_url = "http://www.929.org.il/page/51";
            break;
        case (3):
            document.getElementById("Sefer").value = "ויקרא";
            sefer_url = "http://www.929.org.il/page/91";
            break;
        case (4):
            document.getElementById("Sefer").value = "במדבר";
            sefer_url = "http://www.929.org.il/page/118";
            break;
        case (5):
            document.getElementById("Sefer").value = "דברים";
            sefer_url = "http://www.929.org.il/page/154";
            break;
        case (6):
            document.getElementById("Sefer").value = "יהושע";
            sefer_url = "http://www.929.org.il/page/188";
            break;
        case (7):
            document.getElementById("Sefer").value = "שופטים";
            sefer_url = "http://www.929.org.il/page/212";
            break;
        case (8):
            document.getElementById("Sefer").value = "שמואל";
            sefer_url = "http://www.929.org.il/page/233";
            break;
        case (9):
            document.getElementById("Sefer").value = "מלכים";
            sefer_url = "http://www.929.org.il/page/288";
            break;
        case (10):
            document.getElementById("Sefer").value = "ישעיהו";
            sefer_url = "http://www.929.org.il/page/335";
            break;
        case (11):
            document.getElementById("Sefer").value = "ירמיהו";
            sefer_url = "http://www.929.org.il/page/401";
            break;
        case (12):
            document.getElementById("Sefer").value = "יחזקאל";
            sefer_url = "http://www.929.org.il/page/453";
            break;
        case (13):
            document.getElementById("Sefer").value = "תרי עשר";
            sefer_url = "https://www.929.org.il/page/501";
            break;
        case (14):
            document.getElementById("Sefer").value = "תהילים";
            sefer_url = "http://www.929.org.il/page/568";
            break;
        case (15):
            document.getElementById("Sefer").value = "משלי";
            sefer_url = "http://www.929.org.il/page/718";
            break;
        case (16):
            document.getElementById("Sefer").value = "איוב";
            sefer_url = "http://www.929.org.il/page/749";
            break;
        case (17):
            document.getElementById("Sefer").value = "שיר השירים";
            sefer_url = "https://www.929.org.il/page/791";
			break;
        case (18):
            document.getElementById("Sefer").value = "רות";
			sefer_url = "https://www.929.org.il/page/799";
            break;
        case (19):
            document.getElementById("Sefer").value = "איכה";
			sefer_url = "http://www.929.org.il/page/803";
            break;
        case (20):
            document.getElementById("Sefer").value = "קהלת";
			sefer_url = "http://www.929.org.il/page/808";
            break;
        case (21):
            document.getElementById("Sefer").value = "אסתר";
			sefer_url = "https://www.929.org.il/page/820";
            break;
        case (22):
            document.getElementById("Sefer").value = "דניאל";
			sefer_url = "https://www.929.org.il/page/830";
            break;
        case (23):
            document.getElementById("Sefer").value = "עזרא ונחמיה";
            sefer_url = "https://www.929.org.il/page/842";
			break;
        case (24):
            document.getElementById("Sefer").value = "דברי הימים";
            break;
        default:
            break;
    }
	
	//debug
	//document.getElementById("Sefer").value = latitude;
	
}
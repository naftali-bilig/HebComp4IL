function sefer_offset()
{
	var Hour;

	if (lbHour < 22) // 0==>2, 1==>3, 2==>4, 3==>5, 4==>6, 5==>7, 6==>8, 7==>9, 8==>10, 9==>11
		Hour = parseInt(lbHour) + 1 + 2 ;
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
            document.getElementById("Sefer").value = "Bereshit";
            sefer_url = "http://www.929.org.il/page/1";
            break;
        case (2):
            document.getElementById("Sefer").value = "Shemot";
            sefer_url = "http://www.929.org.il/page/51";
            break;
        case (3):
            document.getElementById("Sefer").value = "Vayikra";
            sefer_url = "http://www.929.org.il/page/91";
            break;
        case (4):
            document.getElementById("Sefer").value = "Bamidbar";
            sefer_url = "http://www.929.org.il/page/118";
            break;
        case (5):
            document.getElementById("Sefer").value = "Devarim";
            sefer_url = "http://www.929.org.il/page/154";
            break;
        case (6):
            document.getElementById("Sefer").value = "Yo'ho'sho'a";
            sefer_url = "http://www.929.org.il/page/188";
            break;
        case (7):
            document.getElementById("Sefer").value = "Shoftim";
            sefer_url = "http://www.929.org.il/page/212";
            break;
        case (8):
            document.getElementById("Sefer").value = "Shmo'el";
            sefer_url = "http://www.929.org.il/page/233";
            break;
        case (9):
            document.getElementById("Sefer").value = "Melachim";
            sefer_url = "http://www.929.org.il/page/288";
            break;
        case (10):
            document.getElementById("Sefer").value = "Yisha'ayaou";
            sefer_url = "http://www.929.org.il/page/335";
            break;
        case (11):
            document.getElementById("Sefer").value = "Yirmi'yaou";
            sefer_url = "http://www.929.org.il/page/401";
            break;
        case (12):
            document.getElementById("Sefer").value = "Yechezkel";
            sefer_url = "http://www.929.org.il/page/453";
            break;
        case (13):
            document.getElementById("Sefer").value = "Tri asar";
            sefer_url = "https://www.929.org.il/page/501";
            break;
        case (14):
            document.getElementById("Sefer").value = "Tehilim"; // תהילים
            sefer_url = "http://www.929.org.il/page/568";
            break;
        case (15):
            document.getElementById("Sefer").value = "Mishlei"; //משלי
            sefer_url = "http://www.929.org.il/page/718";
            break;
        case (16):
            document.getElementById("Sefer").value = "Eiyov";	//איוב
            sefer_url = "http://www.929.org.il/page/749";
            break;
        case (17):
            document.getElementById("Sefer").value = "Shir hashirim";
            sefer_url = "https://www.929.org.il/page/791";
			break;
        case (18):
            document.getElementById("Sefer").value = "Rut";
            sefer_url = "https://www.929.org.il/page/799";
			break;
        case (19):
            document.getElementById("Sefer").value = "Eicha"; //איכה
			sefer_url = "http://www.929.org.il/page/803";
            break;
        case (20):
            document.getElementById("Sefer").value = "Ko'helet"; //קהלת
            sefer_url = "http://www.929.org.il/page/808";
			break;
        case (21):
            document.getElementById("Sefer").value = "Ester";
            sefer_url = "https://www.929.org.il/page/820";
			break;
        case (22):
            document.getElementById("Sefer").value = "Daniel";
            break;
        case (23):
            document.getElementById("Sefer").value = "Ezra  veNechamiah";
            break;
        case (24):
            document.getElementById("Sefer").value = "Divrei hayamim"; // דברי הימים
            break;
        default:
            break;
    }
	
	//debug
	//document.getElementById("Sefer").value = lbHour;
	
	//debug
	//document.getElementById("Sefer").value = latitude;
	
}
const limudBooks = 
{
    MAZAL:  "00",
    MASECHET: "01",
    SEFER: "10",
    PARASHA: "11"
}

var limudBook = limudBooks.MAZAL;

function sederLimud()
{
    limudBook = limudBooks.MAZAL;
    var showMazal = true;
    var showMasechet = false;
    var showSefer = false;
    var showParasha = false;

    if(lbMinute >= 270)
    {
        showMasechet = true;
        limudBook = limudBooks.MASECHET;
    }
    if(lbMinute >= 540)
    {
        showSefer = true;
        limudBook = limudBooks.SEFER;
    }
    if(lbMinute >= 720)
    {
        showParasha = true;
        limudBook = limudBooks.PARASHA;
    }

    document.querySelector('[id*="Masechet"]').style.display = showMasechet ? "unset" : "none";
    document.querySelector('[id*="Sefer"]').style.display = showSefer ? "unset" : "none";
    document.querySelector('[id*="Parasha"]').style.display = showParasha ? "unset" : "none";

    document.querySelector('[id*="Mazal"]').style.fontWeight = (limudBook == limudBooks.MAZAL) ? "bold" : "unset";
    document.querySelector('[id*="Masechet"]').style.fontWeight = (limudBook == limudBooks.MASECHET) ? "bold" : "unset";
    document.querySelector('[id*="Sefer"]').style.fontWeight = (limudBook == limudBooks.SEFER) ? "bold" : "unset";
    document.querySelector('[id*="Parasha"]').style.fontWeight = (limudBook == limudBooks.PARASHA) ? "bold" : "unset";
}


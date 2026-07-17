//Commercial_manually
//need to set each commercial publish keys based on it goal
//s is "shevetLocation", d is "day of week" between 1-7, h is "hour" between 00 and 23, p meaning is "priority" counter set from min 0001 to max 1080 
var cInRegionAtTime = new Map();
const commercials = {
    Soteria: 's_xx#d_xx__h_xx__p_0001+',
    Breslev: 's_12#d_xx__h_xx__p_0001+s_09#d_xx__h_xx__p_0001+s_10#d_xx__h_xx__p_0001+s_02#d_xx__h_xx__p_0001+',
    ShifonPlus: 's_12#d_xx__h_17__p_0360+',
    IDF: 's_12#d_04__h_18__p_0360+s_12#d_04__h_19__p_0360+',
    Opticana: 's_xx#d_0x__h_22__p_0720+s_xx#d_0x__h_23__p_0720+',
    NewDeli: 's_xx#d_xx__h_17__p_0360+',
    Mispara: 's_12#d_04__h_22__p_0540+',
    JacobsCoffee: 's_xx#d_xx__h_00__p_0360+s_xx#d_xx__h_01__p_0360+s_xx#d_xx__h_02__p_0360+s_xx#d_xx__h_07__p_0360+s_xx#d_xx__h_12__p_0360+s_xx#d_xx__h_13__p_0360+s_xx#d_xx__h_14__p_0360+s_xx#d_xx__h_19__p_0360+',
    NesCafe: 's_xx#d_xx__h_00__p_0360+s_xx#d_xx__h_01__p_0360+s_xx#d_xx__h_02__p_0360+s_xx#d_xx__h_07__p_0360+s_xx#d_xx__h_12__p_0360+s_xx#d_xx__h_13__p_0360+s_xx#d_xx__h_14__p_0360+s_xx#d_xx__h_19__p_0360+',
    CoffeeBilig: 's_xx#d_xx__h_00__p_0360+s_xx#d_xx__h_01__p_0360+s_xx#d_xx__h_02__p_0360+s_xx#d_xx__h_07__p_0360+s_xx#d_xx__h_12__p_0360+s_xx#d_xx__h_13__p_0360+s_xx#d_xx__h_14__p_0360+s_xx#d_xx__h_19__p_0360+'
}

//d_xx ==> xx means 01-06
//d_0x ==> 0x means 01-05

initCommercials();

function initMap()
{
    for(var regionIdx = 1; regionIdx<=12; regionIdx++)
    {
        for(var dayIdx=1; dayIdx<=7; dayIdx++)
        {
            for(var timeIdx = 0; timeIdx<=23; timeIdx++)
            {
                regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                dayIdxValue = "0" + dayIdx;
                timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                
                //string of 6 characters ==> {rrddtt};
                var regionAtDayTime = regionIdxValue + dayIdxValue + timeIdxValue;
                var cList =[]
                
                cInRegionAtTime.set(regionAtDayTime,cList);
            }
        }
    }

}


function initCommercials()
{
    initMap();
 
    for (let commercial in commercials) 
    {
        //commercial <= name of the commercial in const object.
        //cSlots <= array of all commercial schedule time inside specific region.

        //console.log(commercial + " " + String(commercials[commercial]));
        var commercial_request = String(commercials[commercial]);
        var cSlots = commercial_request.split("+");
        //console.log(cSlots)
        for(let cSlot of cSlots)
        {
            var regionValue = cSlot.slice(2,4);
            var dayValue = cSlot.slice(7,9);
            var timeValue = cSlot.slice(13,15);
            var priority = cSlot.slice(19,23);   

            //console.log("source - regionValue: " + regionValue)
            //console.log("source - dayValue: " + regionValue)
            //console.log("source - timeValue: " + regionValue)

            //cases of all regions/days/time or all of part of them.
            if(regionValue == "xx" && dayValue.includes("x") && timeValue == "xx")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var dayIdx=1; dayIdx<=6; dayIdx++)
                    {
                        if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                            break;
                            
                        for(var timeIdx = 0; timeIdx<=23; timeIdx++)
                        {
                            regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                            dayIdxValue = "0" + dayIdx;
                            timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                            insertCommercialsIntoSlot(commercial,regionIdxValue,dayIdxValue,timeIdxValue,priority)
                        }
                    }
                }
            }
            else if(regionValue == "xx" && dayValue.includes("x") && timeValue != "xx")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var dayIdx=1; dayIdx<=6; dayIdx++)
                    {
                        if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                            break;
                            
                        regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                        dayIdxValue = "0" + dayIdx;
                        insertCommercialsIntoSlot(commercial,regionIdxValue,dayIdxValue,timeValue,priority)
                    }
                }
            }
            else if(regionValue == "xx" && !dayValue.includes("x") && timeValue == "xx")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var timeIdx = 0; timeIdx<=23; timeIdx++)
                    {
                        regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                        timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                        insertCommercialsIntoSlot(commercial,regionIdxValue,dayValue,timeIdxValue,priority);
                    }
                }
            }
            else if(regionValue == "xx" && !dayValue.includes("x") && timeValue != "xx")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                    insertCommercialsIntoSlot(commercial,regionIdxValue,dayValue,timeValue,priority);
                }
            }
            else if(regionValue != "xx" && dayValue.includes("x") && timeValue == "xx")
            {
                for(var dayIdx=1; dayIdx<=6; dayIdx++)
                {
                    if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                        break;

                    for(var timeIdx = 0; timeIdx<=23; timeIdx++)
                    {
                        dayIdxValue = "0" + dayIdx;
                        var timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                        //console.log("source - regionValue: " + regionValue)
                        insertCommercialsIntoSlot(commercial,regionValue,dayIdxValue,timeIdxValue,priority)
                    }
                }
            }            
            else if(regionValue != "xx" && dayValue.includes("x") && timeValue != "xx")
            {
                for(var dayIdx=1; dayIdx<=6; dayIdx++)
                {
                    if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                        break;

                    dayIdxValue = "0" + dayIdx;
                    insertCommercialsIntoSlot(commercial,regionValue,dayIdxValue,timeValue,priority)
                }
            }            
            else if(regionValue != "xx" && dayValue != "xx" && timeValue == "xx")
            {

                for(var timeIdx = 0; timeIdx<=23; timeIdx++)
                {
                    var timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                    insertCommercialsIntoSlot(commercial,regionValue,dayValue,timeIdxValue,priority)
                }
            }
            else if(regionValue != "xx" && dayValue.includes("x") && timeValue != "xx")
            {
                for(var dayIdx=1; dayIdx<=6; dayIdx++)
                {
                    if(dayIdx == 6 && dayValue == "0x" )//"0x means 01-05 only, not 06"
                        break;
                    
                    dayIdxValue = "0" + dayIdx;
                    insertCommercialsIntoSlot(commercial,regionValue,dayIdxValue,timeValue,priority);
                }
            }
            else if(regionValue != "xx" && dayValue != "xx" && timeValue != "xx")
            {
                insertCommercialsIntoSlot(commercial,regionValue,dayValue,timeValue,priority)
            }
        }
    }
}

function insertCommercialsIntoSlot(commercial,regionValue,dayValue,timeValue,priority)
{
    //console.log("regionValue: " + regionValue)

    //string of 6 characters ==> {rrddtt};
    var regionAtDayTime = regionValue + dayValue + timeValue;

    //console.log("push: " + regionAtDayTime)
    for(var i= Number(priority); i>0 ; i--)
        cInRegionAtTime.get(regionAtDayTime).push(commercial);
}

var commercial = commercials.Breslev;

//

//need to decide if i want an omer be different between 
function commercialFunction()
{
	var url = new URL(document.location.href);
	var lon = url.searchParams.get("longitude");        
	var lat = url.searchParams.get("latitude");        
	if(lat)
	{
		//tz = https://maps.googleapis.com/maps/api/timezone/outputFormat?parameters
	}

	longitude = lon ? lon : position.coords.longitude;
	latitude = lat ? lat : position.coords.latitude;

	
    //console.log("shevetLocation: " + shevetLocation + "; hebrewday: " + hebrewday + "; lbHour:" + lbHour)
    //need to know which omer and which shevetLocation
    //need to get the list of commercials in this {region,omer} slot.
    regionValue = (Number(shevetLocation) <= 9) ? "0" + Number(shevetLocation) : shevetLocation;
    dayValue = "0" + hebrewday;
    timeValue = (lbHour <= 9) ? "0" + lbHour : String(lbHour);
 
    //string of 6 characters ==> {rrddtt};
    var regionAtDayTime = regionValue + dayValue + timeValue;

    cList = cInRegionAtTime.get(regionAtDayTime);
    //console.log(regionAtDayTime);
    //console.log(cList);

    var randomNumber = Math.floor(Math.random() * cList.length);    ; // 0 or 1
    var commercial = cList[randomNumber];

    //console.log(commercial);
    commercialInitFunction(commercial);
}


//Commercial_manually
//need to update each commercial for each language with 1. link address and 2. css id connected to the commercial logo 
function commercialInitFunction(commercial)
{
    switch(commercial)
	{
		case "Soteria":
            document.getElementById("commercial").querySelector("img").setAttribute("id","Soteria");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"http://soteria.org.il/"));
            break;
        case "Breslev":
            document.getElementById("commercial").querySelector("img").setAttribute("id","Breslev");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"http://www.emuniyim.com/"));
            break;
        case "ShifonPlus":
                document.getElementById("commercial").querySelector("img").setAttribute("id","ShifonPlus");
                document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"http://shifonplus.com/"));
            break;     
        case "IDF":
            document.getElementById("commercial").querySelector("img").setAttribute("id","IDF");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.idf.il/"));
        break;  
        case "Opticana":
            document.getElementById("commercial").querySelector("img").setAttribute("id","Opticana");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.opticana.co.il/"));            
        break;     
        case "NewDeli":
            document.getElementById("commercial").querySelector("img").setAttribute("id","NewDeli");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://newdeli.com/"));
        break;   
        case "Velvel":
            document.getElementById("commercial").querySelector("img").setAttribute("id","Velvel");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.velvel.co.il/"));
        break;   
        case "Mispara":
            document.getElementById("commercial").querySelector("img").setAttribute("id","Mispara");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.opticana.co.il/"));
        break; 
        case "JacobsCoffee":
            document.getElementById("commercial").querySelector("img").setAttribute("id","JacobsCoffee");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.jacobscoffee.co.il/"));
        break; 
        case "CoffeeBilig":
            document.getElementById("commercial").querySelector("img").setAttribute("id","CoffeeBilig");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://naftali126.wixsite.com/chaimtovim"));
        break; 
        case "NesCafe":
            document.getElementById("commercial").querySelector("img").setAttribute("id","NesCafe");
            document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 
	} 
}

function openCommercialInNewTab(hyperLink) {
    var win = window.open(hyperLink, '_blank');
    win.focus();
}

//Commercial_manually
//need to set each commercial publish keys based on it goal
//s is "shevetLocation", d is "day of week" between 1-7, h is "hour" between 01 and 24, p meaning is "priority" counter set from min 0001 to max 1080 
//hour: xx ==> 1-24; dd==>24-10 || 13-18; ee==>24-10 || 18 ; em==> 24-10

var cInRegionAtTime = new Map();

/*
const commercials = 
{
    Drink_01: 's_xx#d_xx__h_06__p_0720+s_xx#d_xx__h_07__p_0720+s_xx#d_xx__h_08__p_0720+s_xx#d_xx__h_09__p_0720+s_xx#d_xx__h_10__p_0720+s_xx#d_xx__h_11__p_0720+s_xx#d_xx__h_19__p_0720+s_xx#d_xx__h_20__p_0720+s_xx#d_xx__h_21__p_0720+s_xx#d_xx__h_22__p_0720+s_xx#d_xx__h_23__p_0720+s_xx#d_xx__h_24__p_0720+',
	Drink_03: '',
	Drink_04: 's_xx#d_xx__h_07__p_0720+s_xx#d_xx__h_08__p_0720+s_xx#d_xx__h_09__p_0720+s_xx#d_xx__h_10__p_0720+s_xx#d_xx__h_11__p_0720+s_xx#d_xx__h_12__p_0720+',	
	Drink_05: 's_xx#d_xx__h_01__p_0720+s_xx#d_xx__h_02__p_0720+s_xx#d_xx__h_03__p_0720+s_xx#d_xx__h_04__p_0720+s_xx#d_xx__h_05__p_0720+s_xx#d_xx__h_06__p_0720+',
	Drink_06: 's_xx#d_xx__h_12__p_0720+s_xx#d_xx__h_13__p_0720+s_xx#d_xx__h_14__p_0720+s_xx#d_xx__h_15__p_0720+s_xx#d_xx__h_16__p_0720+s_xx#d_xx__h_17__p_0720+s_xx#d_xx__h_18__p_0720+s_xx#d_xx__h_19__p_0720+s_xx#d_xx__h_20__p_0720+s_xx#d_xx__h_21__p_0720+s_xx#d_xx__h_22__p_0720+s_xx#d_xx__h_23__p_0720+s_xx#d_xx__h_24__p_0720+',
	
	//Water
	Drink_07: 's_xx#d_xx__h_xx__p_0360+',	
	//Bread	//jerusalem midnight
	Eat_01: 's_xx#d_xx__h_07__p_0360+s_xx#d_xx__h_08__p_0360+s_xx#d_xx__h_09__p_0360+s_xx#d_xx__h_10__p_0360+s_xx#d_xx__h_17__p_0360+s_xx#d_xx__h_18__p_0360+s_xx#d_xx__h_19__p_0360+s_xx#d_xx__h_20__p_0360+s_xx#d_xx__h_21__p_0360+s_xx#d_xx__h_22__p_0360+s_xx#d_xx__h_23__p_0360+s_xx#d_xx__h_24__p_0360+s_xx#d_xx__h_01__p_0360+s_xx#d_xx__h_02__p_0360+s_xx#d_xx__h_03__p_0360+s_xx#d_xx__h_04__p_0360+s_xx#d_xx__h_05__p_0360+s_xx#d_xx__h_06__p_0360+',
	
	Eat_02: 's_xx#d_xx__h_17__p_0720+',
	Eat_03: '',
	Eat_04: 's_xx#d_xx__h_07__p_0720+s_xx#d_xx__h_08__p_0720+s_xx#d_xx__h_09__p_0720+s_xx#d_xx__h_10__p_0720+',
	Eat_05: '',
			//jerusalem breakfast    //jerusalem meal
	Eat_06: 's_xx#d_xx__h_17__p_0720+s_xx#d_xx__h_18__p_0720+s_xx#d_xx__h_19__p_0720+s_xx#d_xx__h_20__p_0720+s_xx#d_xx__h_21__p_0720+s_xx#d_xx__h_22__p_0720+s_xx#d_xx__h_23__p_0720+s_xx#d_xx__h_24__p_0720+',
	Eat_07: '',	
	
	Meet_02: '',
	Meet_04: 's_xx#d_xx__h_07__p_0720+s_xx#d_xx__h_08__p_0720+s_xx#d_xx__h_09__p_0720+s_xx#d_xx__h_10__p_0720+',
	Meet_05: '',
	Meet_07: ''
};
*/

//d_xx ==> xx means 01-06
//d_0x ==> 0x means 01-05

initCommercials();

function initMap()
{
	cInRegionAtTime = new Map();
    for(var regionIdx = 1; regionIdx<=12; regionIdx++)
    {
        for(var dayIdx=1; dayIdx<=7; dayIdx++)
        {
            for(var timeIdx = 1; timeIdx<=24; timeIdx++)
            {
                regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                dayIdxValue = "0" + dayIdx;
                timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                
                //string of 6 characters ==> {rrddtt};
                var regionAtDayTime = regionIdxValue + dayIdxValue + timeIdxValue;
                var cList =[];
                
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
                            
                        for(var timeIdx = 1; timeIdx<=24; timeIdx++)
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
                    for(var timeIdx = 1; timeIdx<=24; timeIdx++)
                    {
                        regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
                        timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
                        insertCommercialsIntoSlot(commercial,regionIdxValue,dayValue,timeIdxValue,priority);
                    }
                }
            }
            else if(regionValue == "xx" && !dayValue.includes("x") && timeValue == "dd")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var timeIdx = 1; timeIdx<=24; timeIdx++)
                    {
						if(timeIdx == 24 || timeIdx <=10 || (timeIdx >=13 && timeIdx <= 18))
						{							
							regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
							timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
							insertCommercialsIntoSlot(commercial,regionIdxValue,dayValue,timeIdxValue,priority);
						}
                    }
                }
            }
            else if(regionValue == "xx" && !dayValue.includes("x") && timeValue == "ee")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var timeIdx = 1; timeIdx<=24; timeIdx++)
                    {
						if(timeIdx == 24 || timeIdx <=10 || timeIdx == 18)
						{							
							regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
							timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
							insertCommercialsIntoSlot(commercial,regionIdxValue,dayValue,timeIdxValue,priority);
						}
                    }
                }
            }
            else if(regionValue == "xx" && !dayValue.includes("x") && timeValue == "em")
            {
                for(var regionIdx = 1; regionIdx<=12; regionIdx++)
                {
                    for(var timeIdx = 1; timeIdx<=24; timeIdx++)
                    {
						if(timeIdx == 24 || timeIdx <=10)
						{							
							regionIdxValue = (regionIdx <= 9) ? "0" + regionIdx : String(regionIdx);
							timeIdxValue = (timeIdx <= 9) ? "0" + timeIdx : String(timeIdx);
							insertCommercialsIntoSlot(commercial,regionIdxValue,dayValue,timeIdxValue,priority);
						}
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

                    for(var timeIdx = 1; timeIdx<=24; timeIdx++)
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

                for(var timeIdx = 1; timeIdx<=24; timeIdx++)
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
    //console.log("shevetLocation: " + shevetLocation + "; hebrewday: " + hebrewday + "; lbHour:" + lbHour)
    //need to know which omer and which shevetLocation
    //need to get the list of commercials in this {region,omer} slot.
    regionValue = (Number(shevetLocation) <= 9) ? "0" + Number(shevetLocation) : shevetLocation;
    dayValue = "0" + hebrewday;
    var commercialHour = Number(lbHour) + 1;
    timeValue = (commercialHour <= 9) ? "0" + commercialHour : String(commercialHour);
 
    //string of 6 characters ==> {rrddtt};
    var regionAtDayTime = regionValue + dayValue + timeValue;
    cList = cInRegionAtTime.get(regionAtDayTime);
    //console.log(cList.length);

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
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Soteria");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"http://soteria.org.il/"));
            break;
        case "Breslev":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Breslev");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"http://www.emuniyim.com/"));
            break;
        case "LechemMoshe":
			document.getElementById("commercial").querySelector(".day").setAttribute("id","LechemMoshe");
			//document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://lecemoshe.click-eat.co.il/"));
            break;     
        case "ShifonPlus":
			document.getElementById("commercial").querySelector(".day").setAttribute("id","ShifonPlus");
			//document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"http://shifonplus.com/"));
            break;     
        case "IDF":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","IDF");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.idf.il/"));
        break;  
        case "Opticana":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Opticana");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.opticana.co.il/"));            
        break;     
        case "NewDeli":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","NewDeli");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://newdeli.com/"));
        break;   
        case "Velvel":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Velvel");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.velvel.co.il/"));
        break;   
        case "Mispara":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Mispara");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.opticana.co.il/"));
        break; 
        case "JacobsCoffee":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","JacobsCoffee");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.jacobscoffee.co.il/"));
        break; 
        case "CoffeeBilig":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","CoffeeBilig");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://naftali126.wixsite.com/chaimtovim"));
        break; 
        case "NesCafe":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","NesCafe");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 
        case "HebrewCommercial":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","HebrewCommercial");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break;
		case "DJ_Gilad":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","DJ_Gilad");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 
		case "Eat_01":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Eat_01");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
		case "Meet_01":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Meet_01");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 	
		case "Drink_01":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Drink_01");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
		case "Eat_02":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Eat_02");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
		case "Meet_02":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Meet_02");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 	
		case "Drink_02":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Drink_02");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
		case "Eat_03":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Eat_03");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
		case "Meet_03":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Meet_03");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 	
		case "Drink_03":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Drink_03");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 
		case "Eat_04":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Eat_04");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 	
		case "Meet_04":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Meet_04");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break;		
		case "Drink_04":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Drink_04");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 
		case "Eat_05":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Eat_05");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
		case "Meet_05":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Meet_05");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break;
		case "Drink_05":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Drink_05");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 
		case "Eat_06":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Eat_06");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
		case "Meet_06":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Meet_06");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break;
		case "Drink_06":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Drink_06");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 
		case "Eat_07":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Eat_07");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
		case "Meet_07":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Meet_07");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break;
		case "Drink_07":
            document.getElementById("commercial").querySelector(".day").setAttribute("id","Drink_07");
            //document.getElementById("commercial").addEventListener("click",openCommercialInNewTab.bind(this,"https://www.nescafe.com/"));
        break; 		
	} 
}

function openCommercialInNewTab(hyperLink) {
    var win = window.open(hyperLink, '_blank');
    win.focus();
}

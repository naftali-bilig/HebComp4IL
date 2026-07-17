function drawQurater1()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";

    ctx.beginPath();
    ctx.moveTo(400,320);
    ctx.arc(400,320,300,(6/4)*Math.PI,2*Math.PI,false);
    ctx.closePath();
    //תקווה ישראלית - סרט של השולחנות העגולים
    ctx.fillStyle = "#a6230e";  //red
    ctx.fill();
    ctx.fillStyle = "white";  
    //ctx.fillText("שמעון", 580, 160);
    //ctx.fillText("גד", 580, 160);
}


function drawQurater2()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";
  
    ctx.beginPath();
    ctx.moveTo(400,320);
    ctx.arc(400,320,300,2*Math.PI,((2/4)*Math.PI),false);
    ctx.closePath();
    //תקווה עולמית
    //israeli hope של בית הנשיא
    ctx.fillStyle = "#BA8D1A";  //yellow
    ctx.fill();
    ctx.fillStyle = "white";  
    //ctx.fillText("אוניברסלי", 560, 480);
}

function drawQurater3()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";

    ctx.beginPath();
    ctx.moveTo(400,320);
    ctx.arc(400,320,300,((2/4)*Math.PI),Math.PI,false);
    ctx.closePath();
    // תקווה יהודית - שעון
    ctx.fillStyle = "#2D8DA1";  //blue
    ctx.fill();
    ctx.fillStyle = "white";  
    //ctx.fillText("יהודי", 160, 480);
}

function drawQurater4()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";

    ctx.beginPath();
    ctx.moveTo(400,320);
    ctx.arc(400,320,300,Math.PI,(6/4)*Math.PI,false);
    ctx.closePath();
    //e-zone -- תקווה עברית
    ctx.fillStyle = "#84C45E";  //green
    ctx.fill();
    ctx.fillStyle = "white";  
    //ctx.fillText("עברי", 160, 160);
}

function drawSmallCircle()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";

    //לינק של הכינור  נמצא באימייל ונקרא קשתי
    ctx.beginPath();
    ctx.arc(400, 320, 30, 0 , 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "black";  //red
    ctx.fill(); 
}

function drawline1()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(400, 320);
    ctx.lineTo(625, 120);
    ctx.setLineDash([6,36]);
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.fillStyle = "white";  //red
    ctx.fillText("קיץ", 390, 40);
    ctx.fillText("ראובן", 470, 60);
    ctx.fillText("שמעון", 580, 140);
    ctx.fillText("גד", 660, 240);
}

function drawline2()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(400, 320);
    ctx.lineTo(600, 550);
    ctx.setLineDash([6,36]);
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.fillStyle = "white";  //yellow
    ctx.fillText("סתיו", 660, 325);
    ctx.fillText("אפרים", 630, 400);
    ctx.fillText("מנשה", 570, 520);
    ctx.fillText("בנימין", 470, 580);
}


function drawline3()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(400, 320);
    ctx.lineTo(180, 540);
    ctx.setLineDash([6,36]);
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.fillStyle = "white";  //blue
    ctx.fillText("חורף", 380, 600);
    ctx.fillText("דן", 280, 580);
    ctx.fillText("אשר", 180, 520);
    ctx.fillText("נפתלי", 120, 400);
}


function drawline4()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(400, 320);
    ctx.lineTo(200, 100);
    ctx.setLineDash([6,36]);
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.fillStyle = "white";  //green
    ctx.fillText("אביב", 110, 325);
    ctx.fillText("זבולון", 280, 60);
    ctx.fillText("יששכר", 180, 140);
    ctx.fillText("יהודה", 120, 240);
}


function drawMiddleCircle()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "20px Arial";

    //לינק של הכינור  נמצא באימייל ונקרא קשתי
    ctx.beginPath();
    ctx.arc(400, 320, 150, 0 , 2 * Math.PI);
    ctx.setLineDash([1]);
    ctx.stroke();

    ctx.fillStyle = "white";  //green
    ctx.fillText("שכם", 200, 325);
    ctx.fillText("הפרחים", 235, 195);
    ctx.fillText("האריות", 370, 160);
    ctx.fillText("הרחמים", 500, 195);
    ctx.fillText("האשפות", 560, 325);
    ctx.fillText("ציון", 505, 450);
    ctx.fillText("יפו", 390, 490);
    ctx.fillText("החדש", 240, 450);



    //ctx.fillStyle = "black";  //red
    //ctx.fill(); 
}



function drawCircle()
{
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(400, 320, 300, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = "20px Arial";

    ctx.fillStyle = "black";  
    ctx.fillText(":תקווה", 720, 320);


   setTimeout(drawQurater1, 500);
   setTimeout(drawQurater2, 1000);
   setTimeout(drawQurater3, 1500);
   setTimeout(drawQurater4, 2000);
   setTimeout(drawSmallCircle, 2500);
//   setTimeout(drawline1, 3000);
//  setTimeout(drawline2, 3500);
//   setTimeout(drawline3, 4000);
//   setTimeout(drawline4, 4500);
   setTimeout(drawMiddleCircle, 3000);



}
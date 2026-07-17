// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a loop variable
var i;

// List View
function listView() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.width = "100%";
  }
}

// Grid View
function gridView() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.width = "50%";
  }
}

/* Optional: Add active class to the current button (highlight it) 
var container = document.getElementById("btnContainer");
var btns = container.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
*/

function insertAfter(newNode, referenceNode) 
{
	if(referenceNode.nextElementSibling == null)
		referenceNode.parentNode.appendChild(newNode);
	else	
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextElementSibling);
}

function addCommercial(event)
{
	let commercialNode = event.closest(".commercial");
	let newCommercial = commercialNode.cloneNode(true);
	insertAfter(newCommercial,commercialNode);
}

function removeCommercial(event)
{
	if(document.querySelectorAll(".commercial").length == 1)
		return;
	let commercialNode = event.closest(".commercial");
	var parent = commercialNode.parentElement;
	parent.removeChild(commercialNode);
}

let isExpended = false;

function expandCommercial(event)
{
	let commercialNode = event.closest(".commercial");
	let commercialExpendedDetailsNode = commercialNode.querySelector(".gridHeader");
	let commercialExpendButton = commercialNode.querySelector(".btnExpandCommercial");
	if(commercialExpendedDetailsNode.style.display == "flex")
	{
		commercialExpendButton.innerHTML  = "הרחב";
		commercialExpendedDetailsNode.style.display = "none";
	}
	else
	{	
		commercialExpendButton.innerHTML  = "צמצם";
		commercialExpendedDetailsNode.style.display = "flex";
	}	
}
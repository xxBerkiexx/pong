//Code written by Josh Berkman

//------------------------------ CONTROLS MENU VARIABLES ------------------------------
export let controls = document.getElementById("Controls-Cntr");
export let closeBtn = document.getElementById("Close-Btn");


//--------------------------------------------- CONTROLS MENU ---------------------------------------------
//Close the controls menu
closeBtn.addEventListener("click", function() {
    controls.classList.add("hide-controls");
})
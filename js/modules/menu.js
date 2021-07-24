//Code written by Josh Berkman

import * as CONTROLS from "./controlsMenu.js";          //Controls Menu
import { gameLoop, resetGame } from "./game.js";        //Get the game loop
import { resetScoreboard } from "./game.js";            //Reset scoreboard function

//------------------------------ MENU VARIABLES ------------------------------
//Get the menu
export let menu = document.getElementById("Menu-Cntr");
//Get the play button
export let playBtn = document.getElementById("Play-Btn");
//Get singleplayer/multiplayer radio buttons
export let playOpt = document.querySelectorAll(".playOption");
//Get the container the holds the controlsBtn
export let controlsCntr = document.getElementById("Menu-Controls-Btn")
//Get the button to open the controls menu
export let controlsBtn = document.getElementById("Menu-Controls-Img");
//Is the AI controlling player 02?
export let playAI = true;
//Get the player 02 name element
export let player02_Name = document.getElementById("Player2-Name");


//--------------------------------------------- MENU ---------------------------------------------
//Open the controls menu
controlsBtn.addEventListener("click", function() {
    CONTROLS.controls.classList.remove("hide-controls");
});

//Click the play button
playBtn.addEventListener("click", function() {
    //Hide the menu and start the game
    menu.classList.add("hide-menu");
    //Make sure the controls button can't be clicked during the game
    controlsCntr.classList.add("hide-menu");

    //Check if user is playing computer
    if (playOpt[1].checked) {
        playAI = false;
        player02_Name.innerText = "P2";
    }
    else {
        playAI = true;
        player02_Name.innerText = "AI";
    }

    //Reset scoreboard at the start of each game
    resetScoreboard();

    //Reset game variables
    resetGame();

    //GAME LOOP STARTS HERE
    requestAnimationFrame(gameLoop);
});

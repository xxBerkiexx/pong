//Code written by Josh Berkman
//Game loop starts inside the menu.js playBtn event listener

import * as MENU from "./menu.js";              //Menu
import * as PADDLE from "./paddle.js";          //Paddle
import * as BALL from "./ball.js";              //Ball


//TO DO:
//Add sounds and a mute button

//*****************************************************************************************************
// IMPORTANT VARIABLES
//*****************************************************************************************************
//Get the menu button
let menuBtn = document.getElementById("Menu-Btn");
//Get the pause button
let pauseBtn = document.getElementById("Pause-Btn");
//Get the menu modal
let modal = {
    //The container
    container: document.getElementById("Modal"),
    //Yes button
    yes: document.getElementById("Yes"),
    //No button
    no: document.getElementById("No"),
    //Is the modal currently open?
    //Use this to temporarily disable the other buttons
    open: false
}
//Get the game over modal
let gameOverModal = {
    //The container
    container: document.getElementById("Game-Over-Modal"),
    //Get the winner text
    winner: document.getElementById("Winner"),
    //Button
    btn: document.getElementById("Back-To-Menu"),
    //Is the modal currently open?
    //Use this to disable the other buttons
    open: false
}
//Get the container that holds the canvas
let gameCntr = document.getElementById("Game-Cntr");
//Get the height of the game's header to later update
//the playing field
let gameHeader = document.getElementById("Game-Header").getBoundingClientRect().height;
//Is the game currently being played?
//Prevent ball from updating
let playing = false;
//Is the game currently paused?
//Prevent ball and paddles from being updated
let paused = false;
//Use this to close the game loop when user goes back to menu
let closeGameLoop = false;
//Which direction should the ball be launched?
export let launchRight = true;
//Tell the AI to move it's paddle when a ball is launched
export let predictBallOnLaunch = false;
//Reset primary game variables
export function resetGame() {
    paused = false;
    playing = false;
    closeGameLoop = false;
    launchRight = true;
    predictBallOnLaunch = false;
    resetPaddles();
    resetBall();
    resetPause();
}







//*****************************************************************************************************
// SCOREBOARD
//*****************************************************************************************************
//Player score elements
let scoreElement01 = document.getElementById("Player1-Score");
let scoreElement02 = document.getElementById("Player2-Score");
//Player scores
let scorePlayer01 = 0;
let scorePlayer02 = 0;

function updateScoreboard() {
    scoreElement01.innerText = scorePlayer01;
    scoreElement02.innerText = scorePlayer02;
}

export function resetScoreboard() {
    scorePlayer01 = 0;
    scorePlayer02 = 0;
    updateScoreboard();
}







//*****************************************************************************************************
// CANVAS SETUP
//*****************************************************************************************************
//Get canvas and context
const canvas = document.getElementById("Canvas1");
const ctx = canvas.getContext("2d");
//Set canvas element's height
canvas.style.height = gameCntr.getBoundingClientRect().height - gameHeader + "px";
//Canvas resolution width and height equal to maximum possible size
canvas.width = 900;                 //Max width
canvas.height = 520;                //Max height minus gameHeader







//*****************************************************************************************************
// CENTER LINE SETUP
//*****************************************************************************************************
function drawCenterLine() {
    ctx.strokeStyle = "white";                                  //Line color
    ctx.beginPath();                                            //Start path
    ctx.lineWidth = 2;                                          //Line width
    ctx.moveTo(canvas.width / 2, 0);                            //Start point
    ctx.lineTo(canvas.width / 2, canvas.height);                //End point
    ctx.stroke();                                               //Draw the line
}







//*****************************************************************************************************
// PLAYER SETUP
//*****************************************************************************************************
//Width of paddles
let paddleWidth = 7;
//Height of paddles
let paddleHeight = 65;
//Default Y position
let paddleY = (canvas.height / 2) - (paddleHeight / 2);
//X position offset
let paddleX_Offset = 30;
//Player 01 X Position
let player01_X = canvas.width - paddleX_Offset;
//Player 02 X Position
let player02_X = paddleX_Offset - paddleWidth;

//Create instance of Paddle for player 01
const player01 = new PADDLE.Paddle(canvas, ctx, player01_X, paddleY, paddleWidth, paddleHeight);
//Create instance of Paddle for player 02
const player02 = new PADDLE.Paddle(canvas, ctx, player02_X, paddleY, paddleWidth, paddleHeight);

//Reset the paddle Y positions
function resetPaddles() {
    player01.y = paddleY;
    player02.y = paddleY;
}

//What is the AI's level of error
export let levelOfError = [
    {moveDelay: 0.2, aiError: 10},              //0:    ai is losing by 6
    {moveDelay: 0.3, aiError: 20},              //1:    ai is losing by 5
    {moveDelay: 0.4, aiError: 30},              //2:    ai is losing by 4
    {moveDelay: 0.5, aiError: 40},              //3:    ai is losing by 3
    {moveDelay: 0.6, aiError: 50},              //4:    ai is losing by 2
    {moveDelay: 0.7, aiError: 60},              //5:    ai is losing by 1
    {moveDelay: 0.8, aiError: 70},              //6:    tie
    {moveDelay: 0.9, aiError: 80},              //7:    ai is winning by 1
    {moveDelay: 1.0, aiError: 90},              //8:    ai is winning by 2
    {moveDelay: 1.1, aiError: 100},             //9:    ai is winning by 3
    {moveDelay: 1.2, aiError: 110},             //10:   ai is winning by 4
    {moveDelay: 1.3, aiError: 120},             //11:   ai is winning by 5
    {moveDelay: 1.4, aiError: 130},             //12:   ai is winning by 6
];

//Return the correct error level values
export function getErrorLevel() {
    //Default value represents a tie
    let defaultValue = 6;

    //p2 - p1
    //5 - 3 = 2;   New level is 8
    //3 - 5 = -2;  New level is 4
    let scoreDifference = scorePlayer02 - scorePlayer01;

    //New error level
    let newLevel = defaultValue + scoreDifference;

    //Export the new error level values
    return levelOfError[newLevel];
}







//*****************************************************************************************************
// BALL SETUP
//*****************************************************************************************************
//Create instance of Ball
export const ball = new BALL.Ball(canvas, ctx);

function resetBall() {
    ball.x = canvas.width / 2 - ball.w / 2;     //Default X Position
    ball.y = canvas.height / 2 - ball.h / 2;    //Default Y Position
    ball.speed = 4;                             //Default speed
}







//*****************************************************************************************************
// WINDOW RESIZE
//*****************************************************************************************************
//Update variables when the window is resized
window.addEventListener("resize", function() {
    //Update the height of the game's header and get rid of the decimal
    gameHeader = Math.floor(document.getElementById("Game-Header").getBoundingClientRect().height);

    //Update canvas element's size
    canvas.style.width = gameCntr.getBoundingClientRect().width + "px";
    canvas.style.height = gameCntr.getBoundingClientRect().height - gameHeader + "px";
});







//*****************************************************************************************************
// CONTROLS
//*****************************************************************************************************
//Player specific keys
const player01_Keys = {
    upPressed: false,
    downPressed: false
}

const player02_Keys = {
    upPressed: false,
    downPressed: false
}

//Key down event
window.addEventListener("keydown", function(e) {
    //---------- START GAME ----------
    if (e.code === "Space" && playing === false) {
        //The game is being played
        playing = true;
        //Show the pause button
        pauseBtn.innerText = "Pause";
        //Set the ball's initial launch
        ball.launchBall(launchRight);

        if (launchRight === false) {
            predictBallOnLaunch = true;
        }
    }
    //---------- PAUSE GAME ----------
    if (e.code === "Escape" && playing === true) {
        togglePause();
    }
    //---------- MOVE PADDLE UP ----------
    //Up Arrow being pressed
    if (e.code === "ArrowUp") {
        player01_Keys.upPressed = true;
    }
    //W Key being pressed
    if (e.code === "KeyW") {
        player02_Keys.upPressed = true;
    }
    //---------- MOVE PADDLE DOWN ----------
    //Down Arrow being pressed
    if (e.code === "ArrowDown") {
        player01_Keys.downPressed = true;
    }
    //S Key being pressed
    if (e.code === "KeyS") {
        player02_Keys.downPressed = true;
    }
});

//Key up event
window.addEventListener("keyup", function(e) {
    //---------- START GAME ----------
    if (e.code === "Space" && predictBallOnLaunch === true) {
        predictBallOnLaunch = false;
    }
    //---------- MOVE PADDLE UP ----------
    //Up Arrow no longer being pressed
    if (e.code === "ArrowUp") {
        player01_Keys.upPressed = false;
    }
    //W Key no longer being pressed
    if (e.code === "KeyW") {
        player02_Keys.upPressed = false;
    }
    //---------- MOVE PADDLE DOWN ----------
    //Down Arrow no longer being pressed
    if (e.code === "ArrowDown") {
        player01_Keys.downPressed = false;
    }
    //S Key no longer being pressed
    if (e.code === "KeyS") {
        player02_Keys.downPressed = false;
    }
});







//*****************************************************************************************************
// MENU & PAUSE BUTTONS
//*****************************************************************************************************
//Click the menu button
menuBtn.addEventListener("click", function() {
    //Check if modal is currently open before
    //running any code
    if (!modal.open) {
        //Pause the game
        if (paused === false) {
            togglePause();
        }

        //The modal is currently open
        modal.open = true;

        //Show confirmation modal
        modal.container.classList.remove("hide-modal");

        //Hide the confirmation modal
        function hideModal() {
            //The modal is currently closed
            modal.open = false;
            //Add class to hide modal
            modal.container.classList.add("hide-modal");
        }

        //Go back to the menu by clicking yes on the modal
        function backToMenu() {
            //Hide the modal
            hideModal();

            //Remove the event listeners
            removeListeners();

            //Show the menu again
            MENU.menu.classList.remove("hide-menu");
            MENU.controlsCntr.classList.remove("hide-menu");

            //Close the game loop
            closeGameLoop = true;
        }

        //Go back to the game by clicking no on the modal
        function backToGame() {
            //Unpause the game
            togglePause();

            //Hide the modal
            hideModal();

            //Remove the event listeners
            removeListeners();
        }

        //Remove all modal event listeners so there are no duplicates
        //when the modal is opened again
        function removeListeners() {
            modal.yes.removeEventListener("click", backToMenu);
            modal.no.removeEventListener("click", backToGame);
        }

        //Listen for the yes button being clicked
        modal.yes.addEventListener("click", backToMenu);

        //Listen for the no button being clicked
        modal.no.addEventListener("click", backToGame);
    }
});

//Click the pause button
pauseBtn.addEventListener("click", function() {
    //Check if the modal is open before
    //running any code
    if (!modal.open) {
        togglePause();
    }
});

//Toggle the play state
function togglePause() {
    //Toggle play state
    //Pause
    if (paused === true) {
        //Update playing boolean
        paused = false;
        //Change play button text
        pauseBtn.innerText = "Pause";
    }
    //Play
    else {
        //Update paused boolean
        paused = true;
        //Change play button text
        pauseBtn.innerText = "Resume";
    }
}

//Reset the pause button
function resetPause() {
    paused = false;
    pauseBtn.innerText = "";
}







//*****************************************************************************************************
// GAME OVER MESSAGE
//*****************************************************************************************************
function gameOverMessage(whoWon) {
    //Show who won
    gameOverModal.winner.innerText = whoWon;

    //Show the modal
    gameOverModal.container.classList.remove("hide-modal");

    //Hide the modal
    function hideModal() {
        gameOverModal.container.classList.add("hide-modal");
    }

    //Hide modal and go back to the menu
    function backToMenu() {
        //Hide the modal
        hideModal();

        //Show the menu again
        MENU.menu.classList.remove("hide-menu");
        MENU.controlsCntr.classList.remove("hide-menu");

        //Remove event listener
        removeListeners();
    }

    //Stop listening for button
    function removeListeners() {
        gameOverModal.btn.removeEventListener("click", backToMenu);
    }

    //Listen for button
    gameOverModal.btn.addEventListener("click", backToMenu);
}







//*****************************************************************************************************
// THE GAME LOOP
//*****************************************************************************************************
//Time variables
let secondsPassed;
let oldTimeStamp;

export function gameLoop(timestamp) {
    //Calculate how much time has passed
    secondsPassed = (timestamp - oldTimeStamp) / 1000;
    oldTimeStamp = timestamp;

    //If secondsPassed is NaN; Set to 0
    if (isNaN(secondsPassed)) {
        secondsPassed = 0;
    }

    //Prevent time jumps
    if (secondsPassed > 0.1) {
        secondsPassed = 0.017;
    }
    
    //------------------------------ CANVAS ACTIONS ------------------------------
    //Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //Draw the center line
    drawCenterLine();

    //--------------- PADDLES ---------------
    //Check if game is paused
    if (paused === false) {
        //Update player 01 paddle
        player01.update(secondsPassed, player01_Keys);

        //Check if player 02 is an AI before updating
        //And whether or not the game is being played
        if (MENU.playAI === true && playing === true) {
            player02.updateAI(secondsPassed);
        }
        else {
            player02.update(secondsPassed, player02_Keys);
        }

        
    }
    
    //Draw the paddles
    player01.draw();
    player02.draw();



    //--------------- BALL ---------------
    //Export paddles to the Ball class
    ball.getPaddles(player01, player02);

    //Check if game is paused and the player is playing
    if (playing === true && paused === false) {
        //Update the ball
        ball.update(secondsPassed);

        //Only predict a ball's position playing against the AI
        if (MENU.playAI === true) {
            ball.prediction();
        }
    }

    //Draw the ball
    ball.draw();
    //ball.drawPrediction();

    //--------------- SCORE ---------------
    //Check if player 1 scored
    if (ball.checkPlayer01Goal() === true) {
        //The game is not currently being played
        playing = false;

        //Reset the ball
        resetBall();

        //Increase player 01 score
        scorePlayer01++;

        //Send ball to player 02
        launchRight = false;
    }

    //Check if player 2 scored
    if (ball.checkPlayer02Goal() === true) {
        //The game is not currently being played
        playing = false;

        //Reset the ball
        resetBall();

        //Increase player 02 score
        scorePlayer02++;

        //Send ball to player 01
        launchRight = true;
    }

    updateScoreboard();

    //End the game when a player reaches 7
    if (scorePlayer01 === 7 || scorePlayer02 === 7) {
        //Player 01 wins
        if (scorePlayer01 === 7) {
            gameOverMessage("Player 01");
        }
        //Player 02 wins
        if (scorePlayer02 === 7) {
            //Check if computer is player 02
            if (MENU.playAI === true) {
                gameOverMessage("Computer");
            }
            else {
                gameOverMessage("Player 02");
            }
        }

        //Tell game to end game loop
        closeGameLoop = true;
    }

    //--------------- THE LOOP ---------------
    if (closeGameLoop === true) {
        //Reset boolean
        closeGameLoop = false;

        //Exit the loop
        return
    }

    //Recursion loop
    requestAnimationFrame(gameLoop);
}

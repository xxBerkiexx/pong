import * as ANIM from "./animationTimings.js";      //Animation timings
import * as GAME from "./game.js";                  //Get the scoreboard variables

//Predict where the ball is going to be?
let predictBall = false;

export class Ball {
    constructor(canvas, context) {
        this.canvas = canvas;                                       //Import canvas
        this.ctx = context;                                         //Import canvas context
        this.w = 10;                                                //Ball width
        this.h = this.w;                                            //Ball height = width
        this.x = this.canvas.width / 2 - this.w / 2;                //Default X Position
        this.y = this.canvas.height / 2 - this.h / 2;               //Default Y Position
        this.vx = 3;                                                //X Velocity
        this.vy = 3;                                                //Y Velocity
        this.speed = 4;                                             //Speed multiplyer
        this.color = "white";                                       //Color
        this.dt = 0;                                                //Delta time
        //Import paddles
        this.paddle01;
        this.paddle02;
        //Prediction variables
        this.futureX = undefined;                                   //Future X Position
        this.futureY = undefined;                                   //Future Y Position
        this.errorY = undefined;                                    //AI Error calculation
    }

    //Import latest paddle positions for collision detection
    getPaddles(paddle01, paddle02) {
        this.paddle01 = paddle01;
        this.paddle02 = paddle02;
    }

    //Set the initial x and y velocities and which direction it goes
    launchBall(launchRight) {
        //Maximum angle of 30deg
        let maxLaunchAngle = 2 * Math.PI / 12;

        //Get a random number between 0 and 1;
        let random = Math.random();

        //Get the angle
        let angle = maxLaunchAngle * random;

        //Determine the X velocity
        if (launchRight === true) {
            this.vx = Math.cos(angle) * this.speed;
        }
        else {
            this.vx = -Math.cos(angle) * this.speed;
        }

        this.vy = -Math.sin(angle) * this.speed;
    }

    //Check if player 01 scored
    checkPlayer01Goal() {
        if (this.x <= -10) {
            return true;
        }
        return false;
    }

    //Check if player 02 scored
    checkPlayer02Goal() {
        if (this.x + this.w >= this.canvas.width + 10) {
            return true;
        }
        return false;
    }

    //Predict where the ball will be
    prediction() {
        if (GAME.predictBallOnLaunch === true) {
            predictBall = true;
        }

        if (predictBall) {
            //------------------- FUTURE BALL POSITION -------------------
            this.futureX = this.x;          //Assign current X to futureX
            this.futureY = this.y;          //Assign current Y to futureY
            let simVx = this.vx;            //Simulate X Velocity
            let simVy = this.vy;            //Simulate Y Velocity

            while(this.futureX > this.paddle02.x + this.paddle02.w) {
                //Check for wall collisions
                if (this.futureY <= 2) {
                    simVy = -simVy;
                }
                if (this.futureY >= this.canvas.height - 2) {
                    simVy = -simVy;
                }

                this.futureX = ANIM.easeLinear(this.dt, this.futureX, simVx, 0.1);
                this.futureY = ANIM.easeLinear(this.dt, this.futureY, simVy, 0.1);
            }

            //------------------- AI ERROR -------------------
            //Get and store the current error level
            let errorLevel = GAME.getErrorLevel().aiError;
            //Calculate the error for this current prediction
            let createError = Math.random() * errorLevel - (errorLevel / 2);
            //Apple the error to the future y position
            this.errorY = this.futureY + createError;
        }

        //Turn off prediction
        predictBall = false;
    }

    drawPrediction() {
        //Draw the prediction
        this.ctx.strokeStyle = "cyan";
        this.ctx.strokeRect(this.futureX, this.futureY, this.w, this.h);

        //Draw the error
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.futureX, this.errorY, this.w, this.h);
    }

    //Main update function
    update(secondsPassed) {
        //Update delta time
        this.dt = secondsPassed;

        //Bounce off the walls
        if (this.y + this.h >= this.canvas.height - 2) {
            this.vy = -this.vy;
        }
        if (this.y <= 2) {
            this.vy = -this.vy;
        }

        //Store ball values for collision detection
        let ball = {x: this.x, y: this.y, w: this.w, h: this.h};

        //Check if there was a collision with paddle 01
        if (checkRectCollision(ball, this.paddle01).collide) {
            this.vx = -Math.cos(checkRectCollision(ball, this.paddle01).angle) * this.speed;
            this.vy = -Math.sin(checkRectCollision(ball, this.paddle01).angle) * this.speed;

            //Tell the computer to predict where the ball will be for the AI
            predictBall = true;
        }

        //Check if there was a collision with paddle 02
        if (checkRectCollision(ball, this.paddle02).collide) {
            this.vx = Math.cos(checkRectCollision(ball, this.paddle02).angle) * this.speed;
            this.vy = -Math.sin(checkRectCollision(ball, this.paddle02).angle) * this.speed;
        }

        //Update x and y positions
        this.x = ANIM.easeLinear(this.dt, this.x, this.vx, 0.01);
        this.y = ANIM.easeLinear(this.dt, this.y, this.vy, 0.01);

        //Update the speed of the ball
        this.speed += 0.001;
    }

    //Draw the ball
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}


//Compare two rectangle objects for overlap
function checkRectCollision(ball, paddle) {
    //Declare an object to return
    let object = {
        collide: false,     //Is there a collision?
        angle: undefined    //New angle to travel
    }

    //Set a maximum angle of 60deg
    let maxBounceAngle = 4 * Math.PI / 12;

    //Check for collision
    if (ball.x < paddle.x + paddle.w &&
        ball.x + ball.w > paddle.x &&
        ball.y < paddle.y + paddle.h &&
        ball.y + ball.h > paddle.y) {
        
        //Get the ball's Y value in relation to the paddle's center Y value
        //Should be a value between -35 and 35
        let relativeIntersectY = Math.floor(paddle.y + (paddle.h / 2)) - (ball.y + (ball.h / 2));

        //Adjust the relative intersection value by dividing it by half of the paddle's height
        //Should be a decimal value roughly between -1 and 1
        let adjustedRelativeIntersectY = (relativeIntersectY / (paddle.h / 2));

        //Multiply the adjusted relative intersection by the maximum bounce angle
        //to get the new angle to travel
        let bounceAngle = adjustedRelativeIntersectY * maxBounceAngle;

        object.collide = true;
        object.angle = bounceAngle

        //Is colliding
        return object;
    }

    //False by default
    return object.collide;
}
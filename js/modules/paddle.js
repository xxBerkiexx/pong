import * as ANIM from "./animationTimings.js";      //Animation timings
import * as GAME from "./game.js";

//Should the AI move the paddle?
let movePaddle = false;

export class Paddle {
    constructor(canvas, context, x, y, w, h) {
        this.canvas = canvas;                       //Import the canvas
        this.ctx = context;                         //Import canvas context
        this.w = w;                                 //Paddle width
        this.h = h;                                 //Paddle height
        this.x = x;                                 //Default X position
        this.y = y;                                 //Default Y position
        this.speed = 3;                             //Speed paddle travels
        this.color = "white";                       //Color of paddle
        this.dt = 0;                                //Delta time
        this.intersectionPoint = this.y + (this.h / 2); //Y value ball is compared to to get bounce angle
        //AI paddle variables
        this.calcCloseness = true;                  //Get how close the paddle should be to the target
        this.closeness = undefined;                 //Distance from target
        this.target = undefined;                    //Y position to travel to
    }

    //AI update function
    updateAI(secondsPassed) {
        //Start moving the paddle
        if (GAME.ball.vx < 0 && GAME.ball.x > (this.canvas.width / 2) - 20) {
            movePaddle = true;
        }

        //Skipp paddle delays if ball is launching towards the AI
        if (GAME.predictBallOnLaunch === true) {
            this.dt = 2;
        }

        //Only update if the ball is traveling towards the paddle
        if (movePaddle) {
            //Update delta time
            this.dt += secondsPassed;

            //Don't update if dt is less than delay
            //and the ball is not launching toward the AI
            if (this.dt < GAME.getErrorLevel().moveDelay) {
                return
            }

            //Get the target Y position
            this.target = GAME.ball.errorY - (this.h / 2);

            //How close does the paddle need to get to the target value
            if (this.calcCloseness) {
                //Get closeness value
                this.closeness = Math.random() * 8;

                //Turn off calculation for this prediction
                this.calcCloseness = false;
            }

            //Move paddle up
            if (this.y > this.target + this.closeness &&
                this.y > 2) {
                this.y = ANIM.easeLinear(0.017, this.y, -this.speed, 0.01);
            }
            //Move paddle down
            if (this.y < this.target - this.closeness &&
                this.y < this.canvas.height - this.h - 2) {
                this.y = ANIM.easeLinear(0.017, this.y, this.speed, 0.01);
            }

            //Check if the paddle is in the target range
            if (this.y < this.target + this.closeness &&
                this.y > this.target - this.closeness) {
                
                //Stop the paddle from moving
                movePaddle = false;

                //Reset delta time
                this.dt = 0;
            }
        }
        
    }

    //Main update function
    update(secondsPassed, key) {
        //Update delta time
        this.dt = secondsPassed;

        //Move paddle up
        if (key.upPressed === true && this.y > 2) {
            this.y = ANIM.easeLinear(this.dt, this.y, -this.speed, 0.01);
        }
        //Move paddle down
        if (key.downPressed === true && this.y < this.canvas.height - this.h - 2) {
            this.y = ANIM.easeLinear(this.dt, this.y, this.speed, 0.01);
        }

        //Update intersectionPoint
        this.intersectionPoint = this.y + (this.h / 2);
    }

    //Draw the paddle
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
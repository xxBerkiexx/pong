/**--------------------------- ANIMATION TIMING FUNCTIONS ---------------------------
 * Each function accepts arguments for the parameters; t, b, b, and d
 * 
 * t = Time             Amount of time to pass since the beginning of the animation
 * b = Begining Value   The starting point of the animation; Usually a static value
 * c = Change in Value  The amount of change needed to go from starting point to end 
 *                      point; Usually a static value
 * d = duration         Amount of time animation will take; Usually a static value
 * 
 * b, c, and d are mostly used as static settings for easing
 * t needs to be updated frequently
 * 
 * Put at top of desired file:
 * import * as ANIM from "./animationTimings.js";
*/

//Linear
export function easeLinear(t, b, c, d) {
    return c * t / d + b;
}

//Quadratic ease in
export function easeInQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
}

//Quadratic ease out 
export function easeOutQuad(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
}

//Quadratic ease in and out
export function easeInOutQuad(t, b, c, d) {
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

//Sinusoidal ease in
export function easeInSine(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}

//Sinusoidal ease out
export function easeOutSine(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

//Sinusoidal ease in and out
export function easeInOutSine(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}

//Exponential ease in
export function easeInExpo(t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
}

//Exponential ease out
export function easeOutExpo(t, b, c, d) {
    return (t == 0) ? b + c : c * (-Math.pow(2, -10 * t / d ) + 1) + b;
}

//Exponential ease in and out
export function easeInOutExpo(t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b
    }
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}

//Circular ease in
export function easeInCirc(t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
}

//Circular ease out
export function easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
}

//Circular ease in and out
export function easeInOutCirc(t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
}

//Cubic ease in
export function easeInCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
}

//Cubic ease out
export function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
}

//Cubic ease in and out
export function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

//Quartic ease in
export function easeInQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
}

//Quartic ease out
export function easeOutQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}

//Quartic ease in and out
export function easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

//Quintic ease in
export function easeInQuint(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
}

//Quintic ease out
export function easeOutQuint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}

//Quintic ease in and out
export function easeInOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}

//Elastic ease in
export function easeInElastic(t, b, c, d) {
    let s = 1.70158;
    let p = 0;
    let a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
        a = c;
        let s = p / 4;
    }
    else s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
}

//Elastic ease out
export function easeOutElastic(t, b, c, d) {
    let s = 1.70158;
    let p = 0;
    let a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
        a = c;
        let s = p / 4;
    }
    else s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
}

//Elastic ease in and out
export function easeInOutElastic(t, b, c, d) {
    let s = 1.70158;
    let p = 0;
    let a = c;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (!p) p = d * (.3 * 1.5);
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    }
    else s = p / (2 * Math.PI) * Math.asin(c / a);
    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
}

//Back ease in
export function easeInBack(t, b, c, d) {
    let s;
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
}

//Back ease out
export function easeOutBack(t, b, c, d) {
    let s;
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}

//Back ease in and out
export function easeInOutBack(t, b, c, d) {
    let s;
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}
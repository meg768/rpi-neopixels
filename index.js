var ws281x = require('rpi-ws281x');
var Pixels = require('rpi-pixels');


module.exports.Strip = require('./src/strip.js');
module.exports.Matrix = require('./src/matrix.js');
module.exports.Animation = require('./src/animation.js');
module.exports.AnimationQueue = require('./src/animation-queue.js');


var WIDTH = undefined;
var HEIGHT = undefined;

module.exports.configure = function(options) {

    var {width, height, ...other} = options;

    WIDTH = width;
    HEIGHT = height;

    ws281x.configure({leds: width * height, ...other});
}

module.exports.Pixels = class extends Pixels {

    constructor(options = {}) {
        super({...options, width:WIDTH, height:HEIGHT});
    }

    render(options) {
        ws281x.render(this.pixels);
    }

}
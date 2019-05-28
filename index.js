var ws281x = require('rpi-ws281x');
var Pixels = require('rpi-pixels');


module.exports.Strip = require('./src/strip.js');
module.exports.Matrix = require('./src/matrix.js');
module.exports.Animation = require('./src/animation.js');
module.exports.AnimationQueue = require('./src/animation-queue.js');

var config = {};

module.exports.configure = function(options) {

    var {map, width, height, ...other} = options;

    config = {map:map, width:width, height:height};

    ws281x.configure({leds: width * height, ...other});
}

module.exports.Pixels = class extends Pixels {

    constructor(options = {}) {
        super({...options, width:config.width, height:config.height});
    }

    map(pixels, map) {
        var length = this.width * this.height;
        var tmp = new Uint32Array(length);
        
        for (var i = 0; i < length; i++) {
            tmp[i] = pixels[map[i]];
        }

        return tmp;
    }

    render(options) {
        if (config.map)
            ws281x.render(this.map(this.pixels, config.map));
        else
            ws281x.render(this.pixels);
    }

}
var ws281x = require('rpi-ws281x');
var Pixels = require('rpi-pixels');


module.exports.Strip = require('./src/strip.js');
module.exports.Matrix = require('./src/matrix.js');
module.exports.Animation = require('./src/animation.js');
module.exports.AnimationQueue = require('./src/animation-queue.js');

var config = {};

module.exports.configure = function(options) {

    var {map, width, height, ...other} = options;

    if (typeof map == 'string') {
        if (map == 'alternating') {
            map = new Uint16Array(width * height);

            for (var i = 0; i < map.length; i++) {
                var row = Math.floor(i / width), col = i % width;
        
                if ((row % 2) === 0) {
                    map[i] = i;
                }
                else {
                    map[i] = (row+1) * width - (col+1);
                }
            }        
        }
    }

    config = {map:map, width:width, height:height};

    ws281x.configure({leds: width * height, ...other});
}

module.exports.Pixels = class extends Pixels {

    constructor(options = {}) {
        super({...options, width:config.width, height:config.height});
    }

    map() {
        if (config.map) {
            var map = config.map;
            var length = this.width * this.height;
            var tmp = new Uint32Array(length);
            var pixels = this.pixels;
            
            for (var i = 0; i < length; i++) {
                tmp[i] = pixels[map[i]];
            }
    
            return tmp;
        }
        else
            return this.pixels;
    }

    render(options) {
        ws281x.render(this.map());
    }

}
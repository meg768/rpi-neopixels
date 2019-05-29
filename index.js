var ws281x = require('rpi-ws281x');
var Pixels = require('rpi-pixels');
var sprintf = require('yow/sprintf');

function debug() {
    console.log.apply(this, arguments);

}


/*
module.exports.Strip = require('./src/strip.js');
module.exports.Matrix = require('./src/matrix.js');
module.exports.Animation = require('./src/animation.js');
module.exports.AnimationQueue = require('./src/animation-queue.js');
*/

var config = {};


function installCleanup() {

	function cleanup() {
		ws281x.reset();
		process.exit();
	}

	process.on('SIGUSR1', cleanup);
	process.on('SIGUSR2', cleanup);
	process.on('SIGINT',  cleanup);
	process.on('SIGTERM', cleanup);

}

module.exports.configure = function(options) {

    var {map, width, height, ...other} = options;


    if (options.debug) {
        debug = function() {
            console.log.apply(this, arguments);
        }
    }
    if (typeof map == 'string') {
        if (map == 'matrix') {
            map = new Uint32Array(width * height);

            for (var i = 0; i < map.length; i++) 
                map[i] = i;

        }
        else if (map == 'alternating-matrix') {
            map = new Uint32Array(width * height);

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

    ws281x.configure({map:map, leds: width * height, ...other});
}

module.exports.Pixels = class extends Pixels {

    constructor(options = {}) {
        super({...options, width:config.width, height:config.height});

		this.length  = this.width * this.height;
		this.content = new Uint32Array(this.length);
		this.tmp     = new Uint32Array(this.length);
		this.speed   = options.speed ? options.speed : 1.0;

    }


	render(options) {

		var tmp = this.tmp;

        debug('Rendering...');

		if (options && options.transition == 'fade') {

			var duration = options.duration != undefined ? options.duration : 100;

            debug('Fading...', duration);

			if (duration > 0) {

				var content = this.content;
				var pixels  = this.pixels;
				var length  = this.length;

				var numSteps = duration * this.speed;
				var then     = new Date();

				for (var step = 0; step < numSteps; step++) {
					for (var i = 0; i < length; i++) {

						var r1 = (content[i] & 0xFF0000) >> 16;
						var g1 = (content[i] & 0x00FF00) >> 8;
						var b1 = (content[i] & 0x0000FF);

						var r2 = (pixels[i] & 0xFF0000) >> 16;
						var g2 = (pixels[i] & 0x00FF00) >> 8;
						var b2 = (pixels[i] & 0x0000FF);

						var red   = (r1 + (step * (r2 - r1)) / numSteps);
						var green = (g1 + (step * (g2 - g1)) / numSteps);
						var blue  = (b1 + (step * (b2 - b1)) / numSteps);

						tmp[i] = (red << 16) | (green << 8) | blue;
					}

					ws281x.render(tmp);
				}

				var now  = new Date();
				var time = now - then;

				debug(sprintf('Transition "%s %d" took %d milliseconds to run.', options.transition, duration, time));

				// Adjust speed factor
				if (options.speed == undefined) {
					var speed = (this.speed * duration) / time;
					this.speed = (this.speed + speed) / 2;
					debug(sprintf('Adjusting speed factor to %02f', this.speed));
				}

			}
		}

		// Save rgb buffer
		this.content.set(this.pixels);

		// Display the current buffer
		ws281x.render(this.content);

	}

    render() {
        ws281x.render(this.pixels);
    }

}

installCleanup();
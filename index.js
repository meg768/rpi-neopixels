var ws281x = require('rpi-ws281x');
var Pixels = require('rpi-pixels');
var sprintf = require('yow/sprintf');
var isFunction = require('yow/is').isFunction;

var debug = function() {};
var config = {};


class Neopixels extends Pixels {

    constructor(options = {}) {
        super({...options, width:config.width, height:config.height});

		this.length  = this.width * this.height;
		this.content = new Uint32Array(this.length);
		this.tmp     = new Uint32Array(this.length);
		this.speed   = options.speed ? options.speed : 0.5;

    }

	render(options) {

		var tmp = this.tmp;

		if (options && options.transition == 'fade') {

			var duration = options.duration != undefined ? options.duration : 100;

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
		ws281x.render(this.pixels);

	}


}

Neopixels.configure = function(options) {

    var {width, height} = options;

	module.exports.isFunction = function(obj) {
		return typeof obj === 'function';
	};

    if (options.debug) {
		debug = function() {
			console.log.apply(this, arguments);
		}

		if (isFunction(options.debug)) {
			debug = options.debug;
		}
	}
	
	if (width == undefined || height == undefined)
		throw new Error('Both width and height must be specified.');

	ws281x.configure(config = options);
}


module.exports = Neopixels;

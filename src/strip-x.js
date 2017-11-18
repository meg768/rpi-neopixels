var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var sprintf  = require('yow/sprintf');
var ws281x   = require('rpi-ws281x-native');
var Color    = require('color');

function debug() {
}


module.exports = class Strip {

	constructor(options) {
		var self = this;

		options = Object.assign({}, options);

		function exit() {
			ws281x.render(new Uint32Array(self.length));
			process.exit();

		}

		if (options.debug) {
			debug = function() {
				console.log.apply(this, arguments);
			}
		}

		if (options.length == undefined)
			throw new Error('Strip length must be specified.');


		process.on('SIGUSR1', exit);
		process.on('SIGUSR2', exit);
		process.on('SIGINT',  exit);
		process.on('SIGTERM', exit);

		this.length  = options.length;
		this.pixels  = new Uint32Array(this.length);
		this.content = new Uint32Array(this.length);
		this.speed   = options.speed ? options.speed : 1.0;

		ws281x.init(this.length);
	}

	fill(color) {

		if (isString(color))
			color = Color(color).rgbNumber();

		for (var i = 0; i < this.length; i++)
			this.pixels[i] = color;
	}

	clear() {
		this.fill(0);
	}

	setPixel(index, color) {
		this.pixels[index] = color;
	}

	getPixel(index) {
		return this.pixels[index];
	}

	setPixelRGB(index, red, green, blue) {
		this.pixels[index] = (red << 16) | (green << 8) | blue;
   }

   setPixelHSL(index, h, s, l) {
	   _pixels[index] = Color.hsl(h, s, l).rgbNumber();
   }

	render(options) {

		var tmp = new Uint32Array(this.length);

		if (options && options.transition == 'fade') {
			var duration = options.duration != undefined ? options.duration : 100;

			if (duration > 0) {
				var numSteps = duration * this.speed;
				var then     = new Date();

				for (var step = 0; step < numSteps; step++) {
					for (var i = 0; i < _length; i++) {

						var r1 = (this.content[i] & 0xFF0000) >> 16;
						var g1 = (this.content[i] & 0x00FF00) >> 8;
						var b1 = (this.content[i] & 0x0000FF);

						var r2 = (this.pixels[i] & 0xFF0000) >> 16;
						var g2 = (this.pixels[i] & 0x00FF00) >> 8;
						var b2 = (this.pixels[i] & 0x0000FF);

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
		tmp.set(this.content);
		ws281x.render(tmp);

	}


};

var sprintf = require('yow/sprintf');
var Pixels = require('rpi-pixels');
var ws281x = require('rpi-ws281x-native');

class Neopixels extends Pixels {
	constructor(options) {
		super(options);

		function cleanup() {
			ws281x.reset();
			ws281x.finalize();
			process.exit();
		}

		this.channel = ws281x(this.width * this.height, options);
		this.content = new Uint32Array(this.width * this.height);
		this.tmp = new Uint32Array(this.width * this.height);
		this.speed = 0.5;
		this.debug = typeof options.debug == 'function' ? options.debug : options.debug ? console.log : function () {};
		this.gamma = options.gamma != undefined ? options.gamma : 2.2;

		process.on('SIGUSR1', cleanup);
		process.on('SIGUSR2', cleanup);
		process.on('SIGINT', cleanup);
		process.on('SIGTERM', cleanup);
	}

	renderRaw(pixels) {
		this.channel.array.set(Neopixels.gammaCorrect(pixels, this.gamma));
		ws281x.render();
	}

	render(options) {
		var tmp = this.tmp;
		var pixels = this.pixels;

		if (options && options.transition == 'fade') {
			var duration = options.duration != undefined ? options.duration : 100;

			if (duration > 0) {
				var content = this.content;
				var pixels = this.pixels;
				var length = this.content.length;

				var numSteps = duration * this.speed;
				var then = new Date();

				for (var step = 0; step < numSteps; step++) {
					for (var i = 0; i < length; i++) {
						var r1 = (content[i] & 0xff0000) >> 16;
						var g1 = (content[i] & 0x00ff00) >> 8;
						var b1 = content[i] & 0x0000ff;

						var r2 = (pixels[i] & 0xff0000) >> 16;
						var g2 = (pixels[i] & 0x00ff00) >> 8;
						var b2 = pixels[i] & 0x0000ff;

						var red = r1 + (step * (r2 - r1)) / numSteps;
						var green = g1 + (step * (g2 - g1)) / numSteps;
						var blue = b1 + (step * (b2 - b1)) / numSteps;

						tmp[i] = (red << 16) | (green << 8) | blue;
					}

					this.renderRaw(tmp);
				}

				var now = new Date();
				var time = now - then;

				this.debug(sprintf('Transition "%s %d" took %d milliseconds to run.', options.transition, duration, time));

				// Adjust speed factor
				if (options.speed == undefined) {
					var speed = (this.speed * duration) / time;
					this.speed = (this.speed + speed) / 2;
					this.debug(sprintf('Adjusting speed factor to %02f', this.speed));
				}
			}
		}

		// Save rgb buffer
		this.content.set(this.pixels);

		// Display the current buffer
		this.renderRaw(this.pixels);
	}
}

module.exports = Neopixels;

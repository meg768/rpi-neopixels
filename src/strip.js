var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var sprintf  = require('yow/sprintf');
var Color    = require('color');
var ws281x   = require('rpi-ws281x-native');

function debug() {
}


module.exports = function NeopixelStrip(options) {

	options = Object.assign({}, options);

	if (options.debug) {
		debug = function() {
			console.log.apply(this, arguments);
		}
	}

	if (options.length == undefined)
		throw new Error('Length of strip must be specified.');

	var _this          = this;
	var _speed         = options.speed ? options.speed : 1.0;
	var _length        = options.length;
	var _strip         = require('rpi-ws281x-native');
	var _pixels        = new Uint32Array(_length);
	var _content       = new Uint32Array(_length);

	_this.length = _length;

	function exit() {
		_strip.render(new Uint32Array(_length));
		process.exit();

	}

	process.on('SIGUSR1', exit);
	process.on('SIGUSR2', exit);
	process.on('SIGINT', exit);
	process.on('SIGTERM', exit);


	_this.fill = function(color) {

		if (isString(color))
			color = Color(color).rgbNumber();

		for (var i = 0; i < _length; i++)
			_pixels[i] = color;
	}

	_this.fillRGB = function(red, green, blue) {
		_this.fill((red << 16) | (green << 8) | blue);
	}

	_this.clear = function() {
		_this.fill(0);
	}

	_this.setPixel = function(index, color) {
		_pixels[index] = color;
	}

	_this.getPixel = function(index) {
		return _pixels[index];
	}


	_this.setPixelRGB = function(index, red, green, blue) {
 		_pixels[index] = (red << 16) | (green << 8) | blue;
	}

	_this.setPixelHSL = function(index, h, s, l) {
		_pixels[index] = Color.hsl(h, s, l).rgbNumber();
	}

	_this.getPixel = function(index) {
		return _pixels[index];
	}

	_this.render = function(options) {

		var tmp = new Uint32Array(_length);

		if (options && options.transition == 'fade') {
			var duration = options.duration != undefined ? options.duration : 100;

			if (duration > 0) {
				var numSteps = duration * _speed;
				var then     = new Date();

				for (var step = 0; step < numSteps; step++) {
					for (var i = 0; i < _length; i++) {

						var r1 = (_content[i] & 0xFF0000) >> 16;
						var g1 = (_content[i] & 0x00FF00) >> 8;
						var b1 = (_content[i] & 0x0000FF);

						var r2 = (_pixels[i] & 0xFF0000) >> 16;
						var g2 = (_pixels[i] & 0x00FF00) >> 8;
						var b2 = (_pixels[i] & 0x0000FF);

						var red   = (r1 + (step * (r2 - r1)) / numSteps);
						var green = (g1 + (step * (g2 - g1)) / numSteps);
						var blue  = (b1 + (step * (b2 - b1)) / numSteps);

						tmp[i] = (red << 16) | (green << 8) | blue;
					}

					_strip.render(tmp);
				}

				var now  = new Date();
				var time = now - then;

				debug(sprintf('Transition "%s %d" took %d milliseconds to run.', options.transition, duration, time));

				// Adjust speed factor
				if (options.speed == undefined) {
					var speed = (_speed * duration) / time;
					_speed = (_speed + speed) / 2;
					debug(sprintf('Adjusting speed factor to %02f', _speed));
				}

			}
		}

		// Save rgb buffer
		_content.set(_pixels);

		// Display the current buffer
		tmp.set(_pixels);
		_strip.render(tmp);

	}



	function init() {
		_strip.init(_length);

		/*
		var map = new Uint16Array(_length);

	    for (var i = 0; i < map.length; i++) {
	        var row = Math.floor(i / _width), col = i % _width;

	        if ((row % 2) === 0) {
	            map[i] = i;
	        }
			else {
	            map[i] = (row+1) * _width - (col+1);
	        }
	    }

		_strip.setIndexMapping(map);
		*/

	}

	init();

};

/*
function exit() {
	ws281x.reset();
	process.exit();

}

module.exports = class Strip {

	constructor(options) {


		process.on('SIGUSR1', exit);
		process.on('SIGUSR2', exit);
		process.on('SIGINT',  exit);
		process.on('SIGTERM', exit);

		options = Object.assign({}, options);

		if (options.debug) {
			debug = function() {
				console.log.apply(this, arguments);
			}
		}

		if (options.length == undefined)
			throw new Error('Strip length must be specified.');

		this.length  = options.length;
		this.pixels  = new Uint32Array(this.length);
		this.content = new Uint32Array(this.length);
		this.tmp     = new Uint32Array(this.length);
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
		this.pixels[index] = Color.hsl(h, s, l).rgbNumber();
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
		tmp.set(this.content);
		ws281x.render(tmp);

	}


};

*/

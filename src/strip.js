var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;


module.exports = function NeopixelStrip(options) {

	var Color = require('color');

	options = options || {};

	if (options.width == undefined || options.height == undefined)
		throw new Error('Width and height (or length) of strip must be specified.');

	var _this          = this;

	var _width         = options.width;
	var _height        = options.height;
	var _speed         = options.speed ? options.speed : 1.0;
	var _length        = _width * _height;
	var _strip         = require('rpi-ws281x-native');
	var _pixels        = new Uint32Array(_length);

	_this.length = _length;
	_this.width  = _width;
	_this.height = _height;

	function debug() {
		if (options.debug)
			console.log.apply(this, arguments);
	}

	function exit() {
		_strip.render(new Uint32Array(_length));
		process.exit();

	}

	process.on('SIGUSR1', exit);
	process.on('SIGUSR2', exit);
	process.on('SIGINT', exit);
	process.on('SIGTERM', exit);

	_this.render = function(pixels, options) {

		var tmp = new Uint32Array(_length);

		if (options && options.transition == 'fade') {
			var duration = options.duration ? options.duration : 100;
			var numSteps = duration * _speed;
			var timer    = new Date();

			for (var step = 0; step < numSteps; step++) {
				for (var i = 0; i < _length; i++) {

					var r1 = (_pixels[i] & 0xFF0000) >> 16;
					var g1 = (_pixels[i] & 0x00FF00) >> 8;
					var b1 = (_pixels[i] & 0x0000FF);

					var r2 = (pixels[i] & 0xFF0000) >> 16;
					var g2 = (pixels[i] & 0x00FF00) >> 8;
					var b2 = (pixels[i] & 0x0000FF);

					var red   = (r1 + (step * (r2 - r1)) / numSteps);
					var green = (g1 + (step * (g2 - g1)) / numSteps);
					var blue  = (b1 + (step * (b2 - b1)) / numSteps);

					tmp[i] = (red << 16) | (green << 8) | blue;
				}

				_strip.render(tmp);
			}

			var now = new Date();

			debug('Fade', options.duration, 'took', now - timer, 'milliseconds');

		}

		// Save rgb buffer
		_pixels.set(pixels);

		// Display the current buffer
		tmp.set(_pixels);
		_strip.render(tmp);

	}



	function init() {
		_strip.init(_length);

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


	}

	init();

};

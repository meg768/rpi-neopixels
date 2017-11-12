



module.exports = function NeopixelStrip(options) {

	var Color = require('color');

	var isString = require('yow/is').isString;
	var isObject = require('yow/is').isObject;
	var Pixels   = require('./pixels.js');

	options = options || {};

	if (options.width == undefined || options.height == undefined)
		throw new Error('Width and height of strip must be specified.');

	var _this          = this;         // That

	var _width         = options.width;
	var _height        = options.height;
	var _length        = _width * _height;
	var _strip         = require('rpi-ws281x-native');
	var _pixels        = new Uint32Array(_length);
	var _canvas        = new Uint32Array(_length);

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


	_this.fill = function(color) {
		for (var i = 0; i < _length; i++)
			_canvas[i] = color;
	}

	_this.fillRGB = function(red, green, blue) {
		_this.fill((red << 16) | (green << 8) | blue);
	}

	_this.clear = function() {
		_this.fill(0);
	}

	_this.setPixelAtIndex = function(index, color) {
		_canvas[index] = color;
	}

	_this.getPixelAtIndex = function(index) {
		return _canvas[index];
	}

	_this.setPixel = function(x, y, color) {
		_canvas[y * _width + x] = color
	}

	_this.setPixelRGB = function(x, y, red, green, blue) {
 		_canvas[y * _width + x] = (red << 16) | (green << 8) | blue;
	}

	_this.setPixelHSL = function(x, y, h, s, l) {
		_canvas[y * _width + x] = Color.hsl(h, s, l).rgbNumber();
	}

	_this.getPixel = function(x, y) {
		return _canvas[y * _width + x];
	}

	_this.render = function(options) {

		var tmp = new Uint32Array(_length);

		if (options && options.fadeIn) {
			var factor   = 1.4; //0.17
			var numSteps = options.fadeIn * factor;
			var timer    = new Date();

			for (var step = 0; step < numSteps; step++) {
				for (var i = 0; i < _length; i++) {

					var r1 = (_pixels[i] & 0xFF0000) >> 16;
					var g1 = (_pixels[i] & 0x00FF00) >> 8;
					var b1 = (_pixels[i] & 0x0000FF);

					var r2 = (_canvas[i] & 0xFF0000) >> 16;
					var g2 = (_canvas[i] & 0x00FF00) >> 8;
					var b2 = (_canvas[i] & 0x0000FF);

					var red   = (r1 + (step * (r2 - r1)) / numSteps);
					var green = (g1 + (step * (g2 - g1)) / numSteps);
					var blue  = (b1 + (step * (b2 - b1)) / numSteps);

					tmp[i] = (red << 16) | (green << 8) | blue;
				}

				_strip.render(tmp);
			}

			var now = new Date();

			debug('Fade', options.fadeIn, 'took', now - timer, 'milliseconds');

		}

		// Save rgb buffer
		_pixels.set(_canvas);

		// Display the current buffer
		tmp.set(_pixels);
		_strip.render(tmp);

	}



	function init() {
		_strip.init(_length);

		var map = new Uint16Array(_length);

	    for(var i = 0; i < map.length; i++) {
	        var row = Math.floor(i / _width), col = i % _width;

	        if((row % 2) === 0) {
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

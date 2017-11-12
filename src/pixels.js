


module.exports = function Pixels(options) {

	var Color    = require('color');
	var isString = require('yow/is').isString;
	var isObject = require('yow/is').isObject;

	options = options || {};

	if (options.width == undefined || options.height == undefined)
		throw new Error('Size of matrix or strip must be specified');

	var _this   = this;
	var _width  = options.width;
	var _height = options.height;
	var _length = _width * _height;
	var _pixels = new Uint32Array(_width * _height);

	_this.fill = function(color) {
		for (var i = 0; i < _length; i++)
			_pixels[i] = color;
	}

	_this.fillRGB = function(red, green, blue) {
		_this.fill((red << 16) | (green << 8) | blue);
	}

	_this.clear = function() {
		_this.fill(0);
	}

	_this.setPixelAtIndex = function(index, color) {
		_pixels[index] = color;
	}

	_this.getPixelAtIndex = function(index) {
		return _pixels[index];
	}

	_this.setPixel = function(x, y, color) {
		_pixels[y * _width + x] = color
	}

	_this.setPixelRGB = function(x, y, red, green, blue) {
 		_pixels[y * _width + x] = (red << 16) | (green << 8) | blue;
	}

	_this.setPixelHSL = function(x, y, h, s, l) {
		_pixels[y * _width + x] = Color.hsl(h, s, l).rgbNumber();
	}

	_this.getPixel = function(x, y) {
		return _pixels[y * _width + x];
	}

	_this.setPixels = function(pixels) {
		_pixels.set(pixels);
	}

	_this.getPixels = function() {
		return _pixels;
	}

	_this.toUint32Array = function() {
		return _pixels;
	}




};

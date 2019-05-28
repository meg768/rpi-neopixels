var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var sprintf  = require('yow/sprintf');
var ws281x   = require('rpi-ws281x');
var Color    = require('color');
var Strip    = require('./strip.js');

function debug() {
}


module.exports = class Matrix extends Strip {

	constructor(options) {
        if (options.width == undefined || options.height == undefined)
            throw new Error('Width and height must be specified.');

		options = Object.assign({}, options, {length:options.width*options.height});

        super(options);

		if (options.debug) {
			debug = function() {
				console.log.apply(this, arguments);
			}
        }

        this.width  = options.width;
        this.height = options.height;

		var map = new Uint16Array(this.length);

        for (var i = 0; i < map.length; i++) {
            var row = Math.floor(i / this.width), col = i % this.width;

            if ((row % 2) === 0) {
                map[i] = i;
            }
            else {
                map[i] = (row+1) * this.width - (col+1);
            }
        }

        //ws281x.setIndexMapping(map);
	}

	setPixel(x, y, color) {
		this.pixels[y * this.width + x] = color;
	}

	setPixelRGB(x, y, red, green, blue) {
 		this.pixels[y * this.width + x] = (red << 16) | (green << 8) | blue;
	}

	setPixelHSL(x, y, h, s, l) {
		this.pixels[y * this.width + x] = Color.hsl(h, s, l).rgbNumber();
	}


};

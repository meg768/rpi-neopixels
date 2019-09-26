var Neopixels = require('../index.js');
var sprintf = require('yow/sprintf');

function debug() {

    var date  = new Date();
    var args = Array.prototype.slice.call(arguments);

    args.unshift(sprintf('%04d-%02d-%02d %02d:%02d.%02d:', date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

    console.log.apply(this, args);	
}


function cleanup() {
    console.log('Cleaning up...');
    var pixels = new Neopixels();

    pixels.fill('black');
    pixels.render();
    
    process.exit();
}

var stripType = 'grb';
var leds      = 24;

Neopixels.configure({leds:leds, debug:debug, stripType:stripType});

process.on('SIGUSR1', cleanup);
process.on('SIGUSR2', cleanup);
process.on('SIGINT',  cleanup);
process.on('SIGTERM', cleanup);

module.exports = Neopixels;
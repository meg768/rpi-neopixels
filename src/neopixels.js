var Neopixels = require('../index.js');


function configure() {

    var stripType = 'grb';
    var width     = 13;
    var height    = 13;
    var map       = 'alternating-matrix';

    Neopixels.configure({debug:false, map:map, width:width, height:height, stripType:stripType});

}

configure();

module.exports = Neopixels;
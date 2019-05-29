var Neopixels = require('../index.js');

function configure() {

    function installCleanup() {

        function cleanup() {
            var pixels = new Neopixels.Pixels();
    
            pixels.fill('black');
            pixels.render();
            
            process.exit();
        }
    
        process.on('SIGUSR1', cleanup);
        process.on('SIGUSR2', cleanup);
        process.on('SIGINT',  cleanup);
        process.on('SIGTERM', cleanup);
    
    }
    
    var stripType = 'grb';
    var width     = 13;
    var height    = 13;
    var map       = 'alternating-matrix';

    Neopixels.configure({debug:false, map:map, width:width, height:height, stripType:stripType});

    installCleanup();

}


configure();

module.exports = Neopixels;
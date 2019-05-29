var Neopixels = require('./index.js');


function configure() {

    var stripType = 'grb';
    var width     = 13;
    var height    = 13;
    var map       = 'alternating-matrix';

    Neopixels.configure({map:map, width:width, height:height, stripType:stripType});

}

class FillTest {

    constructor() {

        this.pixels = new Neopixels.Pixels();

    }

    run() {
        this.pixels.fill("green");
        this.pixels.render();


    }
}

class SequenceTest {

    constructor() {

        this.pixels = new Neopixels.Pixels();
        this.offset = 0;

    }

    loop() {
        var x = this.offset % this.pixels.width;
        var y = Math.floor(this.offset / this.pixels.width);

        this.pixels.clear();
        this.pixels.setPixelRGB(x, y, 255, 255, 255);
        this.pixels.render();

        this.offset = (this.offset + 1) % (this.pixels.width * this.pixels.height);

    }

    run() {
        setInterval(this.loop.bind(this), 100);
    }
}



configure();

var app = new SequenceTest();
app.run();


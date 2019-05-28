var Neopixels = require('./index.js');


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


    run() {
        var self = this;
        setInterval(() => {
            var x = self.offset % self.pixels.width;
            var y = Math.floor(self.offset / self.pixels.width);
            console.log('Loop', self.offset, x, y);
            self.pixels.clear();
            self.pixels.setPixelRGB(x, y, 255, 255, 255);
            self.pixels.render();
    
            self.offset = (self.offset + 1) % (self.pixels.width * self.pixels.height);
    
        }, 100);


    }
}

function configure() {

    var stripType = 'grb';
    var width     = 13;
    var height    = 13;
    var map       = new Uint16Array(width * height);

    for (var i = 0; i < map.length; i++) {
        var row = Math.floor(i / width), col = i % width;

        if ((row % 2) === 0) {
            map[i] = i;
        }
        else {
            map[i] = (row+1) * width - (col+1);
        }
    }

    Neopixels.configure({map:map, width:width, height:height, stripType:stripType});

}


configure();

var app = new SequenceTest();
app.run();


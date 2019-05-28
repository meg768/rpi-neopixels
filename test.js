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

        console.log('Pixels', this.pixels.width, this.pixels.height);
    }


    run() {
        var self = this;
        setInterval(() => {
            var x = self.offset % self.pixels.width;
            var y = self.offset / self.pixels.width;
            console.log('Loop', self.offset, x, y);
            self.pixels.clear();
            self.pixels.setPixelRGB(x, y, 255, 255, 255);
            self.pixels.render();
    
            self.offset = (self.offset + 1) % (self.pixels.width * self.pixels.height);
    
        }, 100);


    }
}



Neopixels.configure({width:13, height:13, stripType:'grb'});

var app = new SequenceTest();
app.run();


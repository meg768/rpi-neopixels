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

    loop() {
        var x = this.offset % this.width;
        var y = this.offset / this.width;
console.log('Loop', this.offset);
        this.pixels.clear();
        this.pixels.setPixelRGB(x, y, 255, 255, 255);
        this.pixels.render();

        this.offset = (this.offset + 1) % (this.width * this.height);
    }

    run() {
        setInterval(this.loop.bind(this), 100);


    }
}



Neopixels.configure({width:13, height:13, stripType:'grb'});

var app = new SequenceTest();
app.run();


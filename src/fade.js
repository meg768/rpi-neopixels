require('./configure.js');

var Neopixels = require('../index.js');



class App {

    constructor() {

        this.pixels = new Neopixels.Pixels();
        this.offset = 0;

    }


    run() {
        this.pixels.fill('red');
        this.pixels.render({transition:'fade', duration:500});
        this.pixels.fill('green');
        this.pixels.render({transition:'fade', duration:500});
        this.pixels.fill('blue');
        this.pixels.render({transition:'fade', duration:500});
        this.pixels.fill('black');
        this.pixels.render({transition:'fade', duration:500});

    }
}



var app = new FadeTest();
app.run();


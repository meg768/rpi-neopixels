var Neopixels = require('./index.js');


class App {

    constructor() {

        this.pixels = new Neopixels.Pixels();

    }

    run() {
        this.pixels.fill("red");


    }
}



Neopixels.configure({width:13, height:13});

var app = new App();
app.run();


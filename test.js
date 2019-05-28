var Neopixels = require('./index.js');


class App {

    constructor() {

        this.pixels = new Neopixels.Pixels();

    }

    run() {
        this.pixels.fill("blue");
        this.pixels.render();


    }
}



Neopixels.configure({width:13, height:13});

var app = new App();
app.run();


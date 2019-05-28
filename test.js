var Neopixels = require('./index.js');


class App {

    constructor() {

        this.pixels = new Neopixels.Pixels();

    }

    run() {
        this.pixels.fill("green");
        this.pixels.render();


    }
}



Neopixels.configure({width:13, height:13, stripType:'grb'});

var app = new App();
app.run();


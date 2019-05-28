var Neopixels = require('./index.js');


class App {

    constructor() {

        this.pixels = new Neopixels.Pixels();

    }

    run() {
        this.pixels.fill("red");
        this.pixels.render();


    }
}



Neopixels.configure({width:13, height:13, stripType:'rgb'});

var app = new App();
app.run();


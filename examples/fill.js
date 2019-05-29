var Neopixels = require('./neopixels.js');


class App {

    constructor() {

        this.pixels = new Neopixels.Pixels();

    }

    run() {
        this.pixels.fill('red');
        this.pixels.render();

    }
}


var app = new App();
app.run();


var Neopixels = require('./neopixels.js');


class App {

    constructor() {
        this.pixels = new Neopixels();
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

var app = new App();
app.run();


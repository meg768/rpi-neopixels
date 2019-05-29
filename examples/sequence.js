var Neopixels = require('./neopixels.js');

function installCleanup() {

	function cleanup() {
        var pixels = new Neopixels.Pixels();

        pixels.fill('red');
        pixels.render();
        
        process.exit();
	}

	process.on('SIGUSR1', cleanup);
	process.on('SIGUSR2', cleanup);
	process.on('SIGINT',  cleanup);
	process.on('SIGTERM', cleanup);

}

class App {

    constructor() {

        installCleanup();

        this.pixels = new Neopixels.Pixels();
        this.offset = 0;

    }

    loop() {
        var x = this.offset % this.pixels.width;
        var y = Math.floor(this.offset / this.pixels.width);

        this.pixels.clear();
        this.pixels.setPixelRGB(x, y, 255, 255, 255);
        this.pixels.render();

        this.offset = (this.offset + 1) % (this.pixels.width * this.pixels.height);

    }

    run() {
        setInterval(this.loop.bind(this), 100);
    }
}


var app = new App();
app.run();


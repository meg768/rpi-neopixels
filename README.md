# rpi-neopixels
Neopixels for Raspberry Pi. Under construction.

### Strip

````javascript
var Strip = require('rpi-neopixels').Strip;
var Pixels = require('rpi-neopixels').Pixels;

var strip = new Strip({width:13, height:13});
var pixels = new Pixels(strip);

pixels.fill('red');
pixels.render();

````

#### Methods

### Pixels

#### Methods

    setPixel(x, y, color)



### Animation

#### Methods

### AnimationQueue

#### Methods

    enqueue(animation)

    dequeue()

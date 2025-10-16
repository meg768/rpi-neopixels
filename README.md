# rpi-neopixels

Neopixels for Raspberry Pi.

## Features

- Lightweight helpers for WS281x / NeoPixel control on Raspberry Pi
- Intuitive API for configure → render → reset
- Supports **RGB** and **RGBW** pixel packing (0xWWRRGGBB / 0x00RRGGBB)
- TypedArray-friendly: `Uint32Array` buffers
- Optional serpentine mapping helpers for matrices

## Installation

```bash
npm install rpi-neopixels
```

## Quick Start

```js
const neopixels = require('rpi-neopixels');

(async () => {
  await neopixels.configure({
    leds: 64,
    gpio: 18,
    brightness: 128,
    stripType: 'rgb', // or 'grb', 'rgbw'
  });

  const pixels = new Uint32Array(64);
  for (let i = 0; i < pixels.length; i++) pixels[i] = 0x00FF0000; // red
  await neopixels.render(pixels);

  await neopixels.reset();
})();
```

## API

### `configure(options)`
- `leds` (number): Total LEDs
- `gpio` (number): BCM pin (e.g., 18)
- `brightness` (0–255): Global brightness
- `stripType` (string): `rgb`, `grb`, `rgbw`, etc.
- `width`/`height` (optional): matrix sizes
- `map` (`Uint32Array` or `'serpentine'`, optional)

### `render(pixels)`
- `pixels` (`Uint32Array`): Packed colors as `0xWWRRGGBB` (RGBW) or `0x00RRGGBB` (RGB)

### `reset()`
- Turn LEDs off and release resources

---

## Files & Modules

- Root: `/mnt/data/rpi-neopixels_project`
- package.json: `rpi-neopixels/package.json`

#### `rpi-neopixels/index-native.js`
- **Exports**: Neopixels
- **Symbols**: Neopixels, cleanup

#### `rpi-neopixels/index.js`
- **Exports**: Neopixels
- **Symbols**: Neopixels

#### `rpi-neopixels/examples/sequence.js`
- **Symbols**: App

#### `rpi-neopixels/examples/neopixels.js`
- **Exports**: Neopixels
- **Symbols**: cleanup, debug

#### `rpi-neopixels/examples/fill.js`
- **Symbols**: App

#### `rpi-neopixels/examples/fade.js`
- **Symbols**: App

## CLI

_No CLI entry points detected._

## Requirements

- Raspberry Pi (Zero/Zero2/3/4/5) with a supported PWM/DMA pin (e.g., BCM 18)
- Node.js 16+ recommended
- For native builds: `sudo apt-get install build-essential python3`

## Examples

- Solid color fill
- Basic chase / wipe
- Matrix serpentine mapping

> Tip: Apply gamma correction for perceptually linear brightness.

## Development

- Install deps: `npm install`
- Run tests: `npm test` (if present)
- Lint: `npm run lint` (if present)

## License

ISC

---

> Auto-generated from project inspection. Please review strip type defaults, pin numbers, and color ordering to match your hardware.

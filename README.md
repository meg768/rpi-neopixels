
# rpi-neopixels
*Simple synchronous LED control for Raspberry Pi*

A lightweight Node.js library for driving WS281x / NeoPixel LEDs on Raspberry Pi.  
This version focuses on **synchronous, blocking rendering**, including built‑in support for fade transitions handled inside `render()`.

---

## Features

- Direct, synchronous LED rendering (no async / await required)
- Smooth fading transitions handled internally
- RGB and RGBW support (`0xWWRRGGBB` or `0x00RRGGBB`)
- Works with `Uint32Array` buffers
- Optional serpentine mapping for LED matrices

---

## Installation

```bash
npm install rpi-neopixels
```

---

## Quick Start

```js
const neo = require('rpi-neopixels');

// Configure strip or matrix
neo.configure({ leds: 64, gpio: 18, brightness: 128, stripType: 'rgb' });

const next = new Uint32Array(64).fill(0x000000FF); // blue

// Fade from previous frame to blue over 500 ms
neo.render(next, { fade: true, durationMs: 500 });

// Instant update (no fade)
neo.render(next);

// Gamma-corrected fade example
neo.render(next, { fade: true, durationMs: 700, gamma: 2.2 });
```

---

## API

### `configure(options)`

Initializes the LED driver.

Common options:
- `leds` (number) – total number of LEDs
- `gpio` (number) – BCM pin (e.g., 18)
- `brightness` (0–255) – global brightness
- `stripType` (string) – `rgb`, `grb`, `rgbw`, etc.
- `width` / `height` (number, optional) – for LED matrices
- `map` (`Uint32Array` or `'serpentine'`, optional) – custom index mapping

---

### `render(pixels, options = {})`

Renders a new frame to the LEDs.  
If fade options are supplied, the function **blends from the previous frame to the new one** internally, blocking until the fade is complete.

**Parameters**
- `pixels` (`Uint32Array`): Packed colors as `0xWWRRGGBB` (RGBW) or `0x00RRGGBB` (RGB).
- `options` (object, optional):
  - `fade` (`boolean | number`) – enable fade; if a number, interpreted as `durationMs`.
  - `durationMs` (`number`) – fade duration in milliseconds (default: 0 = instant).
  - `steps` (`number`) – number of intermediate frames (default derived from duration).
  - `easing` (`string`) – easing curve name such as `"linear"` or `"easeInOutQuad"`.
  - `gamma` (`number`) – optional gamma correction applied during fade.
  - `blendMode` (`string`) – `'lerp'`, `'add'`, or `'max'` (default `'lerp'`).

**Behavior**
1. Uses the cached previous frame (`prev`) as a starting point.
2. Interpolates channel values in multiple steps according to the easing curve.
3. Applies optional gamma correction during blending.
4. Writes each intermediate frame directly to the LEDs.
5. Blocks until the fade is complete.

**Notes**
- The function is **synchronous and blocking**.
- Fades occur entirely within `render()`; no asynchronous logic is used.
- Provide a fresh `Uint32Array` each call; internal state is updated per frame.

---

### `reset()`

Turns off the LEDs and releases driver resources.

---

## Examples

- Solid color fill  
- Smooth fade‑in/out transitions  
- Matrix serpentine animations

> Tip: Use gamma correction (e.g., `gamma: 2.2`) for visually linear fades.

---

## Development

```bash
npm install
npm test
npm run lint
```

---

## License

MIT

---

⚠️ **Note:** `render()` is fully synchronous and will block the Node.js event loop during fades.
If non‑blocking behavior is needed, handle fades in a separate process or thread.


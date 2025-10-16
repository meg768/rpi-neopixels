
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

### `render(options)`

Renders the current pixel buffer to the LED strip or matrix, with optional **blocking fade transitions** handled entirely inside the function.

This function is **synchronous** — it does *not* use promises or async/await —  and will block the Node.js event loop while the fade is in progress.

#### Parameters

| Name                 | Type     | Default             | Description                                                  |
| -------------------- | -------- | ------------------- | ------------------------------------------------------------ |
| `options`            | `object` | `{}`                | Optional configuration object                                |
| `options.transition` | `'fade'` | –                   | When set to `'fade'`, performs a synchronous cross-fade between frames. |
| `options.duration`   | `number` | `100`               | Fade duration in milliseconds. Values ≤ 0 disable the fade (instant draw). |
| `options.speed`      | `number` | *(auto-calibrated)* | Optional override for step speed. If omitted, the method measures its own runtime and updates `this.speed` adaptively. |

#### Behavior

1. Uses the previously rendered frame (`this.content`) as the start frame  
   and the current frame (`this.pixels`) as the target.
2. Calculates `numSteps = duration * this.speed`.  
   This determines how many intermediate frames will be rendered.
3. For each step:
   - Unpacks RGB channels from both frames (`0xRRGGBB`).
   - Linearly interpolates each color component:  
     `red = r1 + (step * (r2 - r1)) / numSteps` (same for green and blue).
   - Packs the interpolated color into `this.tmp[i] = (red << 16) | (green << 8) | blue`.
   - Calls `ws281x.render(this.tmp)` to display the intermediate frame.
4. After the fade completes:
   - Updates `this.speed` if `options.speed` was not specified  
     (simple moving average based on measured duration).
   - Copies `this.pixels` into `this.content` (new “previous” frame).
   - Performs a final `ws281x.render(this.pixels)` to show the exact target frame.

#### Notes

- Color values are truncated to integers through bitwise operations.  
  No rounding or clamping is applied.
- Operates on **RGB only** (`0xRRGGBB`); white channel is ignored.
- Fades are **blocking** — while in progress, no other JavaScript executes.
- `speed` auto-adjustment provides smoother fades over time  
  without manual calibration.
- After each fade, the exact target frame is re-rendered once for consistency.

#### Example

```js
// Instant draw (no fade)
pixels.fill(0xFF0000); // red
renderer.pixels = pixels;
renderer.render();

// 300 ms blocking fade to blue
pixels.fill(0x0000FF);
renderer.pixels = pixels;
renderer.render({ transition: 'fade', duration: 300 });
```

### reset()

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


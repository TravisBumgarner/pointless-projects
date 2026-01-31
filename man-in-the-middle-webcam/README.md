# Man-in-the-Middle Webcam

Intercepts your real webcam feed, applies a visual filter with Python, and outputs to a virtual camera that Zoom, Chrome, Google Meet, or any other app can use.

## Prerequisites

- **OBS Studio** installed (provides the virtual camera driver on macOS). You don't need to run OBS — just have it installed.
  - macOS: https://obsproject.com
  - Linux: install `v4l2loopback` instead
  - Windows: install OBS with its virtual camera
- **Python 3.10+**

## Setup

```bash
cd man-in-the-middle-webcam
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Usage

```bash
source venv/bin/activate
python main.py
```

A preview window opens showing your transformed feed. In Zoom/Chrome/etc., select **OBS Virtual Camera** as your camera source.

### Controls

Press keys in the **preview window** (click it first to give it focus):

- **Number/letter keys** — switch filters (see table below)
- **q** — quit

## Filters

| Key | Filter | Description |
|-----|--------|-------------|
| `1` | passthrough | No transform — raw webcam feed |
| `2` | grayscale | Black and white |
| `3` | edges | Canny edge detection on black |
| `4` | gameboy | 4-shade green palette, chunky pixels |
| `5` | dither | Ordered Bayer matrix dithering |
| `6` | glitch | Random horizontal band shifts |
| `7` | halftone | Newspaper-style dot pattern |
| `8` | scanlines | CRT scanline darkening |
| `9` | neon edges | Thick neon-colored edges on black |
| `0` | old film | Sepia + grain + vignette + flicker |
| `a` | threshold | Binary black and white |
| `b` | time tile | 3x3 grid, each tile 0.5s further in the past |
| `c` | split rgb | R, G, B channels shown as vertical strips |
| `d` | tv static | B&W static with coarse grain |
| `e` | 8-color | Each RGB channel quantized to 0 or 255 |
| `f` | retro cga | Classic 4-color CGA palette, pixelated |
| `g` | motion detect | Only pixels that are moving, rest goes black |
| `h` | anaglyph 3d | Red/cyan offset — grab your 3D glasses |
| `i` | stencil | High-contrast 3-tone street-art look |
| `j` | old crt | Barrel distortion + scanlines + color bleed + vignette |
| `k` | posterize | Reduced color levels per channel |
| `l` | onion skin | Ghostly overlay of your last several positions |
| `m` | duotone | Teal-to-magenta two-tone gradient |
| `n` | kaleidoscope | 6-fold rotational symmetry from a single wedge |
| `o` | noir | Film noir — crushed shadows, dramatic contrast, B&W |
| `p` | blueprint | White edge lines on dark blue paper |
| `r` | vaporwave | Pink/purple hue shift + glow + scanlines |
| `s` | pencil sketch | Grayscale pencil drawing |
| `t` | oil painting | Painterly stylization |
| `u` | cyanotype | Sun print — deep blue shadows, white highlights |
| `v` | woodcut | Bold black/white adaptive threshold, like a block print |
| `w` | sepia | Classic warm vintage tone |
| `x` | solarize | Partial inversion — overexposed darkroom look |
| `y` | pop art | Warhol-style 2x2 posterized color grid |

> `q` is reserved for quit.

## Adding your own filter

Add a function to `main.py` that takes a BGR numpy array and returns one:

```python
def my_filter(frame):
    # do something with frame (numpy array, shape HxWx3, dtype uint8, BGR)
    return frame
```

Then add it to the `TRANSFORMS` list with a key:

```python
("z: my filter", my_filter),
```

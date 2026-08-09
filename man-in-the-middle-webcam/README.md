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

If the feed comes through black, your real webcam isn't index 0. Probe them:

```bash
python main.py --list-devices   # then: python main.py --device N
```

Pick the index with a non-zero mean brightness — the black 1920x1080 entries
include the OBS Virtual Camera itself, which would just loop output back in.

macOS often misreports the webcam's framerate, so the app measures it at startup
(~2s). Override with `--fps 30` if the detected rate looks wrong.

No preview window opens — the transformed feed goes straight to the virtual camera. In Zoom/Chrome/etc., select **OBS Virtual Camera** as your camera source to see it.

### Controls

Type in the **terminal** and press Enter:

- **Number/letter keys** — switch filters (see table below)
- **`]`** — quit (Ctrl-C also works)

## Filters

| Key | Filter | Description |
|-----|--------|-------------|
| `1` | passthrough | No transform — raw webcam feed |
| `2` | grayscale | Black and white |
| `3` | edges | Canny edge detection on black |
| `4` | gameboy | 4-shade green palette, chunky pixels |
| `5` | dither | Ordered Bayer matrix dithering |
| `6` | glitch | Random horizontal band shifts |
| `7` | mosaic | 20x20px blocks, each the average color of that area, 128 colors |
| `8` | scanlines | CRT scanline darkening |
| `9` | neon edges | Thick neon-colored edges on black |
| `0` | old film | Sepia + grain + vignette + flicker |
| `a` | threshold | Binary black and white |
| `b` | time tile | 3x3 grid, each tile 0.5s further in the past |
| `c` | tv static | B&W static with coarse grain |
| `d` | 8-color | Each RGB channel quantized to 0 or 255 |
| `e` | retro cga | Classic 4-color CGA palette, pixelated |
| `f` | motion detect | Only pixels that are moving, in black and white |
| `g` | anaglyph 3d | Red/cyan offset — grab your 3D glasses |
| `h` | stencil | High-contrast 3-tone street-art look |
| `i` | old crt | Barrel distortion + scanlines + color bleed + vignette |
| `j` | posterize | Reduced color levels per channel |
| `k` | onion skin | Ghostly overlay of your last several positions |
| `l` | duotone | Teal-to-magenta two-tone gradient |
| `m` | kaleidoscope | 6-fold rotational symmetry from a single wedge |
| `n` | noir | Film noir — crushed shadows, dramatic contrast, B&W |
| `o` | blueprint | White edge lines on dark blue paper |
| `p` | vaporwave | Pink/purple hue shift + glow + scanlines |
| `q` | pencil sketch | Grayscale pencil drawing |
| `r` | oil painting | Painterly stylization |
| `s` | cyanotype | Sun print — deep blue shadows, white highlights |
| `t` | woodcut | Bold black/white adaptive threshold, like a block print |
| `u` | sepia | Classic warm vintage tone |
| `v` | solarize | Partial inversion — overexposed darkroom look |
| `w` | pop art | Warhol-style 2x2 posterized color grid |
| `x` | cartoon mosaic | Like `7`, but snapped to a 16-color comic-book palette |
| `z` | ascii | Redrawn as colored ASCII characters |
| `A` | slit scan | Time displacement — each band is further into the past |
| `B` | pixel sort | Brightness-sorted pixel runs, the glitch-art melt |
| `C` | thermal | Infrared ironbow false-color heat map |
| `D` | night vision | Green phosphor image intensifier, grain and vignette |
| `E` | bloom | Dreamy highlight glow bleeding over everything |
| `F` | fisheye | Bulging fisheye lens |
| `G` | swirl | Center twisted into a vortex |
| `H` | tunnel | Demoscene tunnel — frame wrapped around a shaft |
| `I` | mirror | Left half mirrored onto the right |
| `J` | crystallize | Stained glass — Voronoi cells of flat average color |
| `K` | low poly | Low-poly triangle mesh |
| `L` | chromatic | Chromatic aberration, channels drifting at the edges |
| `M` | cross hatch | Pen-and-ink hatching, more layers where darker |
| `N` | emboss | Stamped metal relief |
| `O` | contour map | Topographic terrain with contour lines |
| `P` | ripple | Concentric water ripples from the center |
| `Q` | lego | Built from plastic bricks, studs and all |
| `R` | cross stitch | Embroidered cross-stitch on linen |
| `S` | matrix rain | Falling green code lit by the camera |
| `T` | zoom blur | Radial motion blur out of the center |
| `U` | tilt shift | Fake miniature — sharp band, blurred and saturated |
| `V` | hologram | Cyan sci-fi projection, edge-lit and flickering |
| `W` | vhs | Worn tape — chroma bleed and a crawling tracking band |
| `X` | echo tunnel | Video feedback, each frame zooming into the last |
| `Y` | bitcrush | Byte rotation — wild banding from tiny value changes |
| `Z` | sonar | Radar scope sweep lighting up edges as it passes |

> `]` is reserved for quit. Capital letters are distinct from lowercase — `s`
> is pencil sketch, `S` is matrix rain.

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

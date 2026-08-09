"""
Man-in-the-Middle Webcam

Captures your real webcam, applies a transform, and outputs to a virtual
camera that Zoom/Chrome/etc. can use.

Requirements:
  - OBS Studio installed (provides the virtual camera driver on macOS)
  - pip install -r requirements.txt

Usage:
  python main.py
  python main.py --list-devices     # see which index is your real webcam
  python main.py --device 1         # use a specific webcam

Controls (type in the terminal, then Enter):
  1-0, a-x, z, A-Z   Select transform (shown in list; case matters)
  ]                  Quit
"""

import argparse
import sys
import threading
import time
from collections import deque
import cv2
import numpy as np
import pyvirtualcam


# ---------------------------------------------------------------------------
# Transforms
#
# Each transform is a function: (frame_bgr: np.ndarray) -> np.ndarray
# The frame is in BGR format (standard OpenCV). Return BGR.
# ---------------------------------------------------------------------------

# --- 1-0: kept ---

def passthrough(frame):
    """No transform — raw webcam feed."""
    return frame


def grayscale(frame):
    """Convert to grayscale."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)


def edges(frame):
    """Canny edge detection on a black background."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    canny = cv2.Canny(blurred, 50, 150)
    return cv2.cvtColor(canny, cv2.COLOR_GRAY2BGR)


def gameboy(frame, block_size=4):
    """Game Boy look — 4-shade green palette, pixelated."""
    palette = np.array([
        [48, 98, 15],
        [55, 139, 48],
        [96, 188, 139],
        [155, 229, 224],
    ], dtype=np.uint8)
    h, w = frame.shape[:2]
    small = cv2.resize(frame, (w // block_size, h // block_size),
                       interpolation=cv2.INTER_LINEAR)
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    indices = (gray // 64).clip(0, 3)
    result = palette[indices]
    return cv2.resize(result, (w, h), interpolation=cv2.INTER_NEAREST)


def dither(frame):
    """Ordered dithering with a Bayer matrix."""
    bayer = np.array([[0, 8, 2, 10],
                      [12, 4, 14, 6],
                      [3, 11, 1, 9],
                      [15, 7, 13, 5]], dtype=np.float32) / 16.0
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    h, w = gray.shape
    threshold = np.tile(bayer, (h // 4 + 1, w // 4 + 1))[:h, :w]
    bw = (gray > threshold).astype(np.uint8) * 255
    return cv2.cvtColor(bw, cv2.COLOR_GRAY2BGR)


def glitch(frame):
    """Random horizontal band shifts."""
    out = frame.copy()
    h = frame.shape[0]
    for _ in range(np.random.randint(3, 10)):
        y = np.random.randint(0, h - 20)
        band_h = np.random.randint(5, 30)
        shift = np.random.randint(-40, 40)
        out[y:y + band_h] = np.roll(frame[y:y + band_h], shift, axis=1)
    return out


def _quant_lut(levels):
    """LUT snapping 0-255 to `levels` evenly spaced values."""
    step = 255.0 / (levels - 1)
    return (np.round(np.arange(256) / step) * step).clip(0, 255).astype(np.uint8)


# 4 blues x 8 greens x 4 reds = 128 colours. Green gets the most levels — the
# eye resolves more detail there. Channel order is BGR, as OpenCV hands it over.
_MOSAIC_LUTS = [_quant_lut(4), _quant_lut(8), _quant_lut(4)]


def mosaic(frame, block=20):
    """20x20 px blocks of the area's average colour, quantized to 128 colours."""
    h, w = frame.shape[:2]
    # INTER_AREA averages every source pixel in each block; NEAREST blows the
    # result back up into flat squares.
    small = cv2.resize(frame, ((w + block - 1) // block, (h + block - 1) // block),
                       interpolation=cv2.INTER_AREA)
    for c in range(3):
        small[:, :, c] = _MOSAIC_LUTS[c][small[:, :, c]]
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)


def scanlines(frame):
    """CRT scanline overlay."""
    out = frame.copy()
    out[::2, :] = (out[::2, :].astype(np.int16) * 6 // 10).clip(0, 255).astype(np.uint8)
    return out


def neon_edges(frame):
    """Thick neon-colored edges on black."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    canny = cv2.Canny(gray, 80, 200)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    thick = cv2.dilate(canny, kernel, iterations=1)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    hsv[:, :, 1] = 255
    hsv[:, :, 2] = 255
    neon = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    out = np.zeros_like(frame)
    mask = thick > 0
    out[mask] = neon[mask]
    return out


def old_film(frame):
    """Old film — sepia, grain, vignette, flicker."""
    kern = np.array([[0.272, 0.534, 0.131],
                     [0.349, 0.686, 0.168],
                     [0.393, 0.769, 0.189]])
    out = np.clip(frame @ kern.T, 0, 255).astype(np.uint8)
    noise = np.random.normal(0, 25, out.shape).astype(np.int16)
    out = np.clip(out.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    h, w = out.shape[:2]
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    dist = np.sqrt((xs - w / 2) ** 2 + (ys - h / 2) ** 2)
    max_dist = np.sqrt((w / 2) ** 2 + (h / 2) ** 2)
    vig = 1.0 - np.clip(dist / max_dist, 0, 1) ** 1.5
    out = (out * vig[:, :, np.newaxis]).astype(np.uint8)
    flicker = np.random.uniform(0.85, 1.0)
    return np.clip(out * flicker, 0, 255).astype(np.uint8)


# --- a-d: kept ---

def binary_threshold(frame):
    """High contrast binary black and white."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    _, bw = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    return cv2.cvtColor(bw, cv2.COLOR_GRAY2BGR)


_time_buffer = deque(maxlen=135)

def time_tile(frame):
    """3x3 grid: each tile is a half-second further in the past."""
    h, w = frame.shape[:2]
    small_h, small_w = h // 3, w // 3
    _time_buffer.append(cv2.resize(frame, (small_w, small_h)))
    buf_len = len(_time_buffer)
    offsets = [0, 15, 30, 45, 60, 75, 90, 105, 120]
    tiles = []
    for off in offsets:
        idx = max(buf_len - 1 - off, 0)
        tiles.append(_time_buffer[idx])
    rows = []
    for r in range(3):
        rows.append(np.hstack(tiles[r * 3:(r + 1) * 3]))
    return np.vstack(rows)


def tv_static(frame):
    """Old-timey B&W TV static with coarse grain."""
    h, w = frame.shape[:2]
    grain_size = 4
    small_h, small_w = h // grain_size, w // grain_size
    noise = np.random.randint(0, 256, (small_h, small_w), dtype=np.uint8)
    big_noise = cv2.resize(noise, (w, h), interpolation=cv2.INTER_NEAREST)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blended = cv2.addWeighted(gray, 0.35, big_noise, 0.65, 0)
    return cv2.cvtColor(blended, cv2.COLOR_GRAY2BGR)


# --- e-l: kept (shifted up) ---

def eight_color(frame):
    """Quantize each RGB channel to 0 or 255 — bold 8-color pop art."""
    return ((frame > 127).astype(np.uint8)) * 255


def retro_cga(frame, block_size=3):
    """Map to the classic 4-color CGA palette, pixelated."""
    palette = np.array([
        [0, 0, 0],
        [255, 255, 0],
        [255, 0, 255],
        [255, 255, 255],
    ], dtype=np.uint8)
    h, w = frame.shape[:2]
    small = cv2.resize(frame, (w // block_size, h // block_size),
                       interpolation=cv2.INTER_LINEAR)
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    indices = (gray // 64).clip(0, 3)
    result = palette[indices]
    return cv2.resize(result, (w, h), interpolation=cv2.INTER_NEAREST)


_motion_prev = None

def motion_detect(frame):
    """Only show pixels that are moving, in black and white."""
    global _motion_prev
    if _motion_prev is None or _motion_prev.shape != frame.shape:
        _motion_prev = frame.copy()
    diff = cv2.absdiff(frame, _motion_prev)
    _motion_prev = frame.copy()
    gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray_diff, 25, 255, cv2.THRESH_BINARY)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return cv2.cvtColor(cv2.bitwise_and(gray, mask), cv2.COLOR_GRAY2BGR)


def anaglyph_3d(frame):
    """Red/cyan anaglyph — grab your 3D glasses."""
    shift = 12
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    out = np.zeros_like(frame)
    out[:, :, 2] = gray
    out[:, shift:, 1] = gray[:, :-shift]
    out[:, shift:, 0] = gray[:, :-shift]
    return out


def stencil(frame):
    """High-contrast stencil / street-art look — 3 tones."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    out = np.zeros_like(gray)
    out[gray > 170] = 255
    out[(gray > 85) & (gray <= 170)] = 128
    return cv2.cvtColor(out, cv2.COLOR_GRAY2BGR)


_barrel_cache = {}

def old_crt(frame):
    """Full CRT TV — barrel distortion + scanlines + color bleed + vignette."""
    h, w = frame.shape[:2]
    key = (h, w)
    if key not in _barrel_cache:
        cx, cy = w / 2, h / 2
        ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
        dx = (xs - cx) / cx
        dy = (ys - cy) / cy
        r2 = dx ** 2 + dy ** 2
        distort = 1 + r2 * 0.15
        _barrel_cache[key] = (
            (cx + dx * distort * cx).astype(np.float32),
            (cy + dy * distort * cy).astype(np.float32),
        )
    map_x, map_y = _barrel_cache[key]
    warped = cv2.remap(frame, map_x, map_y, cv2.INTER_LINEAR,
                       borderValue=(0, 0, 0))
    warped[:, 2:, 2] = warped[:, :-2, 2]
    warped[::2, :] = (warped[::2, :].astype(np.int16) * 6 // 10).clip(0, 255).astype(np.uint8)
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    dist = np.sqrt((xs - w / 2) ** 2 + (ys - h / 2) ** 2)
    max_dist = np.sqrt((w / 2) ** 2 + (h / 2) ** 2)
    vig = 1.0 - np.clip(dist / max_dist, 0, 1) ** 2
    return (warped * vig[:, :, np.newaxis]).astype(np.uint8)


def posterize(frame, levels=4):
    """Reduce color to N levels per channel."""
    div = 256 // levels
    return (frame // div * div + div // 2).astype(np.uint8)


_onion_buffer = deque(maxlen=8)

def onion_skin(frame):
    """Ghostly overlay of your last several positions — animation-style."""
    _onion_buffer.append(frame.astype(np.float32))
    n = len(_onion_buffer)
    out = np.zeros_like(frame, dtype=np.float32)
    total_weight = 0
    for i, f in enumerate(_onion_buffer):
        wt = (i + 1) / n
        out += f * wt
        total_weight += wt
    return (out / total_weight).astype(np.uint8)


# --- m-n: kept (shifted up) ---

_duotone_lut = None

def duotone(frame):
    """Two-tone gradient: teal shadows, magenta highlights."""
    global _duotone_lut
    if _duotone_lut is None:
        _duotone_lut = np.zeros((256, 3), dtype=np.uint8)
        shadow = np.array([128, 128, 0], dtype=np.float32)
        highlight = np.array([180, 0, 220], dtype=np.float32)
        for i in range(256):
            t = i / 255
            _duotone_lut[i] = (shadow * (1 - t) + highlight * t).astype(np.uint8)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return _duotone_lut[gray]


# --- o-p: kept ---

def noir(frame):
    """Film noir — crushed shadows, dramatic contrast, B&W."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    enhanced = np.clip(enhanced.astype(np.float32) * 1.5 - 30, 0, 255).astype(np.uint8)
    return cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)


def blueprint(frame):
    """Architectural blueprint — white lines on blue paper."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    canny = cv2.Canny(gray, 50, 150)
    canny = cv2.dilate(canny, None, iterations=1)
    out = np.full_like(frame, [180, 80, 30])
    out[canny > 0] = [255, 255, 255]
    return out


# --- r-t: kept (shifted up) ---

def vaporwave(frame):
    """Vaporwave aesthetic — pink/purple/teal tint with dreamy glow."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 0] = (hsv[:, :, 0] + 130) % 180
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.4, 0, 255)
    out = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    glow = cv2.GaussianBlur(out, (25, 25), 0)
    out = cv2.addWeighted(out, 0.6, glow, 0.5, 10)
    out[::3, :] = (out[::3, :].astype(np.int16) * 8 // 10).clip(0, 255).astype(np.uint8)
    return out


def pencil_sketch(frame):
    """Pencil sketch — grayscale drawing (half-res for speed)."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, (w // 2, h // 2))
    gray_sketch, _ = cv2.pencilSketch(
        small, sigma_s=60, sigma_r=0.07, shade_factor=0.05
    )
    return cv2.cvtColor(cv2.resize(gray_sketch, (w, h)), cv2.COLOR_GRAY2BGR)


def oil_painting(frame):
    """Oil painting effect (half-res for speed)."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, (w // 2, h // 2))
    painted = cv2.stylization(small, sigma_s=60, sigma_r=0.4)
    return cv2.resize(painted, (w, h))


# --- u-y: new ---

def cyanotype(frame):
    """Cyanotype sun print — deep blue shadows, white highlights."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    out = np.zeros((*gray.shape, 3), dtype=np.float32)
    # Deep prussian blue in shadows, white in highlights
    out[:, :, 0] = 80 + 175 * gray    # blue: 80 -> 255
    out[:, :, 1] = 30 + 200 * gray    # green: 30 -> 230
    out[:, :, 2] = 10 + 230 * gray    # red: 10 -> 240
    return out.astype(np.uint8)


def woodcut(frame):
    """Woodcut print — bold black shapes on white, hand-carved look."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    bw = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 15, 5
    )
    return cv2.cvtColor(bw, cv2.COLOR_GRAY2BGR)


def sepia(frame):
    """Classic warm sepia tone."""
    kern = np.array([[0.272, 0.534, 0.131],
                     [0.349, 0.686, 0.168],
                     [0.393, 0.769, 0.189]])
    return np.clip(frame @ kern.T, 0, 255).astype(np.uint8)


def solarize(frame, threshold=128):
    """Solarize — partially invert, like overexposed darkroom print."""
    out = frame.copy()
    mask = out > threshold
    out[mask] = 255 - out[mask]
    return out


# Bright, happy cartoon colours only — no browns, greys or muted tones, since
# those swallow everything and turn the frame to mud. BGR, as OpenCV hands
# them over. The one dark entry is a deep violet rather than black, so shadows
# still read as colour.
_CARTOON_PALETTE = np.array([
    [255, 255, 255],    # white
    [90, 245, 255],     # lemon yellow
    [40, 175, 255],     # orange
    [90, 90, 255],      # coral red
    [190, 70, 255],     # hot pink
    [235, 70, 225],     # fuchsia
    [245, 90, 155],     # violet
    [255, 150, 70],     # bright blue
    [255, 225, 90],     # sky cyan
    [205, 235, 70],     # turquoise
    [130, 245, 150],    # mint
    [80, 225, 90],      # grass green
    [200, 65, 145],     # grape purple (shadows)
], dtype=np.uint8)

_CARTOON_PALETTE_LAB = cv2.cvtColor(
    _CARTOON_PALETTE.reshape(-1, 1, 3), cv2.COLOR_BGR2LAB
).reshape(-1, 3).astype(np.int16)


def cartoon_mosaic(frame, block=20):
    """20x20 px blocks snapped to a bright cartoon palette."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, ((w + block - 1) // block, (h + block - 1) // block),
                       interpolation=cv2.INTER_AREA)
    # Crank saturation first. Real rooms are full of beige, which sits near the
    # middle of the palette and would otherwise smear everything into one
    # muddy tone — boosting forces each block to commit to an actual hue.
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] *= 3.0
    hsv[:, :, 2] *= 1.15
    boosted = cv2.cvtColor(np.clip(hsv, 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)
    # Match in Lab so each block lands on its perceptually nearest colour. The
    # search is brute force but the image is tiny by this point (~96x54).
    lab = cv2.cvtColor(boosted, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.int16)
    delta = lab[:, None, :] - _CARTOON_PALETTE_LAB[None, :, :]
    nearest = (delta.astype(np.int32) ** 2).sum(axis=2).argmin(axis=1)
    quantized = _CARTOON_PALETTE[nearest].reshape(small.shape)
    return cv2.resize(quantized, (w, h), interpolation=cv2.INTER_NEAREST)


def pop_art(frame):
    """Pop art — Warhol-style 2x2 color grid."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, (w // 2, h // 2))
    # Posterize the base
    div = 64
    small = (small // div * div + div // 2).astype(np.uint8)
    tints = [
        np.array([200, 80, 255], dtype=np.uint8),   # pink
        np.array([50, 255, 255], dtype=np.uint8),    # yellow
        np.array([255, 180, 50], dtype=np.uint8),    # cyan-ish
        np.array([80, 255, 80], dtype=np.uint8),     # green
    ]
    panels = []
    for tint in tints:
        panels.append(cv2.addWeighted(small, 0.55, np.full_like(small, tint), 0.45, 0))
    top = np.hstack([panels[0], panels[1]])
    bot = np.hstack([panels[2], panels[3]])
    return np.vstack([top, bot])


_kaleidoscope_cache = {}

def kaleidoscope(frame, segments=6):
    """True kaleidoscope — 6-fold symmetry from a single wedge."""
    h, w = frame.shape[:2]
    key = (h, w)
    if key not in _kaleidoscope_cache:
        cx, cy = w / 2, h / 2
        ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
        dx = xs - cx
        dy = ys - cy
        angle = np.arctan2(dy, dx)
        radius = np.sqrt(dx ** 2 + dy ** 2)
        seg_angle = 2 * np.pi / segments
        folded = angle % seg_angle
        segment_idx = (angle // seg_angle).astype(int)
        mirror_mask = (segment_idx % 2) == 1
        folded[mirror_mask] = seg_angle - folded[mirror_mask]
        _kaleidoscope_cache[key] = (
            (cx + radius * np.cos(folded)).astype(np.float32),
            (cy + radius * np.sin(folded)).astype(np.float32),
        )
    map_x, map_y = _kaleidoscope_cache[key]
    return cv2.remap(frame, map_x, map_y, cv2.INTER_LINEAR,
                     borderMode=cv2.BORDER_REFLECT)


# ---------------------------------------------------------------------------
# z, A-Z
#
# Shared machinery first. Anything that depends only on frame size gets built
# once and cached by (h, w) — at 1080p these arrays are far too expensive to
# rebuild 24 times a second.
# ---------------------------------------------------------------------------

_polar_cache = {}


def _polar(h, w):
    """Cached (xs, ys, dx, dy, radius, angle) grids for a given frame size."""
    key = (h, w)
    if key not in _polar_cache:
        cx, cy = w / 2.0, h / 2.0
        ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
        dx, dy = xs - cx, ys - cy
        _polar_cache[key] = (xs, ys, dx, dy,
                             np.sqrt(dx * dx + dy * dy),
                             np.arctan2(dy, dx))
    return _polar_cache[key]


_glyph_cache = {}


def _glyph_atlas(chars, cw, ch):
    """Pre-render each character to a (cw x ch) bitmap.

    Drawing thousands of putText calls per frame is hopeless; rendering the
    charset once lets the whole frame become a single fancy-index.
    """
    key = (chars, cw, ch)
    if key not in _glyph_cache:
        atlas = np.zeros((len(chars), ch, cw), dtype=np.uint8)
        for i, c in enumerate(chars):
            tile = np.zeros((ch, cw), dtype=np.uint8)
            cv2.putText(tile, c, (1, ch - 3), cv2.FONT_HERSHEY_SIMPLEX,
                        cw / 22.0, 255, 1, cv2.LINE_AA)
            atlas[i] = tile
        _glyph_cache[key] = atlas
    return _glyph_cache[key]


def _tile_glyphs(atlas, indices):
    """Lay a (rows, cols) grid of glyph indices out into one image."""
    rows, cols = indices.shape
    ch, cw = atlas.shape[1:]
    return atlas[indices].transpose(0, 2, 1, 3).reshape(rows * ch, cols * cw)


_cell_cache = {}


def _cell_maps(kind, h, w):
    """Label maps that carve the frame into cells (Voronoi or triangles).

    Returns (labels_paint, labels_small, n_labels, counts, border). Averaging
    runs on the small map and painting on a half-res map — a full 1080p fancy
    index per frame costs more than the entire frame budget.
    """
    key = (kind, h, w)
    if key in _cell_cache:
        return _cell_cache[key]

    ph, pw = max(1, h // 2), max(1, w // 2)

    if kind == "voronoi":
        n_labels = 320
        rng = np.random.default_rng(7)
        lw = 400
        lh = max(1, int(round(lw * h / w)))
        px = rng.uniform(0, lw, n_labels).astype(np.float32)
        py = rng.uniform(0, lh, n_labels).astype(np.float32)
        ys, xs = np.mgrid[0:lh, 0:lw].astype(np.float32)
        # Chunked nearest-seed search: the full (pixels x seeds) matrix would be
        # hundreds of MB.
        best = np.zeros((lh, lw), np.int32)
        best_d = np.full((lh, lw), np.inf, np.float32)
        for i in range(n_labels):
            d = (xs - px[i]) ** 2 + (ys - py[i]) ** 2
            closer = d < best_d
            best_d[closer] = d[closer]
            best[closer] = i
        labels_paint = cv2.resize(best.astype(np.float32), (pw, ph),
                                  interpolation=cv2.INTER_NEAREST).astype(np.int32)
    else:  # triangles
        cell = max(12, pw // 26)
        ys, xs = np.mgrid[0:ph, 0:pw]
        ncols = (pw + cell - 1) // cell
        upper = ((xs % cell) + (ys % cell)) < cell
        labels_paint = (((ys // cell) * ncols + (xs // cell)) * 2
                        + upper.astype(np.int32)).astype(np.int32)
        n_labels = int(labels_paint.max()) + 1

    sw = 400
    sh = max(1, int(round(sw * h / w)))
    labels_small = cv2.resize(labels_paint.astype(np.float32), (sw, sh),
                              interpolation=cv2.INTER_NEAREST).astype(np.int32)
    counts = np.maximum(np.bincount(labels_small.ravel(), minlength=n_labels), 1)

    border = np.zeros((ph, pw), bool)
    border[1:, :] |= labels_paint[1:, :] != labels_paint[:-1, :]
    border[:, 1:] |= labels_paint[:, 1:] != labels_paint[:, :-1]

    _cell_cache[key] = (labels_paint, labels_small, n_labels, counts, border)
    return _cell_cache[key]


def _paint_cells(frame, kind, darken_border=True):
    """Flat-fill every cell with its average colour."""
    h, w = frame.shape[:2]
    labels_paint, labels_small, n_labels, counts, border = _cell_maps(kind, h, w)
    sh, sw = labels_small.shape
    small = cv2.resize(frame, (sw, sh), interpolation=cv2.INTER_AREA)
    flat = labels_small.ravel()
    palette = np.empty((n_labels, 3), np.uint8)
    for c in range(3):
        total = np.bincount(flat, weights=small[:, :, c].ravel().astype(np.float64),
                            minlength=n_labels)
        palette[:, c] = np.clip(total / counts, 0, 255).astype(np.uint8)
    out = palette[labels_paint]
    if darken_border:
        out[border] = out[border] // 3
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_NEAREST)


# --- z: text ---

_ASCII_RAMP = " .:-=+*#%@"


def ascii_art(frame, cw=12, ch=20):
    """The frame redrawn as coloured ASCII characters."""
    h, w = frame.shape[:2]
    cols, rows = max(1, w // cw), max(1, h // ch)
    small = cv2.resize(frame, (cols, rows), interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    idx = (gray.astype(np.int32) * (len(_ASCII_RAMP) - 1)) // 255
    mask = _tile_glyphs(_glyph_atlas(_ASCII_RAMP, cw, ch), idx)
    colour = cv2.resize(small, (cols * cw, rows * ch),
                        interpolation=cv2.INTER_NEAREST)
    # Characters cover only a fraction of each cell, so the frame reads far
    # darker than the source unless the surviving pixels are pushed hard.
    colour = np.clip(colour.astype(np.int16) * 5 // 2 + 40, 0, 255).astype(np.uint8)
    out = (colour * (mask[:, :, None] > 0)).astype(np.uint8)
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_NEAREST)


# --- A-B: time and glitch ---

_slit_buffer = deque(maxlen=48)


def slit_scan(frame):
    """Time displacement — each horizontal band is further into the past."""
    h, w = frame.shape[:2]
    _slit_buffer.append(cv2.resize(frame, (480, 270)))
    n = len(_slit_buffer)
    out = np.empty((270, 480, 3), np.uint8)
    for i in range(n):
        y0, y1 = int(i * 270 / n), int((i + 1) * 270 / n)
        out[y0:y1] = _slit_buffer[n - 1 - i][y0:y1]
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_LINEAR)


def pixel_sort(frame, chunk=64):
    """Brightness-sorted pixel runs — the classic glitch-art melt."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, (w // 2, h // 2))
    sh, sw = small.shape[:2]
    usable = (sw // chunk) * chunk
    part = small[:, :usable]
    gray = cv2.cvtColor(part, cv2.COLOR_BGR2GRAY).reshape(sh, -1, chunk)
    order = np.argsort(gray, axis=2)[:, :, :, None]
    sorted_part = np.take_along_axis(part.reshape(sh, -1, chunk, 3), order, axis=2)
    small[:, :usable] = sorted_part.reshape(sh, usable, 3)
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_LINEAR)


# --- C-E: false colour and light ---

def thermal(frame):
    """Infrared camera — ironbow false-colour heat map."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (7, 7), 0)
    return cv2.applyColorMap(gray, cv2.COLORMAP_INFERNO)


_nightvision_cache = {}


def night_vision(frame):
    """Image intensifier — green phosphor, grain and a hard vignette."""
    h, w = frame.shape[:2]
    if (h, w) not in _nightvision_cache:
        _, _, _, _, radius, _ = _polar(h, w)
        _nightvision_cache[(h, w)] = radius > min(h, w) * 0.52
    outside = _nightvision_cache[(h, w)]
    gray = cv2.equalizeHist(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY))
    # Grain generated at quarter res and scaled up: sampling 2M gaussians per
    # frame costs more than every other step combined, and coarser grain reads
    # better anyway.
    noise = np.random.normal(0, 18, (h // 4, w // 4)).astype(np.float32)
    noise = cv2.resize(noise, (w, h), interpolation=cv2.INTER_LINEAR)
    g = np.clip(gray + noise, 0, 255).astype(np.uint8)
    out = np.zeros((h, w, 3), np.uint8)
    out[:, :, 1] = g
    out[:, :, 0] = g // 7
    out[:, :, 2] = g // 7
    out[::3, :] = out[::3, :] // 2
    out[outside] = 0
    return out


def bloom(frame):
    """Dreamy highlight bloom — blown-out light bleeding over everything."""
    h, w = frame.shape[:2]
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    highlights = frame * (gray > 175)[:, :, None]
    # Blur small then scale up: a sigma-15 blur at full res is far too slow.
    small = cv2.resize(highlights, (w // 4, h // 4), interpolation=cv2.INTER_AREA)
    glow = cv2.resize(cv2.GaussianBlur(small, (0, 0), 6), (w, h))
    return cv2.addWeighted(frame, 0.85, glow, 0.9, 0)


# --- F-I: lens and geometry ---

_warp_cache = {}


def _warp_maps(kind, h, w):
    key = (kind, h, w)
    if key not in _warp_cache:
        xs, ys, dx, dy, radius, angle = _polar(h, w)
        cx, cy = w / 2.0, h / 2.0
        if kind == "fisheye":
            norm = np.clip(radius / (min(cx, cy)), 0, None)
            scale = np.where(norm < 1e-6, 1.0, norm ** 0.55 / np.maximum(norm, 1e-6))
            mx, my = cx + dx * scale, cy + dy * scale
        elif kind == "swirl":
            strength = 2.6
            twist = angle + strength * np.clip(1 - radius / (min(cx, cy) * 1.1), 0, 1)
            mx, my = cx + radius * np.cos(twist), cy + radius * np.sin(twist)
        else:  # tunnel
            r = np.maximum(radius, 1.0)
            mx = ((angle / (2 * np.pi)) * w * 2.0) % w
            my = ((min(cx, cy) * 26.0) / r) % h
        _warp_cache[key] = (mx.astype(np.float32), my.astype(np.float32))
    return _warp_cache[key]


def fisheye(frame):
    """Bulging fisheye lens."""
    h, w = frame.shape[:2]
    mx, my = _warp_maps("fisheye", h, w)
    return cv2.remap(frame, mx, my, cv2.INTER_LINEAR,
                     borderMode=cv2.BORDER_REFLECT)


def swirl(frame):
    """Twist the centre of the frame into a vortex."""
    h, w = frame.shape[:2]
    mx, my = _warp_maps("swirl", h, w)
    return cv2.remap(frame, mx, my, cv2.INTER_LINEAR,
                     borderMode=cv2.BORDER_REFLECT)


def tunnel(frame):
    """Demoscene tunnel — the frame wrapped around an infinite shaft."""
    h, w = frame.shape[:2]
    mx, my = _warp_maps("tunnel", h, w)
    return cv2.remap(frame, mx, my, cv2.INTER_LINEAR,
                     borderMode=cv2.BORDER_WRAP)


def mirror(frame):
    """Mirror the left half onto the right — everyone looks symmetrical."""
    half = frame.shape[1] // 2
    out = frame.copy()
    out[:, half:] = np.fliplr(frame[:, :half])[:, :frame.shape[1] - half]
    return out


# --- J-K: tessellation ---

def crystallize(frame):
    """Stained glass — Voronoi cells flat-filled with their average colour."""
    return _paint_cells(frame, "voronoi")


def low_poly(frame):
    """Low-poly triangle mesh."""
    return _paint_cells(frame, "triangles")


# --- L-O: print and relief ---

def chromatic(frame):
    """Chromatic aberration — colour channels drifting apart toward the edges."""
    h, w = frame.shape[:2]
    xs, ys, dx, dy, _, _ = _polar(h, w)
    cx, cy = w / 2.0, h / 2.0
    out = frame.copy()
    for channel, scale in ((2, 1.012), (0, 0.988)):
        mx = (cx + dx * scale).astype(np.float32)
        my = (cy + dy * scale).astype(np.float32)
        out[:, :, channel] = cv2.remap(frame[:, :, channel], mx, my,
                                       cv2.INTER_LINEAR,
                                       borderMode=cv2.BORDER_REFLECT)
    return out


_hatch_cache = {}


def cross_hatch(frame):
    """Pen-and-ink cross-hatching — darker areas get more layers of lines."""
    h, w = frame.shape[:2]
    key = (h, w)
    if key not in _hatch_cache:
        ys, xs = np.mgrid[0:h, 0:w]
        # Spacing scales with frame width — fixed pixel spacing turns into
        # unreadable noise at 1080p.
        wide = max(10, w // 130)
        tight = max(8, w // 165)
        _hatch_cache[key] = [
            ((xs + ys) % wide) < 2,
            ((xs - ys) % wide) < 2,
            (ys % tight) < 2,
            (xs % tight) < 2,
        ]
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    out = np.full((h, w), 240, np.uint8)
    for threshold, layer in zip((205, 160, 110, 60), _hatch_cache[key]):
        out[(gray < threshold) & layer] = 25
    return cv2.cvtColor(out, cv2.COLOR_GRAY2BGR)


_EMBOSS_KERNEL = np.array([[-2, -1, 0],
                           [-1, 1, 1],
                           [0, 1, 2]], dtype=np.float32)


def emboss(frame):
    """Stamped metal relief."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(np.float32)
    out = np.clip(cv2.filter2D(gray, -1, _EMBOSS_KERNEL) + 128, 0, 255)
    return cv2.cvtColor(out.astype(np.uint8), cv2.COLOR_GRAY2BGR)


def contour_map(frame, bands=11):
    """Topographic map — luminance as terrain, with contour lines drawn in."""
    gray = cv2.GaussianBlur(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), (9, 9), 0)
    q = (gray.astype(np.int32) * bands // 256).astype(np.uint8)
    out = cv2.applyColorMap(q * (255 // (bands - 1)), cv2.COLORMAP_SUMMER)
    edge = np.zeros(q.shape, bool)
    edge[1:, :] |= q[1:, :] != q[:-1, :]
    edge[:, 1:] |= q[:, 1:] != q[:, :-1]
    out[edge] = (25, 25, 25)
    return out


# --- P-R: surfaces ---

_ripple_phase = [0.0]


def ripple(frame):
    """Concentric water ripples spreading out from the centre."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, (w // 2, h // 2))
    sh, sw = small.shape[:2]
    xs, ys, dx, dy, radius, angle = _polar(sh, sw)
    _ripple_phase[0] += 0.4
    disp = np.sin(radius / 8.0 - _ripple_phase[0]) * 6.0
    mx = (xs + disp * np.cos(angle)).astype(np.float32)
    my = (ys + disp * np.sin(angle)).astype(np.float32)
    warped = cv2.remap(small, mx, my, cv2.INTER_LINEAR,
                       borderMode=cv2.BORDER_REFLECT)
    return cv2.resize(warped, (w, h), interpolation=cv2.INTER_LINEAR)


_tile_cache = {}


def _lego_tile(block):
    if ("lego", block) not in _tile_cache:
        yy, xx = np.mgrid[0:block, 0:block].astype(np.float32)
        tile = np.ones((block, block), np.float32)
        tile[(xx < 2) | (yy < 2)] = 1.28          # bevel highlight
        tile[(xx >= block - 2) | (yy >= block - 2)] = 0.72
        centre = block / 2.0 - 0.5
        rr = np.sqrt((xx - centre) ** 2 + (yy - centre) ** 2)
        tile[rr < block * 0.30] = 1.12            # stud face
        tile[(rr >= block * 0.30) & (rr < block * 0.35)] = 0.78   # stud edge
        tile[(rr < block * 0.22) & (yy < centre)] = 1.34          # stud gloss
        _tile_cache[("lego", block)] = tile
    return _tile_cache[("lego", block)]


def lego(frame, block=24):
    """Built out of plastic bricks, studs and all."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, ((w + block - 1) // block, (h + block - 1) // block),
                       interpolation=cv2.INTER_AREA)
    up = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    tile = _lego_tile(block)
    reps = ((h + block - 1) // block, (w + block - 1) // block)
    shade = np.tile(tile, reps)[:h, :w]
    return np.clip(up.astype(np.float32) * shade[:, :, None], 0, 255).astype(np.uint8)


def _stitch_tile(block):
    if ("stitch", block) not in _tile_cache:
        yy, xx = np.mgrid[0:block, 0:block]
        # Thread thickness scales with the stitch, otherwise the canvas shows
        # through and the whole frame washes out.
        thick = max(1, block // 6)
        tile = ((np.abs(xx - yy) <= thick) |
                (np.abs(xx + yy - (block - 1)) <= thick))
        _tile_cache[("stitch", block)] = tile
    return _tile_cache[("stitch", block)]


def cross_stitch(frame, block=18):
    """Embroidered cross-stitch on linen."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, ((w + block - 1) // block, (h + block - 1) // block),
                       interpolation=cv2.INTER_AREA)
    # Thread reads as washed-out against the pale canvas without a saturation
    # lift and a slight darkening.
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] *= 1.8
    hsv[:, :, 2] *= 0.82
    small = cv2.cvtColor(np.clip(hsv, 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)
    up = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    reps = ((h + block - 1) // block, (w + block - 1) // block)
    mask = np.tile(_stitch_tile(block), reps)[:h, :w]
    canvas = np.full((h, w, 3), (214, 219, 227), np.uint8)
    return np.where(mask[:, :, None], up, canvas)


# --- S-U: optics and screens ---

_MATRIX_CHARS = "01<>*+=|/\\#$%&"
_matrix_state = {}


def matrix_rain(frame, cw=10, ch=16):
    """Falling green code, lit by whatever the camera sees."""
    h, w = frame.shape[:2]
    cols, rows = max(1, w // cw), max(1, h // ch)
    st = _matrix_state
    if st.get("shape") != (rows, cols):
        st["shape"] = (rows, cols)
        st["head"] = np.random.uniform(-rows, 0, cols)
        st["speed"] = np.random.uniform(0.35, 1.3, cols)
        st["chars"] = np.random.randint(0, len(_MATRIX_CHARS), (rows, cols))
    st["head"] += st["speed"]
    spent = st["head"] > rows * 1.5
    st["head"][spent] = np.random.uniform(-rows * 0.6, 0, int(spent.sum()))
    churn = np.random.rand(rows, cols) < 0.04
    st["chars"][churn] = np.random.randint(0, len(_MATRIX_CHARS), int(churn.sum()))

    distance = st["head"][None, :] - np.arange(rows)[:, None]
    trail = np.clip(1.0 - distance / 24.0, 0, 1)
    trail[distance < 0] = 0
    lum = cv2.cvtColor(cv2.resize(frame, (cols, rows), interpolation=cv2.INTER_AREA),
                       cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    # Ambient term keeps the scene faintly readable between the rain columns —
    # without it the frame is almost entirely black.
    amp = np.clip(trail * (0.35 + 0.65 * lum) + 0.42 * lum, 0, 1).astype(np.float32)

    mask = _tile_glyphs(_glyph_atlas(_MATRIX_CHARS, cw, ch), st["chars"])
    lit = mask.astype(np.float32) * cv2.resize(
        amp, (cols * cw, rows * ch), interpolation=cv2.INTER_NEAREST)
    heads = mask.astype(np.float32) * cv2.resize(
        (np.abs(distance) < 1.0).astype(np.float32),
        (cols * cw, rows * ch), interpolation=cv2.INTER_NEAREST)
    out = np.zeros((rows * ch, cols * cw, 3), np.uint8)
    out[:, :, 1] = np.clip(lit, 0, 255).astype(np.uint8)
    out[:, :, 0] = np.clip(heads * 0.75, 0, 255).astype(np.uint8)
    out[:, :, 2] = np.clip(heads * 0.75, 0, 255).astype(np.uint8)
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_NEAREST)


def zoom_blur(frame, steps=8):
    """Radial motion blur streaking out of the centre."""
    h, w = frame.shape[:2]
    small = cv2.resize(frame, (w // 2, h // 2))
    sh, sw = small.shape[:2]
    acc = np.zeros((sh, sw, 3), np.float32)
    for i in range(steps):
        scale = 1.0 + 0.16 * i / (steps - 1)
        matrix = cv2.getRotationMatrix2D((sw / 2, sh / 2), 0, scale)
        acc += cv2.warpAffine(small, matrix, (sw, sh),
                              borderMode=cv2.BORDER_REFLECT)
    return cv2.resize((acc / steps).astype(np.uint8), (w, h))


_tilt_cache = {}


def tilt_shift(frame):
    """Fake miniature — sharp band across the middle, blurred and saturated."""
    h, w = frame.shape[:2]
    if (h, w) not in _tilt_cache:
        ys = np.abs(np.linspace(-1, 1, h, dtype=np.float32))
        band = np.clip((ys - 0.28) / 0.42, 0, 1)[:, None, None]
        _tilt_cache[(h, w)] = band
    band = _tilt_cache[(h, w)]
    small = cv2.resize(frame, (w // 4, h // 4), interpolation=cv2.INTER_AREA)
    blurred = cv2.resize(cv2.GaussianBlur(small, (0, 0), 4), (w, h))
    out = (frame.astype(np.float32) * (1 - band)
           + blurred.astype(np.float32) * band).astype(np.uint8)
    # Push saturation by pulling away from grey — much cheaper than a full-res
    # round trip through HSV.
    grey = cv2.cvtColor(cv2.cvtColor(out, cv2.COLOR_BGR2GRAY), cv2.COLOR_GRAY2BGR)
    return cv2.addWeighted(out, 1.5, grey, -0.5, 0)


# --- V-Z: broadcast and feedback ---

def hologram(frame):
    """Sci-fi projection — cyan, edge-lit, scanned and flickering."""
    h, w = frame.shape[:2]
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    glow = cv2.dilate(cv2.Canny(gray, 60, 160), None).astype(np.int16)
    out = np.zeros((h, w, 3), np.uint8)
    out[:, :, 0] = np.clip(gray.astype(np.int16) * 9 // 10 + glow, 0, 255)
    out[:, :, 1] = np.clip(gray.astype(np.int16) * 7 // 10 + glow, 0, 255)
    out[:, :, 2] = gray // 5
    out[::3, :] = out[::3, :] // 2
    out = np.roll(out, np.random.randint(-2, 3), axis=1)
    return np.clip(out * np.random.uniform(0.82, 1.05), 0, 255).astype(np.uint8)


_vhs_state = {"y": 0.0}


def vhs(frame):
    """Worn VHS tape — chroma bleed and a tracking band crawling up the screen."""
    h, w = frame.shape[:2]
    ycc = cv2.cvtColor(frame, cv2.COLOR_BGR2YCrCb)
    ycc[:, :, 1] = np.roll(ycc[:, :, 1], 7, axis=1)
    ycc[:, :, 2] = np.roll(ycc[:, :, 2], -7, axis=1)
    out = cv2.cvtColor(ycc, cv2.COLOR_YCrCb2BGR)
    _vhs_state["y"] = (_vhs_state["y"] + 11) % (h + 160)
    y0 = int(_vhs_state["y"]) - 80
    y1 = min(h, y0 + 55)
    y0 = max(0, y0)
    if y1 > y0:
        band = np.roll(out[y0:y1], np.random.randint(-35, 35), axis=1)
        noise = np.random.randint(0, 70, (y1 - y0, w, 1), dtype=np.uint8)
        out[y0:y1] = np.clip(band.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    out[::2, :] = (out[::2, :].astype(np.int16) * 9 // 10).astype(np.uint8)
    return out


_echo_prev = None


def echo_tunnel(frame):
    """Video feedback — each frame zooms and rotates into the last."""
    global _echo_prev
    h, w = frame.shape[:2]
    if _echo_prev is None or _echo_prev.shape != frame.shape:
        _echo_prev = frame.astype(np.float32)
    matrix = cv2.getRotationMatrix2D((w / 2, h / 2), 1.6, 1.07)
    zoomed = cv2.warpAffine(_echo_prev, matrix, (w, h),
                            borderMode=cv2.BORDER_REFLECT)
    out = np.clip(frame.astype(np.float32) * 0.42 + zoomed * 0.63, 0, 255)
    _echo_prev = out
    return out.astype(np.uint8)


def bitcrush(frame):
    """Rotate every byte one bit left — wild banding out of tiny value changes."""
    return ((frame << 1) | (frame >> 7)).astype(np.uint8)


_sonar_state = {"angle": 0.0}


def sonar(frame):
    """Radar scope — a sweep that lights up edges as it passes."""
    h, w = frame.shape[:2]
    sw, sh = w // 2, h // 2
    small = cv2.resize(frame, (sw, sh))
    _, _, _, _, radius, angle = _polar(sh, sw)
    _sonar_state["angle"] = (_sonar_state["angle"] + 0.08) % (2 * np.pi)
    behind = (_sonar_state["angle"] - angle) % (2 * np.pi)
    sweep = np.clip(1.0 - behind / 1.0, 0, 1) ** 2

    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 60, 150).astype(np.float32) / 255.0
    base = edges * 0.6 + gray.astype(np.float32) / 255.0 * 0.16
    lit = np.clip(base * (0.45 + 2.2 * sweep) + sweep * 0.16, 0, 1)
    scope = min(sw, sh) * 0.5
    rings = np.abs((radius / scope * 4) % 1.0 - 0.5) < 0.03
    lit = np.clip(lit + rings * 0.14, 0, 1)
    lit[radius > scope] = 0

    out = np.zeros((sh, sw, 3), np.uint8)
    out[:, :, 1] = (lit * 255).astype(np.uint8)
    out[:, :, 0] = (lit * 70).astype(np.uint8)
    out[:, :, 2] = (lit * 55).astype(np.uint8)
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_LINEAR)


# ---------------------------------------------------------------------------
# Registry
# Keys: 1-9, 0, then a-x, z, A-Z
# ---------------------------------------------------------------------------

TRANSFORMS = [
    # 1-0
    ("1: passthrough",    passthrough),
    ("2: grayscale",      grayscale),
    ("3: edges",          edges),
    ("4: gameboy",        gameboy),
    ("5: dither",         dither),
    ("6: glitch",         glitch),
    ("7: mosaic",         mosaic),
    ("8: scanlines",      scanlines),
    ("9: neon edges",     neon_edges),
    ("0: old film",       old_film),
    # a-w (contiguous; 'q' is free now that quit is ']')
    ("a: threshold",      binary_threshold),
    ("b: time tile",      time_tile),
    ("c: tv static",      tv_static),
    ("d: 8-color",        eight_color),
    ("e: retro cga",      retro_cga),
    ("f: motion detect",  motion_detect),
    ("g: anaglyph 3d",    anaglyph_3d),
    ("h: stencil",        stencil),
    ("i: old crt",        old_crt),
    ("j: posterize",      posterize),
    ("k: onion skin",     onion_skin),
    ("l: duotone",        duotone),
    ("m: kaleidoscope",   kaleidoscope),
    ("n: noir",           noir),
    ("o: blueprint",      blueprint),
    ("p: vaporwave",      vaporwave),
    ("q: pencil sketch",  pencil_sketch),
    ("r: oil painting",   oil_painting),
    ("s: cyanotype",      cyanotype),
    ("t: woodcut",        woodcut),
    ("u: sepia",          sepia),
    ("v: solarize",       solarize),
    ("w: pop art",        pop_art),
    ("x: cartoon mosaic", cartoon_mosaic),
    # z, A-Z
    ("z: ascii",          ascii_art),
    ("A: slit scan",      slit_scan),
    ("B: pixel sort",     pixel_sort),
    ("C: thermal",        thermal),
    ("D: night vision",   night_vision),
    ("E: bloom",          bloom),
    ("F: fisheye",        fisheye),
    ("G: swirl",          swirl),
    ("H: tunnel",         tunnel),
    ("I: mirror",         mirror),
    ("J: crystallize",    crystallize),
    ("K: low poly",       low_poly),
    ("L: chromatic",      chromatic),
    ("M: cross hatch",    cross_hatch),
    ("N: emboss",         emboss),
    ("O: contour map",    contour_map),
    ("P: ripple",         ripple),
    ("Q: lego",           lego),
    ("R: cross stitch",   cross_stitch),
    ("S: matrix rain",    matrix_rain),
    ("T: zoom blur",      zoom_blur),
    ("U: tilt shift",     tilt_shift),
    ("V: hologram",       hologram),
    ("W: vhs",            vhs),
    ("X: echo tunnel",    echo_tunnel),
    ("Y: bitcrush",       bitcrush),
    ("Z: sonar",          sonar),
]

QUIT_KEY = "]"


# Build key -> index lookup
KEY_MAP = {}
for _i, (_label, _) in enumerate(TRANSFORMS):
    KEY_MAP[ord(_label[0])] = _i


def _handle_char(ch, state):
    """Apply one typed character. Returns False if it was the quit key."""
    if ch == QUIT_KEY:
        state["quit"] = True
        return False
    key = ord(ch)
    if key in KEY_MAP:
        state["current"] = KEY_MAP[key]
        print(f"Switched to: {TRANSFORMS[state['current']][0]}")
    elif ch.strip():
        print(f"Unknown key: {ch}")
    return True


def _key_reader(state):
    """Read commands from stdin on a background thread, one line at a time."""
    for line in sys.stdin:
        line = line.strip()
        if line and not _handle_char(line[0], state):
            return
    # stdin closed (piped/redirected input, or Ctrl-D). Keep streaming — only an
    # explicit quit key or Ctrl-C should tear the virtual camera down.


def open_webcam(index):
    """Open a webcam by index, returning (cap, first_frame) or (None, None)."""
    cap = cv2.VideoCapture(index)
    if not cap.isOpened():
        cap.release()
        return None, None
    ret, frame = cap.read()
    if not ret:
        cap.release()
        return None, None
    return cap, frame


# A colour a real camera will essentially never produce as a flat field. During
# a reconnect we push this to the virtual camera; any device that reads it back
# IS the virtual camera, i.e. our own output looping around.
_PROBE_COLOR = (37, 211, 102)  # BGR


def _is_own_output(frame):
    """True if `frame` is the probe colour we just sent to the virtual camera."""
    small = cv2.resize(frame, (32, 18)).astype(np.int16)
    target = np.array(_PROBE_COLOR, dtype=np.int16)
    return np.abs(small - target).mean() < 6.0


def reconnect_webcam(cam, preferred, h, w, max_index=6):
    """Find a real webcam again, skipping our own virtual-camera output.

    Device indices shuffle once another app (Zoom) opens a camera, so the index
    we started on can end up pointing at the virtual camera. Returns
    (cap, index) or (None, preferred).
    """
    marker = np.full((h, w, 3), _PROBE_COLOR, dtype=np.uint8)
    for _ in range(3):
        cam.send(cv2.cvtColor(marker, cv2.COLOR_BGR2RGB))
        cam.sleep_until_next_frame()

    candidates = [preferred] + [i for i in range(max_index) if i != preferred]
    fallback = None
    for index in candidates:
        cap, frame = open_webcam(index)
        if cap is None:
            continue
        # First frame after open can be stale; take another.
        ret, frame2 = cap.read()
        if ret:
            frame = frame2
        if _is_own_output(frame):
            cap.release()
            continue
        if frame.mean() < 1.0:
            # All-black: a dead/covered device. Keep looking, but remember it in
            # case nothing better turns up (the room really might be dark).
            if fallback is None:
                fallback = (cap, index)
            else:
                cap.release()
            continue
        return cap, index
    return fallback if fallback else (None, preferred)


def measure_fps(cap, frames=40):
    """Time actual frame delivery.

    macOS/AVFoundation often reports a bogus CAP_PROP_FPS (5.0 on hardware that
    really delivers 24), and that number paces our whole output loop.
    """
    for _ in range(5):  # warm up — the first frames come at an uneven rate
        cap.read()
    start = time.perf_counter()
    count = 0
    for _ in range(frames):
        ret, _frame = cap.read()
        if not ret:
            break
        count += 1
    elapsed = time.perf_counter() - start
    if count < 2 or elapsed <= 0:
        return None
    return count / elapsed


def list_devices(max_index=6):
    """Probe camera indices so you can tell the real webcam from OBS's."""
    print("Probing camera indices (this takes a few seconds)...\n")
    for i in range(max_index):
        cap, frame = open_webcam(i)
        if cap is None:
            print(f"  {i}: (no camera)")
            continue
        h, w = frame.shape[:2]
        print(f"  {i}: {w}x{h}  mean brightness {frame.mean():5.1f}")
        cap.release()
    print(
        "\nPick the index matching your real webcam and pass it with --device N.\n"
        "A near-zero brightness is usually the OBS Virtual Camera (feeding back\n"
        "into itself) or a lens-covered camera — don't use that one as the source."
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--device", type=int, default=0,
                        help="webcam index to capture from (default: 0)")
    parser.add_argument("--fps", type=int, default=None,
                        help="override output fps (default: auto-detect)")
    parser.add_argument("--list-devices", action="store_true",
                        help="probe camera indices and exit")
    args = parser.parse_args()

    if args.list_devices:
        list_devices()
        return

    device = args.device
    cap, test_frame = open_webcam(device)
    if cap is None:
        print(f"ERROR: Could not open webcam at index {device}. "
              f"Try: python main.py --list-devices", file=sys.stderr)
        sys.exit(1)

    h, w = test_frame.shape[:2]

    if args.fps:
        fps = args.fps
    else:
        reported = cap.get(cv2.CAP_PROP_FPS)
        if 15 <= reported <= 120:
            fps = int(round(reported))
        else:
            print(f"Driver reports {reported:g} fps — measuring actual rate...")
            measured = measure_fps(cap)
            fps = int(round(measured)) if measured else 30
            fps = max(5, min(fps, 60))

    state = {"current": 0, "quit": False}

    print(f"Webcam: device {device}, {w}x{h} @ {fps}fps")
    print("Opening virtual camera...")
    print("Available transforms:")
    for name, _ in TRANSFORMS:
        print(f"  {name}")
    try:
        cam_ctx = pyvirtualcam.Camera(width=w, height=h, fps=fps)
    except RuntimeError as e:
        print(
            f"ERROR: Could not open a virtual camera backend.\n{e}\n\n"
            "On macOS: install OBS Studio (https://obsproject.com), then enable\n"
            "  System Settings > General > Login Items & Extensions > Camera Extensions\n"
            "  > OBS Virtual Camera, and click 'Start Virtual Camera' in OBS once.\n"
            "  A reboot is often required after first approving the extension.\n"
            "On Linux: install v4l2loopback.\n"
            "On Windows: install OBS with its virtual camera.",
            file=sys.stderr,
        )
        sys.exit(1)

    print(f"\nType the key shown before each name (then Enter) to switch. "
          f"'{QUIT_KEY}' to quit.")

    threading.Thread(target=_key_reader, args=(state,), daemon=True).start()

    last_out = np.zeros((h, w, 3), dtype=np.uint8)
    fail_streak = 0

    try:
        with cam_ctx as cam:
            print(f"Virtual camera: {cam.device}")

            while not state["quit"]:
                ret, frame = (False, None) if cap is None else cap.read()

                if not ret:
                    # macOS interrupts the capture session when another app
                    # (Zoom, Chrome, ...) switches cameras. Don't die — hold the
                    # last frame on the virtual camera and reconnect.
                    fail_streak += 1
                    if fail_streak == 1:
                        print("Webcam read failed — reconnecting...")
                    if cap is not None:
                        cap.release()
                        cap = None
                    cam.send(cv2.cvtColor(last_out, cv2.COLOR_BGR2RGB))
                    cam.sleep_until_next_frame()
                    if fail_streak % fps == 0:  # retry roughly once a second
                        cap, found = reconnect_webcam(cam, device, h, w)
                        if cap is not None:
                            if found != device:
                                print(f"Device index shifted: {device} -> {found}")
                                device = found
                            print("Webcam reconnected.")
                            fail_streak = 0
                    continue

                fail_streak = 0

                _, transform_fn = TRANSFORMS[state["current"]]
                out = transform_fn(frame)

                if out.shape[:2] != (h, w):
                    out = cv2.resize(out, (w, h))
                if len(out.shape) == 2:
                    out = cv2.cvtColor(out, cv2.COLOR_GRAY2BGR)

                last_out = out
                cam.send(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))
                cam.sleep_until_next_frame()

    except KeyboardInterrupt:
        pass
    finally:
        if cap is not None:
            cap.release()


if __name__ == "__main__":
    main()

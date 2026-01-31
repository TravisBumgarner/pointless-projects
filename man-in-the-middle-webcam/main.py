"""
Man-in-the-Middle Webcam

Captures your real webcam, applies a transform, and outputs to a virtual
camera that Zoom/Chrome/etc. can use.

Requirements:
  - OBS Studio installed (provides the virtual camera driver on macOS)
  - pip install -r requirements.txt

Usage:
  python main.py

Controls (in the preview window):
  1-0, a-y   Select transform (shown in list)
  q           Quit
"""

import time
import sys
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


def halftone(frame, dot_spacing=6):
    """Halftone dot pattern."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    out = np.ones((h, w), dtype=np.uint8) * 255
    for y in range(0, h, dot_spacing):
        for x in range(0, w, dot_spacing):
            brightness = gray[y, x]
            radius = int((255 - brightness) / 255 * (dot_spacing // 2 + 1))
            if radius > 0:
                cv2.circle(out, (x, y), radius, 0, -1)
    return cv2.cvtColor(out, cv2.COLOR_GRAY2BGR)


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


def split_rgb(frame):
    """Show R, G, B channels as vertical strips."""
    w = frame.shape[1]
    third = w // 3
    out = np.zeros_like(frame)
    out[:, :third, 2] = frame[:, :third, 2]
    out[:, third:2 * third, 1] = frame[:, third:2 * third, 1]
    out[:, 2 * third:, 0] = frame[:, 2 * third:, 0]
    return out


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
    """Only show pixels that are moving — everything else goes black."""
    global _motion_prev
    if _motion_prev is None or _motion_prev.shape != frame.shape:
        _motion_prev = frame.copy()
    diff = cv2.absdiff(frame, _motion_prev)
    _motion_prev = frame.copy()
    gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray_diff, 25, 255, cv2.THRESH_BINARY)
    mask_3ch = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    return cv2.bitwise_and(frame, mask_3ch)


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
# Registry
# Keys: 1-9, 0, then a-y (skipping q which is quit)
# ---------------------------------------------------------------------------

TRANSFORMS = [
    # 1-0
    ("1: passthrough",    passthrough),
    ("2: grayscale",      grayscale),
    ("3: edges",          edges),
    ("4: gameboy",        gameboy),
    ("5: dither",         dither),
    ("6: glitch",         glitch),
    ("7: halftone",       halftone),
    ("8: scanlines",      scanlines),
    ("9: neon edges",     neon_edges),
    ("0: old film",       old_film),
    # a-d
    ("a: threshold",      binary_threshold),
    ("b: time tile",      time_tile),
    ("c: split rgb",      split_rgb),
    ("d: tv static",      tv_static),
    # e-l: kept
    ("e: 8-color",        eight_color),
    ("f: retro cga",      retro_cga),
    ("g: motion detect",  motion_detect),
    ("h: anaglyph 3d",    anaglyph_3d),
    ("i: stencil",        stencil),
    ("j: old crt",        old_crt),
    ("k: posterize",      posterize),
    ("l: onion skin",     onion_skin),
    # m-n: kept
    ("m: duotone",        duotone),
    ("n: kaleidoscope",   kaleidoscope),
    # o-p: kept
    ("o: noir",           noir),
    ("p: blueprint",      blueprint),
    # r-t: kept
    ("r: vaporwave",      vaporwave),
    ("s: pencil sketch",  pencil_sketch),
    ("t: oil painting",   oil_painting),
    # u-y: new
    ("u: cyanotype",      cyanotype),
    ("v: woodcut",        woodcut),
    ("w: sepia",          sepia),
    ("x: solarize",       solarize),
    ("y: pop art",        pop_art),
]


# Build key -> index lookup
KEY_MAP = {}
for _i, (_label, _) in enumerate(TRANSFORMS):
    KEY_MAP[ord(_label[0])] = _i


def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("ERROR: Could not open webcam.", file=sys.stderr)
        sys.exit(1)

    ret, test_frame = cap.read()
    if not ret:
        print("ERROR: Could not read from webcam.", file=sys.stderr)
        sys.exit(1)

    h, w = test_frame.shape[:2]
    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30

    current = 0

    print(f"Webcam: {w}x{h} @ {fps}fps")
    print("Opening virtual camera...")
    print("Available transforms:")
    for name, _ in TRANSFORMS:
        print(f"  {name}")
    print("\nPress the key shown before each name to switch. 'q' to quit.")

    try:
        with pyvirtualcam.Camera(width=w, height=h, fps=fps) as cam:
            print(f"Virtual camera: {cam.device}")

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                _, transform_fn = TRANSFORMS[current]
                out = transform_fn(frame)

                if out.shape[:2] != (h, w):
                    out = cv2.resize(out, (w, h))
                if len(out.shape) == 2:
                    out = cv2.cvtColor(out, cv2.COLOR_GRAY2BGR)

                cam.send(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))

                label = TRANSFORMS[current][0]
                preview = out.copy()
                cv2.putText(preview, label, (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
                cv2.imshow("Man-in-the-Middle Webcam", preview)

                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    break
                elif key in KEY_MAP:
                    current = KEY_MAP[key]
                    print(f"Switched to: {TRANSFORMS[current][0]}")

                cam.sleep_until_next_frame()

    except pyvirtualcam.RegistryError:
        print(
            "ERROR: No virtual camera backend found.\n"
            "On macOS, install OBS Studio: https://obsproject.com\n"
            "On Linux, install v4l2loopback.\n"
            "On Windows, install OBS with its virtual camera.",
            file=sys.stderr,
        )
        sys.exit(1)
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()

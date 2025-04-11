from PIL import Image
import numpy as np

# colormath seems to not work with newer versions of numpy. So monkey patch.
if not hasattr(np, "asscalar"):
    np.asscalar = lambda a: a.item()
import json
from utils import setup_dirs, setup_json

from colormath.color_objects import sRGBColor, LabColor
from colormath.color_conversions import convert_color
from colormath.color_diff import delta_e_cie2000

# From chat GPT on distance:
# 0 = identical
# < 1 = not perceptible to human eye
# 1–2 = barely noticeable
# 2–10 = noticeable
# > 10 = very noticeable
# > 50 = completely different


def perceptual_color_distance(hex1: str, hex2: str) -> float:
    rgb1 = sRGBColor.new_from_rgb_hex(hex1)
    rgb2 = sRGBColor.new_from_rgb_hex(hex2)

    lab1 = convert_color(rgb1, LabColor)
    lab2 = convert_color(rgb2, LabColor)

    delta_e = delta_e_cie2000(lab1, lab2)
    return delta_e.item() if hasattr(delta_e, "item") else delta_e


def get_image_colors(image_path: str) -> list[str]:
    img = Image.open(image_path)

    # Convert to numpy array
    pixels = np.array(img)
    pixels = pixels.reshape(-1, 3)

    # Convert each pixel to hex
    hex_colors = ["#{:02x}{:02x}{:02x}".format(r, g, b) for r, g, b in pixels]

    # Count frequencies and get sorted colors by frequency
    unique, counts = np.unique(hex_colors, return_counts=True)
    top_colors = np.argsort(counts)[::-1]

    palettes = []
    min_distance = 20  # Adjust this threshold as needed

    for i in top_colors:
        color = unique[i]
        # Skip if too similar to any existing color
        if any(
            perceptual_color_distance(color, existing) < min_distance
            for existing in palettes
        ):
            continue

        palettes.append(color)
        if len(palettes) == 6:
            break

    return palettes

    # Return top 6 colors in uppercase
    return [unique[i].upper() for i in top_6_indices]


def sync_palettes():
    [palettes_path, images_dir] = setup_dirs("python_color_distance_20")
    [new_images, palettes] = setup_json(palettes_path, images_dir)

    # Add new images with extracted colors
    for image in new_images:
        print(f"\tProcessing {image}")
        colors = get_image_colors(images_dir / image)
        palettes[image] = colors

    # Write back to file
    with open(palettes_path, "w") as f:
        json.dump(palettes, f, indent=2)

    print(f"\tAdded {len(new_images)} new images")
    if new_images:
        print("\tNew images:", new_images)


if __name__ == "__main__":
    print("\tRunning sync_palettes")
    sync_palettes()

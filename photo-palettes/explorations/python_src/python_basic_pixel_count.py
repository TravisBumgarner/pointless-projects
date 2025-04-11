from PIL import Image
import numpy as np
import json
from utils import setup_dirs, setup_json


def get_image_colors(image_path: str) -> list[str]:
    # Load image
    img = Image.open(image_path)

    # Convert to numpy array
    pixels = np.array(img)
    pixels = pixels.reshape(-1, 3)

    # Convert each pixel to hex
    hex_colors = ["#{:02x}{:02x}{:02x}".format(r, g, b) for r, g, b in pixels]

    # Count frequencies and get top 6
    unique, counts = np.unique(hex_colors, return_counts=True)
    top_6_indices = np.argsort(counts)[-6:]

    # Return top 6 colors in uppercase
    return [unique[i].upper() for i in top_6_indices]


def sync_palettes():
    [palettes_path, images_dir] = setup_dirs("python_basic_pixel_count")
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

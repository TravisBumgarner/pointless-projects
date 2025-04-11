from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import json
from utils import setup_dirs, setup_json


def get_image_colors(image_path: str) -> list[str]:
    # Load and resize image
    img = Image.open(image_path)

    # Downsample to max 200x200
    scale = min(200 / img.size[0], 200 / img.size[1])
    new_size = tuple(int(dim * scale) for dim in img.size)
    img = img.resize(new_size, Image.Resampling.LANCZOS)

    # Convert to numpy array and reshape
    pixels = np.array(img)
    pixels = pixels.reshape(-1, 3)

    # Sample every 4th pixel
    pixels = pixels[::4]

    # Run k-means
    kmeans = KMeans(n_clusters=6, random_state=42)
    kmeans.fit(pixels)

    # Convert centroids to hex colors
    colors = []
    for center in kmeans.cluster_centers_:
        rgb = tuple(int(x) for x in center)
        hex_color = "#{:02x}{:02x}{:02x}".format(*rgb)
        colors.append(hex_color.upper())

    return colors


def sync_palettes():
    [palettes_path, images_dir] = setup_dirs("python-kmeans")
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

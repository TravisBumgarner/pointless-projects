from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import json
import os
from pathlib import Path


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
        colors.append(hex_color)

    return colors


def sync_palettes():
    # Setup paths
    root_dir = Path(__file__).parent.parent
    palettes_path = root_dir / "src" / "data" / "palettes.json"
    images_dir = root_dir / "src" / "data" / "images"

    # Read existing palettes
    with open(palettes_path) as f:
        palettes = json.load(f)

    existing_images = {p["src"] for p in palettes}

    # Get all images
    image_files = [
        f
        for f in os.listdir(images_dir)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".avif", ".webp"))
    ]

    # Find new images
    new_images = [img for img in image_files if img not in existing_images]

    # Add new images with extracted colors
    for image in new_images:
        print(f"Processing {image}")
        colors = get_image_colors(images_dir / image)
        palettes.append({"src": image, "colors": colors})

    # Write back to file
    with open(palettes_path, "w") as f:
        json.dump(palettes, f, indent=2)

    print(f"Added {len(new_images)} new images")
    if new_images:
        print("New images:", new_images)


if __name__ == "__main__":
    sync_palettes()

import json
import os
from pathlib import Path


def setup_dirs(algorithm):
    root_dir = Path(__file__).parent.parent
    palettes_path = root_dir / "viewer" / "src" / "data" / f"{algorithm}.json"
    images_dir = root_dir / "viewer" / "src" / "data" / "images"
    return [palettes_path, images_dir]


def setup_json(palettes_path, images_dir):
    # If DISABLE_CACHE env var exists, delete and recreate json
    if os.getenv("DISABLE_CACHE"):
        if palettes_path.exists():
            palettes_path.unlink()
        palettes = {}
    else:
        palettes_path.parent.mkdir(parents=True, exist_ok=True)
        # Read existing palettes
        with open(palettes_path) as f:
            palettes = json.load(f)

    existing_images = set(palettes.keys())

    # Get all images
    image_files = [
        f
        for f in os.listdir(images_dir)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".avif", ".webp"))
    ]

    # Find new images
    new_images = [img for img in image_files if img not in existing_images]
    return [new_images, palettes]

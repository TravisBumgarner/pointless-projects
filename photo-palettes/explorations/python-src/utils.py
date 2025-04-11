import json
import os
from pathlib import Path


def setup_dirs(algorithm):
    root_dir = Path(__file__).parent.parent
    palettes_path = root_dir / "viewer" / "src" / "data" / f"{algorithm}.json"
    images_dir = root_dir / "viewer" / "src" / "data" / "images"
    return [palettes_path, images_dir]


def setup_json(palettes_path, images_dir):
    # Delete existing file and create new [algorithm].json
    if palettes_path.exists():
        palettes_path.unlink()
    palettes_path.parent.mkdir(parents=True, exist_ok=True)
    with open(palettes_path, "w") as f:
        json.dump({}, f)

    # Read existing palettes
    with open(palettes_path) as f:
        palettes = json.load(f)

    # Get all images
    image_files = [
        f
        for f in os.listdir(images_dir)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".avif", ".webp"))
    ]

    # Find new images
    return [image_files, palettes]

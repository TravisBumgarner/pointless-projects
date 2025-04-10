from pathlib import Path
import json
import os


def sync_images():
    # Setup paths
    root_dir = Path(__file__).parent
    output_path = root_dir / "viewer" / "src" / "data" / "images.json"
    images_dir = root_dir / "viewer" / "src" / "data" / "images"

    # Get all images
    image_files = [
        f
        for f in os.listdir(images_dir)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".avif", ".webp"))
    ]

    # Write to file
    with open(output_path, "w") as f:
        json.dump(image_files, f, indent=2)


if __name__ == "__main__":
    print("\tRunning sync_images")
    sync_images()

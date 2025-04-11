import json
from utils import setup_dirs, setup_json


def get_image_colors(image_path: str) -> list[str]:
    print('implement me')


def sync_palettes():
    [palettes_path, images_dir] = setup_dirs("template")
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

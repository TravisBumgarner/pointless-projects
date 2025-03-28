import * as fs from "fs/promises";
import * as path from "path";

type Palette = {
  image: string;
  colors: string[];
};

async function syncPalettes() {
  // Read existing palettes
  const palettesPath = path.join(process.cwd(), "..", "src", "palettes.json");
  const imagesDir = path.join(process.cwd(), "..", "src", "images");

  const palettes = JSON.parse(await fs.readFile(palettesPath, "utf-8"));
  const existingImages = new Set(palettes.map((p: Palette) => p.image));

  // Get all images
  const files = await fs.readdir(imagesDir);
  const imageFiles = files.filter((f) =>
    /\.(jpg|jpeg|png|avif|webp)$/i.test(f)
  );

  // Find new images
  const newImages = imageFiles.filter((img) => !existingImages.has(img));

  // Add new images with empty color arrays
  const newPalettes = [
    ...palettes,
    ...newImages.map((image) => ({
      image,
      colors: [],
    })),
  ];

  // Write back to file
  await fs.writeFile(palettesPath, JSON.stringify(newPalettes, null, 2));

  console.log(`Added ${newImages.length} new images`);
  if (newImages.length > 0) {
    console.log("New images:", newImages);
  }
}

syncPalettes().catch(console.error);

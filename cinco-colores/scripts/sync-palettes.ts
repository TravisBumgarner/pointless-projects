import { createCanvas, loadImage } from "canvas";
import * as fs from "fs/promises";
import kmeans from "node-kmeans";
import * as path from "path";

type Palette = {
  image: string;
  colors: string[];
};

async function getImageColors(imagePath: string): Promise<string[]> {
  const image = await loadImage(imagePath);
  // Downsample to max 200x200 while maintaining aspect ratio
  const scale = Math.min(200 / image.width, 200 / image.height);
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height).data;

  // Sample every 4th pixel to further reduce memory usage
  const pixels: number[][] = [];
  for (let i = 0; i < imageData.length; i += 16) {
    pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
  }

  // Run k-means
  const results = await new Promise((resolve, reject) => {
    kmeans.clusterize(pixels, { k: 6 }, (err: Error, res: any) => {
      if (err) reject(err);
      resolve(res);
    });
  });

  // Convert centroids to hex colors
  return (results as any).centroids.map(
    (c: number[]) =>
      "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  );
}

async function syncPalettes() {
  // Read existing palettes
  const palettesPath = path.join(
    process.cwd(),
    "..",
    "src",
    "data",
    "palettes.json"
  );
  const imagesDir = path.join(process.cwd(), "..", "src", "data", "images");

  const palettes = JSON.parse(await fs.readFile(palettesPath, "utf-8"));
  const existingImages = new Set(palettes.map((p: Palette) => p.image));

  // Get all images
  const files = await fs.readdir(imagesDir);
  const imageFiles = files.filter((f) =>
    /\.(jpg|jpeg|png|avif|webp)$/i.test(f)
  );

  // Find new images
  const newImages = imageFiles.filter((img) => !existingImages.has(img));

  // Add new images with extracted colors
  const newPalettes = [
    ...palettes,
    ...(await Promise.all(
      newImages.map(async (src) => ({
        src,
        colors: await getImageColors(path.join(imagesDir, src)),
      }))
    )),
  ];

  // Write back to file
  await fs.writeFile(palettesPath, JSON.stringify(newPalettes, null, 2));

  console.log(`Added ${newImages.length} new images`);
  if (newImages.length > 0) {
    console.log("New images:", newImages);
  }
}

syncPalettes().catch(console.error);

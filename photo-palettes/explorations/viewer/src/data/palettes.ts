import { z } from "zod";
import images from "./images.json";
import python_basic_pixel_count from "./python-basic-pixel-count.json";
import python_color_thief from "./python-color-thief.json";
import python_kmeans from "./python-kmeans.json";

const PaletteSchema = z.record(z.array(z.string()).length(6));
export type Palette = z.infer<typeof PaletteSchema>;

const ImageNamesSchema = z.array(z.string());
export type ImageNames = z.infer<typeof ImageNamesSchema>;

export enum Algorithm {
  PythonKMeans = "python_kmeans",
  PythonColorThief = "python_color_thief",
  BasicPixelCount = "python_basic_pixel_count",
}

const palettes = {
  [Algorithm.PythonKMeans]: PaletteSchema.parse(python_kmeans),
  [Algorithm.PythonColorThief]: PaletteSchema.parse(python_color_thief),
  [Algorithm.BasicPixelCount]: PaletteSchema.parse(python_basic_pixel_count),
};

export default {
  palettes,
  images: ImageNamesSchema.parse(images),
};

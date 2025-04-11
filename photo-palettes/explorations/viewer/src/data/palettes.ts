import { z } from "zod";
import images from "./images.json";
import python_basic_pixel_count from "./python_basic_pixel_count.json";
import python_color_distance_10 from "./python_color_distance_10.json";
import python_color_distance_20 from "./python_color_distance_20.json";
import python_color_distance_50 from "./python_color_distance_50.json";
import python_color_thief from "./python_color_thief.json";
import python_kmeans from "./python_kmeans.json";

const PaletteSchema = z.record(z.array(z.string()));
export type Palette = z.infer<typeof PaletteSchema>;

const ImageNamesSchema = z.array(z.string());
export type ImageNames = z.infer<typeof ImageNamesSchema>;

export enum Algorithm {
  PythonKMeans = "python_kmeans",
  PythonColorThief = "python_color_thief",
  PythonBasicPixelCount = "python_basic_pixel_count",
  PythonColorDistance10 = "python_color_CIEDE2000_distance_10",
  PythonColorDistance20 = "python_color_CIEDE2000_distance_20",
  PythonColorDistance50 = "python_color_CIEDE2000_distance_50",
}

const palettes = {
  [Algorithm.PythonKMeans]: PaletteSchema.parse(python_kmeans),
  [Algorithm.PythonColorThief]: PaletteSchema.parse(python_color_thief),
  [Algorithm.PythonBasicPixelCount]: PaletteSchema.parse(
    python_basic_pixel_count
  ),
  [Algorithm.PythonColorDistance50]: PaletteSchema.parse(
    python_color_distance_50
  ),
  [Algorithm.PythonColorDistance20]: PaletteSchema.parse(
    python_color_distance_20
  ),
  [Algorithm.PythonColorDistance10]: PaletteSchema.parse(
    python_color_distance_10
  ),
};

export default {
  palettes,
  images: ImageNamesSchema.parse(images),
};

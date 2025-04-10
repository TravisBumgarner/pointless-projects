import { z } from "zod";
import images from "./images.json";
import python_kmeans from "./python-kmeans.json";

const PaletteSchema = z.record(z.array(z.string()).length(6));
export type Palette = z.infer<typeof PaletteSchema>;

const ImageNamesSchema = z.array(z.string());
export type ImageNames = z.infer<typeof ImageNamesSchema>;

export enum Algorithm {
  PythonKMeans = "python_kmeans",
}

const palettes = {
  [Algorithm.PythonKMeans]: PaletteSchema.parse(python_kmeans),
};

export default {
  palettes,
  images: ImageNamesSchema.parse(images),
};

import { z } from "zod";
import palettes from "./palettes.json";

const PaletteSchema = z.object({
  src: z.string(),
  colors: z.array(z.string()).length(6),
});

export type Palette = z.infer<typeof PaletteSchema>;

export const colorPalettes = palettes.map((palette) =>
  PaletteSchema.parse({
    src: palette.src,
    colors: palette.colors,
  })
);

import palettes from "./palettes.json";

export const colorPalettes = palettes.map((palette) => {
  return {
    image: palette.image,
    colors: palette.colors,
  };
});

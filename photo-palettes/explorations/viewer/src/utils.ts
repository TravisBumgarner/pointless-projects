// Code adapted from https://codepen.io/taneleero/pen/JqVBbM

type HSL = { h: number; s: number; l: number };

// Converts a hex string to an HSL object
function hexToHsl(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function sortByLightness(colors: string[]): string[] {
  return [...colors].sort((a, b) => hexToHsl(a).l - hexToHsl(b).l);
}

export function sortByHue(colors: string[]): string[] {
  return [...colors].sort((a, b) => hexToHsl(a).h - hexToHsl(b).h);
}

export function sortBySaturation(colors: string[]): string[] {
  return [...colors].sort((a, b) => hexToHsl(a).s - hexToHsl(b).s);
}

export const rgbToHex = (rgb: string) => {
  const match = rgb.match(/\d+/g); // Extracts the numbers
  if (!match) return null;

  return `#${match
    .map((num) => parseInt(num).toString(16).padStart(2, "0")) // Convert to hex
    .join("")}`; // Join and ensure uppercase
};

export const getContrastColor = (hexColor: string, invert = false): string => {
  if (hexColor.startsWith("rgb")) {
    hexColor = rgbToHex(hexColor)!;
  }
  const color = hexColor.replace("#", "");

  // Convert hex to rgb
  const r = parseInt(color.slice(0, 2), 16) / 255;
  const g = parseInt(color.slice(2, 4), 16) / 255;
  const b = parseInt(color.slice(4, 6), 16) / 255;

  // Convert sRGB to linear RGB
  const toLinear = (c: number): number => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  // Calculate luminance
  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  let shouldReturnDark = luminance > 0.179;
  shouldReturnDark = invert ? !shouldReturnDark : shouldReturnDark;
  // Return black or white based on luminance

  return shouldReturnDark ? "#000000" : "#ffffff";
};

export const hexToRgbDisplay = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
};

export const hexToHslDisplay = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `hsl(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
};

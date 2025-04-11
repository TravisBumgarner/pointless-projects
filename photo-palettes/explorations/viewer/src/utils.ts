// Code adapted from https://codepen.io/taneleero/pen/JqVBbM

type HSL = { h: number; s: number; l: number };

// Converts a hex string to an HSL object
function hexToHsl(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
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
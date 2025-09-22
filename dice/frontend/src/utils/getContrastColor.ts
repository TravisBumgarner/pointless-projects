import { PALETTE } from '../styles/styleConsts'

/**
 * Takes in a hex color background and returns white or black based on what the contrast should be.
 */

export const getContrastColor = (hexColor: string, invert = false): string => {
  if (hexColor.startsWith('rgb')) {
    hexColor = rgbToHex(hexColor)!
  }
  const color = hexColor.replace('#', '')

  // Convert hex to rgb
  const r = parseInt(color.slice(0, 2), 16) / 255
  const g = parseInt(color.slice(2, 4), 16) / 255
  const b = parseInt(color.slice(4, 6), 16) / 255

  // Convert sRGB to linear RGB
  const toLinear = (c: number): number => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }

  // Calculate luminance
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

  let shouldReturnDark = luminance > 0.179
  shouldReturnDark = invert ? !shouldReturnDark : shouldReturnDark
  // Return black or white based on luminance

  return shouldReturnDark ? PALETTE.grayscale[900] : PALETTE.grayscale[100]
}

export const rgbToHex = (rgb: string) => {
  const match = rgb.match(/\d+/g) // Extracts the numbers
  if (!match) return null

  return `#${match
    .map(num => parseInt(num).toString(16).padStart(2, '0')) // Convert to hex
    .join('')}` // Join and ensure uppercase
}

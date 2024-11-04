import { mix, parseToRgb } from "polished";
import { RGBColor } from "react-color";
import { PickedColors } from "./types";

export const generateColors = ({startColor, endColor, increments}: PickedColors) => {
    // const colors = [];
    const rgbArray: RGBColor[] = [];
    for (let i = 0; i <= increments; i++) {
      const ratio = i / increments;
      const color = mix(ratio, rgbToString(startColor), rgbToString(endColor));
      console.log('color', startColor, endColor, color)
      const {red, green, blue} = parseToRgb(color);

      // yay different libraries.
  
      rgbArray.push({r: red, g: green, b: blue})
    //   const stringColor = `rgb(${rgbColor.red}, ${rgbColor.green}, ${rgbColor.blue})`;
    //   colors.push(stringColor);
    }
    return rgbArray
    
}

export const rgbToString = (color: RGBColor) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
}
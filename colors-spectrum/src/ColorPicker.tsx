import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CompactPicker } from 'react-color';
import { mix, parseToRgb } from 'polished';

// I can't be bothered.
export type LazyRGBColor = {
  red: number;
  green: number;
  blue: number;
}

type Props = {
  colorChangeCallback: (colors: LazyRGBColor[]) => void
}

const ColorInterpolator = ({colorChangeCallback}: Props) => {
  const [startColor, setStartColor] = useState('rgb(255, 0, 0)');
  const [endColor, setEndColor] = useState('rgb(0, 0, 255)');
  const [increments, setIncrements] = useState(5);
  const [colors, setColors] = useState<any[]>([]);

  const handleStartColorChange = useCallback((color: any) => {
    const { r, g, b } = color.rgb;
    setStartColor(`rgb(${r}, ${g}, ${b})`);
  }, []);

  const handleEndColorChange = useCallback((color: any) => {
    const { r, g, b } = color.rgb;
    setEndColor(`rgb(${r}, ${g}, ${b})`);
  }, []);

  const handleIncrementsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncrements(parseInt(event.target.value, 10));
  }, []);

  const generateColors = useCallback(() => {
    const colors = [];
    const rgbArray: LazyRGBColor[] = [];
    for (let i = 0; i <= increments; i++) {
      const ratio = i / increments;
      const color = mix(ratio, startColor, endColor);
      const rgbColor = parseToRgb(color);
      
      rgbArray.push(rgbColor as unknown as LazyRGBColor)
      const stringColor = `rgb(${rgbColor.red}, ${rgbColor.green}, ${rgbColor.blue})`;
      colors.push(stringColor);
    }
    console.log('???', rgbArray)
    colorChangeCallback(rgbArray);
    setColors(colors);
  },  [colorChangeCallback, endColor, increments, startColor]);

  useEffect(() => {
    generateColors();
  }, [generateColors, startColor, endColor, increments]);

  return (
    <Container>
      <PickerContainer>
        <div>
          <h3>Start Color</h3>
          <CompactPicker color={startColor} onChange={handleStartColorChange} />
        </div>
        <div>
          <h3>End Color</h3>
          <CompactPicker color={endColor} onChange={handleEndColorChange} />
        </div>
        <div>
          <h3>Increments</h3>
          <input type="number" value={increments} onChange={handleIncrementsChange} min="1" />
        </div>
      </PickerContainer>
      <ColorsContainer>
        {colors.map((color, index) => (
          <ColorBox key={index} style={{ backgroundColor: color }}>
            {color}
          </ColorBox>
        ))}
      </ColorsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const PickerContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

const ColorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ColorBox = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

export default ColorInterpolator;
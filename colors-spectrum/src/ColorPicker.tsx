import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { mix, parseToRgb} from 'polished';

const convertHex3ToHex6 = (hex: string): string => {
  if (hex.length === 4 && hex[0] === '#') {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return hex;
};

type Props = {
  colorChangeCallback: (colors: Set<string>) => void
}

const ColorInterpolator = ({colorChangeCallback}: Props) => {
  const [startColor, setStartColor] = useState('rgb(255, 0, 0)');
  const [endColor, setEndColor] = useState('rgb(0, 0, 255)');
  const [increments, setIncrements] = useState(5);
  const [colors, setColors] = useState<string[]>([]);

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
    for (let i = 0; i <= increments; i++) {
      const ratio = i / increments;
      const color = mix(ratio, startColor, endColor);
      colors.push(Object.values(parseToRgb(color)).join(','));
    }
    console.log(colors)
    colorChangeCallback(new Set(colors));
    setColors(colors);
  }, [colorChangeCallback, endColor, increments, startColor]);

  useEffect(() => {
    generateColors();
  }, [generateColors]);

  return (
    <Container>
      <PickerContainer>
        <div>
          <h3>Start Color</h3>
          <SketchPicker color={startColor} onChange={handleStartColorChange} />
        </div>
        <div>
          <h3>End Color</h3>
          <SketchPicker color={endColor} onChange={handleEndColorChange} />
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
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

export default ColorInterpolator;
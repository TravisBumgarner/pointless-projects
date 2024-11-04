import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CompactPicker, RGBColor } from 'react-color';
import { mix, parseToRgb } from 'polished';
import { generateColors, rgbToString } from './utilities';
import ColorDisplay from './ColorDisplay';
import { PickedColors } from './types';


type Props = {
  colorChangeCallback: (colors: PickedColors) => void
}


const ColorInterpolator = ({colorChangeCallback}: Props) => {
  const [startColor, setStartColor] = useState({r: 0, g: 0, b: 0});
  const [endColor, setEndColor] = useState({r: 255, g: 255, b: 255});
  const [increments, setIncrements] = useState(5);

  const handleStartColorChange = useCallback((color: any) => {
    setStartColor(color.rgb);
  }, []);

  const handleEndColorChange = useCallback((color: any) => {
    setEndColor(color.rgb);
  }, []);

  const handleIncrementsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncrements(parseInt(event.target.value, 10));
}, []);

  useEffect(() => {
    colorChangeCallback({startColor, endColor, increments});
  }, [startColor, endColor, increments, colorChangeCallback]);

  return (
    <Container>
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
        <ColorDisplay column colors={generateColors({startColor, endColor, increments})} />
    </Container>
  );
};

const Container = styled.div`
  width: 250px;
  padding: 20px;
`;



export default ColorInterpolator;
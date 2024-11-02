import React, { useState } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { mix } from 'polished';

const ColorInterpolator = () => {
  const [startColor, setStartColor] = useState('#ff0000');
  const [endColor, setEndColor] = useState('#0000ff');
  const [increments, setIncrements] = useState(5);

  const handleStartColorChange = (color: any) => {
    setStartColor(color.hex);
  };

  const handleEndColorChange = (color: any) => {
    setEndColor(color.hex);
  };

  const handleIncrementsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncrements(parseInt(event.target.value, 10));
  };

  const generateColors = () => {
    const colors = [];
    for (let i = 0; i <= increments; i++) {
      const ratio = i / increments;
      const color = mix(ratio, startColor, endColor);
      colors.push(color);
    }
    return colors;
  };

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
        {generateColors().map((color, index) => (
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
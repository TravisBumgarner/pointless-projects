import { RGBColor } from "react-color";
import styled from "styled-components";
import { rgbToString } from "./utilities";

const ColorDisplay = ({colors, column}: {colors: RGBColor[], column?: boolean}) => {
  console.log('colordisplay', colors)
    return (
        <ColorsContainer column={column}>
        {colors.map((color, index) => (
          <ColorBox key={index} style={{ backgroundColor: rgbToString(color) }}>
            {rgbToString(color)}
          </ColorBox>
        ))}
      </ColorsContainer>
    )
}

const ColorsContainer = styled.div<{column?: boolean}>`
  display: flex;
  justify-content: center;
  flex-direction: ${props => props.column ? 'column' : 'row'};
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

export default ColorDisplay;
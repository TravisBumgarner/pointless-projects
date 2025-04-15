import styled from "styled-components";
import { getContrastColor } from "../../../utilities";

const Palette = ({ colors }: { colors: string[] }) => {
  return (
    <Wrapper>
      {colors.map((color) => (
        <Color key={color} $bgColor={color}>
          <Text $color={getContrastColor(color)}>{color}</Text>
        </Color>
      ))}
    </Wrapper>
  );
};

const Text = styled.p<{ $color: string }>`
  font-size: 50px;
  color: ${(props) => props.$color};
  text-transform: uppercase;
  padding: 0;
  margin: 0;
`;

const Color = styled.div<{ $bgColor: string }>`
  width: calc(100% / 6);
  aspect-ratio: 2/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bgColor};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export default Palette;

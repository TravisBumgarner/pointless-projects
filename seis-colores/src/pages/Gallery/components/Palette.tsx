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
  font-size: calc(var(--swatch-size) * 0.25);
  color: ${(props) => props.$color};
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: calc(var(--swatch-size) * 0.4);
  }
`;

const Color = styled.div<{ $bgColor: string }>`
  width: calc(var(--swatch-size));
  height: calc(var(--swatch-size));
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bgColor};

  @media (max-width: 768px) {
    width: calc(var(--swatch-size) * 1.5);
    height: calc(var(--swatch-size) * 1.5);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(var(--swatch-size) * 2);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default Palette;

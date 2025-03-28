import styled from "styled-components";
import { getContrastColor } from "../../../utilities";

const Container = styled.div`
  display: flex;
`;

const ColorButton = styled.button<{ $color: string }>`
  width: calc(var(--swatch-size) / 2);
  height: calc(var(--swatch-size) / 2);
  background: ${(props) => props.$color};
  cursor: pointer;
  border: 0;

  &:hover {
    background-color: ${(props) =>
      `color-mix(in srgb, ${props.$color} 50%, ${getContrastColor(
        props.$color
      )})`};
  }
`;

const Background = () => {
  const colors = ["#F5F5F5", "#E0E0E0", "#ababab", "#131313"];

  const setBackground = (color: string) => {
    document.body.style.background = color;
  };

  return (
    <Container>
      {colors.map((color) => (
        <ColorButton
          key={color}
          $color={color}
          onClick={() => setBackground(color)}
        />
      ))}
    </Container>
  );
};

export default Background;

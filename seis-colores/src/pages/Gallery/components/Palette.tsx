import styled from "styled-components";
import { getContrastColor } from "../../../utilities";

const Palette = ({ colors }: { colors: string[] }) => {
  return (
    <Wrapper>
      {colors.map((color) => (
        <Color key={color} $bgColor={color}>
          <p
            style={{
              color: getContrastColor(color),
              fontSize: `calc(var(--swatch-size) * 0.25)`,
            }}
          >
            {color}
          </p>
        </Color>
      ))}
    </Wrapper>
  );
};

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

import styled from "styled-components";
import { getContrastColor } from "../../../utilities";

const Palette = ({ colors }: { colors: string[] }) => {
  return (
    <Wrapper>
      {colors.map((color) => (
        <div
          key={color}
          style={{
            backgroundColor: color,
            width: `calc(var(--swatch-size))`,
            height: `calc(var(--swatch-size)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              color: getContrastColor(color),
              fontSize: `calc(var(--swatch-size) * 0.25)`,
            }}
          >
            {color}
          </p>
        </div>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(var(--swatch-size) * 2);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: calc(var(--swatch-size) * 6);
  }
`;

export default Palette;

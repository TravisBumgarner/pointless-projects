import styled from "styled-components";
import { getContrastColor } from "../../../utilities";

const Counter = ({
  current,
  total,
  backgroundColor,
}: {
  current: number;
  total: number;
  backgroundColor: string;
}) => {
  return (
    <Wrapper $backgroundColor={backgroundColor}>
      <p style={{ color: getContrastColor(backgroundColor) }}>
        <span style={{ fontSize: `calc(var(--swatch-size) * 0.45)` }}>
          {current}
        </span>{" "}
        <span style={{ fontSize: `calc(var(--swatch-size) * 0.25)` }}>/</span>
        <span style={{ fontSize: `calc(var(--swatch-size) * 0.4)` }}>
          {total}
        </span>
      </p>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $backgroundColor: string }>`
  width: calc(var(--swatch-size) * 2);
  height: calc(var(--swatch-size) * 0.5);
  background-color: ${(props) => props.$backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: calc(var(--swatch-size) * 3);
    height: calc(var(--swatch-size) * 0.75);
  }
`;

export default Counter;

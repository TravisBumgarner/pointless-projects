import { Link } from "react-router-dom";
import styled from "styled-components";
import { getContrastColor } from "../../../utilities";

const Navigation = ({ colors }: { colors: string[] }) => {
  return (
    <>
      <Button $bgColor={colors[4]} to="/about">
        Sobre / About
      </Button>
      <Button
        target="_blank"
        $bgColor={colors[1]}
        to="https://photopalettes.com/"
      >
        Más / More
      </Button>
    </>
  );
};

const Button = styled(Link)<{ $bgColor: string }>`
  display: block;
  text-decoration: none;
  color: ${(props) => getContrastColor(props.$bgColor)};
  font-size: calc(var(--swatch-size) * 0.3);
  width: calc(var(--swatch-size) * 2);
  height: calc(var(--swatch-size) * 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bgColor};

  &:hover {
    background-color: ${(props) =>
      `color-mix(in srgb, ${props.$bgColor} 50%, ${getContrastColor(
        props.$bgColor,
        true
      )})`};
  }

  @media (max-width: 768px) {
    width: calc(var(--swatch-size) * 3);
    height: calc(var(--swatch-size) * 0.75);
  }
`;

export default Navigation;

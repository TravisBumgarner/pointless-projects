import { Link } from "react-router-dom";
import styled from "styled-components";
import { getContrastColor } from "../../../utilities";

const Navigation = ({ bgColor }: { bgColor: string }) => {
  return (
    <Button $bgColor={bgColor} to="/about">
      Sobre / About
    </Button>
  );
};

const Button = styled(Link)<{ $bgColor: string }>`
  display: block;
  text-decoration: none;
  color: ${(props) => getContrastColor(props.$bgColor)};
  font-size: calc(var(--swatch-size) * 0.2);
  width: calc(var(--swatch-size) * 2);
  height: calc(var(--swatch-size) * 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bgColor};
`;

export default Navigation;

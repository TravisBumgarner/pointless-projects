import { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import styled from "styled-components";
import { getContrastColor } from "../../../utilities";

const colorToIcon = (color: string) => {
  if (color === "#F5F5F5")
    return (
      <MdKeyboardDoubleArrowUp
        color={getContrastColor(color)}
        style={{ fontSize: "calc(var(--swatch-size) * 0.5)" }}
      />
    );
  if (color === "#E0E0E0")
    return (
      <MdKeyboardArrowUp
        color={getContrastColor(color)}
        style={{ fontSize: "calc(var(--swatch-size) * 0.5)" }}
      />
    );
  if (color === "#ababab")
    return (
      <MdKeyboardArrowDown
        color={getContrastColor(color)}
        style={{ fontSize: "calc(var(--swatch-size) * 0.5)" }}
      />
    );
  if (color === "#131313")
    return (
      <MdKeyboardDoubleArrowDown
        color={getContrastColor(color)}
        style={{ fontSize: "calc(var(--swatch-size) * 0.5)" }}
      />
    );
};

const Background = () => {
  const colors = ["#F5F5F5", "#E0E0E0", "#ababab", "#131313"];
  const [currentColor, setCurrentColor] = useState<string | null>(null);

  const setBackground = (color: string) => {
    document.body.style.background = color;
    document.documentElement.style.setProperty("--background-color", color);
    setCurrentColor(null);
  };

  const setTempBackground = (color: string) => {
    setCurrentColor(
      document.documentElement.style.getPropertyValue("--background-color")
    );
    document.body.style.background = color;
    document.documentElement.style.setProperty("--background-color", color);
  };

  const clearTempBackground = () => {
    if (currentColor) {
      setBackground(currentColor);
    }
  };

  return (
    <Container>
      {colors.map((color) => (
        <ColorButton
          key={color}
          $bgColor={color}
          title={`Cambiar fondo / Change background`}
          onMouseEnter={() => setTempBackground(color)}
          onMouseLeave={() => clearTempBackground()}
          onClick={() => {
            setBackground(color);
          }}
        >
          {colorToIcon(color)}
        </ColorButton>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const ColorButton = styled.button<{ $bgColor: string }>`
  flex-shrink: 0;
  width: calc(var(--swatch-size) / 2);
  height: calc(var(--swatch-size) / 2);
  border: none;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  background-color: ${(props) => props.$bgColor};

  &:hover {
    background-color: ${(props) =>
      `color-mix(in srgb, ${props.$bgColor} 50%, ${getContrastColor(
        props.$bgColor,
        false
      )})`};
  }

  @media (max-width: 768px) {
    width: calc(var(--swatch-size) * 1);
    height: calc(var(--swatch-size) * 1);
  }
`;

export default Background;

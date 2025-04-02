import { useEffect } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { IoMdShuffle } from "react-icons/io";
import { LiaCopy } from "react-icons/lia";
import styled from "styled-components";
import { getContrastColor } from "../../../utilities";
import Background from "./Background";

const Controls = ({
  handlePreviousPalette,
  handleNextPalette,
  handleRandomPalette,
  previousBackgroundColor,
  nextBackgroundColor,
  randomBackgroundColor,
  copyBackgroundColor,
  colors,
}: {
  handlePreviousPalette: () => void;
  handleNextPalette: () => void;
  handleRandomPalette: () => void;
  previousBackgroundColor: string;
  nextBackgroundColor: string;
  randomBackgroundColor: string;
  copyBackgroundColor: string;
  colors: string[];
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePreviousPalette();
      if (e.key === "ArrowRight") handleNextPalette();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlePreviousPalette, handleNextPalette]);

  const copyColors = () => {
    navigator.clipboard.writeText(colors.join(", "));
  };

  return (
    <Wrapper>
      <div style={{ display: "flex" }}>
        <Button
          $bgColor={previousBackgroundColor}
          title="Anterior / Previous"
          onClick={handlePreviousPalette}
        >
          <GrFormPrevious
            color={getContrastColor(previousBackgroundColor)}
            style={{ fontSize: `calc(var(--swatch-size) * 0.8)` }}
          />
        </Button>
        <Button
          $bgColor={nextBackgroundColor}
          title="Próximo / Next"
          onClick={handleNextPalette}
        >
          <GrFormNext
            color={getContrastColor(nextBackgroundColor)}
            style={{ fontSize: `calc(var(--swatch-size) * 0.8)` }}
          />
        </Button>
        <Button
          $bgColor={randomBackgroundColor}
          title="Al azar / Random"
          onClick={handleRandomPalette}
        >
          <IoMdShuffle
            color={getContrastColor(randomBackgroundColor)}
            style={{ fontSize: `calc(var(--swatch-size) * 0.65)` }}
          />
        </Button>
        <Button
          $bgColor={copyBackgroundColor}
          onClick={copyColors}
          title="Copiar / Copy"
        >
          <LiaCopy
            color={getContrastColor(copyBackgroundColor)}
            style={{ fontSize: `calc(var(--swatch-size) * 0.6)` }}
          />
        </Button>
      </div>
      <Background />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (max-width: 768px) {
    border: var(--background-color) solid;
    border-bottom-width: calc(var(--gutter-spacing) * 2);
    border-left-width: calc(var(--gutter-spacing) * 2);
    border-top-width: calc(var(--gutter-spacing));
    border-right-width: calc(var(--gutter-spacing));
    position: fixed;
    flex-direction: row-reverse;
    left: 0;
    bottom: 0;
  }
`;

const Button = styled.button<{ $bgColor: string }>`
  flex-shrink: 0;
  width: calc(var(--swatch-size) * 0.5);
  height: calc(var(--swatch-size) * 0.5);
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
        true
      )})`};
  }

  @media (max-width: 768px) {
    width: calc(var(--swatch-size) * 1);
    height: calc(var(--swatch-size) * 1);
  }
`;
export default Controls;

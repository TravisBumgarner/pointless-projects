import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { IoMdShuffle } from "react-icons/io";
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
  const copyColors = () => {
    navigator.clipboard.writeText(colors.join(", "));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex" }}>
        <Button
          $bgColor={previousBackgroundColor}
          title="Anterior / Previous"
          onClick={handlePreviousPalette}
        >
          <GrFormPrevious
            color={getContrastColor(previousBackgroundColor)}
            style={{ fontSize: `calc(var(--swatch-size) * 0.5)` }}
          />
        </Button>
        <Button
          $bgColor={nextBackgroundColor}
          title="Próximo / Next"
          onClick={handleNextPalette}
        >
          <GrFormNext
            color={getContrastColor(nextBackgroundColor)}
            style={{ fontSize: `calc(var(--swatch-size) * 0.5)` }}
          />
        </Button>
        <Button
          $bgColor={randomBackgroundColor}
          title="Al azar / Random"
          onClick={handleRandomPalette}
        >
          <IoMdShuffle
            color={getContrastColor(randomBackgroundColor)}
            style={{ fontSize: `calc(var(--swatch-size) * 0.3)` }}
          />
        </Button>
      </div>
      <Background />
      <Button
        style={{ width: "100%", fontSize: `calc(var(--swatch-size) * 0.3)` }}
        $bgColor={copyBackgroundColor}
        onClick={copyColors}
      >
        Copiar / Copy
      </Button>
    </div>
  );
};

const Button = styled.button<{ $bgColor: string }>`
  width: calc(var(--swatch-size) * 2 / 3);
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
        true
      )})`};
  }
`;
export default Controls;

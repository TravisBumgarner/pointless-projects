import { useCallback, useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { IoMdShuffle } from "react-icons/io";
import { LiaCopy } from "react-icons/lia";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import styled from "styled-components";
import { getContrastColor } from "../../../utilities";
import Counter from "./Counter";
import Navigation from "./Navigation";

const COLORS = ["#F5F5F5", "#E0E0E0", "#ababab", "#131313"];

const Controls = ({
  handlePreviousPalette,
  handleNextPalette,
  handleRandomPalette,
  colors,
  photoIndex,
  totalPhotos,
}: {
  handlePreviousPalette: () => void;
  handleNextPalette: () => void;
  handleRandomPalette: () => void;
  colors: string[];
  photoIndex: number;
  totalPhotos: number;
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const cycleUp = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + COLORS.length) % COLORS.length);
    document.documentElement.style.setProperty(
      "--background-color",
      COLORS[currentIndex]
    );
  }, [currentIndex]);

  const cycleDown = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % COLORS.length);
    document.documentElement.style.setProperty(
      "--background-color",
      COLORS[currentIndex]
    );
  }, [currentIndex]);

  return (
    <Wrapper>
      <Counter
        backgroundColor={colors[5]}
        current={photoIndex + 1}
        total={totalPhotos}
      />
      <ButtonsWrapper>
        <div style={{ display: "flex" }}>
          <Button
            $size="large"
            $bgColor={colors[0]}
            title="Anterior / Previous"
            onClick={handlePreviousPalette}
          >
            <GrFormPrevious color={getContrastColor(colors[0])} />
          </Button>
          <Button
            $size="large"
            $bgColor={colors[1]}
            title="Próximo / Next"
            onClick={handleNextPalette}
          >
            <GrFormNext color={getContrastColor(colors[1])} />
          </Button>
        </div>
        <div style={{ display: "flex" }}>
          <Button
            $size="small"
            $bgColor={colors[2]}
            title="Al azar / Random"
            onClick={handleRandomPalette}
          >
            <IoMdShuffle color={getContrastColor(colors[2])} />
          </Button>
          <Button
            $size="small"
            $bgColor={colors[3]}
            onClick={copyColors}
            title="Copiar / Copy"
          >
            <LiaCopy color={getContrastColor(colors[3])} />
          </Button>
          <Button
            $size="small"
            $bgColor="#F5F5F5"
            title="Lighter background"
            onClick={cycleUp}
          >
            <MdKeyboardDoubleArrowDown color="#131313" />
          </Button>
          <Button
            $size="small"
            $bgColor="#131313"
            title="Darker background"
            onClick={cycleDown}
          >
            <MdKeyboardDoubleArrowUp color="#F5F5F5" />
          </Button>
        </div>
      </ButtonsWrapper>
      <Navigation bgColor={colors[4]} />
    </Wrapper>
  );
};

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (max-width: 768px) {
    position: fixed;
    border: calc(var(--gutter-spacing) * 1) solid var(--background-color);
    right: var(--gutter-spacing);
    bottom: var(--gutter-spacing);
  }
`;

const Button = styled.button<{ $bgColor: string; $size: "small" | "large" }>`
  flex-shrink: 0;
  width: ${(props) =>
    props.$size === "small"
      ? "calc(var(--swatch-size) * 0.5)"
      : "calc(var(--swatch-size) * 1)"};
  height: ${(props) =>
    props.$size === "small"
      ? "calc(var(--swatch-size) * 0.5)"
      : "calc(var(--swatch-size) * 1)"};

  > * {
    font-size: ${(props) =>
      props.$size === "small"
        ? "calc(var(--swatch-size) * 0.4)"
        : "calc(var(--swatch-size) * 1)"};
  }
  padding: 0;
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
    width: ${(props) =>
      props.$size === "small"
        ? "calc(var(--swatch-size) * 0.75)"
        : "calc(var(--swatch-size) * 1.5)"};
    height: ${(props) =>
      props.$size === "small"
        ? "calc(var(--swatch-size) * 0.75)"
        : "calc(var(--swatch-size) * 1.5)"};

    > * {
      font-size: ${(props) =>
        props.$size === "small"
          ? "calc(var(--swatch-size) * 0.75)"
          : "calc(var(--swatch-size) * 1.5)"};
    }
  }
`;
export default Controls;

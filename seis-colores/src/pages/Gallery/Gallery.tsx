import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { colorPalettes } from "../../data/palettes";
import Controls from "./components/Controls";
import Counter from "./components/Counter";
import Navigation from "./components/Navigation";
import Palette from "./components/Palette";
import Photo from "./components/Photo";

function Gallery() {
  const navigate = useNavigate();
  const { id } = useParams();

  const zeroIndexedId = Number.isNaN(Number(id)) ? 0 : Number(id) - 1;

  const handleNextPalette = () => {
    const nextId = (zeroIndexedId + 1) % colorPalettes.length;
    navigate(`/${nextId + 1}`);
  };

  const handlePreviousPalette = () => {
    const prevId =
      zeroIndexedId - 1 < 0 ? colorPalettes.length - 1 : zeroIndexedId - 1;
    navigate(`/${prevId + 1}`);
  };

  const handleRandomPalette = () => {
    navigate(`/${Math.floor(Math.random() * colorPalettes.length)}`);
  };

  React.useEffect(() => {
    // Preload the next and previous photos
    const nextId = (zeroIndexedId + 1) % colorPalettes.length;
    const prevId =
      zeroIndexedId - 1 < 0 ? colorPalettes.length - 1 : zeroIndexedId - 1;
    //   const imagePath = new URL(`../../../data/images/${src}`, import.meta.url).href;

    new Image().src = new URL(
      `../../data/images/${colorPalettes[nextId].src}`,
      import.meta.url
    ).href;
    new Image().src = new URL(
      `../../data/images/${colorPalettes[prevId].src}`,
      import.meta.url
    ).href;
  }, [zeroIndexedId]);

  return (
    <Wrapper>
      <LeftColumnWrapper>
        <Palette colors={colorPalettes[zeroIndexedId].colors} />
        <SubWrapper>
          <Counter
            backgroundColor={colorPalettes[zeroIndexedId].colors[0]}
            current={zeroIndexedId + 1}
            total={colorPalettes.length}
          />
          <Controls
            handlePreviousPalette={handlePreviousPalette}
            handleNextPalette={handleNextPalette}
            handleRandomPalette={handleRandomPalette}
            previousBackgroundColor={colorPalettes[zeroIndexedId].colors[1]}
            nextBackgroundColor={colorPalettes[zeroIndexedId].colors[2]}
            randomBackgroundColor={colorPalettes[zeroIndexedId].colors[3]}
            copyBackgroundColor={colorPalettes[zeroIndexedId].colors[4]}
            colors={colorPalettes[zeroIndexedId].colors}
          />
          <Navigation bgColor={colorPalettes[zeroIndexedId].colors[5]} />
        </SubWrapper>
      </LeftColumnWrapper>
      <Photo src={colorPalettes[zeroIndexedId].src} />
    </Wrapper>
  );
}

const SubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gutter-spacing);
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const LeftColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--gutter-spacing);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--gutter-spacing);
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export default Gallery;

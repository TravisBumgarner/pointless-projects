import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { colorPalettes } from "../../data/palettes";
import Palette from "./components/Palette";

function Gallery() {
  const navigate = useNavigate();
  const { id } = useParams();
  const zeroIndexedId = Number.isNaN(Number(id)) ? 0 : Number(id) - 1;

  const handleNextPalette = useCallback(() => {
    const nextId = (zeroIndexedId + 1) % colorPalettes.length;
    navigate(`/${nextId + 1}`);
  }, [zeroIndexedId, navigate]);

  const handlePreviousPalette = useCallback(() => {
    const prevId =
      zeroIndexedId - 1 < 0 ? colorPalettes.length - 1 : zeroIndexedId - 1;
    navigate(`/${prevId + 1}`);
  }, [zeroIndexedId, navigate]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "ArrowLeft") handlePreviousPalette();
      if (e.key === "ArrowRight") handleNextPalette();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlePreviousPalette, handleNextPalette]);

  const imagePath = new URL(
    `../../data/images/${colorPalettes[zeroIndexedId].src}`,
    import.meta.url
  ).href;
  return (
    <div style={{ maxWidth: "1200px", height: "100%", margin: "0 auto" }}>
      <Palette colors={colorPalettes[zeroIndexedId].colors} />
      <StyledPhoto src={imagePath} />
    </div>
  );
}

const StyledPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: bottom right;
  box-sizing: border-box;
  flex-grow: 1;
  min-width: 0;
  min-height: 0;
`;

export default Gallery;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { colorPalettes } from "../../data/palettes";
import Controls from "./components/Controls";
import Counter from "./components/Counter";
import Palette from "./components/Palette";
import Photo from "./components/Photo";

const GUTTER_SPACING = "30px";

function App() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [paletteIndex, setPaletteIndex] = useState(Number(id) - 1 || 0);

  useEffect(() => {
    navigate(`/photo/${paletteIndex + 1}`);
  }, [paletteIndex, navigate]);

  const handleNextPalette = () => {
    setPaletteIndex((prevIndex) => (prevIndex + 1) % colorPalettes.length);
  };

  const handlePreviousPalette = () => {
    setPaletteIndex(
      (prevIndex) =>
        (prevIndex - 1 + colorPalettes.length) % colorPalettes.length
    );
  };

  const handleRandomPalette = () => {
    setPaletteIndex(Math.floor(Math.random() * colorPalettes.length));
  };

  return (
    <div>
      <div
        style={{ display: "flex", flexDirection: "row", gap: GUTTER_SPACING }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: GUTTER_SPACING,
          }}
        >
          <Counter
            backgroundColor={colorPalettes[paletteIndex].colors[0]}
            current={paletteIndex + 1}
            total={colorPalettes.length}
          />
          <Palette colors={colorPalettes[paletteIndex].colors} />

          <Controls
            handlePreviousPalette={handlePreviousPalette}
            handleNextPalette={handleNextPalette}
            handleRandomPalette={handleRandomPalette}
            previousBackgroundColor={colorPalettes[paletteIndex].colors[1]}
            nextBackgroundColor={colorPalettes[paletteIndex].colors[2]}
            randomBackgroundColor={colorPalettes[paletteIndex].colors[3]}
          />
        </div>
        <Photo src={colorPalettes[paletteIndex].src} />
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Counter from "./Counter";
import Palette from "./Palette";
import { colorPalettes } from "./palettes";

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
      <Palette
        colors={colorPalettes[paletteIndex].colors}
        photo={colorPalettes[paletteIndex].image}
      />
      <button onClick={handlePreviousPalette}>Previous</button>
      <button onClick={handleNextPalette}>Next</button>
      <button onClick={handleRandomPalette}>Random</button>
      <Counter current={paletteIndex + 1} total={colorPalettes.length} />
    </div>
  );
}

export default App;

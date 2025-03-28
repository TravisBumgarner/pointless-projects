import { useNavigate, useParams } from "react-router-dom";
import { colorPalettes } from "../../data/palettes";
import Controls from "./components/Controls";
import Counter from "./components/Counter";
import Navigation from "./components/Navigation";
import Palette from "./components/Palette";
import Photo from "./components/Photo";

function App() {
  const navigate = useNavigate();
  const { id } = useParams();

  const zeroIndexedId = Number.isNaN(Number(id)) ? 0 : Number(id) - 1;

  const handleNextPalette = () => {
    const nextId = (zeroIndexedId + 1) % colorPalettes.length;
    navigate(`/${nextId + 1}`);
  };

  const handlePreviousPalette = () => {
    const prevId =
      (zeroIndexedId - 1 + colorPalettes.length) % colorPalettes.length;
    navigate(`/${prevId + 1}`);
  };

  const handleRandomPalette = () => {
    navigate(`/${Math.floor(Math.random() * colorPalettes.length)}`);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "var(--gutter-spacing)",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--gutter-spacing)",
          }}
        >
          <Counter
            backgroundColor={colorPalettes[zeroIndexedId].colors[0]}
            current={zeroIndexedId + 1}
            total={colorPalettes.length}
          />
          <Palette colors={colorPalettes[zeroIndexedId].colors} />

          <Controls
            handlePreviousPalette={handlePreviousPalette}
            handleNextPalette={handleNextPalette}
            handleRandomPalette={handleRandomPalette}
            previousBackgroundColor={colorPalettes[zeroIndexedId].colors[1]}
            nextBackgroundColor={colorPalettes[zeroIndexedId].colors[2]}
            randomBackgroundColor={colorPalettes[zeroIndexedId].colors[3]}
          />

          <Navigation bgColor={colorPalettes[zeroIndexedId].colors[4]} />
        </div>
        <Photo src={colorPalettes[zeroIndexedId].src} />
      </div>
    </>
  );
}

export default App;

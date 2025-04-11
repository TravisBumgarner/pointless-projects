import { useMemo, useState } from "react";
import data, { Algorithm } from "./data/palettes";
import { sortByHue, sortByLightness, sortBySaturation } from "./utils";

const Image = ({ src }: { src: string }) => {
  const imagePath = new URL(`./data/images/${src}`, import.meta.url).href;

  return (
    <img
      src={imagePath}
      style={{ maxWidth: "500px", maxHeight: "500px" }}
    ></img>
  );
};

const Palette = ({
  colors,
  algorithm,
  sortingFunc,
}: {
  algorithm: string;
  colors: string[];
  sortingFunc: (colors: string[]) => string[];
}) => {
  const sortedColors = useMemo(() => {
    return sortingFunc(colors);
  }, [sortingFunc, colors]);

  return (
    <div>
      <p style={{ width: "200px", margin: 0 }}>{algorithm}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        {sortedColors.map((color) => (
          <div
            key={color}
            style={{
              backgroundColor: color,
              width: "75px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <p style={{ margin: 0, backgroundColor: "white", width: "100%" }}>
              {color}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Sort = ({
  sortMethod,
  setSortMethod,
}: {
  sortMethod: string;
  setSortMethod: React.Dispatch<
    React.SetStateAction<"hue" | "saturation" | "lightness">
  >;
}) => {
  return (
    <div style={{ right: 16, bottom: 16, position: "fixed" }}>
      <p>Sort By:</p>
      <div>
        <button
          style={{ backgroundColor: sortMethod === "hue" ? "red" : "silver" }}
          onClick={() => setSortMethod("hue")}
        >
          Hue
        </button>
        <button
          style={{
            backgroundColor: sortMethod === "saturation" ? "red" : "silver",
          }}
          onClick={() => setSortMethod("saturation")}
        >
          Saturation
        </button>
        <button
          style={{
            backgroundColor: sortMethod === "lightness" ? "red" : "silver",
          }}
          onClick={() => setSortMethod("lightness")}
        >
          Lightness
        </button>
      </div>
    </div>
  );
};

function App() {
  const [sortMethod, setSortMethod] = useState<
    "hue" | "saturation" | "lightness"
  >("hue");

  const sortingFunc = useMemo(() => {
    switch (sortMethod) {
      case "hue":
        return sortByHue;
      case "saturation":
        return sortByLightness;
      case "lightness":
        return sortBySaturation;
    }
  }, [sortMethod]);

  return (
    <>
      <div>
        {data.images.map((image) => (
          <div
            key={image}
            style={{
              height: "100vh",
              flexDirection: "row",
              display: "flex",
              gap: "20px",
            }}
          >
            <Image src={image} />
            <div>
              {Object.values(Algorithm).map((algorithm) => (
                <Palette
                  key={algorithm}
                  sortingFunc={sortingFunc}
                  algorithm={algorithm}
                  colors={data.palettes[algorithm][image]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Sort sortMethod={sortMethod} setSortMethod={setSortMethod} />
    </>
  );
}

export default App;

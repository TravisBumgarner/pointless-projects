import { useMemo, useState } from "react";
import { AlgorithmInfo } from "./AlgorithmInfo";
import data, { Algorithm } from "./data/palettes";
import Sort from "./Sort";
import {
  getContrastColor,
  hexToHslDisplay,
  hexToRgbDisplay,
  sortByHue,
  sortByLightness,
  sortBySaturation,
} from "./utils";

const Image = ({ src }: { src: string }) => {
  const imagePath = new URL(`./data/images/${src}`, import.meta.url).href;

  return (
    <div
      style={{
        width: "400px",
        height: "400px",
        position: "sticky",
        top: "30px",
        marginBottom: "30px",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <img
        src={imagePath}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          borderRadius: "4px",
        }}
      />
    </div>
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
      <p style={{ margin: 0 }}>{algorithm}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "10px 0",
          gap: "4px ",
        }}
      >
        {sortedColors.map((color) => (
          <div
            key={color}
            style={{
              backgroundColor: color,
              borderRadius: "4px",
              width: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <ul
              style={{
                margin: 0,
                width: "100%",
                textTransform: "uppercase",
                listStyleType: "none",
                padding: 5,
                fontSize: "12px",
                color: getContrastColor(color),
              }}
            >
              <li>{color}</li>
              <li>{hexToRgbDisplay(color)}</li>
              <li>{hexToHslDisplay(color)}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [sortMethod, setSortMethod] = useState<
    "hue" | "saturation" | "lightness"
  >("hue");
  const [sortAscending, setSortAscending] = useState(true);

  const sortingFunc = useMemo(() => {
    const baseSort = (() => {
      switch (sortMethod) {
        case "hue":
          return sortByHue;
        case "saturation":
          return sortByLightness;
        case "lightness":
          return sortBySaturation;
      }
    })();

    return (colors: string[]) => {
      const sorted = baseSort(colors);
      return sortAscending ? sorted : [...sorted].reverse();
    };
  }, [sortMethod, sortAscending]);

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
              gap: "10px",
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
      <Sort
        sortAscending={sortAscending}
        setSortAscending={setSortAscending}
        sortMethod={sortMethod}
        setSortMethod={setSortMethod}
      />
      <AlgorithmInfo />
    </>
  );
}

export default App;

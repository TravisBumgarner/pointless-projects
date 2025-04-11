import { useMemo, useState } from "react";
import data, { Algorithm } from "./data/palettes";
import {
  getContrastColor,
  sortByHue,
  sortByLightness,
  sortBySaturation,
} from "./utils";

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
};

const hexToHsl = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `hsl(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
};

const Image = ({ src }: { src: string }) => {
  const imagePath = new URL(`./data/images/${src}`, import.meta.url).href;

  return (
    <img
      src={imagePath}
      style={{
        maxWidth: "500px",
        maxHeight: "500px",
        position: "sticky",
        top: "30px",
        marginBottom: "30px",
      }}
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
      <p style={{ margin: 0 }}>{algorithm}</p>
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
              width: "110px",
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
              <li>{hexToRgb(color)}</li>
              <li>{hexToHsl(color)}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const Sort = ({
  sortAscending,
  setSortAscending,
  sortMethod,
  setSortMethod,
}: {
  sortAscending: boolean;
  sortMethod: string;
  setSortMethod: React.Dispatch<
    React.SetStateAction<"hue" | "saturation" | "lightness">
  >;
  setSortAscending: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div style={{ right: 16, bottom: 16, position: "fixed" }}>
      <p>Sort By:</p>
      <div>
        <button
          style={{ backgroundColor: sortMethod === "hue" ? "red" : "silver" }}
          onClick={() => {
            if (sortMethod === "hue") {
              setSortAscending(!sortAscending);
            } else {
              setSortMethod("hue");
            }
          }}
        >
          Hue {sortMethod === "hue" ? (sortAscending ? "(Desc)" : "(Asc)") : ""}
        </button>
        <button
          style={{
            backgroundColor: sortMethod === "saturation" ? "red" : "silver",
          }}
          onClick={() => {
            if (sortMethod === "saturation") {
              setSortAscending(!sortAscending);
            } else {
              setSortMethod("saturation");
            }
          }}
        >
          Saturation{" "}
          {sortMethod === "saturation"
            ? sortAscending
              ? "(Desc)"
              : "(Asc)"
            : ""}
        </button>
        <button
          style={{
            backgroundColor: sortMethod === "lightness" ? "red" : "silver",
          }}
          onClick={() => {
            if (sortMethod === "lightness") {
              setSortAscending(!sortAscending);
            } else {
              setSortMethod("lightness");
            }
          }}
        >
          Lightness{" "}
          {sortMethod === "lightness"
            ? sortAscending
              ? "(Desc)"
              : "(Asc)"
            : ""}
        </button>
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
      <Sort
        sortAscending={sortAscending}
        setSortAscending={setSortAscending}
        sortMethod={sortMethod}
        setSortMethod={setSortMethod}
      />
    </>
  );
}

export default App;

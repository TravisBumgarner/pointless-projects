import data, { Algorithm } from "./data/palettes";

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
}: {
  algorithm: string;
  colors: string[];
}) => {
  return (
    <div>
      <p style={{ width: "200px", margin: 0 }}>{algorithm}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        {colors.map((color) => (
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
            <p style={{ margin: 0 }}>{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
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
            <Palette
              algorithm={Algorithm.PythonKMeans}
              colors={data.palettes[Algorithm.PythonKMeans][image]}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;

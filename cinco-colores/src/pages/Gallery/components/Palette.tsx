import { getContrastColor } from "../../../utilities";

const Palette = ({ colors }: { colors: string[] }) => {
  return (
    <div style={{}}>
      <div
        style={{
          width: `calc(var(--swatch-size) * 2)`,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {colors.map((color) => (
          <div
            key={color}
            style={{
              backgroundColor: color,
              width: `calc(var(--swatch-size))`,
              height: `calc(var(--swatch-size)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                color: getContrastColor(color),
                fontSize: `calc(var(--swatch-size) * 0.25)`,
              }}
            >
              {color}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Palette;

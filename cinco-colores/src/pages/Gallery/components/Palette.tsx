import { SWATCH_SIZE } from "../../../consts";
import { getContrastColor } from "../../../utilities";

const Palette = ({ colors }: { colors: string[] }) => {
  return (
    <div style={{}}>
      <div
        style={{ width: SWATCH_SIZE * 2, display: "flex", flexWrap: "wrap" }}
      >
        {colors.map((color) => (
          <div
            key={color}
            style={{
              backgroundColor: color,
              width: SWATCH_SIZE,
              height: SWATCH_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ color: getContrastColor(color), fontSize: "50px" }}>
              {color}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Palette;

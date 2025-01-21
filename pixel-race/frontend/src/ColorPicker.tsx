import { CANVAS_WIDTH_PIXELS, PointColor } from "../../shared";
import { COLOR_MAP } from "./consts";
import useStore from "./store";


const ColorPicker = () => {
    const setSelectedColorKey = useStore((state) => state.setSelectedColorKey);
    const selectedColorKey = useStore((state) => state.selectedColorKey);

    const handleColorClick = (char: PointColor) => {
        setSelectedColorKey(char);
      };

    return (
        <div
        style={{
          width: CANVAS_WIDTH_PIXELS,
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
        }}
      >
        {Object.keys(COLOR_MAP)
          .sort()
          .map((char) => (
            <div
              key={char}
              onClick={() => handleColorClick(char as PointColor)}
              style={{
                border: selectedColorKey === char ? "2px solid black" : "2px solid transparent",
                borderRadius: "5px",
                width: "25px",
                height: "25px",
                backgroundColor: COLOR_MAP[char as PointColor],
                cursor: "pointer",
              }}
            ></div>
          ))}
      </div>
    )
}

export default ColorPicker;
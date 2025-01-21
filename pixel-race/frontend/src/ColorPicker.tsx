import { CANVAS_WIDTH_PIXELS, PointColor } from "../../shared";
import { COLOR_MAP } from "./consts";
import useStore from "./store";


const ColorPicker = () => {
    const setSelectedColorKey = useStore((state) => state.setSelectedColorKey);
    const selectedColorKey = useStore((state) => state.selectedColorKey);
  console.log(Object.keys(COLOR_MAP))
    const handleColorClick = (char: PointColor) => {
        setSelectedColorKey(char);
      };

    return (
        <div
        className="border"
        style={{
          width: CANVAS_WIDTH_PIXELS,
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
        }}
      >
        {Object.keys(COLOR_MAP)
          .sort((a,b) => parseInt(a) - parseInt(b))
          .map((char) => (
            <div
              key={char}
              onClick={() => handleColorClick(char as PointColor)}
              style={{
                border: selectedColorKey === char ? "5px solid var(--neutral-light-color)" : "5px solid transparent",
                borderRadius: "5px",
                width: "20px",
                height: "20px",
                backgroundColor: COLOR_MAP[char as PointColor],
                cursor: "pointer",
              }}
            ></div>
          ))}
      </div>
    )
}

export default ColorPicker;
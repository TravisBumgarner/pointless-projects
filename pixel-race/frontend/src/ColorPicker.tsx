import { PointColor } from "../../shared";
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: '0 auto'
      }}
      >
      <div
        style={{
          margin: "5px",
          flexShrink: 0,
          borderRadius: "5px",
          width: "100%",
          height: "50px",
          backgroundColor: COLOR_MAP[selectedColorKey],
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center', gap: '5px'}}>
        {Object.keys(COLOR_MAP)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((char) => (
            <div
              key={char}
              onClick={() => handleColorClick(char as PointColor)}
              style={{
                borderRadius: "5px",
                width: "31px",
                height: "31px",
                backgroundColor: COLOR_MAP[char as PointColor],
                cursor: "pointer",
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default ColorPicker;

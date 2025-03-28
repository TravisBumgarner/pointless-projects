import { SWATCH_SIZE } from "../../../consts";
import { getContrastColor } from "../../../utilities";

const Counter = ({
  current,
  total,
  backgroundColor,
}: {
  current: number;
  total: number;
  backgroundColor: string;
}) => {
  return (
    <div
      style={{
        width: SWATCH_SIZE * 2,
        height: SWATCH_SIZE,
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ color: getContrastColor(backgroundColor) }}>
        <span style={{ fontSize: "140px" }}>{current}</span>{" "}
        <span style={{ fontSize: "200px" }}>/</span>
        <span style={{ fontSize: "160px" }}>{total}</span>
      </p>
    </div>
  );
};

export default Counter;

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
        width: `calc(var(--swatch-size) * 2)`,
        height: `calc(var(--swatch-size))`,
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ color: getContrastColor(backgroundColor) }}>
        <span style={{ fontSize: `calc(var(--swatch-size) * 0.5)` }}>
          {current}
        </span>{" "}
        <span style={{ fontSize: `calc(var(--swatch-size) * 0.25)` }}>/</span>
        <span style={{ fontSize: `calc(var(--swatch-size) * 0.8)` }}>
          {total}
        </span>
      </p>
    </div>
  );
};

export default Counter;

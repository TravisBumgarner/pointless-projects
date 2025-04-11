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
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: sortMethod === "hue" ? "#333" : "white",
            color: sortMethod === "hue" ? "white" : "inherit",
            border: "1px solid #333",
            borderRadius: "4px",
            cursor: "pointer",
            flex: 1,
            minWidth: "150px",
          }}
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
            padding: "8px 16px",
            backgroundColor: sortMethod === "saturation" ? "#333" : "white",
            color: sortMethod === "saturation" ? "white" : "inherit",
            border: "1px solid #333",
            borderRadius: "4px",
            cursor: "pointer",
            flex: 1,
            minWidth: "150px",
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
            padding: "8px 16px",
            backgroundColor: sortMethod === "lightness" ? "#333" : "white",
            color: sortMethod === "lightness" ? "white" : "inherit",
            border: "1px solid #333",
            borderRadius: "4px",
            cursor: "pointer",
            flex: 1,
            minWidth: "150px",
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

export default Sort;

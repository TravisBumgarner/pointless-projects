const Palette = ({ colors, photo }: { colors: string[]; photo: string }) => {
  const imagePath = new URL(`../../../data/images/${photo}`, import.meta.url)
    .href;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "500px",
        height: "500px",
      }}
    >
      <img
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          borderRadius: "10px",
        }}
        src={imagePath}
        alt="Palette"
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {colors.map((color) => (
          <div
            key={color}
            style={{
              backgroundColor: color,
              width: "100px",
              height: "100px",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textShadow: "0 0 10px rgba(255,255,255,0.9)",
            }}
          >
            <p>{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Palette;

import { useRef, useState } from "react";

const CustomPalette = () => {
  const [image, setImage] = useState<string>("");
  const [colors, setColors] = useState<string[]>(Array(6).fill("#000000"));
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const copyColors = () => {
    navigator.clipboard.writeText(colors.join(", "));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <button onClick={() => fileRef.current?.click()}>Upload Image</button>

      {image && (
        <img src={image} alt="Upload Preview" style={{ maxWidth: "500px" }} />
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {colors.map((color, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(i, e.target.value)}
            />
            <span>{color}</span>
          </div>
        ))}
      </div>

      <button onClick={copyColors}>Copy Color Values</button>
    </div>
  );
};

export default CustomPalette;

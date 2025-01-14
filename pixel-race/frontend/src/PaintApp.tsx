import React, { useState } from "react";

const COLORS = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#00FFFF", "#FF00FF", "#FFA500", "#800080"
];

const PaintApp = () => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.fillStyle = selectedColor;
    context.fillRect(x, y, 5, 5);
  };

  return (
    <div>
      <canvas
        id="canvas"
        width="500"
        height="500"
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
      <div style={{ display: "flex", marginTop: "10px" }}>
        {COLORS.map((color) => (
          <div
            key={color}
            onClick={() => handleColorClick(color)}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: color,
              border: "1px solid black",
              cursor: "pointer"
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PaintApp; 
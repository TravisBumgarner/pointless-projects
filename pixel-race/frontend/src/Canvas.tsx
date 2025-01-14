import React, { useEffect, useRef, useState } from "react";
import { getPaint, postPaint } from "./api";
import { CANVAS_GRID_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from "./consts";
import { Point } from "./types";

const COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FFA500",
  "#800080",
];

const PaintApp = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const paintCanvas = (points: Point[]) => {
        console.log('painting', points);
        const canvas = canvasRef.current;
        const context = canvas!.getContext("2d")!;
        points.forEach((point) => {
            context.fillStyle = point.color;
            context.fillRect(point.x, point.y, CANVAS_GRID_SIZE, CANVAS_GRID_SIZE);
        });
    }

  useEffect(() => {
    getPaint().then(paintCanvas);
  }, []);

  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const rect = canvas?.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const snappedX = Math.floor(x / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE;
    const snappedY = Math.floor(y / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE;

    context!.fillStyle = selectedColor;
    context!.fillRect(snappedX, snappedY, CANVAS_GRID_SIZE, CANVAS_GRID_SIZE);

    postPaint([{ x: snappedX, y: snappedY, color: selectedColor }]);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
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
              cursor: "pointer",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PaintApp;

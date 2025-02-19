import React, { useEffect, useRef } from "react";
import {
  CANVAS_GRID_SIZE,
  CANVAS_HEIGHT_PIXELS,
  CANVAS_WIDTH_PIXELS,
  MAX_PAINT_POINTS,
  PointKey,
  PointMap,
} from "../../shared";
import { COLOR_MAP } from "./consts";
import useStore from "./store";

const PaintApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useStore((state) => state.points);
  const addAlert = useStore((state) => state.addAlert);
  const tempPoints = useStore((state) => state.tempPoints);
  const setTempPoints = useStore((state) => state.setTempPoints);
  const selectedColorKey = useStore((state) => state.selectedColorKey);
  const canPaint = useStore((state) => state.canPaint);

  const paintCanvas = (points: PointMap) => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d")!;
    Object.entries(points).forEach(([key, colorKey]) => {
      const [x, y] = key.split("_");
      context.fillStyle = COLOR_MAP[colorKey];
      context.fillRect(
        parseInt(x),
        parseInt(y),
        CANVAS_GRID_SIZE,
        CANVAS_GRID_SIZE
      );
    });
  };

  useEffect(() => {
    paintCanvas(points);
  }, [points]);

  useEffect(() => {
    if (Object.keys(tempPoints).length === 0) {
      canvasRef.current
        ?.getContext("2d")
        ?.clearRect(0, 0, CANVAS_WIDTH_PIXELS, CANVAS_HEIGHT_PIXELS);
      paintCanvas(points);
    }
  }, [tempPoints, points]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canPaint) return

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const rect = canvas?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const snappedX = Math.floor(x / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE;
    const snappedY = Math.floor(y / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE;
    const newPoint: PointKey  = `${snappedX}_${snappedY}`;

    if (Object.keys(tempPoints).length >= MAX_PAINT_POINTS && !tempPoints[newPoint]) {
      addAlert(`Only ${MAX_PAINT_POINTS} can be plotted.`);
      return;
    }


    context!.fillStyle = COLOR_MAP[selectedColorKey];
    context!.fillRect(snappedX, snappedY, CANVAS_GRID_SIZE, CANVAS_GRID_SIZE);

    setTempPoints({
      ...tempPoints,
      [newPoint]: selectedColorKey,
    });
  };

  return (
    <div className="border">
      <canvas
        style={{ width: '100%', aspectRatio: '1/1', cursor: canPaint ? "pointer" : "not-allowed", backgroundColor: "#FFFFFF", borderRadius: "5px", display: "block" }}
        ref={canvasRef}
        width={CANVAS_WIDTH_PIXELS}
        height={CANVAS_HEIGHT_PIXELS}
        onMouseDown={handleMouseDown}
      ></canvas>
    </div>
  );
};

export default PaintApp;

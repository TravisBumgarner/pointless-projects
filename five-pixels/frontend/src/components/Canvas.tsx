import React, { useEffect, useRef } from "react";
import {
  CANVAS_GRID_SIZE,
  CANVAS_HEIGHT_PIXELS,
  CANVAS_WIDTH_PIXELS,
  MAX_PAINT_POINTS,
  PointKey,
  PointMap,
} from "../../../shared";
import { COLOR_MAP } from "../consts";
import useStore from "../store";

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

  const handlePaint = (x: number, y: number) => {
    if (!canPaint) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const rect = canvas?.getBoundingClientRect();
    if (!rect) return;

    const scaleX = canvas!.width / rect.width;
    const scaleY = canvas!.height / rect.height;

    const snappedX =
      Math.floor(((x - rect.left) * scaleX) / CANVAS_GRID_SIZE) *
      CANVAS_GRID_SIZE;
    const snappedY =
      Math.floor(((y - rect.top) * scaleY) / CANVAS_GRID_SIZE) *
      CANVAS_GRID_SIZE;
    const newPoint: PointKey = `${snappedX}_${snappedY}`;

    if (tempPoints[newPoint]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [newPoint]: _, ...remainingPoints } = tempPoints;
      setTempPoints(remainingPoints);
      context!.clearRect(
        snappedX,
        snappedY,
        CANVAS_GRID_SIZE,
        CANVAS_GRID_SIZE
      );
      return;
    }

    if (
      Object.keys(tempPoints).length >= MAX_PAINT_POINTS &&
      !tempPoints[newPoint]
    ) {
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

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    handlePaint(event.clientX, event.clientY);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    handlePaint(touch.clientX, touch.clientY);
  };

  return (
    <div className="border">
      <canvas
        style={{
          width: "100%",
          aspectRatio: "1/1",
          cursor: canPaint ? "pointer" : "not-allowed",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          display: "block",
        }}
        ref={canvasRef}
        width={CANVAS_WIDTH_PIXELS}
        height={CANVAS_HEIGHT_PIXELS}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      ></canvas>
    </div>
  );
};

export default PaintApp;

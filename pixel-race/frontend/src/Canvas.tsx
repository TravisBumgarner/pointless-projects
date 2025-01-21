import React, { useEffect, useRef, useState } from "react";
import { CANVAS_GRID_SIZE, CANVAS_HEIGHT_PIXELS, CANVAS_WIDTH_PIXELS, MAX_PAINT_POINTS, PointColor, PointMap } from "../../shared";
import { postPaint } from "./api";
import useStore from "./store";
const COLOR_MAP: { [key: string]: string } = {
  a: "#f9ebea",
  b: "#f2d7d5",
  c: "#e6b0aa",
  d: "#d98880",
  e: "#cd6155",
  f: "#c0392b",
  g: "#a93226",
  h: "#922b21",
  i: "#7b241c",
  j: "#641e16",
  k: "#fdedec",
  l: "#fadbd8",
  m: "#f5b7b1",
  n: "#f1948a",
  o: "#ec7063",
  p: "#e74c3c",
  q: "#cb4335",
  r: "#b03a2e",
  s: "#943126",
  t: "#78281f",
  u: "#f5eef8",
  v: "#ebdef0",
  w: "#d7bde2",
  x: "#c39bd3",
  y: "#af7ac5",
  z: "#9b59b6",
  A: "#884ea0",
  B: "#76448a",
  C: "#633974",
  D: "#512e5f",
  E: "#f4ecf7",
  F: "#e8daef",
  G: "#d2b4de",
  H: "#bb8fce",
  I: "#a569bd",
  J: "#8e44ad",
  K: "#7d3c98",
  L: "#6c3483",
  M: "#5b2c6f",
  N: "#4a235a",
  O: "#eaf2f8",
  P: "#d4e6f1",
  Q: "#a9cce3",
  R: "#7fb3d5",
  S: "#5499c7",
  T: "#2980b9",
  U: "#2471a3",
  V: "#1f618d",
  W: "#1a5276",
  X: "#154360",
  Y: "#e8f8f5",
  Z: "#d1f2eb",
  "0": "#a3e4d7",
  "1": "#76d7c4",
  "2": "#48c9b0",
  "3": "#1abc9c",
  "4": "#17a589",
  "5": "#148f77",
  "6": "#117864",
  "7": "#0e6251",
  "8": "#fef9e7",
  "9": "#fcf3cf",
};

const PaintApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const points = useStore((state) => state.points);
  const [tempPoints, setTempPoints] = useState<PointMap>({});
  const clientId = useStore((state) => state.clientId);
  const addAlert = useStore((state) => state.addAlert);
  const placeInQueue = useStore((state) => state.placeInQueue);
  
  const canPaint = placeInQueue === 0;
  const hasPainted = Object.keys(tempPoints).length > 0;
  
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

  const pointsLeft = MAX_PAINT_POINTS - Object.keys(tempPoints).length;

  const handlePaint = async () => {
    if (!clientId) {
      addAlert("You are not logged in.");
      return;
    }

    const hasPainted = await postPaint(tempPoints, clientId);
    if (hasPainted) {
      setTempPoints({});
      setPlaceInQueue(null);
    } else {
      addAlert("You are not the current painter.");
    }
  };

  useEffect(() => {
    paintCanvas(points);
  }, [points]);

  const [selectedColorKey, setSelectedColorKey] = useState<PointColor>("A");

  const handleColorClick = (char: PointColor) => {
    setSelectedColorKey(char);
  };

  const clearTempPoints = () => {
    setTempPoints({});
    canvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, CANVAS_WIDTH_PIXELS, CANVAS_HEIGHT_PIXELS);
    paintCanvas(points);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (Object.keys(tempPoints).length >= MAX_PAINT_POINTS) {
      addAlert(`Only ${MAX_PAINT_POINTS} can be plotted.`);
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const rect = canvas?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const snappedX = Math.floor(x / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE;
    const snappedY = Math.floor(y / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE;

    context!.fillStyle = COLOR_MAP[selectedColorKey];
    context!.fillRect(snappedX, snappedY, CANVAS_GRID_SIZE, CANVAS_GRID_SIZE);

    setTempPoints({
      ...tempPoints,
      [`${snappedX}_${snappedY}`]: selectedColorKey,
    });
  };

  return (
    <div>
      <p>You can paint {pointsLeft} more points. (Press clear to reset)</p>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH_PIXELS}
        height={CANVAS_HEIGHT_PIXELS}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
      ></canvas>
      <button
        disabled={!canPaint || !hasPainted}
        onClick={handlePaint}
      >
        Paint
      </button>
      <button
        disabled={!hasPainted}
        onClick={clearTempPoints}
      >
        Clear
      </button>
      <div
        style={{
          width: CANVAS_WIDTH_PIXELS,
          display: "flex",
          marginTop: "10px",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(COLOR_MAP)
          .sort()
          .map((char) => (
            <div
              key={char}
              onClick={() => handleColorClick(char as PointColor)}
              style={{
                width: "25px",
                height: "25px",
                backgroundColor: COLOR_MAP[char],
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

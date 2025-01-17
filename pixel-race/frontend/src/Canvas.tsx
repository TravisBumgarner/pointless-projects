import React, { useEffect, useRef, useState } from "react";
import { ColorKey } from "../../shared";
import { postPaint } from "./api";
import { CANVAS_GRID_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from "./consts";
import useStore from "./store";
import { PointXY } from "./types";

const COLOR_MAP: { [key: string]: string } = {
  "a": "#f9ebea",
  "b": "#f2d7d5",
  "c": "#e6b0aa",
  "d": "#d98880",
  "e": "#cd6155",
  "f": "#c0392b",
  "g": "#a93226",
  "h": "#922b21",
  "i": "#7b241c",
  "j": "#641e16",
  "k": "#fdedec",
  "l": "#fadbd8",
  "m": "#f5b7b1",
  "n": "#f1948a",
  "o": "#ec7063",
  "p": "#e74c3c",
  "q": "#cb4335",
  "r": "#b03a2e",
  "s": "#943126",
  "t": "#78281f",
  "u": "#f5eef8",
  "v": "#ebdef0",
  "w": "#d7bde2",
  "x": "#c39bd3",
  "y": "#af7ac5",
  "z": "#9b59b6",
  "A": "#884ea0",
  "B": "#76448a",
  "C": "#633974",
  "D": "#512e5f",
  "E": "#f4ecf7",
  "F": "#e8daef",
  "G": "#d2b4de",
  "H": "#bb8fce",
  "I": "#a569bd",
  "J": "#8e44ad",
  "K": "#7d3c98",
  "L": "#6c3483",
  "M": "#5b2c6f",
  "N": "#4a235a",
  "O": "#eaf2f8",
  "P": "#d4e6f1",
  "Q": "#a9cce3",
  "R": "#7fb3d5",
  "S": "#5499c7",
  "T": "#2980b9",
  "U": "#2471a3",
  "V": "#1f618d",
  "W": "#1a5276",
  "X": "#154360",
  "Y": "#e8f8f5",
  "Z": "#d1f2eb",
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
  const points = useStore((state) => state.points);
  const [tempPoints, setTempPoints] = useState<PointXY[]>([]);
  const clientId = useStore((state) => state.clientId);
  
  const paintCanvas = (points: PointXY[]) => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d")!;
    points.forEach((point) => {
      context.fillStyle = COLOR_MAP[point.colorKey];
      context.fillRect(point.x, point.y, CANVAS_GRID_SIZE, CANVAS_GRID_SIZE);
    });
  };

  const handlePaint = async () => {
    if(!clientId) {
      alert("You are not logged in.");
      return
    };

    const hasPainted = await postPaint(tempPoints, clientId);
    if(hasPainted) {  
      setTempPoints([]);
    } else {
      alert("You are not the current painter.");
    }
  }

  useEffect(() => {
    paintCanvas(points);
  }, [points]);


  const [selectedColorKey, setSelectedColorKey] = useState<ColorKey>("A");

  const handleColorClick = (char: ColorKey) => {
    setSelectedColorKey(char);
  };

  const clearTempPoints = () => {
    setTempPoints([]);
    canvasRef.current?.getContext("2d")?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    paintCanvas(points);
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
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

    setTempPoints([...tempPoints, { x: snappedX, y: snappedY, colorKey: selectedColorKey }]);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
      ></canvas>
      <button disabled={tempPoints.length === 0} onClick={handlePaint}>Paint</button>
      <button onClick={clearTempPoints}>Clear</button>
      <div style={{ width: CANVAS_WIDTH, display: "flex", marginTop: "10px", flexWrap: "wrap" }}>
        {Object.keys(COLOR_MAP).sort().map((char) => (
          <div
            key={char}
            onClick={() => handleColorClick(char as ColorKey)}
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

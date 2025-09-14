import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DiceRollerProps } from "../types";

// Dynamic Plinko board config
const BOARD_HEIGHT = 320;
const BALL_SIZE = 24;

function shuffle<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPlinkoPath(sides: number, result: number) {
  // For large dice, group results into ranges
  const cols = sides;
  const steps = Math.max(5, Math.min(10, Math.floor(cols * 0.8)));
  let col = Math.floor(cols / 2);
  // Map result to slot
  const slotIdx = Math.floor(((result - 1) / sides) * cols);
  const path = [{ row: 0, col }];
  for (let r = 1; r < steps; r++) {
    // Random left/right, but bias toward final slot
    if (col < slotIdx) col++;
    else if (col > slotIdx) col--;
    else col += Math.random() < 0.5 ? -1 : 1;
    col = Math.max(0, Math.min(cols - 1, col));
    path.push({ row: r, col });
  }
  return { path, cols, slotIdx };
}

export const PlinkoDice: React.FC<DiceRollerProps> = ({ result, sides }) => {
  const [ballStep, setBallStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [path, setPath] = useState<{ row: number; col: number }[]>([]);
  const [cols, setCols] = useState(sides);
  const [showResult, setShowResult] = useState(false);
  const [slotIdx, setSlotIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (result) {
      const {
        path: newPath,
        cols: newCols,
        slotIdx: newSlotIdx,
      } = getPlinkoPath(sides, result);
      setPath(newPath);
      setCols(newCols);
      setSlotIdx(newSlotIdx);
      setBallStep(0);
      setAnimating(true);
      setShowResult(false);
      // Animate ball through pegs
      let step = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        step++;
        if (step < newPath.length) {
          setBallStep(step);
        } else {
          setAnimating(false);
          setShowResult(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 350);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setAnimating(false);
      setBallStep(0);
      setPath([]);
      setCols(sides);
      setSlotIdx(0);
      setShowResult(false);
    }
  }, [result, sides]);

  // Dynamic board width and slot size
  const boardWidth = sides <= 20 ? cols * 40 : cols * 10;
  const slotWidth = boardWidth / cols;
  const pegRows = Math.floor(cols * 0.8);

  // Ball position
  const ball = path[ballStep] ||
    path[path.length - 1] || { row: 0, col: Math.floor(cols / 2) };
  const ballLeft = ball.col * slotWidth + slotWidth / 2 - BALL_SIZE / 2;
  const ballTop = ball.row * (BOARD_HEIGHT / (pegRows + 1));

  const slotLabels = useMemo(() => {
    return shuffle(Array.from({ length: sides }, (_, i) => `${i + 1}`));
  }, [sides, result]); // eslint-disable-line 

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          width: boardWidth,
          height: BOARD_HEIGHT,
          border: "2px solid #333",
          background: "#f5f5f5",
        }}
      >
        {/* Pegs */}
        {Array.from({ length: pegRows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <div
              key={`peg-${r}-${c}`}
              style={{
                position: "absolute",
                top: r * (BOARD_HEIGHT / (pegRows + 1)) + 12,
                left: c * slotWidth + slotWidth / 2 - 6,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#888",
                boxShadow: "0 1px 4px #aaa",
              }}
            />
          ))
        )}
        {/* Ball */}
        <div
          style={{
            position: "absolute",
            top: ballTop,
            left: ballLeft,
            width: BALL_SIZE,
            height: BALL_SIZE,
            borderRadius: "50%",
            background: "red",
            boxShadow: "0 2px 8px #d32f2f",
            transition: animating ? "top 0.3s, left 0.3s" : "none",
            zIndex: 2,
          }}
        />
        {/* Slots */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          {slotLabels.map((label, i) => (
            <div
              key={i}
              style={{
                width: slotWidth,
                height: 40,
                border: "1px solid #333",
                borderRadius: "0 0 8px 8px",
                background: showResult && i === slotIdx ? "#ffd180" : "#fff",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                color: showResult && i === slotIdx ? "#d32f2f" : "#333",
                boxShadow:
                  showResult && i === slotIdx ? "0 2px 8px #aaa" : "none",
                lineHeight: "40px",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

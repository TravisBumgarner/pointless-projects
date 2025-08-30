import React, { useEffect, useRef, useState } from "react";
import type { DiceRollerProps } from "../types";

// Dynamic Plinko board config
const BOARD_HEIGHT = 320;
const BALL_SIZE = 24;
const MIN_COLS = 4;
const MAX_COLS = 16;
const MIN_WIDTH = 180;
const MAX_WIDTH = 480;

function getPlinkoPath(sides: number, result: number) {
  // For large dice, group results into ranges
  const cols = Math.max(MIN_COLS, Math.min(MAX_COLS, sides));
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

export const PlinkoDice: React.FC<DiceRollerProps> = ({
  rollResult,
  sides,
}) => {
  const [ballStep, setBallStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [path, setPath] = useState<{ row: number; col: number }[]>([]);
  const [cols, setCols] = useState(MIN_COLS);
  const [showResult, setShowResult] = useState(false);
  const [slotIdx, setSlotIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (rollResult) {
      const {
        path: newPath,
        cols: newCols,
        slotIdx: newSlotIdx,
      } = getPlinkoPath(sides, rollResult);
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
      setCols(Math.max(MIN_COLS, Math.min(MAX_COLS, sides)));
      setSlotIdx(0);
      setShowResult(false);
    }
  }, [rollResult, sides]);

  // Dynamic board width and slot size
  const boardWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, cols * 40));
  const slotWidth = boardWidth / cols;
  const pegRows = Math.max(5, Math.min(10, Math.floor(cols * 0.8)));

  // Ball position
  const ball = path[ballStep] ||
    path[path.length - 1] || { row: 0, col: Math.floor(cols / 2) };
  const ballLeft = ball.col * slotWidth + slotWidth / 2 - BALL_SIZE / 2;
  const ballTop = ball.row * (BOARD_HEIGHT / (pegRows + 1));

  // For large dice, group slot labels
  let slotLabels: string[] = [];
  if (sides <= cols) {
    slotLabels = Array.from({ length: sides }).map((_, i) => `${i + 1}`);
  } else {
    const perSlot = Math.floor(sides / cols);
    let remainder = sides % cols;
    let start = 1;
    for (let i = 0; i < cols; i++) {
      let end = start + perSlot - 1;
      if (remainder > 0) {
        end++;
        remainder--;
      }
      slotLabels.push(`${start}-${end}`);
      start = end + 1;
    }
  }

  return (
    <div style={{ textAlign: "center", margin: "2rem" }}>
      <div
        style={{
          position: "relative",
          width: boardWidth,
          height: BOARD_HEIGHT,
          border: "2px solid #333",
          margin: "0 auto",
          background: "#f5f5f5",
          borderRadius: 16,
          overflow: "hidden",
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
                width: 12,
                height: 12,
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
      <h3 style={{ marginTop: 16 }}>
        {showResult && rollResult ? `Result: ${rollResult}` : "Click Roll"}
      </h3>
    </div>
  );
};

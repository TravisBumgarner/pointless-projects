import React, { useCallback, useEffect, useRef, useState } from "react";
import type { DiceRollerProps } from "../types";
import { PALETTE, SPACING } from "../styles/styleConsts";

// Dynamic Plinko board config
const BOARD_HEIGHT = 320;
const BALL_SIZE = 24;
const ROWS = 10;

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
  let col = Math.floor(cols / 2);
  // Map result to slot
  const slotIdx = Math.floor(((result - 1) / sides) * cols);
  const path = [{ row: 0, col }];
  for (let r = 1; r < ROWS; r++) {
    // Random left/right, but bias toward final slot
    if (col < slotIdx) col++;
    else if (col > slotIdx) col--;
    else col += Math.random() < 0.5 ? -1 : 1;
    col = Math.max(0, Math.min(cols - 1, col));
    path.push({ row: r, col });
  }
  return { path };
}

export const PlinkoDice: React.FC<DiceRollerProps> = ({
  params: { sides },
}) => {
  const [ballStep, setBallStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [path, setPath] = useState<{ row: number; col: number }[]>([]);
  const timerRef = useRef<number | null>(null);
  const [slotLabels, setSlotLabels] = useState<string[]>([]);

  const sizing = sides > 20 ? "small" : "large";

  const createPath = useCallback(() => {
    const result = Math.floor(Math.random() * sides) + 1;
    const { path } = getPlinkoPath(sides, result);
    const slotLabels = shuffle(
      Array.from({ length: sides }, (_, i) => `${i + 1}`)
    );
    setPath(path);
    setBallStep(0);
    setSlotLabels(slotLabels);
  }, [sides]);

  useEffect(() => {
    createPath();
  }, [createPath]);

  const roll = useCallback(() => {
    createPath();
    setAnimating(true);
    // Animate ball through pegs
    let step = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      step++;
      if (step < path.length) {
        setBallStep(step);
      } else {
        setAnimating(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 350);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [path.length, createPath]);

  // Dynamic board width and slot size
  const boardWidth = sizing === "large" ? sides * 40 : sides * 15;
  const slotWidth = boardWidth / sides;

  // Ball position
  const ball = path[ballStep] ||
    path[path.length - 1] || { row: 0, col: Math.floor(sides / 2) };
  const ballLeft = ball.col * slotWidth + slotWidth / 2 - BALL_SIZE / 2;
  const ballTop = ball.row * (BOARD_HEIGHT / (ROWS + 1));

  return (
    <div style={{ textAlign: "center", justifyContent: "center" }}>
      <button onClick={roll}>Roll</button>
      <div
        style={{
          width: boardWidth + SPACING.SMALL.INT * 2,
          height: BOARD_HEIGHT + SPACING.SMALL.INT * 2,
          background: PALETTE.wow.blueLight,
          padding: SPACING.SMALL.PX,
        }}
      >
        <div
          style={{
            position: "relative",
            width: boardWidth,
            height: BOARD_HEIGHT,
            background: PALETTE.wow.blueLight,
          }}
        >
          {/* Pegs */}
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: sides }).map((_, c) => (
              <div
                key={`peg-${r}-${c}`}
                style={{
                  position: "absolute",
                  top: r * (BOARD_HEIGHT / (ROWS + 1)) + 12,
                  left: c * slotWidth + slotWidth / 2 - 3,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: PALETTE.wow.blueDark,
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
              background: PALETTE.wow.orangeLight,
              boxShadow: `0 2px 8px ${PALETTE.wow.orangeDark}`,
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
                  border: `1px solid ${PALETTE.grayscale[600]}`,
                  borderRadius: "0 0 8px 8px",
                  textAlign: "center",
                  fontSize: sizing === "large" ? 16 : 8,
                  fontWeight: "bold",
                  lineHeight: "40px",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

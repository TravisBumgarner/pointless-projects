import React, { useEffect, useState } from "react";
import type { DiceRollerProps } from "../types";

export const BalloonDice: React.FC<DiceRollerProps> = ({
  rollResult,
  sides,
}) => {
  const [popped, setPopped] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [pendingResult, setPendingResult] = useState<number | null>(null);

  useEffect(() => {
    if (rollResult) {
      setPendingResult(rollResult);
      setPopped(null);
      setAnimating(false);
      const timer = setTimeout(() => {
        setAnimating(true);
        setPopped(rollResult);
        // End animation after 0.5s
        setTimeout(() => {
          setAnimating(false);
        }, 500);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setPendingResult(null);
      setPopped(null);
      setAnimating(false);
    }
  }, [rollResult]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "1rem",
        margin: "2rem",
        position: "relative",
        minHeight: 120,
      }}
    >
      {Array.from({ length: sides }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 50,
            height: 70,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background:
              popped === i + 1
                ? "transparent"
                : ["#ff8a80", "#80d8ff", "#ffd180", "#ccff90"][i % 4],
            border: "2px solid #333",
            position: "relative",
            textAlign: "center",
            lineHeight: "70px",
            fontWeight: "bold",
            boxShadow: popped === i + 1 ? "none" : "0 4px 12px #aaa",
            transition: "all 0.3s",
            transform:
              animating && popped === i + 1
                ? "translateY(-30px) scale(1.1)"
                : popped === i + 1
                ? "scale(0.1)"
                : "none",
            opacity: popped === i + 1 ? 0 : 1,
          }}
        >
          {popped === i + 1 ? (
            <span
              style={{
                fontSize: 32,
                position: "absolute",
                left: 0,
                right: 0,
                top: 10,
              }}
            >
              💥
            </span>
          ) : (
            i + 1
          )}
          {/* Balloon string */}
          {popped !== i + 1 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: -18,
                width: 2,
                height: 18,
                background: "#333",
                transform: "translateX(-50%)",
                borderRadius: 2,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

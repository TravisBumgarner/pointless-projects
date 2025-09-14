import React, { useEffect, useState } from "react";
import type { DiceRollerProps } from "../types";

type BalloonProps = {
  number: number;
  isWinner: boolean;
  trigger: boolean;
};

const Balloon: React.FC<BalloonProps> = ({ number, isWinner, trigger }) => {
  const [inflating, setInflating] = useState(false);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setInflating(false);
      setPopped(false);
      return;
    }

    // Start inflating
    setInflating(true);

    // If not the winner, pop at a random delay
    if (!isWinner) {
      const delay = 500 + Math.random() * 3000; // 0.3–1.1s
      const timer = setTimeout(() => {
        setInflating(false);
        setPopped(true);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Winner just stops inflating after short time
      const timer = setTimeout(() => setInflating(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [trigger, isWinner]);

  return (
    <div
      style={{
        width: 50,
        height: 70,
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        background: popped
          ? "transparent"
          : ["#ff8a80", "#80d8ff", "#ffd180", "#ccff90"][number % 4],
        border: "2px solid #333",
        position: "relative",
        textAlign: "center",
        lineHeight: "70px",
        fontWeight: "bold",
        boxShadow: popped ? "none" : "0 4px 12px #aaa",
        transition: "all 0.4s ease",
        transform: inflating
          ? "scale(1.2)"
          : popped
          ? "scale(0.1)"
          : "scale(1)",
        opacity: popped ? 0 : 1,
      }}
    >
      {popped ? (
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
        number + 1
      )}
      {!popped && (
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
  );
};

export const BalloonDice: React.FC<DiceRollerProps> = ({ sides }) => {
  const [trigger, setTrigger] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    if (result) {
      setTrigger(false);
      const t = setTimeout(() => setTrigger(true), 200); // slight delay before starting
      return () => clearTimeout(t);
    } else {
      setTrigger(false);
    }
  }, [result]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "1rem",
        margin: "2rem",
        position: "relative",
        minHeight: 120,
      }}
    >
      <button onClick={() => setResult(Math.floor(Math.random() * sides) + 1)}>
        Roll
      </button>
      {Array.from({ length: sides }).map((_, i) => (
        <Balloon
          key={`${i}-${result}-${sides}`}
          number={i}
          isWinner={result === i + 1}
          trigger={trigger}
        />
      ))}
    </div>
  );
};

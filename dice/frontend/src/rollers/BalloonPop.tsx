import React, { useEffect, useState } from "react";
import type { DiceRollerProps } from "../types";

export const BalloonDice: React.FC<DiceRollerProps> = ({
  rollResult,
  sides,
}) => {
  const [popped, setPopped] = useState<number | null>(null);

  useEffect(() => {
    if (rollResult) {
      const timer = setTimeout(() => setPopped(rollResult), 1000);
      return () => clearTimeout(timer);
    }
  }, [rollResult]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        margin: "2rem",
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
          }}
        >
          {popped === i + 1 ? "💥" : i + 1}
        </div>
      ))}
      {rollResult && <h3 style={{ marginLeft: 20 }}>Result: {rollResult}</h3>}
    </div>
  );
};

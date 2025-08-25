import React, { useEffect, useState } from "react";
import type { DiceRollerProps } from "../types";

export const PlinkoDice: React.FC<DiceRollerProps> = ({
  rollResult,
  sides,
}) => {
  const [ballPos, setBallPos] = useState(0);
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    if (rollResult) {
      setFalling(true);
      // Animate ball toward slot
      const target = ((rollResult - 1) / (sides - 1)) * 90 - 45; // -45..45 deg
      setBallPos(target);
      const timer = setTimeout(() => setFalling(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [rollResult, sides]);

  return (
    <div style={{ textAlign: "center", margin: "2rem" }}>
      <div
        style={{
          position: "relative",
          width: 200,
          height: 200,
          border: "2px solid black",
          margin: "0 auto",
          overflow: "hidden",
          background: "#fafafa",
        }}
      >
        {/* Ball */}
        <div
          style={{
            position: "absolute",
            top: falling ? "160px" : "0px",
            left: "50%",
            transform: `translateX(${ballPos}px)`,
            transition: "all 2.5s cubic-bezier(.4,.2,.2,1)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "red",
          }}
        />
        {/* Slots */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {Array.from({ length: sides }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 40,
                border: "1px solid #333",
                textAlign: "center",
                fontSize: 12,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <h3>{rollResult ? `Result: ${rollResult}` : "Click Roll"}</h3>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import type { DiceRollerProps } from "../types";

export const JackInBoxDice: React.FC<DiceRollerProps> = ({ rollResult }) => {
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    if (rollResult) {
      setPopped(false);
      const timer = setTimeout(() => setPopped(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [rollResult]);

  return (
    <div style={{ textAlign: "center", margin: "2rem" }}>
      <div
        style={{
          width: 120,
          height: 120,
          border: "4px solid #333",
          margin: "0 auto",
          position: "relative",
          background: "#eee",
        }}
      >
        {popped && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              transition: "all .5s",
              fontSize: 40,
            }}
          >
            🎩 {rollResult}
          </div>
        )}
      </div>
      <p>{popped ? `Result: ${rollResult}` : "Crank… crank… crank…"}</p>
    </div>
  );
};

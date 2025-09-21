import React, { useState, useEffect } from "react";
import type { DiceRollerProps } from "../types";

const BOX_SIZE = 300;

export const JackInBoxDice: React.FC<DiceRollerProps> = ({
  params: { sides },
}) => {
  const [cranking, setCranking] = useState(false);
  const [popped, setPopped] = useState(false);
  const [crankAngle, setCrankAngle] = useState(0);
  const [result, setResult] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (result !== undefined) {
      setCranking(true);
      setPopped(false);
      let frame = 0;
      const crankFrames = 40;
      const crankInterval = setInterval(() => {
        frame++;
        setCrankAngle((prev) => prev + 36);
        if (frame >= crankFrames) {
          clearInterval(crankInterval);
          setCranking(false);
          setTimeout(() => setPopped(true), 400);
        }
      }, 40);
      return () => clearInterval(crankInterval);
    }
  }, [result]);

  return (
    <div
      style={{
        textAlign: "center",
        margin: "2rem",
        border: "2px solid #333",
        width: BOX_SIZE,
        aspectRatio: "1/1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        position: "relative",
      }}
    >
      <button onClick={() => setResult(Math.floor(Math.random() * sides) + 1)}>
        Roll
      </button>
      {/* Box */}
      <div
        style={{
          width: BOX_SIZE,
          height: BOX_SIZE,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "60%",
            transform: "translate(-50%, -50%)",
            width: 100,
            height: 100,
            background: "#fff",
            border: "4px solid #333",
            borderRadius: 16,
            boxShadow: "0 4px 12px #aaa",
            zIndex: 2,
          }}
        >
          {/* Jack popping out */}
          {popped && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: -80,
                transform: "translateX(-50%)",
                fontSize: 48,
                transition: "top 0.4s cubic-bezier(.17,.67,.83,.67)",
                zIndex: 3,
              }}
            >
              🤡
              <br />
              <span style={{ fontSize: 24, color: "black" }}>{result}</span>
            </div>
          )}
        </div>
        {/* Crank */}
        <div
          style={{
            position: "absolute",
            left: "calc(50% + 60px)",
            top: "calc(60% + 40px)",
            width: 40,
            height: 40,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={40}
            height={40}
            style={{
              transform: `rotate(${cranking ? crankAngle : 0}deg)`,
              transition: cranking ? "none" : "transform 0.2s",
            }}
          >
            <circle
              cx={20}
              cy={20}
              r={12}
              fill="#bbb"
              stroke="#333"
              strokeWidth={2}
            />
            <rect x={18} y={-2} width={4} height={24} fill="#333" rx={2} />
            <rect x={18} y={26} width={4} height={10} fill="#333" rx={2} />
          </svg>
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 20 }}>
        {cranking && "Crank… crank… crank…"}
        {popped && !cranking && "POP!"}
      </div>
    </div>
  );
};

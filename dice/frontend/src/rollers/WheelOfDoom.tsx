import React, { useState, useEffect, useRef } from "react";
import type { DiceRollerProps } from "../types";

const WHEEL_SIZE = 200;
const WheelOfDoom: React.FC<DiceRollerProps> = ({ result, sides }) => {
  const [spinning, setSpinning] = useState(false);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  // Track active segment during spin
  useEffect(() => {
    if (!result) return;

    if (spinning) {
      const start = Date.now();
      const duration = 5000;
      const segmentAngle = 360 / sides;
      const spins = 5;
      const finalRotation =
        spins * 360 + (360 - (result - 1) * segmentAngle - segmentAngle / 2);
      const tick = () => {
        const now = Date.now();
        const elapsed = Math.min(now - start, duration);
        // Ease out
        const progress = elapsed / duration;
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentRotation = eased * finalRotation;
        // Calculate active segment
        const normalized = ((currentRotation % 360) + 360) % 360;
        let seg = Math.floor((360 - normalized) / segmentAngle) + 1;
        if (seg > sides) seg = 1;
        setActiveSegment(seg);
        if (elapsed < duration) {
          requestAnimationFrame(tick);
        } else {
          setActiveSegment(result);
        }
      };
      tick();
      return () => setActiveSegment(null);
    }
  }, [spinning, result, sides]);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Remove stray 'cost;' line
  useEffect(() => {
    if (result !== undefined) {
      setSpinning(true);
      setShowResult(false);
      // Calculate the final rotation so the wheel lands on the rolled result
      const segmentAngle = 360 / sides;
      // The wheel spins several times, then lands on the result
      const spins = 5; // number of full spins
      const finalRotation =
        spins * 360 + (360 - (result - 1) * segmentAngle - segmentAngle / 2);
      setRotation(finalRotation);
      const timer = setTimeout(() => {
        setSpinning(false);
        setShowResult(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [result, sides]);

  // Generate wheel segments
  const segmentAngle = 360 / sides;
  const segments = Array.from({ length: sides }, (_, i) => {
    const angle = segmentAngle * i;
    const isWinner =
      (spinning && activeSegment === i + 1) || (showResult && result === i + 1);
    // Calculate arc end point
    const startAngle = angle;
    const endAngle = angle + segmentAngle;
    const r = WHEEL_SIZE / 2 - 10;
    const x1 = WHEEL_SIZE / 2 + r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = WHEEL_SIZE / 2 + r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = WHEEL_SIZE / 2 + r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = WHEEL_SIZE / 2 + r * Math.sin((endAngle * Math.PI) / 180);
    // For text label
    const textAngle = angle + segmentAngle / 2;
    const textRadius = WHEEL_SIZE / 2 - 40;
    const textX =
      WHEEL_SIZE / 2 + textRadius * Math.cos((textAngle * Math.PI) / 180);
    const textY =
      WHEEL_SIZE / 2 + textRadius * Math.sin((textAngle * Math.PI) / 180);
    return (
      <g key={i}>
        <path
          d={`M${WHEEL_SIZE / 2},${
            WHEEL_SIZE / 2
          } L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
          fill={isWinner ? "#ffeb3b" : i % 2 === 0 ? "#90caf9" : "#e3f2fd"}
          stroke="#333"
          strokeWidth={1}
        />
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={14}
          fill="#333"
        >
          {i + 1}
        </text>
      </g>
    );
  });

  return (
    <div
      style={{
        textAlign: "center",
        margin: "2rem",
        border: "2px solid black",
        width: "100%",
        aspectRatio: "1/1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={wheelRef}
        style={{
          width: WHEEL_SIZE,
          height: WHEEL_SIZE,
          margin: "0 auto",
          transition: spinning
            ? "transform 5s cubic-bezier(.17,.67,.83,.67)"
            : undefined,
          transform: spinning
            ? `rotate(${rotation}deg)`
            : showResult
            ? `rotate(${rotation}deg)`
            : "rotate(0deg)",
        }}
      >
        <svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          {segments}
          {/* Center circle */}
          <circle
            cx={WHEEL_SIZE / 2}
            cy={WHEEL_SIZE / 2}
            r={30}
            fill="#fff"
            stroke="#333"
            strokeWidth={2}
          />
        </svg>
        {/* Pointer */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 10,
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "20px solid #f44336",
            zIndex: 2,
          }}
        />
      </div>
      {spinning && <div style={{ marginTop: 16 }}>Spinning...</div>}
      {showResult && result !== undefined && (
        <div className="dice-result">
          <h2>Result: {result}</h2>
          <div style={{ fontSize: 18 }}>({sides}-sided die)</div>
        </div>
      )}
    </div>
  );
};

export default WheelOfDoom;

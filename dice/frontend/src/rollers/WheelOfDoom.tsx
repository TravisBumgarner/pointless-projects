import React, { useState, useEffect, useRef } from "react";
import type { DiceRollerProps } from "../types";

const WheelOfDoom: React.FC<DiceRollerProps> = ({ sides }) => {
  const [spinning, setSpinning] = useState(false);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [wheelSideLength, setWheelSideLength] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const observer = new ResizeObserver(() => {
      setWheelSideLength(wheel.clientWidth);
    });
    observer.observe(wheel);
    // Set initial size
    setWheelSideLength(wheel.clientWidth);
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    if (result !== null) {
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
    const r = wheelSideLength / 2 - 10;
    const x1 = wheelSideLength / 2 + r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = wheelSideLength / 2 + r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = wheelSideLength / 2 + r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = wheelSideLength / 2 + r * Math.sin((endAngle * Math.PI) / 180);
    // For text label
    const textAngle = angle + segmentAngle / 2;
    const textRadius = wheelSideLength / 2 - 40;
    const textX =
      wheelSideLength / 2 + textRadius * Math.cos((textAngle * Math.PI) / 180);
    const textY =
      wheelSideLength / 2 + textRadius * Math.sin((textAngle * Math.PI) / 180);
    return (
      <g key={i}>
        <path
          d={`M${wheelSideLength / 2},${
            wheelSideLength / 2
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
    <div>
      <button onClick={() => setResult(Math.floor(Math.random() * sides) + 1)}>
        Roll
      </button>
      <div
        ref={wheelRef}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
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
        <svg width={wheelSideLength} height={wheelSideLength}>
          {segments}
          {/* Center circle */}
          <circle
            cx={wheelSideLength / 2}
            cy={wheelSideLength / 2}
            r={30}
            fill="#fff"
            stroke="#333"
            strokeWidth={2}
          />
        </svg>
      </div>
    </div>
  );
};

export default WheelOfDoom;

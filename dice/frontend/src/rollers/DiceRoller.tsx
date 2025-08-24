import React, { useState, useEffect } from "react";

interface DiceRollerProps {
  rollResult: number;
  sides: number;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ rollResult, sides }) => {
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (rollResult !== undefined) {
      setSpinning(true);
      setShowResult(false);
      const timer = setTimeout(() => {
        setSpinning(false);
        setShowResult(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [rollResult]);

  console.log("hi");
  return (
    <div
      style={{
        textAlign: "center",
        margin: "2rem",
        border: "2px solid black",
        height: "200px",
      }}
    >
      {spinning && (
        <div className="dice-spinner">
          <div
            style={{
              width: 80,
              height: 80,
              border: "8px solid #ccc",
              borderTop: "8px solid #2196f3",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <div style={{ marginTop: 16 }}>Rolling...</div>
        </div>
      )}
      {showResult && rollResult !== undefined && (
        <div className="dice-result">
          <h2>Result: {rollResult}</h2>
          <div style={{ fontSize: 18 }}>({sides}-sided die)</div>
        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DiceRoller;

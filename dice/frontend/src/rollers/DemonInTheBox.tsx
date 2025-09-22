import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import type { DiceRollerProps } from "../types";
import { PALETTE } from "../styles/styleConsts";

const BOX_SIZE = 300;

const JackInBoxDice: React.FC<DiceRollerProps> = ({
  params: { sides },
  isRolling,
  setIsRolling,
}) => {
  const [cranking, setCranking] = useState(false);
  const [popped, setPopped] = useState(false);
  const [crankAngle, setCrankAngle] = useState(0);
  const [result, setResult] = useState<number | undefined>(undefined);

  const roll = useCallback(() => {
    const result = Math.floor(Math.random() * sides) + 1;
    setResult(result);
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
  }, [sides]);

  useEffect(() => {
    if (isRolling) roll();
    setIsRolling(false);
  }, [isRolling, roll, setIsRolling]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          textAlign: "center",
          margin: "2rem",
          width: BOX_SIZE,
          aspectRatio: "1/1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: PALETTE.wow.blueLight,
          position: "relative",
        }}
      >
        {/* Box */}
        <Box
          sx={{
            width: BOX_SIZE,
            height: BOX_SIZE,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "60%",
              transform: "translate(-50%, -50%)",
              width: 100,
              height: 100,
              background: "#fff",
              border: `4px solid ${PALETTE.wow.blueDark}`,
              borderRadius: "16px",
              boxShadow: "0 4px 12px #aaa",
              zIndex: 2,
            }}
          >
            {/* Jack popping out */}
            {popped && (
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: -40,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "top 0.4s cubic-bezier(.17,.67,.83,.67)",
                  zIndex: 3,
                }}
              >
                <Typography sx={{ fontSize: 48 }}>🤡</Typography>
                <Typography sx={{ fontSize: 24, color: "black" }}>
                  {result}
                </Typography>
              </Box>
            )}
          </Box>
          {/* Crank */}
          <Box
            sx={{
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
          </Box>
        </Box>
        <Typography sx={{ marginTop: 2, fontSize: 20, height: 28 }}>
          {cranking && "Crank… crank… crank…"}
          {popped && !cranking && "POP!"}
        </Typography>
      </Box>
    </Box>
  );
};

export default JackInBoxDice;

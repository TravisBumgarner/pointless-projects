import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import type { DiceRollerProps } from "../types";
import { PALETTE } from "../styles/styleConsts";
import { getContrastColor } from "../utils/getContrastColor";

type BalloonProps = {
  number: number;
  isWinner: boolean;
  trigger: boolean;
  sides: number;
};

const COLORS_ARRAY = [
  PALETTE.wow.redLight,
  PALETTE.wow.blueLight,
  PALETTE.wow.purpleLight,
  PALETTE.wow.greenLight,
];

const getBalloonDelay = (sides: number, getMaxDelay: boolean) => {
  // Max delay needed for timeout to reset state.
  const delay = 500 + (sides / 20) * 100;
  return (getMaxDelay ? 1 : Math.random()) * delay;
};

const Balloon: React.FC<BalloonProps> = ({
  number,
  isWinner,
  trigger,
  sides,
}) => {
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
      const delay = getBalloonDelay(sides, false);
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
  }, [trigger, isWinner, sides]);

  return (
    <Box
      sx={{
        width: 30,
        height: 40,
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        background: popped ? "transparent" : COLORS_ARRAY[number % 4],
        border: "2px solid #333",
        position: "relative",
        textAlign: "center",
        lineHeight: "40px",
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
        <Typography
          sx={{
            fontSize: 32,
            position: "absolute",
            left: 0,
            right: 0,
            top: 16,
          }}
        >
          💥
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: 14,
            top: 8,
            position: "absolute",
            left: 0,
            right: 0,
            color: getContrastColor(COLORS_ARRAY[number % 4]),
          }}
        >
          {number + 1}
        </Typography>
      )}
      {!popped && (
        <Box
          sx={{
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
    </Box>
  );
};

export const BalloonDice: React.FC<DiceRollerProps> = ({
  params: { sides },
  isRolling,
  setIsRolling,
}) => {
  const [trigger, setTrigger] = useState(false);
  const [result, setResult] = useState(0);

  useEffect(() => {
    setTrigger(false);
  }, [sides]);

  const roll = useCallback(() => {
    setTrigger(false);
    setResult(Math.floor(Math.random() * sides) + 1);
    const t = setTimeout(() => setTrigger(true), 200); // slight delay before starting
    return () => clearTimeout(t);
  }, [sides]);

  useEffect(() => {
    if (isRolling) roll();
    setIsRolling(false);
  }, [isRolling, roll, setIsRolling]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: "1rem",
        margin: "2rem",
        position: "relative",
      }}
    >
      {Array.from({ length: sides }).map((_, i) => (
        <Balloon
          sides={sides}
          key={`${i}-${result}-${sides}`}
          number={i}
          isWinner={result === i + 1}
          trigger={trigger}
        />
      ))}
    </Box>
  );
};

import DiceRoller from "./WheelOfDoom";
import { Box } from "@mui/material";
import type { DiceRollerProps, RollerType } from "../types";
import { PlinkoDice } from "../rollers/PinkoBoard";
import { BalloonDice } from "../rollers/BalloonPop";
import { JackInBoxDice } from "../rollers/JackInTheBox";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const rollerMap: Record<RollerType, React.FC<DiceRollerProps>> = {
  "wheel-of-doom": DiceRoller,
  plinko: PlinkoDice,
  balloon: BalloonDice,
  "jack-in-the-box": JackInBoxDice,
};

const Roller = ({
  results,
  selectedRoller,
}: {
  results: DiceResult | null;
  selectedRoller: RollerType;
}) => {
  return (
    <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
      {results &&
        (() => {
          const RollerComponent = rollerMap[selectedRoller];
          return (
            <RollerComponent rollResult={results.roll} sides={results.sides} />
          );
        })()}
    </Box>
  );
};

export default Roller;

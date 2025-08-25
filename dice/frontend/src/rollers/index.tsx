import { useState } from "react";

import DiceRoller from "./WheelOfDoom";
import { Box, MenuItem, Select, Typography } from "@mui/material";
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

const Roller = ({ results }: { results: DiceResult | null }) => {
  const [selectedRoller, setSelectedRoller] =
    useState<RollerType>("wheel-of-doom");

  return (
    <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
      <Typography variant="h3">How Dapper?</Typography>

      <Box>
        <Select
          fullWidth
          size="small"
          value={selectedRoller}
          onChange={(e) => setSelectedRoller(e.target.value as RollerType)}
        >
          <MenuItem value="wheel-of-doom">Wheel of Doom</MenuItem>
          <MenuItem value="plinko">Plinko Board</MenuItem>
          <MenuItem value="balloon">Balloon Pop</MenuItem>
          <MenuItem value="jack-in-the-box">Jack in the Box</MenuItem>
        </Select>
      </Box>

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

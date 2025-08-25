import { useState } from "react";

import DiceRoller from "../rollers/DiceRoller";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
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
  dice: DiceRoller,
  plinko: PlinkoDice,
  balloon: BalloonDice,
  "jack-in-the-box": JackInBoxDice,
};

const Roller = ({ results }: { results: DiceResult | null }) => {
  const [selectedRoller, setSelectedRoller] = useState<RollerType>("dice");

  return (
    <div>
      <Select
        value={selectedRoller}
        onChange={(e) => setSelectedRoller(e.target.value)}
      >
        <MenuItem value="dice">Dice Roller</MenuItem>
        <MenuItem value="plinko">Plinko Board</MenuItem>
        <MenuItem value="balloon">Balloon Pop</MenuItem>
        <MenuItem value="jack-in-the-box">Jack in the Box</MenuItem>
      </Select>

      {results &&
        (() => {
          const RollerComponent = rollerMap[selectedRoller];
          return (
            <RollerComponent rollResult={results.roll} sides={results.sides} />
          );
        })()}
    </div>
  );
};

export default Roller;

import WheelOfDoom from "./WheelOfDoom";
import { Box } from "@mui/material";
import type { DiceRollerProps, RollerType } from "../types";
import { PlinkoDice } from "../rollers/PinkoBoard";
import { BalloonDice } from "../rollers/BalloonPop";
import { JackInBoxDice } from "../rollers/JackInTheBox";

const rollerMap: Record<RollerType, React.FC<DiceRollerProps>> = {
  "wheel-of-doom": WheelOfDoom,
  plinko: PlinkoDice,
  balloon: BalloonDice,
  "jack-in-the-box": JackInBoxDice,
};

const Roller = ({
  result,
  selectedRoller,
  sides,
}: {
  result: number | null;
  selectedRoller: RollerType;
  sides: number;
}) => {
  return (
    <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
      {(() => {
        const RollerComponent = rollerMap[selectedRoller];
        return <RollerComponent sides={sides} result={result} />;
      })()}
    </Box>
  );
};

export default Roller;

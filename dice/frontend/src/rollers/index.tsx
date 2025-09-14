import WheelOfDoom from "./WheelOfDoom";
import type { DiceRollerProps, RollerType } from "../types";
import { PlinkoDice } from "./Plinko";
import { BalloonDice } from "../rollers/BalloonPop";
import { JackInBoxDice } from "../rollers/JackInTheBox";

const rollerMap: Record<RollerType, React.FC<DiceRollerProps>> = {
  "wheel-of-doom": WheelOfDoom,
  plinko: PlinkoDice,
  balloon: BalloonDice,
  "jack-in-the-box": JackInBoxDice,
};

const Roller = ({
  selectedRoller,
  sides,
}: {
  selectedRoller: RollerType;
  sides: number;
}) => {
  const RollerComponent = rollerMap[selectedRoller];
  return <RollerComponent sides={sides} />;
};

export default Roller;

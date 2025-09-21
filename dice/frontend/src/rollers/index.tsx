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
  params,
  isRolling,
  setIsRolling,
}: {
  selectedRoller: RollerType;
  params: { sides: number };
  isRolling: boolean;
  setIsRolling?: (rolling: boolean) => void;
}) => {
  const RollerComponent = rollerMap[selectedRoller];
  return (
    <RollerComponent
      params={params}
      isRolling={isRolling}
      setIsRolling={setIsRolling}
    />
  );
};

export default Roller;

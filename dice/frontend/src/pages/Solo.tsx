import { useState } from "react";

import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import { Box } from "@mui/material";
import type { RollerType } from "../types";
import SelectRoller from "../SelectRoller";

const Solo = () => {
  const [result, setResult] = useState<number | null>(null);
  const [sides, setSides] = useState(6);

  const [selectedRoller, setSelectedRoller] =
    useState<RollerType>("wheel-of-doom");

  const roll = (sides: number) => {
    const rollValue = Math.floor(Math.random() * sides) + 1;
    setResult({ user: "solo", roll: rollValue, sides });
  };

  return (
    <Box>
      <Box sx={{ width: "250px" }}>
        <SelectRoller
          selectedRoller={selectedRoller}
          setSelectedRoller={setSelectedRoller}
        />
        <DiceSelector setSides={setSides} />

        <Roller sides={sides} result={result} selectedRoller={selectedRoller} />
      </Box>
    </Box>
  );
};

export default Solo;

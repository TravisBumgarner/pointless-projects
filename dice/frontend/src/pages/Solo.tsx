import { useState } from "react";

import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import { Box } from "@mui/material";
import type { RollerType } from "../types";
import SelectRoller from "../SelectRoller";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const Solo = () => {
  const [results, setResults] = useState<DiceResult | null>(null);
  const [selectedRoller, setSelectedRoller] =
    useState<RollerType>("wheel-of-doom");

  const roll = (sides: number) => {
    const rollValue = Math.floor(Math.random() * sides) + 1;
    setResults({ user: "solo", roll: rollValue, sides });
  };

  return (
    <Box>
      <h1>Rollin' Solo</h1>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SelectRoller
          selectedRoller={selectedRoller}
          setSelectedRoller={setSelectedRoller}
        />
        <DiceSelector roll={roll} />

        <Roller results={results} selectedRoller={selectedRoller} />
      </Box>
    </Box>
  );
};

export default Solo;

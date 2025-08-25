import { useState } from "react";

import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import { Box } from "@mui/material";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const Solo = () => {
  const [results, setResults] = useState<DiceResult | null>(null);

  const roll = (sides: number) => {
    const rollValue = Math.floor(Math.random() * sides) + 1;
    setResults({ user: "solo", roll: rollValue, sides });
  };

  return (
    <Box>
      <h1>Rollin' Solo</h1>
      <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <Roller results={results} />
        <DiceSelector roll={roll} />
      </Box>
    </Box>
  );
};

export default Solo;

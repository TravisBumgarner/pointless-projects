import { useState } from "react";

import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import { Box, Button } from "@mui/material";
import type { RollerType } from "../types";
import SelectRoller from "../SelectRoller";

const Solo = () => {
  const [params, setParams] = useState<{ sides: number }>({ sides: 6 });
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRoller, setSelectedRoller] = useState<RollerType>("balloon");

  const handleSetSelectedRoller = (roller: RollerType) => {
    setIsRolling(false);
    setSelectedRoller(roller);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          height: "40px",
          "@media (max-width: 800px)": {
            flexDirection: "column",
            height: "auto",
            width: "250px",
            margin: "0 auto",
          },
        }}
      >
        <SelectRoller
          selectedRoller={selectedRoller}
          setSelectedRoller={handleSetSelectedRoller}
        />
        <DiceSelector setParams={setParams} />
      </Box>
      <Button variant="contained" onClick={() => setIsRolling(true)}>
        Roll
      </Button>
      <Box>
        <Roller
          isRolling={isRolling}
          params={params}
          selectedRoller={selectedRoller}
          setIsRolling={setIsRolling}
        />
      </Box>
    </Box>
  );
};

export default Solo;

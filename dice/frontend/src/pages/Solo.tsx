import { useState } from "react";

import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import { Box, Button } from "@mui/material";
import type { RollerType } from "../types";
import SelectRoller from "../SelectRoller";
import { SPACING } from "../styles/styleConsts";
import { COLLAPSE_WIDTH } from "../consts";

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
          gap: SPACING.TINY.PX,
          marginBottom: "1rem",
          height: "40px",
          [`@media (max-width: ${COLLAPSE_WIDTH}px)`]: {
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
        <Button
          sx={{
            width: "130px",
            [`@media (max-width: ${COLLAPSE_WIDTH}px)`]: { width: "100%" },
          }}
          variant="contained"
          onClick={() => setIsRolling(true)}
        >
          Roll d{params.sides}
        </Button>
      </Box>

      <Box sx={{ marginTop: SPACING.MEDIUM.PX }}>
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

import { useState } from "react";

import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import { Box } from "@mui/material";
import type { RollerType } from "../types";
import SelectRoller from "../SelectRoller";

const Solo = () => {
  const [sides, setSides] = useState(6);

  const [selectedRoller, setSelectedRoller] = useState<RollerType>("plinko");

  return (
    <Box>
      <Box sx={{ width: "250px" }}>
        <SelectRoller
          selectedRoller={selectedRoller}
          setSelectedRoller={setSelectedRoller}
        />
        <DiceSelector setSides={setSides} />
      </Box>
      <Box>
        <Roller sides={sides} selectedRoller={selectedRoller} />
      </Box>
    </Box>
  );
};

export default Solo;

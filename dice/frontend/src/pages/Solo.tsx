import { useState } from "react";

import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import { Box } from "@mui/material";
import type { RollerType } from "../types";
import SelectRoller from "../SelectRoller";

const Solo = () => {
  const [params, setParams] = useState<{ sides: number }>({ sides: 6 });

  const [selectedRoller, setSelectedRoller] = useState<RollerType>("balloon");

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
          setSelectedRoller={setSelectedRoller}
        />
        <DiceSelector setParams={setParams} />
      </Box>
      <Box>
        <Roller params={params} selectedRoller={selectedRoller} />
      </Box>
    </Box>
  );
};

export default Solo;

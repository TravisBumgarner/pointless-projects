import { Box, MenuItem, Select } from "@mui/material";
import type { RollerType } from "./types";
import { COLLAPSE_WIDTH } from "./consts";

const SelectRoller = ({
  setSelectedRoller,
  selectedRoller,
}: {
  setSelectedRoller: (roller: RollerType) => void;
  selectedRoller: RollerType;
}) => {
  return (
    <Box>
      <Select
        fullWidth
        sx={{
          height: "100%",
          width: "180px",
          [`@media (max-width: ${COLLAPSE_WIDTH}px)`]: {
            height: "auto",
            width: "250px",
          },
        }}
        value={selectedRoller}
        onChange={(e) => setSelectedRoller(e.target.value as RollerType)}
      >
        <MenuItem value="wheel-of-doom">Wheel of Doom</MenuItem>
        <MenuItem value="plinko">Plinko Board</MenuItem>
        <MenuItem value="balloon">Balloon Pop</MenuItem>
        <MenuItem value="demon-in-the-box">Jack in the Box</MenuItem>
      </Select>
    </Box>
  );
};

export default SelectRoller;

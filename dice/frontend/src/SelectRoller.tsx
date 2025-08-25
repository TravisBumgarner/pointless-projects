import { Box, MenuItem, Select, Typography } from "@mui/material";
import type { RollerType } from "./types";

const SelectRoller = ({
  setSelectedRoller,
  selectedRoller,
}: {
  setSelectedRoller: (roller: RollerType) => void;
  selectedRoller: RollerType;
}) => {
  return (
    <>
      <Typography variant="h3">How Dapper?</Typography>

      <Box>
        <Select
          fullWidth
          size="small"
          value={selectedRoller}
          onChange={(e) => setSelectedRoller(e.target.value as RollerType)}
        >
          <MenuItem value="wheel-of-doom">Wheel of Doom</MenuItem>
          <MenuItem value="plinko">Plinko Board</MenuItem>
          <MenuItem value="balloon">Balloon Pop</MenuItem>
          <MenuItem value="jack-in-the-box">Jack in the Box</MenuItem>
        </Select>
      </Box>
    </>
  );
};

export default SelectRoller;

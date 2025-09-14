import { Box, MenuItem, Select } from "@mui/material";
import type { RollerType } from "./types";
import { SPACING } from "./styles/styleConsts";

const SelectRoller = ({
  setSelectedRoller,
  selectedRoller,
}: {
  setSelectedRoller: (roller: RollerType) => void;
  selectedRoller: RollerType;
}) => {
  return (
    <Box sx={{ width: "100%", margin: `${SPACING.TINY.PX} 0` }}>
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
  );
};

export default SelectRoller;

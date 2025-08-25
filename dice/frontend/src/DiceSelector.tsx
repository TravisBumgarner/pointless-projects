import {
  Box,
  TextField,
  Button,
  type SxProps,
  Typography,
} from "@mui/material";
import { useState } from "react";

const DiceSelector = ({ roll }: { roll: (sides: number) => void }) => {
  const [customSides, setCustomSides] = useState<number | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3">Roll a die:</Typography>
      <Box sx={buttonWrapperSx}>
        {[2, 4, 6, 8].map((sides) => (
          <Button
            sx={buttonSx}
            key={sides}
            variant="contained"
            onClick={() => roll(sides)}
          >
            d{sides}
          </Button>
        ))}
      </Box>
      <Box sx={buttonWrapperSx}>
        {[10, 12, 20, 100].map((sides) => (
          <Button
            sx={buttonSx}
            key={sides}
            variant="contained"
            onClick={() => roll(sides)}
          >
            d{sides}
          </Button>
        ))}
      </Box>
      <Box sx={buttonWrapperSx}>
        <TextField
          sx={{ flexGrow: 1 }}
          size="small"
          type="number"
          variant="outlined"
          placeholder="Custom sides"
          value={customSides}
          onChange={(e) => {
            const val = e.target.value;
            setCustomSides(val === "" ? null : Number(val));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const sides = Number(customSides);
              if (!isNaN(sides) && sides > 0) {
                roll(sides);
                setCustomSides(null);
              }
            }
          }}
        />
        <Button
          variant="contained"
          sx={buttonSx}
          onClick={() => {
            roll(customSides!);
          }}
          disabled={customSides === null}
        >
          Roll
        </Button>
      </Box>
    </Box>
  );
};

const buttonSx: SxProps = {
  width: "20px",
};

const buttonWrapperSx: SxProps = { width: "100%", display: "flex", gap: 1 };

export default DiceSelector;

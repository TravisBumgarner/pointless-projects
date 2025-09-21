import {
  Box,
  Button,
  TextField,
  Typography,
  type SxProps,
} from "@mui/material";
import { SPACING } from "./styles/styleConsts";
import { useState } from "react";

const DiceSelector = ({
  setParams,
}: {
  setParams: ({ sides }: { sides: number }) => void;
}) => {
  const [lastSelectedSides, setLastSelectedSides] = useState<number | "custom">(
    6
  );
  const [customSides, setCustomSides] = useState<number | "">("");

  const handleSetParams = (params: { sides: number; isCustom: boolean }) => {
    setLastSelectedSides(params.isCustom ? "custom" : params.sides);
    if (!params.isCustom) {
      setCustomSides("");
    }
    setParams(params);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: SPACING.TINY.PX,
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box sx={buttonWrapperSx}>
        {[2, 4, 6, 8].map((sides) => (
          <Button
            sx={buttonSx}
            key={sides}
            variant={sides === lastSelectedSides ? "contained" : "outlined"}
            onClick={() => handleSetParams({ sides, isCustom: false })}
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
            variant={sides === lastSelectedSides ? "contained" : "outlined"}
            onClick={() => handleSetParams({ sides, isCustom: false })}
          >
            d{sides}
          </Button>
        ))}
      </Box>
      <Box sx={buttonWrapperSx}>
        <Typography>d</Typography>
        <TextField
          sx={{ flexGrow: 1 }}
          size="small"
          type="number"
          variant="outlined"
          placeholder="Custom sides"
          value={customSides}
          onChange={(e) => {
            const val = e.target.value;
            setCustomSides(val === "" ? "" : Number(val));
            handleSetParams({ sides: Number(val), isCustom: true });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const sides = Number(customSides);
              if (!isNaN(sides) && sides > 0) {
                handleSetParams({ sides, isCustom: true });
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

const buttonSx: SxProps = {
  width: "10px",
  minWidth: "10px",
  flexGrow: 1,
};

const buttonWrapperSx: SxProps = {
  flexGrow: 1,
  display: "flex",
  gap: SPACING.TINY.PX,
  alignItems: "center",
};

export default DiceSelector;

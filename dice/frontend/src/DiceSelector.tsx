import { Box, Button, TextField, type SxProps } from "@mui/material";
import { SPACING } from "./styles/styleConsts";
import { useState } from "react";
import { COLLAPSE_WIDTH, DEFAULT_DICE } from "./consts";

const DiceSelector = ({
  setParams,
}: {
  setParams: ({ sides }: { sides: number }) => void;
}) => {
  const [lastSelectedSides, setLastSelectedSides] = useState<number | "custom">(
    DEFAULT_DICE
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
        flexDirection: "row",
        width: "100%",
        height: "100%",
        [`@media (max-width: ${COLLAPSE_WIDTH}px)`]: {
          flexDirection: "column",
          height: "auto",
        },
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
      <TextField
        sx={{
          width: "140px",
          "& .MuiOutlinedInput-root": {
            height: "100%",
          },
          [`@media (max-width: ${COLLAPSE_WIDTH}px)`]: {
            width: "100%",
          },
        }}
        size="small"
        type="number"
        variant="outlined"
        placeholder="Custom"
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
  );
};

const buttonSx: SxProps = {
  width: "10px",
  minWidth: "10px",
  flexGrow: 1,
  height: "100%",
};

const buttonWrapperSx: SxProps = {
  flexGrow: 1,
  display: "flex",
  gap: SPACING.TINY.PX,
  alignItems: "center",
};

export default DiceSelector;

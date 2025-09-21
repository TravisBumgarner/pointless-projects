import { Box, Button, type SxProps } from "@mui/material";
import { SPACING } from "./styles/styleConsts";

const DiceSelector = ({
  setParams,
}: {
  setParams: ({ sides }: { sides: number }) => void;
}) => {
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
            variant="contained"
            onClick={() => setParams({ sides })}
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
            onClick={() => setParams({ sides })}
          >
            d{sides}
          </Button>
        ))}
      </Box>
      {/* <Box sx={buttonWrapperSx}>
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
                setParams(sides);
                setCustomSides(null);
              }
            }
          }}
        />
        <Button
          variant="contained"
          sx={buttonSx}
          onClick={() => {
            setParams(customSides!);
          }}
          disabled={customSides === null}
        >
          Roll
        </Button>
      </Box> */}
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
};

export default DiceSelector;

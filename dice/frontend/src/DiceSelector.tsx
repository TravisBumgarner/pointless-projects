import { Box, Typography, TextField, Button } from "@mui/material";

const DiceSelector = ({ roll }: { roll: (sides: number) => void }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body1">Roll a die:</Typography>
      {[2, 4, 6, 8, 10, 12, 20, 100].map((sides) => (
        <Button key={sides} variant="contained" onClick={() => roll(sides)}>
          d{sides}
        </Button>
      ))}
      <Typography variant="body1">or</Typography>
      <TextField
        size="small"
        type="number"
        variant="outlined"
        placeholder="Custom sides"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const sides = Number((e.target as HTMLInputElement).value);
            if (!isNaN(sides) && sides > 0) {
              roll(sides);
            }
          }
        }}
      />
      <Button
        variant="contained"
        onClick={() => {
          const sides = Number(
            (document.querySelector('input[type="number"]') as HTMLInputElement)
              .value
          );
          if (!isNaN(sides) && sides > 0) {
            roll(sides);
          }
        }}
      >
        Roll
      </Button>
    </Box>
  );
};

export default DiceSelector;

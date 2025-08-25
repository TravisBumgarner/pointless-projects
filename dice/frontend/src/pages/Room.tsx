import { useEffect, useState } from "react";

import socket from "../services/socket";
import { useParams } from "react-router";
import DiceRoller from "../rollers/DiceRoller";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { DiceRollerProps, Roller } from "../types";
import { PlinkoDice } from "../rollers/PinkoBoard";
import { BalloonDice } from "../rollers/BalloonPop";
import { JackInBoxDice } from "../rollers/JackInTheBox";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const rollerMap: Record<Roller, React.FC<DiceRollerProps>> = {
  dice: DiceRoller,
  plinko: PlinkoDice,
  balloon: BalloonDice,
  "jack-in-the-box": JackInBoxDice,
};

const Room = () => {
  const [selectedRoller, setSelectedRoller] = useState<Roller>("dice");
  const [results, setResults] = useState<DiceResult | null>(null);
  const { room } = useParams<{ room: string }>();

  const roll = (sides: number) => {
    socket.emit("roll_dice", { room: room, sides });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Copied room to  clipboard!");
  };

  useEffect(() => {
    socket.emit("join_room", { room });
    socket.on("dice_result", (data: DiceResult) => {
      setResults(data);
    });
    return () => {
      socket.off("dice_result");
    };
  }, [room]);

  return (
    <div>
      <h1>
        Room: {room} (
        <Button onClick={handleCopyToClipboard}>Share Room Link</Button>)
      </h1>
      <Select
        value={selectedRoller}
        onChange={(e) => setSelectedRoller(e.target.value)}
      >
        <MenuItem value="dice">Dice Roller</MenuItem>
        <MenuItem value="plinko">Plinko Board</MenuItem>
        <MenuItem value="balloon">Balloon Pop</MenuItem>
        <MenuItem value="jack-in-the-box">Jack in the Box</MenuItem>
      </Select>
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
              (
                document.querySelector(
                  'input[type="number"]'
                ) as HTMLInputElement
              ).value
            );
            if (!isNaN(sides) && sides > 0) {
              roll(sides);
            }
          }}
        >
          Roll
        </Button>
      </Box>
      {results &&
        (() => {
          const RollerComponent = rollerMap[selectedRoller];
          return (
            <RollerComponent rollResult={results.roll} sides={results.sides} />
          );
        })()}
    </div>
  );
};

export default Room;

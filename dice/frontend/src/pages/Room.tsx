import { useEffect, useState } from "react";

import socket from "../services/socket";
import { useParams } from "react-router";
import { Box, Button } from "@mui/material";
import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import SelectRoller from "../SelectRoller";
import type { RollerType } from "../types";

import { SPACING } from "../styles/styleConsts";
import { COLLAPSE_WIDTH } from "../consts";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const Room = () => {
  const [results, setResults] = useState<DiceResult | null>(null);
  const { room } = useParams<{ room: string }>();
  const [params, setParams] = useState<{ sides: number }>({ sides: 6 });
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRoller, setSelectedRoller] = useState<RollerType>("balloon");

  const handleSetSelectedRoller = (roller: RollerType) => {
    setIsRolling(false);
    setSelectedRoller(roller);
  };

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
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: SPACING.TINY.PX,
          marginBottom: "1rem",
          height: "40px",
          [`@media (max-width: ${COLLAPSE_WIDTH}px)`]: {
            flexDirection: "column",
            height: "auto",
            width: "250px",
            margin: "0 auto",
          },
        }}
      >
        <SelectRoller
          selectedRoller={selectedRoller}
          setSelectedRoller={handleSetSelectedRoller}
        />
        <DiceSelector setParams={setParams} />
        <Button
          sx={{
            width: "130px",
            [`@media (max-width: ${COLLAPSE_WIDTH}px)`]: { width: "100%" },
          }}
          variant="contained"
          onClick={() => setIsRolling(true)}
        >
          Roll d{params.sides}
        </Button>
      </Box>

      <Box sx={{ marginTop: SPACING.MEDIUM.PX }}>
        <Roller
          isRolling={isRolling}
          params={params}
          selectedRoller={selectedRoller}
          setIsRolling={setIsRolling}
        />
      </Box>
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <Button sx={{ fontSize: "24px" }} onClick={handleCopyToClipboard}>
          Share Room Link
        </Button>
      </Box>
    </Box>
  );
};

export default Room;

import { useEffect, useState } from "react";

import socket from "../services/socket";
import { useParams } from "react-router";
import { Box, Button } from "@mui/material";
import Roller from "../rollers";
import DiceSelector from "../DiceSelector";
import SelectRoller from "../SelectRoller";
import type { RollerType } from "../types";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const Room = () => {
  const [results, setResults] = useState<DiceResult | null>(null);
  const { room } = useParams<{ room: string }>();
  const [selectedRoller, setSelectedRoller] =
    useState<RollerType>("wheel-of-doom");

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
      <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <SelectRoller
          selectedRoller={selectedRoller}
          setSelectedRoller={setSelectedRoller}
        />
        <DiceSelector roll={roll} />
        <Roller results={results} selectedRoller={selectedRoller} />
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

import { useEffect, useState } from "react";

import socket from "../services/socket";
import { useParams } from "react-router";
import { Button } from "@mui/material";
import Roller from "../rollers";
import DiceSelector from "../DiceSelector";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const Room = () => {
  const [results, setResults] = useState<DiceResult | null>(null);
  const { room } = useParams<{ room: string }>();
  const [sides, setSides] = useState(6);

  const roll = (sides: number) => {
    setSides(sides);
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
      <DiceSelector roll={roll} />
      {results && <Roller results={results} />}
    </div>
  );
};

export default Room;

import { useEffect, useState } from "react";

import socket from "../services/socket";
import { useParams } from "react-router";
import DiceRoller from "../components/DiceRoller";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const Room = () => {
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
  console.log("results", results);
  return (
    <div>
      <h2>Room</h2>
      <h1>Dice Room: {room}</h1>
      <button onClick={handleCopyToClipboard}>Copy Room Link</button>
      <button onClick={() => roll(6)}>Roll d6</button>
      <button onClick={() => roll(20)}>Roll d20</button>
      {results && (
        <DiceRoller rollResult={results.roll} sides={results.sides} />
      )}
    </div>
  );
};

export default Room;

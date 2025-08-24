import { useEffect, useState } from "react";

import socket from "../services/socket";
import { useParams } from "react-router";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const Room = () => {
  const [results, setResults] = useState<DiceResult[]>([]);
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
      setResults((prev) => [...prev, data]);
    });
    return () => {
      socket.off("dice_result");
    };
  }, [room]);

  return (
    <div>
      <h2>Room</h2>
      <h1>Dice Room: {room}</h1>
      <button onClick={handleCopyToClipboard}>Copy Room Link</button>
      <button onClick={() => roll(6)}>Roll d6</button>
      <button onClick={() => roll(20)}>Roll d20</button>
      {results.map((r, i) => (
        <li key={i}>
          <b>{r.user.slice(0, 4)}</b>: {r.roll} (d{r.sides})
        </li>
      ))}
    </div>
  );
};

export default Room;

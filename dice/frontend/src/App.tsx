import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import generateRoomName from "./generateRoomName";
interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const socket = io({
  path: "/socket.io",
});

export default function App() {
  const [room, setRoom] = useState<null | string>();
  const [results, setResults] = useState<DiceResult[]>([]);
  useEffect(() => {
    if (!room) {
      setRoom(generateRoomName());
    }
  }, [room]);
  useEffect(() => {
    socket.emit("join_room", { room });
    socket.on("dice_result", (data: DiceResult) => {
      setResults((prev) => [...prev, data]);
    });
    return () => {
      socket.off("dice_result");
    };
  }, [room]);

  const roll = (sides: number) => {
    socket.emit("roll_dice", { room, sides });
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Dice Room: {room}</h1>
      <button onClick={() => roll(6)}>Roll d6</button>
      <button onClick={() => roll(20)}>Roll d20</button>

      <ul>
        {results.map((r, i) => (
          <li key={i}>
            <b>{r.user.slice(0, 4)}</b>: {r.roll} (d{r.sides})
          </li>
        ))}
      </ul>
    </div>
  );
}

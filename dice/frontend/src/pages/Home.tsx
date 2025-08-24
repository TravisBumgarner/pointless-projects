import { useNavigate } from "react-router";
import generateRoomName from "../utils/generateRoomName";
import socket from "../services/socket";
import { useState } from "react";

export default function App() {
  const navigate = useNavigate();
  const [inputRoomName, setInputRoomName] = useState("");

  const handleCreateRoom = () => {
    const roomName = generateRoomName();
    socket.emit("create_room", { room: roomName });
    navigate(`/room/${roomName}`);
  };

  const handleJoinRoom = () => {
    navigate(`/room/${inputRoomName}`);
  };

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div>
        <button onClick={handleCreateRoom}>Create Room</button>
        <p>Or</p>
        <input
          type="text"
          placeholder="Enter room name"
          value={inputRoomName}
          onChange={(e) => setInputRoomName(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
}

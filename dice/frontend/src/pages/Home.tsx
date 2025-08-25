import { useNavigate } from "react-router";
import generateRoomName from "../utils/generateRoomName";
import socket from "../services/socket";
import { useState } from "react";
import { Button } from "@mui/material";

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
        flexDirection: "column",
      }}
    >
      <h2>Roll with Friends</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Button style={{ width: "auto" }} onClick={handleCreateRoom}>
          Create Room
        </Button>
        <p style={{ margin: 0 }}>Or</p>
        <input
          type="text"
          placeholder="Enter room name"
          value={inputRoomName}
          onChange={(e) => setInputRoomName(e.target.value)}
          style={{ width: "160px" }}
        />
        <Button style={{ width: "auto" }} onClick={handleJoinRoom}>
          Join
        </Button>
      </div>
      <h2>Roll Alone</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Button onClick={() => navigate("/solo")}>Start rollin'</Button>
      </div>
    </div>
  );
}

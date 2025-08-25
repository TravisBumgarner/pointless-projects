import { useNavigate } from "react-router";
import generateRoomName from "../utils/generateRoomName";
import socket from "../services/socket";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  type SxProps,
} from "@mui/material";

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
    <Box>
      <Box sx={boxSX}>
        <Typography variant="h2">Roll with Friends</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Button
            variant="contained"
            style={{ width: "auto" }}
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
          <p style={{ margin: 0 }}>Or</p>
          <TextField
            size="small"
            type="text"
            placeholder="Enter room name"
            value={inputRoomName}
            onChange={(e) => setInputRoomName(e.target.value)}
            style={{ width: "160px" }}
          />
          <Button
            variant="contained"
            disabled={inputRoomName.length === 0}
            style={{ width: "auto" }}
            onClick={handleJoinRoom}
          >
            Join
          </Button>
        </Box>
      </Box>
      <Box sx={boxSX}>
        <Typography variant="h2">Roll Alone</Typography>
        <Box style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Button variant="contained" onClick={() => navigate("/solo")}>
            Start rolling
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const boxSX: SxProps = {
  width: "500px",
  maxWidth: "90%",
  textAlign: "center",
  border: "1px solid white",
  padding: "1rem",
  marginTop: "1rem",
  gap: "0.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

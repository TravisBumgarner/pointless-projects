import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // relaxed for dev; tighten in prod
  },
});

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// --- Socket.IO events ---
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join_room", ({ room }: { room: string }) => {
    socket.join(room);
  });

  socket.on("roll_dice", ({ room, sides }: { room: string; sides: number }) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    io.to(room).emit("dice_result", { user: socket.id, roll, sides });
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // relaxed for dev; tighten in prod
    },
});
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
    const frontendDist = path_1.default.join(__dirname, "../../frontend/dist");
    console.log("ruda", frontendDist);
    app.use(express_1.default.static(frontendDist));
    app.get("*", (_req, res) => {
        res.sendFile(path_1.default.join(frontendDist, "index.html"));
    });
}
// --- Socket.IO events ---
io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.on("join_room", ({ room }) => {
        socket.join(room);
    });
    socket.on("roll_dice", ({ room, sides }) => {
        const roll = Math.floor(Math.random() * sides) + 1;
        io.to(room).emit("dice_result", { user: socket.id, roll, sides });
    });
});
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});

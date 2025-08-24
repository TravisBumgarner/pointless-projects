import { io } from "socket.io-client";

const socket = io({
  path: "/socket.io",
});

export default socket;

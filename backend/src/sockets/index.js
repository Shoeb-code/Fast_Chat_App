import { Server } from "socket.io";
import { registerSocketHandlers } from "./socketHandlers.js";

export const initializeSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(" a new user is connected. i.e Socket connected:",socket.id);
    registerSocketHandlers(io, socket);
  });

  return io;
};
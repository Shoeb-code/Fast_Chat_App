import http from "http";
import app from "./src/app.js";
import dotenv from "dotenv";
import { initializeSocket } from "./src/sockets/index.js";

dotenv.config();

const server = http.createServer(app);

// socket initialization
initializeSocket(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
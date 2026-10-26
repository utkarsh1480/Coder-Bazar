import "dotenv/config";
import { createServer } from "node:http";
import { initializeSocket } from "./socket/index.js";

const server = createServer();

initializeSocket(server);

const PORT = process.env.PORT || 4600;

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
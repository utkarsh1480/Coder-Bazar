import { Server } from "socket.io";
import  authenticateSocket from "./socket.auth.js";
import { registerChatSocket } from "./chat.socket.js";

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(authenticateSocket);
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);


console.log("========== SOCKET CONNECT ==========");
  console.log("Socket ID:", socket.id);
  console.log("User ID:", socket.userId);
  

  const userROOM = `user_${socket.userId}`;
   socket.join(userROOM);

  console.log(
    `User ${socket.userId} joined personal room`
  );

    registerChatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}
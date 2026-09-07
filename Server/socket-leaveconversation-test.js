import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MGE4ZTIxMC0zMGYyLTQ3YWItOWZiOC04MzRlNzk3NmVkZWUiLCJlbWFpbCI6InV0a2Fyc2hAZ21haWwuY29tIiwiaWF0IjoxNzg4NTMzMDMwLCJleHAiOjE3ODg1MzQyMzB9.lIUU45o2ICepE0cRXuYEooJoZXf366m0oIky1uuCn3s"

const conversationId = "479a1c9b-473c-4e28-bc5b-d827e653b3c5"

const socket = io("http://localhost:4600", {
  auth: {
    token,
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("CONNECTED:", socket.id);
//   socket.emit(
//     "join_conversation",
//     { conversationId },
//     (response) => {
//       console.log("JOIN ACK:", response);
//     }
//   );
  socket.emit("leave_conversation", { conversationId }, (response) => {
    console.log("LEAVE ACK:", response);
  });
});

socket.on("disconnect", (reason) => {
  console.log("DISCONNECTED:", reason);
});

socket.on("connect_error", (error) => {
  console.log("CONNECTION ERROR:", error.message);
});

socket.on("new_message", (message) => {
  console.log("NEW MESSAGE:", message);
});

socket.on("leave_conversation", (ack) => {
  console.log("LEFT CONVERSATION:", ack);
});
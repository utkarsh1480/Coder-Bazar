import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MGE4ZTIxMC0zMGYyLTQ3YWItOWZiOC04MzRlNzk3NmVkZWUiLCJlbWFpbCI6InV0a2Fyc2hAZ21haWwuY29tIiwiaWF0IjoxNzg4NDU5NDM2LCJleHAiOjE3ODg0NjA2MzZ9.1y-OeLB2biSAPE1qOjqhHEtLyKSFkZTST-F2KjjyEuM"

const socket = io("http://localhost:4600", {
  auth: {
    token,
  },
});

// socket.on("connect", () => {
//   console.log("Connected:", socket.id);
// });

// socket.on("connect_error", (error) => {
//   console.log("Connection error:", error.message);
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected");
// });


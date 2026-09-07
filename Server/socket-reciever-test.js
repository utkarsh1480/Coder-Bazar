import { io } from "socket.io-client";
import readline from "readline";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzBhNGQ1Zi0zMjk1LTQ5Y2YtYjZmOC02YzZmOWM0MzI5NGMiLCJlbWFpbCI6InV0a2Fyc2hvbmVAZ21haWwuY29tIiwiaWF0IjoxNzg4NzAzNjA1LCJleHAiOjE3ODg3MDQ4MDV9.V-7MLK1rq07Yd5THYf9ioZfeDq845kEARlpLp17jDj4"

const conversationId = "479a1c9b-473c-4e28-bc5b-d827e653b3c5"
  "479a1c9b-473c-4e28-bc5b-d827e653b3c5";

const socket = io("http://localhost:4600", {
  auth: {
    token,
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// =========================================
// CONNECT
// =========================================

socket.on("connect", () => {
  console.log("RECEIVER CONNECTED:", socket.id);

  // Join conversation
  socket.emit(
    "join_conversation",
    { conversationId },
    (response) => {
      console.log("JOIN ACK:", response);
    }
  );
});

// =========================================
// DISCONNECT
// =========================================

socket.on("disconnect", (reason) => {
  console.log("DISCONNECTED:", reason);
});

// =========================================
// CONNECTION ERROR
// =========================================

socket.on("connect_error", (error) => {
  console.log("CONNECTION ERROR:", error.message);
});

// =========================================
// NEW MESSAGE
// =========================================

socket.on("new_message", (message) => {
  console.log("🔵 NEW MESSAGE:", message);
});

// =========================================
// NEW NOTIFICATION
// =========================================

socket.on("new_notification", (message) => {
  console.log("🔔 NEW NOTIFICATION:", message);
});

// =========================================
// TERMINAL INPUT
// =========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("");
console.log("Commands:");
console.log("  leave  → Leave conversation");
console.log("  join   → Join conversation");
console.log("");

// =========================================
// HANDLE COMMANDS
// =========================================

rl.on("line", (input) => {
  const command = input.trim().toLowerCase();

  // -----------------------------------------
  // LEAVE
  // -----------------------------------------

  if (command === "leave") {
    socket.emit(
      "leave_conversation",
      { conversationId },
      (response) => {
        console.log("LEAVE ACK:", response);
      }
    );

    return;
  }

  // -----------------------------------------
  // JOIN
  // -----------------------------------------

  if (command === "join") {
    socket.emit(
      "join_conversation",
      { conversationId },
      (response) => {
        console.log("JOIN ACK:", response);
      }
    );

    return;
  }

  console.log("Unknown command. Use: join or leave");
});
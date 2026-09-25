import { io } from "socket.io-client";

const socket = io(
    import.meta.env.VITE_SOCKET_URL ||
        "http://localhost:4600",
    {
        withCredentials: true,
        autoConnect: false,
    }
);

socket.on("connect", () => {
    console.log("🟢 SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error(
        "🔴 SOCKET CONNECTION ERROR:",
        error.message
    );
});

socket.on("disconnect", (reason) => {
    console.log(
        "🟡 SOCKET DISCONNECTED:",
        reason
    );
});

export default socket;
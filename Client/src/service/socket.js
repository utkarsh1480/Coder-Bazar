import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4600";

const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;
import {verifyAccessToken} from "../utils/jwt.js";


async function authenticateSocket(socket, next) {
    try{
        const token = socket.handshake.auth?.token;
        if(!token){
            return next(new Error("Authentication token is missing"));
        }
        const decoded = verifyAccessToken(token);
         console.log("DECODED TOKEN:", decoded);
            console.log("Decoded token:", decoded);
            socket.userId = decoded.sub;
        next();
    } catch (error) {
        console.log("Socket authentication error:", error.message);
        return next(new Error("Invalid authentication token"));
    }
}

export default authenticateSocket;
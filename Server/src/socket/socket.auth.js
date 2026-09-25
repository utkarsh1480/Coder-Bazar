import { verifyAccessToken } from "../utils/jwt.js";

const getCookie = (cookieHeader, name) => {
    if (!cookieHeader) return null;

    const cookies = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim());

    const target = cookies.find((cookie) =>
        cookie.startsWith(`${name}=`)
    );

    if (!target) return null;

    return decodeURIComponent(
        target.substring(name.length + 1)
    );
};

async function authenticateSocket(socket, next) {
    try {
        const cookieHeader =
            socket.handshake.headers.cookie;

        console.log(
            "SOCKET COOKIE:",
            cookieHeader
        );

        const token = getCookie(
            cookieHeader,
            "token"
        );

        if (!token) {
            return next(
                new Error(
                    "Authentication token is missing"
                )
            );
        }

        const decoded =
            verifyAccessToken(token);

        console.log(
            "DECODED TOKEN:",
            decoded
        );

        socket.userId = decoded.sub;

        next();

    } catch (error) {
        console.log(
            "Socket authentication error:",
            error.message
        );

        return next(
            new Error(
                "Invalid authentication token"
            )
        );
    }
}

export default authenticateSocket;
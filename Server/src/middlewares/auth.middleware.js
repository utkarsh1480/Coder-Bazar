import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.token;
        console.log(token)

        if (!token) {
            const error = new Error("Authentication required");
            error.statusCode = 401;
            throw error;
        }

        const decoded = verifyAccessToken(token);
        console.log(decoded);
        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
}
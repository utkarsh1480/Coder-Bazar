import jwt from "jsonwebtoken";

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET
  );
}
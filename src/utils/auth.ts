//src/utils/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; // Buat unique token ID

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "superrefreshsecret";

export const hashPassword = async (plain: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

// Access token
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

// Refresh token + unique ID (untuk rotation)
export const generateRefreshToken = (payload: object) => {
  const tokenId = uuidv4();
  const token = jwt.sign({ ...payload, tokenId }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { token, tokenId };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

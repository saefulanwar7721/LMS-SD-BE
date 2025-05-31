//src/utils/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "superrefreshsecret";

// Hash password
export const hashPassword = async (plain: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

// Token
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "10s" });
};

export const generateRefreshToken = (payload: object) => {
  const tokenId = uuidv4(); // unique untuk RTR
  const token = jwt.sign({ ...payload, tokenId }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { token, tokenId };
};

// Buat RTR hash
export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Optional: verifikasi token
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

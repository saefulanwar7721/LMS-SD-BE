// src/controllers/authRefreshController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "superrefreshsecret";

interface JwtPayload {
  id: number;
  role: string;
  school_id: number;
  tokenId?: string; // Tambahan kalau RTR
}

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token dibutuhkan" });
    return;
  }

  try {
    // Verifikasi refresh token dan ambil payload + tokenId
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload & {
      tokenId: string;
    };
    const tokenId = decoded.tokenId;

    // Cek tokenId di Redis
    const storedUserId = await redisClient.get(`refreshToken:${tokenId}`);
    if (!storedUserId || storedUserId !== decoded.id.toString()) {
      res
        .status(401)
        .json({ message: "Refresh token tidak valid atau sudah dipakai" });
      return;
    }

    // Hapus token lama (rotation)
    await redisClient.del(`refreshToken:${tokenId}`);

    // Generate token baru
    const { token: newRefreshToken, tokenId: newTokenId } =
      generateRefreshToken({
        id: decoded.id,
        role: decoded.role,
        school_id: decoded.school_id,
      });
    await redisClient.set(`refreshToken:${newTokenId}`, decoded.id.toString(), {
      EX: 7 * 24 * 60 * 60,
    }); // Expire 7 hari

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
      school_id: decoded.school_id,
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("Error di refresh token:", err);
    res.status(401).json({ message: "Refresh token tidak valid", error: err });
  }
};

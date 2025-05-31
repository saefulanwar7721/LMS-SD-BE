// src/controllers/auth/authRefreshController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import db from "../../models";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../../utils/auth";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "superrefreshsecret";

const RefreshToken = db.RefreshToken;

interface JwtPayload {
  id: number;
  role: string;
  school_id: number;
  tokenId: string;
}

// ♻️ Endpoint Refresh Token
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token dibutuhkan" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;
    const tokenId = decoded.tokenId;
    const hashed = hashToken(tokenId);

    // Cari token di DB dan pastikan masih valid
    const tokenRecord = await RefreshToken.findOne({
      where: {
        user_id: decoded.id,
        token_id: decoded.tokenId,
        is_revoked: false,
        expires_at: {
          [Op.gt]: new Date(), // ✅ Di sini error sebelumnya
        },
      },
    });

    if (!tokenRecord) {
      res
        .status(401)
        .json({ message: "Refresh token tidak valid atau kadaluarsa" });
      return;
    }

    // Rotasi token: hapus yang lama
    await tokenRecord.destroy();

    // Generate token baru (RTR)
    const { token: newRefreshToken, tokenId: newTokenId } =
      generateRefreshToken({
        id: decoded.id,
        role: decoded.role,
        school_id: decoded.school_id,
      });

    const newTokenHash = hashToken(newTokenId);
    await RefreshToken.create({
      user_id: decoded.id,
      token_id: newTokenId,
      token_hash: newTokenHash,
      is_revoked: false,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
    });

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
      school_id: decoded.school_id,
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    return;
  } catch (err) {
    console.error("Error di refresh token:", err);
    res.status(401).json({ message: "Refresh token tidak valid", error: err });
    return;
  }
};

// 🚪 Endpoint Logout (hapus token refresh dari DB)
export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token dibutuhkan" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;
    const tokenId = decoded.tokenId;

    // Hapus token refresh dari DB
    await RefreshToken.destroy({
      where: {
        user_id: decoded.id,
        token_id: tokenId,
      },
    });

    res.json({ message: "Logout berhasil" });
    return;
  } catch (err) {
    console.error("Error saat logout:", err);
    res.status(400).json({ message: "Gagal logout", error: err });
    return;
  }
};

// src/controllers/authSuperAdminController.ts
import { Request, Response } from "express";
import SuperAdmin from "../models/SuperAdmin";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth";

// 🚀 Register Super Admin Pertama (kalau belum ada super admin sama sekali)
export const registerSuperAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const existingCount = await SuperAdmin.count();
    if (existingCount > 0) {
      res.status(403).json({
        message:
          "Super admin sudah ada. Gunakan endpoint lain untuk menambahkan.",
      });
      return;
    }

    const { name, email, password } = req.body;
    const password_hash = await hashPassword(password);

    const superAdmin = await SuperAdmin.create({ name, email, password_hash });

    // 🔐 Generate access token & refresh token
    const accessToken = generateAccessToken({
      id: superAdmin.id,
      role: "superadmin",
    });
    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: superAdmin.id,
      role: "superadmin",
    });

    res.status(201).json({
      message: "Super admin pertama berhasil dibuat",
      superAdmin,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Register SuperAdmin Error:", err);
    res.status(500).json({ message: "Gagal membuat super admin", error: err });
  }
};

// 🔐 LOGIN Super Admin
export const loginSuperAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await SuperAdmin.findOne({ where: { email } });

    if (!user || !user.password_hash) {
      res.status(401).json({ message: "Email atau password salah" });
      return;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: "Email atau password salah" });
      return;
    }

    // 🔐 Generate access token & refresh token
    const accessToken = generateAccessToken({
      id: user.id,
      role: "superadmin",
    });
    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: user.id,
      role: "superadmin",
    });

    res.json({
      message: "Login sukses",
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    console.error("Login SuperAdmin Error:", err);
    res.status(500).json({ message: "Login gagal", error: err });
  }
};

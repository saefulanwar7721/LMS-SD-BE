// src/controllers/authParentController.ts
import { Request, Response } from "express";
import User from "../models/User";
import Parent from "../models/Parent";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth";
import School from "../models/School";
import Student from "../models/Student";

// 🚀 Register Parent (hanya bisa dilakukan oleh admin sekolah)
export const registerParent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { school_id, name, email, password, student_id, relationship } =
      req.body;

    const school = await School.findByPk(school_id);
    if (!school) {
      res.status(404).json({ message: "Sekolah tidak ditemukan" });
      return;
    }

    const student = await Student.findOne({
      where: { id: student_id, school_id },
    });
    if (!student) {
      res.status(404).json({ message: "Siswa tidak ditemukan di sekolah ini" });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email sudah terdaftar" });
      return;
    }

    const password_hash = await hashPassword(password);
    const newUser = await User.create({
      school_id,
      role: "orang_tua",
      name,
      email,
      password_hash,
    });

    const newParent = await Parent.create({
      school_id,
      user_id: newUser.id,
      student_id,
      relationship: relationship || "wali",
    });

    // 🔐 Generate access token & refresh token
    const accessToken = generateAccessToken({
      id: newUser.id,
      role: "orang_tua",
      school_id,
    });
    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: newUser.id,
      role: "orang_tua",
      school_id,
    });

    res.status(201).json({
      message: "Parent berhasil didaftarkan",
      parent: newParent,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Register Parent Error:", err);
    res.status(500).json({ message: "Gagal mendaftarkan parent", error: err });
  }
};

// 🔐 Login Parent
export const loginParent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, role: "orang_tua" },
      include: [{ model: Parent, as: "Parent" }],
    });
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
      role: user.role,
      school_id: user.school_id,
    });
    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: user.id,
      role: user.role,
      school_id: user.school_id,
    });

    const parent = (user as any).Parent;
    res.json({
      message: "Login parent sukses",
      accessToken,
      refreshToken,
      parent,
    });
  } catch (err) {
    console.error("Login Parent Error:", err);
    res.status(500).json({ message: "Login parent gagal", error: err });
  }
};

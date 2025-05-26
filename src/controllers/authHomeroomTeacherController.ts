// src/controllers/authHomeroomTeacherController.ts
import { Request, Response } from "express";
import User from "../models/User";
import HomeroomTeacher from "../models/HomeroomTeacher";
import School from "../models/School";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth";

// 🚀 Register Wali Kelas (hanya admin sekolah)
export const registerHomeroomTeacher = async (req: Request, res: Response) => {
  try {
    const { school_id, name, email, password, class_id, academic_year } =
      req.body;

    const school = await School.findByPk(school_id);
    if (!school) {
      res.status(404).json({ message: "Sekolah tidak ditemukan" });
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
      role: "wali_kelas",
      name,
      email,
      password_hash,
    });

    const newHomeroomTeacher = await HomeroomTeacher.create({
      school_id,
      user_id: newUser.id,
      class_id,
      academic_year,
    });

    // 🔐 Generate access token & refresh token
    const accessToken = generateAccessToken({
      id: newUser.id,
      role: "wali_kelas",
      school_id,
    });
    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: newUser.id,
      role: "wali_kelas",
      school_id,
    });

    res.status(201).json({
      message: "Wali kelas berhasil didaftarkan",
      homeroom_teacher: newHomeroomTeacher,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Register HomeroomTeacher Error:", err);
    res
      .status(500)
      .json({ message: "Gagal mendaftarkan wali kelas", error: err });
  }
};

// 🔐 Login Wali Kelas
export const loginHomeroomTeacher = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, role: "wali_kelas" },
      include: [{ model: HomeroomTeacher, as: "HomeroomTeacher" }],
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

    const homeroom_teacher = (user as any).HomeroomTeacher;

    res.json({
      message: "Login wali kelas sukses",
      accessToken,
      refreshToken,
      homeroom_teacher,
    });
  } catch (err) {
    console.error("Login HomeroomTeacher Error:", err);
    res.status(500).json({ message: "Login wali kelas gagal", error: err });
  }
};

// src/controllers/auth/authTeacherController.ts
import { Request, Response } from "express";
import User from "../../models/User";
import Teacher from "../../models/Teacher";
import School from "../../models/School";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth";

// 🚀 Register Guru (hanya bisa dilakukan oleh admin sekolah)
export const registerTeacher = async (req: Request, res: Response) => {
  try {
    const { school_id, name, email, password, nip, gender, birth_date } =
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
      role: "guru",
      name,
      email,
      password_hash,
    });

    const newTeacher = await Teacher.create({
      school_id,
      user_id: newUser.id,
      nip,
      gender,
      birth_date,
    });

    // 🔐 Generate access token & refresh token
    const accessToken = generateAccessToken({
      id: newUser.id,
      role: "guru",
      school_id,
    });
    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: newUser.id,
      role: "guru",
      school_id,
    });

    res.status(201).json({
      message: "Guru berhasil didaftarkan",
      teacher: newTeacher,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Register Teacher Error:", err);
    res.status(500).json({ message: "Gagal mendaftarkan guru", error: err });
  }
};

// 🔐 Login Guru
export const loginTeacher = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, role: "guru" },
      include: [{ model: Teacher }],
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

    const teacher = (user as any).Teacher;

    res.json({
      message: "Login guru sukses",
      accessToken,
      refreshToken,
      teacher,
    });
  } catch (err) {
    console.error("Login Teacher Error:", err);
    res.status(500).json({ message: "Login guru gagal", error: err });
  }
};

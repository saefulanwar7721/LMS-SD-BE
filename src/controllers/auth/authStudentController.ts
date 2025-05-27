// src/controllers/auth/authStudentController.ts
import { Request, Response } from "express";
import User from "../../models/User";
import Student from "../../models/Student";
import School from "../../models/School";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/auth";
import Class from "../../models/Class";

// 🚀 Register Student (hanya bisa dilakukan oleh admin)
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const {
      school_id,
      name,
      email,
      password,
      nisn,
      gender,
      birth_date,
      class_id,
    } = req.body;
    const kelas = await Class.findByPk(class_id);
    if (!kelas) {
      res.status(404).json({ message: "Kelas tidak ditemukan" });
      return;
    }

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
      role: "siswa",
      name,
      email,
      password_hash,
    });

    const newStudent = await Student.create({
      school_id,
      user_id: newUser.id,
      nisn,
      gender,
      birth_date,
      class_id,
    });

    // 🔐 Generate access token & refresh token
    const accessToken = generateAccessToken({
      id: newUser.id,
      role: "siswa",
      school_id,
    });
    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: newUser.id,
      role: "siswa",
      school_id,
    });

    res.status(201).json({
      message: "Siswa berhasil didaftarkan",
      student: newStudent,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Register Student Error:", err);
    res.status(500).json({ message: "Gagal mendaftarkan siswa", error: err });
  }
};

// 🔐 Login Student
export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, role: "siswa" },
      include: [{ model: Student, as: "Student" }],
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

    const student = (user as any).Student;
    res.json({
      message: "Login siswa sukses",
      accessToken,
      refreshToken,
      student,
    });
  } catch (err) {
    console.error("Login Student Error:", err);
    res.status(500).json({ message: "Login siswa gagal", error: err });
  }
};

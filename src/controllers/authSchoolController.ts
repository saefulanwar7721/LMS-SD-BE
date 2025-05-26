// src/controllers/authSchoolController.ts
import { Request, Response } from "express";
import School from "../models/School";
import User from "../models/User";
import Admin from "../models/Admin";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth";

export const registerSchoolWithAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Incoming request:", req.body); // ✅ Debug log

    const {
      schoolName,
      schoolEmail,
      phoneNumber,
      address,
      logoUrl,
      activationType,
      adminName,
      adminEmail,
      adminPassword,
    } = req.body;

    const existingSchool = await School.findOne({
      where: { email: schoolEmail },
    });
    if (existingSchool) {
      console.log("Email sekolah sudah terdaftar");
      res.status(400).json({ message: "Email sekolah sudah terdaftar" });
      return;
    }

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log("Email admin sudah terdaftar");
      res.status(400).json({ message: "Email admin sudah terdaftar" });
      return;
    }

    const newSchool = await School.create({
      name: schoolName,
      email: schoolEmail,
      phone_number: phoneNumber,
      address,
      logo_url: logoUrl,
      activation_type: activationType,
      trial_start_date: new Date(),
      trial_end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    });

    const password_hash = await hashPassword(adminPassword);
    const newUser = await User.create({
      school_id: newSchool.id,
      role: "admin",
      name: adminName,
      email: adminEmail,
      password_hash,
    });

    const newAdmin = await Admin.create({
      school_id: newSchool.id,
      user_id: newUser.id,
      position: "Admin Utama",
    });

    // ✅ Generate access & refresh token
    const accessToken = generateAccessToken({
      id: newUser.id,
      role: "admin",
      school_id: newSchool.id,
    });

    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: newUser.id,
      role: "admin",
      school_id: newSchool.id,
    });

    res.status(201).json({
      message: "Sekolah baru dan admin pertama berhasil dibuat",
      school: newSchool,
      admin: newUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Error di registerSchoolWithAdmin:", err);
    res
      .status(500)
      .json({ message: "Gagal membuat sekolah dan admin", error: err });
  }
};

export const loginSchoolAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Incoming login request:", req.body); // ✅ Debug log

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, role: "admin" } });

    if (!user || !user.password_hash) {
      console.log("Admin tidak ditemukan");
      res.status(401).json({ message: "Email atau password salah" });
      return;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      console.log("Password tidak cocok");
      res.status(401).json({ message: "Email atau password salah" });
      return;
    }

    // ✅ Generate access & refresh token
    const accessToken = generateAccessToken({
      id: user.id,
      role: "admin",
      school_id: user.school_id,
    });

    const { token: refreshToken, tokenId } = generateRefreshToken({
      id: user.id,
      role: "admin",
      school_id: user.school_id,
    });

    res.json({
      message: "Login sukses",
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    console.error("Error di loginSchoolAdmin:", err);
    res.status(500).json({ message: "Login gagal", error: err });
  }
};

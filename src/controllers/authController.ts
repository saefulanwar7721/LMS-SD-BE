//gak dipake
// // src/controllers/authController.ts
// import { Request, Response } from "express";
// import User from "../models/User";
// import { comparePassword, generateToken, hashPassword } from "../utils/auth";

// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, password, role = "siswa", school_id } = req.body;

//     const existing = await User.findOne({ where: { email } });
//     if (existing) {
//       res.status(400).json({ message: "Email sudah terdaftar." });
//       return;
//     }

//     const password_hash = await hashPassword(password);
//     const user = await User.create({
//       name,
//       email,
//       password_hash,
//       role,
//       school_id,
//     });

//     res.status(201).json({ message: "User registered", user });
//   } catch (err) {
//     res.status(500).json({ message: "Register error", error: err });
//   }
// };

// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ where: { email } });
//     if (!user || !user.password_hash) {
//       res.status(401).json({ message: "Email atau password salah" });
//       return;
//     }

//     const isMatch = await comparePassword(password, user.password_hash);
//     if (!isMatch) {
//       res.status(401).json({ message: "Email atau password salah" });
//       return;
//     }

//     const token = generateToken({
//       id: user.id,
//       role: user.role,
//       school_id: user.school_id,
//     });

//     res.json({ message: "Login sukses", token, user });
//   } catch (err) {
//     res.status(500).json({ message: "Login error", error: err });
//   }
// };

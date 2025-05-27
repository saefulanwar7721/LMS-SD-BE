// src/controllers/create/classCreateController.ts
import { Request, Response } from "express";
import Class from "../../models/Class";
import School from "../../models/School";

export const createClass = async (req: Request, res: Response) => {
  try {
    const { school_id, name, grade, academic_year } = req.body;

    // Validasi dasar
    if (!school_id || !name || !grade || !academic_year) {
      res.status(400).json({ message: "Semua field wajib diisi" });
      return;
    }

    // Cek apakah school_id valid
    const school = await School.findByPk(school_id);
    if (!school) {
      res.status(404).json({ message: "Sekolah tidak ditemukan" });
      return;
    }

    // Cek duplikasi nama kelas dalam sekolah & tahun ajaran
    const existingClass = await Class.findOne({
      where: { school_id, name, academic_year },
    });
    if (existingClass) {
      res
        .status(409)
        .json({ message: "Kelas dengan nama dan tahun ajaran ini sudah ada" });
      return;
    }

    // Buat kelas baru
    const newClass = await Class.create({
      school_id,
      name,
      grade,
      academic_year,
    });

    res.status(201).json({
      message: "Kelas berhasil dibuat",
      class: newClass,
    });
  } catch (err) {
    console.error("Create Class Error:", err);
    res.status(500).json({ message: "Gagal membuat kelas", error: err });
  }
};

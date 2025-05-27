// belum digunakan, perlu migrasi dulu buat nambahin tabel ini
// // src/models/StudentClassHistory.ts
// import { Model, DataTypes } from "sequelize";
// import sequelize from "../config/database";
// import Student from "./Student";
// import Class from "./Class";

// class StudentClassHistory extends Model {}

// StudentClassHistory.init(
//   {
//     id: {
//       type: DataTypes.BIGINT,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     student_id: {
//       type: DataTypes.BIGINT,
//       allowNull: false,
//     },
//     class_id: {
//       type: DataTypes.BIGINT,
//       allowNull: false,
//     },
//     academic_year: {
//       type: DataTypes.STRING(20),
//       allowNull: false,
//       // Contoh: "2025/2026"
//     },
//     notes: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//       // Contoh: "Naik kelas", "Relokasi", "Kenaikan karena prestasi"
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     sequelize,
//     tableName: "student_class_histories",
//     timestamps: false,
//   }
// );

// // Relasi
// Student.hasMany(StudentClassHistory, { foreignKey: "student_id" });
// StudentClassHistory.belongsTo(Student, { foreignKey: "student_id" });

// Class.hasMany(StudentClassHistory, { foreignKey: "class_id" });
// StudentClassHistory.belongsTo(Class, { foreignKey: "class_id" });

// export default StudentClassHistory;

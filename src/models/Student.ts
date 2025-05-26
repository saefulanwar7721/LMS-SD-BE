//src/models/Student.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import School from "./School";
import User from "./User";

class Student extends Model {}

Student.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    class_id: DataTypes.BIGINT,
    nisn: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    gender: DataTypes.ENUM("L", "P"),
    birth_date: DataTypes.DATE,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "students",
    timestamps: false,
  }
);

School.hasMany(Student, { foreignKey: "school_id" });
Student.belongsTo(School, { foreignKey: "school_id" });

User.hasOne(Student, { foreignKey: "user_id" });
Student.belongsTo(User, { foreignKey: "user_id" });

export default Student;

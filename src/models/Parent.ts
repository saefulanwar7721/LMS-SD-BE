//src/models/Parent.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import School from "./School";
import User from "./User";
import Student from "./Student";

class Parent extends Model {}

Parent.init(
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
    student_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.ENUM("ayah", "ibu", "wali"),
      defaultValue: "wali",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "parents",
    timestamps: false,
  }
);

School.hasMany(Parent, { foreignKey: "school_id" });
Parent.belongsTo(School, { foreignKey: "school_id" });

User.hasOne(Parent, { foreignKey: "user_id" });
Parent.belongsTo(User, { foreignKey: "user_id" });

Student.hasMany(Parent, { foreignKey: "student_id" });
Parent.belongsTo(Student, { foreignKey: "student_id" });

export default Parent;

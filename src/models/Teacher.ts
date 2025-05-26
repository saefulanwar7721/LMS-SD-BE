//src/models/Teacher.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import School from "./School";

class Teacher extends Model {}

Teacher.init(
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
    nip: DataTypes.STRING(50),
    gender: DataTypes.ENUM("L", "P"),
    birth_date: DataTypes.DATE,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "teachers",
    timestamps: false,
  }
);

School.hasMany(Teacher, { foreignKey: "school_id" });
Teacher.belongsTo(School, { foreignKey: "school_id" });

User.hasOne(Teacher, { foreignKey: "user_id" });
Teacher.belongsTo(User, { foreignKey: "user_id" });

export default Teacher;

// src/models/Class.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import School from "./School";

class Class extends Model {}

Class.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    grade: {
      type: DataTypes.ENUM("1", "2", "3", "4", "5", "6"),
      allowNull: false,
    },
    academic_year: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "classes",
    timestamps: false,
  }
);

School.hasMany(Class, { foreignKey: "school_id" });
Class.belongsTo(School, { foreignKey: "school_id" });

export default Class;

//src/models/HomeroomTeacher.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import School from "./School";
import User from "./User";
import Class from "./Class";

class HomeroomTeacher extends Model {}

HomeroomTeacher.init(
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
    class_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    academic_year: DataTypes.STRING(20),
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "homeroom_teachers",
    timestamps: false,
  }
);

School.hasMany(HomeroomTeacher, { foreignKey: "school_id" });
HomeroomTeacher.belongsTo(School, { foreignKey: "school_id" });

User.hasOne(HomeroomTeacher, { foreignKey: "user_id" });
HomeroomTeacher.belongsTo(User, { foreignKey: "user_id" });

Class.hasMany(HomeroomTeacher, { foreignKey: "class_id" });
HomeroomTeacher.belongsTo(Class, { foreignKey: "class_id" });

export default HomeroomTeacher;

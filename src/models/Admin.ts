//src/models/Admin.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import School from "./School";
import User from "./User";

class Admin extends Model {}

Admin.init(
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
    position: DataTypes.STRING(100),
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "admins",
    timestamps: false,
  }
);

School.hasMany(Admin, { foreignKey: "school_id" });
Admin.belongsTo(School, { foreignKey: "school_id" });

User.hasOne(Admin, { foreignKey: "user_id" });
Admin.belongsTo(User, { foreignKey: "user_id" });

export default Admin;

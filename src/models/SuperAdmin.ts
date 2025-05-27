//src/models/SuperAdmin.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface SuperAdminAttributes {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  role: "superadmin" | "support" | "sales";
  is_active: boolean;
  created_at: Date;
}

type SuperAdminCreationAttributes = Optional<
  SuperAdminAttributes,
  "id" | "role" | "is_active" | "created_at"
>;

class SuperAdmin
  extends Model<SuperAdminAttributes, SuperAdminCreationAttributes>
  implements SuperAdminAttributes
{
  public id!: number;
  public email!: string;
  public name!: string;
  public password_hash!: string;
  public role!: "superadmin" | "support" | "sales";
  public is_active!: boolean;
  public created_at!: Date;
}

SuperAdmin.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("superadmin", "support", "sales"),
      defaultValue: "superadmin",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "super_admins",
    timestamps: false,
  }
);

export default SuperAdmin;

// src/models/School.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface SchoolAttributes {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  logo_url?: string;
  is_trial?: boolean;
  trial_start_date?: Date;
  trial_end_date?: Date;
  is_active?: boolean;
  is_deleted?: boolean;
  activation_type?: "now" | "later" | "trial";
  status_note?: string;
  created_at?: Date;
}

// Kalau pas create, id dan created_at bisa otomatis (Optional)
interface SchoolCreationAttributes
  extends Optional<SchoolAttributes, "id" | "created_at"> {}

class School
  extends Model<SchoolAttributes, SchoolCreationAttributes>
  implements SchoolAttributes
{
  public id!: number;
  public name!: string;
  public email?: string;
  public phone_number?: string;
  public address?: string;
  public logo_url?: string;
  public is_trial?: boolean;
  public trial_start_date?: Date;
  public trial_end_date?: Date;
  public is_active?: boolean;
  public is_deleted?: boolean;
  public activation_type?: "now" | "later" | "trial";
  public status_note?: string;
  public created_at?: Date;
}

School.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    phone_number: DataTypes.STRING(50),
    address: DataTypes.TEXT,
    logo_url: DataTypes.TEXT,
    is_trial: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    trial_start_date: DataTypes.DATEONLY,
    trial_end_date: DataTypes.DATEONLY,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activation_type: {
      type: DataTypes.ENUM("now", "later", "trial"),
      defaultValue: "trial",
    },
    status_note: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "schools",
    timestamps: false,
  }
);

export default School;

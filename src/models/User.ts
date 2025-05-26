import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserAttributes {
  id: number;
  school_id: number;
  role: "admin" | "guru" | "siswa" | "wali_kelas" | "orang_tua";
  name: string;
  email: string;
  password_hash: string;
  avatar_url?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "password_hash" | "avatar_url" | "is_active" | "created_at"
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public school_id!: number;
  public role!: "admin" | "guru" | "siswa" | "wali_kelas" | "orang_tua";
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public avatar_url?: string;
  public is_active?: boolean;
  public created_at?: Date;
}

User.init(
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
    role: {
      type: DataTypes.ENUM("admin", "guru", "siswa", "wali_kelas", "orang_tua"),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
    },
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "users",
    timestamps: false,
  }
);

export default User;

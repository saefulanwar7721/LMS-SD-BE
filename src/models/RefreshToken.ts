// src/models/RefreshToken.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class RefreshToken extends Model {
  public id!: number;
  public user_id!: number;
  public token_id!: string;
  public token_hash!: string;
  public is_revoked!: boolean;
  public expires_at!: Date;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

RefreshToken.init(
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    token_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
    timestamps: true,
    underscored: true,
  }
);

export default RefreshToken;

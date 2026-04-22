import { Model, DataTypes } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";

export class ShiftOfferRequestNotification extends Model<
  InferAttributes<ShiftOfferRequestNotification>,
  InferCreationAttributes<ShiftOfferRequestNotification>
> {
  declare id: CreationOptional<number>;
  declare shiftOfferRequestID: number;
  declare dismissed: CreationOptional<boolean>;
}

ShiftOfferRequestNotification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shiftOfferRequestID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ShiftOfferRequests",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    dismissed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["id", "shiftOfferRequestID", "dismissed"],
        name: "shiftOfferRequestNotificationIndex",
      },
    ],
  },
);


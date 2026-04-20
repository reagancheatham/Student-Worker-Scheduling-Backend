import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";

export class ShiftTradeRequestNotification extends Model<
    InferAttributes<ShiftTradeRequestNotification>,
    InferCreationAttributes<ShiftTradeRequestNotification>
> {
    declare id: CreationOptional<number>;
    declare shiftTradeRequestID: number;
    declare dismissed: CreationOptional<boolean>;
}

ShiftTradeRequestNotification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shiftTradeRequestID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "ShiftTradeRequests",
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
                fields: ["id", "shiftTradeRequestID", "dismissed"],
                name: "shiftTradeRequestNotificationIndex",
            },
        ],
    },
);

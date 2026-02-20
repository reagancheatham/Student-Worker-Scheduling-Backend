import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import { Shift } from "./shift.model.ts";

export class ShiftOfferRequest extends Model<
    InferAttributes<ShiftOfferRequest>,
    InferCreationAttributes<ShiftOfferRequest>
> {
    declare id: CreationOptional<number>;
    declare offerMessage: string;
    declare timeSent: Date;
    declare shiftID: number;
}

ShiftOfferRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        offerMessage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        timeSent: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        shiftID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shift,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "shiftOfferRequest",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["offerMessage", "timeSent", "shiftID"],
            },
        ],
    },
);

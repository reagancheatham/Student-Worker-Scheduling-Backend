import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Shift } from "./shift.model.ts";

export class ShiftOfferRequest extends Model<
    InferAttributes<ShiftOfferRequest>,
    InferCreationAttributes<ShiftOfferRequest>
> {
    declare shiftID: number;
    declare id: CreationOptional<number>;
    declare employeeMessage: string;
    declare timeSent: Date;
}

ShiftOfferRequest.init(
    {
        shiftID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Shift,
                key: "id",
            },
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeMessage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        timeSent: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["employeeMessage", "timeSent", "shiftID"],
            },
        ],
    },
);

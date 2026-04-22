import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";

export class Settings extends Model<
    InferAttributes<Settings>,
    InferCreationAttributes<Settings>
> {
    declare businessID: number;
    declare doubleTaskSignOff: boolean;
    declare employeeSignOff: boolean;
    declare allowClockInOut: boolean;
    declare clockInThreshold: number;
    declare onTimeThreshold: number;
    declare automaticShiftTrades: boolean;
    declare enableOpenShift: boolean;
    declare enableShiftTrades: boolean;
    declare defaultTermCode: string;
}

Settings.init(
    {
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
                key: "id",
            },
            onDelete: "CASCADE"
        },
        doubleTaskSignOff: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        employeeSignOff: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        allowClockInOut: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        clockInThreshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        onTimeThreshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 15,
        },
        automaticShiftTrades: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        enableOpenShift: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        enableShiftTrades: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        defaultTermCode: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "2026SP",
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["businessID"],
            },
        ],
    },
);
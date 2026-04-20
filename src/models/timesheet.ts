import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";
import { Shift } from "./shift.ts";

export class Timesheet extends Model<
    InferAttributes<Timesheet>,
    InferCreationAttributes<Timesheet>
> {
    declare id: CreationOptional<number>;
    declare shiftID: number;
    declare clockIn: Date;
    declare clockOut: Date;
    declare status: ApprovalStatus;
}

Timesheet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shiftID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shift,
                key: "id",
            },
        },
        clockIn: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        clockOut: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
            allowNull: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["shiftID", "clockIn", "clockOut", "status"],
            },
        ],
    },
);

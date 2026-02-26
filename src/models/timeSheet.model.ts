import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";
import { Shift } from "./shift.model.ts";

export class TimeSheet extends Model<
    InferAttributes<TimeSheet>,
    InferCreationAttributes<TimeSheet>
> {
    declare shiftID: number;
    declare id: CreationOptional<number>;
    declare clockIn: Date;
    declare clockOut: Date;
    declare status: ApprovalStatus;
}

TimeSheet.init(
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
        clockIn: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        clockOut: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
            allowNull: false,
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

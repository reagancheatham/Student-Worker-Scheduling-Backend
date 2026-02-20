import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import { ApprovalStatus } from "../classes/ApprovalStatus.ts";
import { Shift } from "./shift.model.ts";

export class TimeSheet extends Model<
    InferAttributes<TimeSheet>,
    InferCreationAttributes<TimeSheet>
> {
    declare id: CreationOptional<number>;
    declare startTime: Date;
    declare endTime: Date;
    declare status: ApprovalStatus;
    declare shiftID: number;
}

TimeSheet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
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
        tableName: "TimeSheet",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["startTime", "endTime", "status", "shiftID"],
            },
        ],
    },
);

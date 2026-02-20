import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import { ApprovalStatus } from "../classes/ApprovalStatus.ts";
import { Employee } from "./employee.model.ts";

export class TimeOffRequest extends Model<
    InferAttributes<TimeOffRequest>,
    InferCreationAttributes<TimeOffRequest>
> {
    declare id: CreationOptional<number>;
    declare startDate: Date;
    declare endDate: Date;
    declare timeOffReason: string;
    declare status: ApprovalStatus;
    declare employeeID: number;
}

TimeOffRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        timeOffReason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
            allowNull: false,
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "TimeOffRequest",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: [
                    "startDate",
                    "endDate",
                    "timeOffReason",
                    "status",
                    "employeeID",
                ],
                name: "timeOffRequestIndex",
            },
        ],
    },
);

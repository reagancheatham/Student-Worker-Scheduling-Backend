import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";

export class TimeOffRequest extends Model<
    InferAttributes<TimeOffRequest>,
    InferCreationAttributes<TimeOffRequest>
> {
    declare employeeID: number;
    declare id: CreationOptional<number>;
    declare reason: string;
    declare startDate: Date;
    declare endDate: Date;
    declare status: ApprovalStatus;
}

TimeOffRequest.init(
    {
        employeeID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Employee,
                key: "id",
            },
        },
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
        reason: {
            type: DataTypes.STRING,
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
                fields: [
                    "employeeID",
                    "reason",
                    "startDate",
                    "endDate",
                    "status",
                ],
                name: "timeOffRequestIndex",
            },
        ],
    },
);

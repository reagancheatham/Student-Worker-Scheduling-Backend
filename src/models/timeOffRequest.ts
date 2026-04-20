import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";
import { TimeOffRequestNotification } from "./timeOffRequestNotification.ts";

export class TimeOffRequest extends Model<
    InferAttributes<TimeOffRequest>,
    InferCreationAttributes<TimeOffRequest>
> {
    declare id: CreationOptional<number>;
    declare employeeID: number;
    declare reason: string;
    declare startDate: Date;
    declare endDate: Date;
    declare approvalStatus: ApprovalStatus;
}

TimeOffRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "CASCADE",
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
        approvalStatus: {
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
                    "approvalStatus",
                ],
                name: "timeOffRequestIndex",
            },
        ],
    },
);
TimeOffRequest.afterCreate(async (timeOffRequest) => {
    await TimeOffRequestNotification.create({
        timeOffRequestID: timeOffRequest.id,
    });
});

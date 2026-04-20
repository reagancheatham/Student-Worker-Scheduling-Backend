import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Shift } from "./shift.ts";
import { Employee } from "./employee.ts";
import { ShiftTradeRequestNotification } from "./shiftTradeRequestNotification.ts";
import { ApprovalStatus } from "../classes/approvalStatus.ts";

export class ShiftTradeRequest extends Model<
    InferAttributes<ShiftTradeRequest>,
    InferCreationAttributes<ShiftTradeRequest>
> {
    declare id: CreationOptional<number>;
    declare shiftID: number;
    declare targetEmployeeID: number;
    declare employeeMessage: string;
    declare timeSent: Date;
    declare approvalStatus: ApprovalStatus;
}

ShiftTradeRequest.init(
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
            onDelete: "CASCADE",
        },
        targetEmployeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        employeeMessage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        timeSent: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        approvalStatus: {
            type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: [
                    "shiftID",
                    "targetEmployeeID",
                    "employeeMessage",
                    "timeSent",
                ],
                name: "shiftTradeRequestIndex",
            },
        ],
    },
);

ShiftTradeRequest.afterCreate(async (shiftTradeRequest) => {
    await ShiftTradeRequestNotification.create({
        shiftTradeRequestID: shiftTradeRequest.id,
    });
});

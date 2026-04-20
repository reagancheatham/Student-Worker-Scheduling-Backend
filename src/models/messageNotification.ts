import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Employee } from "./employee.ts";
import { NotificationType } from "../classes/notificationType.ts";
import { User } from "./user.ts";

export class MessageNotification extends Model<
    InferAttributes<MessageNotification>,
    InferCreationAttributes<MessageNotification>
> {
    declare id: CreationOptional<number>;
    declare message: string;
    declare notificationType: NotificationType;
    declare employeeID: number;
    declare dismissed: CreationOptional<boolean>;
}

MessageNotification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notificationType: {
            type: DataTypes.ENUM(...Object.values(NotificationType)),
            allowNull: false,
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        dismissed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["message", "employeeID"],
            },
        ],
    },
);

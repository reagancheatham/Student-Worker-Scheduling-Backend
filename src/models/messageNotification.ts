import { Model, DataTypes } from "sequelize";
import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Employee } from "./employee.ts";
import { NotificationType } from "../classes/notificationType.ts";

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
            allowNull: false,
            references: {
                model: Employee,
                key: "id"
            },
            onDelete: "CASCADE",
        },
        dismissed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }

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

class MessageNotificationRouter extends ModelRouter {
    public path(): string {
        return "/messageNotification";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(MessageNotification, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(MessageNotification, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(MessageNotification, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(MessageNotification, req, res, "id"),
        );
    }
}

export const messageNotificationRouter = new MessageNotificationRouter();
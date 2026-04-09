import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router, Request, Response } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { ShiftTradeRequest } from "./shiftTradeRequest.ts";

export class ShiftTradeRequestNotification extends Model<
    InferAttributes<ShiftTradeRequestNotification>,
    InferCreationAttributes<ShiftTradeRequestNotification>
> {
    declare id: CreationOptional<number>;
    declare shiftTradeRequestID: number;
    declare dismissed: CreationOptional<boolean>;
}

ShiftTradeRequestNotification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shiftTradeRequestID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "ShiftTradeRequests",
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
                fields: ["id", "shiftTradeRequestID", "dismissed"],
                name: "shiftTradeRequestNotificationIndex",
            },
        ],
    },
);

class ShiftTradeRequestNotificationRouter extends ModelRouter {
    public path(): string {
        return "/shiftTradeRequestNotifications";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(ShiftTradeRequestNotification, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                ShiftTradeRequestNotification,
                req,
                res,
                "id",
            ),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(
                ShiftTradeRequestNotification,
                req,
                res,
                "id",
            ),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(ShiftTradeRequestNotification, req, res, "id"),
        );
    }
}

export const shiftTradeRequestNotificationRouter =
    new ShiftTradeRequestNotificationRouter();

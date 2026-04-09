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

export class TimeOffRequestNotification extends Model<
    InferAttributes<TimeOffRequestNotification>,
    InferCreationAttributes<TimeOffRequestNotification>
> {
    declare id: CreationOptional<number>;
    declare timeOffRequestID: number;
    declare dismissed: CreationOptional<boolean>;
}

TimeOffRequestNotification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        timeOffRequestID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "TimeOffRequests",
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
                fields: ["id", "timeOffRequestID", "dismissed"],
                name: "timeOffRequestNotificationIndex",
            },
        ],
    },
);

class TimeOffRequestNotificationRouter extends ModelRouter {
    public path(): string {
        return "/timeOffRequestNotifications";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(TimeOffRequestNotification, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(TimeOffRequestNotification, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(TimeOffRequestNotification, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(TimeOffRequestNotification, req, res, "id"),
        );
    }
}

export const timeOffRequestNotificationRouter =
    new TimeOffRequestNotificationRouter();

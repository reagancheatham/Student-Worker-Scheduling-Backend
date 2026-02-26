import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class Settings extends Model<
    InferAttributes<Settings>,
    InferCreationAttributes<Settings>
> {
    declare businessID: number;
}

Settings.init(
    {
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["businessID"],
            },
        ],
    },
);

class SettingsRouter extends ModelRouter {
    public path(): string {
        return "/settings";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Settings, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Settings, req, res, "businessID"),
        );
        router.delete("/:businessID", (req, res) =>
            ScheduleDatabase.delete(Settings, req, res, "businessID"),
        );
        router.get("/:businessID", (req, res) =>
            ScheduleDatabase.get(Settings, req, res, "businessID"),
        );
    }
}

export const settingsRouter = new SettingsRouter();
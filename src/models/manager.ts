import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes } from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { User } from "./user.model.ts";
import { Business } from "./business.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class Manager extends Model<
    InferAttributes<Manager>,
    InferCreationAttributes<Manager>
> {
    declare businessID: number;
    declare userID: number;
}

Manager.init(
    {
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
                key: "id",
            },
        },
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);

class ManagerRouter extends ModelRouter {
    public path(): string {
        return "/managers";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Manager, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Manager, req, res, "businessID", "userID"),
        );
        router.delete("/:businessID/:userID", (req, res) =>
            ScheduleDatabase.delete(Manager, req, res, "businessID", "userID"),
        );
        router.get("/:businessID/:userID", (req, res) =>
            ScheduleDatabase.get(Manager, req, res, "businessID", "userID"),
        );
        router.get("/:businessID", (req, res) =>
            ScheduleDatabase.getAllWhere(Manager, req, res, "businessID"),
        );
        router.get("/", (req, res) =>
            ScheduleDatabase.getAll(Manager, req, res),
        );
    }
}

export const managerRouter = new ManagerRouter();

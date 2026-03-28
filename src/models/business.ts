import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { ScheduleDatabase as ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Employee } from "./employee.ts";
import { User } from "./user.ts";
import { Request, Response, Router } from "express";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";

export class Business extends Model<
    InferAttributes<Business>,
    InferCreationAttributes<Business>
> {
    declare id: CreationOptional<number>;
    declare name: string;
}

Business.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);

class BusinessRouter extends ModelRouter {
    public path(): string {
        return "/businesses";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(Business, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Business, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Business, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(Business, req, res, "id"),
        );
        router.get("/", (req, res) => ScheduleDatabase.getAll(Business, req, res));
    }
}

export const businessRouter = new BusinessRouter();

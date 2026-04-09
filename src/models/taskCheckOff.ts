import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    Includeable,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import { Task } from "./task.ts";
import { Employee } from "./employee.ts";
import { User } from "./user.ts";

const include: Includeable = {
    model: Employee,
    include: [User],
};

export class TaskCheckOff extends Model<
    InferAttributes<TaskCheckOff>,
    InferCreationAttributes<TaskCheckOff>
> {
    declare id: CreationOptional<number>;
    declare taskID: number;
    declare sourceEmployeeID: number;
}

TaskCheckOff.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taskID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Task,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        sourceEmployeeID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "SET NULL",
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
    },
);

class TaskCheckOffRouter extends ModelRouter {
    public path(): string {
        return "/taskCheckOffs";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(TaskCheckOff, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(TaskCheckOff, req, res, "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(TaskCheckOff, req, res, "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.getWhere(
                TaskCheckOff,
                req,
                res,
                {
                    include,
                },
                "id",
            ),
        );
        router.get("/task/:taskID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                TaskCheckOff,
                req,
                res,
                {
                    include,
                },
                "taskID",
            ),
        );
    }
}

export const taskCheckOffRouter = new TaskCheckOffRouter();

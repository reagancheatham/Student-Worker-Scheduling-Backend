import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { TaskList } from "./taskList.ts";
import { TaskStatus } from "../classes/TaskStatus.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class Task extends Model<
    InferAttributes<Task>,
    InferCreationAttributes<Task>
> {
    declare id: CreationOptional<number>;
    declare taskListID: number;
    declare name: string;
    declare completeStatus: TaskStatus;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taskListID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: TaskList,
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completeStatus: {
            type: DataTypes.ENUM(...Object.values(TaskStatus)),
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["name", "completeStatus", "taskListID"],
            },
        ],
    },
);

class TaskRouter extends ModelRouter {
    public path(): string {
        return "/tasks";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) => ScheduleDatabase.create(Task, req, res));
        router.put("/", (req, res) =>
            ScheduleDatabase.update(Task, req, res, "taskListID", "id"),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(Task, req, res, "taskListID", "id"),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(Task, req, res, "taskListID", "id"),
        );
        router.get("/taskList/:taskListID", (req, res) =>
            ScheduleDatabase.getAllWhere(Task, req, res, "taskListID"),
        );
    }
}

export const taskRouter = new TaskRouter();

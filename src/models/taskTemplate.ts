import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { TaskListTemplate } from "./taskListTemplate.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

export class TaskTemplate extends Model<
    InferAttributes<TaskTemplate>,
    InferCreationAttributes<TaskTemplate>
> {
    declare id: CreationOptional<number>;
    declare taskListTemplateID: number;
    declare name: string;
    declare description: string;
}

TaskTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taskListTemplateID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: TaskListTemplate,
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["taskListTemplateID", "name", "description"],
            },
        ],
    },
);

class TaskTemplateRouter extends ModelRouter {
    public path(): string {
        return "/taskTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(TaskTemplate, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                TaskTemplate,
                req,
                res,
                "taskListTemplateID",
                "id",
            ),
        );
        router.delete("/:taskListTemplateID/:id", (req, res) =>
            ScheduleDatabase.delete(
                TaskTemplate,
                req,
                res,
                "taskListTemplateID",
                "id",
            ),
        );
        router.get("/:taskListTemplateID/:id", (req, res) =>
            ScheduleDatabase.get(
                TaskTemplate,
                req,
                res,
                "taskListTemplateID",
                "id",
            ),
        );
    }
}

export const taskTemplateRouter = new TaskTemplateRouter();
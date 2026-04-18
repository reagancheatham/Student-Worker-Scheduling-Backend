import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { TaskListTemplate } from "./taskListTemplate.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import {
    businessAuth,
    BusinessResolver,
} from "../authorization/businessAuthorization.ts";
import { Logger } from "../classes/util/logger.ts";

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
            allowNull: false,
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

const idResolver: BusinessResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const taskTemplate = await TaskTemplate.findOne({
        where: { id },
        include: TaskListTemplate,
    });

    return (taskTemplate as any)?.TaskListTemplate?.businessID;
};

const taskListIDResolver: BusinessResolver = async (req: Request) => {
    let id = req.params?.taskListID;

    if (!id) id = req.body?.taskListID;
    if (!id) return undefined;

    const taskList = await TaskListTemplate.findOne({ where: { id } });

    return taskList?.businessID;
};

class TaskTemplateRouter extends ModelRouter {
    public path(): string {
        return "/taskTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(taskListIDResolver), (req, res) =>
            ScheduleDatabase.create(TaskTemplate, req, res),
        );
        router.put("/", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.update(TaskTemplate, req, res, "id"),
        );
        router.delete("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(TaskTemplate, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(TaskTemplate, req, res, "id"),
        );
        router.get(
            "/taskList/:taskListID",
            businessAuth(taskListIDResolver),
            (req, res) => {
                const taskListID = req.params?.taskListID;

                if (!taskListID) {
                    Logger.error(`Error finding ${TaskListTemplate.name} id!`);
                    return;
                }

                ScheduleDatabase.getAllWhere(TaskTemplate, req, res, {
                    include: {
                        model: TaskListTemplate,
                        where: { id: taskListID },
                    },
                });
            },
        );
    }
}

export const taskTemplateRouter = new TaskTemplateRouter();

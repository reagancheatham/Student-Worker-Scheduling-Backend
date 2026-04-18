import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Request, Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";
import {
    businessAuth,
    BusinessResolver,
} from "../authorization/businessAuthorization.ts";

export class TaskListTemplate extends Model<
    InferAttributes<TaskListTemplate>,
    InferCreationAttributes<TaskListTemplate>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare name: string;
}

TaskListTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["businessID", "name"],
            },
        ],
    },
);

const idResolver: BusinessResolver = async (req: Request) => {
    const id = req.params?.id;

    if (!id) return undefined;

    const taskListTemplate = await TaskListTemplate.findOne({ where: { id } });

    return taskListTemplate?.businessID;
};

class TaskListTemplateRouter extends ModelRouter {
    public path(): string {
        return "/taskListTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", businessAuth(), (req, res) =>
            ScheduleDatabase.create(TaskListTemplate, req, res),
        );
        router.put("/", businessAuth(), (req, res) =>
            ScheduleDatabase.update(TaskListTemplate, req, res, "id"),
        );
        router.delete("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.delete(TaskListTemplate, req, res, "id"),
        );
        router.get("/:id", businessAuth(idResolver), (req, res) =>
            ScheduleDatabase.get(TaskListTemplate, req, res, "id"),
        );
        router.get("/business/:businessID", businessAuth(), (req, res) =>
            ScheduleDatabase.getAllWhere(
                TaskListTemplate,
                req,
                res,
                {},
                "businessID",
            ),
        );
    }
}

export const taskListTemplateRouter = new TaskListTemplateRouter();

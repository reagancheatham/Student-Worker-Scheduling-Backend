import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { ModelRouter } from "../classes/databaseModel.ts";
import { Router } from "express";
import { ScheduleDatabase } from "../classes/scheduleDatabase.ts";

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
            onDelete: "CASCADE"
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

class TaskListTemplateRouter extends ModelRouter {
    public path(): string {
        return "/taskListTemplates";
    }

    protected buildRouter(router: Router): void {
        router.post("/", (req, res) =>
            ScheduleDatabase.create(TaskListTemplate, req, res),
        );
        router.put("/", (req, res) =>
            ScheduleDatabase.update(
                TaskListTemplate,
                req,
                res,
                "id",
            ),
        );
        router.delete("/:id", (req, res) =>
            ScheduleDatabase.delete(
                TaskListTemplate,
                req,
                res,
                "id",
            ),
        );
        router.get("/:id", (req, res) =>
            ScheduleDatabase.get(
                TaskListTemplate,
                req,
                res,
                "id",
            ),
        );
        router.get("/business/:businessID", (req, res) =>
            ScheduleDatabase.getAllWhere(
                TaskListTemplate,
                req,
                res,
                "businessID",
            ),
        );
    }
}

export const taskListTemplateRouter = new TaskListTemplateRouter();

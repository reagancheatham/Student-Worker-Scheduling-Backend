import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { TaskListTemplate } from "./taskListTemplate.model.ts";

export class TaskTemplate extends Model<
    InferAttributes<TaskTemplate>,
    InferCreationAttributes<TaskTemplate>
> {
    declare taskListTemplateID: number;
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string;
}

TaskTemplate.init(
    {
        taskListTemplateID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: TaskListTemplate,
                key: "id",
            },
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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

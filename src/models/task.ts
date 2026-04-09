import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { TaskList } from "./taskList.ts";

export class Task extends Model<
    InferAttributes<Task>,
    InferCreationAttributes<Task>
> {
    declare id: CreationOptional<number>;
    declare taskListID: number;
    declare listOrder: number;
    declare name: string;
    declare description: string;
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
            onDelete: "CASCADE",
        },
        listOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ["name", "taskListID", "listOrder", "description"],
            },
        ],
    },
);

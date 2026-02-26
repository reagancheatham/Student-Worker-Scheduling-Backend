import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { TaskList } from "./taskList.model.ts";
import { TaskStatus } from "../classes/taskStatus.ts";

export class Task extends Model<
    InferAttributes<Task>,
    InferCreationAttributes<Task>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare completeStatus: TaskStatus;
    declare taskListID: number;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completeStatus: {
            type: DataTypes.ENUM(...Object.values(TaskStatus)),
            allowNull: false,
        },
        taskListID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: TaskList,
                key: "id",
            },
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

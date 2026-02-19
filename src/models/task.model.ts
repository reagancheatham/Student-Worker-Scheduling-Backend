import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import { TaskStatus } from "../util/TaskStatus.ts";
import { TaskList } from "./taskList.model.ts";

export class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
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
        tableName: "Task",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["name", "completeStatus", "taskListID"],
            },
        ],
    },
);


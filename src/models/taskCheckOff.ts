import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Task } from "./task.ts";
import { Employee } from "./employee.ts";

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

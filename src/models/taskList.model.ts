import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import {Business} from "./business.model.ts";

export class TaskList extends Model<InferAttributes<TaskList>, InferCreationAttributes<TaskList>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare businessID: number;
}

TaskList.init(
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
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "TaskList",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["name", "businessID"],
            },
        ],
    },
);


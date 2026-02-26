import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";

export class TaskListTemplate extends Model<
    InferAttributes<TaskListTemplate>,
    InferCreationAttributes<TaskListTemplate>
> {
    declare businessID: number;
    declare id: CreationOptional<number>;
    declare name: string;
}

TaskListTemplate.init(
    {
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
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

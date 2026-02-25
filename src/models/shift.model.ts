import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { TaskList } from "./taskList.model.ts";
import { Employee } from "./employee.model.ts";
import { Business } from "./business.model.ts";

export class Shift extends Model<
    InferAttributes<Shift>,
    InferCreationAttributes<Shift>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
    declare employeeID: number;
}

Shift.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        businessID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Business,
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
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
                fields: ["startTime", "endTime", "taskListID", "employeeID"],
            },
        ],
    },
);

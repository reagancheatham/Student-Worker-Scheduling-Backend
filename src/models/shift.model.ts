import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import { TaskList } from "./taskList.model.ts";
import { Employee } from "./employee.model.ts";

export class Shift extends Model<
    InferAttributes<Shift>,
    InferCreationAttributes<Shift>
> {
    declare id: CreationOptional<number>;
    declare startTime: Date;
    declare endTime: Date;
    declare taskListID: number;
    declare employeeID: number;
}

Shift.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
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
        tableName: "Shift",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["startTime", "endTime", "taskListID", "employeeID"],
            },
        ],
    },
);

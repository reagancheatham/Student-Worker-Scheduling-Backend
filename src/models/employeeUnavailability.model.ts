import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.model.ts";

export class EmployeeUnavailability extends Model<
    InferAttributes<EmployeeUnavailability>,
    InferCreationAttributes<EmployeeUnavailability>
> {
    declare id: CreationOptional<number>;
    declare employeeID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
}

EmployeeUnavailability.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Employee,
                key: "id",
            },
            onDelete: "CASCADE",
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
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["id", "employeeID", "startTime", "endTime"],
            },
        ],
    },
);

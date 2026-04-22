import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";

export class EmployeeUnavailability extends Model<
    InferAttributes<EmployeeUnavailability>,
    InferCreationAttributes<EmployeeUnavailability>
> {
    declare id: CreationOptional<number>;
    declare employeeID: number;
    declare name: string;
    declare startTime: Date;
    declare endTime: Date;
    declare term: CreationOptional<string | null>;
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
            allowNull: false,
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
        term: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["employeeID", "startTime", "endTime"],
            },
        ],
    },
);

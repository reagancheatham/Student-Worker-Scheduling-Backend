import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Employee } from "./employee.ts";
import { Role } from "./role.ts";

export class EmployeeRole extends Model<
    InferAttributes<EmployeeRole>,
    InferCreationAttributes<EmployeeRole>
> {
    declare id: CreationOptional<number>;
    declare employeeID: number;
    declare roleID: number;
}

EmployeeRole.init(
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
        roleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Role,
                key: "id",
            },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize: sequelizeInstance,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["employeeID", "roleID"],
            },
        ],
    },
);

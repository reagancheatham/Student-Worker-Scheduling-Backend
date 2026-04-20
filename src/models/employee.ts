import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { Business } from "./business.ts";
import { User } from "./user.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";

export class Employee extends Model<
    InferAttributes<Employee>,
    InferCreationAttributes<Employee>
> {
    declare id: CreationOptional<number>;
    declare businessID: number;
    declare userID: number;
    declare businessPermissionRoleID: number;
}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        businessPermissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: BusinessPermissionRole,
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
                fields: ["businessID", "userID"],
                name: "employeeIndex",
            },
        ],
    },
);

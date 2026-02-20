import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeInstance from "../database/sequelizeInstance.ts";
import { Business } from "./business.model.ts";
import { PermissionRole } from "./permissionRole.model.ts";
import { Role } from "./role.model.ts";
import { User } from "./user.model.ts";

export class Employee extends Model<
    InferAttributes<Employee>,
    InferCreationAttributes<Employee>
> {
    declare id: CreationOptional<number>;
    declare userID: number;
    declare businessID: number;
    declare permissionRoleID: number;
    declare roleID: number | null;
    declare studentID: number | null;
    declare hourlyPayRate: number | null;
}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        businessID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
        },
        permissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: PermissionRole,
                key: "id",
            },
        },
        roleID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Role,
                key: "id",
            },
        },
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        hourlyPayRate: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "employee",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: [
                    "userID",
                    "businessID",
                    "permissionRoleID",
                    "roleID",
                    "studentID",
                    "hourlyPayRate",
                ],
                name: "employeeIndex",
            },
        ],
    },
);

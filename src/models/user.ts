import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";
import { PermissionRole } from "./permissionRole.ts";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare studentID: number;
    declare permissionRoleID: number;
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare phoneNumber: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        permissionRoleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: PermissionRole,
                key: "id",
            },
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
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
                name: "user_index",
                fields: [
                    "studentID",
                    "permissionRoleID",
                    "firstName",
                    "lastName",
                ],
            },
        ],
    },
);

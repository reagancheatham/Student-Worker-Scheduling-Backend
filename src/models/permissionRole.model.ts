import { Model, DataTypes } from "sequelize";
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import { sequelizeInstance } from "../config/sequelizeInstance.ts";

export class PermissionRole extends Model<
    InferAttributes<PermissionRole>,
    InferCreationAttributes<PermissionRole>
> {
    declare id: CreationOptional<number>;
    declare name: string;
}

PermissionRole.init(
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
    },
    {
        sequelize: sequelizeInstance,
        tableName: "permissionRoles",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["id, name"],
            },
        ],
    },
);
